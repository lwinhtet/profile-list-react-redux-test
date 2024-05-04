import { configureStore } from '@reduxjs/toolkit';
import profileReducer, {
  autoSaveMiddleware,
  saveProfileState,
} from '../features/profiles/profileReducer';

const store = configureStore({
  reducer: {
    profiles: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(autoSaveMiddleware),
});

store.subscribe(() => {
  const state = store.getState();
  saveProfileState(state.profiles);
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
