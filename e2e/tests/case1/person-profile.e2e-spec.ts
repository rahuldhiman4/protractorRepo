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
import viewTaskPage from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Person Profile test', () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let businessData, departmentData, suppGrpData, personData;

    beforeAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.addRelationShip('Former Manager', 'Former Reportee', 'Person to Person');
        await apiHelper.addRelationShip('Parent', 'Child', 'Person to Person');
        await apiHelper.addRelationShip('Guardian', 'Student', 'Person to Person');
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');
        await navigationPage.gotoPersonProfile();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationDataCreation() {
        //Create Foundation data
        businessData = businessDataFile['BusinessUnitData_BulkOperation'];
        departmentData = departmentDataFile['DepartmentData_BulkOperation'];
        suppGrpData = supportGrpDataFile['SuppGrpData_BulkOperation'];
        personData = personDataFile['PersonData_BulkOperation'];
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToCompany(personData.userId, 'Petramco');
        businessData.relatedOrgId = 'Petramco';
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        await browser.sleep(3000); //sleep to reflect data on UI
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(3000); // timeout requried to reflect data on UI
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToDepartmentOrBU(personData.userId, businessData.orgName);
        await apiHelper.associatePersonToDepartmentOrBU(personData.userId, departmentData.orgName);
        await apiHelper.associatePersonToDepartmentOrBU(personData.userId, 'United States Support');
    }

    //asahitya
    it('[4129]: Check agent can not add notes to own Person profile in agent work history tab', async () => {
        expect(await personProfile.isActivityNotesDisplayed()).toBeFalsy("Activity Notes are available");
    });

    //asahitya
    it('[4585]: Verify Profile picture of Managar-Logged in user on My Profile page', async () => {
        expect(await personProfile.isPersonManagerImageDisplayed()).toBeTruthy("Person Manager image is not displayed");
    });

    //asahitya
    it('[4584]: Verify cases visible in Requested cases tab of My profile page are according to permissions of logged in user', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['4584']);
        let caseDisplayId = response.displayId;
        await personProfile.clickOnTab("Requested Cases");
        expect(await personProfile.isCasePresentOnRequestedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });

    //asahitya
    it('[4583]: Verify cases visible in Assiged cases tab of My profile page are according to permissions of logged in user', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['4583']);
        let caseDisplayId = response.displayId;
        await personProfile.clickOnTab("Assigned Cases");
        expect(await personProfile.isCasePresentOnAssignedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });

    //asahitya
    it('[4596,4198,4586]: Verify My Profile Console', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoPersonProfile();
        expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
        expect(await personProfile.getJobTitle()).toBe('HR Business Analyst', 'Job tite does not match');
        expect(await personProfile.getCorporateID()).toBe('200003', 'Corporate Id does not match');
        expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
        expect(await personProfile.getLoginID()).toBe('Elizabeth', 'Login Id does not match');
        expect(await personProfile.getFunctionalRoles()).toContain('Knowledge Coach,Case Business Analyst,Case Catalog Administrator');
        expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("1 925 5553456", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("elizabeth@bwflabs.localdomain", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Rochester\n70 Linden Oaks, Rochester, New York, 14625, United States ", "Site mismatch");
        expect(await personProfile.isPersonProfileImageDisplayed()).toBeTruthy("Person Profile image is not displayed");
        await personProfile.clickOnTab("Requested Cases");
        await personProfile.clickOnTab("Assigned Cases");
        await personProfile.clickOnTab("Support Groups");
        await personProfile.clickOnTab("Related Cases");
        await personProfile.clickOnTab("Related Persons");

        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Hannah Haas', 'Manager')).toBeTruthy('Manager is not Hannah');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Related to');
        await relatedTabPage.clickRelatedPersonName('Qianru Tao');
        try {
            await utilityCommon.switchToNewTab(1);
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Elizabeth Peters', 'Related to')).toBeTruthy('Related to is not available');
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        await relatedTabPage.removeRelatedPerson('Qianru Tao');
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Elizabeth Peters')).toBeFalsy('Elizabeth is still Present');
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        }
    });

    //asahitya
    it('[4202]: Person profile display for case assignee', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updateFoundationEntity('Person', 'qfeng', { vipStatus: 'Yes' });
        await apiHelper.apiLogin('elizabeth');

        let caseData = {
            "Requester": "araisin",
            "Summary": "Test case for 4202",
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
    it('[4201]: Person profile display for person from activity/history tab', async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updateFoundationEntity('Person', 'qfeng', { vipStatus: 'Yes' });
        await apiHelper.apiLogin('elizabeth');

        let caseData = {
            "Requester": "qyuan",
            "Summary": "Test case for 4202",
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
    describe('[4203]: Person profile display for Contact', () => {
        let response = undefined;
        afterEach(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[4203]: Person profile display for non Agent Contact', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'apavlik', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for 4202",
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

        it('[4203]: Person profile display for non Agent Contact', async () => {
            //Modify the Person to Person relationship
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);
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

        it('[4203]: Person profile display for Contact', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qfeng', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for 4202",
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
    it('[4595]: Verify navigation to Managers Profile from My Profile->Assigned Manager', async () => {
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnManagerLink();
        await utilityCommon.switchToNewTab(1);
        expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
        expect(await personProfile.getContactNumber()).toBe("1 213 5559393", "Phone number mismatch");
        expect(await personProfile.getEmail()).toBe("hannah.haas@petramco.com", "Email mismatch");
        expect(await personProfile.getSite()).toBe("Aichi\n4-6-23 Meieki, Nakamura-ku, Nagoya-shi, Aichi, Aichi, 450-0002, Japan ");
        await personProfile.clickOnTab("Requested Cases");
        await personProfile.clickOnTab("Assigned Cases");
        await personProfile.clickOnTab("Support Groups");
        await personProfile.clickOnTab("Related Cases");
        await personProfile.clickOnTab("Related Persons");
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    //asahitya
    it('[4127]: Check agent can view the notes of other agents Person profile in agent work history tab for which he is submitter of the note', async () => {
        try {
            await personProfile.clickOnManagerLink();
            await utilityCommon.switchToNewTab(1);
            await activityTabPage.addActivityNote("4127");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote("4127")).toBeTruthy("Activity notes is missing");
        }
        catch (ex) { throw ex; }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //asahitya
    it('[4128]: Check agent can view notes to own Person profile in agent work history tab', async () => {
        await navigationPage.gotoPersonProfile();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qiang Du', 'Parent');
        await relatedTabPage.clickRelatedPersonName('Qiang Du');
        await utilityCommon.switchToNewTab(1);
        await activityTabPage.addActivityNote("4128");
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnRefreshButton();
        expect(await activityTabPage.isTextPresentInNote("4128")).toBeTruthy("Elizabeth cannot see post on qdu's activity");
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        await activityTabPage.clickOnRefreshButton();
        expect(await activityTabPage.isTextPresentInNote("4128")).toBeTruthy("Elizabeth cannot see post on his own activity");
        try {
            await navigationPage.signOut();
            await loginPage.login("qdu");
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeTruthy("Qiang Du cannot see post on his own activity");

            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeFalsy("Qadim can see post on his own activity");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qiang Du', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Qiang Du');
            await utilityCommon.switchToNewTab(1);
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeFalsy("Qadim can see post on qdu's activity");
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login("elizabeth");
        }
    });

    //asahitya
    it('[4594]: Verify Requested Cases tab of My Profile console', async () => {
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnTab("Requested Cases");
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        for (let i: number = 0; i < 4; i++) {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            caseData['4584'].summary = "4594 " + randomStr;
            await apiHelper.createCase(caseData['4584']);
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
    it('[4593]: Verify Assigned Cases tab of My Profile console', async () => {
        await personProfile.clickOnTab("Assigned Cases");
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        for (let i: number = 0; i < 4; i++) {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            caseData['4583'].summary = "4593 " + randomStr;
            await apiHelper.createCase(caseData['4583']);
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

    describe('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', () => {
        it('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
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

        it('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await activityTabPage.addActivityNote("4126");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isInfoTooltipIconDisplayed()).toBeTruthy('Tooltip icon is not displayed');
            expect(await activityTabPage.getInfoTooltipMessage()).toBe('The notes related to a person are private and accessible ONLY to the note submitter and person with “Person Activity Read” role');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.isTextPresentInActivityLog('4126')).toBeTruthy('4126 log activity is not present on elizabeth activity');
            expect(await activityTabPage.isTextPresentInActivityLog('Quin Strong')).toBeTruthy('Quin Strong is not present on elizabeth activity');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeTruthy('Elizabeth Peters is not present on elizabeth activity');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeTruthy('added a note for is not present on elizabeth activity');
        });

        it('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            await utilityCommon.switchToNewTab(1);
            expect(await activityTabPage.isTextPresentInActivityLog('4126')).toBeTruthy('4126 log activity is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('Quin Strong')).toBeTruthy('Quin Strong is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeTruthy('Elizabeth Peters is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeTruthy('added a note for is not visible to qheroux');
            await navigationPage.signOut();
        });

        it('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await loginPage.login('franz');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            expect(await activityTabPage.isTextPresentInActivityLog('4126')).toBeFalsy('4126 log activity is present');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeFalsy('Elizabeth Peters is present in activity');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeFalsy('added a note for is present in activity');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[4573]: Verify My Profile icon with different business roles', () => {
        let userData = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData1",
            "company": "Petramco",
            "userPermission": ["Case Business Analyst", "Human Resource"]
        }
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createNewUser(userData);
        });

        it('[4573]: Verify My Profile icon with different business roles', async () => {
            //Check the Person Profile Menu of Case Agent
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();

            //Check the Person Profile Menu of Case Business Analyst
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoPersonProfile();
        });

        it('[4573]: Verify My Profile icon with different business roles', async () => {
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

    describe('[4197]: Configuration - person-to-person relationship', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[4197]: Configuration - person-to-person relationship', async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);

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
            await relationshipsConfigsPage.setNewRelationshipName(`4573 Rname ${randomStr}`);
            await relationshipsConfigsPage.setNewReverseRelationshipName(`4573 RRname ${randomStr}`);
            await relationshipsConfigsPage.saveConfig();

            //Verify the Relationship type reflected to Add Relationships
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Fabian Krause', `4573 Rname ${randomStr}`);
            await utilityCommon.closePopUpMessage();

            //Verify recently added Person relationship
            expect(await relatedTabPage.getRelatedPersonRelationship('Fabian Krause')).toBe(`4573 Rname ${randomStr}`);
            await relatedTabPage.clickRelatedPersonName('Fabian Krause');
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000); //Hard Wait to load the new page
            expect(await relatedTabPage.getRelatedPersonRelationship('Elizabeth Peters')).toBe(`4573 RRname ${randomStr}`);
            await relatedTabPage.removeRelatedPerson('Elizabeth Peters');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[4197]: Configuration - person-to-person relationship', async () => {
            //Verify the Relationship Type with Inactive status
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(`4573 Rname Inactive ${randomStr}`);
            await relationshipsConfigsPage.setNewReverseRelationshipName(`4573 RRname Inacitve ${randomStr}`);
            await relationshipsConfigsPage.setNewRelationshipStatus('Inactive');
            await relationshipsConfigsPage.saveConfig();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.searchAndSelectPerson('Qing Yuan');
            await addRelatedPopupPage.clickNextButton();
            expect(await addRelatedPopupPage.isRelationshipPresentInDropdown(`4573 Rname Inactive ${randomStr}`)).toBeFalsy();
            await utilityCommon.closeAllBlades();

            await navigationPage.signOut();
            await loginPage.login('tadmin');
            //Verify the Relationship Type with Deprecated status
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(`4573 Rname Deprecated ${randomStr}`);
            await relationshipsConfigsPage.setNewReverseRelationshipName(`4573 RRname Deprecated ${randomStr}`);
            await relationshipsConfigsPage.setNewRelationshipStatus('Deprecated');
            await relationshipsConfigsPage.saveConfig();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.searchAndSelectPerson('Qing Yuan');
            await addRelatedPopupPage.clickNextButton();
            expect(await addRelatedPopupPage.isRelationshipPresentInDropdown(`4573 Rname Deprecated ${randomStr}`)).toBeFalsy();
            await utilityCommon.closeAllBlades();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya
    describe('[4206]: Person profile display for requester', () => {
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[4206]: Person profile display for requester', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'araisin', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "araisin",
                "Summary": "Test case for 4206_1",
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

        it('[4206]: Person profile display for requester', async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qnorton', { vipStatus: 'Yes' });
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "qnorton",
                "Summary": "Test case for 4206_2",
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

    describe('[59946]: Verify whether Requesters sub organization details are displayed on person profile when case agent clicks on requesters name from case / task', () => {
        let caseResponse;
        let caseData = {
            "Status": "2000",
            "Assigned Company": "Petramco",
            "Description": "DRDMV16799 Desc",
            "Requester": "idPersonBO",
            "Summary": "DRDMV16799 Summary",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qfeng"
        }

        let taskData = {
            "taskName": 'Name DRDMV16799',
            "company": "Petramco",
            "lineOfBusiness": "Human Resource",
            "businessUnit": "United States Support",
            "supportGroup": "US Support 3",
            "assignee": "qkatawazi",
            "requester": "qfeng"
        }

        let updateCaseAccessDataQdu = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['writeAccess'],
            "username": 'qdu'
        }

        let updateCaseAccessDataQstrong = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['readAccess'],
            "username": 'qstrong'
        }

        let updateCaseAccessDataQliu = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['writeAccess'],
            "username": 'qliu'
        }

        let updateCaseAccessDataQcespedes = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['writeAccess'],
            "username": 'qcespedes'
        }

        beforeAll(async () => {
            //await foundationDataCreation();
            await apiHelper.apiLogin('qtao');
            caseResponse = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('qtao');
            await apiHelper.createAdhocTask(caseResponse.id, taskData);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQdu);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQstrong);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQliu);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQcespedes);
        });

        it('[59946]: Verify whether Requesters sub organization details are displayed on person profile when case agent clicks on requesters name from case / task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await viewCasePage.clickOnTaskLink('Name DRDMV16799');
            await viewTaskPage.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await viewCasePage.clickOnTaskLink('Name DRDMV16799');
            await viewTaskPage.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await viewCasePage.clickOnTaskLink('Name DRDMV16799');
            await viewTaskPage.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[59946]: Verify whether Requesters sub organization details are displayed on person profile when case agent clicks on requesters name from case / task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qcespedes');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qliu');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > United States Support, BulkOperationBusinessUnit, BulkOperationDepartment', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');

        });
    });

    describe('[59950]: Create case-case, case-person and person-person relationships using tadmin', async () => {
        it('[59950]:Case to Case Relation same name LOB validation', async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            let caseToCaseRelation = 'HR C2C';
            let caseToCaseReverseRelation = 'HR C2C Reverse';
            //create same name record in same LOB
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Case to Case', BWF_PAGE_TITLES.RELATIONSHIPS.CASE_TO_CASE);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToCaseRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToCaseReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            // add same relation again in same LOB
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToCaseRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToCaseReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            // verify error
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (10000): Relationship Type already exists.')).toBeTruthy("Error message absent");
            // expect(await relationshipsConfigsPage.isRelationshipPresent(caseToCaseRelation)).toBeFalsy("Other LOB relation present");
            // verify HR LOB record not present
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await relationshipsConfigsPage.isRelationshipPresent(caseToCaseRelation)).toBeFalsy("Other LOB relation present");
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToCaseRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToCaseReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved Successfully')).toBeTruthy("Success message absent");
            //expect(await relationshipsConfigsPage.isRelationshipPresent(caseToCaseRelation)).toBeFalsy("same name relation created");
        });
        it('[59950]:Person to Person Relation same name LOB validation', async () => {
            //create same name record in same LOB
            let caseToPersonRelation = 'HR C2P';
            let caseToPersonReverseRelation = 'HR C2P Reverse';
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Case to Person', BWF_PAGE_TITLES.RELATIONSHIPS.CASE_TO_PERSON);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            // add same relation again in same LOB
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            // verify error
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (10000): Relationship Type already exists.')).toBeTruthy("Error message absent");
            //expect(await relationshipsConfigsPage.isRelationshipPresent(caseToPersonRelation)).toBeFalsy("Other LOB relation present");
            // verify HR LOB record not present
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await relationshipsConfigsPage.isRelationshipPresent(caseToPersonRelation)).toBeFalsy("Other LOB relation present");
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved Successfully')).toBeTruthy("Success message absent");
            //expect(await relationshipsConfigsPage.isRelationshipPresent(caseToPersonRelation)).toBeFalsy("same name relation created");
        });
        it('[59950]:Person to Person Relation same name LOB validation', async () => {
            //create same name record in same LOB
            let personToPersonRelation = 'HR P2P';
            let personToPersonReverseRelation = 'HR P2P Reverse';
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(personToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(personToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            // add same relation again in same LOB
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(personToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(personToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            // verify error
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (10000): Relationship Type already exists.')).toBeTruthy("Error message absent");
            //expect(await relationshipsConfigsPage.isRelationshipPresent(personToPersonRelation)).toBeFalsy("Other LOB relation present");
            // verify HR LOB record not present
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await relationshipsConfigsPage.isRelationshipPresent(personToPersonRelation)).toBeFalsy("Other LOB relation present"); // Defect
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(personToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(personToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved Successfully')).toBeTruthy("Success message absent");
            //expect(await relationshipsConfigsPage.isRelationshipPresent(personToPersonRelation)).toBeFalsy("same name relation created");
        });
    });
});
