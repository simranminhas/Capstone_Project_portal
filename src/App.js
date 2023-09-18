import React, { useCallback, useEffect, useState } from "react";

import "@fontsource/rubik";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PageNotFound from "./Pages/PageNotFound";
import Home from "./Pages/Home";
import Sidebar from "./Pages/Sidebar";
import Navbar from "./Pages/navbar";
import Mygroup from "./Pages/Student/Mygroup";
import Mentor from "./Pages/Student/mentors";
import Dashboard from "./Pages/Teacher/Dashboard";
import Requests from "./Pages/Teacher/Requests";
import List from "./Pages/Teacher/List";
import Teachers from "./Pages/Admin/Teachers";
import AllGroups from "./Pages/Admin/Allgroups";
import ProjectDetails from "./Pages/Student/ProjectDetials";
import AddMembers from "./Pages/Student/AddMembers";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { auth } from "./firebaseConfig";
import GroupDetails from "./Pages/groupDetailspage";
import Students from "./Pages/Admin/Students";

function App() {
	const [isAuthenticate, setIsAuthenticate] = useState(false);

	useEffect(() => {
		console.log("is", auth);
		// auth.signOut();
		auth.onAuthStateChanged((user) => {
			if (auth && user) {
				setIsAuthenticate(true);
			} else {
				setIsAuthenticate(false);
			}
		});
	}, []);

	if (!isAuthenticate && auth) {
		return (
			<Router>
				<ToastContainer />

				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="*" element={<PageNotFound />} />
				</Routes>
			</Router>
		);
	} else {
		return (
			<Router>
				<ToastContainer />
				<Navbar />
				<Sidebar />

				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<PageNotFound />} />
					<Route path="/mygroup" element={<Mygroup />} />
					<Route path="/mentor" element={<Mentor />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/requests" element={<Requests />} />
					<Route path="/list" element={<List />} />
					<Route path="/allgroups" element={<AllGroups />} />
					<Route path="/teachers" element={<Teachers />} />
					<Route path="/students" element={<Students />} />
					<Route path="/projectdetails" element={<ProjectDetails />} />
					<Route path="/addmembers" element={<AddMembers />} />
					<Route path="/groupdetails/:id" element={<GroupDetails />} />
				</Routes>
			</Router>
		);
	}
}

export default App;
