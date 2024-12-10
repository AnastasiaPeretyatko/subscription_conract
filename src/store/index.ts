import { configureStore } from "@reduxjs/toolkit";
import channelReducer from "./slice/channel.slice";
import userReducer from "./slice/user.slice";
import contractReducer from "./slice/contract.slice";

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const store = configureStore({
  reducer: {
    channel: channelReducer,
    user: userReducer,
    contract: contractReducer
  },
});
