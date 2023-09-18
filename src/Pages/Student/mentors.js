import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import "../../StyleSheets/LoginRegister.css";
import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
	updateDoc,
	doc,
	getDoc,
	arrayUnion,
} from "firebase/firestore";
import icon from "./icon.png";
import { Button } from "reactstrap";
import "../../StyleSheets/MyGroup.css";

const Mentor = () => {
	const [gMentorName, setgMentorName] = useState("pending");
	const [gMentorId, setgMentorId] = useState("pending");
	const [allMentor, setAllMentor] = useState([]);
	const [groupId, setGroupId] = useState("");
	const currUserEmail = auth.currentUser.email;

	const getGroupId = async (email) => {
		const userRef = collection(db, "Users");
		const q = query(userRef, where("email", "==", email));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			console.log("No user found with email:", email);
		} else {
			const userDoc = querySnapshot.docs[0];
			const userData = userDoc.data();
			const gid = userData.GroupId;
			console.log("My group", gid);
			setGroupId(gid);
			console.log(groupId);
			const groupRef = doc(db, "Groups", gid);
			const groupDoc = await getDoc(groupRef);
			const valmentorId = groupDoc.data().mentorId;
			const valmentorName = groupDoc.data().mentorName;
			console.log("val mentor", valmentorId);
			console.log("val mentor", valmentorName);
			setgMentorId(valmentorId);
			setgMentorName(valmentorName);
		}
	};

	const getAllMentor = async () => {
		const usersRef = collection(db, "Users");
		const q = query(usersRef, where("userType", "==", "teacher"));
		const querySnapshot = await getDocs(q);
		const mentorList = [];
		querySnapshot.forEach((doc) => {
			mentorList.push(doc.data());
		});
		setAllMentor(mentorList);
	};

	useEffect(() => {
		getGroupId(currUserEmail);
		getAllMentor();

		console.log(allMentor);
		// getGroupId(currUserEmail);
	}, []);

	const mentor = getAllMentor(currUserEmail);

	async function sendRequest(email) {
		const usersRef = collection(db, "Users");
		const q = query(usersRef, where("email", "==", email));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			// console.log(`No mentor found with email ${email}.`);
			alert("Request not Sent");
		} else {
			const mentorDoc = querySnapshot.docs[0];
			const mentorRef = doc(db, "Users", mentorDoc.id);
			await updateDoc(mentorRef, { requests: arrayUnion(groupId) });
			alert("Request Sent");
		}
	}

	if (gMentorId == "pending") {
		return (
			<div className="page">
				<h1 className="reqbtnsection">Mentor not aloted to group</h1>
				<br />
				<hr />
				<br />
				<br />

				<table>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Email</th>

						<th>Request</th>
					</tr>
					{allMentor.map((mentor) => (
						<tr key={mentor.id} className="listelement">
							<td>{mentor.id}</td>
							<td>{mentor.name}</td>
							<td>{mentor.email}</td>

							<td>
								<Button
									className="completebtn"
									onClick={sendRequest.bind(this, mentor.email)}
								>
									Request
								</Button>
							</td>
						</tr>
					))}
				</table>
			</div>
		);
	} else {
		return (
			<div className="page">
				<h1>Mentor alloted to group</h1>
				<br />
				<br />
				<img src={icon} alt="User" />
				<h2>
					Mentor Name : <u>{gMentorName}</u>
				</h2>
				<h2>
					Mentor Id : <u>{gMentorId}</u>
				</h2>
			</div>
		);
	}
};

export default Mentor;
