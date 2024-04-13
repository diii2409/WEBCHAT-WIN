import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
	collection,
	onSnapshot,
	query,
	where,
	orderBy,
} from "firebase/firestore";

const useFirestore = (collectionName, condition) => {
	const [documents, setDocuments] = useState([]);

	useEffect(() => {
		let q = collection(db, collectionName);
		if (condition) {
			if (!condition.compareValues || !condition.compareValues.length) {
				// Reset documents data
				setDocuments([]);
				return;
			}
			q = query(
				collection(db, collectionName),
				where(condition.fieldName, condition.operator, condition.compareValues),
				orderBy("createdAt", "asc"), // Sắp xếp theo thời gian tăng dần
			);
		} else {
			q = query(
				collection(db, collectionName),
				orderBy("createdAt", "asc"), // Sắp xếp theo thời gian tăng dần
			);
		}

		const unsubscribe = onSnapshot(q, (snapshot) => {
			const docs = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}));

			setDocuments(docs);
		});

		return () => {
			unsubscribe();
		};
	}, [collectionName, condition]);

	return documents;
};

export default useFirestore;
