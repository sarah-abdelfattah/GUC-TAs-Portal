import React, { useState, useEffect } from "react";
import axios from "axios";
import setAuthToken from '../helpers/setAuthToken';
import { link } from '../helpers/constants';

function Login() {
	const [gucId, setId] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState();

    var date = new Date();
    var hrs = date.getHours();
    var greet;

    if (hrs < 12)
       greet = 'Good Morning'
    else if (hrs >=12 && hrs <=16)
       greet = 'Good Afternoon'
    else if (hrs >=17 && hrs <=24)
	   greet = 'Good Evening';
	
	useEffect(() => {
		const loggedInUser = localStorage.getItem("user");
		if (loggedInUser) {
		  const foundUser = JSON.parse(loggedInUser);
		  setUser(foundUser);
		}
	}, []);

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = { gucId, password };
		const response = await axios.post(`${link}/logIn`, user);
		console.log(response.data.token);
		if(response.err){
			// here we need to show toast and display err
			console.log(response.err);
		}
		else{
			setUser(response.header);
			// store the user in the localStorage
			const token = response.data.token
			localStorage.setItem('user', token);
			setAuthToken(token);
			//document.location.href = '/home'
			console.log(token);
		}
	};

	return (
		<div className="container-login100">
			<div className="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
				<form onSubmit={handleSubmit} className="login100-form validate-form">
					<span className="login100-form-title p-b-37">
						{greet}✨
					</span>

					<div className="wrap-input100 validate-input m-b-20" data-validate="Please enter your GUC ID">
						<input 
						value={gucId}
						className="input100"
						type="text"
						name="text"
						placeholder="guc id "
						onChange = {({ target }) => setId(target.value)}
						/>
						<span className="focus-input100"></span>
					</div>

					<div className="wrap-input100 validate-input m-b-25" data-validate = "Please enter your password">
						<input
						className="input100" 
						type="password" 
						value={password}
						placeholder="password"
						onChange={({ target }) => setPassword(target.value)}
						/>
						<span className="focus-input100"></span>
					</div>

					<div className="container-login100-form-btn">
						<button type="submit" className="login100-form-btn">
							Login In
						</button>
					</div>
				</form>
			</div>
		</div>
	)
	}

export default Login
