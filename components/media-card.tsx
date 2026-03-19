import type { ReactNode } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { ARTWORK_SIZES, artworkUrl } from "@/api/images";

type MediaCardProps = {
	image: string | null | undefined;
	title: string;
	onPress: () => void;
	className?: string;
	children?: ReactNode;
};

export function MediaCard({ image, title, onPress, className, children }: MediaCardProps) {
	return (
		<Pressable
			className={`flex flex-col items-start rounded-sm overflow-visible active:opacity-70 ${className}`}
			onPress={onPress}
		>
			<Image
				source={{ uri: artworkUrl(image, ARTWORK_SIZES.medium) }}
				className="w-full aspect-square rounded-md"
				resizeMode="cover"
			/>
			<View className="min-w-0 w-full pt-2">
				<Text className="text-xs text-foreground" numberOfLines={1}>{title}</Text>
				{children}
			</View>
		</Pressable>
	);
}
