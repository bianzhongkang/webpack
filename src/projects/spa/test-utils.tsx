import React from "react";
import { render as rtlRender, RenderResult } from "@testing-library/react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { RootState, RootStore } from "@/stores";
import reducer from "@/stores/rootReducer";

function render(
  ui: React.ReactElement,
  {
    initialState,
    store = createStore(reducer, initialState),
    ...renderOptions
  }: { initialState: RootState; store: RootStore }
): RenderResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function Wrapper({ children }: any) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };

// https://redux.js.org/recipes/writing-tests
