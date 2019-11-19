import { element, by, ProtractorExpectedConditions, protractor, browser, $ } from "protractor"

class NavigationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createMenu: '//rx-shell//*[text()="Create"]/..',
        createCaseMenuItem: '//rx-shell//*[text()="Create"]/../..//a[contains(text(),"Case")]',
        createQuickCaseMenu: '//rx-shell//*[text()="Quick Case"]/..',
        settingsButton: 'rx-shell .d-n-action__settings',
        settingsMenuItemContainer: 'rx-administration-settings',
        profileMenu: '.d-n-nav__profile',
        signOutMenuItem: '.d-n-nav__profile a'
    }

    verticalSelectors = {
        hamburgerIcon: '.d-n-hamburger.rx-shell__button-container',
        createCaseMenuItem: '//*[@title="Create"]/parent::*//*[@title="Case"]',
        createQuickCaseMenu: '[title="Quick Case"]',
    }

    async gotCreateCase(): Promise<void> {
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if(hamburgerStatus=='true'){
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.selectors.createMenu))), 60000);
            await element(by.xpath(this.selectors.createMenu)).click();
            await element(by.xpath(this.selectors.createCaseMenuItem)).click();            
        } else {
            await $(this.verticalSelectors.hamburgerIcon).$('button').click();
            await browser.wait(this.EC.elementToBeClickable(element(by.xpath(this.verticalSelectors.createCaseMenuItem))), 60000);
            await element(by.xpath(this.verticalSelectors.createCaseMenuItem)).click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 30000);
    }

    async gotoQuickCase(): Promise<void> {
        await browser.wait(this.EC.presenceOf($(this.verticalSelectors.hamburgerIcon)), 60000);
        let hamburgerStatus = await $(this.verticalSelectors.hamburgerIcon).getAttribute('aria-hidden');
        if(hamburgerStatus=='true'){
            await element(by.xpath(this.selectors.createQuickCaseMenu)).click();
        } else {
            await browser.wait(this.EC.elementToBeClickable($(this.verticalSelectors.createQuickCaseMenu)), 60000);
            await $(this.verticalSelectors.createQuickCaseMenu).click();
        }
        await browser.wait(this.EC.titleContains('Case Create - Quick Case - Business Workflows'), 30000);
    }

    async gotoSettingsPage(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsButton)));
        await $(this.selectors.settingsButton).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.settingsMenuItemContainer)));
    }

    async gotoSettingsMenuItem(pathStr: string, expectedTitle: string): Promise<string> {
        const menuItems: Array<string> = pathStr.split('--');
        for (let i = 0; i < menuItems.length; i++) {
            var menuXpath:string = `//rx-administration-settings//*[text()="${menuItems[i]}"]`;
            if (i < menuItems.length - 1) {
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(`${menuXpath}/../*[@class="tree-branch-head"]`))));
                await element(by.xpath(`${menuXpath}/../*[@class="tree-branch-head"]`)).click();
            } else {
                await browser.wait(this.EC.elementToBeClickable(element(by.xpath(menuXpath))));
                await element(by.xpath(menuXpath)).click();
            }
        }
        await browser.wait(this.EC.titleContains(expectedTitle));
        return await browser.getTitle();
    }

    async signOut(): Promise<void> {
        await browser.actions().mouseMove($(this.selectors.profileMenu)).perform();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out'))));
        await element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out')).click();
        await browser.wait(this.EC.titleContains('Login - Business Workflows'));
    }
}

export default new NavigationPage();