import { ARTWORK_SIZES, artworkUrl, getTrackStream } from "@/api";
import { usePlayer } from "@/contexts/player-context";
import { IconSymbol } from "../ui/icon-symbol";
import { TrackMeta } from "@/api/metadata";

export type TrackProps = {
	track: TrackMeta;
	showImage: boolean;
};

export function Track({ track, showImage = false }: TrackProps) {
	const { currentTrack, isPlaying, enQueue } = usePlayer();

	return (
		<div
			key={track.id}
			className={`group flex items-center gap-3 py-3 px-5 hover:bg-white/10 rounded-sm overflow-visible cursor-pointer ${currentTrack?.id === track.id ? "bg-accent" : ""}`}
			onClick={async () => {
				enQueue({
					id: track.id,
					title: track.title,
					artist: track.artist,
					album: track.album?.title,
					artwork: artworkUrl(track.album.cover, ARTWORK_SIZES.thumbnail),
					uri: await getTrackStream(track.id),
					tidalId: track.id,
					duration: track.duration,
				});
			}}
		>
			<div className="flex items-center flex-1 overflow-visible">
				{showImage && (
					<span className="flex rounded-md w-12 h-12 overflow-visible mr-5 relative">
						<img
							className={`rounded-md transition-transform duration-200 group-hover:scale-110 group-hover:z-10 ${currentTrack?.id === track.id ? "scale-110 z-10" : ""}`}
							src={artworkUrl(track.album.cover, ARTWORK_SIZES.thumbnail)}
						/>
						<div className="bg-transparent group-hover:bg-black/30 transition-colors z-20 absolute h-full w-full flex items-center justify-center">
							<IconSymbol
								className="m-auto"
								name={
									currentTrack?.id === track.id && isPlaying ? "pause.fill" : "play.fill"
								}
								color="var(--color-foreground)"
							/>
						</div>
					</span>
				)}
				<div className="min-w-0">
					<div className="text-sm text-foreground truncate">{track.title}</div>
					<div className="text-xs text-muted truncate">{track.artist.name}</div>
				</div>
			</div>
			<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<div className="text-xs text-muted">
					{Math.floor(track.duration / 60)}:
					{(track.duration % 60).toString().padStart(2, "0")}
				</div>
			</div>
		</div>
	);
}
