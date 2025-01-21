import { create } from 'zustand'
import { StateCreator } from 'zustand'

interface ProfileState {
  profilePicture: string | null
  profileName: string | null
  setProfile: (picture: string | null, name: string | null) => void
}

const createStore: StateCreator<ProfileState> = (set) => ({
  profilePicture: null,
  profileName: null,
  setProfile: (picture: string | null, name: string | null) => set({ profilePicture: picture, profileName: name }),
})

export const useProfileStore = create<ProfileState>(createStore) 