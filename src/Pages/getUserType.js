import { db } from "../firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";


const getUserType = async (currUserEmail) => {
	try {
		const querySnapshot = await db
			.collection("User")
			.where("email", "==", currUserEmail)
			.get();

		let userType = querySnapshot[0].userType;

		// querySnapshot.forEach((doc) => {
		// 	userType = doc[0].data().userType;
		// });

		if (userType === null) {
			throw new Error("No matching document found.");
		}

		return userType;
	} catch (error) {
		console.error("Error retrieving user type:", error);
		return null;
	}
};

export default getUserType;
