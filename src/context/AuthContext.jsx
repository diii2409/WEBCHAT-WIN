import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/config.js";
import { onAuthStateChanged } from "firebase/auth";
import { Spin } from "antd";
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (user) => {
			// const { displayName, email, uid, photoURL } = user;
			setCurrentUser(user);
			setIsLoading(false);
		});

		return () => {
			unsub();
		};
	}, []);

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{isLoading ? <Spin style={{ position: "fixed", inset: 0 }} /> : children}
		</AuthContext.Provider>
	);
};
