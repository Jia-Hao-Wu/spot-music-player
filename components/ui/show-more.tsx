import { Pressable, Text } from "react-native";

type ShowMoreProps = {
	expanded: boolean;
	remaining: number;
	onToggle: () => void;
};

export function ShowMore({ expanded, remaining, onToggle }: ShowMoreProps) {
	return (
		<Pressable onPress={onToggle} className="w-full py-2 items-center">
			<Text className="text-xs text-muted">
				{expanded ? "Show Less" : `Show More (${remaining} more)`}
			</Text>
		</Pressable>
	);
}
