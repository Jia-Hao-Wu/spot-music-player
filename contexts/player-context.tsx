import {
	useAudioPlaylist,
	useAudioPlaylistStatus,
	setAudioModeAsync,
	AudioPlaylist
} from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import { getTrackStream } from "@/api";
import { Track } from "@/constants/tracks";

const STORAGE_KEY = "player_queue";

async function resolveUri(track: Track): Promise<string | null> {
	if (track.uri) return track.uri;
	if (track.tidalId) {
		try {
			return await getTrackStream(track.tidalId);
		} catch {
		}
	}
	return null;
}

interface PlayerContextType {
	currentIndex: number;
	currentTrack: Track | null;
	isPlaying: boolean;
	isLoading: boolean;
	position: number;
	duration: number;
	length: number;
	currentListId?: string;
	replaceQueue: (tracks: Track[], currentListId: string) => Promise<void>;
	enQueue: (track: Track) => Promise<void>;
	play: () => Promise<void>;
	pause: () => Promise<void>;
	next: () => Promise<void>;
	previous: () => Promise<void>;
	seek: (positionSeconds: number) => Promise<void>;
	toggleLoop: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(false);
	const [currentListId, setCurrentListId] = useState<string>();
	const [trackList, setTrackList] = useState<Track[]>([]);
	const resolvedUpTo = useRef(-1);
	const trackListRef = useRef<Track[]>([]);
	const queueGeneration = useRef(0);

	const playlist = useAudioPlaylist({ loop: "none" });
	const status = useAudioPlaylistStatus(playlist);

	useEffect(() => {
		setAudioModeAsync({
			playsInSilentMode: true,
			shouldPlayInBackground: true,
			interruptionMode: "duckOthers",
		});
	}, []);

	const resolveAndAdd = async (tracks: Track[], from: number, to: number, generation: number) => {
		for (let i = from; i <= to && i < tracks.length; i++) {
			if (generation !== queueGeneration.current) return;
			if (i <= resolvedUpTo.current) continue;
			const uri = await resolveUri(tracks[i]);
			if (uri && generation === queueGeneration.current) {
				playlist.add({ uri, name: tracks[i].title });
				resolvedUpTo.current = i;
			}
		}
	};

	const replaceQueue = async (tracks: Track[], listId: string) => {
		
		if (currentListId === listId) {
			return playlist.playing ? playlist.pause() : playlist.play();
		}

		const generation = ++queueGeneration.current;
		setCurrentListId(listId);
		setIsLoading(true);
		playlist.clear();
		resolvedUpTo.current = -1;
		setTrackList(tracks);
		trackListRef.current = tracks;

		if (tracks.length === 0) {
			setIsLoading(false);
			return;
		}

		// Resolve the first track and start playing immediately
		const firstUri = await resolveUri(tracks[0]);
		if (!firstUri) {
			setIsLoading(false);
			return;
		}

		playlist.add({ uri: firstUri, name: tracks[0].title });
		resolvedUpTo.current = 0;
		playlist.play();
		setIsLoading(false);

		// Resolve remaining tracks in the background
		await resolveAndAdd(tracks, 1, tracks.length - 1, generation);
	};

	const enQueue = async (track: Track) => {
		const currentTrack = trackList[status.currentIndex] ?? null;

		if (track.id === currentTrack?.id) {
			return playlist.playing ? playlist.pause() : playlist.play();
		}

		const uri = await resolveUri(track);
		if (!uri) return;

		// Cancel any in-flight background resolution from replaceQueue
		++queueGeneration.current;
		const newIndex = playlist.trackCount;
		setCurrentListId(undefined);
		// Truncate trackList to only resolved tracks so indices stay aligned
		// with the actual playlist, then append the enqueued track
		setTrackList((prev) => {
			const next = [...prev.slice(0, newIndex), track];
			trackListRef.current = next;
			return next;
		});
		resolvedUpTo.current = newIndex;

		playlist.add({ uri, name: track.title });
		playlist.skipTo(newIndex);
		playlist.play();
	};

	const play = useCallback(async () => {
		playlist.play();
	}, [playlist]);

	const pause = useCallback(async () => {
		playlist.pause();
	}, [playlist]);

	const next = useCallback(async () => {
		playlist.next();
	}, [playlist]);

	const previous = useCallback(async () => {
		if (playlist.currentTime > 3) {
			await playlist.seekTo(0);
			return;
		}
		playlist.previous();
	}, [playlist]);

	const seek = useCallback(
		async (positionSeconds: number) => {
			if (!Number.isFinite(positionSeconds) || positionSeconds < 0) return;
			await playlist.seekTo(positionSeconds);
		},
		[playlist],
	);

	const toggleLoop = useCallback(() => {
		playlist.loop = playlist.loop === "none" ? "all" : "none";
	}, [playlist]);


	return (
		<PlayerContext.Provider
			value={{
				currentIndex: status.currentIndex,
				currentTrack: trackList[status.currentIndex] ?? null,
				isPlaying: status.playing,
				isLoading: isLoading || status.isBuffering,
				position: status.currentTime,
				duration: status.duration,
				length: trackList.length,
				currentListId,
				replaceQueue,
				play,
				pause,
				next,
				previous,
				seek,
				enQueue,
				toggleLoop
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
}

export function usePlayer() {
	const ctx = useContext(PlayerContext);
	if (!ctx) throw new Error("usePlayer must be used within <PlayerProvider>");
	return ctx;
}
