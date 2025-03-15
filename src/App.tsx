import { Typography } from '@mui/material';
import SearchInputBar from './components/SearchInputBar';
import { useState } from 'react';
import { Story } from './api/storiesApi';
import SavedStoriesList from './components/SavedStoriesList';
function App() {
	const [savedStories, setSavedStories] = useState<Story[]>([]);

	// save stories in the ui
	const handleSelectStory = (story: Story) => {
		if (!savedStories.find((s) => s.objectID === story.objectID)) {
			setSavedStories((prev) => [...prev, story]);
		}
	};

	// remove stories from the ui
	const handleRemoveStory = (id: string) => {
		setSavedStories((prev) => prev.filter((s) => s.objectID !== id));
	};

	return (
		<>
			<Typography variant="h4" gutterBottom>
				Search
			</Typography>
			<SearchInputBar onSelectStory={handleSelectStory} />
			<Typography variant="h4" mt={4}>
				Saved Stories
			</Typography>
			{savedStories.length > 0 ? (
				<SavedStoriesList
					savedStories={savedStories}
					onRemoveStory={handleRemoveStory}
				/>
			) : (
				<Typography variant="body1" mt={1}>
					No saved stories yet.
				</Typography>
			)}
		</>
	);
}

export default App;
