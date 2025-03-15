import { TextField, CircularProgress, debounce } from '@mui/material';
import { fetchStories, Story } from '../api/storiesApi';
import { useState } from 'react';
import StoryItems from './StoryItems';

type Props = {
	onSelectStory: (story: Story) => void;
};

export default function SearchInputBar({ onSelectStory }: Props) {
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const debouncedStories = debounce(async (query: string) => {
		if (query.length < 3) {
			return;
		}
		setLoading(true);
		try {
			const results = await fetchStories(query);
			setStories(results);
		} catch (error) {
			console.error('Error fetching stories:', error);
		} finally {
			setLoading(false);
		}
	}, 500);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		debouncedStories(value);
	};

	return (
		<>
			<TextField
				label="Search Title"
				variant="outlined"
				fullWidth
				onChange={handleChange}
			/>
			{loading && <CircularProgress />}
			{stories.length > 0 && (
				<StoryItems stories={stories} onSelectStory={onSelectStory} />
			)}
		</>
	);
}
