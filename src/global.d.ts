declare module "svelte-progress-bar" {
	import type { SvelteComponentTyped } from "svelte";

	export default class ProgressBar extends SvelteComponentTyped<{
		color?: string;
		width?: number;
		minimum?: number;
		maximum?: number;
		settleTime?: number;
		intervalTime?: number;
		stepSizes?: number[];
		barStyle?: string;
		leaderColorStyle?: string;
		// Other props as you need it
	}> {
		public start(): void;
		public complete(): void;
		public reset: () => void;
		public animate: () => void;
		public start: () => void;
		public stop: () => void;
		public complete: () => void;
		public setWidthRatio: (widthRatio: number) => void;
		public getState: () => {
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
		// Other funcs as you need it
	}
}
