import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import {
	addDoc,
	collection,
	getDocs,
	query,
	where,
	updateDoc,
	doc,
	getDoc,
	deleteDoc,
} from "firebase/firestore";
import { Button } from "reactstrap";
import "../../StyleSheets/table.css";

const Teachers = () => {
	const [allMentor, setAllMentor] = useState([]);

	const groupsRef = collection(db, "Groups"); // Reference to the "Groups" collection in Firestore

	async function getGroupsByUID(uids) {
		const groups = [];

		for (const uid of uids) {
			const query = doc(groupsRef, uid);
			const snapshot = await getDocs(query);

			if (snapshot.exists()) {
				const data = snapshot.data();
				groups.push(data);
			}
		}

		return groups;
	}
	useEffect(() => {
		const getAllMentor = async () => {
			const usersRef = collection(db, "Users");
			const q = query(usersRef, where("userType", "==", "teacher"));
			const querySnapshot = await getDocs(q);
			const mentorList = querySnapshot.docs.map((doc) => {
				const mentorData = doc.data();
				const approvedGroups = mentorData.approved
					? mentorData.approved.length
					: 0; // Check if 'approved' exists before accessing its length
				return {
					id: doc.id,
					approvedGroups,
					...mentorData,
				};
			});
			setAllMentor(mentorList);
			console.log(mentorList);
		};

		getAllMentor();
		// getGroupId(currUserEmail);
	}, []);

	const deleteTeacher = async (teacherId) => {
		const querySnapshot = await getDocs(collection(db, "Users"));

		querySnapshot.forEach((doc) => {
			const userData = doc.data();

			if (userData.id === teacherId) {
				deleteDoc(doc.ref);
				alert("Document successfully deleted!");
			}
		});
	};
	return (
		<div className="page">
			<h1 className="h1head">All Teachers</h1>

			<table>
				<tr>
					<th>Id</th>
					<th>Name</th>
					<th>Email</th>
					<th>Groups</th>
					<th>Action</th>
				</tr>
				{allMentor.map((mentor) => (
					<tr key={mentor.id} className="listelement">
						<td>{mentor.id}</td>
						<td>{mentor.name}</td>
						<td>{mentor.email}</td>
						<td>{mentor.approvedGroups}</td>
						<td>
							<Button
								className="completebtn2"
								onClick={() => deleteTeacher(mentor.id)}
							>
								Delete
							</Button>
						</td>
					</tr>
				))}
			</table>
		</div>
	);
};

export default Teachers;
