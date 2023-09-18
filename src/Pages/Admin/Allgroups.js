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
import { useNavigate } from "react-router-dom";
import "../../StyleSheets/card.css";

const AllGroups = () => {
	const [groups, setGroups] = useState([]);
	const navigate = useNavigate();
	useEffect(() => {
		async function fetchGroups() {
			const querySnapshot = await getDocs(collection(db, "Groups"));
			const groupsData = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				name: doc.data().projectName,
				description: doc.data().projectDescription,
			}));
			setGroups(groupsData);
		}
		fetchGroups();
	}, []);

	const deleteGroup = async (uid) => {
		const documentRef = doc(db, "Groups", uid);
		await deleteDoc(documentRef);
		alert("Group successfully deleted!");
	};

	return (
		<div className="page ">
			<h1>All Groups</h1>

			<table>
				<tr>
					<th>Project Name</th>
					<th>Project Description</th>
					<th>View</th>
					<th>Delete</th>
				</tr>
				{groups.map((group) => (
					<tr key={group.id} className="listelement">
						<td>{group.name}</td>
						<td>{group.description}</td>
						<td>
							<Button
								href="#"
								class="card-link"
								onClick={() => {
									navigate(`/groupdetails/${group.id}`);
								}}
							>
								View
							</Button>
						</td>
						<td>
							<Button
								href="#"
								class="card-link"
								onClick={() => deleteGroup(group.id)}
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

export default AllGroups;
