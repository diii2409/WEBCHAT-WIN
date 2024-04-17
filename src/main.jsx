import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AppProvider } from "./context/AppProvider.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthContextProvider>
		<AppProvider>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</AppProvider>
	</AuthContextProvider>,
);
