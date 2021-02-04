import { combineReducers } from "@reduxjs/toolkit";
import counter from "./reducers/counter";

const rootReducer = combineReducers({
  counter,
});

export default rootReducer;
