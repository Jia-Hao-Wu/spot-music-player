import { useLocalSearchParams } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import { ARTWORK_SIZES, artworkUrl } from "@/api";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BackHeader } from "@/components/ui/back-header";
import { Track } from "@/components/player-ui/track";
import { PausePlayButton } from "@/components/player-ui/pause-play-button";
import { usePlayer } from "@/contexts/player-context";
import { usePlaylistStorage } from "@/contexts/playlist-storage";

export default function LocalPlaylistPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { removeTrack, getPlaylist } = usePlaylistStorage();
	const { isPlaying, replaceQueue, currentListId } = usePlayer();

	const playlist = getPlaylist(id);

	if (!playlist) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-sm text-muted">Playlist not found</Text>
			</View>
		);
	}

	const localListId = `local:${playlist.id}`;

	const uniqueCovers = playlist.tracks.map((track) => track.artwork);

	return (
		<ScrollView className="flex flex-1 flex-col bg-background">
			<BackHeader />

			<View className="flex flex-col items-center px-4 pb-4">
				<View className="w-48 h-48 rounded-md bg-player-surface items-center justify-center overflow-hidden">
					{uniqueCovers.length >= 4 ? (
						<View className="grid grid-cols-2 grid-rows-2 w-48 h-48">
							{uniqueCovers.slice(0, 4).map((cover, i) => (
								<Image
									key={i}
									source={{ uri: artworkUrl(cover, ARTWORK_SIZES.medium) }}
									className="w-24 h-24"
								/>
							))}
						</View>
					) : uniqueCovers.length > 0 ? (
						<Image
							source={{ uri: artworkUrl(uniqueCovers[0], ARTWORK_SIZES.medium) }}
							className="w-48 h-48"
							resizeMode="cover"
						/>
					) : (
						<IconSymbol name="music.note" size={64} className="text-muted" />
					)}
				</View>
				<View className="mt-3 items-center">
					<Text className="text-base text-foreground font-medium">{playlist.name}</Text>
					<Text className="text-xs text-muted">
						{playlist.tracks.length} track{playlist.tracks.length !== 1 ? "s" : ""}
					</Text>
				</View>
				{playlist.tracks.length > 0 && (
					<View className="mt-5">
						<PausePlayButton
							isPlaying={isPlaying && localListId === currentListId}
							onPress={() =>
								replaceQueue(
									playlist.tracks,
									localListId,
								)
							}
						/>
					</View>
				)}
			</View>

			<View className="flex flex-col">
				{playlist.tracks.map((track, index) => (
					<Track
						key={`${track.id}-${index}`}
						track={track}
						index={index}
						actions={
							<Pressable
								onPress={() => removeTrack(playlist.id, index)}
								hitSlop={8}
							>
								<IconSymbol name="xmark" size={14} className="text-muted" />
							</Pressable>
						}
					/>
				))}
			</View>
		</ScrollView>
	);
}
