import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { getArtistDetail } from "@/api";
import { ARTWORK_SIZES, artworkUrl } from "@/api/images";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Tabs } from "@/components/ui/tabs";
import { getArtistTracks, getSimilarArtists } from "@/api/metadata";
import { Track } from "@/components/player-ui/track";
import { ArtistCard } from "@/components/artist-card";
import { MediaCard } from "@/components/media-card";
import { ShowMore } from "@/components/ui/show-more";

const INITIAL_TRACKS = 5;
const INITIAL_ALBUMS = 4;

export default function ArtistPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const [showAllTracks, setShowAllTracks] = useState(false);
	const [showAllAlbums, setShowAllAlbums] = useState(false);

	const { data, isLoading } = useQuery({
		queryKey: ["artist", id],
		queryFn: ({ signal }) =>
			Promise.all([
				getArtistDetail(id, {}, signal),
				getArtistTracks(id, {}, signal),
				getSimilarArtists(id, {}, signal),
			]),
		select: ([{ artist }, { tracks, albums }, { artists: similarArtists }]) => ({
			artist,
			tracks,
			albums: albums.items,
			similarArtists,
		}),
		enabled: !!id,
	});

	if (isLoading || !data) {
		return (
			<View className="flex flex-1 flex-col items-center justify-center bg-background">
				<View className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</View>
		);
	}

	const { artist, tracks, albums, similarArtists } = data;
	const visibleTracks = showAllTracks ? tracks : tracks.slice(0, INITIAL_TRACKS);
	const visibleAlbums = showAllAlbums ? albums : albums.slice(0, INITIAL_ALBUMS);

	return (
		<ScrollView className="flex flex-1 flex-col bg-background">
			<View className="sticky top-0 z-10 flex-row items-center gap-3 px-4 py-3 bg-background/80 backdrop-blur">
				<Pressable onPress={() => router.back()} className="text-foreground">
					<IconSymbol name="chevron.left" className="text-foreground" />
				</Pressable>
				<Text className="text-sm text-foreground font-medium" numberOfLines={1}>
					{artist.name}
				</Text>
			</View>

			<View className="flex flex-col items-center px-4 pb-4">
				<Image
					source={{ uri: artworkUrl(artist.picture, ARTWORK_SIZES.medium) }}
					className="w-48 h-48 rounded-full"
					resizeMode="cover"
				/>
				<View className="mt-3 items-center">
					<Text className="text-base text-foreground font-medium">{artist.name}</Text>
				</View>
			</View>

			<Tabs tabs={[
				{
					label: `Tracks (${tracks.length})`,
					content: tracks.length > 0 && (
						<View>
							<View className="flex flex-col">
								{visibleTracks.map((track, index) => (
									<Track key={track.id} track={track} index={index} />
								))}
							</View>
							{tracks.length > INITIAL_TRACKS && (
								<ShowMore
									expanded={showAllTracks}
									remaining={tracks.length - INITIAL_TRACKS}
									onToggle={() => setShowAllTracks((v) => !v)}
								/>
							)}
						</View>
					),
				},
				{
					label: `Albums (${albums.length})`,
					content: albums.length > 0 && (
						<View>
							<View className="grid grid-cols-2 gap-4 p-4">
								{visibleAlbums.map((album) => (
									<MediaCard
										key={album.id}
										className="gap-2 p-2 bg-orange-950/50"
										image={album.cover}
										title={album.title}
										onPress={() => router.push(`/album/${album.id}`)}
									>
										{album.releaseDate && (
											<Text className="text-[10px] text-muted">
												{album.releaseDate.slice(0, 4)}
											</Text>
										)}
									</MediaCard>
								))}
							</View>
							{albums.length > INITIAL_ALBUMS && (
								<ShowMore
									expanded={showAllAlbums}
									remaining={albums.length - INITIAL_ALBUMS}
									onToggle={() => setShowAllAlbums((v) => !v)}
								/>
							)}
						</View>
					),
				},
			]} />

			{similarArtists.length > 0 && (
				<View className="mt-4">
					<Text className="px-4 py-2 text-xs text-muted font-medium uppercase">
						Similar Artists
					</Text>
					<ScrollView horizontal className="px-4 pb-4" contentContainerClassName="gap-3">
						{similarArtists.map((a) => (
							<ArtistCard key={a.id} artist={a} />
						))}
					</ScrollView>
				</View>
			)}
		</ScrollView>
	);
}
