export interface JournalEntry {
  id: string;
  userId?: string; // For auth integration
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  type: 'journal' | 'dream' | 'gratitude';
  mood?: string;
  icon: string;
  colorClass: string;
  content: string;
}

export interface MoodData {
  day: string;
  value: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  JOURNAL = 'JOURNAL',
  INSIGHTS = 'INSIGHTS',
  SETTINGS = 'SETTINGS',
  TEMPLATES = 'TEMPLATES',
  TEMPLATE_BUILDER = 'TEMPLATE_BUILDER',
  YEAR_REPORT = 'YEAR_REPORT',
  EDITOR = 'EDITOR',
  ONBOARDING = 'ONBOARDING'
}

export interface TemplateBlock {
  id: string;
  type: 'question' | 'mood' | 'checklist' | 'free_text';
  title: string;
  items?: string[]; // For checklists
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  colorTheme?: {
    bg: string;
    text: string;
    iconBg: string;
    groupHoverText: string;
    gradient: string;
  };
  blocks?: TemplateBlock[]; // Custom templates will have blocks
}