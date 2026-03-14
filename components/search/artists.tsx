import { View } from "react-native";
import { useSearchArtists } from "@/hooks/use-search";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { ArtistCard } from "@/components/artist-card";

type ArtistsProps = {
	query: string;
};

export function Artists({ query }: ArtistsProps) {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchArtists(query);
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
		<View className="flex flex-col gap-2">
			{data.items.map((artist) => (
				<ArtistCard key={artist.id} artist={artist} variant="row" />
			))}
			<View ref={sentinelRef} className="h-1" />
		</View>
	);
}
