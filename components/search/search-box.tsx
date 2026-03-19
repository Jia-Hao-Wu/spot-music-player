import { useRef, useState } from "react";
import { Pressable, TextInput, type TextInputProps, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

type SearchboxProps = Omit<TextInputProps, "style">;

export function Searchbox({ onChangeText, ...props }: SearchboxProps) {
	const [hasText, setHasText] = useState(false);
	const inputRef = useRef<TextInput>(null);

	const handleChangeText = (text: string) => {
		setHasText(text.length > 0);
		onChangeText?.(text);
	};

	const handleClear = () => {
		setHasText(false);
		inputRef.current?.clear();
		onChangeText?.("");
	};

	return (
		<View className="relative">
			<TextInput
				ref={inputRef}
				className="bg-player-surface rounded-md px-3 py-2 w-full text-sm text-foreground placeholder:text-muted"
				onChangeText={handleChangeText}
				{...props}
			/>
			{hasText ? (
				<Pressable
					className="absolute right-3 top-1/2 transform -translate-y-1/2"
					onPress={handleClear}
					hitSlop={8}
				>
					<IconSymbol
						className="text-foreground opacity-25"
						size={28}
						name="xmark"
					/>
				</Pressable>
			) : (
				<IconSymbol
					className="text-foreground absolute right-3 top-1/2 transform -translate-y-1/2 opacity-25"
					size={28}
					name="magnifyingglass"
				/>
			)}
		</View>
	);
}
