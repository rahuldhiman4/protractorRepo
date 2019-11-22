import axios from "axios";
import { browser } from 'protractor';

axios.defaults.baseURL = browser.baseUrl;
axios.defaults.headers.common['X-Requested-By'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';

class LoginApi {
    async apiLogin(user: string): Promise<void> {
        var loginJson = require('../data/userdata.json');
        var username: string = loginJson[user].userName;
        var password: string = loginJson[user].userPassword;
        let response = await axios.post(
            "/api/rx/authentication/loginrequest",
            { "userName": username, "password": password },
        )
        console.log('Login API Status =============>', response.status);
        axios.defaults.headers.common['Cookie'] = `AR-JWT=${response.data}`;
    }
}

export default new LoginApi();