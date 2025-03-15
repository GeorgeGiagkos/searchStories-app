import '@testing-library/jest-dom';
import { vi, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Story } from '../../api/storiesApi';
import SavedStoriesList from '../SavedStoriesList';

const onRemoveStory = vi.fn();

describe('SavedStoriesList', () => {
	// Test data for saved stories
	const savedStories: Story[] = [
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
	];

	it('renders saved stories correctly', () => {
		// Render the SavedStoriesList with test data
		render(
			<SavedStoriesList
				savedStories={savedStories}
				onRemoveStory={onRemoveStory}
			/>
		);

		// Ensure both stories are rendered
		expect(screen.getByText('Story 1')).toBeInTheDocument();
		expect(screen.getByText('Story 2')).toBeInTheDocument();

		// Ensure additional information like points and comments is displayed
		expect(
			screen.getByText('100 points | Author 1 author | 10 comments')
		).toBeInTheDocument();
		expect(
			screen.getByText('200 points | Author 2 author | 20 comments')
		).toBeInTheDocument();
	});

	it('calls onRemoveStory when delete button is clicked', () => {
		// Render the SavedStoriesList with test data
		render(
			<SavedStoriesList
				savedStories={savedStories}
				onRemoveStory={onRemoveStory}
			/>
		);

		// Simulate clicking the delete button for "Story 1"
		fireEvent.click(screen.getByLabelText('delete-icon-1'));

		// Ensure onRemoveStory is called with the correct id
		expect(onRemoveStory).toHaveBeenCalledTimes(1);
		expect(onRemoveStory).toHaveBeenCalledWith('1');
	});

	it('renders no stories when the list is empty', () => {
		// Render SavedStoriesList with an empty list
		render(
			<SavedStoriesList savedStories={[]} onRemoveStory={onRemoveStory} />
		);

		// Ensure no list items are rendered
		expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
	});

	it('renders the delete icon for each saved story', () => {
		// Render SavedStoriesList with test data
		render(
			<SavedStoriesList
				savedStories={savedStories}
				onRemoveStory={onRemoveStory}
			/>
		);

		// Ensure delete buttons are rendered for each story
		const deleteButtons = screen.getAllByRole('button');
		expect(deleteButtons).toHaveLength(2); // Should be 2 buttons, one for each story

		// Check the button labels (delete icon)
		expect(deleteButtons[0]).toHaveAccessibleName('delete-icon-1');
		expect(deleteButtons[1]).toHaveAccessibleName('delete-icon-2');
	});
});
