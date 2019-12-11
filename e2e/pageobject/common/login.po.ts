import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class LoginPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        loginForm: 'form[name="loginForm"]',
        userName: 'input[rx-id="username"]',
        password: 'input[type="password"]',
        signInButton: 'button.login__submit',
        settingsButton: 'rx-shell .d-n-action__settings',
    }

    async login(user: string): Promise<void> {
        var loginJson = require('../data/userdata.json');
        var username: string = loginJson[user].userName;
        var password: string = loginJson[user].userPassword;
        await browser.wait(this.EC.visibilityOf($(this.selectors.loginForm)), 30000);
        await $(this.selectors.userName).sendKeys(username);
        await $(this.selectors.password).sendKeys(password);
        await $(this.selectors.signInButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)), 30000);
        let caseConsole = this.EC.titleContains('Cases - Business Workflows');
        let knowledgeConsole = this.EC.titleContains('Knowledge Articles - Business Workflows');
        let tasksConsole = this.EC.titleContains('Tasks - Business Workflows');
        let innovationStudio = this.EC.titleContains('Workspace - Innovation Studio');
        let noAccess = this.EC.titleContains('No Access');
        await browser.wait(this.EC.or(caseConsole, knowledgeConsole, tasksConsole, innovationStudio, noAccess), 5000);
        await utilCommon.waitUntilPopUpDisappear();
    }

    async loginWithCredentials(user: string, password: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.loginForm)), 30000);
        await $(this.selectors.userName).sendKeys(user);
        await $(this.selectors.password).sendKeys(password);
        await $(this.selectors.signInButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)), 30000);
        let caseConsole = this.EC.titleContains('Cases - Business Workflows');
        let knowledgeConsole = this.EC.titleContains('Knowledge Articles - Business Workflows');
        let tasksConsole = this.EC.titleContains('Tasks - Business Workflows');
        let innovationStudio = this.EC.titleContains('Workspace - Innovation Studio');
        let noAccess = this.EC.titleContains('No Access');
        await browser.wait(this.EC.or(caseConsole, knowledgeConsole, tasksConsole, innovationStudio, noAccess), 5000);
        await utilCommon.waitUntilPopUpDisappear();
    }
}

export default new LoginPage();