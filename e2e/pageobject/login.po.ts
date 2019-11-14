import { $, ProtractorExpectedConditions, browser, protractor, element } from "protractor";
class LoginPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        loginForm: 'form[name="loginForm"]',
        userName: 'input[rx-id="username"]',
        password: 'input[type="password"]',
        signInButton: 'button.login__submit'
    }

    async login(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.loginForm)), 30000);
        await $(this.selectors.userName).sendKeys('qkatawazi@petramco.com');
        await $(this.selectors.password).sendKeys('Password_1234');
        await $(this.selectors.signInButton).click();
        await browser.wait(this.EC.titleContains('Cases - Business Workflows'));
    }
}

export default new LoginPage();