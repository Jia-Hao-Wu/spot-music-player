import { useEffect, useRef } from "react";
import { View } from "react-native";

export function useInfiniteScroll(
	onLoadMore: () => void,
	enabled: boolean,
) {
	const sentinelRef = useRef<View>(null);

	useEffect(() => {
		const el = sentinelRef.current;
		if (!el || !enabled) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					onLoadMore();
				}
			},
			{ threshold: 0 },
		);

		observer.observe(el as unknown as Element);
		return () => observer.disconnect();
	}, [onLoadMore, enabled]);

	return sentinelRef;
}
