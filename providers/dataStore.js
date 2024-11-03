import { create } from "zustand";

export const useCounterStore = create((set) => ({
  authenticated: "no",
  userName: "",
  room: "",
  avatar: "",
  setAuthenticated: () =>
    set((state) => ({
      ...state,
      authenticated: "si",
    })),
  setUserName: (value) =>
    set((state) => ({
      ...state,
      userName: value,
    })),
  setRoom: (value) =>
    set((state) => ({
      ...state,
      room: value,
    })),
  setAvatar: (value) =>
    set((state) => ({
      ...state,
      avatar: value,
    })),
}));
