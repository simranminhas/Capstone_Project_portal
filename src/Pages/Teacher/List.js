import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";

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
	onSnapshot,
} from "firebase/firestore";
import "../../StyleSheets/teacherlist.css";

const List = () => {
	const currUserId = auth.currentUser.uid;
	const [gid, setGid] = useState([]);
	const [userInfo, setUserInfo] = useState([]);

	useEffect(() => {
		getApprovedGroup();
	}, []);

	useEffect(() => {
		getallusers();
	}, [gid]);

	const getApprovedGroup = async () => {
		const docref = doc(db, "Users", currUserId);

		const docUser = await getDoc(docref);
		const id = docUser.data().approved;
		setGid(id);
		console.log(gid);
	};

	const getallusers = async () => {
		const q = query(collection(db, "Users"), where("GroupId", "in", gid));
		const userSnapshot = await getDocs(q);

		const users = [];
		userSnapshot.forEach((doc) => {
			const user = doc.data();
			// console.log("myuser", user);
			users.push({
				id: user.id,
				name: user.name,
				email: user.email,
			});
		});

		setUserInfo(users);
	};

	console.log("users", userInfo);

	return (
		<div className="page">
			<h1>Student List</h1>
			<table class="table-fill">
				<thead>
					<tr>
						<th class="text-left">Roll no</th>
						<th class="text-left">Name</th>
						<th class="text-left">Email</th>
					</tr>
				</thead>
				<tbody class="table-hover">
					{userInfo.map((info) => {
						return (
							<tr>
								<td class="text-left">{info.id}</td>
								<td class="text-left">{info.name}</td>
								<td class="text-left">{info.email}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default List;
