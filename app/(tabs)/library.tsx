import { useRef, useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { usePlaylistStorage } from "@/contexts/playlist-storage";

export default function LibraryScreen() {
	const { playlists, createPlaylist, deletePlaylist } = usePlaylistStorage();
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [newName, setNewName] = useState("");
	const inputRef = useRef<TextInput>(null);

	const handleCreate = () => {
		const name = newName.trim();
		if (!name) return;
		createPlaylist(name);
		setNewName("");
		setIsCreating(false);
	};

	return (
		<View className="flex-1 bg-background">
			<View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
				<View>
					<Text className="text-lg font-bold text-foreground">Library</Text>
					<Text className="text-xs text-muted mt-0.5">
						{playlists.length} playlist{playlists.length !== 1 ? "s" : ""}
					</Text>
				</View>
				<Pressable
					onPress={() => {
						setIsCreating(true);
						setTimeout(() => inputRef.current?.focus(), 100);
					}}
					hitSlop={8}
				>
					<IconSymbol name="plus" size={24} className="text-foreground" />
				</Pressable>
			</View>

			{isCreating && (
				<View className="px-5 py-2 flex-row items-center gap-2">
					<TextInput
						ref={inputRef}
						className="flex-1 bg-player-surface rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted"
						placeholder="Playlist name"
						value={newName}
						onChangeText={setNewName}
						onSubmitEditing={handleCreate}
						autoFocus
					/>
					<Pressable onPress={handleCreate} className="px-3 py-2 rounded-md bg-player-surface">
						<Text className="text-sm text-foreground">Create</Text>
					</Pressable>
					<Pressable
						onPress={() => {
							setIsCreating(false);
							setNewName("");
						}}
					>
						<IconSymbol name="xmark" size={18} className="text-muted" />
					</Pressable>
				</View>
			)}

			<ScrollView className="flex-1">
				{playlists.length === 0 && !isCreating && (
					<View className="items-center justify-center py-20">
						<Text className="text-sm text-muted">No playlists yet</Text>
					</View>
				)}
				{playlists.map((playlist) => (
					<Pressable
						key={playlist.id}
						className="flex-row items-center gap-3 px-5 py-3 hover:bg-white/10"
						onPress={() => router.push(`/local-playlist/${playlist.id}`)}
					>
						<View className="h-12 w-12 rounded-md bg-player-surface items-center justify-center">
							<IconSymbol name="music.note.list" size={24} className="text-muted" />
						</View>
						<View className="flex-1 min-w-0">
							<Text className="text-sm text-foreground" numberOfLines={1}>
								{playlist.name}
							</Text>
							<Text className="text-xs text-muted">
								{playlist.tracks.length} track{playlist.tracks.length !== 1 ? "s" : ""}
							</Text>
						</View>
						<Pressable
							onPress={() => deletePlaylist(playlist.id)}
							hitSlop={8}
							className="px-2"
						>
							<IconSymbol name="trash" size={16} className="text-muted" />
						</Pressable>
					</Pressable>
				))}
			</ScrollView>
		</View>
	);
}
