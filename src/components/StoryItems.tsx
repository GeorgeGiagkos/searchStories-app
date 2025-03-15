import { List, ListItem, ListItemText } from '@mui/material';
import { Story } from '../api/storiesApi';

type Props = {
	stories: Story[];
	onSelectStory: (story: Story) => void;
};

export default function StoryItems({ stories, onSelectStory }: Props) {
	return (
		<List sx={{ width: '650px' }}>
			{stories.map((story) => (
				<ListItem key={story.objectID} onClick={() => onSelectStory(story)}>
					{story.title && (
						<ListItemText
							primary={story.title}
							secondary={`${story.points} points | by ${story.author} | ${story.num_comments} comments`}
						/>
					)}
				</ListItem>
			))}
		</List>
	);
}
