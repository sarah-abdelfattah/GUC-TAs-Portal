import React from 'react'
import '../styles/Login.css'
import '../styles/util.css'

function Login() {
    var date = new Date();
    var hrs = date.getHours();
    var greet;

    if (hrs < 12)
    greet = 'Good Morning'
    else if (hrs >=12 && hrs <=16)
    greet = 'Good Afternoon'
    else if (hrs >=17 && hrs <=24)
	greet = 'Good Evening';
	
  return (
    <div class="container-login100" style={{backgroundImage: "url('../assets/guc.jpg')"}}>
		<div class="wrap-login100 p-l-55 p-r-55 p-t-80 p-b-30">
			<form class="login100-form validate-form">
				<span class="login100-form-title p-b-37">
					{greet}✨
				</span>

				<div class="wrap-input100 validate-input m-b-20" data-validate="Please enter your email">
					<input class="input100" type="text" name="username" placeholder="email"/>
					<span class="focus-input100"></span>
				</div>

				<div class="wrap-input100 validate-input m-b-25" data-validate = "Please enter your password">
					<input class="input100" type="password" name="pass" placeholder="password"/>
					<span class="focus-input100"></span>
				</div>

				<div class="container-login100-form-btn">
					<button class="login100-form-btn">
						Login In
					</button>
				</div>
			</form>
		</div>
	</div>
  )
}

export default Login
