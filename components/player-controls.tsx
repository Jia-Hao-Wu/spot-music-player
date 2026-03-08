import React, { useRef, useState } from "react";
import {
	Image,
	PanResponder,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { usePlayer } from "@/contexts/player-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MinMax } from "@/utils";

export function PlayerControls() {
	const {
		currentTrack,
		isPlaying,
		position,
		duration,
		play,
		pause,
		next,
		previous,
		seek,
	} = usePlayer();
	const colorScheme = useColorScheme() ?? "light";
	const { icon: iconColor, text: textColor, tint: tintColor } = Colors[colorScheme];

	const [barWidth, setBarWidth] = useState(0);
	const [isScrubbing, setIsScrubbing] = useState(false);
	const [scrubRatio, setScrubRatio] = useState(0);

	// Refs so PanResponder callbacks always see current values
	const barWidthRef = useRef(0);
	const durationRef = useRef(duration);
	const seekRef = useRef(seek);
	durationRef.current = duration;
	seekRef.current = seek;

	const progress = duration > 0 ? position / duration : 0;
	const displayProgress = isScrubbing ? scrubRatio : progress;
	const displayPosition = isScrubbing ? scrubRatio * duration : position;

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: (evt) => {
				if (!barWidthRef.current) return;
				const ratio = MinMax(0, 1, evt.nativeEvent.locationX / barWidthRef.current);
				setIsScrubbing(true);
				setScrubRatio(ratio);
			},
			onPanResponderMove: (evt) => {
				if (!barWidthRef.current) return;
				const ratio = MinMax(0, 1, evt.nativeEvent.locationX / barWidthRef.current);
				setScrubRatio(ratio);
			},
			onPanResponderRelease: (evt) => {
				if (!barWidthRef.current || !durationRef.current) return;
				const ratio = MinMax(0, 1, evt.nativeEvent.locationX / barWidthRef.current);
				seekRef.current(ratio * durationRef.current);
				setScrubRatio(ratio);
				setIsScrubbing(false);
			},
			onPanResponderTerminate: () => {
				setIsScrubbing(false);
			},
		}),
	).current;

	if (!currentTrack) return null;

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	const dotSize = isScrubbing ? 14 : 10;

	return (
		<View className="border-t border-player-border bg-player-surface">
			{/* Scrubber */}
			<View
				onLayout={(e) => {
					const w = e.nativeEvent.layout.width;
					setBarWidth(w);
					barWidthRef.current = w;
				}}
				style={{ height: 20, justifyContent: "center" }}
				{...panResponder.panHandlers}
			>
				{/* Track + fill */}
				<View
					style={{
						height: 3,
						backgroundColor: "rgba(128,128,128,0.2)",
						borderRadius: 2,
						overflow: "hidden",
					}}
				>
					<View
						style={{
							height: "100%",
							width: `${displayProgress * 100}%`,
							backgroundColor: tintColor,
							borderRadius: 2,
						}}
					/>
				</View>

				{/* Draggable dot */}
				{barWidth > 0 && (
					<View
						style={{
							position: "absolute",
							width: dotSize,
							height: dotSize,
							borderRadius: dotSize / 2,
							backgroundColor: tintColor,
							left: displayProgress * barWidth - dotSize / 2,
							top: (20 - dotSize) / 2,
						}}
					/>
				)}
			</View>

			<View className="flex-row items-center gap-[10px] px-3 py-2">
				<Image
					source={{ uri: currentTrack.artwork }}
					className="h-11 w-11 rounded-md bg-gray-300"
				/>

				<View className="flex-1 gap-0.5">
					<Text
						className="text-sm font-semibold tracking-tight text-foreground"
						numberOfLines={1}
					>
						{currentTrack.title}
					</Text>
					<Text className="text-xs text-icon" numberOfLines={1}>
						{currentTrack.artist}
					</Text>
				</View>

				<Text className="text-[11px] text-icon">
					{`${formatTime(displayPosition)} / ${formatTime(duration)}`}
				</Text>

				<View className="flex-row items-center gap-3">
					<TouchableOpacity
						onPress={previous}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						<IconSymbol name="backward.fill" size={18} color={textColor} />
					</TouchableOpacity>

					<TouchableOpacity
						onPress={isPlaying ? pause : play}
						className="h-9 w-9 items-center justify-center rounded-full bg-tint"
					>
						<IconSymbol
							name={isPlaying ? "pause.fill" : "play.fill"}
							size={20}
							color={iconColor}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						onPress={next}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						<IconSymbol name="forward.fill" size={18} color={textColor} />
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
