import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';

class NavigationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        menu: '.a-menu__text',
        settingsButton: 'button.d-icon-gear',
        profileMenu: 'rx-shell adapt-profile button',
        helpIcon: '//*[@class="d-n-menu__link d-icon-left-question_circle"]',
        knowledgeConsoleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        hamburgerIcon: '.a-hamburger',
        hamburgerHelpIcon: '[class="d-n-hamburger__nav-link d-icon-left-question_circle"]',
        closeHambergerMenu: 'button.close.close-inverse',
        panelHeadingOfSetting: 'rx-administration-settings .rx-admin-settings .panel-heading h4',
        adaptIconTiles: 'button.d-icon-tiles',
        TileSearchInput: 'input.adapt-search-field',
        TileSearchResult: 'button.a-dropdown__link',
    }

    async isHambergerIconPresent(): Promise<boolean> {
        return await $(this.selectors.hamburgerIcon).isPresent();
    }

    async isCreateCaseDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            let createCase: boolean = await element(by.cssContainingText('button.a-hamburger__menu-link', /^Case $/)).isPresent();
            await $$(this.selectors.closeHambergerMenu).get(2).click();
            return createCase;
        } else {
            await element(by.cssContainingText(this.selectors.menu, /^Create$/)).click();
            return await element(by.cssContainingText(this.selectors.menu, /^Case$/)).isDisplayed();
        }
    }

    async isQuickCaseDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            let quickCase: boolean = await element(by.cssContainingText('button.a-hamburger__menu-link', 'Quick Case ')).isPresent();
            await $$(this.selectors.closeHambergerMenu).get(0).click();
            return quickCase;
        } else return await element(by.cssContainingText('button.a-menu__link', 'Quick Case ')).isPresent();
    }

    async isCreateKnowledgeDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            let createKnowledge: boolean = await element(by.cssContainingText('button.a-hamburger__menu-link', /^Knowledge $/)).isPresent();
            await $$(this.selectors.closeHambergerMenu).get(2).click();
            return createKnowledge;
        } else return await element(by.cssContainingText(this.selectors.menu, /^Knowledge$/)).isDisplayed();
    }

    async isCaseConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            let caseConsole: boolean = await element(by.cssContainingText('button.a-hamburger__menu-link', /^Case $/)).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return caseConsole;
        } else {
            await element(by.cssContainingText(this.selectors.menu, /^Workspace$/)).click();
            return await element(by.cssContainingText(this.selectors.menu, /^Case$/)).isDisplayed();
        }
    }

    async isKnowledgeConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            let knowledgeConsole: boolean = await element(by.cssContainingText('button.a-hamburger__menu-link', /^Knowledge $/)).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return knowledgeConsole;
        } else return await element(by.cssContainingText(this.selectors.menu, /^Knowledge$/)).isDisplayed();
    }

    async isTaskConsoleDisplayed(): Promise<boolean> {
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            let taskConsole: boolean = await element(by.cssContainingText('button.a-hamburger__menu-link', /^Task $/)).isDisplayed();
            await $$(this.selectors.closeHambergerMenu).get(1).click();
            return taskConsole;
        } else return await element(by.cssContainingText(this.selectors.menu, /^Task$/)).isDisplayed();
    }

    async gotoCaseConsole(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            await element(by.cssContainingText('.a-hamburger__menu-link', 'Case ')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else {
            await element(by.cssContainingText(this.selectors.menu, /^Workspace$/)).click();
            await element(by.cssContainingText(this.selectors.menu, /^Case$/)).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        }
        await browser.wait(this.EC.titleContains('Cases - Business Workflows'), 10000);
    }

    async gotoKnowledgeConsole(consoleFromKA?: boolean): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (consoleFromKA) {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await element(by.cssContainingText('.a-menu__link[type="button"]', 'Knowledge Console')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        }
        else {
            if (await this.isHambergerIconPresent()) {
                await $(this.selectors.hamburgerIcon).click();
                await element(by.linkText('Workspace')).click();
                await element(by.cssContainingText('.a-hamburger__menu-link', 'Knowledge ')).click().then(async () => {
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                });
            } else {
                await element(by.cssContainingText(this.selectors.menu, /^Workspace$/)).click();
                await element(by.cssContainingText(this.selectors.menu, /^Knowledge$/)).click().then(async () => {
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                });
            }
            await browser.wait(this.EC.titleContains('Knowledge Articles - Business Workflows'), 10000);
        }
    }

    async gotoTaskConsole(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Workspace')).click();
            await element(by.cssContainingText('.a-hamburger__menu-link', 'Task ')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else {
            await element(by.cssContainingText(this.selectors.menu, /^Workspace$/)).click();
            await element(by.cssContainingText(this.selectors.menu, /^Task$/)).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        }
        await browser.wait(this.EC.titleContains('Tasks - Business Workflows'), 10000);
    }

    async gotoCreateCase(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            await element(by.cssContainingText('.a-hamburger__content.submenu [id="submenu_3"] button', /^Case $/)).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else {
            await element(by.cssContainingText(this.selectors.menu, /^Create$/)).click();
            await element(by.cssContainingText(this.selectors.menu, /^Case$/)).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        }
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 10000);
    }

    async gotoQuickCase(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.buttonText('Quick Case')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else await element(by.cssContainingText('button.a-menu__link', 'Quick Case ')).click().then(async () => {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        await browser.wait(this.EC.titleContains('Case Create - Quick Case - Business Workflows'), 10000);
    }

    async gotoSearch(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.buttonText('Search')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else await element(by.cssContainingText('button.a-menu__link', 'Search')).click().then(async () => {
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        await browser.wait(this.EC.titleContains('Global Search View - Business Workflows'), 10000);
    }

    async gotoCreateKnowledge(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.linkText('Create')).click();
            await element(by.cssContainingText('.a-hamburger__content.submenu [id="submenu_3"] button', /^Knowledge $/)).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else {
            await element(by.cssContainingText(this.selectors.menu, /^Create$/)).click();
            await element(by.cssContainingText(this.selectors.menu, /^Knowledge$/)).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        }
        await browser.wait(this.EC.titleContains('Knowledge Article Templates Preview'), 10000);
    }

    async gotoPersonProfile(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            await element(by.buttonText('My Profile')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        } else {
            await $(this.selectors.profileMenu).click();
            await element(by.buttonText('My Profile')).click().then(async () => {
                await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            });
        }
        await browser.wait(this.EC.titleContains('Person Profile - Business Workflows'), 10000);
    }

    async gotoSettingsPage(): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await $(this.selectors.settingsButton).click();
        await $('button.d-icon-angle_right').click();// workaroud until Platform drop 6
        await $('button.d-icon-angle_right').click();// workaroud until Platform drop 6
    }

    async gotoSettingsMenuItem(pathStr: string, expectedTitle: string): Promise<string> {
        const menuItems: Array<string> = pathStr.split('--');
        let menuItemStr = '.a-tree__label.is-flip adapt-highlight';
        let ismenuItemSelected =  await $(menuItemStr).isPresent().then(async (result) => {
            if(result) return await $(menuItemStr).isDisplayed();
            else return false;
        });
        if (ismenuItemSelected) {
            let menuItemVal = await $(menuItemStr).getText();
            if (menuItems.includes(menuItemVal)) console.log("Menu Item already selected.");
        } else {
            for (let i = 0; i < menuItems.length; i++) {
                let submenuItemLocator = await $$('.a-tree__content');
                if (i < menuItems.length - 1) {
                    for(let j =0; j<submenuItemLocator.length; j++) {
                        if(await submenuItemLocator[j].$('adapt-highlight').getText() == menuItems[i])
                            await submenuItemLocator[j].$('span.a-tree__toggle').click();
                    }
                } else {
                    await element(by.cssContainingText('.a-tree__children adapt-highlight', menuItems[i])).click();
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
        returnedvalue.sort();
        listOfSubItems.sort();
        return returnedvalue.length === listOfSubItems.length && returnedvalue.every(
            (value, index) => (value === listOfSubItems[index])
        );
    }

    async isSettingMenuPresent(pathStr: string): Promise<boolean> {
        return await element(by.xpath(`//rx-administration-settings//*[text()="${pathStr}"]/../*[@class="tree-branch-head"]`)).isPresent();
    }

    async signOut(): Promise<void> {
        try {
            if (await this.isHambergerIconPresent()) {
                await $(this.selectors.hamburgerIcon).click();
                await element(by.buttonText('Sign Out')).click().then(async () => {
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                });
            } else {
                await $(this.selectors.profileMenu).click();
                await element(by.buttonText('Sign Out')).click().then(async () => {
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                });
            }
            let noAccess = this.EC.titleContains('No Access');
            let bwfLogin = this.EC.titleContains('Login - Business Workflows');
            await browser.wait(this.EC.or(noAccess, bwfLogin), 10000);
        } catch (ex) {
            console.log('Already Signout because --> ', ex);
        }
    }

    async switchToApplication(applicationName: string): Promise<void> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await $(this.selectors.adaptIconTiles).click();
        await $(this.selectors.TileSearchInput).clear();
        await $(this.selectors.TileSearchInput).click();
        await $(this.selectors.TileSearchInput).sendKeys(applicationName);
        await element(by.cssContainingText(this.selectors.TileSearchResult, applicationName)).click();
        await utilityCommon.switchToNewTab(1);
    }

    async isSettingPanelTextMatches(text: string): Promise<boolean> {
        let settingPaneltextLocator = await element(by.cssContainingText(this.selectors.panelHeadingOfSetting, text));
        return await $(this.selectors.panelHeadingOfSetting).isPresent().then(async (result) => {
            await browser.wait(this.EC.visibilityOf(settingPaneltextLocator), 6000);
            if (result) return await settingPaneltextLocator.isDisplayed();
            else return false;
        });
    }

    async isPersonProfileDisplayed(): Promise<boolean> {
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        if (await this.isHambergerIconPresent()) {
            await $(this.selectors.hamburgerIcon).click();
            return await element(by.buttonText('My Profile')).isPresent().then(async (result) => {
                if (result) return await element(by.buttonText('My Profile')).isDisplayed();
                else return false;
            })
        }
        else {
            await $(this.selectors.profileMenu).click();
            await element(by.buttonText('My Profile')).isPresent().then(async (result) => {
                if (result) return element(by.buttonText('My Profile')).isDisplayed();
                else return false;
            });
        }
    }
}

export default new NavigationPage();