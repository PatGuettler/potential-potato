import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installDemoBackend, isDemo } from "./demo/backend";

(async () => {
  if (isDemo) await installDemoBackend();
  createRoot(document.getElementById("root")!).render(<App />);
})();
