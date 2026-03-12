import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getArtistDetail, getTrackStream } from "@/api";
import { ARTWORK_SIZES, artworkUrl } from "@/api/images";
import { usePlayer } from "@/contexts/player-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function ArtistPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const { enQueue } = usePlayer();

	const { data, isLoading } = useQuery({
		queryKey: ["artist", id],
		queryFn: ({ signal }) => getArtistDetail(id, signal),
		enabled: !!id,
	});

	if (isLoading || !data) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center bg-background">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col bg-background overflow-y-auto">
			<div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur">
				<button onClick={() => router.back()} className="text-foreground">
					<IconSymbol name="chevron.left" color="var(--color-foreground)" />
				</button>
				<span className="text-sm text-foreground font-medium truncate">{data.name}</span>
			</div>

			<div className="flex flex-col items-center px-4 pb-4">
				<img
					src={artworkUrl(data.picture, ARTWORK_SIZES.large)}
					className="w-48 h-48 rounded-full object-cover"
				/>
				<div className="mt-3 text-center">
					<div className="text-base text-foreground font-medium">{data.name}</div>
				</div>
			</div>

			{data.tracks && data.tracks.length > 0 && (
				<div>
					<div className="px-4 py-2 text-xs text-muted font-medium uppercase">Top Tracks</div>
					<div className="flex flex-col">
						{data.tracks.map((track, index) => (
							<div
								key={track.id}
								className="group flex items-center gap-3 py-2 px-4 hover:bg-white/10 cursor-pointer"
								onClick={async () => {
									enQueue({
										id: track.id,
										title: track.title,
										artist: data.name,
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
									<div className="text-xs text-muted truncate">{track.album?.title}</div>
								</div>
								<div className="text-xs text-muted">
									{Math.floor(track.duration / 60)}:
									{(track.duration % 60).toString().padStart(2, "0")}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{data.albums && data.albums.length > 0 && (
				<div>
					<div className="px-4 py-2 text-xs text-muted font-medium uppercase">Albums</div>
					<div className="grid grid-cols-2 gap-2 px-4">
						{data.albums.map((album) => (
							<div
								key={album.id}
								className="group flex flex-col items-start gap-2 p-2 bg-orange-950/50 rounded-sm overflow-visible cursor-pointer"
								onClick={() => router.push(`/album/${album.id}`)}
							>
								<div className="flex rounded-md overflow-visible relative">
									<img
										src={artworkUrl(album.cover, ARTWORK_SIZES.medium)}
										className="rounded-md object-contain"
									/>
								</div>
								<div className="min-w-0 w-full">
									<div className="text-xs text-foreground truncate">{album.title}</div>
									{album.releaseDate && (
										<div className="text-[0.6rem] text-muted">{album.releaseDate.slice(0, 4)}</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
