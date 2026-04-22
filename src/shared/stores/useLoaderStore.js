import { create } from "zustand";

export const useLoaderStore = create((set) => ({
  isLoading: false,
  variant: "default",

  showLoader: (variant = "default") => set({ isLoading: true, variant }),

  hideLoader: () => set({ isLoading: false }),
}));
