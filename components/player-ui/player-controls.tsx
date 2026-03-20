import { useEffect, useRef, useState } from "react";
import {
	Image,
	PanResponder,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { MarqueeText } from "@/components/ui/marquee-text";
import { usePlayer } from "@/contexts/player-context";
import { MinMax } from "@/utils";
import { useRouter } from "expo-router";
import { PausePlayButton } from "./pause-play-button";

export function PlayerControls() {
	const {
		currentTrack,
		position,
		duration,
		next,
		previous,
		seek,
		currentIndex,
		length,
		shuffled,
		toggleShuffle,
	} = usePlayer();

	const router = useRouter();
	const [barWidth, setBarWidth] = useState(0);
	const [isScrubbing, setIsScrubbing] = useState(false);
	const [scrubRatio, setScrubRatio] = useState(0);
	const [seekTarget, setSeekTarget] = useState<number | null>(null);

	const barWidthRef = useRef(0);
	const durationRef = useRef(duration);
	const seekRef = useRef(seek);
	const scrubRatioRef = useRef(0);
	const progressRef = useRef(0);
	durationRef.current = duration;
	seekRef.current = seek;

	useEffect(() => {
		if (seekTarget !== null && Math.abs(position - seekTarget) < 0.5) {
			setSeekTarget(null);
		}
	}, [position, seekTarget]);

	const progress = duration > 0 ? position / duration : 0;
	progressRef.current = progress;
	const displayProgress = isScrubbing
		? scrubRatio
		: seekTarget !== null && duration > 0
			? seekTarget / duration
			: progress;
	const displayPosition = isScrubbing
		? scrubRatio * duration
		: seekTarget ?? position;

	const startRatioRef = useRef(0);

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: (evt) => {
				if (!barWidthRef.current) return;
				setSeekTarget(null);
				const ratio = MinMax(0, 1, evt.nativeEvent.locationX / barWidthRef.current);
				startRatioRef.current = ratio;
				scrubRatioRef.current = ratio;
				setIsScrubbing(true);
				setScrubRatio(ratio);
			},
			onPanResponderMove: (_evt, gestureState) => {
				if (!barWidthRef.current) return;
				const ratio = MinMax(
					0,
					1,
					startRatioRef.current + gestureState.dx / barWidthRef.current,
				);
				scrubRatioRef.current = ratio;
				setScrubRatio(ratio);
			},
			onPanResponderRelease: (_evt, gestureState) => {
				if (!barWidthRef.current || !durationRef.current) return;
				const ratio = MinMax(
					0,
					1,
					startRatioRef.current + gestureState.dx / barWidthRef.current,
				);
				const target = ratio * durationRef.current;
				setSeekTarget(target);
				setIsScrubbing(false);
				seekRef.current(target);
			},
			onPanResponderTerminate: () => {
				if (durationRef.current) {
					const target = scrubRatioRef.current * durationRef.current;
					setSeekTarget(target);
					seekRef.current(target);
				}
				setIsScrubbing(false);
			},
		}),
	).current;

	if (!currentTrack) return;

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s.toString().padStart(2, "0")}`;
	};

	const dotSize = isScrubbing ? 14 : 10;

	const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

	return (
		<View className="border-t border-player-border bg-player-surface">
			<View>
				<View className="h-[3px] overflow-hidden rounded-[2px] bg-foreground/20">
					<View
						className="h-full rounded-[2px] bg-foreground"
						style={{ width: `${displayProgress * 100}%` }}
					/>
				</View>

				{barWidth > 0 && (
					<View
						className="absolute bg-foreground"
						style={{
							width: dotSize,
							height: dotSize,
							borderRadius: dotSize / 2,
							left: displayProgress * barWidth - dotSize / 2,
							top: (3 - dotSize) / 2,
						}}
					/>
				)}

				<View
					onLayout={(e) => {
						const w = e.nativeEvent.layout.width;
						setBarWidth(w);
						barWidthRef.current = w;
					}}
					{...panResponder.panHandlers}
					className="absolute inset-0 -top-3 -bottom-3"
				/>
			</View>

			<View className="flex-row items-center gap-[10px] px-3 py-2">
				<Image source={{ uri: currentTrack.artwork }} className="h-11 w-11 rounded-md" />
				<View className="flex-1 gap-0.5">
					<MarqueeText
						text={currentTrack.title}
						className="text-sm font-semibold tracking-tight text-foreground"
					/>
					<Pressable onPress={() => router.push(`/artist/${currentTrack.artist.id}`)}>
						<Text className="text-xs text-muted">{currentTrack.artist.name}</Text>
					</Pressable>
				</View>

				<Text className="text-[11px] text-muted">
					{`${formatTime(displayPosition)} / ${formatTime(duration)}`}
				</Text>

				<View className="flex-row items-center gap-3">
					<TouchableOpacity
						onPress={toggleShuffle}
						hitSlop={hitSlop}
					>
						<IconSymbol
							name="shuffle"
							size={16}
							className={shuffled ? "text-foreground" : "text-foreground opacity-30"}
						/>
					</TouchableOpacity>

					<TouchableOpacity
						disabled={!shuffled && currentIndex === 0}
						onPress={previous}
						hitSlop={hitSlop}
					>
						<IconSymbol
							name="backward.fill"
							size={18}
							className={`text-foreground ${!shuffled && currentIndex === 0 ? "opacity-30" : ""}`}
						/>
					</TouchableOpacity>

					<PausePlayButton />

					<TouchableOpacity
						disabled={!shuffled && currentIndex === length - 1}
						onPress={next}
						hitSlop={hitSlop}
					>
						<IconSymbol
							name="forward.fill"
							size={18}
							className={`text-foreground ${!shuffled && currentIndex === length - 1 ? "opacity-30" : ""}`}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
