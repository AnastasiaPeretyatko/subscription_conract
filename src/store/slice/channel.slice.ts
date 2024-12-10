import { Channel } from "@/types/channels";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  channel: [] | Channel[];
  myChannel: [] | Channel[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TInitialState = {
  channel: [],
  myChannel: [],
  isLoading: false,
  error: null,
};

const channel = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannel(state, action) {
      state.channel = action.payload.map((el: any) => ({
        id: el.id.toNumber(),
        name: el.name,
        description: el.description,
        owner: el.owner,
        createdAt: el.createdAt.toNumber(),
        isActive: el.isActive,
        isSub: false,
      }));
    },
    addNewChannel(state, action) {
      const el = action.payload;
      const channel = {
        id: el.id.toNumber(),
        name: el.name,
        description: el.description,
        owner: el.owner,
        createdAt: el.createdAt.toNumber(),
        isActive: el.isActive,
        isSub: false,
      };
      state.channel = [channel, ...state.channel];
    },
    changeSubChannel(state, action) {
      const { id } = action.payload;
      state.channel = state.channel.map((el) => ({
        ...el,
        isSub: el.id === id ? true : el.isSub 
      }));
    },
    setMyChannel(state, action) {
      state.myChannel = action.payload.map((el: any) => ({
        id: +el.id,
        name: el.name,
        description: el.description,
        owner: el.owner,
        createdAt: el.createdAt,
        isActive: el.isActive,
        isSub: false,
      }));
    }
  },
});

export const { setChannel, addNewChannel, changeSubChannel, setMyChannel } = channel.actions;

export default channel.reducer;
