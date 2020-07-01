import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfile from "../../pageobject/common/person-profile.po";
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import relationshipsConfigsPage from '../../pageobject/settings/relationship/relationships-configs.po';
import { default as activityTabPage, default as caseActivityPage } from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Person Profile test', () => {
    beforeAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updatePersonAsVIP('Elizabeth', 'Yes');
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');
        await navigationPage.gotoPersonProfile();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
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
    it('[DRDMV-14023,DRDMV-16812]: Verify My Profile Console', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoPersonProfile();
        expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
        expect(await personProfile.getJobTitle()).toBe('HR Business Analyst', 'Job tite does not match');
        expect(await personProfile.getCorporateID()).toBe('200003', 'Corporate Id does not match');
        expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
        expect(await personProfile.getLoginID()).toBe('Elizabeth', 'Login Id does not match');
        expect(await personProfile.getFunctionalRoles()).toContain('FoundationRead, Knowledge Coach, Knowledge Publisher, Knowledge Contributor, Knowledge Candidate, Case Business Analyst, Case Catalog Administrator');
        expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("+19255553456", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("elizabeth@bwflabs.localdomain", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Rochester\n70 Linden Oaks, Rochester, New York, 14625, United States ", "Site mismatch");
        await personProfile.clickOnTab("Requested Cases");
        await personProfile.clickOnTab("Assigned Cases");
        await personProfile.clickOnTab("Support Groups");
        await personProfile.clickOnTab("Related Cases");
        await personProfile.clickOnTab("Related Persons");

        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Hannah Haas', 'Manager')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Former Manager');
        await relatedTabPage.clickRelatedPersonName('Qianru Tao');
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Elizabeth Peters', 'Former Reportee')).toBeTruthy();
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        await relatedTabPage.removeRelatedPerson('Qianru Tao');
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Elizabeth Peters')).toBeFalsy();
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    });

    //asahitya
    it('[DRDMV-16803]: Person profile display for case assignee', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updatePersonAsVIP('Fritz', 'Yes');
        await apiHelper.apiLogin('elizabeth');

        let caseData = {
            "Requester": "araisin",
            "Summary": "Test case for DRDMV-16803",
            "Assigned Company": "Petramco",
            "Business Unit": "Facilities Support",
            "Support Group": "Facilities",
            "Assignee": "Fritz"
        }

        let response = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(response.displayId);
        await viewCasePage.clickAssigneeLink();
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('Facilities Business Analyst', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('600000', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('Fritz', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('FoundationRead, Case Business Analyst');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("+498955548018", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("fritz.schulz@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Frankfurt\nLyoner Strasse 9\nAstro Park, Frankfurt Am Main, Hesse, 60528, Germany ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Frieda Hoffmann", "Manager name mismatch");
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Former Manager');
            await relatedTabPage.clickRelatedPersonName('Qianru Tao');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Fritz Schulz', 'Former Reportee')).toBeTruthy();

            await utilityCommon.switchToNewTab(1);
            await relatedTabPage.removeRelatedPerson('Qianru Tao');
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Fritz Schulz')).toBeFalsy('Fritz is available in Related tab');
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    });

    //asahitya
    it('[DRDMV-16806]: Person profile display for person from activity/history tab', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updatePersonAsVIP('Harry', 'Yes');
        await apiHelper.apiLogin('elizabeth');

        let caseData = {
            "Requester": "Harry",
            "Summary": "Test case for DRDMV-16803",
            "Assigned Company": "Petramco",
            "Business Unit": "Facilities Support",
            "Support Group": "Facilities",
            "Assignee": "Fritz"
        }

        let response = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(response.displayId);
        await caseActivityPage.addPersonInActivityNote('Harry Potter');
        await caseActivityPage.clickOnPostButton();
        await activityTabPage.clickOnHyperlinkFromActivity(1, 'Harry Potter');

        expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
        expect(await personProfile.getJobTitle()).toBe('CE1', 'Job tite does not match');
        expect(await personProfile.getCorporateID()).toBe('PET00000246', 'Corporate Id does not match');
        expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
        expect(await personProfile.getLoginID()).toBe('Harry', 'Login Id does not match');
        expect(await personProfile.getFunctionalRoles()).toContain('FoundationRead');
        expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toContain("+14502224444", "Phone number mismatch");
        expect(await personProfile.getEmail()).toContain("harry@petramco.com", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Petramco Site1\n1030 W. Maude Ave., Sunnyvale, California, 94085, United States ", "Site mismatch");
        expect(await personProfile.getManagerName()).toBe("Yoga Ananda", "Manager name mismatch");
        await personProfile.clickOnTab("Requested Cases");
        await personProfile.clickOnTab("Assigned Cases");
        await personProfile.clickOnTab("Support Groups");
        await personProfile.clickOnTab("Related Cases");
        await personProfile.clickOnTab("Related Persons");
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Former Manager');
        await relatedTabPage.clickRelatedPersonName('Qianru Tao');
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Former Reportee')).toBeTruthy('Relationship does not match');
            await utilityCommon.switchToNewTab(0);
            await relatedTabPage.removeRelatedPerson('Qianru Tao');
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Harry Potter')).toBeFalsy('Fritz is available in Related tab');
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    });

    //asahitya
    describe('[DRDMV-16802]: Person profile display for Contact', () => {
        afterEach(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[DRDMV-16802]: Person profile display for non Agent Contact', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updatePersonAsVIP('apavlik', 'Yes');
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-16803",
                "Contact": "apavlik",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }

            //Create the case with contact as Adam Pavlik
            let response = await apiHelper.createCase(caseData);

            //Verify the Person Profile of Adam Pavlik
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await viewCasePage.clickContactPersonName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('CE3', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000239', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('apavlik', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('FoundationRead');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("+19254694006", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("apavlik@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Pleasanton\n6200 Stoneridge Mall Road, Suite 200, Pleasanton, California, 94588, United States ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Arcturus Mengsk", "Manager name mismatch");
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");

            //Add Related Person qtao and verify the relationship is added
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Former Manager');
            await relatedTabPage.clickRelatedPersonName('Qianru Tao');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Adam Pavlik', 'Former Reportee')).toBeTruthy('Relation does not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            //Modify the Person to Person relationship
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', 'Person To Person Relationship console - Business Workflows');
            await relationshipsConfigsPage.setRelationshipName('Former Manager', 'Former Manager updated');
            await relationshipsConfigsPage.saveConfig();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            //Verify that updated relation name does not impact existing relations
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await viewCasePage.clickContactPersonName();
            await utilityCommon.switchToNewTab(1);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Former Manager')).toBeTruthy('Relation does not match'); //Defect

            //Remove the relation and verify that Relation is actually removed
            await relatedTabPage.clickRelatedPersonName('Qianru Tao');
            await utilityCommon.switchToNewTab(2);
            await relatedTabPage.removeRelatedPerson('Adam Pavlik');
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Adam Pavlik')).toBeFalsy('Adam Pavlik is available in Related tab');
        });

        it('[DRDMV-16802]: Person profile display for Contact', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updatePersonAsVIP('qfeng', 'Yes');
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-16803",
                "Contact": "qfeng",
                "Assigned Company": "Petramco",
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz"
            }

            let response = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await viewCasePage.clickContactPersonName();

            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('RA3', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000521', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('qfeng', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('FoundationRead, Case Agent');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("+15123431920", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("qfeng@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Qiang Du", "Manager name mismatch");
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Peter Kahn', 'Former Manager Updated');
            await relatedTabPage.clickRelatedPersonName('Peter Kahn');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiao Feng', 'Former Reportee')).toBeTruthy('Relation is not matching');
            await utilityCommon.switchToNewTab(1);
            await relatedTabPage.removeRelatedPerson('Peter Kahn');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Qiao Feng')).toBeFalsy('Qiao Feng is available in Related tab');

        });
    });

    //asahitya
    it('[DRDMV-14025]: Verify navigation to Managers Profile from My Profile->Assigned Manager', async () => {
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnManagerLink();
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
    });

    //asahitya
    it('[DRDMV-17020]: Check agent can view the notes of other agents Person profile in agent work history tab for which he is submitter of the note', async () => {
        try {
            await activityTabPage.addActivityNote("DRDMV-17020");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote("DRDMV-17020")).toBeTruthy("Activity notes is missing");
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
});
