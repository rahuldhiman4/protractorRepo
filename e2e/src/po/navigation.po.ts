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

    async gotCreateCase(): Promise<void> {
        await browser.wait(this.EC.visibilityOf(element(by.xpath(this.selectors.createMenu))), 60000);
        await element(by.xpath(this.selectors.createMenu)).click();
        await element(by.xpath(this.selectors.createCaseMenuItem)).click();
        await browser.wait(this.EC.titleContains('Case Create - Business Workflows'), 30000);
    }

    async gotoQuickCase(): Promise<void> {
        await element(by.xpath(this.selectors.createQuickCaseMenu)).click();
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
        await browser.actions().mouseMove($(this.selectors.profileMenu)).perform();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out'))));
        await element(by.cssContainingText(this.selectors.signOutMenuItem, 'Sign Out')).click();
        await browser.wait(this.EC.titleContains('Login - Business Workflows'));
    }
}

export default new NavigationPage();