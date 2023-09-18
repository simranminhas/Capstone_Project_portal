import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { doc, getDoc } from "firebase/firestore";

import "../StyleSheets/LoginRegister.css";

const Login = () => {
	const navigate = useNavigate();
	const [userType, setUserType] = useState("student");

	function handleClick() {
		navigate("/register");
	}

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const Navigate = useNavigate();

	const handleLogin = () => {
		if (!email || !password) {
			alert("Fill all fields");
			return;
		}
		signInWithEmailAndPassword(auth, email, password)
			.then(async (res) => {
				console.log("my res", res.user);
				if (userType == "student") {
					Navigate("/mygroup");
				} else if (userType == "teacher") {
					Navigate("/dashboard");
				} else {
					Navigate("/allgroups");
				}
			})
			.catch((err) => {
				console.log(err.message);
				alert("Invalid Credentials, Please try again");
			});
	};
	return (
		<div className="body1">
			<form className="login-form ">
				<h1>Login</h1>

				<div className="content">
					<div className="input-field">
						<select
							name="userType"
							id="userType"
							value={userType}
							onChange={(e) => setUserType(e.target.value)}
						>
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<div className="input-field"></div>
					<div className="input-field">
						<input
							type="email"
							placeholder="Email"
							autoComplete="nope"
							name="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="input-field">
						<input
							type="password"
							placeholder="Password"
							autoComplete="new-password"
							name="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
				</div>
				<div className="action">
					<Button className="colorHilightBtn" onClick={handleLogin}>
						Sign in
					</Button>
					<button onClick={handleClick}>Register</button>
				</div>
			</form>
		</div>
	);
};

export default Login;
