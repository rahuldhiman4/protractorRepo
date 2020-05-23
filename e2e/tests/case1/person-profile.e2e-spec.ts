import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfile from "../../pageobject/common/person-profile.po";
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Person Profile test', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');
        await navigationPage.gotoPersonProfile();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //asahitya
    it('[DRDMV-14085]: Verify Profile picture of logged in user on My profile page', async () => {
        expect(await personProfile.isPersonProfileImageDisplayed()).toBeTruthy("Person Profile image is not displayed");
    });

    //asahitya
    it('[DRDMV-17018]: Check agent can not add notes to own Person profile in agent work history tab', async () => {
        expect(await personProfile.isActivityNotesDisplayed()).toBeFalsy("Activity Notes are available");
    });

    //asahitya
    it('[DRDMV-14086]: Verify Profile picture of Managar-Logged in user on My Profile page', async () => {
        expect(await personProfile.isPersonManagerImageDisplayed()).toBeTruthy("Person Manager image is not displayed");
    });

    //asahitya
    it('[DRDMV-14087]: Verify cases visible in Requested cases tab of My profile page are according to permissions of logged in user', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['DRDMV-14087']);
        let caseDisplayId = response.displayId;
        await personProfile.clickOnTab("Requested Cases");
        expect(await personProfile.isCasePresentOnRequestedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });

    //asahitya
    it('[DRDMV-14088]: Verify cases visible in Assiged cases tab of My profile page are according to permissions of logged in user', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['DRDMV-14088']);
        let caseDisplayId = response.displayId;
        await personProfile.clickOnTab("Assigned Cases");
        expect(await personProfile.isCasePresentOnAssignedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });

    //asahitya
    it('[DRDMV-14023]: Verify My Profile Console', async () => {
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("+19255553456", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("elizabeth@bwflabs.localdomain", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Rochester\n70 Linden Oaks, Rochester, New York, 14625, United States ", "Site mismatch");
        expect(await personProfile.getManagerName()).toBe("Hannah Haas", "Manager name mismatch");
        await personProfile.clickOnTab("Requested Cases");
        await personProfile.clickOnTab("Assigned Cases");
        await personProfile.clickOnTab("Support Groups");
        await personProfile.clickOnTab("Related Cases");
        await personProfile.clickOnTab("Related Persons");
    });

    //asahitya
    it('[DRDMV-14025]: Verify navigation to Managers Profile from My Profile->Assigned Manager', async () => {
        await personProfile.clickOnManagerLink();
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toBe("+12135559393", "Phone number mismatch");
            expect(await personProfile.getEmail()).toBe("hannah.haas@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Aichi\n4-6-23 Meieki, Nakamura-ku, Nagoya-shi, Nagoya-shi, Aichi, 450-0002, Japan ");
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");
        }
        catch (ex) { throw ex; }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //asahitya
    it('[DRDMV-17020]: Check agent can view the notes of other agents Person profile in agent work history tab for which he is submitter of the note', async () => {
        await personProfile.clickOnManagerLink();
        try {
            await utilityCommon.switchToNewTab(1);
            await activityTabPage.addActivityNote("DRDMV-17020");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInActivityLog("DRDMV-17020")).toBeTruthy("Activity notes is missing");
        }
        catch (ex) { throw ex; }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //asahitya
    it('[DRDMV-17019]: Check agent cannot view notes to own Person profile in agent work history tab', async () => {
        await navigationPage.gotoPersonProfile();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qiang Du', 'Former Manager');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        await relatedTabPage.clickRelatedPersonName('Qiang Du');
        await utilityCommon.switchToNewTab(1);
        await activityTabPage.addActivityNote("DRDMV-17019");
        await activityTabPage.clickOnPostButton();
        try {
            await navigationPage.signOut();
            await loginPage.login("qdu");
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("DRDMV-17019")).toBeFalsy("Notes are avaialble on Hannah's Profile");
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        }
    });//, 190 * 1000);

    //asahitya
    it('[DRDMV-14028]: Verify Requested Cases tab of My Profile console', async () => {
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnTab("Requested Cases");
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        for (let i: number = 0; i < 4; i++) {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            caseData['DRDMV-14087'].summary = "DRDMV-14028 " + randomStr;
            await apiHelper.createCase(caseData['DRDMV-14087']);
        }

        //Verifying default column matching
        let defaultRequestedCaseColumns: string[] = ["Case ID", "Priority", "Status", "Summary", "Created Date", "Support Group", "Assignee"];
        expect(await personProfile.areRequestedCaseColumnMatches(defaultRequestedCaseColumns)).toBeTruthy("Default Requested columns are not matching");

        //Verifying all columns
        let allRequestedCaseColumns: string[] = ["Assigned Business Unit", "Assigned Company", "Assigned Department", "Assignee ID", "Assignee Login Name", "Flowset", "ID", "Label", "Modified Date", "Region", "Site", "Source", "Status Value"];
        await personProfile.addRequestedCaseGridColumn(allRequestedCaseColumns);
        let expectedAllColumns: string[] = ["Assigned Business Unit", "Assigned Company", "Assigned Department", "Assignee ID", "Assignee Login Name", "Flowset", "ID", "Label", "Modified Date", "Region", "Site", "Source", "Status Value", "Case ID", "Priority", "Status", "Summary", "Created Date", "Support Group", "Assignee"];
        expect(await personProfile.areRequestedCaseColumnMatches(expectedAllColumns)).toBeTruthy("All Requested columns are not matching");
        await personProfile.removeRequestedCaseGridColumn(allRequestedCaseColumns);

        //Verify sorting
        expect(await personProfile.isRequestedCasesColumnsSortedAscending("Case ID")).toBeTruthy("Columns are not sorted");
    });//, 150 * 1000);

    //asahitya
    it('[DRDMV-14029]: Verify Assigned Cases tab of My Profile console', async () => {
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnTab("Assigned Cases");
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        for (let i: number = 0; i < 4; i++) {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            caseData['DRDMV-14088'].summary = "DRDMV-14029 " + randomStr;
            await apiHelper.createCase(caseData['DRDMV-14088']);
        }

        //Verifying default column matching
        let defaultAssignedCaseColumns: string[] = ["Case ID", "Priority", "Status", "Summary", "Requester", "Modified Date"];
        expect(await personProfile.areAssignedCaseColumnMatches(defaultAssignedCaseColumns)).toBeTruthy("Default Assigned columns are not matching");

        //Verifying all columns
        let allAssignedCaseColumns: string[] = ["Assignee Login Name", "Company", "ID", "Label", "Region", "Request ID", "Site", "Source", "Status Value", "Support Group"];
        await personProfile.addAssignedCaseGridColumn(allAssignedCaseColumns);
        let expectedAllColumns: string[] = ["Assignee Login Name", "Company", "ID", "Label", "Region", "Request ID", "Site", "Source", "Status Value", "Support Group", "Case ID", "Priority", "Status", "Summary", "Requester", "Modified Date"];
        expect(await personProfile.areAssignedCaseColumnMatches(expectedAllColumns)).toBeTruthy("All Assigned columns are not matching");
        await personProfile.removeAssignedCaseGridColumn(allAssignedCaseColumns);

        //Verify sorting
        expect(await personProfile.isAssignedCasesColumnsSortedAscending("Case ID")).toBeTruthy("Columns are not sorted");
    });//, 160 * 1000);
})