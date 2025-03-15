import '@testing-library/jest-dom';
import {
	render,
	screen,
	fireEvent,
	waitFor,
	act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, expect } from 'vitest';
import SearchInputBar from '../SearchInputBar';
import { fetchStories, Story } from '../../api/storiesApi';
import { CircularProgress } from '@mui/material';
import StoryItems from '../StoryItems';

// Mocking fetchStories API
vi.mock('../../api/storiesApi', () => ({
	fetchStories: vi.fn().mockResolvedValue([
		{
			title: 'Story 1',
			author: 'Author 1',
			num_comments: 10,
			points: 100,
			objectID: '1',
		},
		{
			title: 'Story 2',
			author: 'Author 2',
			num_comments: 20,
			points: 200,
			objectID: '2',
		},
	]),
}));

describe('SearchInputBar', () => {
	const onSelectStory = vi.fn();

	beforeEach(() => {
		onSelectStory.mockClear();
	});

	it('renders the search input field', () => {
		// Render the component
		render(<SearchInputBar onSelectStory={() => {}} />);
		expect(screen.getByLabelText(/Search/i)).toBeInTheDocument();
	});

	it('calls onSelectStory when a story is selected', async () => {
		// Ensures the onSelectStory is called when a story is clicked
		render(<SearchInputBar onSelectStory={onSelectStory} />);

		// Simulate typing
		fireEvent.change(screen.getByLabelText(/Search/i), {
			target: { value: 'React' },
		});

		// Wait for the mock data to load
		await waitFor(() =>
			expect(screen.getByText('Story 1')).toBeInTheDocument()
		);

		fireEvent.click(screen.getByText('Story 1'));

		expect(onSelectStory).toHaveBeenCalledWith({
			title: 'Story 1',
			author: 'Author 1',
			num_comments: 10,
			points: 100,
			objectID: '1',
		});
	});

	it('does not fetch stories if query length is less than 3', async () => {
		render(<SearchInputBar onSelectStory={onSelectStory} />);

		// Simulate typing
		fireEvent.change(screen.getByLabelText(/Search/i), {
			target: { value: 'Ra' },
		});

		// Wait for debounce to finish
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for debounce timeout
		});

		// Verify that fetchStories was called
		expect(vi.mocked(fetchStories)).toHaveBeenCalled();
		expect(onSelectStory).not.toHaveBeenCalled();
	});

	it('fetches stories if query length is 3 or more', async () => {
		render(<SearchInputBar onSelectStory={onSelectStory} />);

		// Simulate typing a query with length >= 3
		await userEvent.type(screen.getByLabelText(/Search/i), 'Rea');

		// Wait for debounce to finish and to avoid multiple calls
		await act(async () => {
			// Adjusting the timeout to ensure debounce finishes
			await new Promise((resolve) => setTimeout(resolve, 600));
		});

		// Verify that fetchStories was called by passing 3 characters
		expect(vi.mocked(fetchStories)).toHaveBeenCalledWith('Rea');
		expect(onSelectStory).not.toHaveBeenCalled();
	});

	it('shows the loading indicator while fetching stories', async () => {
		// Verifies the spinner is shown while fetching stories
		render(<SearchInputBar onSelectStory={onSelectStory} />);

		fireEvent.change(screen.getByLabelText(/Search/i), {
			target: { value: 'React' },
		});

		render(<CircularProgress />);
		// Ensure loading spinner appears
		await waitFor(() => {
			expect(screen.queryByRole('progressbar')).toBeInTheDocument();
		});

		// Wait for debounce and fetch completion
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 600));
		});
	});

	it('renders fetched stories', async () => {
		// Verifies that stories are rendered after being fetched
		render(<SearchInputBar onSelectStory={onSelectStory} />);

		await userEvent.type(screen.getByLabelText(/Search/i), 'React');

		// Wait for the debounce and data loading
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 600));
		});

		expect(await screen.findByText(/Story 1/i)).toBeInTheDocument();
	});

	it('calls onSelectStory when a story is clicked', async () => {
		// Verifies that onSelectStory is called when a story is clicked

		render(<SearchInputBar onSelectStory={onSelectStory} />);

		await userEvent.type(screen.getByLabelText(/Search/i), 'React');

		// Wait for the debounce and data loading
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 600));
		});

		const storyItem = await screen.findByText(/Story 1/i);
		await userEvent.click(storyItem);

		expect(onSelectStory).toHaveBeenCalledTimes(1);
		expect(onSelectStory).toHaveBeenCalledWith(
			expect.objectContaining({
				title: 'Story 1',
				objectID: '1',
			})
		);
	});
});

describe('StoryItems', () => {
	it('renders stories and handles clicks', () => {
		const stories: Story[] = [
			{
				objectID: '1',
				title: 'Story 1',
				points: 100,
				author: 'author1',
				num_comments: 20,
			},
		];

		const onSelectStory = vi.fn();
		render(<StoryItems stories={stories} onSelectStory={onSelectStory} />);

		expect(screen.getByText(/Story 1/i)).toBeInTheDocument();
	});

	it('renders no stories when list is empty', () => {
		render(<StoryItems stories={[]} onSelectStory={vi.fn()} />);
		expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
	});
});
