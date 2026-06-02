import { create } from "zustand";

export const MODAL_TYPES = {
  IMAGE_PREVIEW: "IMAGE_PREVIEW",
  DOCUMENT_PREVIEW: "DOCUMENT_PREVIEW",
  CONFIRM_ACTION: "CONFIRM_ACTION",
  SHARE_DOCUMENT: "SHARE_DOCUMENT",
  SAVE_STAGE_LOADER: "SAVE_STAGE",
};

export const useModalStore = create((set) => ({
  type: null,
  isOpen: false,
  data: null,

  openModal: (type, data = {}) =>
    set({
      type,
      isOpen: true,
      data,
    }),

  updateModalData: (updates) =>
    set((state) => ({
      data: {
        ...state.data,
        ...updates,
      },
    })),

  closeModal: () =>
    set({
      type: null,
      isOpen: false,
      data: null,
    }),
}));
