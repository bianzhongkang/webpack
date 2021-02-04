import { createSlice, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

interface State {
  value: number;
}

const initialState: State = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;

export const selectCount = createSelector(
  (state: RootState) => state,
  (state) => state.counter.value
);
