import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "./config";

export const addDocument = async (collectionName, data) => {
	try {
		const collectionRef = collection(db, collectionName);
		const timestamp = Timestamp.now();

		await addDoc(collectionRef, {
			...data,
			createdAt: timestamp,
		});

		console.log("Document added successfully");
	} catch (error) {
		console.error("Error adding document: ", error);
	}
};
export const generateKeywords = (displayName) => {
	let keywords = [displayName];
	const fullName = displayName.split(" ").filter((word) => word);

	const createKeywords = (name) => {
		const arrName = [];
		let curName = "";
		name.split("").forEach((letter) => {
			curName += letter;
			arrName.push(curName);
		});
		return arrName;
	};

	for (let i = 0; i < fullName.length; i++) {
		const tem = createKeywords(fullName[i]);
		keywords = [...keywords, ...tem];
	}
	return keywords;
};
