import { ARTWORK_SIZES, artworkUrl } from "@/api/images";
import { useSearchAlbums } from "@/hooks/use-search";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

type AlbumsProps = {
	query: string;
};

export function Albums({ query }: AlbumsProps) {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useSearchAlbums(query);

	const sentinelRef = useInfiniteScroll(
		() => fetchNextPage(),
		!!hasNextPage && !isFetchingNextPage,
	);

	if (isLoading || !data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col gap-2">
			{data.items.map((album) => (
				<div
					key={album.id}
					className="group flex items-center gap-3 py-1 px-2 hover:bg-white/10 rounded-sm overflow-visible cursor-pointer"
				>
					<div className="flex items-center flex-1 overflow-visible">
						<span className="flex rounded-md w-12 h-12 overflow-visible mr-5 relative">
							<img
								className="rounded-md transition-transform duration-200 group-hover:scale-110 group-hover:z-10"
								src={artworkUrl(album.cover, ARTWORK_SIZES.thumbnail)}
							/>
						</span>
						<div className="min-w-0">
							<div className="text-sm text-foreground truncate">{album.title}</div>
							<div className="text-xs text-muted truncate">
								{album.artists.map((a) => a.name).join(", ")}
							</div>
						</div>
					</div>
				</div>
			))}
			<div ref={sentinelRef} className="h-1" />
			{isFetchingNextPage && <div className="text-center text-xs text-muted py-2">Loading more...</div>}
		</div>
	);
}
