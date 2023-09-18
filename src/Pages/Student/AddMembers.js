import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Alert, Button } from "reactstrap";
import "../../StyleSheets/LoginRegister.css";

import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
	updateDoc,
	doc,
	setDoc,
	getDoc,
} from "firebase/firestore";

const AddMembers = () => {
	const [allUsers, setAllUsers] = useState([]);
	const [user1, setUser1] = useState("");
	const [user2, setUser2] = useState("");
	const [user3, setUser3] = useState("");
	const [gid, setGid] = useState("");
	const navigate = useNavigate();

	const dataget = async () => {
		const colRef = collection(db, "Users");
		const docsSnap = await getDocs(colRef);
		const users = [];

		docsSnap.forEach((doc) => {
			users.push(doc.data().id);
		});

		setAllUsers(users);
	};

	const getCurrentUserData = async (currentUserUid) => {
		const userDocRef = doc(db, "Users", auth.currentUser.uid);
		const userDocSnapshot = await getDoc(userDocRef);
		if (userDocSnapshot.exists()) {
			const userData = userDocSnapshot.data().GroupId;
			// do something with userData
			setGid(userData);
			console.log(userData);
		}
	};
	const checkRollNos = (users, allUsers) => {
		// First, check if allUsers contains any users
		if (allUsers.length === 0) {
			return true; // No users exist yet, so no constraints to check
		}

		// Check if any of the entered roll numbers already exist in allUsers
		return users.every((user) => {
			return allUsers.some((existingUser) => {
				return existingUser === user.rollno;
			});
		});
	};

	const addMember = async (e) => {
		try {
			e.preventDefault();
			if (user1 == "" && user2 == "" && user3 == "") {
				alert("Please fill all the fields");
			} else if (user1 != "" && user2 == "" && user3 == "") {
				const users = [{ rollno: user1 }];

				if (checkRollNos(users, allUsers)) {
					console.log("before");
					const userRefs = [];
					users.forEach((user) => {
						const userRef = query(
							collection(db, "Users"),
							where("id", "==", user.rollno)
						);
						userRefs.push(userRef);
					});
					const snapshots = await Promise.all(userRefs.map(getDocs));
					snapshots.forEach((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const docRef = doc.ref;
							updateDoc(docRef, { GroupId: gid });
						});
					});

					// addUserToGroup(userRefs);
					console.log("after");
					alert("1 Participants added");

					navigate("/mygroup");

					return;
				}
			} else if (user1 != "" && user2 != "" && user3 == "") {
				const users = [{ rollno: user1 }, { rollno: user2 }];

				if (checkRollNos(users, allUsers)) {
					console.log("before");
					const userRefs = [];
					users.forEach((user) => {
						const userRef = query(
							collection(db, "Users"),
							where("id", "==", user.rollno)
						);
						userRefs.push(userRef);
					});
					const snapshots = await Promise.all(userRefs.map(getDocs));
					snapshots.forEach((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const docRef = doc.ref;
							updateDoc(docRef, { GroupId: gid });
						});
					});

					// addUserToGroup(userRefs);
					console.log("after");
					alert("2 Participants added");

					navigate("/mygroup");

					return;
				}
			} else {
				const users = [{ rollno: user1 }, { rollno: user2 }, { rollno: user3 }];

				if (checkRollNos(users, allUsers)) {
					console.log("before");
					const userRefs = [];
					users.forEach((user) => {
						const userRef = query(
							collection(db, "Users"),
							where("id", "==", user.rollno)
						);
						userRefs.push(userRef);
					});
					const snapshots = await Promise.all(userRefs.map(getDocs));
					snapshots.forEach((querySnapshot) => {
						querySnapshot.forEach((doc) => {
							const docRef = doc.ref;
							updateDoc(docRef, { GroupId: gid });
						});
					});

					// addUserToGroup(userRefs);
					console.log("after");
					alert("3 Participants added");

					navigate("/mygroup");

					return;
				}
			}
			// const users = [{ rollno: user1 }, { rollno: user2 }, { rollno: user3 }];

			// if (checkRollNos(users, allUsers)) {
			// 	console.log("before");
			// 	const userRefs = [];
			// 	users.forEach((user) => {
			// 		const userRef = query(
			// 			collection(db, "Users"),
			// 			where("id", "==", user.rollno)
			// 		);
			// 		userRefs.push(userRef);
			// 	});
			// 	const snapshots = await Promise.all(userRefs.map(getDocs));
			// 	snapshots.forEach((querySnapshot) => {
			// 		querySnapshot.forEach((doc) => {
			// 			const docRef = doc.ref;
			// 			updateDoc(docRef, { GroupId: gid });
			// 		});
			// 	});

			// 	// addUserToGroup(userRefs);
			// 	console.log("after");
			// 	alert("Participants added");

			// 	navigate("/mygroup");

			// 	return;
			// }
		} catch (error) {
			console.error(error);
		}

		// Constraints are met, so proceed with adding users to the database
		// ...
	};

	// const addUserToGroup = (userref) => {
	// 	const groupsCollection = collection(db, "Groups", gid);

	// 	updateDoc(groupsCollection, { user: userref })
	// 		.then(() => {
	// 			console.log("Document written with ID: ", docRef.id);
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error adding document: ", error);
	// 		});
	// };

	useEffect(() => {
		// console
		getCurrentUserData();
		dataget();
		console.log(allUsers);
	}, []);

	return (
		<form className="addmembers">
			<h1>Add Participants</h1>

			<div className="content">
				<h4>First Participant</h4>
				<div className="input-field">
					<input
						type="text"
						value={user1}
						onChange={(e) => setUser1(e.target.value)}
						placeholder="Rollno"
						name="r1"
						id="r1"
					/>
				</div>
				<h4>Second Participant</h4>

				<div className="input-field">
					<input
						type="text"
						value={user2}
						onChange={(e) => setUser2(e.target.value)}
						placeholder="Rollno"
						name="r2"
						id="r2"
					/>
				</div>
				<h4>Third Participant</h4>

				<div className="input-field">
					<input
						type="text"
						value={user3}
						onChange={(e) => setUser3(e.target.value)}
						placeholder="Rollno"
						name="r3"
						id="r3"
					/>
				</div>
			</div>
			<div className="action">
				<button onClick={addMember} className="colorHilightBtn">
					Submit
				</button>
			</div>
		</form>
	);
};

export default AddMembers;
