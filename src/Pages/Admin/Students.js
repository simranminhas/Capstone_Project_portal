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

const Students = () => {
	const [allStudents, setAllStudents] = useState([]);

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
			const q = query(usersRef, where("userType", "==", "student"));
			const querySnapshot = await getDocs(q);
			const studentList = querySnapshot.docs.map((doc) => {
				const studentData = doc.data();

				return {
					id: doc.id,
					group: doc.GroupId,
					...studentData,
				};
			});
			setAllStudents(studentList);
			console.log(studentList);
		};

		getAllMentor();
		// getGroupId(currUserEmail);
	}, []);

	const deleteSeacher = async (studentId) => {
		const querySnapshot = await getDocs(collection(db, "Users"));

		querySnapshot.forEach((doc) => {
			const userData = doc.data();

			if (userData.id === studentId) {
				deleteDoc(doc.ref);
				alert("Document successfully deleted!");
			}
		});
	};
	return (
		<div className="page">
			<h1 className="h1head"> All Students</h1>

			<table>
				<tr>
					<th>Id</th>
					<th>Name</th>
					<th>Email</th>
					<th>Group</th>
					<th>Action</th>
				</tr>
				{allStudents.map((student) => (
					<tr key={student.id} className="listelement">
						<td>{student.id}</td>
						<td>{student.name}</td>

						<td>{student.email}</td>
						<td>{student.GroupId}</td>
						<td>
							<Button
								className="completebtn2"
								onClick={() => deleteSeacher(student.id)}
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

export default Students;
