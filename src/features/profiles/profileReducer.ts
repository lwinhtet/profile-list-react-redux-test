import {
  Middleware,
  PayloadAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios';

export type ProfileType = {
  id: number;
  name: string;
  icon: string;
  default: boolean;
};

export type ProfileStateType = {
  profiles: ProfileType[];
  activeProfile: ProfileType | undefined;
  activeProfileIndex: number | undefined;
};

const defaultProfiles: ProfileType[] = [
  {
    id: 1,
    name: 'Default',
    icon: 'default',
    default: true,
  },
  {
    id: 2,
    name: 'Game',
    icon: 'game',
    default: true,
  },
  {
    id: 3,
    name: 'Movie',
    icon: 'movie',
    default: true,
  },
  {
    id: 4,
    name: 'Music',
    icon: 'music',
    default: true,
  },
];

const initState: ProfileStateType = {
  profiles: defaultProfiles,
  activeProfile: defaultProfiles[0],
  activeProfileIndex: 0,
};

const loadState = (): ProfileStateType => {
  try {
    const serializedState = localStorage.getItem('profileState');
    if (serializedState === null) {
      return initState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return initState;
  }
};

const initialState: ProfileStateType = loadState();

const getActiveProfileIndex = (profiles: ProfileType[], profileId: number) => {
  const profileIndex = profiles.findIndex(
    (profile) => profile.id === profileId
  );

  if (profileIndex === -1) {
    throw new Error(`Profile with id ${profileId} not found`);
  }

  return profileIndex;
};

const saveState = (state: ProfileStateType) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('profileState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage', err);
  }
};

export const saveProfileState = (state: ProfileStateType) => {
  saveState(state);
};

const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    selectProfile: (state: ProfileStateType, action: PayloadAction<number>) => {
      if (!action.payload) {
        throw new Error('action.payload missing in selectProfile action');
      }

      state.activeProfileIndex = getActiveProfileIndex(
        state.profiles,
        action.payload
      );
      state.activeProfile = state.profiles[state.activeProfileIndex];
    },
    addProfile: (state: ProfileStateType) => {
      const profiles = state.profiles;
      const newProfile: ProfileType = {
        id: profiles.length + 1,
        name: 'New Profile',
        icon: 'custom',
        default: false,
      };
      profiles.push(newProfile);

      state.activeProfileIndex = getActiveProfileIndex(
        state.profiles,
        newProfile.id
      );
      state.activeProfile = state.profiles[state.activeProfileIndex];
    },
    deleteProfile: (
      state: ProfileStateType,
      action: PayloadAction<number | undefined>
    ) => {
      if (!action.payload) {
        throw new Error('action.payload missing in deleteProfile action');
      }
      const id = action.payload;
      let index = state.profiles.findIndex((profile) => profile.id === id);
      state.profiles.splice(index, 1);

      index = index !== 0 ? index - 1 : 0;

      state.activeProfileIndex = index;
      state.activeProfile = state.profiles[index];
    },
    renameProfile: (state: ProfileStateType, action: PayloadAction<string>) => {
      if (!action.payload) {
        throw new Error('action.payload missing in renameProfile action');
      }
      state.profiles[state.activeProfileIndex as number].name = action.payload;
      state.activeProfile = state.profiles[state.activeProfileIndex as number];
    },
    moveProfileUp: (state: ProfileStateType) => {
      const currentIndex = state.activeProfileIndex;
      if (currentIndex === undefined) {
        throw new Error(
          'state.activeProfileIndex is undefined in moveProfileUp action'
        );
      }
      const profiles = state.profiles;
      const temp = profiles[currentIndex];
      profiles[currentIndex] = profiles[currentIndex - 1];
      profiles[currentIndex - 1] = temp;
      state.activeProfileIndex = currentIndex - 1;
    },
    moveProfileDown: (state: ProfileStateType) => {
      const currentIndex = state.activeProfileIndex;
      if (currentIndex === undefined) {
        throw new Error(
          'state.activeProfileIndex is undefined in moveProfileUp action'
        );
      }
      const profiles = state.profiles;
      const temp = profiles[currentIndex];
      profiles[currentIndex] = profiles[currentIndex + 1];
      profiles[currentIndex + 1] = temp;
      state.activeProfileIndex = currentIndex + 1;
    },
  },
});

export const autoSaveMiddleware: Middleware =
  ({ getState }) =>
  (next) => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (action) => {
      const result = next(action);
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const profileData = getState().profiles;
        axios.put('http://localhost:3001/profiles', profileData);
        timeout = null;
      }, 3000);
      return result;
    };
  };

export const selectProfileState = (state: RootState) => state.profiles;

export const profilesSelector = createSelector(
  selectProfileState,
  (state) => state.profiles
);

export const activeProfileSelector = createSelector(
  selectProfileState,
  (state) => state.activeProfile
);

export const activeProfileIndexSelector = createSelector(
  selectProfileState,
  (state) => state.activeProfileIndex
);

export const {
  selectProfile,
  addProfile,
  deleteProfile,
  renameProfile,
  moveProfileDown,
  moveProfileUp,
} = profileSlice.actions;
export default profileSlice.reducer;
