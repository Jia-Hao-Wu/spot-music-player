import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistDetail } from "@/api";
import { TrackListPage } from "@/components/track-list-page";

export default function PlaylistPage() {
	const { id, title, image } = useLocalSearchParams<{
		id: string;
		title: string;
		image: string;
	}>();

	const { data, isLoading } = useQuery({
		queryKey: ["playlist", id],
		queryFn: ({ signal }) => getPlaylistDetail(id, {}, signal),
		enabled: !!id,
	});

	if (!data || isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		);
	}

	const { playlist, items} = data;

	return (
		<TrackListPage
			title={playlist.title ?? title ?? "Playlist"}
			subtitle={playlist ? `${playlist.numberOfTracks} tracks` : undefined}
			image={playlist.squareImage ?? playlist.image ?? image}
			tracks={items ?? []}
			id={id}
		/>
	);
}
