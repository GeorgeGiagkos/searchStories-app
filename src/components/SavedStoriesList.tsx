import { List, ListItem, ListItemText } from '@mui/material';
import { Story } from '../api/storiesApi';

type Props = {
	savedStories: Story[];
};

export default function SavedStoriesList({ savedStories }: Props) {
	return (
		<>
			<List>
				{savedStories.map((story) => (
					<ListItem key={story.objectID}>
						<ListItemText
							primary={story.title}
							secondary={`${story.points} points | ${story.author} author | ${story.num_comments} comments`}
						/>
					</ListItem>
				))}
			</List>
		</>
	);
}
