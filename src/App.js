import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Me from "./components/Me";
import "./App.css";
import api from './service/service'


function App() {
	const [userData, setUserData] = useState({});
	const [logStatus, setLogStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    console.log(logStatus)

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.type]: e.target.value });
    }
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { email, password } = userData;
			let res;
			switch (e.target.value) {
				case 'login':
					res = await api.login(email, password)
						.then((res) => {
							if (res.data.status === 'error') {
								setErrorMessage(res.data.message)
							} else if (res.data.status_code === 401) {
								setErrorMessage(res.data.body.message);
							} else {
								localStorage.setItem('access_token', res.data.body.access_token);
								localStorage.setItem('refresh_token', res.data.body.refresh_token);
								setLogStatus(true);
							}
							return res;
						});
					break;
				case 'sign up':
					res = await api.sign_up(email, password).then((res) => {
						if (res.data.code === 1018) {
							setErrorMessage('enter password')
						} else if (res.data.status === 'error') {
							setErrorMessage((res.data.message).toLowerCase());
						}
					});
                    break;
                default:
                    break;
			}
		} catch (error) {
			console.error(error)
		}
	}
	useEffect(() => {
		(async () => {
			let access_token = localStorage.getItem("access_token");
			if (access_token) {
				try {
					const res = await api.me();
					setLogStatus(true);
					return res.data;
				} catch (error) {
					console.error(error);
					alert(error.response.data.error);
				}
			}
        })()
	});

	return (
		<Router>
			<div className="App">
				<Switch>
					{!logStatus && (
						<>
							<Route path="/login">
								<form action="" noValidate={true} onChange={handleChange}>
									<input
										type="email"
										placeholder="Email"
										className="text-field"
									/>
									<br />
									<br />
									<input
										type="password"
										placeholder="Password"
										className="text-field"
									/>
									<br />
									<br />
									<div>{errorMessage}</div>
									<input type="submit" value="sign up" className="submit-button" onClick={handleSubmit} />
									<input type="submit" value="login" className="submit-button" onClick={handleSubmit} />
								</form>
							</Route>
							<Redirect to="/login" />
						</>
					)}
					{logStatus && (
						<>
							<Route path="/me" component={Me} />
							<Redirect to="/me" />
						</>
					)}
				</Switch>
			</div>
		</Router>
	);
}

export default App;
