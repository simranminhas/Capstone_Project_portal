import React, { useEffect, useState } from "react";
import {
	collection,
	query,
	where,
	getDoc,
	doc,
	updateDoc,
	arrayRemove,
	arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { Button } from "reactstrap";

const Requests = () => {
	const [reqs, setReqs] = useState([]);
	const [groupInfo, setGroupInfo] = useState([]);
	const [groupId, setGroupId] = useState("");
	const [mentorName, setMentorName] = useState("");
	const [mentorId, setMentorId] = useState("");

	useEffect(() => {
		async function fetchRequest() {
			const docref = doc(db, "Users", auth.currentUser.uid);
			const docteach = await getDoc(docref);
			const req = docteach.data().requests;
			setReqs(req);
		}
		fetchRequest();

		// console.log("group", groupInfo);
	}, []);

	const currentUserInfo = async (uid) => {
		const userRef = doc(db, "Users", uid);
		const userInfo = await getDoc(userRef);
		const name = userInfo.data().name;
		const id = userInfo.data().id;

		setMentorId(id);
		setMentorName(name);
		console.log("my user info", name, ",", id);
	};

	useEffect(() => {
		currentUserInfo(auth.currentUser.uid);
	}, [auth.currentUser.uid]);
	useEffect(() => {
		async function getGroupDocs() {
			for (let index = 0; index < reqs.length; index++) {
				const groupRef = doc(db, "Groups", reqs[index]);
				const docGroup = await getDoc(groupRef);
				console.log(docGroup.data().projectName);
				const name = docGroup.data().projectName;
				const description = docGroup.data().projectDescription;
				const gid = reqs[index];

				setGroupInfo((info) => [
					...info,
					{
						id: gid,
						projectName: name,
						projectDescription: description,
					},
				]);
			}
		}
		getGroupDocs();
	}, [reqs]);

	const approveRequest = async (teacherId, groupId) => {
		const docRef = doc(db, "Users", teacherId);

		// Remove the student ID from the requests array
		await updateDoc(docRef, {
			requests: arrayRemove(groupId),
		});

		// Add the student ID to the approved array
		await updateDoc(docRef, {
			approved: arrayUnion(groupId),
		});

		const groupRef = doc(db, "Groups", groupId);

		await updateDoc(groupRef, {
			mentorName: mentorName,
			mentorId: mentorId,
		});

		alert("Request approved successfully!");
	};

	const declineRequest = async (teacherId, studentId) => {
		const docRef = doc(db, "Users", teacherId);

		// Remove the student ID from the requests array
		await updateDoc(docRef, {
			requests: arrayRemove(studentId),
		});

		alert("Request declined successfully!");
	};
	return (
		<div className="page">
			<h1>Welcome to Request page</h1>
			<table>
				<tr>
					<th>Name</th>
					<th>Description</th>
					<th>Approve</th>
					<th>Decline</th>
				</tr>
				{groupInfo.map((info) => (
					<tr key={info.id} className="listelement">
						<td>{info.projectName}</td>
						<td>{info.projectDescription}</td>
						<td>
							<Button
								href="#"
								class="card-link"
								onClick={() => approveRequest(auth.currentUser.uid, info.id)}
							>
								Approve
							</Button>
						</td>
						<td>
							<Button
								href="#"
								class="card-link"
								onClick={() => declineRequest(auth.currentUser.uid, info.id)}
							>
								Decline
							</Button>
						</td>
					</tr>
				))}
			</table>
		</div>
	);
};

export default Requests;
