import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "reactstrap";
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
	arrayUnion,
	arrayRemove,
} from "firebase/firestore";

import "../../StyleSheets/StudentGroup.css";
import "../../StyleSheets/MyGroup.css";

const Mygroup = () => {
	const navigate = useNavigate();
	const currUserEmail = auth.currentUser.email;
	const currUserUid = auth.currentUser.uid;
	// console.log(currUserEmail);

	const [Gid, setGid] = useState("");
	const [projectName, setProjectName] = useState("");
	const [projectDescription, setProjectDescription] = useState("");

	const [moduleName, setModuleName] = useState("");
	const [allModule, setAllModule] = useState([]);
	const [completedModule, setCompletedModule] = useState([]);
	const [myRemarks, setMyRemarks] = useState([]);
	const [myProgress, setMyProgress] = useState("");
	const [myPower, setMyPower] = useState("");

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

	const handleCreateGroup = async (e) => {
		console.log("createGroup function called");
		const querySnapshot = await getDocs(
			query(collection(db, "Groups"), where("superUser", "==", currUserEmail))
		);
		if (querySnapshot.size === 0) {
			const docref = await addDoc(collection(db, "Groups"), {
				superUser: currUserEmail,
				user: [],
				mentorName: "pending",
				mentorId: "pending",
				modules: [],
				remarks: [],
				completed: [],
			}).then((res) => {
				const userRef = doc(db, "Users", currUserUid);
				updateDoc(userRef, { ["power"]: true });
				updateDoc(userRef, { ["GroupId"]: res.id });
			});
		} else {
			// console.log("A group with the same superUser already exists.");
		}

		navigate("/projectdetails");
	};

	const uRef = doc(db, "Users", currUserUid);

	const getGroupId = async (email) => {
		const userRef = collection(db, "Users");
		const q = query(userRef, where("email", "==", email));
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			// console.log("No user found with email:", email);
			setGid("null");
		} else {
			const userDoc = querySnapshot.docs[0];
			const userData = userDoc.data();
			const groupId = userData.GroupId;

			// console.log("Gid", userData);

			setGid(groupId);
		}
	};

	const getGroupinfo = async (groupId) => {
		const groupRef = doc(db, "Groups", groupId);
		// console.log("Group Ref:", groupRef);

		const groupDoc = await getDoc(groupRef);
		// console.log("Group Doc:", groupDoc);

		if (groupDoc.exists()) {
			const { projectDescription, projectName } = groupDoc.data();
			// console.log(`Project Name: ${projectName}`);
			// console.log(`Project Description: ${projectDescription}`);
			setProjectDescription(projectDescription);
			setProjectName(projectName);
		} else {
			// console.log("No such document!");
		}
	};

	const addModule = async () => {
		const docRef = doc(db, "Groups", Gid);
		const moduleDoc = await getDoc(docRef);
		const moduleData = moduleDoc.data().modules;
		// console.log(typeof moduleData);
		const newModuleData = moduleName;
		updateDoc(docRef, {
			modules: arrayUnion(newModuleData),
		});

		alert("Module Added, please refresh");
	};
	const showModules = async () => {
		const docRef = doc(db, "Groups", Gid);
		const moduleDoc = await getDoc(docRef);
		const moduleData = moduleDoc.data().modules;
		setAllModule(moduleData);
	};
	// console.log("module data", allModule);

	const showCompletedModules = async () => {
		const docRef = doc(db, "Groups", Gid);
		const completedmoduleDoc = await getDoc(docRef);
		const completedmoduleData = completedmoduleDoc.data().completed;
		setCompletedModule(completedmoduleData);
	};

	const showRemarks = async () => {
		const docRef = doc(db, "Groups", Gid);
		const remarksDoc = await getDoc(docRef);
		const remarksData = remarksDoc.data().remarks;
		setMyRemarks(remarksData);
	};

	// console.log("my remarks : ", myRemarks);
	const moveToComplete = async (groupid, currModule) => {
		const docRef = doc(db, "Groups", groupid);

		// Remove the student ID from the requests array
		await updateDoc(docRef, {
			modules: arrayRemove(currModule),
		});

		// Add the student ID to the approved array
		await updateDoc(docRef, {
			completed: arrayUnion(currModule),
		});

		alert("Modules updated successfully!");
	};

	useEffect(() => {
		getGroupId(currUserEmail);
	}, [currUserEmail]);

	useEffect(() => {
		getGroupinfo(Gid);
	}, [Gid]);

	// console.log("description", projectDescription);
	useEffect(() => {
		showModules();
	}, [projectName]);

	useEffect(() => {
		showCompletedModules();
	}, [projectName]);

	useEffect(() => {
		showRemarks();
	}, [projectName]);

	// console.log("added modules :", allModule.length);
	// console.log("completed modules :", completedModule.length);

	useEffect(() => {
		const progress =
			(completedModule.length * 100) /
			(allModule.length + completedModule.length);
		setMyProgress(Math.round(progress));
		// console.log("percentage :", Math.round(progress));
	}, [completedModule, allModule]);

	const fetchPower = async () => {
		const usersCollection = collection(db, "Users");
		const userDocRef = doc(usersCollection, auth.currentUser.uid);
		const userSnapshot = await getDoc(userDocRef);
		if (userSnapshot.exists()) {
			// Access the "power" field value
			const power = userSnapshot.data().power;
			setMyPower(power);
			// console.log("my power : ", power);
		}
	};
	useEffect(() => {
		fetchPower();
	}, []);

	const editInfo = () => {
		if (myPower == true) {
			return (
				<div className="student-info">
					<div className="student-credentials">
						<input
							name="student"
							type="text"
							placeholder="Add New Module"
							className="input-box student-cred-input"
							value={moduleName}
							onChange={(e) => setModuleName(e.target.value)}
						/>

						<Button className="mybutton" onClick={addModule}>
							Save
						</Button>
					</div>
				</div>
			);
		}
	};

	if (Gid == "null") {
		return (
			<div className="mygroup">
				<form className="group-form ">
					<h1>Create Group</h1>
					<div className="action"></div>
					<br />
					<br />
					<br />
					<div className="action">
						<Button
							onClick={handleCreateGroup}
							className="colorHilightBtn createjoinbtn"
						>
							Create Group
						</Button>
					</div>
				</form>
			</div>
		);
	} else {
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
						<u>Project Description</u> : {projectDescription}
					</h3>
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
					<h3>Incomplete Modules</h3>
					<ol>
						{allModule.map((module) => (
							<li key={module} className="listelement">
								<h4>{module}</h4>
								<Button
									onClick={() => moveToComplete(Gid, module)}
									className="completebtn"
								>
									Complete
								</Button>
							</li>
						))}
					</ol>
				</div>
				<div className="myModules">{editInfo()}</div>
				<hr />
				<div className="myModules">
					<h3>Completed Modules</h3>
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
			</div>
		);
	}
};

export default Mygroup;
