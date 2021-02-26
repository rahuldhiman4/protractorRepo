import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { flowsetPhylumFields } from '../../data/ui/flowset/flowset.ui';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import assignmentBladePO from '../../pageobject/common/change-assignment.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import statusConfigPo from '../../pageobject/settings/common/status-config.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case Status Configuration', () => {
    let flowsetPhylumFieldsData = undefined;
    let personData1, personData3;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        // await apiHelper.apiLogin('tadmin');
        // const personDataFile = require('../../data/ui/foundation/person.ui.json');
        // personData1 = personDataFile['PhylumCaseAdmin1'];

        // await apiHelper.createNewUser(personData1);
        // await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');
        // await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        // await browser.sleep(7000); //Wait to reflect the user created above

        // let personData2 = personDataFile['PhylumCaseAdmin2'];
        // await apiHelper.createNewUser(personData2);
        // await apiHelper.associatePersonToCompany(personData2.userId, 'Phylum');
        // await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Phylum Support Group1');
        // await browser.sleep(7000); //Wait to reflect the user created above

        // personData3 = personDataFile['PhylumKnowledgeUser'];
        // await apiHelper.createNewUser(personData3);
        // await apiHelper.associatePersonToCompany(personData3.userId, 'Phylum');
        // await apiHelper.associatePersonToSupportGroup(personData3.userId, 'Phylum Support Group1');
        // await browser.sleep(7000); //Wait to reflect the user created above

        await loginPage.login('jmilano');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        flowsetPhylumFieldsData = cloneDeep(flowsetPhylumFields);
        flowsetPhylumFieldsData.flowsetName = flowsetPhylumFieldsData.flowsetName + randomStr;
        await apiHelper.apiLogin('tadmin');
        flowsetPhylumFieldsData["lineOfBusiness"] = "Finance";
        await apiHelper.createNewFlowset(flowsetPhylumFieldsData);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[4687]: Verify User not able to delete mandatory status for case', () => {
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano');
        })
        it('[4687]: Verify User not able to delete mandatory status for case', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("New");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
            await statusConfigPo.clickEditStatus("Progress");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
            await statusConfigPo.clickEditStatus("Assigned");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
            await statusConfigPo.clickEditStatus("Resolved");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
            await statusConfigPo.clickEditStatus("Closed");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
            await statusConfigPo.clickEditStatus("Pending");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
            await statusConfigPo.clickEditStatus("Canceled");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnCancelButton();
        });

        it('[4687]: Verify User not able to delete mandatory status for case', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'case');
            await statusConfigPo.selectFlowset(flowsetPhylumFieldsData.flowsetName);
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("New");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink(); // no need to edit everytime so line commented
            await statusConfigPo.clickEditStatus("Progress");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Assigned");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Resolved");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Closed");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Pending");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Canceled");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //asahitya
    it('[4689]:Verify UI for case status configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
        expect(await statusConfigPo.getTitleValue('case')).toBe('Case Status Configuration');
        expect(await statusConfigPo.isCompanyRequiredText('case')).toBeTruthy();
        expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
        await statusConfigPo.setCompanyDropdown("Phylum", 'case');
        await statusConfigPo.selectFlowset(flowsetPhylumFieldsData.flowsetName);
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for Phylum - ' + flowsetPhylumFieldsData.flowsetName);
        expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        await statusConfigPo.clickOnCancelButton();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    //asahitya
    describe('[4612]:Verify case created prior to label change will reflect new status label changes', () => {
        let caseId1: string = undefined;
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano');
        })
        it('[4612]:Verify case created prior to label change will reflect new status label changes', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('mcarney');
            await createCasePo.setSummary("4612 before configuration");
            await assignmentBladePO.setDropDownValue('Company', 'Phylum');
            await assignmentBladePO.setDropDownValue('SupportOrg', 'Phylum Support Org1');
            await assignmentBladePO.setDropDownValue('AssignedGroup', 'Phylum Support Group1');
            await assignmentBladePO.setDropDownValue('Assignee', 'Roland Flanagan');
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            caseId1 = await viewCasePo.getCaseID();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Assigned");
            await statusConfigPo.renameExistingStatus('Staged');
        });

        it('[4612]:Verify case created prior to label change will reflect new status label changes', async () => {
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('mcarney');
            await createCasePo.setSummary("4612 after configuration");
            await createCasePo.clickAssignToMeButton();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getTextOfStatus()).toBe("Staged");

            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId1);
            expect(await viewCasePo.getTextOfStatus()).toBe("Staged");

            //back to default
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Staged");
            await statusConfigPo.renameExistingStatus('Assigned');
        });
    });

    //asahitya  
    describe('[4680]: Verify User not able to delete mandatory status for task', () => {
        it('[4680]: Verify User not able to delete mandatory status for task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'task');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("Staged", "Assigned", "customStatus");
            await statusConfigPo.clickOnBackButton();
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Staged");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Staged status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Progress");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('In Progress status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Assigned");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Assigned status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Completed");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Completed status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
        });

        it('[4680]: Verify User not able to delete mandatory status for task', async () => {
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Closed");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Closed status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Pending");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Pending status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Canceled");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Canceled status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Failed");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy('Failed status delete button is enabled');
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy('customStatus status delete button is enabled');
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await statusConfigPo.clickOnBackButton();
        });
    });

    //asahitya
    describe('[4679]: Verify User not able to delete mandatory status for Knowledge', () => {
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano');
        })
        it('[4679]: Verify User not able to delete mandatory status for Knowledge', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'knowledge');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("In Progress", "Draft", "Custom");
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink(); // edit does not required everytime so commented it
            await statusConfigPo.clickEditStatus("Draft");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Progress");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("SME"); //Need to change
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Approval");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
        });
        it('[4679]: Verify User not able to delete mandatory status for Knowledge', async () => {
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Closed");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Published");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Canceled");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Retired");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeFalsy();
            await statusConfigPo.clickOnBackButton();
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Custom");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await statusConfigPo.clickOnBackButton();
        });
    });

    //asahitya
    it('[4678]:Verify UI for Knowledge status configuration', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
        expect(await statusConfigPo.getTitleValue('knowledge')).toBe('Knowledge Status Configuration');
        expect(await statusConfigPo.isCompanyRequiredText('knowledge')).toBeTruthy();
        expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
        await statusConfigPo.setCompanyDropdown("Phylum", 'knowledge');
        expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        await statusConfigPo.clickOnCancelButton();
    });

    //asahitya - required text defect
    it('[4683]:Verify UI for Task status configuration', async () => {
        await navigationPage.signOut();
        await loginPage.login('jmilano');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
        expect(await statusConfigPo.getTitleValue('task')).toBe('Task Status Configuration');
        expect(await statusConfigPo.isCompanyRequiredText('task')).toBeTruthy();
        expect(await statusConfigPo.getDefaultCompanyValue()).toBe('- Global -');
        expect(await statusConfigPo.getStatusLifeCycle()).toBe('Status Lifecycle for - Global -');
        await statusConfigPo.setCompanyDropdown("Phylum", 'task');
        expect(await statusConfigPo.isEditLifeCycleBtnDisabled()).toBeFalsy('Button is disabled');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Canceled");
        await statusConfigPo.clickOnCancelButton();
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
    });

    //asahitya - popup defect
    describe('[4676,4642]:Verify Custom status operations for case', () => {
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano');
        })
        it('[4676,4642]:Verify Custom status operations for case', async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("New", "Assigned", "customStatus");
            await statusConfigPo.clickOnBackButton();
            await statusConfigPo.clickEditLifeCycleLink();

            await statusConfigPo.clickEditStatus("customStatus");
            await statusConfigPo.clickOnMandatoryCheckbox();
            await statusConfigPo.saveSetting();
            expect(await utilityCommon.getAllPopupMsg()).toContain('The Status Reason Mandatory check box is selected. Add a status reason or clear the check box.');
            await statusConfigPo.setStatusReason("customStatus required");
            await statusConfigPo.clickOnBackButton();
            //delete custom status
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await statusConfigPo.clickOnBackButton();
        });

        it('[4676,4642]:Verify Custom status operations for case', async () => {
            await navigationPage.signOut();
            await loginPage.login('jmilano');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.selectFlowset(flowsetPhylumFieldsData.flowsetName);
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("New", "Assigned", "customStatus");
            await statusConfigPo.clickOnBackButton();
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            await statusConfigPo.clickOnMandatoryCheckbox();
            await statusConfigPo.saveSetting();
            expect(await utilityCommon.getAllPopupMsg()).toContain('The Status Reason Mandatory check box is selected. Add a status reason or clear the check box.');
            await statusConfigPo.setStatusReason("customStatus required");
            await statusConfigPo.clickOnBackButton();
            //delete custom status
            // await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await statusConfigPo.clickOnBackButton();
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    // popup defect
    it('[4682]:Verify Custom status operations for Task', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
        await statusConfigPo.setCompanyDropdown('Phylum', 'task');
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.addCustomStatus("Assigned", "In Progress", "customStatus");
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        await statusConfigPo.clickOnMandatoryCheckbox();
        await statusConfigPo.saveSetting();
        expect(await utilityCommon.getAllPopupMsg()).toContain('The Status Reason Mandatory check box is selected. Add a status reason or clear the check box.');
        await statusConfigPo.setStatusReason("customStatus required");
        await statusConfigPo.clickOnBackButton();
        //delete Custom Status
        // await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("customStatus");
        expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
        await statusConfigPo.clickOnDeleteButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        await statusConfigPo.clickEditStatus("Staged");
        await statusConfigPo.updateExistingStatusName('Updated');
        await statusConfigPo.cancelSettingChange();
        await statusConfigPo.clickOnBackButton();
        await statusConfigPo.clickEditLifeCycleLink();
        await statusConfigPo.clickEditStatus("Staged");
        await statusConfigPo.renameExistingStatus('Update');
    });

    //ankagraw in progress
    describe('[4608]:Delete non mandatory and custom status', async () => {
        let caseId, taskId, caseId1, caseData, articleData1, articleData2, caseDataInProgress, knowledgeSetData, knowldgeId, randomStr = Math.floor(Math.random() * 1000000);
        let personData1;
        beforeAll(async () => {
            // await apiHelper.apiLogin('tadmin');
            // const personDataFile = require('../../data/ui/foundation/person.ui.json');
            // personData1 = personDataFile['AlienwareCaseAdmin1'];
            // await apiHelper.createNewUser(personData1);
            // await apiHelper.associatePersonToCompany(personData1.userId, 'Pico Systems');
            // await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Pico Support Group1');
            // await browser.sleep(7000); //Wait to reflect the user created above

            // let personData2 = personDataFile['AlienwareCaseAdmin2'];
            // await apiHelper.createNewUser(personData2);
            // await apiHelper.associatePersonToCompany(personData2.userId, 'Pico Systems');
            // await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Pico Support Group1');
            // await browser.sleep(7000); //Wait to reflect the user created above

            // let personData3 = personDataFile['AlienwareKnowledgeUser'];
            // await apiHelper.createNewUser(personData3);
            // await apiHelper.associatePersonToCompany(personData3.userId, 'Pico Systems');
            // await apiHelper.associatePersonToSupportGroup(personData3.userId, 'Pico Support Group2');
            // await browser.sleep(7000); //Wait to reflect the user created above
            caseData =
                {
                    "Requester": 'rflanagan',
                    "Summary": randomStr + "test",
                    "Assigned Company": "Phylum",
                    "Business Unit": "Phylum Support Org1",
                    "Support Group": "Phylum Support Group1",
                    "Assignee": 'mcarney'
                }
            caseDataInProgress =
                {
                    "Requester": 'rflanagan',
                    "Summary": randomStr + "test",
                    "Assigned Company": "Phylum",
                    "Business Unit": "Phylum Support Org1",
                    "Support Group": "Phylum Support Group1",
                    "Assignee": 'mcarney',
                    "status": "In Progress",
                }

            knowledgeSetData = {
                knowledgeSetTitle: "test knowledge" + randomStr,
                knowledgeSetDesc: "test description",
                company: 'Phylum'
            }

            articleData1 = {
                "knowledgeSet": knowledgeSetData.knowledgeSetTitle,
                "title": "KnowledgeArticle" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "company": 'Phylum'
            }

            articleData2 = {
                "knowledgeSet": knowledgeSetData.knowledgeSetTitle,
                "title": "KnowledgeArticleData" + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "company": 'Phylum'
            }

            await navigationPage.signOut();
            await loginPage.login('mcarney');
        });
        it('[4608]:Delete non mandatory and custom status for task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'task');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("Staged", "Assigned", "customStatus");
        });
        it('[4608]:Delete non mandatory and custom status for task', async () => {
            await apiHelper.apiLogin('mcarney');
            caseId = await apiHelper.createCase(caseDataInProgress);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("Summary" + randomStr);
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink("Summary" + randomStr);
            await viewTaskPo.clickOnViewCase();
            await updateStatusBladePo.changeStatus("In Progress");
            await updateStatusBladePo.clickSaveStatus();
            await viewCasePo.openTaskCard(1);
            await manageTaskBladePo.clickTaskLink("Summary" + randomStr);
            expect(await viewTaskPo.getTaskStatusValue()).toBe("customStatus"); //stage
            taskId = await viewTaskPo.getTaskID();

        });
        it('[4608]:Delete non mandatory and custom status for task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'task');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await utilityCommon.isPopUpMessagePresent("Tasks with this status are present")).toBeTruthy("Tasks with this status are present");
        });

        it('[4608]:Delete non mandatory and custom status for task', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.searchAndOpenHyperlink(taskId);
            expect(await viewTaskPo.getTaskStatusValue()).toBe("customStatus");
            await updateStatusBladePo.changeStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus();
            expect(await viewTaskPo.getTaskStatusValue()).toBe("Assigned");
        });
        it('[4608]:Delete non mandatory and custom status for task', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'task');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[4608]:Delete non mandatory and custom status for task', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("Summary" + randomStr);
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink("Summary" + randomStr);
            expect(await viewTaskPo.getTaskStatusValue()).toBe("Assigned"); // stage
        });

        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("New", "Assigned", "customStatus");
        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await apiHelper.apiLogin('mcarney');
            caseId = await apiHelper.createCase(caseDataInProgress);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            expect(await viewCasePo.getCaseStatusValue()).toBe('customStatus');

        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await utilityCommon.isPopUpMessagePresent("Cases with this status are present.")).toBeTruthy();

        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId.displayId);
            await updateStatusBladePo.changeStatus('Assigned');
            await updateStatusBladePo.clickSaveStatus('Assigned');
            expect(await viewCasePo.getCaseStatusValue()).toBe("Assigned");
        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', BWF_PAGE_TITLES.CASE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown("Phylum", 'case');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("customStatus");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await apiHelper.apiLogin('mcarney');
            caseId1 = await apiHelper.createCase(caseData);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId1.displayId);
        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Petramco', 'knowledge');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.addCustomStatus("In Progress", "Draft", "Custom");
        });

        it('[4608]:Delete non mandatory and custom status', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            knowldgeId = await apiHelper.createKnowledgeArticle(articleData1);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(knowldgeId.displayId);
            await editKnowledgePo.setKnowledgeStatus('Custom');
        });

        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'knowledge');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Custom");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            expect(await utilityCommon.isPopUpMessagePresent("Knowledge articles with this status are present.")).toBeTruthy();
        });
        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(knowldgeId.displayId);
            await editKnowledgePo.setKnowledgeStatus('Draft');
        });

        it('[4608]:Delete non mandatory and custom status', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPo.setCompanyDropdown('Phylum', 'knowledge');
            await statusConfigPo.clickEditLifeCycleLink();
            await statusConfigPo.clickEditStatus("Custom");
            expect(await statusConfigPo.isDeleteButtonDisplayed()).toBeTruthy();
            await statusConfigPo.clickOnDeleteButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
        });

        it('[4608]:Delete non mandatory and custom status', async () => {
            await apiHelper.apiLogin('mcarney');
            knowldgeId = await apiHelper.createKnowledgeArticle(articleData2);
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.searchAndOpenHyperlink(knowldgeId.displayId);
        });
    });
});