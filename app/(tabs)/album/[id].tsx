import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getAlbumDetail } from "@/api";
import { TrackListPage } from "@/components/track-list-page";

export default function AlbumPage() {
	const { id, title, image } = useLocalSearchParams<{
		id: string;
		title: string;
		image: string;
	}>();

	const { data, isLoading } = useQuery({
		queryKey: ["album", id],
		queryFn: ({ signal }) => getAlbumDetail(id, {}, signal),
		enabled: !!id,
	});

	
	if (!data || isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		);
	}

	const album = data.data;

	return (
		<TrackListPage
			title={album.title ?? title ?? "Album"}
			subtitle={album.releaseDate.slice(0, 4)}
			image={album.cover ?? image}
			tracks={album.items}
			id={id}
		/>
	);
}
