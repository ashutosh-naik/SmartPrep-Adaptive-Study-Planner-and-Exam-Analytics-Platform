import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import AppErrorBoundary from "./components/AppErrorBoundary.jsx";
import { store } from "./store/store.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import "./index.css";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "494979891642-rl8k3c5q9h7ilu3ub64gnh8ujvnd64ro.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <AppErrorBoundary>
              <App />
            </AppErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "rgb(var(--color-surface) / 1)",
                  color: "rgb(var(--color-text-primary) / 1)",
                  border: "1px solid rgb(var(--color-border) / 1)",
                  borderRadius: "12px",
                  fontSize: "14px",
                },
                success: {
                  iconTheme: {
                    primary: "rgb(var(--color-success) / 1)",
                    secondary: "rgb(var(--color-surface) / 1)",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "rgb(var(--color-danger) / 1)",
                    secondary: "rgb(var(--color-surface) / 1)",
                  },
                },
              }}
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
