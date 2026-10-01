/**
 * Single source of truth for everything the site claims.
 *
 * Facts here are transcribed from the user's Google Drive `Resume.docx`
 * (modified 2025-09-02) and the existing site copy. Presentation work must not
 * silently rewrite a claim — if something here needs updating, it needs the
 * user, not a guess. Items flagged `// VERIFY` are ones where the source
 * contradicts itself.
 *
 * Views import from here so a fact lives in exactly one place.
 */

export interface SocialLink {
	/** Human-readable name — also the accessible name of the icon link. */
	label: string;
	href: string;
	/** Inline SVG path data for the icon. */
	icon: 'mail' | 'github' | 'linkedin';
}

export interface Certification {
	name: string;
	issuer: string;
	date: string;
	/** ISO 8601 for <time datetime>. */
	iso: string;
	highlights: string[];
}

export interface SkillGroup {
	label: string;
	items: string[];
}

export interface Project {
	name: string;
	description: string;
	tags: string[];
	href?: string;
	status: 'shipped' | 'in-progress';
}

export const profile = {
	name: 'Wai Meng Leong',
	shortName: 'Wai Meng',
	role: 'Information Technology student',
	// VERIFY: the resume header says "Year 0 - Current"; the live site says
	// "Y2". Poly years are normally 1-3, so "Year 0" looks like a typo for
	// "Year 1" — but the two sources disagree, so the least committal true
	// statement is used here until the user confirms.
	headline: 'Second-year IT student at Ngee Ann Polytechnic',
	location: 'Singapore',
	blurb:
		'Building things for the web and learning in public. Currently looking for internship and networking opportunities for 2026.',
	email: 'leongwm06tj@gmail.com'
} as const;

export const socials: SocialLink[] = [
	// A real mailto:, not a Gmail compose deep-link. The old compose URL
	// carried a session-specific token and broke for anyone who was not
	// already signed into that exact Google account.
	{ label: 'Email', href: `mailto:${profile.email}`, icon: 'mail' },
	{ label: 'GitHub', href: 'https://github.com/XenoChromia', icon: 'github' },
	{
		label: 'LinkedIn',
		href: 'https://www.linkedin.com/in/leong-wai-meng-990897278/',
		icon: 'linkedin'
	}
];

export const education = [
	{
		institution: 'Ngee Ann Polytechnic',
		qualification: 'Diploma in Information Technology',
		location: 'Singapore',
		period: 'April 2024 – Present',
		iso: '2024-04',
		honours: ["Director's List — Year 1, Semester 2"]
	}
] as const;

export const certifications: Certification[] = [
	{
		name: 'AWS Certified Cloud Practitioner',
		issuer: 'Amazon Web Services',
		date: 'June 2025',
		iso: '2025-06',
		highlights: [
			'Cloud security measures, managed databases and compute sizing.',
			'Hands-on with IAM, RDS and EC2.'
		]
	},
	{
		name: 'Oracle Certified Professional — Generative AI',
		issuer: 'Oracle',
		date: 'July 2024',
		iso: '2024-07',
		highlights: [
			'Fine-tuning, encoders/decoders and retrieval-augmented generation.',
			'How models, user input and vector databases combine to produce a response.'
		]
	},
	{
		name: 'Google Project Management',
		issuer: 'Coursera',
		date: 'August 2025',
		iso: '2025-08',
		highlights: [
			'Project lifecycles, risk management and stakeholder communication.',
			'Agile and Scrum delivery tracked in Jira.'
		]
	}
];

export const skillGroups: SkillGroup[] = [
	{
		label: 'Languages',
		items: ['TypeScript', 'JavaScript', 'Python', 'C#', 'Go', 'HTML', 'CSS']
	},
	{
		label: 'Frameworks',
		items: ['SvelteKit', 'Svelte', 'React', 'Next.js']
	},
	{
		label: 'Systems & cloud',
		items: ['AWS', 'Linux', 'Windows', 'Git']
	},
	{
		label: 'Practices',
		items: ['Agile / Scrum', 'Responsive design', 'Accessibility (WCAG)']
	}
];

/**
 * Only projects that demonstrably exist are listed. An empty-looking sections
 * is worse than a short one — nothing here is invented.
 */
export const projects: Project[] = [
	{
		name: 'XenoChromia',
		description:
			'This site. A SvelteKit portfolio with an interactive in-browser terminal that runs on a sandboxed filesystem.',
		tags: ['SvelteKit', 'TypeScript', 'Tailwind CSS'],
		href: 'https://github.com/XenoChromia/XenoChromia',
		status: 'in-progress'
	}
];

/** Handy for meta tags and JSON-LD. */
export const site = {
	title: `${profile.name} — ${profile.role}`,
	description: `${profile.headline}. ${profile.blurb}`,
	url: 'https://waimeng.moe'
} as const;
