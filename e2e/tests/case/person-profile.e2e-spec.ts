import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import navigationPage from "../../pageobject/navigation.po";
import personProfile from "../../pageobject/case/person-profile.po";

describe('Person Profile test', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('elizabeth');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-14085: Verify Profile picture of logged in user on My profile page', async () => {
        await navigationPage.goToPersonProfile();
        expect(await personProfile.isPersonProfileImageDisplayed()).toBeTruthy("Person Profile image is not displayed");
    });

    it('DRDMV-14086: Verify Profile picture of Managar-Logged in user on My Profile page', async () => {
        expect(await personProfile.isPersonManagerImageDisplayed()).toBeTruthy("Person Manager image is not displayed");
    });

    it('DRDMV-17018: Check agent can not add notes to own Person profile in agent work history tab', async () => {
        expect(await personProfile.isActivityNotesDisplayed()).toBeFalsy("Activity Notes are available");
    });

    it('DRDMV-14023: Verify My Profile Console', async () => {
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("+19255553456", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("elizabeth.peters@petramco.com", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Rochester\n70 Linden Oaks, Rochester, New York, 14625, United States", "Site mismatch");
        expect(await personProfile.getManagerName()).toBe("Hannah Haas", "Manager name mismatch");
        await personProfile.navigateToTab("Requested Cases");
        await personProfile.navigateToTab("Assigned Cases");
        await personProfile.navigateToTab("Support Groups");
        await personProfile.navigateToTab("Related Cases");
        await personProfile.navigateToTab("Related Persons");
    });

    it('DRDMV-14025: Verify navigation to Managers Profile from My Profile->Assigned Manager', async () => {
        await personProfile.clickOnManagerLink();
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("+12135559393", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("hannah.haas@petramco.com", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Aichi\n4-6-23 Meieki, Nakamura-ku, Nagoya-shi, Nagoya-shi, Aichi, 450-0002, Japan");
        await personProfile.navigateToTab("Requested Cases");
        await personProfile.navigateToTab("Assigned Cases");
        await personProfile.navigateToTab("Support Groups");
        await personProfile.navigateToTab("Related Cases");
        await personProfile.navigateToTab("Related Persons");
    });

})