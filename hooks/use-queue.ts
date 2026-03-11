import { useCallback, useRef, useState } from "react";

export interface Queue<T> {
	items: T[];
	current: T | null;
	currentIndex: number;
	set: (items: T[]) => void;
	enqueue: (...items: T[]) => void;
	next: () => T | null;
	previous: () => T | null;
	jumpTo: (index: number) => T | null;
	clear: () => void;
	isEmpty: boolean;
	size: number;
}

export function useQueue<T>(initial: T[] = []): Queue<T> {
	const [items, setItems] = useState<T[]>(initial);
	const [currentIndex, setCurrentIndex] = useState(0);
	const indexRef = useRef(0);

	const syncIndex = (i: number) => {
		indexRef.current = i;
		setCurrentIndex(i);
	};

	const current = items.length > 0 ? items[currentIndex] ?? null : null;

	const set = useCallback((newItems: T[]) => {
		setItems(newItems);
		syncIndex(0);
	}, []);

	const enqueue = useCallback((...newItems: T[]) => {
		setItems((prev) => [...prev, ...newItems]);
	}, []);

	const next = useCallback((): T | null => {
		let result: T | null = null;
		setItems((prev) => {
			if (prev.length === 0) return prev;
			const nextIdx = (indexRef.current + 1) % prev.length;
			syncIndex(nextIdx);
			result = prev[nextIdx];
			return prev;
		});
		return result;
	}, []);

	const previous = useCallback((): T | null => {
		let result: T | null = null;
		setItems((prev) => {
			if (prev.length === 0) return prev;
			const prevIdx = (indexRef.current - 1 + prev.length) % prev.length;
			syncIndex(prevIdx);
			result = prev[prevIdx];
			return prev;
		});
		return result;
	}, []);

	const jumpTo = useCallback((index: number): T | null => {
		let result: T | null = null;
		setItems((prev) => {
			if (index < 0 || index >= prev.length) return prev;
			syncIndex(index);
			result = prev[index];
			return prev;
		});
		return result;
	}, []);

	const clear = useCallback(() => {
		setItems([]);
		syncIndex(0);
	}, []);

	return {
		items,
		current,
		currentIndex,
		set,
		enqueue,
		next,
		previous,
		jumpTo,
		clear,
		isEmpty: items.length === 0,
		size: items.length,
	};
}
