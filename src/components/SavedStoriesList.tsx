import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Story } from '../api/storiesApi';

type Props = {
	savedStories: Story[];
	onRemoveStory: (id: string) => void;
};

export default function SavedStoriesList({
	savedStories,
	onRemoveStory,
}: Props) {
	return (
		<>
			<List>
				{savedStories.map((story) => (
					<ListItem
						key={story.objectID}
						secondaryAction={
							<IconButton
								edge="end"
								aria-label={`delete-icon-${story.objectID}`}
								onClick={() => onRemoveStory(story.objectID)}
							>
								<DeleteIcon />
							</IconButton>
						}
					>
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
