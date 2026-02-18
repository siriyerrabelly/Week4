import React from "react";
import ReactDOM from "react-dom/client";

// Import our main App component
import App from "./App.jsx";

// Import Tailwind (index.css contains @import "tailwindcss";)
import "./index.css";

// "root" is the div in index.html where React will render the UI
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* StrictMode helps find bugs in development */}
    <App />
  </React.StrictMode>
);

