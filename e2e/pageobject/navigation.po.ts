import { element, by, ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class NavigationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createMenu: '//rx-shell//*[text()="Create"]/..',
        createCaseMenuItem: '//rx-shell//*[text()="Create"]/../..//a[contains(text(),"Case")]',
        createKnowledgeMenu: '//rx-shell//*[text()="Create"]/../..//a[contains(text(),"Knowledge ")]',
        createQuickCaseMenu: '//rx-shell//*[text()="Quick Case"]/..',
        caseConsoleMenuItem: '(//li[contains(@class,"d-n-dropdown__item")]//a[text()="Case "])[1]',
        knowledgeConsoleMenuItem: '(//li[contains(@class,"d-n-dropdown__item")]//a[text()="Knowledge "])[1]',
        taskConsoleMenuItem: '(//li[contains(@class,"d-n-dropdown__item")]//a[text()="Task "])[1]',
        settingsButton: 'rx-shell .d-n-action__settings',
        settingsMenuItemContainer: 'rx-administration-settings',
        profileMenu: '.d-n-nav__profile',
        signOutMenuItem: '.d-n-nav__profile a',
        workspaceMenu: '//rx-shell//*[text()="Workspace"]/..'
    }

    verticalSelectors = {
        hamburgerIcon: '.d-n-hamburger.rx-shell__button-container',
        createCaseMenuItem: '//*[@title="Create"]/parent::*//*[@title="Case"]',
        createKnowlegeMenuItem: '//*[@title="Create"]/parent::*//*[@title="Knowledge"]',
        createQuickCaseMenu: '[title="Quick Case"]',
        caseConsoleMenuItem: '(//a[@title="Case"])[1]',
        knowledgeConsoleMenuItem: '(//a[@title="Knowledge"])[1]',
        taskConsoleMenuItem: '(//a[@title="Task"])[1]'
    }

    async gotCreateCase(): Promise<void> {
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if (hamburgerStatus == 'true') {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createMenu))), 60000);
            await element(by.xpath(this.selectors.createMenu)).click();
            await element(by.xpath(this.selectors.createCaseMenuItem)).click();
        } else {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createCaseMenuItem))), 60000);
            await element(by.xpath(this.verticalSelectors.createCaseMenuItem)).click();        
        }
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 30000);
    }

    async gotoQuickCase(): Promise<void> {
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if (hamburgerStatus == 'true') {
            await element(by.xpath(this.selectors.createQuickCaseMenu)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.createQuickCaseMenu)), 60000);
            await $(this.verticalSelectors.createQuickCaseMenu).click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Quick Case - Business Workflows'), 30000);
    }

    async gotoCaseConsole(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($('.modal-open')));
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)));
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if (hamburgerStatus == 'true') {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))), 60000);
            await element(by.xpath(this.selectors.workspaceMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.caseConsoleMenuItem))));
            await element(by.xpath(this.selectors.caseConsoleMenuItem)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.hamburgerIcon).$('button')), 60000);
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.caseConsoleMenuItem))), 60000);
            await element(by.xpath(this.verticalSelectors.caseConsoleMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Cases - Business Workflows'), 30000);
    }

    async gotoKnowledgeConsole(): Promise<void> {
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)));
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if (hamburgerStatus == 'true') {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
            await element(by.xpath(this.selectors.workspaceMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.knowledgeConsoleMenuItem))));
            await element(by.xpath(this.selectors.knowledgeConsoleMenuItem)).click();
        } else {
            // await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.hamburgerIcon).$('button')));
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.knowledgeConsoleMenuItem))));
            await element(by.xpath(this.verticalSelectors.knowledgeConsoleMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Knowledge Articles - Business Workflows'));
    }


    async gotoTaskConsole(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)));
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if (hamburgerStatus == 'true') {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))), 60000);
            await element(by.xpath(this.selectors.workspaceMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.taskConsoleMenuItem))));
            await element(by.xpath(this.selectors.taskConsoleMenuItem)).click();
        } else {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.taskConsoleMenuItem))), 60000);
            await element(by.xpath(this.verticalSelectors.taskConsoleMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Tasks - Business Workflows'), 30000);
    }

    async gotoSettingsPage(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.settingsButton)));
        await $(this.selectors.settingsButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsMenuItemContainer)));
    }

    async gotoSettingsMenuItem(pathStr: string, expectedTitle: string): Promise<string> {
        const menuItems: Array<string> = pathStr.split('--');
        await browser.wait(this.EC.visibilityOf($('treecontrol')));
        for (let i = 0; i < menuItems.length; i++) {
            if (i < menuItems.length - 1) {
                await element(by.xpath(`//rx-administration-settings//*[text()="${menuItems[i]}"]/../*[@class="tree-branch-head"]`)).click();
            } else {
                await element(by.xpath(`//rx-administration-settings//*[text()="${menuItems[i]}"]`)).click();
            }
        }
        await browser.wait(this.EC.titleContains(expectedTitle));
        return await browser.getTitle();
    }

    async signOut(): Promise<void> {
        await browser.refresh();
        await browser.wait(this.EC.visibilityOf($(this.selectors.profileMenu)));
        await browser.actions().mouseMove($(this.selectors.profileMenu)).perform();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out'))));
        await element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out')).click();
        await browser.wait(this.EC.titleContains('Login - Business Workflows'));
    }

    async gotoKnowledge(): Promise<void> {
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if (hamburgerStatus == 'true') {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createMenu))), 60000);
            await element(by.xpath(this.selectors.createMenu)).click();
            await element(by.xpath(this.selectors.createKnowledgeMenu)).click();
        } else {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createKnowlegeMenuItem))), 60000);
            await element(by.xpath(this.verticalSelectors.createKnowlegeMenuItem)).click();

        }
        await browser.wait(this.EC.titleContains('Knowledge Article Templates Preview - Business Workflows'), 30000);
    }
}

export default new NavigationPage();