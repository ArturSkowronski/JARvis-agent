import { create } from "zustand";

export interface SummaryItem {
  url: string;
  summary: string;
}

interface SummaryState {
  summaries: SummaryItem[];
  addSummary: (item: SummaryItem) => void;
  reset: () => void;
}

const useSummaryStore = create<SummaryState>((set) => ({
  summaries: [],
  addSummary: (item) =>
    set((state) => ({ summaries: [...state.summaries, item] })),
  reset: () => set({ summaries: [] }),
}));

export default useSummaryStore;
