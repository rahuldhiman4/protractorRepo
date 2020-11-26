import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfile from "../../pageobject/common/person-profile.po";
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import relationshipsConfigsPage from '../../pageobject/settings/relationship/relationships-configs.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Person Profile test', () => {
    beforeAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updateFoundationEntity('Person', 'Elizabeth', { vipStatus: 'Yes' });
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');
        await navigationPage.gotoPersonProfile();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
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
    it('[DRDMV-14023,DRDMV-16812,DRDMV-14085]: Verify My Profile Console', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoPersonProfile();
        expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
        expect(await personProfile.getJobTitle()).toBe('HR Business Analyst', 'Job tite does not match');
        expect(await personProfile.getCorporateID()).toBe('200003', 'Corporate Id does not match');
        expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
        expect(await personProfile.getLoginID()).toBe('Elizabeth', 'Login Id does not match');
        expect(await personProfile.getFunctionalRoles()).toContain('Knowledge Coach, Case Business Analyst, Case Catalog Administrator, Human Resource');
        expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("+19255553456", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("elizabeth@bwflabs.localdomain", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Rochester\n70 Linden Oaks, Rochester, New York, 14625, United States ", "Site mismatch");
        expect(await personProfile.isPersonProfileImageDisplayed()).toBeTruthy("Person Profile image is not displayed");
        await personProfile.clickOnTab("Requested Cases");
        await personProfile.clickOnTab("Assigned Cases");
        await personProfile.clickOnTab("Support Groups");
        await personProfile.clickOnTab("Related Cases");
        await personProfile.clickOnTab("Related Persons");

        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Hannah Haas', 'Manager')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Guardian');
        await relatedTabPage.clickRelatedPersonName('Qianru Tao');
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Elizabeth Peters', 'Student')).toBeTruthy();
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
        await apiHelper.updateFoundationEntity('Person', 'qfeng', { vipStatus: 'Yes' });
        await apiHelper.apiLogin('elizabeth');

        let caseData = {
            "Requester": "araisin",
            "Summary": "Test case for DRDMV-16803",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qfeng"
        }

        let response = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(response.displayId);
        await viewCasePage.clickAssigneeLink();
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('RA3', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000521', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('qfeng', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('Case Agent, Human Resource');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("+15123431920", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("qfeng@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toContain("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Qiang Du", "Manager name mismatch");
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qing Yuan', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Qing Yuan');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiang Du', 'Manager')).toBeTruthy();

            await utilityCommon.switchToNewTab(1);
            await relatedTabPage.removeRelatedPerson('Qing Yuan');
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        try {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Qiao Feng')).toBeFalsy('Qiao Feng is available in Related tab');
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
        await apiHelper.updateFoundationEntity('Person', 'qfeng', { vipStatus: 'Yes' });
        await apiHelper.apiLogin('elizabeth');

        let caseData = {
            "Requester": "qyuan",
            "Summary": "Test case for DRDMV-16803",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qkatawazi"
        }

        let response = await apiHelper.createCase(caseData);
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(response.displayId);
        await activityTabPage.addPersonInActivityNote('Qiao Feng');
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qiao Feng');

        expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
        expect(await personProfile.getJobTitle()).toBe('RA3', 'Job tite does not match');
        expect(await personProfile.getCorporateID()).toBe('PET00000521', 'Corporate Id does not match');
        expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
        expect(await personProfile.getLoginID()).toBe('qfeng', 'Login Id does not match');
        expect(await personProfile.getFunctionalRoles()).toContain('Case Agent, Human Resource');
        expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toContain('+15123431920', "Phone number mismatch");
        expect(await personProfile.getEmail()).toContain('qfeng@petramco.com', "Email mismatch");
        expect(await personProfile.getSite()).toContain("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ", "Site mismatch");
        expect(await personProfile.getManagerName()).toBe("Qiang Du", "Manager name mismatch");
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
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiao Feng', 'Manager')).toBeTruthy('Relationship does not match');
            await utilityCommon.switchToNewTab(0);
            await relatedTabPage.removeRelatedPerson('Qianru Tao');
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiao Feng', 'Former Reportee')).toBeFalsy('Relationship does not match');
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    });

    //asahitya
    describe('[DRDMV-16802]: Person profile display for Contact', () => {
        let response = undefined;
        afterEach(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[DRDMV-16802]: Person profile display for non Agent Contact', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'apavlik', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-16803",
                "Contact": "apavlik",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            //Create the case with contact as Adam Pavlik
            response = await apiHelper.createCase(caseData);

            // Verify the Person Profile of Adam Pavlik
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
        });

        it('[DRDMV-16802]: Person profile display for non Agent Contact', async () => {
            //Modify the Person to Person relationship
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', 'Person To Person Relationship console - Business Workflows');
            await relationshipsConfigsPage.setRelationshipName('Former Manager', 'relation updated');
            await relationshipsConfigsPage.saveConfig();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            //Verify that updated relation name does not impact existing relations
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await viewCasePage.clickContactPersonName();
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000); //Hard wait to load new page
            //expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Former Manager')).toBeTruthy('Relation does not match'); //Its a wont fix defect DRDMV-22546. Updated the same in test case Jira

            //Remove the relation and verify that Relation is actually removed
            await relatedTabPage.clickRelatedPersonName('Qianru Tao');
            await utilityCommon.switchToNewTab(2);
            await browser.sleep(3000); //Hard wait to load new page
            await relatedTabPage.removeRelatedPerson('Adam Pavlik');
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Adam Pavlik')).toBeFalsy('Adam Pavlik is available in Related tab');
        });

        it('[DRDMV-16802]: Person profile display for Contact', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qfeng', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-16803",
                "Contact": "qfeng",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
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
            expect(await personProfile.getFunctionalRoles()).toContain('Case Agent, Human Resource');
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
            await addRelatedPopupPage.addPerson('Peter Kahn', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Peter Kahn');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiao Feng', 'Child')).toBeTruthy('Relation is not matching');
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
    it('[DRDMV-17019]: Check agent can view notes to own Person profile in agent work history tab', async () => {
        await navigationPage.gotoPersonProfile();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qiang Du', 'Parent');
        await relatedTabPage.clickRelatedPersonName('Qiang Du');
        await utilityCommon.switchToNewTab(1);
        await activityTabPage.addActivityNote("DRDMV-17019");
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnRefreshButton();
        expect(await activityTabPage.isTextPresentInNote("DRDMV-17019")).toBeTruthy("Elizabeth cannot see post on qdu's activity");
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        await activityTabPage.clickOnRefreshButton();
        expect(await activityTabPage.isTextPresentInNote("DRDMV-17019")).toBeTruthy("Elizabeth cannot see post on his own activity");
        try {
            await navigationPage.signOut();
            await loginPage.login("qdu");
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("DRDMV-17019")).toBeTruthy("Qiang Du cannot see post on his own activity");

            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("DRDMV-17019")).toBeFalsy("Qadim can see post on his own activity");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qiang Du', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Qiang Du');
            await utilityCommon.switchToNewTab(1);
            expect(await activityTabPage.isTextPresentInNote("DRDMV-17019")).toBeFalsy("Qadim can see post on qdu's activity");
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

    describe('[DRDMV-17021]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', () => {
        it('[DRDMV-17021]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qheroux', { functionalRole: 'Person Activity Read' });
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000); //Wait for new tab to load properly
        });

        it('[DRDMV-17021]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await activityTabPage.addActivityNote("DRDMV-17021");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isInfoTooltipIconDisplayed()).toBeTruthy('Tooltip icon is not displayed');
            expect(await activityTabPage.getInfoTooltipMessage()).toBe('The notes related to a person are private and accessible ONLY to the note submitter and person with “Person Activity Read” role');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-17021')).toBeTruthy('DRDMV-17021 log activity is not present on elizabeth activity');
            expect(await activityTabPage.isTextPresentInActivityLog('Quin Strong')).toBeTruthy('Quin Strong is not present on elizabeth activity');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeTruthy('Elizabeth Peters is not present on elizabeth activity');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeTruthy('added a note for is not present on elizabeth activity');
        });

        it('[DRDMV-17021]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            await utilityCommon.switchToNewTab(1);
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-17021')).toBeTruthy('DRDMV-17021 log activity is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('Quin Strong')).toBeTruthy('Quin Strong is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeTruthy('Elizabeth Peters is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeTruthy('added a note for is not visible to qheroux');
            await navigationPage.signOut();
        });

        it('[DRDMV-17021]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await loginPage.login('franz');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            expect(await activityTabPage.isTextPresentInActivityLog('DRDMV-17021')).toBeFalsy('DRDMV-17021 log activity is present');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeFalsy('Elizabeth Peters is present in activity');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeFalsy('added a note for is present in activity');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-14186]: Verify My Profile icon with different business roles', () => {
        let userData = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData1",
            "company": "Petramco",
            "userPermission": ["Case Business Analyst","Human Resource"]
        }
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createNewUser(userData);
        });

        it('[DRDMV-14186]: Verify My Profile icon with different business roles', async () => {
            //Check the Person Profile Menu of Case Agent
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();

            //Check the Person Profile Menu of Case Business Analyst
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoPersonProfile();
        });

        it('[DRDMV-14186]: Verify My Profile icon with different business roles', async () => {
            //Check the Person Profile Menu of Knowledge Coach
            await navigationPage.signOut();
            await loginPage.login('kWilliamson');
            expect(await navigationPage.isPersonProfileDisplayed()).toBeFalsy('Person Profile is displayed');
            await utilityCommon.closeAllBlades();

            //Check the Person Profile Menu of New User
            await navigationPage.signOut();
            await loginPage.login(userData.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoPersonProfile();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[DRDMV-16815]: Configuration - person-to-person relationship', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-16815]: Configuration - person-to-person relationship', async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', 'Person To Person Relationship console - Business Workflows');

            //Check all out of box relations are present
            expect(await relationshipsConfigsPage.isRelationshipPresent('Manager')).toBeTruthy('Manager relationship is not present');
            expect(await relationshipsConfigsPage.getReverseRelationShipName('Manager')).toBe('Reportee', 'Reverse Relationship name for Manager does not match');
            expect(await relationshipsConfigsPage.isRelationshipPresent('Student')).toBeTruthy('Student relationship is not present');
            expect(await relationshipsConfigsPage.getReverseRelationShipName('Student')).toBe('Parent', 'Reverse Relationship name for Student does not match');
            expect(await relationshipsConfigsPage.isRelationshipPresent('Guardian')).toBeTruthy('Guardian relationship is not present');
            expect(await relationshipsConfigsPage.getReverseRelationShipName('Guardian')).toBe('Student', 'Reverse Relationship name for Guardian does not match');
            expect(await relationshipsConfigsPage.isRelationshipPresent('Parent')).toBeTruthy('Parent relationship is not present');
            expect(await relationshipsConfigsPage.getReverseRelationShipName('Parent')).toBe('Child', 'Reverse Relationship name for Parent does not match');
            expect(await relationshipsConfigsPage.isRelationshipPresent('Dependent of')).toBeTruthy('Dependent of relationship is not present');
            expect(await relationshipsConfigsPage.getReverseRelationShipName('Dependent of')).toBe('Dependent on', 'Reverse Relationship name for Dependent of does not match');
            expect(await relationshipsConfigsPage.isRelationshipPresent('Related to')).toBeTruthy('Related to relationship is not present');
            expect(await relationshipsConfigsPage.getReverseRelationShipName('Related to')).toBe('Related to', 'Reverse Relationship name for Related to does not match');


            //Create a active person to person relationship
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(`DRDMV-14186 Rname ${randomStr}`);
            await relationshipsConfigsPage.setNewReverseRelationshipName(`DRDMV-14186 RRname ${randomStr}`);
            await relationshipsConfigsPage.saveConfig();

            //Verify the Relationship type reflected to Add Relationships
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Fabian Krause', `DRDMV-14186 Rname ${randomStr}`);
            await utilityCommon.closePopUpMessage();

            //Verify recently added Person relationship
            expect(await relatedTabPage.getRelatedPersonRelationship('Fabian Krause')).toBe(`DRDMV-14186 Rname ${randomStr}`);
            await relatedTabPage.clickRelatedPersonName('Fabian Krause');
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000); //Hard Wait to load the new page
            expect(await relatedTabPage.getRelatedPersonRelationship('Elizabeth Peters')).toBe(`DRDMV-14186 RRname ${randomStr}`);
            await relatedTabPage.removeRelatedPerson('Elizabeth Peters');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[DRDMV-16815]: Configuration - person-to-person relationship', async () => {
            //Verify the Relationship Type with Inactive status
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', 'Person To Person Relationship console - Business Workflows');
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(`DRDMV-14186 Rname Inactive ${randomStr}`);
            await relationshipsConfigsPage.setNewReverseRelationshipName(`DRDMV-14186 RRname Inacitve ${randomStr}`);
            await relationshipsConfigsPage.setNewRelationshipStatus('Inactive');
            await relationshipsConfigsPage.saveConfig();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.searchAndSelectPerson('Qing Yuan');
            await addRelatedPopupPage.clickNextButton();
            expect(await addRelatedPopupPage.isRelationshipPresentInDropdown(`DRDMV-14186 Rname Inactive ${randomStr}`)).toBeFalsy();
            await utilityCommon.closeAllBlades();

            await navigationPage.signOut();
            await loginPage.login('tadmin');
            //Verify the Relationship Type with Deprecated status
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', 'Person To Person Relationship console - Business Workflows');
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(`DRDMV-14186 Rname Deprecated ${randomStr}`);
            await relationshipsConfigsPage.setNewReverseRelationshipName(`DRDMV-14186 RRname Deprecated ${randomStr}`);
            await relationshipsConfigsPage.setNewRelationshipStatus('Deprecated');
            await relationshipsConfigsPage.saveConfig();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.searchAndSelectPerson('Qing Yuan');
            await addRelatedPopupPage.clickNextButton();
            expect(await addRelatedPopupPage.isRelationshipPresentInDropdown(`DRDMV-14186 Rname Deprecated ${randomStr}`)).toBeFalsy();
            await utilityCommon.closeAllBlades();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya
    describe('[DRDMV-16799]: Person profile display for requester', () => {
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[DRDMV-16799]: Person profile display for requester', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'araisin', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for DRDMV-16799_1",
                "Assigned Company": "Petramco",
                "Business Unit": "HR Support",
                "Support Group": "Compensation and Benefits"
            }

            //Create the case with requester as Alex Raisin
            let response = await apiHelper.createCase(caseData);

            //Verify the Person Profile of Alex Raisin
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('CE2', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000252', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('araisin', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('FoundationRead');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("+918030914008", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("araisin@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Bangalore\n1, Wood Street/Castle Street, Ashoknagar, Bangalore, Karnataka, 560 025, India ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Arcturus Mengsk", "Manager name mismatch");
            expect(await relatedTabPage.isRemoveRelatedPersonIconEnabled('Arcturus Mengsk')).toBeFalsy('Remove icon is displayed for default relationship');
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");

            //Add Related Person qtao and verify the relationship is added
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Qianru Tao');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Alex Raisin', 'Child')).toBeTruthy('Relation does not match');
            await utilityCommon.switchToNewTab(1);

            //Remove the relation and verify that Relation is actually removed
            await relatedTabPage.removeRelatedPerson('Qianru Tao');
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Alex Raisin')).toBeFalsy('Alex Raisin is available in Related tab');
        });

        it('[DRDMV-16799]: Person profile display for requester', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qnorton', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "qnorton",
                "Summary": "Test case for DRDMV-16799_2",
                "Assigned Company": "Petramco",
                "Business Unit": "HR Support",
                "Support Group": "Compensation and Benefits"
            }

            let response = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickRequsterName();

            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('RA1', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000498', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Full time', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('qnorton', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('Case Agent, Human Resource');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("+61288992923", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("qnorton@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Macquarie Park\nLevel 5, Building C\n11 Talavera Road\nMacquarie Park NSW, Sydney, New South Wales, 2113, Australia ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("RA3 Liu", "Manager name mismatch");
            expect(await relatedTabPage.isRemoveRelatedPersonIconEnabled('RA3 Liu')).toBeFalsy('Remove icon is displayed for default relationship');
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");

            //Add Related Person qtao and verify the relationship is added
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Qianru Tao');
            await utilityCommon.switchToNewTab(2);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Quinn Norton', 'Child')).toBeTruthy('Relation does not match');
            await utilityCommon.switchToNewTab(1);

            //Remove the relation and verify that Relation is actually removed
            await relatedTabPage.removeRelatedPerson('Qianru Tao');
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Quinn Norton')).toBeFalsy('Quinn Norton is available in Related tab');
        });
    });
});
