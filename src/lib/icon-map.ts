import {
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, ArrowsClockwise, ArrowBendUpRight,
  ArrowSquareOut, ArrowCounterClockwise, CaretRight, CaretDown,
  House, MagnifyingGlass, Gear, User, Users, Bell, Envelope, ChatCircle,
  Heart, Star, BookmarkSimple, Share, Download, Upload, Trash, PencilSimple,
  Plus, Minus, Check, X, Warning, Info, Question, Lightning,
  Play, Pause, SkipForward, Camera, Microphone, VideoCamera, MusicNote,
  Globe, MapPin, Phone, Calendar, Clock, Lock, Key, Shield,
  Eye, EyeSlash, Sun, Moon, Cloud, Fire, Leaf, Drop,
  Laptop, DeviceMobile, Printer, WifiHigh,
  CurrencyDollar, ChartBar, Briefcase, Buildings, Handshake,
  Trophy, Target, Flag, Rocket, Lightbulb, PuzzlePiece, Crown,
  GithubLogo, LinkedinLogo, TwitterLogo, InstagramLogo, YoutubeLogo,
  FacebookLogo, TiktokLogo, DribbbleLogo,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export interface IconEntry {
  name: string;
  label: string;
  component: Icon;
  category: string;
}

export const ICON_CATEGORIES = [
  "Arrows",
  "UI",
  "Media",
  "Social",
  "Business",
  "Objects",
  "Nature",
] as const;

export type IconCategory = (typeof ICON_CATEGORIES)[number];

export const CURATED_ICONS: IconEntry[] = [
  { name: "ArrowRight", label: "Arrow Right", component: ArrowRight, category: "Arrows" },
  { name: "ArrowLeft", label: "Arrow Left", component: ArrowLeft, category: "Arrows" },
  { name: "ArrowUp", label: "Arrow Up", component: ArrowUp, category: "Arrows" },
  { name: "ArrowDown", label: "Arrow Down", component: ArrowDown, category: "Arrows" },
  { name: "ArrowsClockwise", label: "Refresh", component: ArrowsClockwise, category: "Arrows" },
  { name: "ArrowBendUpRight", label: "Arrow Bend", component: ArrowBendUpRight, category: "Arrows" },
  { name: "ArrowSquareOut", label: "External Link", component: ArrowSquareOut, category: "Arrows" },
  { name: "ArrowCounterClockwise", label: "Undo", component: ArrowCounterClockwise, category: "Arrows" },
  { name: "CaretRight", label: "Caret Right", component: CaretRight, category: "Arrows" },
  { name: "CaretDown", label: "Caret Down", component: CaretDown, category: "Arrows" },

  { name: "House", label: "Home", component: House, category: "UI" },
  { name: "MagnifyingGlass", label: "Search", component: MagnifyingGlass, category: "UI" },
  { name: "Gear", label: "Settings", component: Gear, category: "UI" },
  { name: "User", label: "User", component: User, category: "UI" },
  { name: "Users", label: "Users", component: Users, category: "UI" },
  { name: "Bell", label: "Notification", component: Bell, category: "UI" },
  { name: "Envelope", label: "Email", component: Envelope, category: "UI" },
  { name: "ChatCircle", label: "Chat", component: ChatCircle, category: "UI" },
  { name: "Heart", label: "Heart", component: Heart, category: "UI" },
  { name: "Star", label: "Star", component: Star, category: "UI" },
  { name: "BookmarkSimple", label: "Bookmark", component: BookmarkSimple, category: "UI" },
  { name: "Share", label: "Share", component: Share, category: "UI" },
  { name: "Download", label: "Download", component: Download, category: "UI" },
  { name: "Upload", label: "Upload", component: Upload, category: "UI" },
  { name: "Trash", label: "Trash", component: Trash, category: "UI" },
  { name: "PencilSimple", label: "Edit", component: PencilSimple, category: "UI" },
  { name: "Plus", label: "Plus", component: Plus, category: "UI" },
  { name: "Minus", label: "Minus", component: Minus, category: "UI" },
  { name: "Check", label: "Check", component: Check, category: "UI" },
  { name: "X", label: "Close", component: X, category: "UI" },
  { name: "Warning", label: "Warning", component: Warning, category: "UI" },
  { name: "Info", label: "Info", component: Info, category: "UI" },
  { name: "Question", label: "Question", component: Question, category: "UI" },
  { name: "Lightning", label: "Lightning", component: Lightning, category: "UI" },

  { name: "Play", label: "Play", component: Play, category: "Media" },
  { name: "Pause", label: "Pause", component: Pause, category: "Media" },
  { name: "SkipForward", label: "Skip Forward", component: SkipForward, category: "Media" },
  { name: "Camera", label: "Camera", component: Camera, category: "Media" },
  { name: "Microphone", label: "Microphone", component: Microphone, category: "Media" },
  { name: "VideoCamera", label: "Video", component: VideoCamera, category: "Media" },
  { name: "MusicNote", label: "Music", component: MusicNote, category: "Media" },

  { name: "GithubLogo", label: "GitHub", component: GithubLogo, category: "Social" },
  { name: "LinkedinLogo", label: "LinkedIn", component: LinkedinLogo, category: "Social" },
  { name: "TwitterLogo", label: "Twitter / X", component: TwitterLogo, category: "Social" },
  { name: "InstagramLogo", label: "Instagram", component: InstagramLogo, category: "Social" },
  { name: "YoutubeLogo", label: "YouTube", component: YoutubeLogo, category: "Social" },
  { name: "FacebookLogo", label: "Facebook", component: FacebookLogo, category: "Social" },
  { name: "TiktokLogo", label: "TikTok", component: TiktokLogo, category: "Social" },
  { name: "DribbbleLogo", label: "Dribbble", component: DribbbleLogo, category: "Social" },

  { name: "CurrencyDollar", label: "Dollar", component: CurrencyDollar, category: "Business" },
  { name: "ChartBar", label: "Chart", component: ChartBar, category: "Business" },
  { name: "Briefcase", label: "Briefcase", component: Briefcase, category: "Business" },
  { name: "Buildings", label: "Buildings", component: Buildings, category: "Business" },
  { name: "Handshake", label: "Handshake", component: Handshake, category: "Business" },
  { name: "Trophy", label: "Trophy", component: Trophy, category: "Business" },
  { name: "Target", label: "Target", component: Target, category: "Business" },
  { name: "Flag", label: "Flag", component: Flag, category: "Business" },
  { name: "Rocket", label: "Rocket", component: Rocket, category: "Business" },
  { name: "Lightbulb", label: "Lightbulb", component: Lightbulb, category: "Business" },
  { name: "PuzzlePiece", label: "Puzzle", component: PuzzlePiece, category: "Business" },
  { name: "Crown", label: "Crown", component: Crown, category: "Business" },

  { name: "Globe", label: "Globe", component: Globe, category: "Objects" },
  { name: "MapPin", label: "Map Pin", component: MapPin, category: "Objects" },
  { name: "Phone", label: "Phone", component: Phone, category: "Objects" },
  { name: "Calendar", label: "Calendar", component: Calendar, category: "Objects" },
  { name: "Clock", label: "Clock", component: Clock, category: "Objects" },
  { name: "Lock", label: "Lock", component: Lock, category: "Objects" },
  { name: "Key", label: "Key", component: Key, category: "Objects" },
  { name: "Shield", label: "Shield", component: Shield, category: "Objects" },
  { name: "Eye", label: "Eye", component: Eye, category: "Objects" },
  { name: "EyeSlash", label: "Eye Slash", component: EyeSlash, category: "Objects" },
  { name: "Laptop", label: "Laptop", component: Laptop, category: "Objects" },
  { name: "DeviceMobile", label: "Mobile", component: DeviceMobile, category: "Objects" },
  { name: "Printer", label: "Printer", component: Printer, category: "Objects" },
  { name: "WifiHigh", label: "WiFi", component: WifiHigh, category: "Objects" },

  { name: "Sun", label: "Sun", component: Sun, category: "Nature" },
  { name: "Moon", label: "Moon", component: Moon, category: "Nature" },
  { name: "Cloud", label: "Cloud", component: Cloud, category: "Nature" },
  { name: "Fire", label: "Fire", component: Fire, category: "Nature" },
  { name: "Leaf", label: "Leaf", component: Leaf, category: "Nature" },
  { name: "Drop", label: "Drop", component: Drop, category: "Nature" },
];

const iconLookup = new Map<string, IconEntry>();
for (const entry of CURATED_ICONS) {
  iconLookup.set(entry.name, entry);
}

export function getIconByName(name: string): IconEntry | undefined {
  return iconLookup.get(name);
}
