import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Dashboard {
  ongoing_course: number;
  completed_course: number;
  hours_spent: number;
  certificate: number;
  current_ongoing_course?: {
    title: string;
    percentage_completed?: number;
    completed_lessons?: number;
    total_lessons?: number;
  };
}
export interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
  provider?: string;
  avatar?: string;
  dashboard: Dashboard;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload.id;
    },
  },
});

export const { setUser } = profileSlice.actions;
export default profileSlice.reducer;
