import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getPlaylistDetail, getTrackStream } from "@/api";
import { ARTWORK_SIZES, artworkUrl } from "@/api/images";
import { usePlayer } from "@/contexts/player-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function PlaylistPage() {
	const { id, title, image } = useLocalSearchParams<{ id: string; title: string; image: string }>();
	const router = useRouter();
	const { currentTrack, isPlaying, enQueue } = usePlayer();

	const { data, isLoading } = useQuery({
		queryKey: ["playlist", id],
		queryFn: ({ signal }) => getPlaylistDetail(id, {}, signal),
		enabled: !!id,
	});

	if (isLoading || !data) {
		return (
			<div className="flex flex-1 flex-col bg-background overflow-y-auto">
				<div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur">
					<button onClick={() => router.back()} className="text-foreground">
						<IconSymbol name="chevron.left" color="var(--color-foreground)" />
					</button>
					<span className="text-sm text-foreground font-medium truncate">{title ?? "Playlist"}</span>
				</div>
				<div className="flex flex-col items-center px-4 pb-4">
					{image && (
						<img
							src={artworkUrl(image, ARTWORK_SIZES.large)}
							className="w-48 h-48 rounded-md object-contain"
						/>
					)}
				</div>
				<div className="flex items-center justify-center py-12">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
				</div>
			</div>
		);
	}

	const playlist = data;

	return (
		<div className="flex flex-1 flex-col bg-background overflow-y-auto">
			<div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur">
				<button onClick={() => router.back()} className="text-foreground">
					<IconSymbol name="chevron.left" color="var(--color-foreground)" />
				</button>
				<span className="text-sm text-foreground font-medium truncate">{playlist.title}</span>
			</div>

			<div className="flex flex-col items-center px-4 pb-4">
				<img
					src={artworkUrl(playlist.squareImage ?? playlist.image ?? image, ARTWORK_SIZES.large)}
					className="w-48 h-48 rounded-md object-contain"
				/>
				<div className="mt-3 text-center">
					<div className="text-base text-foreground font-medium">{playlist.title}</div>
					<div className="text-xs text-muted">{playlist.numberOfTracks} tracks</div>
				</div>
			</div>

			<div className="flex flex-col">
				{playlist.items.map(({ item: track }, index) => (
					<div
						key={track.id}
						className="group flex items-center gap-3 py-2 px-4 hover:bg-white/10 cursor-pointer"
						onClick={async () => {
							enQueue({
								id: track.id,
								title: track.title,
								artist: track.artist.name,
								album: track.album?.title,
								artwork: artworkUrl(track.album?.cover, ARTWORK_SIZES.thumbnail),
								uri: await getTrackStream(track.id),
								tidalId: track.id,
								duration: track.duration,
							});
						}}
					>
						<span className="w-6 text-xs text-muted text-right">{index + 1}</span>
						<div className="flex-1 min-w-0">
							<div className="text-sm text-foreground truncate">{track.title}</div>
							<div className="text-xs text-muted truncate">{track.artist.name}</div>
						</div>
						<div className="text-xs text-muted">
							{Math.floor(track.duration / 60)}:
							{(track.duration % 60).toString().padStart(2, "0")}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
