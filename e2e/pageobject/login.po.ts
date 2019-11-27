import { $, ProtractorExpectedConditions, browser, protractor } from "protractor";

class LoginPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        loginForm: 'form[name="loginForm"]',
        userName: 'input[rx-id="username"]',
        password: 'input[type="password"]',
        signInButton: 'button.login__submit'
    }

    async login(user: string): Promise<void> {
        await browser.manage().window().setSize(1300, 700);
        var loginJson = require('../data/userdata.json');
        var username: string = loginJson[user].userName;
        var password: string = loginJson[user].userPassword;
        await browser.wait(this.EC.visibilityOf($(this.selectors.loginForm)), 30000);
        await $(this.selectors.userName).sendKeys(username);
        await $(this.selectors.password).sendKeys(password);
        await $(this.selectors.signInButton).click();
        await browser.wait(this.EC.titleContains('Cases - Business Workflows'));
    }
}

export default new LoginPage();