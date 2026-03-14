import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSearchAlbums } from "@/hooks/use-search";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { MediaCard } from "@/components/media-card";

type AlbumsProps = {
	query: string;
};

export function Albums({ query }: AlbumsProps) {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchAlbums(query);

	const router = useRouter();
	const sentinelRef = useInfiniteScroll(
		() => fetchNextPage(),
		!!hasNextPage && !isFetchingNextPage,
	);

	if (isLoading || !data) {
		return (
			<View className="flex items-center justify-center py-12">
				<View className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
			</View>
		);
	}

	return (
		<View className="grid grid-cols-2 gap-4 p-4">
			{data.items.map((album) => (
				<MediaCard
					key={album.id}
					className="gap-3 p-2 bg-orange-950/50"
					image={album.cover}
					title={album.title}
					onPress={() => router.push({ pathname: "/album/[id]", params: { id: String(album.id), title: album.title, image: album.cover } })}
				>
					<Text className="text-[10px] text-muted" numberOfLines={1}>{album.artists.map((artist) => artist.name).join(", ")}</Text>
					<Text className="text-[10px] text-muted">{album.numberOfTracks} tracks</Text>
				</MediaCard>
			))}
			<View ref={sentinelRef} className="h-1" />
		</View>
	);
}
