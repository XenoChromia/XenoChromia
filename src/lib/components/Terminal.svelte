<script lang="ts">
	import { onMount } from 'svelte';
	import { profile, socials, certifications, education, skillGroups, projects } from '$lib/content';

	let { art }: { art: string } = $props();

	/* ------------------------------------------------------------------ */
	/* Types                                                               */
	/* ------------------------------------------------------------------ */
	type Line = { t: string; c?: CClass; u?: string };
	type CClass = 'dim' | 'err' | 'ok' | 'hl' | 'warn' | 'link' | 'art';
	type Entry = { input: string; lines: Line[] };
	type FsNode = { type: 'file' | 'dir'; content?: string };
	type FsState = Record<string, FsNode>;

	// Browser-only sandbox. Nothing here touches the homelab or server filesystem.
	let fs: FsState = $state({
		'/': { type: 'dir' },
		'/home': { type: 'dir' },
		'/home/waimeng': { type: 'dir' },
		'/home/waimeng/README.txt': { type: 'file', content: 'Welcome to the local portfolio shell.\n' }
	});
	let viMode = $state(false);
	let viPath = $state('');
	let viBuffer = $state('');
	let viSaved = $state(true);
	let cwd = $state('/home/waimeng');

	/* ------------------------------------------------------------------ */
	/* Commands                                                            */
	/*                                                                     */
	/* Every command that describes the user reads from `$lib/content`, so  */
	/* the terminal can never drift from the page. It previously hardcoded  */
	/* its own copy of the facts ("19 year old", "React, Svelte, Vercel",   */
	/* "TBC…") which disagreed with the resume.                            */
	/* ------------------------------------------------------------------ */
	const CMD_ORDER = [
		'help', 'about', 'skills', 'certifications', 'projects', 'experience',
		'contact', 'goto', 'secret', 'credits', 'btop',
		'cd', 'mkdir', 'ls', 'touch', 'vi', 'clear'
	];
	const SHELL_COMMANDS = new Set(['cd', 'mkdir', 'ls', 'touch', 'vi']);
	const HOME = '/home/waimeng';

	/** Page sections `/goto` can jump to, keyed by the name the user types. */
	const SECTIONS: Record<string, string> = {
		certifications: 'certifications',
		skills: 'skills-heading',
		projects: 'projects',
		contact: 'contact',
		top: 'main'
	};

	const HELP_FOOTER: Line[] = [
		{ t: '' },
		{ t: 'keyboard:  ↑/↓ history · tab autocomplete · ctrl+L clear', c: 'dim' },
		{ t: '          any key skips the typewriter effect', c: 'dim' },
		{ t: 'sandbox: mkdir · ls · touch · vi only modify this browser session', c: 'warn' }
	];

	const BtopBars = ['CPU', 'MEM', 'NET', 'DSK'];
	let btopActive = $state(false);
	let btopTick = $state(0);
	let btopTimer: ReturnType<typeof setInterval> | null = null;

	const DESCRIPTIONS: Record<string, string> = {
		help: 'show this list',
		about: 'about me',
		skills: 'skills overview',
		certifications: 'certifications, newest first',
		projects: 'projects & experience',
		contact: 'how to reach me',
		goto: 'scroll the page to a section',
		secret: 'something special',
		credits: 'image credits',
		btop: 'live system monitor (demo)',
		mkdir: 'make a sandbox directory',
		ls: 'list sandbox files',
		touch: 'create a sandbox file',
		cd: 'change sandbox directory',
		vi: 'edit a sandbox file',
		clear: 'clear the screen'
	};

	function normalize(raw: string): string {
		return raw.replace(/^\/+/, '').trim().toLowerCase();
	}

	function build(name: string): { lines: Line[] } | null {
		switch (name) {
			case 'help':
				return {
					lines: [
						{ t: 'XENOCHROMIA TERMINAL', c: 'ok' },
						{ t: '────────────────────────────────────────', c: 'dim' },
						{ t: 'portfolio', c: 'hl' },
						{ t: '  /about           about me' },
						{ t: '  /skills          skills overview' },
						{ t: '  /certifications  certifications' },
						{ t: '  /projects        projects' },
						{ t: '  /contact         how to reach me' },
						{ t: '  /credits         image credits' },
						{ t: '' },
						{ t: 'navigate', c: 'hl' },
						{ t: '  /goto <section>  scroll the page to a section' },
						{ t: '                   top · skills · certifications · projects · contact', c: 'dim' },
						{ t: '' },
						{ t: 'shell · browser sandbox', c: 'hl' },
						{ t: '  cd <dir>         change directory' },
						{ t: '  ls [path]        list sandbox files' },
						{ t: '  mkdir <dir>      create a sandbox directory' },
						{ t: '  touch <file>     create a sandbox file' },
						{ t: '  vi <file>        edit a sandbox file' },
						{ t: '  btop             live system monitor demo' },
						{ t: '' },
						{ t: 'extras', c: 'hl' },
						{ t: '  /secret          reveal something special' },
						{ t: '  /clear           clear the terminal' },
						...HELP_FOOTER
					]
				};
			case 'about':
				return {
					lines: [
						{ t: profile.headline },
						{ t: '' },
						{ t: profile.blurb, c: 'hl' },
						{ t: '' },
						{ t: `based in ${profile.location}`, c: 'dim' }
					]
				};
			case 'skills':
				return {
					lines: [
						...skillGroups.map((g) => ({
							t: `${g.label.toLowerCase().padEnd(16)} ${g.items.join(', ')}`,
							c: 'ok' as CClass
						})),
						{ t: '' },
						{ t: 'run /goto skills to read them on the page', c: 'dim' }
					]
				};
			case 'certifications':
				return {
					lines: [
						...certifications.flatMap((c) => [
							{ t: `  ${c.name}`, c: 'ok' as CClass },
							{ t: `    ${c.issuer} · ${c.date}`, c: 'dim' as CClass }
						]),
						{ t: '' },
						{ t: 'run /goto certifications to read them on the page', c: 'dim' }
					]
				};
			case 'projects':
			case 'experience':
				return {
					lines: [
						...projects.flatMap((p) => [
							{ t: `  ${p.name}`, c: 'ok' as CClass, u: p.href },
							{ t: `    ${p.tags.join(' · ')}  [${p.status}]`, c: 'dim' as CClass }
						]),
						{ t: '' },
						{ t: 'run /goto projects to read them on the page', c: 'dim' }
					]
				};
			case 'contact':
				return {
					lines: [
						{ t: `  ${profile.email}`, u: `mailto:${profile.email}` },
						...socials
							.filter((s) => s.href.startsWith('http'))
							.map((s) => ({ t: `  ${s.label.toLowerCase()}`, c: 'dim' as CClass, u: s.href })),
						{ t: '' },
						{ t: 'open to internships and to talking to people building things', c: 'hl' }
					]
				};
			case 'credits':
				return {
					lines: [
						{ t: 'image credits:', c: 'dim' },
						{
							t: '  - computer art (freepik)',
							u: 'https://www.freepik.com/free-photo/retro-computer-technology-with-monitor-hardware_34134892.htm'
						},
						{
							t: '  - profile picture (alphacoders)',
							u: 'https://avatars.alphacoders.com/avatars/view/131507'
						}
					]
				};
			case 'mkdir':
				return { lines: [{ t: 'usage: mkdir <directory>', c: 'dim' }] };
			case 'ls':
				return { lines: [{ t: 'usage: ls [path]', c: 'dim' }] };
			case 'touch':
				return { lines: [{ t: 'usage: touch <file>', c: 'dim' }] };
			case 'vi':
				return { lines: [{ t: 'usage: vi <file>', c: 'dim' }] };
			default:
				return null;
		}
	}

	/* ------------------------------------------------------------------ */
	/* State                                                               */
	/* ------------------------------------------------------------------ */
	let history: Entry[] = $state([]);
	let input = $state('');
	let inputFocused = $state(false);
	let busy = $state(false);
	let runningRaw = $state(''); // command echoed while its output is typing
	let typed: Line[] = $state([]);
	let fullLines: Line[] = []; // complete output captured for fast-skip

	let logEl: HTMLDivElement;
	let inputEl: HTMLInputElement;
	let timerId: ReturnType<typeof setTimeout> | null = null;

	const usedInputs: string[] = [];
	let histIdx: number | null = null;
	const MAX_LOG_LINES = 52;

	/* ------------------------------------------------------------------ */
	/* Rendering helpers                                                   */
	/* ------------------------------------------------------------------ */
	function cl(c?: CClass): string {
		switch (c) {
			case 'dim':
				return 'c-dim';
			case 'err':
				return 'c-err';
			case 'ok':
				return 'c-ok';
			case 'hl':
				return 'c-hl';
			case 'warn':
				return 'c-warn';
			case 'link':
				return 'c-link';
			case 'art':
				return 'c-ok';
			default:
				return '';
		}
	}

	function trimHistory(entries: Entry[]): Entry[] {
		let count = 0;
		const kept: Entry[] = [];
		for (let i = entries.length - 1; i >= 0; i--) {
			const entry = entries[i];
			const size = (entry.input ? 1 : 0) + entry.lines.length;
			if (count + size > MAX_LOG_LINES && kept.length > 0) break;
			kept.unshift(entry);
			count += size;
		}
		return kept;
	}

	function appendHistory(entry: Entry) {
		history = trimHistory([...history, entry]);
		scrollBottom();
	}

	function scrollBottom() {
		const move = () => {
			if (!logEl) return;
			logEl.scrollTop = logEl.scrollHeight;
		};
		requestAnimationFrame(() => {
			move();
			requestAnimationFrame(move);
		});
		setTimeout(move, 0);
	}

	function scrollIfOverflowing() {
		requestAnimationFrame(() => {
			if (!logEl) return;
			if (logEl.scrollHeight > logEl.clientHeight) logEl.scrollTop = logEl.scrollHeight;
		});
	}

	function clearTimer() {
		if (timerId) {
			clearTimeout(timerId);
			timerId = null;
		}
	}

	function startBtop() {
		btopActive = true;
		btopTick = 0;
		if (btopTimer) clearInterval(btopTimer);
		btopTimer = setInterval(() => btopTick++, 900);
	}

	function stopBtop() {
		btopActive = false;
		if (btopTimer) {
			clearInterval(btopTimer);
			btopTimer = null;
		}
		focusInput();
	}

	function barValue(index: number): number {
		return 28 + ((btopTick * (index + 3) * 7 + index * 19) % 58);
	}

	function bar(value: number, width = 12): string {
		const filled = Math.round((value / 100) * width);
		return '█'.repeat(filled) + '░'.repeat(width - filled);
	}

	/* ------------------------------------------------------------------ */
	/* Typewriter (timestamp-driven: throttled timers catch up, and a     */
	/* hidden tab finishes instantly instead of crawling)                 */
	/* ------------------------------------------------------------------ */
	type Ev = { li: number; ci: number; at: number };
	let evs: Ev[] = [];
	let cursor = 0;
	let t0 = 0;
	let evTotal = 0;

	function buildEvents(lines: Line[]): { ev: Ev[]; total: number } {
		const ev: Ev[] = [];
		let t = 0;
		for (let li = 0; li < lines.length; li++) {
			const ln = lines[li];
			const ms = ln.t.length > 120 ? 1 : 3;
			for (let ci = 0; ci < ln.t.length; ci++) {
				t += ms;
				ev.push({ li, ci, at: t });
			}
			t += 8; // pause between lines
		}
		return { ev, total: t };
	}

	function clearBusyState() {
		typed = [];
		fullLines = [];
		evs = [];
		cursor = 0;
		evTotal = 0;
		runningRaw = '';
		busy = false;
	}

	function finishTyping() {
		if (!busy) return;
		clearTimer();
		typed = fullLines.map((l) => ({ ...l }));
		appendHistory({ input: runningRaw, lines: typed.map((l) => ({ ...l })) });
		scrollBottom();
		clearBusyState();
		scrollBottom();
	}

	function frame() {
		if (!busy) return;
		const elapsed = performance.now() - t0;
		if (cursor >= evs.length || elapsed >= evTotal) {
			finishTyping();
			return;
		}
		while (cursor < evs.length && evs[cursor].at <= elapsed) cursor++;
		if (cursor > 0) {
			const e = evs[cursor - 1];
			const line = fullLines[e.li];
			const done = e.ci === line.t.length - 1;
			typed[e.li] = done && line.u ? { ...line } : { t: line.t.slice(0, e.ci + 1), c: line.c };
		}
		scrollBottom();
		timerId = setTimeout(frame, 12);
	}

	function startTyping(lines: Line[]) {
		const { ev, total } = buildEvents(lines);
		evs = ev;
		evTotal = total;
		cursor = 0;
		t0 = performance.now();
		fullLines = lines;
		typed = lines.map((l) => ({ t: '', c: l.c, u: l.u }));
		busy = true;
		frame();
	}

	function onVisibility() {
		if (document.hidden && busy) finishTyping();
	}

	function cleanPath(raw: string, base = cwd): string {
		const source = raw.trim() || base;
		const absolute = source.startsWith('/') ? source : `${base}/${source}`;
		const parts: string[] = [];
		for (const part of absolute.split('/')) {
			if (!part || part === '.') continue;
			if (part === '..') parts.pop();
			else parts.push(part);
		}
		return `/${parts.join('/')}` || '/';
	}

	function shellArgs(raw: string): { command: string; args: string[] } {
		const bits = raw.trim().split(/\s+/).filter(Boolean);
		return { command: normalize(bits.shift() || ''), args: bits };
	}

	function shellResult(raw: string, lines: Line[]) {
		appendHistory({ input: raw, lines });
	}

	function runSandboxCommand(raw: string): boolean {
		const { command, args } = shellArgs(raw);
		if (!SHELL_COMMANDS.has(command)) return false;
		if (args[0]?.startsWith('-')) {
			shellResult(raw, [{ t: `${command}: options are not supported in the browser sandbox`, c: 'err' }]);
			return true;
		}

		if (command === 'cd') {
			if (args.length > 1) {
				shellResult(raw, [{ t: 'cd: too many arguments', c: 'err' }]);
				return true;
			}
			const target = cleanPath(args[0] || HOME);
			if (!fs[target] || fs[target].type !== 'dir') {
				shellResult(raw, [{ t: `cd: ${args[0] || target}: No such file or directory`, c: 'err' }]);
				return true;
			}
			cwd = target;
			shellResult(raw, [{ t: `now in ${cwd}  [browser sandbox]`, c: 'ok' }]);
			return true;
		}

		if (command === 'ls') {
			const target = cleanPath(args[0] || cwd);
			if (!fs[target]) {
				shellResult(raw, [{ t: `ls: cannot access '${args[0] || target}': No such file or directory`, c: 'err' }]);
				return true;
			}
			if (fs[target].type === 'file') {
				shellResult(raw, [{ t: target.split('/').pop() || target, c: 'ok' }]);
				return true;
			}
			const prefix = target === '/' ? '/' : `${target}/`;
			const names = Object.keys(fs)
				.filter((path) => path.startsWith(prefix) && path !== target && !path.slice(prefix.length).includes('/'))
				.map((path) => `${fs[path].type === 'dir' ? path.split('/').pop() + '/' : path.split('/').pop()}`)
				.sort();
			shellResult(raw, [{ t: names.join('  ') || '(empty directory)', c: 'ok' }]);
			return true;
		}

		if (!args[0]) {
			shellResult(raw, [{ t: `${command}: missing operand`, c: 'err' }]);
			return true;
		}
		const target = cleanPath(args[0]);
		if (command === 'mkdir') {
			if (fs[target]) {
				shellResult(raw, [{ t: `mkdir: cannot create directory '${args[0]}': File exists`, c: 'err' }]);
				return true;
			}
			const parent = target.slice(0, target.lastIndexOf('/')) || '/';
			if (!fs[parent] || fs[parent].type !== 'dir') {
				shellResult(raw, [{ t: `mkdir: cannot create directory '${args[0]}': No such file or directory`, c: 'err' }]);
				return true;
			}
			fs = { ...fs, [target]: { type: 'dir' } };
			shellResult(raw, [{ t: `created ${target}  [browser sandbox]`, c: 'ok' }]);
			return true;
		}

		if (command === 'touch') {
			const parent = target.slice(0, target.lastIndexOf('/')) || '/';
			if (!fs[parent] || fs[parent].type !== 'dir') {
				shellResult(raw, [{ t: `touch: cannot touch '${args[0]}': No such file or directory`, c: 'err' }]);
				return true;
			}
			fs = { ...fs, [target]: fs[target] || { type: 'file', content: '' } };
			shellResult(raw, [{ t: `touched ${target}  [browser sandbox]`, c: 'ok' }]);
			return true;
		}

		// vi opens a local textarea editor; saving only updates the in-memory map.
		const parent = target.slice(0, target.lastIndexOf('/')) || '/';
		if (!fs[parent] || fs[parent].type !== 'dir') {
			shellResult(raw, [{ t: `vi: ${args[0]}: No such file or directory`, c: 'err' }]);
			return true;
		}
		viPath = target;
		viBuffer = fs[target]?.content || '';
		viSaved = true;
		viMode = true;
		focusInput();
		return true;
	}

	function saveVi() {
		fs = { ...fs, [viPath]: { type: 'file', content: viBuffer } };
		viSaved = true;
	}

	function closeVi() {
		viMode = false;
		focusInput();
	}

	/**
	 * Scroll the page to a section. This is what makes the terminal a way to
	 * actually get around the site rather than a toy that only prints text —
	 * on a laptop the terminal would otherwise be a dead end at the top of a
	 * long page.
	 */
	function gotoSection(raw: string, arg?: string) {
		const key = (arg ?? '').toLowerCase();
		const id = SECTIONS[key];

		if (!id) {
			history = [
				...history,
				{
					input: raw,
					lines: [
						{ t: `goto: unknown section${arg ? ` '${arg}'` : ''}`, c: 'err' },
						{ t: `sections: ${Object.keys(SECTIONS).join(' · ')}`, c: 'dim' }
					]
				}
			];
			scrollBottom();
			return;
		}

		// Respect the OS motion setting — a long smooth scroll is exactly the
		// kind of movement that triggers motion sickness.
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
		history = [...history, { input: raw, lines: [{ t: `→ ${key}`, c: 'ok' }] }];
		scrollBottom();
	}

	function runCommand(raw: string) {
		const name = normalize(raw);

		if (runSandboxCommand(raw)) return;

		// `/goto <section>` keeps its operand: `normalize()` folds the whole
		// string, so "goto projects" would never match CMD_ORDER below.
		const parsed = shellArgs(raw);
		if (parsed.command === 'goto') {
			gotoSection(raw, parsed.args[0]);
			return;
		}

		if (name === 'btop') {
			startBtop();
			return;
		}
		if (name === 'clear') {
			stopBtop();
			clearTimer();
			clearBusyState();
			history = [];
			return;
		}
		if (name === 'secret') {
			history = [...history, { input: raw, lines: [{ t: art, c: 'art' }] }];
			scrollBottom();
			return;
		}
		if (!CMD_ORDER.includes(name)) {
			history = [
				...history,
				{
					input: raw,
					lines: [
						{ t: `command not found: ${raw}`, c: 'err' },
						{ t: 'type /help to list available commands', c: 'dim' }
					]
				}
			];
			scrollBottom();
			return;
		}

		const built = build(name);
		if (!built) return;

		// typed output
		runningRaw = raw;
		startTyping(built.lines);
	}

	/* ------------------------------------------------------------------ */
	/* Keyboard                                                            */
	/* ------------------------------------------------------------------ */
	function onKeyDown(e: KeyboardEvent) {
		if (viMode) {
			if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
				e.preventDefault();
				saveVi();
				return;
			}
			if (e.key === 'Escape') {
				e.preventDefault();
				closeVi();
			}
			return;
		}
		if (e.key === 'Enter') {
			e.preventDefault();
			if (busy) {
				finishTyping();
				return;
			}
			const raw = input.trim();
			if (!raw) return;
			if (usedInputs[usedInputs.length - 1] !== raw) usedInputs.push(raw);
			histIdx = null;
			input = '';
			runCommand(raw);
			return;
		}
		if (busy && e.key.length === 1) {
			finishTyping(); // printable key skips the animation
			return;
		}
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (busy) finishTyping();
			if (usedInputs.length === 0) return;
			histIdx = histIdx === null ? usedInputs.length - 1 : Math.max(0, histIdx - 1);
			input = usedInputs[histIdx];
			return;
		}
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (busy) finishTyping();
			if (histIdx === null) return;
			histIdx++;
			if (histIdx >= usedInputs.length) {
				histIdx = null;
				input = '';
			} else {
				input = usedInputs[histIdx];
			}
			return;
		}
		if (e.key === 'Tab') {
			e.preventDefault();
			if (busy) finishTyping();
			const base = normalize(input);
			if (!base) return;
			const prefixed = /^\/+/.test(input.trim());
			const matches = CMD_ORDER.filter((c) => c.startsWith(base));
			if (matches.length === 0) return;
			input = (prefixed ? '/' : '') + matches[0];
			return;
		}
		if (e.key === 'Escape') {
			if (btopActive) stopBtop();
			input = '';
			return;
		}
		if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
			e.preventDefault();
			stopBtop();
			clearTimer();
			clearBusyState();
			history = [];
			return;
		}
	}

	function focusInput() {
		// preventScroll matters: this runs on mount to make the terminal
		// immediately typeable, and a plain .focus() scrolls the document to
		// reveal the input — landing every visitor ~374px down the page with
		// the header and hero off-screen. Focusing without scrolling keeps the
		// convenience without hijacking the viewport.
		inputEl?.focus({ preventScroll: true });
	}

	onMount(() => {
		history = [
			{
				input: '',
				lines: [
					{ t: 'xenochromia :: interactive portfolio terminal', c: 'ok' },
					{ t: 'type /help for commands  ·  ↑/↓ history  ·  tab autocomplete', c: 'dim' },
					{ t: '' }
				]
			}
		];
		focusInput();
		document.addEventListener('visibilitychange', onVisibility);
		return () => {
			clearTimer();
			if (btopTimer) clearInterval(btopTimer);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	});
</script>

<div
	class="term-root absolute flex flex-col overflow-hidden border border-white/5 bg-[#04070a]/95 font-mono leading-[1.45] shadow-[0_0_24px_rgba(0,0,0,0.6)_inset,0_0_18px_rgba(61,255,160,0.06)] select-none"
	style="inset: 1.4% 3.4% 3.8% 3.1%;"
	role="application"
	aria-label="Interactive terminal portfolio"
	onclick={focusInput}
>
	<!-- CRT overlays -->
	<div class="pointer-events-none absolute inset-0 z-20 scanlines" aria-hidden="true"></div>
	<div class="pointer-events-none absolute inset-0 z-20 vignette" aria-hidden="true"></div>

	<!-- title bar -->
	<div class="relative z-10 flex h-[34px] shrink-0 items-center gap-2 border-b border-white/5 bg-white/[0.03] px-3">
		<span class="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-[#febc2e]"></span>
		<span class="h-2.5 w-2.5 rounded-full bg-[#28c840]"></span>
		<span class="ml-2 truncate text-[0.87em] tracking-wide text-white/40">waimeng@debian — zsh</span>
		<span class="ml-auto hidden shrink-0 text-[0.87em] tracking-wide text-white/25 sm:block">xeno://portfolio</span>
	</div>

	<!-- log -->
	<div
		class="term-log relative z-10 min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3.5 py-2.5 text-[#d6efe2]"
		bind:this={logEl}
	>
		{#if btopActive}
			<div class="btop-ui mt-1 space-y-1 text-[0.87em] leading-tight">
				<div class="flex items-center justify-between border-b border-[#3dffa0]/30 pb-1 text-[#3dffa0]">
					<span>◈ btop — xenochromia</span><span class="text-white/45">ESC: exit</span>
				</div>
				<div class="grid grid-cols-2 gap-x-3 gap-y-2 pt-1">
					{#each BtopBars as label, i}
						{@const value = barValue(i)}
						<div class="min-w-0">
							<div class="flex justify-between text-white/65"><span>{label}</span><span>{value}%</span></div>
							<div class="whitespace-nowrap text-[#3dffa0]">{bar(value)}</div>
						</div>
					{/each}
				</div>
				<div class="mt-2 border-t border-white/10 pt-1 text-white/55">PID   COMMAND          CPU%   MEM%</div>
				<div class="text-[#6fd3ff]">1024  node build        {barValue(0)}.2    4.8</div>
				<div class="text-[#ffd479]">2048  sveltekit         {barValue(1)}.1    2.1</div>
				<div class="text-white/45">3141  sshd              0.0    0.4</div>
				<div class="pt-1 text-white/40">uptime  04:27:18   load  {((barValue(0) / 100) * 2).toFixed(2)}  {btopTick % 2 ? '▂▄▆█' : '▁▃▅▇'}</div>
			</div>
		{:else}
		{#each history as entry}
			<div class="mt-1">
				{#if entry.input}
					<div class="break-words">
						<span class="c-user">waimeng</span><span class="text-white/30">@</span><span class="c-host">debian</span><span class="text-white/30">:</span><span class="c-path">{cwd === HOME ? '~' : cwd.replace(HOME, '~')}</span><span class="c-user">$</span> <span class="text-white/80">{entry.input}</span>
					</div>
				{/if}
				{#each entry.lines as line}
					{#if line.u}
						<div class="break-words">
							<a href={line.u} target="_blank" rel="noopener" class="c-link underline decoration-dotted underline-offset-2 hover:decoration-solid">{line.t}</a>
						</div>
					{:else if line.c === 'art'}
						<div class="overflow-x-auto py-1" aria-hidden="true">
							<pre class="art-pre whitespace-pre">{line.t}</pre>
						</div>
					{:else}
						<div class="break-words {cl(line.c)}">{line.t}</div>
					{/if}
				{/each}
			</div>
		{/each}

		{#if busy}
			<div class="mt-1">
				<div class="break-words">
					<span class="c-user">waimeng</span><span class="text-white/30">@</span><span class="c-host">debian</span><span class="text-white/30">:</span><span class="c-path">{cwd === HOME ? '~' : cwd.replace(HOME, '~')}</span><span class="c-user">$</span> <span class="text-white/80">{runningRaw}</span>
				</div>
				{#each typed as line}
					<div class="break-words {cl(line.c)}">{line.t}</div>
				{/each}
			</div>
		{/if}
		{/if}
	</div>

	<!-- input row -->
	<div class="relative z-10 flex shrink-0 items-center gap-1.5 border-t border-white/5 bg-white/[0.02] px-3.5 py-2.5">
		<span class="shrink-0">
			<span class="c-user">waimeng</span><span class="text-white/30">@</span><span class="c-host">debian</span><span class="text-white/30">:</span><span class="c-path">{cwd === HOME ? '~' : cwd.replace(HOME, '~')}</span><span class="c-user">$</span>
		</span>
		<label class="sr-only" for="term-input">terminal input</label>
		{#if viMode}
			<div class="vi-overlay absolute inset-0 z-30 flex flex-col bg-[#050908] p-3 font-mono text-[0.96em] text-[#d6efe2]">
				<div class="mb-2 flex items-center justify-between border-b border-[#3dffa0]/30 pb-1 text-[#3dffa0]">
					<span>vi — {viPath}</span><span>{viSaved ? 'saved' : 'modified'}</span>
				</div>
				<textarea
					class="min-h-0 flex-1 resize-none bg-transparent font-mono text-[0.96em] leading-relaxed text-[#eafff3] outline-none"
					bind:value={viBuffer}
					oninput={() => (viSaved = false)}
					onkeydown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveVi(); } else if (e.key === 'Escape') { e.preventDefault(); closeVi(); } }}
					aria-label="sandbox vi editor"
				></textarea>
				<div class="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-white/45">
					<span>local browser sandbox · no homelab access</span>
					<span><button class="vi-button" onclick={saveVi}>Ctrl-S save</button> · <button class="vi-button" onclick={closeVi}>Esc close</button></span>
				</div>
			</div>
		{/if}

		<input
			id="term-input"
			bind:this={inputEl}
			type="text"
			autocomplete="off"
			autocapitalize="off"
			spellcheck="false"
			class="term-input w-full cursor-text bg-transparent font-mono text-[1em] text-[#eafff3] caret-[#3dffa0] outline-none"
			bind:value={input}
			onkeydown={onKeyDown}
			onfocus={() => (inputFocused = true)}
			onblur={() => (inputFocused = false)}
			placeholder="type /help"
		/>

	</div>
</div>

<style>
	.term-root {
		cursor: text;
		/* Type and corner radius scale with the SCREEN box, not the viewport:
		   `cqw` resolves against the size container set up in CrtScreen.
		   Previously the root was pinned at 11.5px with fixed 16-18px insets,
		   which ate ~15% of a phone-sized screen and made the type either
		   clipped or comically small. Inner sizes are `em` so they follow. */
		/* The container is the 68%-wide screen layer, so 1cqw is 1% of the
		   screen box, not of the artwork. 3.3cqw lands on the original 11.5px
		   at a ~350px screen box; the 9px floor keeps a phone legible. */
		font-size: clamp(9px, 3.3cqw, 12px);
		border-radius: clamp(6px, 3.4cqw, 18px);
	}
	.term-log::-webkit-scrollbar {
		width: 5px;
	}
	.term-log::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.12);
		border-radius: 99px;
	}
	.term-log::-webkit-scrollbar-track {
		background: transparent;
	}
	.term-log {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
	}
	/* CRT effects */
	.scanlines {
		background: repeating-linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0.025) 0px,
			rgba(255, 255, 255, 0.025) 1px,
			rgba(0, 0, 0, 0) 1px,
			rgba(0, 0, 0, 0) 3px
		);
		mix-blend-mode: overlay;
	}
	.vignette {
		background: radial-gradient(120% 90% at 50% 40%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0.42) 100%);
	}
	.term-cursor {
		animation: blink 1.1s steps(1) infinite;
	}
	.term-cursor.dimmed {
		opacity: 0.45;
	}
	@keyframes blink {
		0%,
		55% {
			opacity: 1;
		}
		56%,
		100% {
			opacity: 0;
		}
	}
	/* palette */
	.c-user {
		color: #3dffa0;
	}
	.c-host {
		color: #b48bff;
	}
	.c-path {
		color: #ffd479;
	}
	.c-dim {
		color: rgba(214, 239, 226, 0.45);
	}
	.c-err {
		color: #ff7b6e;
	}
	.c-ok {
		color: #3dffa0;
	}
	.c-hl {
		color: #6fd3ff;
	}
	.c-warn {
		color: #ffd479;
	}
	.c-link {
		color: #6fd3ff;
	}
	.art-pre {
		font-size: 4.4px;
		line-height: 1.12;
		color: #3dffa0;
	}
	@media (min-width: 640px) {
		.art-pre {
			font-size: 5.4px;
		}
	}
</style>
