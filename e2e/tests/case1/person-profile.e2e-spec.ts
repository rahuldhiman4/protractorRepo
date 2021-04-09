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
import manageTaskBladePo from "../../pageobject/task/manage-task-blade.po";
import viewTaskPage from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Person Profile test', () => {
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    let businessData, departmentData, suppGrpData, personData, orgId;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.addRelationShip('Former Manager', 'Former Reportee', 'Person to Person');
        await apiHelper.addRelationShip('Parent', 'Child', 'Person to Person');
        await apiHelper.addRelationShip('Dependent of', 'Dependent on', 'Person to Person');
        await apiHelper.addRelationShip('Student', 'Parent', 'Person to Person');
        await apiHelper.addRelationShip('Related to', 'Related to', 'Person to Person');
        await apiHelper.addRelationShip('Guardian', 'Student', 'Person to Person');
        await navigationPage.gotoPersonProfile();
    });
    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationDataCreation() {
        // Create Foundation data
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

    //asahitya Pass
    describe('[4202]: Person profile display for case assignee', async () => {
        it('[4202]: Person profile display for case assignee', async () => {
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
                await browser.sleep(3000); //Takes time to redirect to person profile on new tab
                expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
                expect(await personProfile.getJobTitle()).toBe('RA3', 'Job tite does not match');
                expect(await personProfile.getCorporateID()).toBe('PET00000521', 'Corporate Id does not match');
                expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
                expect(await personProfile.getLoginID()).toBe('qfeng', 'Login Id does not match');
                expect(await personProfile.getFunctionalRoles()).toContain('Case Agent,Human Resource');
                expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
                expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
                expect(await personProfile.getContactNumber()).toContain("1 512 343-1920", "Phone number mismatch");
                expect(await personProfile.getEmail()).toContain("qfeng@petramco.com", "Email mismatch");
                expect(await personProfile.getSite()).toContain("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ", "Site mismatch");
                expect(await personProfile.getManagerName()).toBe("Qiang Du", "Manager name mismatch");
                await personProfile.clickOnTab("Requested Cases");
                await personProfile.clickOnTab("Assigned Cases");
                await personProfile.clickOnTab("Support Groups");
                await personProfile.clickOnTab("Related Cases");
                await personProfile.clickOnTab("Related Persons");
                await relatedTabPage.addRelatedPerson();
                await addRelatedPopupPage.addPerson('Qianru Tao', 'Guardian');
                await relatedTabPage.clickRelatedPersonName('Qianru Tao');
                await browser.sleep(3000); //Takes time to redirect to person profile on new tab
                await utilityCommon.switchToNewTab(2);
                expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiao Feng', 'Manager')).toBeTruthy();

                await utilityCommon.switchToNewTab(1);
                await relatedTabPage.removeRelatedPerson('Qianru Tao');
            }
            catch (ex) { throw ex; }
            finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
            try {
                await navigationPage.signOut();
                await loginPage.login('qtao');
                await navigationPage.gotoPersonProfile();
                expect(await relatedTabPage.isRelatedPersonPresent('Qiang Du')).toBeFalsy('Qiang Du is available in Related tab');
            }
            catch (ex) { throw ex; }
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya Pass
    describe('[4201]: Person profile display for person from activity/history tab', async () => {
        it('[4201]: Person profile display for person from activity/history tab', async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await apiHelper.apiLogin('elizabeth');

            let caseData = {
                "Requester": "qyuan",
                "Summary": "Test case for 4201",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            let response = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await activityTabPage.addPersonInActivityNote('Qiao Feng');
            await activityTabPage.clickOnPostButton();
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qiao Feng');
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await browser.sleep(3000); //Takes time to redirect to person profile on new tab 
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('RA3', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000521', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('qfeng', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('Case Agent,Human Resource');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain('1 512 343-1920', "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain('qfeng@petramco.com', "Email mismatch");
            expect(await personProfile.getSite()).toContain("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Qiang Du", "Manager name mismatch");
            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Guardian');
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
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    //Fix
    describe('[4203]: Person profile display for Contact', () => {
        let response = undefined;
        afterEach(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[4203]: Person profile display for non Agent Contact', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await viewCasePage.clickContactPersonName();
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000); //Takes time to redirect to person profile on new tab
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('CE3', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000239', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('apavlik', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('-');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("1 925 469-4006", "Phone number mismatch");
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
            await browser.sleep(3000); //Takes time to redirect to person profile on new tab
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
            await utilityGrid.clearFilter();
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
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Adam Pavlik')).toBeFalsy('Adam Pavlik is available in Related tab');
        });

        it('[4203]: Person profile display for Contact', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnContactPersonerDrpDwn();
            await viewCasePage.clickContactPersonName();

            await utilityCommon.switchToNewTab(1);
            await browser.sleep(5000); //Takes time to redirect to person profile on new tab
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('RA3', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000521', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('qfeng', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('Case Agent,Human Resource');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("1 512 343-1920", "Phone number mismatch");
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
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(5000); //Takes time to redirect to person profile on new tab
            expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qiang Du', 'Manager')).toBeTruthy('Relation is not matching');
            await relatedTabPage.removeRelatedPerson('Peter Kahn');

            await navigationPage.signOut();
            await loginPage.login('peter');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Qiao Feng')).toBeFalsy('Qiao Feng is available in Related tab');
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //asahitya
    describe('[4595]: Verify navigation to Managers Profile from My Profile->Assigned Manager', () => {
        beforeAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
        it('[4595]: Verify navigation to Managers Profile from My Profile->Assigned Manager', async () => {
            await navigationPage.gotoPersonProfile();
            await browser.sleep(3000);//loading profile page
            await personProfile.clickOnManagerLink();
            await utilityCommon.switchToNewTab(1);
            await browser.sleep(3000);//loading profile page
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toBe("1 512 343-1920", "Phone number mismatch");
            expect(await personProfile.getEmail()).toBe("qfeng@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ");

            await personProfile.clickOnTab("Requested Cases");
            await personProfile.clickOnTab("Assigned Cases");
            await personProfile.clickOnTab("Support Groups");
            await personProfile.clickOnTab("Related Cases");
            await personProfile.clickOnTab("Related Persons");
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //asahitya
    describe('[4127]: Check agent can view the notes of other agents Person profile in agent work history tab for which he is submitter of the note', () => {
        it('[4127]: Check agent can view the notes of other agents Person profile in agent work history tab for which he is submitter of the note', async () => {
            await personProfile.clickOnManagerLink();
            await browser.sleep(3000); //wait for load person profile
            await utilityCommon.switchToNewTab(1);
            await activityTabPage.addActivityNote("4127");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInNote("4127")).toBeTruthy("Activity notes is missing");
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //asahitya
    describe('[4128]: Check agent can view notes to own Person profile in agent work history tab', () => {
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
        it('[4128]: Check agent can view notes to own Person profile in agent work history tab', async () => {
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.clickRelatedPersonName('Hannah Haas');
            await utilityCommon.switchToNewTab(1);
            await activityTabPage.addActivityNote("4128");
            await activityTabPage.clickOnPostButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeTruthy("Elizabeth cannot see post on hhaas's activity");
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await activityTabPage.clickOnRefreshButton();
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeTruthy("Elizabeth cannot see post on his own activity");
        });
        it('[4128]: Check agent can view notes to own Person profile in agent work history tab', async () => {
            await navigationPage.signOut();
            await loginPage.login("hannah");

            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeTruthy("Hannah Haas cannot see post on his own activity");
        });
        it('[4128]: Check agent can view notes to own Person profile in agent work history tab', async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoPersonProfile();
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeFalsy("Qadim can see post on his own activity");
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('qfeng', 'Parent');
            await relatedTabPage.clickRelatedPersonName('Qiao Feng');
            await utilityCommon.switchToNewTab(1);
            expect(await activityTabPage.isTextPresentInNote("4128")).toBeFalsy("Qadim can see post on qdu's activity");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', () => {
        it('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            // await apiHelper.apiLogin('tadmin');
            // await apiHelper.updateFoundationEntity('Person', 'qheroux', { functionalRole: 'Person Activity Read' });
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
            await loginPage.login('qyuan');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            await browser.sleep(3000); //Wait for new tab to load properly
            await activityTabPage.addActivityNote("4126");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInActivityLog('4126')).toBeTruthy('4126 log activity is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('Quin Strong')).toBeTruthy('Quin Strong is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeTruthy('Elizabeth Peters is not visible to qheroux');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeTruthy('added a note for is not visible to qheroux');
            await navigationPage.signOut();
        });
        it('[4126]: Check one agent can view the notes added on other agent in agent work history tab for which he has "Person Profile read access"', async () => {
            await loginPage.login('jbarnes');
            await navigationPage.gotoPersonProfile();
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Quin Strong', 'Guardian');
            await relatedTabPage.clickRelatedPersonName('Quin Strong');
            await browser.sleep(3000); //Wait for new tab to load properly
            await activityTabPage.addActivityNote("4126");
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isTextPresentInActivityLog('4126')).toBeFalsy('4126 log activity is present');
            expect(await activityTabPage.isTextPresentInActivityLog('Elizabeth Peters')).toBeFalsy('Elizabeth Peters is present in activity');
            expect(await activityTabPage.isTextPresentInActivityLog('added a note for')).toBeFalsy('added a note for is present in activity');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    describe('[4573]: Verify My Profile icon with different business roles', () => {
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
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya Fail DRDMV-25335
    describe('[4206]: Person profile display for requester', () => {
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

        it('[4206]: Person profile display for requester', async () => {
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('CE2', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000252', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('araisin', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('-');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("91 80 30914008", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("araisin@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Bangalore\n1, Wood Street/Castle Street, Ashoknagar, Bangalore, 560 025, India ", "Site mismatch");
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
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickRequsterName();

            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('RA1', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('PET00000498', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('qnorton', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('Case Agent,Human Resource');
            expect(await personProfile.isVIPTagPresent()).toBeTruthy('VIP tag is not present');
            expect(await personProfile.getCompany()).toContain("Petramco", "Company name mismatch");
            expect(await personProfile.getContactNumber()).toContain("61 2 8899 2923", "Phone number mismatch");
            expect(await personProfile.getEmail()).toContain("qnorton@petramco.com", "Email mismatch");
            expect(await personProfile.getSite()).toBe("Macquarie Park\nLevel 5, Building C\n11 Talavera Road\nMacquarie Park NSW, Sydney, New South Wales, 2113, Australia ", "Site mismatch");
            expect(await personProfile.getManagerName()).toBe("Qiwei Liu", "Manager name mismatch");
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
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });

    });

    describe('[59946]: Verify whether Requesters sub organization details are displayed on person profile when case agent clicks on requesters name from case / task', () => {
        let caseResponse;
        let caseData = {
            "Status": "2000",
            "Assigned Company": "Petramco",
            "Description": "DRDMV16799 Desc",
            "Requester": "qkatawazi",
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
            "security": security['witeAccess'],
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
            "security": security['witeAccess'],
            "username": 'qliu'
        }

        let updateCaseAccessDataQcespedes = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'qcespedes'
        }

        beforeAll(async () => {
            //await foundationDataCreation();
            await apiHelper.apiLogin('qtao');
            caseResponse = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('qtao');
            await apiHelper.createAdhocTask(caseResponse.id, taskData);

            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQliu);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQcespedes);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQdu);
            await apiHelper.updateCaseAccess(caseResponse.id, updateCaseAccessDataQstrong);
        });

        it('[59946]: Verify whether Requesters sub organization details are displayed on person profile when case agent clicks on requesters name from case / task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await browser.sleep(5000); //Adding Extra wait due to Performace issue in search case
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink('Name DRDMV16799');
            await viewTaskPage.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink('Name DRDMV16799');
            await viewTaskPage.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickTaskLink('Name DRDMV16799');
            await viewTaskPage.clickOnRequesterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[59946]: Verify whether Requesters sub organization details are displayed on person profile when case agent clicks on requesters name from case / task', async () => {
            await navigationPage.signOut();
            await loginPage.login('qcespedes');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qstrong');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();

            await navigationPage.signOut();
            await loginPage.login('qliu');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickRequsterName();
            await utilityCommon.switchToNewTab(1);
            expect(await personProfile.getCompany()).toBe('Petramco > Human Resources > Benefits', 'Organization details not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //defect - different lob relation is not getting added Fail -DRDMV-25385
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
            expect(await utilityCommon.isPopUpMessagePresent('Relationship Type already exists.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            // expect(await relationshipsConfigsPage.isRelationshipPresent(caseToCaseRelation)).toBeFalsy("Other LOB relation present");
            // verify HR LOB record not present
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await relationshipsConfigsPage.isRelationshipPresent(caseToCaseRelation)).toBeFalsy("Other LOB relation present");
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToCaseRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToCaseReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved Successfully')).toBeTruthy("Success message absent");
            await utilityCommon.closePopUpMessage();
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
            expect(await utilityCommon.isPopUpMessagePresent('Relationship Type already exists.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            //expect(await relationshipsConfigsPage.isRelationshipPresent(caseToPersonRelation)).toBeFalsy("Other LOB relation present");
            // verify HR LOB record not present
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await relationshipsConfigsPage.isRelationshipPresent(caseToPersonRelation)).toBeFalsy("Other LOB relation present");
            await relationshipsConfigsPage.clickAddRelationshipButton();
            await relationshipsConfigsPage.setNewRelationshipName(caseToPersonRelation);
            await relationshipsConfigsPage.setNewReverseRelationshipName(caseToPersonReverseRelation);
            await relationshipsConfigsPage.saveConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved Successfully')).toBeTruthy("Success message absent");
            await utilityCommon.closePopUpMessage();
            //expect(await relationshipsConfigsPage.isRelationshipPresent(caseToPersonRelation)).toBeFalsy("same name relation created");
        });
        it('[59950]:Person to Person Relation same name LOB validation', async () => {
            //create same name record in same LOB
            let personToPersonRelation = 'HR P2P';
            let personToPersonReverseRelation = 'HR P2P Reverse';
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Person to Person', BWF_PAGE_TITLES.RELATIONSHIPS.PERSON_TO_PERSON);
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
            expect(await utilityCommon.isPopUpMessagePresent('Relationship Type already exists.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
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
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('elizabeth');

        });
    });

    //asahitya-falling due to person imag not set
    it('[4585]: Verify Profile picture of Managar-Logged in user on My Profile page', async () => {
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
        let response = await apiHelper.createCase(caseData);
        // Verify the Person Profile of Adam Pavlik
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(response.displayId);
        await viewCasePage.clickOnContactPersonerDrpDwn();
        await viewCasePage.clickContactPersonName();
        await utilityCommon.switchToNewTab(1);
        expect(await personProfile.isPersonManagerImageDisplayed()).toBeTruthy("Person Manager image is not displayed");
    });

    describe('[4596,4198,4586]: Verify My Profile Console', async () => {
        it('[4596,4198,4586]: Verify My Profile Console', async () => {
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoPersonProfile();
            expect(await personProfile.getPersonType()).toBe('Employee', 'Person type does not match');
            expect(await personProfile.getJobTitle()).toBe('HR Business Analyst', 'Job tite does not match');
            expect(await personProfile.getCorporateID()).toBe('200003', 'Corporate Id does not match');
            expect(await personProfile.getEmployeeTypeValue()).toBe('Office-Based Employee', 'Employee Type value does not match');
            expect(await personProfile.getLoginID()).toBe('Elizabeth', 'Login Id does not match');
            expect(await personProfile.getFunctionalRoles()).toContain('Knowledge Coach,Case Business Analyst,Case Catalog Administrator,Human Resource');
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
            await addRelatedPopupPage.addPerson('qyuan', 'Related to');
        });
        it('[4596,4198,4586]: Verify My Profile Console', async () => {
            await relatedTabPage.clickRelatedPersonName('Qing Yuan');
            await browser.sleep(3000); //Takes time to redirect to person profile on new tab
            try {
                await utilityCommon.switchToNewTab(1);
                await browser.sleep(2000); // validation in loop needs wait time, can be removed if not needed
                expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Elizabeth Peters', 'Related to')).toBeTruthy('Related to is not available');
            }
            catch (ex) { throw ex; }
            finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
            await browser.sleep(2000); //To wait for completely loading of default page
            await relatedTabPage.removeRelatedPerson('Qing Yuan');
            await utilityCommon.closePopUpMessage(); // remove when error message defect fixed
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoPersonProfile();
            expect(await relatedTabPage.isRelatedPersonPresent('Elizabeth Peters')).toBeFalsy('Elizabeth is still Present');
        });
        afterAll(async () => {
            await utilityCommon.closePopUpMessage(); // remove when error message defect fixed
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //asahitya Filter Issue -DRDMV-25321
    it('[4594]: Verify Requested Cases tab of My Profile console', async () => {
        await navigationPage.signOut();
        await loginPage.login('elizabeth');
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnTab("Requested Cases ");
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        for (let i: number = 0; i < 4; i++) {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            caseData['4584'].summary = "4594 " + randomStr;
            await apiHelper.createCase(caseData['4584']);
        }

        // Verifying default column matching
        let defaultRequestedCaseColumns: string[] = ["Case ID", "Priority", "Status", "Summary", "Created Date", "Assignee"];
        expect(await personProfile.areRequestedCaseColumnMatches(defaultRequestedCaseColumns)).toBeTruthy("Default Requested columns are not matching");

        //Verifying all columns
        let allRequestedCaseColumns: string[] = ["Assignee ID", "Assignee Login Name", "Assignee ID", "Flowset", "ID", "Label", "Modified Date", "Source", "Status Value"];
        await personProfile.addRequestedCaseGridColumn(allRequestedCaseColumns);
        let expectedAllColumns: string[] = ["Assignee", "Assignee ID", "Assignee Login Name", "Case ID", "Created Date", "Flowset", "ID", "Label", "Modified Date", "Priority", "Source", "Status", "Status Value", "Summary"];
        expect(await personProfile.areRequestedCaseColumnMatches(expectedAllColumns)).toBeTruthy("All Requested columns are not matching");
        await personProfile.removeRequestedCaseGridColumn(allRequestedCaseColumns);

        //Verify sorting
        expect(await personProfile.isRequestedCasesColumnsSortedAscending("Case ID")).toBeTruthy("Columns are not sorted");
    });//, 150 * 1000);

    //asahitya Filter Issue -DRDMV-25321
    it('[4593]: Verify Assigned Cases tab of My Profile console', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoPersonProfile();
        await personProfile.clickOnTab("Assigned Cases ");
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
        let expectedAllColumns: string[] = ["Assignee Login Name", "Case ID", "ID", "Label", "Modified Date", "Priority", "Request ID", "Requester", "Source", "Status", "Status Value", "Summary"];
        expect(await personProfile.areAssignedCaseColumnMatches(expectedAllColumns)).toBeTruthy("All Assigned columns are not matching");
        await personProfile.removeAssignedCaseGridColumn(allAssignedCaseColumns);

        //Verify sorting
        expect(await personProfile.isAssignedCasesColumnsSortedAscending("Case ID")).toBeTruthy("Columns are not sorted");
    });//, 160 * 1000);    

    //asahitya Filter Issue -DRDMV-25321 
    it('[4584]: Verify cases visible in Requested cases tab of My profile page are according to permissions of logged in user', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['4584']);
        let caseDisplayId = response.displayId;
        await personProfile.clickOnTab("Requested Cases ");
        expect(await personProfile.isCasePresentOnRequestedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });

    //asahitya Filter Issue -DRDMV-25321
    it('[4583]: Verify cases visible in Assiged cases tab of My profile page are according to permissions of logged in user', async () => {
        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoPersonProfile();
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['4583']);
        let caseDisplayId = response.displayId;
        await personProfile.clickOnTab("Assigned Cases ");
        expect(await personProfile.isCasePresentOnAssignedCases(caseDisplayId)).toBeTruthy("Case is not present");
    });
});
