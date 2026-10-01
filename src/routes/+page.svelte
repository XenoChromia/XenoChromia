<script lang="ts">
	import { Mail, Github, Linkedin } from 'lucide-svelte';
	import Terminal from '$lib/components/Terminal.svelte';
	import CrtScreen from '$lib/components/CrtScreen.svelte';
	import art from '$lib/assets/art.txt?raw';
	import {
		profile,
		socials,
		certifications,
		education,
		skillGroups,
		projects,
		site
	} from '$lib/content';

	/**
	 * The terminal is the site's signature, but a portfolio that hides every
	 * credential behind typing `/certifications` loses almost every visitor.
	 * The hero keeps the CRT; the sections below make the record scannable.
	 */

	const icons = { mail: Mail, github: Github, linkedin: Linkedin } as const;
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>{site.title}</title>
	<meta name="description" content={site.description} />
</svelte:head>

<!-- Keyboard users must be able to jump the chrome (WCAG 2.4.1). -->
<a
	href="#main"
	class="sr-only rounded-sm bg-accent px-4 py-2 font-mono text-sm font-semibold text-canvas focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
>
	Skip to content
</a>

<div class="min-h-dvh">
	<header class="border-b border-line">
		<div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
			<a
				href="/"
				class="inline-flex min-h-11 items-center font-mono text-sm font-semibold tracking-tight text-body"
			>
				<span class="text-accent">~</span>/xenochromia
			</a>
			<nav aria-label="Primary">
				<ul class="flex items-center gap-1 font-mono text-sm">
					<li>
						<a
							href="#certifications"
							class="inline-flex min-h-11 items-center rounded-sm px-3 text-body-muted transition-colors hover:text-accent"
						>
							certifications
						</a>
					</li>
					<li>
						<a
							href="#projects"
							class="inline-flex min-h-11 items-center rounded-sm px-3 text-body-muted transition-colors hover:text-accent"
						>
							projects
						</a>
					</li>
					<li>
						<a
							href="#contact"
							class="inline-flex min-h-11 items-center rounded-sm px-3 text-body-muted transition-colors hover:text-accent"
						>
							contact
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</header>

	<main id="main">
		<!-- ---------------------------------------------------------------- -->
		<!-- Hero                                                             -->
		<!-- ---------------------------------------------------------------- -->
		<section
			aria-labelledby="hero-heading"
			class="overflow-x-clip border-b border-line"
		>
			<div
				class="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-3 lg:gap-14 lg:px-10 lg:py-14"
			>
				<div class="hero-art lg:col-span-2">
					<CrtScreen
						art="/comp.svg"
						bleed={true}
						alt="Illustration of a retro CRT computer. Its screen is an interactive terminal."
					>
						<Terminal {art} />
					</CrtScreen>
					<p class="mt-4 font-mono text-xs text-body-faint">
						<span aria-hidden="true">▲</span>
						The screen is live — try <span class="text-accent">/help</span>. Arrow keys for
						history, Tab to complete.
					</p>
				</div>

				<div class="flex flex-col items-start gap-6">
					<!-- width/height reserved so the avatar cannot shift layout -->
					<img
						src="/pfp.jpg"
						alt=""
						width="208"
						height="208"
						class="h-40 w-40 shrink-0 rounded-full object-cover ring-2 ring-line-strong lg:h-52 lg:w-52"
					/>
					<div class="flex flex-col gap-3">
						<h1
							id="hero-heading"
							class="font-mono text-3xl font-bold tracking-tight text-body lg:text-4xl"
						>
							Hello, I&rsquo;m {profile.shortName}
						</h1>
						<p class="text-lg text-body-muted">{profile.headline}</p>
						<p class="max-w-prose text-body-muted">{profile.blurb}</p>
					</div>

					<ul class="flex flex-wrap gap-2">
						{#each socials as s (s.label)}
							{@const Icon = icons[s.icon]}
							<li>
								<a
									href={s.href}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line-strong px-4 py-2 font-mono text-sm text-body transition-colors hover:border-accent hover:text-accent"
								>
									<Icon size={18} aria-hidden="true" />
									<span>{s.label}</span>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<!-- ---------------------------------------------------------------- -->
		<!-- Certifications                                                   -->
		<!-- ---------------------------------------------------------------- -->
		<section
			id="certifications"
			aria-labelledby="certifications-heading"
			class="border-b border-line"
		>
			<div class="mx-auto max-w-7xl px-6 py-14 lg:px-10">
				<h2
					id="certifications-heading"
					class="font-mono text-2xl font-bold tracking-tight text-body"
				>
					Certifications
				</h2>
				<p class="mt-2 max-w-prose text-body-muted">
					Three vendor certifications, all completed alongside full-time study.
				</p>

				<ul class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
					{#each certifications as cert (cert.name)}
						<li
							class="flex flex-col gap-3 rounded-md border border-line bg-surface p-5 transition-colors hover:border-line-strong"
						>
							<div class="flex items-start justify-between gap-3">
								<h3 class="font-mono text-base font-semibold text-body">{cert.name}</h3>
								<time datetime={cert.iso} class="shrink-0 font-mono text-xs text-body-faint">
									{cert.date}
								</time>
							</div>
							<p class="font-mono text-xs tracking-wide text-accent">{cert.issuer}</p>
							<ul class="flex flex-col gap-2 text-sm text-body-muted">
								{#each cert.highlights as h (h)}
									<li class="flex gap-2">
										<span aria-hidden="true" class="mt-1 shrink-0 text-accent-dim">▸</span>
										<span>{h}</span>
									</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- ---------------------------------------------------------------- -->
		<!-- Skills + education                                               -->
		<!-- ---------------------------------------------------------------- -->
		<section aria-labelledby="skills-heading" class="border-b border-line">
			<div class="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-14 lg:grid-cols-3 lg:px-10">
				<div class="lg:col-span-2">
					<h2 id="skills-heading" class="font-mono text-2xl font-bold tracking-tight text-body">
						Skills
					</h2>
					<div class="mt-8 flex flex-col gap-7">
						{#each skillGroups as group (group.label)}
							<div>
								<h3 class="font-mono text-xs font-semibold tracking-widest text-accent uppercase">
									{group.label}
								</h3>
								<ul class="mt-3 flex flex-wrap gap-2">
									{#each group.items as item (item)}
										<li
											class="rounded-sm border border-line bg-surface px-3 py-1.5 font-mono text-sm text-body-muted"
										>
											{item}
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				</div>

				<div>
					<h2 class="font-mono text-2xl font-bold tracking-tight text-body">Education</h2>
					<ul class="mt-8 flex flex-col gap-6">
						{#each education as e (e.institution)}
							<li class="flex flex-col gap-1 border-l-2 border-accent-dim pl-4">
								<h3 class="font-mono text-base font-semibold text-body">{e.institution}</h3>
								<p class="text-sm text-body-muted">{e.qualification}</p>
								<p class="font-mono text-xs text-body-faint">
									<time datetime={e.iso}>{e.period}</time>
									<span aria-hidden="true"> · </span>{e.location}
								</p>
								{#each e.honours as h (h)}
									<p class="mt-1 font-mono text-xs text-accent">{h}</p>
								{/each}
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<!-- ---------------------------------------------------------------- -->
		<!-- Projects                                                         -->
		<!-- ---------------------------------------------------------------- -->
		<section id="projects" aria-labelledby="projects-heading" class="border-b border-line">
			<div class="mx-auto max-w-7xl px-6 py-14 lg:px-10">
				<h2 id="projects-heading" class="font-mono text-2xl font-bold tracking-tight text-body">
					Projects
				</h2>
				<p class="mt-2 max-w-prose text-body-muted">
					Everything listed here is public and viewable.
				</p>

				<ul class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
					{#each projects as p (p.name)}
						<li
							class="flex flex-col gap-3 rounded-md border border-line bg-surface p-5 transition-colors hover:border-line-strong"
						>
							<div class="flex items-center justify-between gap-3">
								<h3 class="font-mono text-base font-semibold text-body">
									{#if p.href}
										<a
											href={p.href}
											target="_blank"
											rel="noopener noreferrer"
											class="inline-flex min-h-11 items-center gap-1.5 text-body underline decoration-dotted underline-offset-4 hover:text-accent"
										>
											{p.name}
											<span class="sr-only">(opens in a new tab)</span>
										</a>
									{:else}
										{p.name}
									{/if}
								</h3>
								<span
									class="shrink-0 rounded-sm border border-line-strong px-2 py-0.5 font-mono text-xs text-body-faint"
								>
									{p.status === 'shipped' ? 'shipped' : 'in progress'}
								</span>
							</div>
							<p class="text-sm text-body-muted">{p.description}</p>
							<ul class="flex flex-wrap gap-2">
								{#each p.tags as tag (tag)}
									<li class="font-mono text-xs text-accent-dim">#{tag}</li>
								{/each}
							</ul>
						</li>
					{/each}
				</ul>
			</div>
		</section>

		<!-- ---------------------------------------------------------------- -->
		<!-- Contact                                                          -->
		<!-- ---------------------------------------------------------------- -->
		<section id="contact" aria-labelledby="contact-heading">
			<div class="mx-auto max-w-7xl px-6 py-14 lg:px-10">
				<h2 id="contact-heading" class="font-mono text-2xl font-bold tracking-tight text-body">
					Contact
				</h2>
				<p class="mt-2 max-w-prose text-body-muted">
					Open to internships and to talking to people building interesting things.
				</p>
				<p class="mt-6">
					<a
						href="mailto:{profile.email}"
						class="inline-flex min-h-11 items-center rounded-sm bg-accent px-5 py-2.5 font-mono text-sm font-semibold text-canvas transition-colors hover:bg-accent-bright"
					>
						{profile.email}
					</a>
				</p>
			</div>
		</section>
	</main>

	<footer class="border-t border-line">
		<div
			class="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 font-mono text-xs text-body-faint lg:flex-row lg:items-center lg:justify-between lg:px-10"
		>
			<p>© {year} {profile.name}</p>
			<p>
				Built with SvelteKit &middot; <a
					href="https://github.com/XenoChromia/XenoChromia"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-block py-2 underline decoration-dotted underline-offset-2 hover:text-accent"
					>source</a
				>
			</p>
		</div>
	</footer>
</div>

<style>
	/*
	 * Push the hero artwork fully to the viewport's left edge.
	 *
	 * The artwork is cropped *in the file*: the machine is sliced vertically by
	 * its own left edge, while its other three edges are transparent padding.
	 * Rendered inside the centred `max-w-7xl` container it therefore floated
	 * ~120px in, leaving a hard vertical cut with page background to its left —
	 * which reads as a broken image rather than a deliberate crop.
	 *
	 * The container's left inset is
	 *     max(0px, (100vw - 80rem) / 2)   <- centring of the 80rem container
	 *   + 2.5rem                          <- its lg:px-10 gutter
	 * so negating exactly that lands the art on x=0 at every width, and the cut
	 * becomes the page edge.
	 *
	 * Only margin-left is adjusted: the art keeps its aspect-capped width, so
	 * nothing overflows to the right. It can reach ~7px past the left edge at
	 * wide viewports, because `100vw` includes the scrollbar while the
	 * container's centring is measured against the content box — the section's
	 * `overflow-x-clip` trims that remainder so the cut lands exactly on x=0.
	 * `clip` rather than `hidden`: it does not create a scroll container.
	 */
	@media (min-width: 64rem) {
		.hero-art {
			margin-left: calc(-1 * (max(0px, (100vw - 80rem) / 2) + 2.5rem));
		}
	}
</style>
