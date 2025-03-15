export type Story = {
	title: string;
	author: string;
	num_comments: number;
	points: number;
	objectID: string;
};

export async function fetchStories(query: string): Promise<Story[]> {
	const url = `https://hn.algolia.com/api/v1/search?query=${query}`;
	const response = await fetch(url);
	const data: { hits: Story[] } = await response.json();
	return data.hits;
}
