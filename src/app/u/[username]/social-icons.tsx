import { TwitterLogo, LinkedinLogo, GithubLogo, Globe } from "@phosphor-icons/react/dist/ssr";

interface Props {
  links: { twitter?: string; linkedin?: string; github?: string; website?: string };
}

const ITEMS = [
  { key: "twitter" as const, Icon: TwitterLogo, label: "Twitter" },
  { key: "linkedin" as const, Icon: LinkedinLogo, label: "LinkedIn" },
  { key: "github" as const, Icon: GithubLogo, label: "GitHub" },
  { key: "website" as const, Icon: Globe, label: "Website" },
];

export function SocialIcons({ links }: Props) {
  const active = ITEMS.filter(({ key }) => links[key]);
  if (active.length === 0) return null;

  return (
    <div className="flex items-center gap-3">
      {active.map(({ key, Icon, label }) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-neutral-500 hover:text-white transition-colors"
        >
          <Icon size={18} />
        </a>
      ))}
    </div>
  );
}
