import { useSearchAlbums } from "@/hooks/use-search";

type AlbumsProps = {
	query: string;
};

export function Albums({ query }: AlbumsProps) {

	const { data, isLoading } = useSearchAlbums(query);

	if(isLoading || !data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{data.items.map((album) => (
				<div key={album.id} className="flex items-center gap-3 py-1">
					<div className="flex-1 min-w-0">
						<div className="text-sm text-foreground truncate">{album.title}</div>
						{album.artists.map((artist) => (
							<div key={artist.id} className="text-xs text-muted truncate">{artist.name}</div>
						))}
					</div>
				</div>
			))}
		</div>
	);
}
