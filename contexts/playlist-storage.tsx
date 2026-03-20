import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Track } from "@/constants/tracks";

const STORAGE_KEY = "local_playlists";

export interface LocalPlaylist {
	id: string;
	name: string;
	tracks: Track[];
	createdAt: number;
	updatedAt: number;
}

interface PlaylistStorageContextType {
	playlists: LocalPlaylist[];
	createPlaylist: (name: string) => LocalPlaylist;
	deletePlaylist: (id: string) => void;
	renamePlaylist: (id: string, name: string) => void;
	addTrack: (playlistId: string, track: Track) => void;
	removeTrack: (playlistId: string, trackIndex: number) => void;
	getPlaylist: (id: string) => LocalPlaylist | undefined;
}

const PlaylistStorageContext = createContext<PlaylistStorageContextType | null>(null);

export function PlaylistStorageProvider({ children }: { children: React.ReactNode }) {
	const [playlists, setPlaylists] = useState<LocalPlaylist[]>([]);
	const ref = useRef<LocalPlaylist[]>([]);

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
			if (raw) {
				const parsed = JSON.parse(raw);
				ref.current = parsed;
				setPlaylists(parsed);
			}
		});
	}, []);

	const persist = useCallback((next: LocalPlaylist[]) => {
		ref.current = next;
		setPlaylists(next);
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	}, []);

	const createPlaylist = useCallback((name: string) => {
		const playlist: LocalPlaylist = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
			name,
			tracks: [],
			createdAt: Date.now(),
			updatedAt: Date.now(),
		};
		persist([...ref.current, playlist]);
		return playlist;
	}, [persist]);

	const deletePlaylist = useCallback((id: string) => {
		persist(ref.current.filter((p) => p.id !== id));
	}, [persist]);

	const renamePlaylist = useCallback((id: string, name: string) => {
		persist(ref.current.map((p) =>
			p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
		));
	}, [persist]);

	const addTrack = useCallback((playlistId: string, track: Track) => {
		persist(ref.current.map((p) => {
			if (p.id !== playlistId) return p;
			if (p.tracks.some((t) => t.id === track.id)) return p;
			return { ...p, tracks: [...p.tracks, track], updatedAt: Date.now() };
		}));
	}, [persist]);

	const removeTrack = useCallback((playlistId: string, trackIndex: number) => {
		persist(ref.current.map((p) => {
			if (p.id !== playlistId) return p;
			return {
				...p,
				tracks: p.tracks.filter((_, i) => i !== trackIndex),
				updatedAt: Date.now(),
			};
		}));
	}, [persist]);

	const getPlaylist = (id: string) => {
		return playlists.find((p) => p.id === id)
	}

	return (
		<PlaylistStorageContext.Provider
			value={{ playlists, createPlaylist, deletePlaylist, renamePlaylist, addTrack, removeTrack, getPlaylist }}
		>
			{children}
		</PlaylistStorageContext.Provider>
	);
}

export function usePlaylistStorage() {
	const ctx = useContext(PlaylistStorageContext);
	if (!ctx) throw new Error("usePlaylistStorage must be used within <PlaylistStorageProvider>");
	return ctx;
}
