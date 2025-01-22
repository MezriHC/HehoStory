import { create } from 'zustand'
import { StateCreator } from 'zustand'

interface ProfileState {
  profilePicture: string | null
  profileName: string | null
  tempProfilePicture: string | null
  setGlobalProfile: (picture: string | null, name: string | null) => void
  setTempProfile: (picture: string | null) => void
  clearTempProfile: () => void
}

const createStore: StateCreator<ProfileState> = (set) => ({
  profilePicture: null,
  profileName: null,
  tempProfilePicture: null,
  setGlobalProfile: (picture: string | null, name: string | null) => 
    set({ profilePicture: picture, profileName: name }),
  setTempProfile: (picture: string | null) => 
    set({ tempProfilePicture: picture }),
  clearTempProfile: () => 
    set({ tempProfilePicture: null })
})

export const useProfileStore = create<ProfileState>(createStore) 