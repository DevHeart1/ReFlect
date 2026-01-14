export interface JournalEntry {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  type: 'journal' | 'dream' | 'gratitude';
  mood?: string;
  icon: string;
  colorClass: string;
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
  YEAR_REPORT = 'YEAR_REPORT'
}

export interface TemplateBlock {
  id: string;
  type: 'question' | 'mood' | 'checklist' | 'free_text';
  title: string;
  items?: string[];
}
