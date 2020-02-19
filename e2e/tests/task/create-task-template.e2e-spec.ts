import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import taskTemplate from "../../pageobject/settings/task-management/create-tasktemplate.po";
import editTaskTemplate from "../../pageobject/settings/task-management/edit-tasktemplate.po";
import viewTaskTemplate from "../../pageobject/settings/task-management/view-tasktemplate.po";
import utilCommon from '../../utils/util.common';

describe('Create Case Task', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //ankagraw
    it('[DRDMV-3817,DRDMV-3819]: [Task Template] Task Template Create view (UI verification)', async () => {
        try {
            let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await expect(taskTemplate.isTemplateNameRequiredText()).toBeTruthy("Template Name Required text Not Present");
            await expect(taskTemplate.isTaskSummaryRequiredText()).toBeTruthy("Task Summary Required text Not Present");
            await expect(taskTemplate.isTaskPriorityRequiredText()).toBeTruthy("Task Priority Required text Not Present");
            await expect(taskTemplate.isTemplateStatusRequiredText()).toBeTruthy('Template Status Required text Not Present');
            await expect(taskTemplate.isOwnerComapnyRequiredText()).toBeTruthy('Owner Company Required text Not Present');
            await expect(taskTemplate.isOwnerGroupRequiredText()).toBeTruthy('Owner Group Required text Not Present');
            await expect(taskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy('Task Description not present');
            await expect(taskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy('Task Category Tier 1 not present');
            await expect(taskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy('Task Category Tier 2 not present');
            await expect(taskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy('Task Category Tier 3 not present');
            await expect(taskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy('Task Category Tier 4 not present');
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await expect(viewTaskTemplate.isTaskSummaryTitlePresent('Task Summary')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskTypeTitlePresent('Task Type')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCompanyTitlePresent('Task Company')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier1TitlePresent('Task Category Tier 1')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier2TitlePresent('Task Category Tier 2')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier3TitlePresent('Task Category Tier 3')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskCategoryTier4TitlePresent('Task Category Tier 4')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskLabelTitlePresent('Label')).toBeTruthy();
            await expect(viewTaskTemplate.isTaskDescriptionTitlePresent('Task Description')).toBeTruthy();
            await expect(viewTaskTemplate.isTemplateStatusTitlePresent('Status')).toBeTruthy();
            await expect(viewTaskTemplate.isOwnerCompanyTitlePresent('Owner Company')).toBeTruthy();
            await expect(viewTaskTemplate.isOwnerGroupTitlePresent('Owner Group')).toBeTruthy();
            await expect(viewTaskTemplate.isAssigneeTitlePresent('Assignee')).toBeTruthy();
            await expect(viewTaskTemplate.isSupportGuidTitlePresent('Support Group')).toBeTruthy();
            await expect(viewTaskTemplate.isEditButtonPresent()).toBeTruthy();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    it('[DRDMV-12087]: [Global Task Template] Update Task company to Global', async () => {
        try {
            let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.selectTaskCompany('Global');
            await editTaskTemplate.clickOnSaveButton();
            await expect(viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    it('[DRDMV-12086]: [Global Task Template] Update Task company from Global to Any', async () => {
        try {
            let manualTaskTemplate = 'Manual  task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Global');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();
            await expect(viewTaskTemplate.getTaskCompanyNameValue()).toBe('- Global -');
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.selectTaskCompany('Petramco');
            await editTaskTemplate.clickOnSaveButtonWithoutWait();
            await expect(utilCommon.getPopUpMessage()).toBe('ERROR (222121): Company marked for Global usage cannot be modified.')
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    });

    //ankagraw
    it('[DRDMV-12577]: Case BA other than task template owner group can NOT update the template', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            await expect(viewTaskTemplate.getTemplateName()).toBe(manualTaskTemplate);
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await editTaskTemplate.clickOnEditMetadataLink();
            await expect(editTaskTemplate.isTemplateStatusDisabled()).toBeTruthy("Template status is enabled");
            await editTaskTemplate.clickOnCancelMetadataButton();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-12567]: Case BA from task template owner group can update the template', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let updateSummary = 'update Summary' + Math.floor(Math.random() * 1000000);
            let Description = 'Description' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectTemplateStatus('Active');
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await editTaskTemplate.clickOnEditMetadataLink();
            await editTaskTemplate.selectTemplateStatus("Draft");
            await editTaskTemplate.clickOnSaveMetadata();
            await utilCommon.waitUntilPopUpDisappear();
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.setSummary(updateSummary);
            await editTaskTemplate.setDescription(Description);
            await editTaskTemplate.selectTaskCategoryTier1('Applications');
            await editTaskTemplate.selectTaskCategoryTier2('Social');
            await editTaskTemplate.clickOnSaveButton();

            //verify the updated Field
            await expect(viewTaskTemplate.getSummaryValue()).toBe(updateSummary);
            await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(Description);
            await expect(viewTaskTemplate.getCategoryTier1Value()).toBe("Applications");
            await expect(viewTaskTemplate.getCategoryTier2Value()).toBe("Social");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 150 * 1000);

    //ankagraw
    it('[DRDMV-12555]: Task template submitter from same company of owner group can edit the task template', async () => {
        try {
            let manualTaskTemplate = 'Manual task' + Math.floor(Math.random() * 1000000);
            let manualTaskSummary = 'Summary' + Math.floor(Math.random() * 1000000);
            let updateSummary = 'update Summary' + Math.floor(Math.random() * 1000000);
            let Description = 'Description' + Math.floor(Math.random() * 1000000);

            //Manual task Template
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await taskTemplate.setTemplateName(manualTaskTemplate);
            await taskTemplate.setTaskSummary(manualTaskSummary);
            await taskTemplate.setTaskDescription('Description in manual task');
            await taskTemplate.selectCompanyByName('Petramco');
            await taskTemplate.selectOwnerGroup("Facilities")
            await taskTemplate.clickOnSaveTaskTemplate();
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows'))
                .toEqual('Task Templates - Business Workflows');
            await selectTaskTemplate.searchAndOpenTaskTemplate(manualTaskTemplate);
            await viewTaskTemplate.clickOnEditLink();
            await editTaskTemplate.setSummary(updateSummary);
            await editTaskTemplate.setDescription(Description);
            await editTaskTemplate.selectTaskCategoryTier1('Applications');
            await editTaskTemplate.selectTaskCategoryTier2('Social');
            await editTaskTemplate.clickOnSaveButton();

            //verify the updated Field
            await expect(viewTaskTemplate.getSummaryValue()).toBe(updateSummary);
            await expect(viewTaskTemplate.getTaskDescriptionNameValue()).toBe(Description);
            await expect(viewTaskTemplate.getCategoryTier1Value()).toBe("Applications");
            await expect(viewTaskTemplate.getCategoryTier2Value()).toBe("Social");
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 180 * 1000);

    async function foundationData(company: string) {
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile['BusinessUnitData12111'];
        let departmentData = departmentDataFile['DepartmentData12111'];
        let suppGrpData = supportGrpDataFile['SuppGrpData12111'];
        let personData = personDataFile['PersonData12111'];
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        departmentData.relatedOrgId = businessUnitId;
        let depId = await apiHelper.createDepartment(departmentData);
        suppGrpData.relatedOrgId = depId;
        await apiHelper.createSupportGroup(suppGrpData);
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);
        await apiHelper.associatePersonToCompany(personData.userId, company)
    }


    it('[DRDMV-12111,DRDMV-12110,DRDMV-12109]: Verify Company, Business Unit, Department and Support Group selection hierarchy in Change Owner.', async () => {
        await foundationData("Petramco");
        const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
        const departmentDataFile = require('../../data/ui/foundation/department.ui.json');
        const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
        let randomStr = 'Manual  task' + Math.floor(Math.random() * 1000000);
        let businessData = businessDataFile['BusinessUnitData12111'];
        let departmentData = departmentDataFile['DepartmentData12111'];
        let suppGrpData = supportGrpDataFile['SuppGrpData12111'];

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName("caseTemplateName" + randomStr);
        await createCaseTemplate.setCompanyName("Petramco");
        await createCaseTemplate.setCaseSummary("caseTemplateSummary1" + randomStr);
        await createCaseTemplate.setOwnerCompanyValue("Petramco");
        await createCaseTemplate.setBusinessUnitDropdownValue(businessData.orgName);
        await createCaseTemplate.setDepartmentDropdownValue(departmentData.orgName);
        await createCaseTemplate.setOwnerGroupDropdownValue(suppGrpData.orgName);
        await createCaseTemplate.clickSaveCaseTemplate();
        expect(await viewCaseTemplate.getOwnerCompanyValue()).toBe("Petramco");
        expect(await viewCaseTemplate.getOwnerGroupValue()).toBe(suppGrpData.orgName);
        expect(await viewCaseTemplate.getBuisnessUnitValue()).toBe(businessData.orgName);
        expect(await viewCaseTemplate.getDepartmentValue()).toBe(departmentData.orgName);

        //Manual task Template
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
        await selectTaskTemplate.clickOnManualTaskTemplateButton();
        await taskTemplate.setTemplateName('manualTaskTemplate' + randomStr);
        await taskTemplate.setTaskSummary('manualTaskSummary' + randomStr);
        await taskTemplate.setTaskDescription('Description in manual task');
        await taskTemplate.selectCompanyByName('Petramco');
        await taskTemplate.selectBuisnessUnit(businessData.orgName);
        await taskTemplate.selectDepartment(departmentData.orgName);
        await taskTemplate.selectOwnerGroup(suppGrpData.orgName)
        await taskTemplate.clickOnSaveTaskTemplate();
        await expect(viewTaskTemplate.getOwnerCompanyValue()).toBe('Petramco');
        await expect(viewTaskTemplate.getOwnerGroupValue()).toBe(suppGrpData.orgName);
        await expect(viewTaskTemplate.getBuisnessunitValue()).toBe(businessData.orgName);
        await expect(viewTaskTemplate.getDepartmentValue()).toBe(departmentData.orgName);
    }, 180 * 1000);
});