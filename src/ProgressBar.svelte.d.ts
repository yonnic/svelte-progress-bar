// ProgressBar.svelte.d.ts
/// <reference types="svelte" />

export interface ProgressBarProps {
	color?: string;
	width?: number;
	minimum?: number;
	maximum?: number;
	settleTime?: number;
	intervalTime?: number;
	stepSizes?: number[];
	barStyle?: string;
	leaderColorStyle?: string;
}

export default class ProgressBar {
	$$prop_def: ProgressBarProps;
	$$slot_def: {};

	// Methods
	reset: () => void;
	animate: () => void;
	start: () => void;
	stop: () => void;
	complete: () => void;
	setWidthRatio: (widthRatio: number) => void;
	getState: () => {
		width: number;
		running: boolean;
		completed: boolean;
		color: string;
		minimum: number;
		maximum: number;
		settleTime: number;
		intervalTime: number;
		stepSizes: number[];
	};
}
