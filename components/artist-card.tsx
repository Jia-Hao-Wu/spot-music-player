import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { ARTWORK_SIZES, artworkUrl } from "@/api/images";
import type { ArtistMeta } from "@/api/metadata";

type ArtistCardProps = {
	artist: ArtistMeta;
	variant?: "row" | "column";
};

export function ArtistCard({ artist, variant = "column" }: ArtistCardProps) {
	const router = useRouter();

	if (variant === "row") {
		return (
			<Pressable
				className="group flex-row items-center gap-3 py-3 px-5 hover:bg-white/10 rounded-sm overflow-visible"
				onPress={() => router.push(`/artist/${artist.id}`)}
			>
				<View className="flex-row items-center flex-1 overflow-visible">
					<View className="flex rounded-full w-12 h-12 overflow-visible mr-5 relative">
						<Image
							className="rounded-full w-12 h-12"
							source={{ uri: artworkUrl(artist.picture, ARTWORK_SIZES.medium) }}
						/>
					</View>
					<View className="min-w-0">
						<Text className="text-sm text-foreground" numberOfLines={1}>{artist.name}</Text>
					</View>
				</View>
			</Pressable>
		);
	}

	return (
		<Pressable
			className="flex flex-col items-center gap-2"
			onPress={() => router.push(`/artist/${artist.id}`)}
		>
			<Image
				source={{ uri: artworkUrl(artist.picture, ARTWORK_SIZES.medium) }}
				className="w-20 h-20 rounded-full"
				resizeMode="cover"
			/>
			<Text className="text-xs text-foreground text-center w-20" numberOfLines={1}>
				{artist.name}
			</Text>
		</Pressable>
	);
}
