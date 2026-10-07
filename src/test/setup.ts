import { beforeEach } from "vitest";

// jsdom does not implement scrolling APIs used by the layout.
if (typeof window !== "undefined") {
  window.scrollTo = (() => {}) as typeof window.scrollTo;
  Object.defineProperty(Element.prototype, "scrollTo", {
    value: () => {},
    writable: true,
    configurable: true,
  });
}

beforeEach(() => {
  window.localStorage.clear();
});
