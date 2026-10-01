<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** Path to the artwork, e.g. `/comp.svg`. */
		art: string;
		alt: string;
		/** Rendered inside the screen cutout, above the artwork. */
		children?: Snippet;
		/**
		 * How the artwork sits in its column.
		 *
		 * The art is cropped *in the file* — the machine is sliced vertically by
		 * its own left edge (41% of the leftmost pixel column is opaque), while
		 * the top, right and bottom edges are transparent padding. Centring it
		 * therefore parks a hard vertical cut in the middle of the page, which
		 * reads as a mistake. `bleed` instead anchors it to the page's left edge
		 * so that cut lands exactly on the edge and looks deliberate.
		 */
		bleed?: boolean;
	}

	let { art, alt, bleed = false, children }: Props = $props();

	/**
	 * Geometry of the transparent screen hole in `static/comp.svg`.
	 *
	 * MEASURED, not estimated. These values come from finding transparent runs
	 * that are genuinely ENCLOSED by opaque pixels within a row — a real hole in
	 * the machine. The previous numbers came from "the largest fully-transparent
	 * rectangle", which merged the screen hole with the transparent background
	 * beside the machine, so it started at x=0 and ran 68% wide.
	 *
	 * Measured on comp.png (853x1280, pixel-identical to comp.svg):
	 *
	 *     x 81-592, y 214-689   ->  512 x 476 px
	 *
	 * As a fraction of the artwork box:
	 *
	 *     left 9.50%   top 16.72%   width 60.02%   height 37.19%
	 *
	 * Confirmation the old rect was wrong: at y=449 the first opaque pixel is
	 * x=589, so the old left edge (x=0) and width (to x=580) put the terminal
	 * over empty background to the LEFT of the machine rather than on its
	 * screen. Do not nudge these by eye — re-measure the artwork instead.
	 */
	const CUTOUT = {
		left: '9.50%',
		top: '16.72%',
		width: '60.02%',
		height: '37.19%'
	} as const;

	/**
	 * Cap the artwork so the hero fits roughly one screen.
	 *
	 * The art's aspect is 853:1280, so the width that produces a given height
	 * is `height * 853 / 1280`. Un-capped, the art renders 2.01x the viewport
	 * height at 1280x577 and still ~1.7x at 1920x1080 — which pushes every
	 * credential on the page below the fold.
	 *
	 * Capping by WIDTH (not `max-height` + `object-fit`) keeps the wrapper box
	 * identical to the rendered image box, so the percentage-positioned
	 * overlays stay aligned with the measured cutout. `object-fit` would
	 * letterbox inside the wrapper and silently break that alignment.
	 */
	const HEIGHT_BUDGET = '86svh';
	const aspectCap = `max-width: min(100%, calc(${HEIGHT_BUDGET} * 853 / 1280));`;

	/**
	 * Position/size of an overlay, expressed against the artwork box.
	 *
	 * `container-type: size` on the terminal layer makes it a size container,
	 * so the terminal inside can size its own insets and type against the
	 * screen (`cqw`/`cqh`) rather than the viewport — the same markup stays
	 * legible whether the screen is 232px wide on a phone or 524px on a laptop.
	 */
	const box = (extra = '') =>
		`left:${CUTOUT.left};top:${CUTOUT.top};width:${CUTOUT.width};height:${CUTOUT.height};${extra}`;
</script>

<!--
  Stacking order matters and is deliberate:
    z-0  screen fill   (only visible through the artwork's transparent hole)
    z-10 the artwork   (opaque everywhere except the hole)
    z-20 the terminal  (must sit above the art)
  A negative-z fill would vanish behind the page stacking context.
-->
<div
	class="relative w-full {bleed ? 'mx-auto lg:mx-0' : 'mx-auto'}"
	style={aspectCap}
>
	<!-- width/height are set so the browser reserves the box before the vector
	     loads — this is the largest element on the page, so an unsized image
	     here would be the single biggest source of layout shift. -->
	<img
		src={art}
		{alt}
		width="853"
		height="1280"
		decoding="async"
		class="relative z-10 block h-auto w-full select-none"
	/>

	<div class="absolute z-0 overflow-hidden" style={box()}>
		<div class="h-full w-full bg-canvas"></div>
	</div>

	<div class="absolute z-20 overflow-hidden" style={box('container-type:size;')}>
		{@render children?.()}
	</div>
</div>
