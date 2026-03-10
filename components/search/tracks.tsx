import { useSearchTracks } from "@/hooks/use-search";

type TracksProps = {
	query: string;
};

export function Tracks({ query }: TracksProps) {

	const { data, isLoading } = useSearchTracks(query);

	if(isLoading || !data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{data.items.map((track) => (
				<div key={track.id} className="flex items-center gap-3 py-1">
					<div className="flex-1 min-w-0">
						<div className="text-sm text-foreground truncate">{track.title}</div>
						<div className="text-xs text-muted truncate">{track.artist.name}</div>
					</div>
				</div>
			))}
		</div>
	);
}
