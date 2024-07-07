import { LucideIcon } from "lucide-react";

export interface AIMenuItem { name: string; command: string, icon: LucideIcon };

export interface BubbleMenuItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: LucideIcon;
};
