import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class NavigationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        menu: '.a-menu__text',
        settingsButton: 'div.d-icon-gear',
        profileMenu: 'rx-shell adapt-profile button',
        helpIcon: '//*[@class="d-n-menu__link d-icon-left-question_circle"]',
        knowledgeConsoleFromKM: '[rx-view-component-id="3313266f-6ed4-47ee-ab90-54aab5bf3e99"] a',
        knowledgeConsoleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        hamburgerIcon: '.a-hamburger',
        hamburgerHelpIcon: '[class="d-n-hamburger__nav-link d-icon-left-question_circle"]',
        closeHambergerMenu: 'button.close.close-inverse',
    }

    async isHambergerIconPresent(): Promise<boolean> {
        return await $(this.selectors.hamburgerIcon).isPresent();
    }

    async isCreateCaseDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            let createCase: boolean = await element(by.buttonText('Case ')).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return createCase;
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Create')).click();
            return await element(by.cssContainingText(this.selectors.menu, 'Case')).isDisplayed();
        }
    }

    async isQuickCaseDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            let quickCase: boolean = await element(by.linkText('Quick Case ')).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(0).click();
            return quickCase;
        } else {
            await $$('button.a-menu__link').first().isDisplayed();
        }
    }

    async isCreateKnowledgeDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            let createKnowledge: boolean = await element(by.buttonText('Knowledge ')).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return createKnowledge;
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Create')).click();
            return await element(by.cssContainingText(this.selectors.menu, 'Knowledge')).isDisplayed();
        }
    }

    async isCaseConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            let caseConsole: boolean = await element(by.buttonText('Case ')).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return caseConsole;
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Workspace')).click();
            return await element(by.cssContainingText(this.selectors.menu, 'Case')).isDisplayed();
        }
    }

    async isKnowledgeConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            let knowledgeConsole: boolean = await element(by.buttonText('Knowledge ')).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return knowledgeConsole;
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Workspace')).click();
            return await element(by.cssContainingText(this.selectors.menu, 'Knowledge')).isDisplayed();
        }
    }

    async isTaskConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            let taskConsole: boolean = await element(by.buttonText('Task ')).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return taskConsole;
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Workspace')).click();
            return await element(by.cssContainingText(this.selectors.menu, 'Task')).isDisplayed();
        }
    }

    async isHelpIconDisplayed(): Promise<boolean> {
        // help is not visible.. yet to migrate this method on Angular 8
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            await $(this.selectors.hamburgerIcon).click();
            let helpIcon: boolean = await $(this.selectors.hamburgerHelpIcon).isDisplayed();
            let closedHamberger: boolean = await $(this.selectors.closeHambergerMenu).isDisplayed();
            if (closedHamberger == true) {
                $(this.selectors.closeHambergerMenu).click();
            } return helpIcon;
        } else {
            return await element(by.xpath(this.selectors.helpIcon)).isDisplayed();
        }
    }

    async gotoKnoweldgeConsoleFromKM(): Promise<void> {
        await $(this.selectors.knowledgeConsoleFromKM).click();
    }

    async gotoCaseConsole(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            await element(by.buttonText('Case ')).click();
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Workspace')).click();
            await element(by.cssContainingText(this.selectors.menu, 'Case')).click();
        }
        await browser.wait(this.EC.titleContains('Cases - Business Workflows'), 10000);
    }

    async gotoKnowledgeConsole(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            await element(by.buttonText('Knowledge ')).click();
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Workspace')).click();
            await element(by.cssContainingText(this.selectors.menu, 'Knowledge')).click();
        }
        await browser.wait(this.EC.titleContains('Knowledge Articles - Business Workflows'), 10000);
    }

    async gotoTaskConsole(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            await element(by.buttonText('Task ')).click();
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Workspace')).click();
            await element(by.cssContainingText(this.selectors.menu, 'Task')).click();
        }
        await browser.wait(this.EC.titleContains('Tasks - Business Workflows'), 10000);
    }

    async gotoCreateCase(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            await element(by.buttonText('Case ')).click();
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Create')).click();
            await element(by.cssContainingText(this.selectors.menu, 'Case')).click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 10000);
    }

    async gotoQuickCase(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.buttonText('Quick Case ')).click();
        } else {
            await $$('button.a-menu__link').first().click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Quick Case - Business Workflows'), 10000);
    }

    async gotoCreateKnowledge(): Promise<void> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            await element(by.buttonText('Knowledge ')).click();
        } else {
            await element(by.cssContainingText(this.selectors.menu, 'Create')).click();
            await element(by.cssContainingText(this.selectors.menu, 'Knowledge')).click();
        }
        await browser.wait(this.EC.titleContains('Knowledge Article Templates Preview'), 10000);
    }

    async gotoPersonProfile(): Promise<void> {
        await browser.refresh();
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.buttonText('My Profile ')).click();
        } else {
            await $(this.selectors.profileMenu).click();
            await element(by.buttonText('My Profile ')).click();
        }
        await browser.wait(this.EC.titleContains('Person Profile - Business Workflows'), 10000);
    }

    async gotoSettingsPage(): Promise<void> {
        await $(this.selectors.settingsButton).click();
    }

    async gotoSettingsMenuItem(pathStr: string, expectedTitle: string): Promise<string> {
        const menuItems: Array<string> = pathStr.split('--');
        let menuItemStr = '//div[contains(@class,"tree-selected")]';
        let ismenuItemSelected: boolean = false;
        try {
            ismenuItemSelected = await element(by.xpath(menuItemStr)).isEnabled();
        } catch (Ex) {
            ismenuItemSelected == false;
        }
        if (ismenuItemSelected) {
            let menuItemVal = await element(by.xpath(menuItemStr)).getText();
            if (menuItems.includes(menuItemVal)) {
                console.log("Menu Item already selected.");
            }
        } else {
            for (let i = 0; i < menuItems.length; i++) {
                if (i < menuItems.length - 1) {
                    await element(by.xpath(`//rx-administration-settings//*[text()="${menuItems[i]}"]/../*[@class="tree-branch-head"]`)).click();
                } else {
                    await element(by.xpath(`//rx-administration-settings//*[text()="${menuItems[i]}"]`)).click();
                }
            }
        }
        await browser.wait(this.EC.titleContains(expectedTitle), 10000);
        return await browser.getTitle();
    }

    async isSettingSubMenusMatches(pathStr: string, listOfSubItems: string[]): Promise<boolean> {
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
        return await element(by.xpath(`//rx-administration-settings//*[text()="${pathStr}"]/../*[@class="tree-branch-head"]`)).isPresent();
    }

    async signOut(): Promise<void> {
        await browser.refresh();
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.buttonText(' Sign Out')).click();
        } else {
            await $(this.selectors.profileMenu).click();
            await element(by.buttonText('Sign Out')).click();
        }
        let noAccess = this.EC.titleContains('No Access');
        let bwfLogin = this.EC.titleContains('Login - Business Workflows');
        await browser.wait(this.EC.or(noAccess, bwfLogin), 10000);
    }

    async switchToAnotherApplication(applicationName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.menu, ' Business Workflows ')).click();
        await element(by.cssContainingText(this.selectors.menu, applicationName)).click();
    }
}

export default new NavigationPage();