import {create} from "zustand"



export const userStore = create((set) => ({
    accessToken: "",
    user: null,
    setUser: (user) => set({user}),
    setAccessToken: (accessToken) => set({accessToken})
}))