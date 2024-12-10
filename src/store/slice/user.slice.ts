import { createSlice } from "@reduxjs/toolkit";
import { log } from "console";

type TInitialState = {
  user: any;
  isLoading: boolean;
  error: string | null;
};

const initialState: TInitialState = {
  user: null,
  isLoading: false,
  error: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout: (state) => {
      localStorage.removeItem("user");
      state.user = null;
    }
  },
});

export const { setUser, logout } = user.actions;

export default user.reducer;
