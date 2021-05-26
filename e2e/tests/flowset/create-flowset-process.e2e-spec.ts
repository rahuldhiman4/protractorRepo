import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import { flowsetGlobalFields, flowsetMandatoryFields } from '../../data/ui/flowset/flowset.ui';
import previewCasePage from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusBladePo from '../../pageobject/common/update.status.blade.po';
import composeEmailPo from '../../pageobject/email/compose-mail.po';
import consoleCasetemplatePage from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplatePage from '../../pageobject/settings/case-management/create-casetemplate.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import consoleFlowsetConfigPage from '../../pageobject/settings/manage-flowset/console-flowset-config.po';
import createFlowsetPage from '../../pageobject/settings/manage-flowset/create-flowset-config.po';
import editFlowsetConfigPo from '../../pageobject/settings/manage-flowset/edit-flowset-config.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Create Process in Flowset', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[5023]: [Case Creation] Verify able to create case with Global case template having flowset', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let processName = `Agent Origin Global ${randomStr}`
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('fritz');
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
            let flowsetName: string = `5023 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetGlobalFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName;
            flowsetMandatoryFieldsData["lineOfBusiness"] = "Facilities";
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);
            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                processNameFull: registerProcessData.processName,
                processName: processName,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);

            //Create Case Template
            let caseTemplateData = {
                "templateName": '5023 tname' + randomStr,
                "templateSummary": '5023 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "- Global -",
                "lineOfBusiness": "Facilities",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Frieda",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)

            //Create Case using above Case Template
            let caseData = {
                "Requester": "qkatawazi",
                "Summary": "5023 Create Case",
                "Line of Business": "Facilities",
                "Origin": "Agent",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
        });

        it('[5023]: [Case Creation] Verify able to create case with Global case template having flowset', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            expect(await viewCasePage.getPriorityValue()).toBe('Low');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Agent Origin Global ${randomStr}`)).toEqual(1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    })

    //asahitya
    describe('[5317]: Initialization process execution for case origin Agent', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let processName = `Agent Origin 5317 ${randomStr}`;
        it('[5317]: Initialization process execution for case origin Agent', async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createProcess(processName, 'AGENT_ORIGIN');

            //Create a Flowset
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', BWF_PAGE_TITLES.MANAGE_FLOWSETS.DEFINE_FLOWSETS);
            await consoleFlowsetConfigPage.clickOnAddFlowset();
            await createFlowsetPage.selectCompany('Petramco');
            await createFlowsetPage.setFlowsetname('Flowset' + randomStr);
            await createFlowsetPage.setDescription("description" + randomStr);
            await createFlowsetPage.selectStatus("Active");
            await createFlowsetPage.clickSaveButton();
            await editFlowsetConfigPo.clickOnAddNewMappingBtn();
            await editFlowsetConfigPo.selectProcess(processName);
            await editFlowsetConfigPo.selectFunction('Initialization');
            await editFlowsetConfigPo.selectProcessStatus('Active');
            await editFlowsetConfigPo.clickSaveBtnOnProcessMapping();
            await utilityCommon.closeAllBlades();
        });
        it('[5317]: Initialization process execution for case origin Agent', async () => {
            //Create a Case Template
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await consoleCasetemplatePage.clickOnCreateCaseTemplateButton();
            await createCaseTemplatePage.setTemplateName('5317 Tname ' + randomStr);
            await createCaseTemplatePage.setCompanyName('Petramco');
            await createCaseTemplatePage.setCaseSummary(`Summary ${randomStr}`);
            await createCaseTemplatePage.setFlowsetValue('Flowset' + randomStr);
            await createCaseTemplatePage.setOwnerCompanyValue('Petramco');
            await createCaseTemplatePage.setOwnerOrgDropdownValue('United States Support');
            await createCaseTemplatePage.setOwnerGroupDropdownValue('US Support 1');
            await createCaseTemplatePage.setTemplateStatusDropdownValue('Active');
            await createCaseTemplatePage.setPriorityValue('High');
            await createCaseTemplatePage.clickSaveCaseTemplate();
            await viewCasetemplatePo.clickBackArrowBtn();
            //Create a case using above flowset
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('fritz');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate('5317 Tname ' + randomStr);
            await createCasePage.clickSaveCaseButton();
            await previewCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getPriorityValue()).toBe('Low');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', processName)).toEqual(1);
        });
    });

    //asahitya
    describe('[5295]: Initialization process execution for case origin Email', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;

        beforeAll(async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            let processName = `Email Origin ${randomStr}`
            await apiHelper.createProcess(processName, 'EMAIL_ORIGIN');

            //Register the Process
            await apiHelper.apiLogin('qkatawazi');
            const registerProcessData = {
                applicationServicesLib: 'com.bmc.dsm.case-lib',
                processName: 'com.bmc.dsm.case-lib:' + processName,
                processAliasName: processName,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            await apiHelper.createProcessLibConfig(registerProcessData);

            //Create new flowset
            let flowsetName: string = `5295 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName;
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                function: 'Initialization',
                processNameFull: registerProcessData.processName,
                processName: processName,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);

            //Create Case Template
            let caseTemplateData = {
                "templateName": '5295 tname' + randomStr,
                "templateSummary": '5295 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)

            //Create Case using above Case Template
            let caseData = {
                "Requester": "fritz",
                "Summary": "5295 Create Case",
                "Origin": "Email",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
        });

        it('[5295]: Initialization process execution for case origin Agent', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            expect(await viewCasePage.getPriorityValue()).toBe('Critical');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Email Origin ${randomStr}`)).toEqual(1);
        });
    });

    describe('[5294,5325,5321]: User Activity Feeds process execution for post created by email', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;
        let processName = undefined;
        beforeAll(async () => {
            //Create a Process
            await apiHelper.apiLogin('tadmin');
            processName = `Activity Feed Email ${randomStr}`
            await apiHelper.createProcess(processName, 'SOCIAL_ACTIVITY_FEED');

            //Create new flowset
            let flowsetName: string = `5294 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName;
            await apiHelper.apiLogin('qkatawazi');
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            //Map Process to Flowset
            let flowsetProcessMappingData = {
                flowsetId: flowsetResponse.id,
                processName: processName,
                processNameFull: 'com.bmc.dsm.social-lib:' + processName,
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData);

            //Create Case Template
            let caseTemplateData = {
                "templateName": '5294 tname' + randomStr,
                "templateSummary": '5294 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)
            await apiHelper.apiLogin('qfeng');

            //Create Case using above Case Template
            let caseData = {
                "Requester": "qtao",
                "Summary": "5294 Create Case",
                "Origin": "Email",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createEmailBox('outgoing');
        });
        it('[5294,5325,5321]: User Activity Feeds process execution for post created by email', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await viewCasePage.clickOnRequestersEmail();
            await composeEmailPo.setEmailBody('Text added for 5294');
            await composeEmailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
            await activityTabPage.clickOnRefreshButton();
            await activityTabPage.clickOnShowMore();
            expect(await activityTabPage.getRecipientInTo()).toContain('To: Qianru Tao');
            expect(await activityTabPage.getEmailSubject()).toContain(caseResponse.displayId + ':5294 Create Case');
            expect(await activityTabPage.getEmailBody()).toContain('Text added for 5294');
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', processName)).toEqual(1);
            await activityTabPage.addActivityNote("hello");
            await activityTabPage.clickOnPostButton();
            await browser.sleep(1000); //hardwait to complete process execution
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', processName)).toEqual(1);
            await statusBladePo.changeStatus('In Progress');
            await statusBladePo.clickSaveStatus('In Progress');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', processName)).toEqual(2);
        });
    });

    describe('[5324]: Flowset with multiple process mapping with different functions', () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseResponse = undefined;
        let processName1, processName2;
        beforeAll(async () => {
            //Create Process1
            await apiHelper.apiLogin('tadmin');
            processName1 = `Activity Feed Email 5324 ${randomStr}`
            await apiHelper.createProcess(processName1, 'SOCIAL_ACTIVITY_FEED');

            //Create Process2
            processName2 = `Email Origin 5324 ${randomStr}`
            await apiHelper.createProcess(processName2, 'EMAIL_ORIGIN');

            //Register the Process1
            await apiHelper.apiLogin('qkatawazi');
            const registerProcessData1 = {
                applicationServicesLib: "com.bmc.dsm.social-lib",
                processName: 'com.bmc.dsm.social-lib:' + processName1,
                processAliasName: processName1,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            await apiHelper.createProcessLibConfig(registerProcessData1);

            //Register the Process2
            const registerProcessData2 = {
                applicationServicesLib: "com.bmc.dsm.case-lib",
                processName: 'com.bmc.dsm.case-lib:' + processName2,
                processAliasName: processName2,
                company: 'Petramco',
                description: 'Desc ' + randomStr,
                status: 'Active'
            }
            await apiHelper.createProcessLibConfig(registerProcessData2);

            //Create new flowset
            let flowsetName: string = `5324 ${randomStr}`;
            let flowsetMandatoryFieldsData = cloneDeep(flowsetMandatoryFields);
            flowsetMandatoryFieldsData.flowsetName = flowsetName
            let flowsetResponse = await apiHelper.createNewFlowset(flowsetMandatoryFieldsData);

            //Map Process1 to Flowset
            let flowsetProcessMappingData1 = {
                function: 'User Activity Feeds',
                processNameFull: registerProcessData1.processName,
                processName: processName1,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData1);

            //Map Process2 to Flowset
            let flowsetProcessMappingData2 = {
                function: 'Initialization',
                processNameFull: registerProcessData2.processName,
                processName: processName2,
                status: 'Active',
                flowsetId: flowsetResponse.id,
                company: 'Petramco'
            }
            await apiHelper.mapProcessToFlowset(flowsetProcessMappingData2);

            //Create Case Template
            let caseTemplateData = {
                "templateName": '5324 tname' + randomStr,
                "templateSummary": '5324 Summary' + randomStr,
                "casePriority": "Medium",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qfeng",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "flowset": flowsetResponse.id
            }
            let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData)
            await apiHelper.apiLogin('qfeng');

            //Create Case using above Case Template
            let caseData = {
                "Requester": "qtao",
                "Summary": "5324 Create Case",
                "Origin": "Email",
                "Case Template ID": caseTemplateResponse.displayId
            }
            caseResponse = await apiHelper.createCase(caseData);
        });
        it('[5324]: Flowset with multiple process mapping with different functions', async () => {
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Email Origin 5324 ${randomStr}`)).toEqual(1);
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', `Activity Feed Email 5324 ${randomStr}`)).toEqual(0);
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseResponse.displayId);
            await activityTabPage.addActivityNote("hello");
            await activityTabPage.clickOnPostButton();
            await browser.sleep(1000); //hardwait to complete process execution
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.case-lib', `Email Origin 5324 ${randomStr}`)).toEqual(1);
            expect(await apiCoreUtil.getProcessRunCount('com.bmc.dsm.social-lib', `Activity Feed Email 5324 ${randomStr}`)).toEqual(1);
        });
    });
});