import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../StyleSheets/Sidebar.css";
import { auth, db } from "../firebaseConfig";
import getUserType from "./getUserType";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const Sidebar = () => {
	const [userT, setUserT] = useState([]);

	const getData = async () => {
		try {
			const userRef = doc(db, "Users", auth.currentUser.uid);
			const userDoc = await getDoc(userRef);
			if (userDoc.exists()) {
				setUserT(userDoc.data().userType);
				// console.log(userDoc.data());
			} else {
				console.log("No such document!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getData();
		// console.log("array", userT);
		// console.log("userdata from  Function", userT);
	}, [auth, userT]);

	//student Menu
	const studentMenu = [
		{
			title: "My Group",
			path: "/mygroup",
		},
		{
			title: "Mentor",
			path: "/mentor",
		},
	];

	// teacher Menu
	const teacherMenu = [
		{
			title: "Dashboard",
			path: "/dashboard",
		},
		{
			title: "Requests",
			path: "requests",
		},
		{
			title: "List",
			path: "/list",
		},
	];

	//Admin Menu
	const adminMenu = [
		{
			title: "All Groups",
			path: "/allgroups",
		},
		{
			title: "Teachers",
			path: "teachers",
		},
		{
			title: "Students",
			path: "students",
		},
	];

	function addelement(temp) {
		let dbtype;

		if (temp == "student") {
			dbtype = studentMenu;
		}
		if (temp == "teacher") {
			dbtype = teacherMenu;
		}
		if (temp == "admin") {
			dbtype = adminMenu;
		}

		return dbtype;
	}

	const uType = addelement(userT);
	useEffect(() => {
		// console.log(uType, uType);
	}, [userT]);
	return (
		<div className="menu">
			<div className="container-fluid">
				<div className="col-md-3">
					<div id="sidebar">
						<div className="container-fluid ">
							<h3 className="heading-text">Capstone Portal</h3>
						</div>

						<ul className="nav navbar-nav side-bar" id="list">
							{userT &&
								uType &&
								uType.map((item) => (
									<li
										className="side-bar tmargin sidebar-item"
										id="title"
										key={item.path}
									>
										<Link to={item.path}>{item.title}</Link>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
