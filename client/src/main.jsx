import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/auth.context.jsx";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
    <Toaster
      className="bg-black"
      position="top-center"
      duration={1500}
      toastOptions={{
        classNames: {
          toast: "bg-white",
          title: "text-[#133a37] ",
        },
      }}
    />
  </BrowserRouter>
);
