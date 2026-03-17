import { TextInput, type TextInputProps, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SearchboxProps = Omit<TextInputProps, "style">;

export function Searchbox(props: SearchboxProps) {
	return (
		<View className="relative">
			<TextInput
				className="bg-player-surface rounded-md px-3 py-2 w-full text-sm text-foreground placeholder:text-muted"
				{...props}
			/>
			<IconSymbol
				className="text-foreground absolute right-3 top-1/2 transform -translate-y-1/2 opacity-25"
				size={28}
				name="magnifyingglass"
			/>
		</View>
	);
}
