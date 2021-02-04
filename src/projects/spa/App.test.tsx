import React from "react";
import { render, screen } from "./test-utils";
import App from "@project/App";
import store from "@/stores";

test("renders learn react link", () => {
  render(<App />, { initialState: { counter: { value: 0 } }, store });
  const linkElement = screen.getByText(/Hello SPA APP !/i);
  expect(linkElement).toBeInTheDocument();
});
