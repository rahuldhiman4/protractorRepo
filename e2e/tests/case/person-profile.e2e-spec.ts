import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfile from "../../pageobject/common/person-profile.po";
import utilCommon from '../../utils/util.common';
import activityTabPage from '../../pageobject/social/activity-tab.po';

describe('Person Profile test', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('elizabeth');
        await navigationPage.goToPersonProfile();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('DRDMV-14085: Verify Profile picture of logged in user on My profile page', async () => {
        expect(await personProfile.isPersonProfileImageDisplayed()).toBeTruthy("Person Profile image is not displayed");
    });

    it('DRDMV-14086: Verify Profile picture of Managar-Logged in user on My Profile page', async () => {
        expect(await personProfile.isPersonManagerImageDisplayed()).toBeTruthy("Person Manager image is not displayed");
    });

    it('DRDMV-17018: Check agent can not add notes to own Person profile in agent work history tab', async () => {
        expect(await personProfile.isActivityNotesDisplayed()).toBeFalsy("Activity Notes are available");
    });

    it('DRDMV-14087: Verify cases visible in Requested cases tab of My profile page are according to permissions of logged in user', async () => {
        await personProfile.navigateToTab("Requested Cases");
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['DRDMV-14087']);
        let caseDisplayId = response.displayId;
        expect(await personProfile.isCasePresentOnRequestedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });

    it('DRDMV-14088: Verify cases visible in Assiged cases tab of My profile page are according to permissions of logged in user', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['DRDMV-14088']);
        let caseDisplayId = response.displayId;
        await personProfile.navigateToTab("Assigned Cases");
        expect(await personProfile.isCasePresentOnAssignedCases(caseDisplayId)).toBeTruthy("Case is not present");
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

    it('DRDMV-17020: Check agent can view the notes of other agents Person profile in agent work history tab for which he is submitter of the note', async () => {
        await activityTabPage.addActivityNote("DRDMV-17020");
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isTextPresentInActivityLog("DRDMV-17020")).toBeTruthy("Activity notes is missing");
    });

    it('DRDMV-17019: Check agent cannot view notes to own Person profile in agent work history tab', async () => {
        await activityTabPage.addActivityNote("DRDMV-17019");
        await activityTabPage.clickOnPostButton();
        try {
            await navigationPage.signOut();
            await loginPage.login("hannah");
            await navigationPage.goToPersonProfile();
            expect(await activityTabPage.isTextPresentInActivityLog("DRDMV-17019")).toBeFalsy("Notes are avaialble on Hannah's Profile");
        }
        catch (e) {
            console.log(e);
            expect(false).toBeTruthy();
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        }
    });

})