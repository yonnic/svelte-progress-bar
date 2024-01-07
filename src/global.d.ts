// ProgressBar.svelte.d.ts
declare module "svelte-progress-bar" {
	import type { SvelteComponentTyped } from "svelte";

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

	export interface ProgressBarEvents {
		// Define custom events here, if any
		// Example: on:complete: CustomEvent<null>;
	}

	export interface ProgressBarSlots {
		// Define slots here, if any
		// Example: default: {};
	}

	export default class ProgressBar extends SvelteComponentTyped<
		ProgressBarProps,
		ProgressBarEvents,
		ProgressBarSlots
	> {
		// You can define additional methods or properties if needed
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
}
