import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../firebaseConfig";

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

import "../StyleSheets/StudentGroup.css";
import "../StyleSheets/MyGroup.css";

const GroupDetails = () => {
	const navigate = useNavigate();
	const currUserEmail = auth.currentUser.email;
	const currUserUid = auth.currentUser.uid;
	// console.log(currUserEmail);
	const [myProgress, setMyProgress] = useState("");

	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");
	const [allRemarks, setAllRemarks] = useState([]);
	const [completedModule, setCompletedModule] = useState([]);

	const [allModule, setAllModule] = useState([]);
	const [remark, setRemark] = useState("");
	const [myRemarks, setMyRemarks] = useState([]);

	const uRef = doc(db, "Users", currUserUid);
	// const location = useLocation();
	// setGid(location.state.id);
	// function getGroupId() {
	// 	console.log("location", Gid);
	// }

	const Progress_bar = ({ bgcolor, progress, height }) => {
		const Parentdiv = {
			height: height,
			width: "85%",
			backgroundColor: "white",
			borderRadius: 40,
			margin: 50,
		};

		const Childdiv = {
			height: "100%",
			width: `${progress}%`,
			backgroundColor: bgcolor,
			borderRadius: 40,
			textAlign: "right",
		};

		const progresstext = {
			padding: 10,
			color: "white",
			fontWeight: 300,
		};

		return (
			<div style={Parentdiv}>
				<div style={Childdiv}>
					<span style={progresstext}>{`${progress}%`}</span>
				</div>
			</div>
		);
	};
	const { id } = useParams();
	// console.log("id", id);
	const getGroupinfo = async (groupId) => {
		const groupRef = doc(db, "Groups", groupId);
		// console.log("Group Ref:", groupRef);

		const groupDoc = await getDoc(groupRef);
		// console.log("Group Doc:", groupDoc);

		const { projectDescription, projectName, modules, remarks } =
			groupDoc.data();
		// console.log(`Project Name: ${projectName}`);
		// console.log(`Project Description: ${projectDescription}`);
		setAllModule(modules);
		setProjectDescription(projectDescription);
		setProjectName(projectName);
		setAllRemarks(remarks);
		// console.log("modules", allRemarks);
	};

	const showCompletedModules = async () => {
		const docRef = doc(db, "Groups", id);
		const completedmoduleDoc = await getDoc(docRef);
		const completedmoduleData = completedmoduleDoc.data().completed;
		setCompletedModule(completedmoduleData);
	};
	const showRemarks = async () => {
		const docRef = doc(db, "Groups", id);
		const remarksDoc = await getDoc(docRef);
		const remarksData = remarksDoc.data().remarks;
		setMyRemarks(remarksData);
	};
	const addRemark = async () => {
		const docRef = doc(db, "Groups", id);
		const moduleDoc = await getDoc(docRef);
		const moduleData = moduleDoc.data().remarks;
		console.log(moduleData);

		updateDoc(docRef, {
			remarks: arrayUnion(remark),
		});

		alert("Remarks list Updated");
	};

	// console.log(allModule);

	useEffect(() => {
		// getGroupId();
		getGroupinfo(id);
	}, []);

	useEffect(() => {
		showCompletedModules();
	}, [projectName]);

	useEffect(() => {
		showRemarks();
	}, [projectName]);

	// console.log("all remarks", allRemarks);

	useEffect(() => {
		const progress =
			(completedModule.length * 100) /
			(allModule.length + completedModule.length);
		setMyProgress(Math.round(progress));
		// console.log("percentage :", Math.round(progress));
	}, [completedModule, allModule]);
	return (
		<div className="page">
			<div className="myModulehead">
				<h2>Project details</h2>
			</div>
			<hr />
			<div className="myModulehead">
				<h3>
					<u>Project name</u> : {projectName}
				</h3>
			</div>
			<hr />
			<div className="myModulehead">
				<h3>
					<u>Project Description</u> : <br />
				</h3>

				<h3>{projectDescription}</h3>
			</div>
			<hr />
			<div className="myModulehead">
				<h3>
					Project Progress
					<Progress_bar bgcolor="#172D46" progress={myProgress} height={25} />
				</h3>
			</div>
			<hr />
			<div className="myModulehead">
				<h3>Project Modules</h3>
			</div>

			<div className="myModules">
				<h3>Added Modules </h3>
				<ol>
					{allModule.map((module) => (
						<li key={module.id} className="listelement">
							<h4>{module}</h4>
						</li>
					))}
				</ol>
			</div>

			<hr />
			<div className="myModules">
				<h3>Modules Completed</h3>
				<ol>
					{completedModule.map((module) => (
						<li key={module.id} className="listelement">
							<h4>{module}</h4>
						</li>
					))}
				</ol>
			</div>
			<hr />
			<div className="myModules">
				<h3>Remarks</h3>
				<ol>
					{myRemarks.map((remark) => (
						<li key={remark} className="listelement">
							<h4>{remark}</h4>
						</li>
					))}
				</ol>
			</div>
			<div className="myModules">
				<div className="student-info">
					<div className="student-credentials">
						<p>Remark For {allRemarks.length}</p>

						<input
							name="student"
							type="text"
							placeholder="Remark"
							className="input-box student-cred-input"
							value={remark}
							onChange={(e) => setRemark(e.target.value)}
						/>
						<button className="mybutton" onClick={addRemark}>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GroupDetails;
