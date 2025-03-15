import { List, ListItem, ListItemText } from '@mui/material';
import { Story } from '../api/storiesApi';

type Props = {
	stories: Story[];
};

export default function StoryItems({ stories }: Props) {
	return (
		<List>
			{stories.map((story) => (
				<ListItem key={story.objectID}>
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
