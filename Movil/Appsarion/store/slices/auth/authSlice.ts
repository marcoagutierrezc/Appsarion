import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface IUser {
  id: number;
  name: string;
  idRole: String;
  role: string;
  roleData: string;
  infoRole: string;
}

interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
}

const initialState: IAuthState = {
  isAuthenticated: false,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<IUser>) => {
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
        idRole: action.payload.idRole,
        role: action.payload.role,
        roleData: action.payload.roleData,
        infoRole: action.payload.roleData ? "true" : "false"  // Validación agregada
      };
    },
    logOut(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export default authSlice.reducer;
export const { logIn, logOut } = authSlice.actions;