import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePlaylistStorage } from "@/contexts/playlist-storage";
import { Track } from "@/constants/tracks";

type ShowFn = (track: Track) => void;

const AddToPlaylistContext = createContext<ShowFn>(() => {});

export function useAddToPlaylist() {
	return useContext(AddToPlaylistContext);
}

export function AddToPlaylistProvider({ children }: { children: React.ReactNode }) {
	const [track, setTrack] = useState<Track | null>(null);
	const show = useCallback((t: Track) => setTrack(t), []);

	return (
		<AddToPlaylistContext.Provider value={show}>
			{children}
			<AddToPlaylistModal track={track} onClose={() => setTrack(null)} />
		</AddToPlaylistContext.Provider>
	);
}

function AddToPlaylistModal({ track, onClose }: { track: Track | null; onClose: () => void }) {
	const { playlists, createPlaylist, addTrack } = usePlaylistStorage();
	const [isCreating, setIsCreating] = useState(false);
	const [newName, setNewName] = useState("");
	const inputRef = useRef<TextInput>(null);

	const handleAddToExisting = (playlistId: string) => {
		if (track) addTrack(playlistId, track);
		onClose();
	};

	const handleCreateAndAdd = () => {
		const name = newName.trim();
		if (!name || !track) return;
		const playlist = createPlaylist(name);
		addTrack(playlist.id, track);
		setNewName("");
		setIsCreating(false);
		onClose();
	};

	const handleClose = () => {
		setIsCreating(false);
		setNewName("");
		onClose();
	};

	return (
		<Modal visible={!!track} transparent animationType="fade" onRequestClose={handleClose}>
			<Pressable className="flex-1 bg-black/50 justify-end" onPress={handleClose}>
				<Pressable className="bg-background rounded-t-2xl max-h-[60%] p-4" onPress={() => {}}>
					<View className="flex-row items-center justify-between mb-4">
						<Text className="text-base font-semibold text-foreground">Add to playlist</Text>
						<Pressable onPress={handleClose} hitSlop={8}>
							<IconSymbol name="xmark" size={20} className="text-muted" />
						</Pressable>
					</View>

					{isCreating ? (
						<View className="flex-row items-center gap-2 mb-4">
							<TextInput
								ref={inputRef}
								className="flex-1 bg-player-surface rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted"
								placeholder="Playlist name"
								value={newName}
								onChangeText={setNewName}
								onSubmitEditing={handleCreateAndAdd}
								autoFocus
							/>
							<Pressable onPress={handleCreateAndAdd} className="px-3 py-2 rounded-md bg-player-surface">
								<Text className="text-sm text-foreground">Add</Text>
							</Pressable>
							<Pressable onPress={() => { setIsCreating(false); setNewName(""); }} hitSlop={8}>
								<IconSymbol name="xmark" size={16} className="text-muted" />
							</Pressable>
						</View>
					) : (
						<Pressable
							onPress={() => setIsCreating(true)}
							className="flex-row items-center gap-3 py-3 mb-2 border-b border-player-border"
						>
							<View className="h-10 w-10 rounded-md bg-player-surface items-center justify-center">
								<IconSymbol name="plus" size={20} className="text-foreground" />
							</View>
							<Text className="text-sm text-foreground">New playlist</Text>
						</Pressable>
					)}

					<ScrollView>
						{playlists.map((playlist) => (
							<Pressable
								key={playlist.id}
								onPress={() => handleAddToExisting(playlist.id)}
								className="flex-row items-center gap-3 py-3"
							>
								<View className="h-10 w-10 rounded-md bg-player-surface items-center justify-center">
									<IconSymbol name="music.note.list" size={20} className="text-muted" />
								</View>
								<View className="flex-1 min-w-0">
									<Text className="text-sm text-foreground" numberOfLines={1}>
										{playlist.name}
									</Text>
									<Text className="text-xs text-muted">
										{playlist.tracks.length} track{playlist.tracks.length !== 1 ? "s" : ""}
									</Text>
								</View>
							</Pressable>
						))}
					</ScrollView>
				</Pressable>
			</Pressable>
		</Modal>
	);
}
