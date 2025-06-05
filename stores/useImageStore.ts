import { create } from "zustand";

export interface ImageItem {
  url: string;
}

interface ImageState {
  images: ImageItem[];
  addImage: (item: ImageItem) => void;
  reset: () => void;
}

const useImageStore = create<ImageState>((set) => ({
  images: [],
  addImage: (item) =>
    set((state) => ({ images: [...state.images, item] })),
  reset: () => set({ images: [] }),
}));

export default useImageStore;
