import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "reactstrap";
import "../../StyleSheets/StudentGroup.css";

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
import { auth, db } from "../../firebaseConfig";

const ProjectDetails = () => {
	const navigate = useNavigate();

	const [gid, setGid] = useState("");
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");

	async function getGroupId() {
		const userRef = doc(db, "Users", auth.currentUser.uid);
		console.log();
	}

	async function getUserData(currentUserUid, userId) {
		const docRef = doc(db, "Users", auth.currentUser.uid);
		const docSnap = await getDoc(docRef);
		setGid(docSnap.data().GroupId);
	}

	useEffect(() => {
		console.log(gid);
		getUserData();
	});

	const addDetails = () => {
		if (projectName == "" || projectDescription == "") {
			alert("Please fill all the fields");
		} else {
			const docRef = doc(db, "Groups", gid);
			const data = {
				projectName: projectName,
				projectDescription: projectDescription,
			};
			updateDoc(docRef, data).then(() => {
				alert("Details has successfuly uploaded");
			});
			navigate("/addmembers");
		}
	};

	return (
		<form className="project-details">
			<h1>Project Details</h1>

			<div className="content">
				<div className="input-field">
					<h4>Project Name</h4>
					<input
						type="text"
						placeholder="Project Name"
						name="projectName"
						id="projectName"
						value={projectName}
						onChange={(e) => setProjectName(e.target.value)}
					/>
				</div>
				<div className="text-area ">
					<h4>Project Description</h4>
					<textarea
						type="text"
						placeholder="Project Description"
						name="projectDescription"
						id="projectDescription"
						rows="10"
						cols="41"
						value={projectDescription}
						onChange={(e) => setProjectDescription(e.target.value)}
					/>
				</div>
			</div>
			<div className="action">
				<button className="colorHilightBtn createjoinbtn" onClick={addDetails}>
					Submit
				</button>
			</div>
		</form>
	);
};

export default ProjectDetails;
