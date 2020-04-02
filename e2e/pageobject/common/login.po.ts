import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class LoginPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        loginForm: 'form.form',
        userName: 'input[name="username"]',
        password: 'input[type="password"]',
        signInButton: 'button[rx-id="sign-in-button"]',
        settingsButton: 'button.d-icon-gear',
    }

    async login(user: string): Promise<void> {
        let loginJson = require('../../data/userdata.json');
        let username: string = loginJson[user].userName;
        let password: string = loginJson[user].userPassword;
        await browser.wait(this.EC.visibilityOf($(this.selectors.loginForm)), 30000);
        await $(this.selectors.userName).sendKeys(username);
        await $(this.selectors.password).sendKeys(password);
        await $(this.selectors.signInButton).click();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)), 30000);
        let caseConsole = this.EC.titleContains('Cases - Business Workflows');
        let knowledgeConsole = this.EC.titleContains('Knowledge Articles - Business Workflows');
        let tasksConsole = this.EC.titleContains('Tasks - Business Workflows');
        let innovationStudio = this.EC.titleContains('Workspace - Innovation Studio');
        let noAccess = this.EC.titleContains('No Access');
        await browser.wait(this.EC.or(caseConsole, knowledgeConsole, tasksConsole, innovationStudio, noAccess), 30000);
//        await utilCommon.waitUntilPopUpDisappear();
    }

    async loginWithCredentials(user: string, password: string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.loginForm)), 30000);
        await $(this.selectors.userName).sendKeys(user);
        await $(this.selectors.password).sendKeys(password);
        await $(this.selectors.signInButton).click();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)), 30000);
        let caseConsole = this.EC.titleContains('Cases - Business Workflows');
        let knowledgeConsole = this.EC.titleContains('Knowledge Articles - Business Workflows');
        let tasksConsole = this.EC.titleContains('Tasks - Business Workflows');
        let innovationStudio = this.EC.titleContains('Workspace - Innovation Studio');
        let noAccess = this.EC.titleContains('No Access');
        await browser.wait(this.EC.or(caseConsole, knowledgeConsole, tasksConsole, innovationStudio, noAccess), 30000);
//        await utilCommon.waitUntilPopUpDisappear();
    }
}

export default new LoginPage();