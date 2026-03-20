import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

type BackHeaderProps = {
	children?: ReactNode;
};

export function BackHeader({ children }: BackHeaderProps) {
	const router = useRouter();

	return (
		<View className="sticky top-0 z-10 flex-row items-center gap-3 px-2 py-2 bg-background/80 backdrop-blur">
			<Pressable onPress={() => router.back()} className="flex items-center justify-center">
				<IconSymbol name="chevron.left" size={30} className="text-foreground" />
			</Pressable>
			{children}
		</View>
	);
}
