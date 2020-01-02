import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

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
        workspaceMenu: '//rx-shell//*[text()="Workspace"]/..',
        modalOpen: '.modal-open',
        helpIcon: '//*[@class="d-n-menu__link d-icon-left-question_circle"]',
    }

    verticalSelectors = {
        hamburgerIcon: '.d-n-hamburger.rx-shell__button-container',
        createCaseMenuItem: '//*[@title="Create"]/parent::*//*[@title="Case"]',
        createKnowlegeMenuItem: '//*[@title="Create"]/parent::*//*[@title="Knowledge"]',
        createQuickCaseMenu: '[title="Quick Case"]',
        caseConsoleMenuItem: '(//a[@title="Case"])[1]',
        knowledgeConsoleMenuItem: '(//a[@title="Knowledge"])[1]',
        taskConsoleMenuItem: '(//a[@title="Task"])[1]',
        helpIcon: '[class="d-n-hamburger__nav-link d-icon-left-question_circle"]',
        closeHambergerMenu: '.d-n-hamburger__close',
    }

    async isHambergerIconPresent(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)));
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        await browser.wait(this.EC.or(async () => {
            await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        }));
        let hamburgerHideAttribute = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        return hamburgerHideAttribute == 'true' ? false : true;
    }

    async gotCreateCase(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createCaseMenuItem))));
            await element(by.xpath(this.verticalSelectors.createCaseMenuItem)).click();
        } else {
            await browser.wait(this.EC.visibilityOf(element(by.xpath(this.selectors.createMenu))));
            await element(by.xpath(this.selectors.createMenu)).click();
            await element(by.xpath(this.selectors.createCaseMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 30000);
    }

    async isCreateCaseDisplayed(): Promise<boolean> {

        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createCaseMenuItem))));
            let createCase: boolean = await element(by.xpath(this.verticalSelectors.createCaseMenuItem)).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            }
            return createCase;
        } else {
            let displayedValue: boolean = await element(by.xpath(this.selectors.createCaseMenuItem)).isDisplayed();
            if (displayedValue == false) {
                await browser.wait(this.EC.visibilityOf(element(by.xpath(this.selectors.createMenu))));
                await element(by.xpath(this.selectors.createMenu)).click();
            } return await element(by.xpath(this.selectors.createCaseMenuItem)).isDisplayed();
        }
    }

    async isQuickCaseDisplayed(): Promise<boolean> {

        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.createQuickCaseMenu)));
            let quickCase: boolean = await $(this.verticalSelectors.createQuickCaseMenu).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            }
            return quickCase;
        } else {
            return await element(by.xpath(this.selectors.createQuickCaseMenu)).isDisplayed();
        }
    }

    async isCreateKnowledge(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createKnowlegeMenuItem))));
            let createKnowledge: boolean = await element(by.xpath(this.verticalSelectors.createKnowlegeMenuItem)).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            }
            return createKnowledge;
        } else {
            let displayedValue: boolean = await element(by.xpath(this.selectors.createKnowledgeMenu)).isDisplayed();
            if (displayedValue == false) {
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createMenu))));
                await element(by.xpath(this.selectors.createMenu)).click();
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createKnowledgeMenu))));
            } return await element(by.xpath(this.selectors.createKnowledgeMenu)).isDisplayed();
        }
    }

    async isCaseConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.hamburgerIcon).$('button')));
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.caseConsoleMenuItem))));
            let caseConsole: boolean = await element(by.xpath(this.verticalSelectors.caseConsoleMenuItem)).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            }
            return caseConsole;
        } else {
            let displayedValue: boolean = await element(by.xpath(this.selectors.caseConsoleMenuItem)).isDisplayed();
            if (displayedValue == false) {
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
                await element(by.xpath(this.selectors.workspaceMenu)).click();
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.caseConsoleMenuItem))));
            } return await element(by.xpath(this.selectors.caseConsoleMenuItem)).isDisplayed();
        }
    }

    async isKnowledgeConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.knowledgeConsoleMenuItem))));
            let KnowledgeConsole = await element(by.xpath(this.verticalSelectors.knowledgeConsoleMenuItem)).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            }
            return KnowledgeConsole;
        } else {
            let displayedValue: boolean = await element(by.xpath(this.selectors.knowledgeConsoleMenuItem)).isDisplayed();
            if (displayedValue = false) {
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
                await element(by.xpath(this.selectors.workspaceMenu)).click();
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.knowledgeConsoleMenuItem))));
            } return await element(by.xpath(this.selectors.knowledgeConsoleMenuItem)).isDisplayed();
        }
    }

    async isHelpIconDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.createQuickCaseMenu)));
            let helpIcon: boolean = await $(this.verticalSelectors.helpIcon).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            } return helpIcon;
        } else {
            return await element(by.xpath(this.selectors.helpIcon)).isDisplayed();
        }
    }

    async isTaskConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.taskConsoleMenuItem))));
            let taskConsole: boolean = await element(by.xpath(this.verticalSelectors.taskConsoleMenuItem)).isDisplayed();
            let closedHamberger: boolean = await $(this.verticalSelectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.verticalSelectors.closeHambergerMenu).click();
            } return taskConsole;
        } else {
            let displayedvalue: boolean = await element(by.xpath(this.selectors.taskConsoleMenuItem)).isDisplayed();
            if (displayedvalue == false) {
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
                await element(by.xpath(this.selectors.workspaceMenu)).click();
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.taskConsoleMenuItem))));
            }
            return await element(by.xpath(this.selectors.taskConsoleMenuItem)).isDisplayed();
        }
    }

    async gotoQuickCase(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.createQuickCaseMenu)));
            await $(this.verticalSelectors.createQuickCaseMenu).click();
        } else {
            await element(by.xpath(this.selectors.createQuickCaseMenu)).click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Quick Case - Business Workflows'), 30000);
    }

    async gotoCaseConsole(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.hamburgerIcon).$('button')));
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.caseConsoleMenuItem))));
            await element(by.xpath(this.verticalSelectors.caseConsoleMenuItem)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
            await element(by.xpath(this.selectors.workspaceMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.caseConsoleMenuItem))));
            await element(by.xpath(this.selectors.caseConsoleMenuItem)).click();
        }
        await utilCommon.waitUntilSpinnerToHide();
        await browser.wait(this.EC.titleContains('Cases - Business Workflows'), 30000);
    }

    async gotoKnowledgeConsole(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.knowledgeConsoleMenuItem))));
            await element(by.xpath(this.verticalSelectors.knowledgeConsoleMenuItem)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
            await element(by.xpath(this.selectors.workspaceMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.knowledgeConsoleMenuItem))));
            await element(by.xpath(this.selectors.knowledgeConsoleMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Knowledge Articles - Business Workflows'));
    }

    async gotoTaskConsole(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.taskConsoleMenuItem))));
            await element(by.xpath(this.verticalSelectors.taskConsoleMenuItem)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.workspaceMenu))));
            await element(by.xpath(this.selectors.workspaceMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.taskConsoleMenuItem))));
            await element(by.xpath(this.selectors.taskConsoleMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Tasks - Business Workflows'), 30000);
    }

    async gotoCreateKnowledge(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable($('.d-n-hamburger__close')));
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createKnowlegeMenuItem))));
            await element(by.xpath(this.verticalSelectors.createKnowlegeMenuItem)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createMenu))));
            await element(by.xpath(this.selectors.createMenu)).click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createKnowledgeMenu))));
            await element(by.xpath(this.selectors.createKnowledgeMenu)).click();
        }
        await utilCommon.waitUntilSpinnerToHide();
        await browser.wait(this.EC.titleContains('Knowledge Article Templates Preview - Business Workflows'), 30000);
    }

    async gotoSettingsPage(): Promise<void> {
        await browser.wait(this.EC.invisibilityOf($(this.selectors.modalOpen)), 2000);
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
        await utilCommon.waitUntilSpinnerToHide();
        await browser.wait(this.EC.titleContains(expectedTitle));
        return await browser.getTitle();
    }

    async isSettingsSubMenu(pathStr: string, listOfSubItems: string[]): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($('treecontrol')));
        await element(by.xpath(`//rx-administration-settings//*[text()="${pathStr}"]/../*[@class="tree-branch-head"]`)).click();
        let loc: string = `//*[text()="${pathStr}"]/ancestor::li[@class="tree-expanded"]//*[@class="tree-label "]`;
        let list: string[] = [];
        let subitemCounts: number = await element.all(by.xpath(loc)).count();
        let baseCounts: number = 1;
        for (baseCounts; baseCounts <= subitemCounts; baseCounts++) {
            list[baseCounts] = await element(by.xpath(`(//*[text()="${pathStr}"]/ancestor::li[@class="tree-expanded"]//*[@class="tree-label "])` + "[" + baseCounts + "]")).getText();
        }
        let returnedvalue = list.filter(function (el) {
            return el != null;
        });

        return returnedvalue.length === listOfSubItems.length && returnedvalue.every(
            (value, index) => (value === listOfSubItems[index])
        );

    }

    async isSettingMenuPresent(pathStr: string): Promise<boolean> {
        try {
            await element(by.xpath(`//rx-administration-settings//*[text()="${pathStr}"]/../*[@class="tree-branch-head"]`)).isDisplayed();
            return true;
        } catch (error) {
            return false;
        }
    }

    async goToPersonProfile(): Promise<void> {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
        await browser.wait(this.EC.visibilityOf($(this.selectors.profileMenu)));
        await browser.actions().mouseMove($(this.selectors.profileMenu)).perform();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.signOutMenuItem, 'My Profile'))));
        await element(by.cssContainingText(this.selectors.signOutMenuItem, 'My Profile')).click();
        await browser.wait(this.EC.titleContains('Person Profile - Business Workflows'));
    }

    async signOut(): Promise<void> {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
        await browser.wait(this.EC.visibilityOf($(this.selectors.profileMenu)));
        await browser.actions().mouseMove($(this.selectors.profileMenu)).perform();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out'))));
        await element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out')).click();
        await browser.wait(this.EC.titleContains('Login - Business Workflows'));
    }
}

export default new NavigationPage();