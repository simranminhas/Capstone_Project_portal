import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "../StyleSheets/Sidebar.css";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Button } from "reactstrap";

const Navbar = () => {
	const currUserId = auth.currentUser.uid;
	const currUserEmail = auth.currentUser.email;
	const [isAuthenticate, setIsAuthenticate] = useState("");
	const nav = useNavigate();

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsAuthenticate(user);
			} else {
				setIsAuthenticate("");
			}
		});
	}, []);

	async function handleLogout() {
		await auth.signOut();

		setIsAuthenticate(false);
		nav("/login");
	}

	return (
		<nav className="navbar navbar-inverse navbar-fixed-top mynavbar">
			<div>
				<div className="navbar-header">
					<button
						className="navbar-toggle"
						data-toggle="collapse"
						data-target=".navbar-collapse"
					>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
				</div>
				<div className="collapse navbar-collapse">
					<ul className="nav navbar-nav navbar-right">
						<li>
							<a href="#" className="fontcolor">
								<span className="glyphicon glyphicon-user ">&nbsp;</span>
								{currUserEmail}
							</a>
						</li>

						<li>
							<Button
								className="glyphicon-logout logoutbtn"
								onClick={handleLogout}
							>
								Logout
							</Button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
