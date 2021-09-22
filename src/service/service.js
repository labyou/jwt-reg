const axios = require("axios");

const baseUrl = "http://142.93.134.108:1111";

axios.interceptors.request.use(
	(config) => {
		document.body.classList.add("loading-indicator");
        return config;
    }
);

axios.interceptors.response.use(
	(responce) => {
		let refresh_token = localStorage.getItem('refresh_token')
		if (responce.data.statusCode === 401 && responce.data.body.code === 1006 && refresh_token) {
			return axios({
				method: 'post',
				url: `${baseUrl}/refresh`,
				headers: { 'Authorization': `Bearer ${refresh_token}` },
			}).then((res) => {
				if (res.status === 200) {
					localStorage.setItem('access_token', res.data.body.access_token);
					localStorage.setItem('refresh_token', res.data.body.refresh_token)
					console.log('Token refreshed');
					return api.me();
				};
			});
		};
		document.body.classList.remove('loading-indicator')
        return responce;
    }
);

const api = {
	sign_up: (email, password) => {
		return axios.post(`${baseUrl}/sign_up`, {
			email: email,
			password: password,
        }).then((res) => {
            return res;
        }).catch((err) => {
            return err;
        })
	},
	login: (email, password) => {
		return axios.post(
			`${baseUrl}/login?email=${email}&password=${password}`
        ).then((res) => {
			return res;
		}).catch((err) => {
			return err;
		});
	},
	me: () => {
		let access_token = localStorage.getItem('access_token')
		return axios.get(`${baseUrl}/me`, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
	},
};

export default api;

