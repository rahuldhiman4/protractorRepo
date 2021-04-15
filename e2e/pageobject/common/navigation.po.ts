import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';
import editCasetemplatePo from '../settings/case-management/edit-casetemplate.po';
import createTasktemplatePo from '../settings/task-management/create-tasktemplate.po';
import editTasktemplatePo from '../settings/task-management/edit-tasktemplate.po';

class NavigationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        menu: '.a-menu__text',
        settingsButton: 'adapt-nav-action-item .d-icon-gear',
        profileMenu: 'rx-shell adapt-profile button',
        helpIcon: '//*[@class="d-n-menu__link d-icon-left-question_circle"]',
        knowledgeConsoleTitle: '[rx-view-component-id="11f37569-5ecd-4239-aaa7-075d1874b1d1"] span',
        hamburgerIcon: '.a-hamburger',
        hamburgerHelpIcon: '[class="d-n-hamburger__nav-link d-icon-left-question_circle"]',
        closeHambergerMenu: 'button.close.close-inverse',
        panelHeadingOfSetting: '.a-tree__no-matches',
        adaptIconTiles: 'button.d-icon-tiles',
        TileSearchInput: 'div.input-group-sm .adapt-rx-search__expandable-block input',
        TileSearchResult: 'button.a-dropdown__link',
    }

    async isHambergerIconPresent(): Promise<boolean> {
        return await $(this.selectors.hamburgerIcon).isPresent();
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
        await utilityCommon.closePopUpMessage(); // workaround for defect DRDMV-25253
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
    }

    async gotoSettingsMenuItem(pathStr: string, expectedTitle: string): Promise<string> {
        const menuItems: Array<string> = pathStr.split('--');
        if (await $(".is-flip").isPresent()) {
            await $(".adapt-rx-search__input").sendKeys("collapse");
            await $(".d-icon-cross_adapt").click();
        }
        for (let i = 0; i < menuItems.length; i++) {
            let submenuItemLocator = await $$('.a-tree__content');
            if (i < menuItems.length - 1) {
                for (let j = 0; j < submenuItemLocator.length; j++) {
                    if (await $$('.a-tree__content').get(j).$('adapt-highlight').getText() == menuItems[i])
                    await $$('.a-tree__content').get(j).$('span.a-tree__toggle').click();
                }
            } else {
                let regex = new RegExp("^" + menuItems[i] + "$");
                await element(by.cssContainingText('.a-tree__children adapt-highlight', regex)).click();
            }
        }
        await browser.wait(this.EC.titleContains(expectedTitle), 10000);
        return await browser.getTitle();
    }

    async isSettingSubMenusMatches(pathStr: string, listOfSubItems: string[]): Promise<boolean> {
        await element(by.xpath(`//rx-admin-settings-explorer//*[text()="${pathStr}"]/../../../*[@role="img"]`)).click();
        let loc: string = `//*[text()="${pathStr}"]/ancestor::li[@role="listitem"]//adapt-highlight`;
        let list: string[] = [];
        let subitemCounts: number = await element.all(by.xpath(loc)).count();
        let baseCounts: number = 1;
        for (baseCounts; baseCounts <= subitemCounts; baseCounts++) {
            list[baseCounts] = await element(by.xpath(`(//*[text()="${pathStr}"]/ancestor::li[@role="listitem"]//adapt-highlight)` + "[" + baseCounts + "]")).getText();
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
        let title = await browser.getTitle();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs(); // workaround: switchToApplication opens in new tab
        if (title == 'Templates - Settings - Business Workflows') { // workaround: close template screens

            await $(editCasetemplatePo.selectors.cancelButton).isPresent().then(async (cancelBtn) => {
                if (cancelBtn) {
                    await $(editCasetemplatePo.selectors.cancelButton).click();
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                }
            });

            await $(editTasktemplatePo.selectors.cancelButton).isPresent().then(async (cancelBtn) => {
                if (cancelBtn) {
                    await $(editTasktemplatePo.selectors.cancelButton).click();
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                }
            });

            await $('.d-icon-left-undo').isPresent().then(async (backButton) => {
                if (backButton) return await $('.d-icon-left-undo').click();
            });

            await $(createTasktemplatePo.selectors.cancelButton).isPresent().then(async (cancelBtn) => {
                if (cancelBtn) {
                    await $(createTasktemplatePo.selectors.cancelButton).click();
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                }
            });
        }

        try {
            if (await this.isHambergerIconPresent()) {
                await $(this.selectors.hamburgerIcon).click();
                await element(by.buttonText('Sign out')).click().then(async () => {
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                });
            } else {
                await $(this.selectors.profileMenu).click();
                await element(by.buttonText('Sign out')).click().then(async () => {
                    await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
                });
            }
            let noAccess = this.EC.titleContains('No Access');
            let bwfLogin = this.EC.titleContains('Login - Business Workflows');
            await browser.wait(this.EC.or(noAccess, bwfLogin), 10000);
            console.log(' === Signout Successful === ');
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
        await utilityCommon.closePopUpMessage(); // workaround for defect DRDMV-25253
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
            });
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
