import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
import { UserProvider } from "./contexts/UserProvider"; // ✅ 只引入 Provider

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);
