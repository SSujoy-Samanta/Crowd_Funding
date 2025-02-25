import { atom } from "recoil";
//notification
export const notificationState = atom({
  key: "notificationState",
  default: null as { msg?: string; type?: "success" | "error" } | null,
});

export const selectedCategoryState = atom<string | null>({
  key: "selectedCategoryState",
  default: null,
});

export const selectedCountryState = atom<string>({
  key: "selectedCountryState",
  default: "",
});

export const selectedStateState = atom<string>({
  key: "selectedStateState",
  default: "",
});

export const goalAmountState = atom<string>({
  key: "goalAmountState",
  default: "",
});

export const titleState = atom<string>({
  key: "titleState",
  default: "",
});

export const storyState = atom<string>({
  key: "storyState",
  default: "",
});

export const imageState = atom<File | null>({
  key: "imageState",
  default: null,
});

export const previewState = atom<string | null>({
  key: "previewState",
  default: null,
});
export const tags = atom<string[]>({
  key: "tags",
  default: [],
});