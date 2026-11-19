import "./index.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { t } from "./i18n";

// The page shell is written in English; the tab and its description follow
// the language of the visit.
document.title = t.meta.title;
document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(<App />);
}
