import { Typography } from '@mui/material';
import SearchInputBar from './components/SearchInputBar';
import { useState } from 'react';
import { Story } from './api/storiesApi';
import SavedStoriesList from './components/SavedStoriesList';
function App() {
	const [savedStories, setSavedStories] = useState<Story[]>([]);

	const handleSelectStory = (story: Story) => {
		if (!savedStories.find((s) => s.objectID === story.objectID)) {
			setSavedStories((prev) => [...prev, story]);
		}
	};

	return (
		<>
			<Typography variant="h4" gutterBottom>
				Search
			</Typography>
			<SearchInputBar onSelectStory={handleSelectStory} />
			<Typography variant="h4" gutterBottom>
				Saved Stories
			</Typography>
			<SavedStoriesList savedStories={savedStories} />
		</>
	);
}

export default App;
