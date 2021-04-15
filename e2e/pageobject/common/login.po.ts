import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
let loginJson = require('../../data/userdata.json');

export interface Creds {
    user: string;
    pass: string;
}

class LoginPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        userName: 'input[name="username"]',
        password: 'input[type="password"]',
        signInButton: 'button[rx-id="sign-in-button"]',
        rssoUserName: 'input[id="user_login"]',
        rssoPassword: 'input[id="login_user_password"]',
        rssoSignInButton: 'button[id="login-jsp-btn"]',
    }

    async login(userName: string, password?: string): Promise<void> {
        let credentials = await this.getCredentials(userName, password);
        await this.coreLogin(credentials.user, credentials.pass);
    }

    async getCredentials(username: string, password?: string): Promise<Creds> {
        let myUser: string = undefined;
        let myPass: string = undefined;
        if (!password) {
            myUser = loginJson[username].userName;
            myPass = loginJson[username].userPassword;
        } else {
            myUser = username;
            myPass = password;
        }
        //if (await browser.params.rsso.toLowerCase() == 'true') myUser.substring(0, myUser.indexOf("@"));
        return {
            user: myUser,
            pass: myPass
        }
    }

    async coreLogin(user: string, password: string): Promise<void> {
        let userLocator = this.selectors.userName;
        let passwordLocator = this.selectors.password;
        let signInButtonLocator = this.selectors.signInButton;
        // if (await browser.params.rsso.toLowerCase() == 'true') {
        //     userLocator = this.selectors.rssoUserName;
        //     passwordLocator = this.selectors.rssoPassword;
        //     signInButtonLocator = this.selectors.rssoSignInButton;
        // }
        await browser.wait(this.EC.elementToBeClickable($(userLocator)), 30000).then(async () => {
            await $(userLocator).clear();
            await $(userLocator).sendKeys(user);
        });
        console.log(`Login to BWF with ${user}`);
        await $(passwordLocator).clear();
        await $(passwordLocator).sendKeys(password);
        await $(signInButtonLocator).click();
        let caseConsole = this.EC.titleContains('Cases - Business Workflows');
        let knowledgeConsole = this.EC.titleContains('Knowledge Articles - Business Workflows');
        let tasksConsole = this.EC.titleContains('Tasks - Business Workflows');
        let innovationStudio = this.EC.titleContains('Workspace - Innovation Studio');
        let noAccess = this.EC.titleContains('No Access');
        await browser.wait(this.EC.or(caseConsole, knowledgeConsole, tasksConsole, innovationStudio, noAccess), 30000);
        console.log(' === Login Successful === ');
    }
}

export default new LoginPage();