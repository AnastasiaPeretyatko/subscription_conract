import { Subscription, Type } from "@/types/channels";
import { createSlice } from "@reduxjs/toolkit";

type TInitialState = {
  contract: any;
  token: string;
  tokenAddress: string;
  account: any;
  balance: any;
  typeArray: Type[];
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TInitialState = {
  contract: null,
  token: "0",
  tokenAddress: "",
  account: null,
  balance: null,
  typeArray: [],
  subscriptions: [],
  isLoading: true,
  error: null,
};

const contract = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContract(state, action) {
      state.contract = action.payload;
    },
    setAccount(state, action) {
      state.account = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setOneType(state, action) {
      const { type, i } = action.payload;
      if(state.typeArray.find(el => el.id === i)) return
      state.typeArray = [
        ...state.typeArray,
        {
          name: type.name,
          id: i,
          period: type.period.toNumber(),
          price: type.price.toNumber(),
        },
      ];
    },

    setSubscription(state, action) {
      state.subscriptions = action.payload;
    },
    changeOneSubscription(state, action) {
      const { id } = action.payload;
      state.subscriptions = state.subscriptions.map((el) => ({
        ...el,
        endDate: el.channelId === id ? new Date() : el.endDate,
      }));
    },

    setToken(state, action) {
      state.token = action.payload;
    },
    setTokenAddress(state, action) {
      state.tokenAddress = action.payload;
    },
    setBalance(state, action) {
      state.balance = action.payload;
    }
  },
});

export const {
  setContract,
  setAccount,
  setLoading,
  setOneType,
  setSubscription,
  setToken,
  setTokenAddress,
  changeOneSubscription,
  setBalance
} = contract.actions;

export default contract.reducer;
