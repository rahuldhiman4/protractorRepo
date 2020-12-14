import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import consoleFlowsetConfigPage from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import editFlowsetConfigPo from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import createCaseTemplatePage from '../../pageobject/settings/case-management/create-casetemplate.po';
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCasePage from '../../pageobject/case/create-case.po';
import previewCasePage from '../../pageobject/case/case-preview.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import utilGrid from '../../utils/util.grid';
import {flowsetGlobalFields, flowsetGlobalInActiveFields} from '../../data/ui/flowset/flowset.ui';
import { cloneDeep } from 'lodash';
import { ALL_FIELD } from '../../data/ui/case/casetemplate.data.ui';
import createCasetemplatePo from '../../pageobject/settings/case-management/create-casetemplate.po';
import { AUTO_STATUS_TRANSITION_MANDATORY_FIELDS } from '../../data/ui/case/automated-status-transition.data.ui';
import automatedStatusTransitionConsole from "../../pageobject/settings/case-management/automated-status-transition-console.po";
import automatedStatusTransitionCreatePage from "../../pageobject/settings/case-management/create-automated-status-config.po";
import automatedStatusTransitionEditPage from "../../pageobject/settings/case-management/edit-automated-status-config.po";
import utilCommon from '../../utils/util.common';
import consoleEmailTemplatePo from '../../pageobject/settings/email/console-email-template.po';
import createEmailTemplatePo from '../../pageobject/settings/email/create-email-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';

describe('Create Process in Flowset', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //apurva
    describe('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
        let configName1, randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-17555]: Create record', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteAutomatedCaseStatusTransition();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            //Create first Record
            configName1 = AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.name = 'ConfigName1' + randomStr;
            AUTO_STATUS_TRANSITION_MANDATORY_FIELDS.changeStatusAfter = Math.floor(Math.random() * 180) + 1;
            await automatedStatusTransitionConsole.clickAddAutomatedStatusTransitionBtn();
            await automatedStatusTransitionCreatePage.createAutomatedStatusTransition(AUTO_STATUS_TRANSITION_MANDATORY_FIELDS);
        });
        it('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent(configName1)).toBeTruthy();
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink(configName1);
            await automatedStatusTransitionEditPage.updateConfigurationName('UpdatedConfigName1' + randomStr);
            await automatedStatusTransitionEditPage.saveConfiguration();
            await utilGrid.clearGridSearchBox();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeTruthy();
        });
        it('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeFalsy();
        });
        it('[DRDMV-17555]: Create new automatic case status transition rule for one line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Automated Status Transition', 'Configure Automated Status Transitions - Business Workflows');
            await utilGrid.selectLineOfBusiness("Human Resource");
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeTruthy();
            await utilGrid.selectLineOfBusiness("Facilities");
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent('UpdatedConfigName1' + randomStr)).toBeFalsy();
        });
        afterAll(async () => {
            await utilCommon.closeBladeOnSettings();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //apurva
    describe('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flowsetName1: string, flowsetName2: string, flowsetName3: string;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let processName = `Agent Origin Global ${randomStr}`
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('jbarnes');
            const registerProcessData = {
                applicationServicesLib: 'com.bmc.dsm.case-lib',
                processName: `com.bmc.dsm.case-lib:${processName}`,
                processAliasName: processName,
                company: '- Global -',
                lineOfBusiness: "Facilities",
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            let registeredProcessResponse = await apiHelper.createProcessLibConfig(registerProcessData);

            //Create new flowset
            flowsetName1 = `DRDMV-1357 ${randomStr} Active`;
            let flowsetMandatoryFieldsData1 = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData1.flowsetName = flowsetName1;
            flowsetMandatoryFieldsData1["lineOfBusiness"] = "Facilities";
            let flowsetResponse1 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData1);

            //Create new flowset
            flowsetName2 = `DRDMV-1357 ${randomStr} InActive`;
            let flowsetMandatoryFieldsData2 = cloneDeep(flowsetGlobalInActiveFields);
            flowsetMandatoryFieldsData2.flowsetName = flowsetName2;
            flowsetMandatoryFieldsData2["lineOfBusiness"] = "Facilities";
            let flowsetResponse2 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData2);

            //Create new flowset
            flowsetName3 = `DRDMV-1357 ${randomStr} Draft`;
            let flowsetMandatoryFieldsData3 = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData3.flowsetName = flowsetName3;
            flowsetMandatoryFieldsData3["lineOfBusiness"] = "Facilities";
            let flowsetResponse3 = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData3);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                registeredProcessId: registeredProcessResponse.id,
                status: 'Active',
                flowsetId: flowsetResponse1.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);
        });

        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            await consoleFlowsetConfigPage.searchAndSelectFlowset(flowsetName3);
            await editFlowsetConfigPo.setFlowset("edit Flowset" + randomStr);
            await editFlowsetConfigPo.setDescription("edit description" + randomStr);
            await expect(editFlowsetConfigPo.getStatusvalue()).toBe("Active");
            await editFlowsetConfigPo.selectStatus("Draft");
            await editFlowsetConfigPo.clickSaveBtn();
        });
        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.selectLineOfBusiness('Facilities');
            ALL_FIELD.templateName = ALL_FIELD.templateName + Math.floor(Math.random() * 100000);
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            await createCaseTemplatePage.setTemplateName(ALL_FIELD.templateName);
            await createCaseTemplatePage.setCompanyName(ALL_FIELD.company);
            await createCaseTemplatePage.setCaseSummary(ALL_FIELD.templateSummary);
            await createCaseTemplatePage.setPriorityValue(ALL_FIELD.casePriority);
            await createCaseTemplatePage.setOwnerCompanyValue('Petramco')
            await createCaseTemplatePage.setBusinessUnitDropdownValue('Facilities Support');
            await createCaseTemplatePage.setOwnerGroupDropdownValue('Facilities');
            await createCaseTemplatePage.setTemplateStatusDropdownValue(ALL_FIELD.templateStatus);
            let flowsetValues: string[] = [flowsetName2, flowsetName3];
            expect(await createCasetemplatePo.flowsetOptionsPresent(flowsetValues)).toBeFalsy('Status in dropdown does not match');
            await createCaseTemplatePage.setCompanyName(ALL_FIELD.company);
            await createCaseTemplatePage.setFlowsetValue(flowsetName1);
            await createCaseTemplatePage.clickSaveCaseTemplate();
        });
        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            //Create a case using above casetemplate
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(ALL_FIELD.templateName);
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getFlowsetValue()).toBe(flowsetName1);
        });
        it('[DRDMV-1357]: [Flowsets] Case Template creation with Flowset', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            expect(await utilGrid.isGridRecordPresent(flowsetName1)).toBeFalsy();
            expect(await utilGrid.isGridRecordPresent(flowsetName2)).toBeFalsy();
            expect(await utilGrid.isGridRecordPresent(flowsetName3)).toBeFalsy();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.selectLineOfBusiness('Human Resource');
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            let flowsetValues: string[] = [flowsetName1,flowsetName2,flowsetName3];
            expect(await createCasetemplatePo.flowsetOptionsPresent(flowsetValues)).toBeFalsy('Status in dropdown does not match');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
});