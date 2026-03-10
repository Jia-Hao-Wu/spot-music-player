import { useSearchPlaylists } from "@/hooks/use-search";

type PlaylistsProps = {
	query: string;
};

export function Playlists({ query }: PlaylistsProps) {

	const { data, isLoading } = useSearchPlaylists(query);

	if(isLoading || !data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{data.items.map((playlist) => (
				<div key={playlist.uuid} className="flex items-center gap-3 py-1">
					<div className="flex-1 min-w-0">
						<div className="text-sm text-foreground truncate">{playlist.title}</div>
						<div className="text-xs text-muted truncate">{playlist.numberOfTracks} tracks</div>
					</div>
				</div>
			))}
		</div>
	);
}
