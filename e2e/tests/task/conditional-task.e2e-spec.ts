import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import viewCaseTemplatePage from '../../pageobject/settings/case-management/view-casetemplate.po';
import processEditorPage from '../../pageobject/ticketing/process-editor.po';
import editCaseTemplatePage from '../../pageobject/settings/case-management/edit-casetemplate.po';
import taskTemplatePreview from '../../pageobject/settings/task-management/preview-task-template.po';
import utilityCommon from '../../utils/utility.common';
import createCasePage from '../../pageobject/case/create-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import previewCaseTemplatePage from '../../pageobject/settings/case-management/preview-case-template.po';
import quickCasePage from '../../pageobject/case/quick-case.po';
import createCaseTemplatePage from '../../pageobject/settings/case-management/create-casetemplate.po';
import previewTaskTemplatePo from '../../pageobject/settings/task-management/preview-task-template.po';
import taskTemplateConsolePage from '../../pageobject/settings/task-management/console-tasktemplate.po';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentPo from "../../pageobject/common/change-assignment.po";

describe('Conditional Task', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    describe('[4540]: [Task] - Template preview from Template selection blade', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let inactiveCaseTemplatePetramcoData, manualTaskTemplateData, externalTaskTemplateData, automatedTaskTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            inactiveCaseTemplatePetramcoData = {
                "templateName": randomStr + 'DRDMV14901CaseTemplate',
                "templateSummary": randomStr + 'DRDMV14901CaseTemplate',
                "templateStatus": "Inactive",
                "casePriority": "Low",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(inactiveCaseTemplatePetramcoData);

            manualTaskTemplateData = {
                "templateName": `${randomStr}DRDMV14901 Manual`,
                "templateSummary": `${randomStr}DRDMV14901 Manual`,
                "templateStatus": "Active",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "description": randomStr
            }
            let manualTasktemplateResponse = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(manualTasktemplateResponse.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');

            externalTaskTemplateData = {
                "templateName": `${randomStr}DRDMV14901 External`,
                "templateSummary": `${randomStr}DRDMV14901 External`,
                "templateStatus": "Active",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "description": randomStr
            }
            let externalTasktemplateResponse = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(externalTasktemplateResponse.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');

            automatedTaskTemplateData = {
                "templateName": `${randomStr}DRDMV14901 Automated`,
                "templateSummary": `${randomStr}RDMV14901 Automated`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "description": randomStr
            }
            let automatedTasktemplateResponse = await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
            await apiHelper.createDynamicDataOnTemplate(automatedTasktemplateResponse.id, 'TASK_TEMPLATE__DYNAMIC_FIELDS');
        });

        it('[4540]: [Task] - Template preview from Template selection blade', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(inactiveCaseTemplatePetramcoData.templateName);
            await viewCaseTemplatePage.clickTaskFlowBtn();
            await processEditorPage.dragDropCreateTask();
            await processEditorPage.clickSelectTemplateBtn();
            await browser.sleep(2000); //Wait required for Page to Load
            await utilityCommon.closePopUpMessage();

            //Validate all field labels of Manual Task Template
            await processEditorPage.searchAndOpenTaskTemplate(manualTaskTemplateData.templateName, 'da1ffbb0-567a-4199-b94f-413bee7f149b');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskSummary,'Task Summary')).toBeTruthy('Task Summary is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCompany,'Task Company')).toBeTruthy('Task Company is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskPriority,'Task Priority')).toBeTruthy('Task Priority is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier1,'Task Category Tier 1')).toBeTruthy('Task Category Tier 1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier2,'Task Category Tier 2')).toBeTruthy('Task Category Tier 2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier3, 'Task Category Tier 3')).toBeTruthy('Task Category Tier 3 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier4, 'Task Category Tier 4')).toBeTruthy('Task Category Tier 4 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskType,'Task Type')).toBeTruthy('Task Type is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.labelGuid,'Label')).toBeTruthy('Label is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskDescription,'Task Description')).toBeTruthy('Task Description is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'Assignee')).toBeTruthy('Assignee is not getting displayed1');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'Support Company > Support Organization > Support Group')).toBeTruthy('Support Group is not getting displayed1');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp')).toBeTruthy('temp is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp1')).toBeTruthy('temp1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp2')).toBeTruthy('temp2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp3')).toBeTruthy('temp3 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp4')).toBeTruthy('temp4 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp5')).toBeTruthy('temp5 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment1')).toBeTruthy('attachment1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment2')).toBeTruthy('attachment2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment3')).toBeTruthy('attachment3 is not getting displayed');

            //Validate field values of Manual Task Template
            expect(await processEditorPage.getTaskTemplateName()).toBe(manualTaskTemplateData.templateName);
            expect(await processEditorPage.getTaskSummary()).toBe(manualTaskTemplateData.templateSummary);
            expect(await processEditorPage.getTaskCompany()).toBe("Petramco");
            expect(await processEditorPage.getTaskPriority()).toBe('Medium');
            expect(await processEditorPage.getTaskType()).toBe('Manual');
            expect(await processEditorPage.getTaskCategoryTier1()).toBe(manualTaskTemplateData.category1);
            expect(await processEditorPage.getTaskCategoryTier2()).toBe(manualTaskTemplateData.category2);
            expect(await processEditorPage.getTaskCategoryTier3()).toBe(manualTaskTemplateData.category3);
            expect(await processEditorPage.getSupportGroup()).toBe('Petramco > United States Support > US Support 3');
            expect(await processEditorPage.getAssigneeFieldValue()).toBe('Qadim Katawazi');
            await processEditorPage.clickOnBackButton();

            //Validate all field labels of External Task Template
            await processEditorPage.searchAndOpenTaskTemplate(externalTaskTemplateData.templateName);
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskSummary,'Task Summary')).toBeTruthy('Task Summary is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCompany,'Task Company')).toBeTruthy('Task Company is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskPriority,'Task Priority')).toBeTruthy('Task Priority is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier1,'Task Category Tier 1')).toBeTruthy('Task Category Tier 1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier2,'Task Category Tier 2')).toBeTruthy('Task Category Tier 2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier3, 'Task Category Tier 3')).toBeTruthy('Task Category Tier 3 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier4, 'Task Category Tier 4')).toBeTruthy('Task Category Tier 4 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskType,'Task Type')).toBeTruthy('Task Type is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.labelGuid,'Label')).toBeTruthy('Label is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskDescription,'Task Description')).toBeTruthy('Task Description is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'Assignee')).toBeTruthy('Assignee is not getting displayed1');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'Support Company > Support Organization > Support Group')).toBeTruthy('Support Group is not getting displayed1');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp')).toBeTruthy('temp is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp1')).toBeTruthy('temp1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp2')).toBeTruthy('temp2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp3')).toBeTruthy('temp3 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp4')).toBeTruthy('temp4 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp5')).toBeTruthy('temp5 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment1')).toBeTruthy('attachment1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment2')).toBeTruthy('attachment2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment3')).toBeTruthy('attachment3 is not getting displayed');

            //Validate field values of External Task Template
            expect(await processEditorPage.getTaskTemplateName()).toBe(externalTaskTemplateData.templateName);
            expect(await processEditorPage.getTaskSummary()).toBe(externalTaskTemplateData.templateSummary);
            expect(await processEditorPage.getTaskCompany()).toBe("Petramco");
            expect(await processEditorPage.getTaskPriority()).toBe('Medium');
            expect(await processEditorPage.getTaskType()).toBe('External');
            expect(await processEditorPage.getTaskCategoryTier1()).toBe(externalTaskTemplateData.category1);
            expect(await processEditorPage.getTaskCategoryTier2()).toBe(externalTaskTemplateData.category2);
            expect(await processEditorPage.getTaskCategoryTier3()).toBe(externalTaskTemplateData.category3);
            expect(await processEditorPage.getSupportGroup()).toBe('Petramco > United States Support > US Support 3');
            expect(await processEditorPage.getAssigneeFieldValue()).toBe('Qadim Katawazi');
            await processEditorPage.clickOnBackButton();

            //Validate all field labels of Automated Task Template
            await processEditorPage.searchAndOpenTaskTemplate(automatedTaskTemplateData.templateName);
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskSummary,'Task Summary')).toBeTruthy('Task Summary is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCompany,'Task Company')).toBeTruthy('Task Company is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskPriority,'Task Priority')).toBeTruthy('Task Priority is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier1,'Task Category Tier 1')).toBeTruthy('Task Category Tier 1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier2,'Task Category Tier 2')).toBeTruthy('Task Category Tier 2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier3, 'Task Category Tier 3')).toBeTruthy('Task Category Tier 3 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskCategoryTier4, 'Task Category Tier 4')).toBeTruthy('Task Category Tier 4 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskType,'Task Type')).toBeTruthy('Task Type is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.labelGuid,'Label')).toBeTruthy('Label is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.taskDescription,'Task Description')).toBeTruthy('Task Description is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp')).toBeTruthy('temp is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp1')).toBeTruthy('temp1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp2')).toBeTruthy('temp2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp3')).toBeTruthy('temp3 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp4')).toBeTruthy('temp4 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'temp5')).toBeTruthy('temp5 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment1')).toBeTruthy('attachment1 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment2')).toBeTruthy('attachment2 is not getting displayed');
            expect(await processEditorPage.isFieldLabelDisplayed(taskTemplatePreview.selectors.previewBladeGuid,'attachment3')).toBeTruthy('attachment3 is not getting displayed');

            //Validate field values of Automated Task Template
            expect(await processEditorPage.getTaskTemplateName()).toBe(automatedTaskTemplateData.templateName);
            expect(await processEditorPage.getTaskSummary()).toBe(automatedTaskTemplateData.templateSummary);
            expect(await processEditorPage.getTaskCompany()).toBe("Petramco");
            expect(await processEditorPage.getTaskPriority()).toBe('Medium');
            expect(await processEditorPage.getTaskType()).toBe('Automated');
            expect(await processEditorPage.getTaskCategoryTier1()).toBe(automatedTaskTemplateData.category1);
            expect(await processEditorPage.getTaskCategoryTier2()).toBe(automatedTaskTemplateData.category2);
            expect(await processEditorPage.getTaskCategoryTier3()).toBe(manualTaskTemplateData.category3);

        });
        afterAll(async () => {
            await processEditorPage.clickOnBackButton();
            await processEditorPage.clickCancelOnTemplateSelectBlade();
            await processEditorPage.clickGoBackToTemplateBtn();
            await processEditorPage.clickOnWarningOk();
            await viewCaseTemplatePage.clickBackArrowBtn(); 
        });

    });

    //asahitya-check with tushar
    xdescribe('[4539,4538]: [Task] [UI]- Task Flow Process display in Case Template > Task section', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let draftCaseTemplatePetramcoData, manualTaskTemplateData, externalTaskTemplateData, automatedTaskTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            draftCaseTemplatePetramcoData = {
                "templateName": 'caseTemplatePetramcoDraft' + randomStr,
                "templateSummary": 'caseTemplatePetramcoDraft' + randomStr,
                "templateStatus": "Draft",
                "casePriority": "Low",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(draftCaseTemplatePetramcoData);

            manualTaskTemplateData = {
                "templateName": 'Manual task14902' + randomStr,
                "templateSummary": 'Manual task14902' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);

            externalTaskTemplateData = {
                "templateName": 'External task14902' + randomStr,
                "templateSummary": 'External task14902' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);

            automatedTaskTemplateData = {
                "templateName": 'Automated task14902' + randomStr,
                "templateSummary": 'Automated task14902' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedTaskTemplateData);
        });
        it('[4539,4538]: [Task] [UI]- Task Flow Process display in Case Template > Task section', async () => {
            //Validating task flow creation with all type of task templates
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(draftCaseTemplatePetramcoData.templateName);
            expect(await viewCaseTemplatePage.isTaskFlowPresentInTaskSection()).toBeFalsy('Task Flow is present');
            await viewCaseTemplatePage.clickTaskFlowBtn();
            await processEditorPage.addAllTaskTypeFromProcessEditor(manualTaskTemplateData.templateName, externalTaskTemplateData.templateName, automatedTaskTemplateData.templateName);
            expect(await utilityCommon.isPopUpMessagePresent('Process Definition saved successfully.')).toBeTruthy('Popup message is not matching');
            await processEditorPage.clickGoBackToTemplateBtn();
            expect(await viewCaseTemplatePage.getTotalTaskBlocks()).toEqual(5);
            await editCaseTemplatePage.clickOnEditCaseTemplateMetadata();
            await editCaseTemplatePage.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePage.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeFalsy('Task Flow button is enabled');
            let defaultWidth = (await viewCaseTemplatePage.getHeightAndWidth()).width;
            let defaultHeight = (await viewCaseTemplatePage.getHeightAndWidth()).height;
            await viewCaseTemplatePage.zoomOutTaskFlowSection(3);
            expect((await viewCaseTemplatePage.getHeightAndWidth()).height).toBeLessThan(Number(defaultHeight));
            expect((await viewCaseTemplatePage.getHeightAndWidth()).width).toBeLessThan(Number(defaultWidth));
            await viewCaseTemplatePage.zoomInTaskFlowSection(6);
            expect((await viewCaseTemplatePage.getHeightAndWidth()).height).toBeGreaterThan(Number(defaultHeight));
            expect((await viewCaseTemplatePage.getHeightAndWidth()).width).toBeGreaterThan(Number(defaultWidth));
            await editCaseTemplatePage.clickOnEditCaseTemplateMetadata();
            await editCaseTemplatePage.changeTemplateStatusDropdownValue('Inactive');
            await editCaseTemplatePage.clickOnSaveCaseTemplateMetadata();
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeTruthy('Task Flow button is disabled');
            await viewCaseTemplatePage.clickTaskFlowBtn();
            expect(await processEditorPage.isTaskEditorOpened()).toBeTruthy('Task Editor is not opened');
            await processEditorPage.clickGoBackToTemplateBtn();
            await editCaseTemplatePage.clickOnEditCaseTemplateMetadata();
            await editCaseTemplatePage.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePage.clickOnSaveCaseTemplateMetadata();

            //Validate the Case Template Preview from Create Case
            await navigationPage.gotoCreateCase();
            await createCasePage.selectRequester('qfeng');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.clickOnAllTemplateTab();
            await selectCasetemplateBladePo.searchAndOpenCaseTemplate(draftCaseTemplatePetramcoData.templateName);
            expect(await previewCaseTemplatePage.getReadOnlyFieldCount()).toEqual(11); //Detailed Read only fields are verified in 5454 test
            defaultWidth = (await viewCaseTemplatePage.getHeightAndWidth()).width;
            defaultHeight = (await viewCaseTemplatePage.getHeightAndWidth()).height;
            await previewCaseTemplatePage.zoomOutTaskFlowSection(3);
            expect((await viewCaseTemplatePage.getHeightAndWidth()).height).toBeLessThan(Number(defaultHeight));
            expect((await viewCaseTemplatePage.getHeightAndWidth()).width).toBeLessThan(Number(defaultWidth));
            await previewCaseTemplatePage.zoomInTaskFlowSection(6);
            expect((await viewCaseTemplatePage.getHeightAndWidth()).height).toBeGreaterThan(Number(defaultHeight));
            expect((await viewCaseTemplatePage.getHeightAndWidth()).width).toBeGreaterThan(Number(defaultWidth));
            await previewCaseTemplatePage.clickOnBackButton();
            await utilityCommon.closeAllBlades();
        });
        xit('[4539,4538]: [Task] [UI]- Task Flow Process display in Case Template > Task section', async () => {
            //Validate the Case Template Preview from Quick Case
            await navigationPage.gotoQuickCase();
            await quickCasePage.selectRequesterName('qfeng');
            await quickCasePage.selectCaseTemplate(draftCaseTemplatePetramcoData.templateName);
            await quickCasePage.clickOnCaseTemplate(draftCaseTemplatePetramcoData.templateName);
            expect(await previewCaseTemplatePage.getReadOnlyFieldCount()).toEqual(11);
            let defaultWidth = (await viewCaseTemplatePage.getHeightAndWidth()).width;
            let defaultHeight = (await viewCaseTemplatePage.getHeightAndWidth()).height;
            await previewCaseTemplatePage.zoomOutTaskFlowSection(3);
            expect((await viewCaseTemplatePage.getHeightAndWidth()).height).toBeLessThan(Number(defaultHeight));
            expect((await viewCaseTemplatePage.getHeightAndWidth()).width).toBeLessThan(Number(defaultWidth));
            await previewCaseTemplatePage.zoomInTaskFlowSection(6);
            expect((await viewCaseTemplatePage.getHeightAndWidth()).height).toBeGreaterThan(Number(defaultHeight));
            expect((await viewCaseTemplatePage.getHeightAndWidth()).width).toBeGreaterThan(Number(defaultWidth));
            await previewCaseTemplatePage.clickOnBackButton();
            await utilityCommon.closeAllBlades();

            //Making the Case Template Inactive again
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(draftCaseTemplatePetramcoData.templateName);
            await editCaseTemplatePage.clickOnEditCaseTemplateMetadata();
            await editCaseTemplatePage.changeTemplateStatusDropdownValue('Inactive');
            await editCaseTemplatePage.clickOnSaveCaseTemplateMetadata();

            //Validating if Case Manager can access Task Flow link
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(draftCaseTemplatePetramcoData.templateName);
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeFalsy('Task Flow button is enabled for Case Manager'); //Defect
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //asahitya
    describe('[4542]: [Task] - Task Template availability when adding it into Case Template', () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalDraftTask, globalActiveTask, globalInactiveTask, petramcoDraftTask, petramcoActiveTask, petramcoInactiveTask, psilonDraftTask, psilonActiveTask, psilonInactiveTask;
        let globalActiveAutomatedTask, petramcoActiveAutomatedTask, psilonActiveAutomatedTask, globalActiveExternalTask, petramcoActiveExternalTask, psilonActiveExternalTask;
        let globalCaseTemplateData, petramcoCaseTemplateData, psilonCaseTemplateData

        beforeAll(async () => {
            await apiHelper.apiLogin('qheroux');

            //Create Manual Global Draft task
            globalDraftTask = {
                "templateName": `${randomStr}globalDraftTemplate`,
                "templateSummary": `${randomStr}globalDraftTemplate`,
                "templateStatus": "Draft",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createManualTaskTemplate(globalDraftTask);

            //Create Manual Global Active task
            globalActiveTask = {
                "templateName": `${randomStr}globalActiveTemplate`,
                "templateSummary": `${randomStr}globalActiveTemplate`,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createManualTaskTemplate(globalActiveTask);

            //Create Manual Global Inactive task
            globalInactiveTask = {
                "templateName": `${randomStr}globalInactiveTemplate`,
                "templateSummary": `${randomStr}globalInactiveTemplate`,
                "templateStatus": "Inactive",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createManualTaskTemplate(globalInactiveTask);

            //Create Manual Petramco Draft task
            petramcoDraftTask = {
                "templateName": `${randomStr}petramcoDraftTemplate`,
                "templateSummary": `${randomStr}petramcoDraftTemplate`,
                "templateStatus": "Draft",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createManualTaskTemplate(petramcoDraftTask);

            //Create Manual Petramco Active task
            petramcoActiveTask = {
                "templateName": `${randomStr}petramcoActiveTemplate`,
                "templateSummary": `${randomStr}petramcoActiveTemplate`,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createManualTaskTemplate(petramcoActiveTask);

            //Create Manual Petramco Inactive task
            petramcoInactiveTask = {
                "templateName": `${randomStr}petramcoInactiveTemplate`,
                "templateSummary": `${randomStr}petramcoInactiveTemplate`,
                "templateStatus": "Inactive",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createManualTaskTemplate(petramcoInactiveTask);

            //Create Manual Psilon Draft task
            psilonDraftTask = {
                "templateName": `${randomStr}psilonDraftTemplate`,
                "templateSummary": `${randomStr}psilonDraftTemplate`,
                "templateStatus": "Draft",
                "taskCompany": 'Psilon',
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.createManualTaskTemplate(psilonDraftTask);

            //Create Manual Psilon Active task
            psilonActiveTask = {
                "templateName": `${randomStr}psilonActiveTemplate`,
                "templateSummary": `${randomStr}psilonActiveTemplate`,
                "templateStatus": "Active",
                "taskCompany": 'Psilon',
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.createManualTaskTemplate(psilonActiveTask);

            //Create Manual Psilon Inactive task
            psilonInactiveTask = {
                "templateName": `${randomStr}psilonInactiveTemplate`,
                "templateSummary": `${randomStr}psilonInactiveTemplate`,
                "templateStatus": "Inactive",
                "taskCompany": 'Psilon',
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.createManualTaskTemplate(psilonInactiveTask);

            //Create Automated Global Active task
            globalActiveAutomatedTask = {
                "templateName": `${randomStr}globalActiveAutomatedTemplate`,
                "templateSummary": `${randomStr}globalActiveAutomatedTempate`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces1' + randomStr,
                "taskCompany": "- Global -",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createAutomatedTaskTemplate(globalActiveAutomatedTask);

            //Create Automated Petramco Active task
            petramcoActiveAutomatedTask = {
                "templateName": `${randomStr}petramcoActiveAutomatedTemplate`,
                "templateSummary": `${randomStr}petramcoActiveAutomatedTemplate`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces2' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3"
            }
            await apiHelper.createAutomatedTaskTemplate(petramcoActiveAutomatedTask);

            //Create Automated Psilon Active task
            psilonActiveAutomatedTask = {
                "templateName": `${randomStr}psilonActiveAutomatedTemplate`,
                "templateSummary": `${randomStr}psilonActiveAutomatedTemplate`,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces3' + randomStr,
                "taskCompany": "Psilon",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1"
            }
            await apiHelper.createAutomatedTaskTemplate(psilonActiveAutomatedTask);

            //Create External Global Active task
            globalActiveExternalTask = {
                "templateName": `${randomStr}globalActiveExternalTemplate`,
                "templateSummary": `${randomStr}globalActiveExternalTemplate`,
                "templateStatus": "Active",
                "taskCompany": "- Global -",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3"
            }
            await apiHelper.createExternalTaskTemplate(globalActiveExternalTask);

            //Create External Petramco Active task
            petramcoActiveExternalTask = {
                "templateName": `${randomStr}petramcoActiveExternalTemplate`,
                "templateSummary": `${randomStr}petramcoActiveExternalTemplate`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3"
            }
            await apiHelper.createExternalTaskTemplate(petramcoActiveExternalTask);

            //Create External Psilon Active task
            psilonActiveExternalTask = {
                "templateName": `${randomStr}psilonActiveExternalTemplate`,
                "templateSummary": `${randomStr}psilonActiveExternalTemplate`,
                "templateStatus": "Active",
                "taskCompany": "Psilon",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1"
            }
            await apiHelper.createExternalTaskTemplate(psilonActiveExternalTask);

            //Create Global Case Template with Draft status
            globalCaseTemplateData = {
                "templateName": `${randomStr}globalDraftCaseTemplate`,
                "templateSummary": `${randomStr}globalDraftCaseTemplate`,
                "templateStatus": "Draft",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(globalCaseTemplateData);

            //Create Petramco Case Template with Draft status
            petramcoCaseTemplateData = {
                "templateName": `${randomStr}petramcoDraftCaseTemplate`,
                "templateSummary": `${randomStr}petramcoDraftCaseTemplate`,
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(petramcoCaseTemplateData);

            //Create Psilon Case Template with Draft status
            psilonCaseTemplateData = {
                "templateName": `${randomStr}psilonDraftCaseTemplate`,
                "templateSummary": `${randomStr}psilonDraftCaseTemplate`,
                "templateStatus": "Draft",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.createCaseTemplate(psilonCaseTemplateData);
        });

        it('[4542]: [Task] - Task Template availability when adding it into Case Template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);

            //Verify on Global Template
            await utilityGrid.searchAndOpenHyperlink(`${randomStr}globalDraftCaseTemplate`);
            await viewCaseTemplatePage.clickTaskFlowBtn();
            await processEditorPage.dragDropCreateTask();
            await processEditorPage.clickSelectTemplateBtn();
            await browser.sleep(2000); //Wait required for Page to Load
            await utilityCommon.closePopUpMessage();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveAutomatedTemplate`)).toBeTruthy(); //fail
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveAutomatedTemplate`)).toBeTruthy(); //fail
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveAutomatedTemplate`)).toBeTruthy(); //fail
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveExternalTemplate`)).toBeTruthy(); //fail
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveExternalTemplate`)).toBeTruthy(); //fail
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveExternalTemplate`)).toBeTruthy(); //fail
        });

        it('[4542]: [Task] - Task Template availability when adding it into Case Template', async () => {
            await processEditorPage.clickCancelOnTemplateSelectBlade();
            await processEditorPage.clickGoBackToTemplateBtn();
            await processEditorPage.clickOnWarningOk();
            await viewCaseTemplatePage.clickBackArrowBtn();
            //Verify on Petramco Template
            await utilityGrid.searchAndOpenHyperlink(`${randomStr}petramcoDraftCaseTemplate`);
            await viewCaseTemplatePage.clickTaskFlowBtn();
            await processEditorPage.dragDropCreateTask();
            await processEditorPage.clickSelectTemplateBtn();
            await browser.sleep(2000); //Wait required for Page to Load
            await utilityCommon.closePopUpMessage();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveAutomatedTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveAutomatedTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveAutomatedTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveExternalTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveExternalTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveExternalTemplate`)).toBeTruthy();
        });

        it('[4542]: [Task] - Task Template availability when adding it into Case Template', async () => {
            await processEditorPage.clickCancelOnTemplateSelectBlade();
            await processEditorPage.clickGoBackToTemplateBtn();
            await processEditorPage.clickOnWarningOk();
            await viewCaseTemplatePage.clickBackArrowBtn();
            //Verify on Psilon Template
            await utilityGrid.searchAndOpenHyperlink(`${randomStr}psilonDraftCaseTemplate`);
            await viewCaseTemplatePage.clickTaskFlowBtn();
            await processEditorPage.dragDropCreateTask();
            await processEditorPage.clickSelectTemplateBtn();
            await browser.sleep(2000); //Wait required for Page to Load
            await utilityCommon.closePopUpMessage();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonDraftTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonInactiveTemplate`)).toBeFalsy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveAutomatedTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveAutomatedTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveAutomatedTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}globalActiveExternalTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}petramcoActiveExternalTemplate`)).toBeTruthy();
            expect(await processEditorPage.isTemplatePresent(`${randomStr}psilonActiveExternalTemplate`)).toBeTruthy();
        });

        afterAll(async () => {
            await processEditorPage.clickCancelOnTemplateSelectBlade();
            await processEditorPage.clickGoBackToTemplateBtn();
            await processEditorPage.clickOnWarningOk();
            await viewCaseTemplatePage.clickBackArrowBtn();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //asahitya
    describe('[4543]: [Task] - Opened Template process when clicking on Add Task Template from Case Template', () => {
        let globalDraftCaseTemplateData, petramcoDraftCaseTemplateData, petramcoInactiveCaseTemplateData, petramcoActiveCaseTemplateData, psilonDraftCaseTemplateData;
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('qheroux');

            //Create Global Case Template with Draft status
            globalDraftCaseTemplateData = {
                "templateName": 'globalDraftCaseTemplate' + randomStr,
                "templateSummary": 'globalDraftCaseTemplate' + randomStr,
                "templateStatus": "Draft",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(globalDraftCaseTemplateData);

            //Create Petramco Case Template with Draft status
            petramcoDraftCaseTemplateData = {
                "templateName": 'petramcoDraftCaseTemplate' + randomStr,
                "templateSummary": 'petramcoDraftCaseTemplate' + randomStr,
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(petramcoDraftCaseTemplateData);

            //Create Petramco Case Template with Inactive status
            petramcoInactiveCaseTemplateData = {
                "templateName": 'petramcoInactiveCaseTemplate' + randomStr,
                "templateSummary": 'petramcoInactiveCaseTemplate' + randomStr,
                "templateStatus": "Inactive",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(petramcoInactiveCaseTemplateData);

            //Create Petramco Case Template with Active status
            petramcoActiveCaseTemplateData = {
                "templateName": 'petramcoActiveCaseTemplate' + randomStr,
                "templateSummary": 'petramcoActiveCaseTemplate' + randomStr,
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.createCaseTemplate(petramcoActiveCaseTemplateData);

            //Create Psilon Case Template with Draft status
            psilonDraftCaseTemplateData = {
                "templateName": 'psilonDraftCaseTemplate' + randomStr,
                "templateSummary": 'psilonDraftCaseTemplate' + randomStr,
                "templateStatus": "Draft",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.createCaseTemplate(psilonDraftCaseTemplateData);
        });

        it('[4543]: [Task] - Opened Template process when clicking on Add Task Template from Case Template', async () => {
            await navigationPage.signOut();
            await loginPage.login('qheroux');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(globalDraftCaseTemplateData.templateSummary);
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeTruthy();
            await viewCaseTemplatePage.clickBackArrowBtn();

            await utilityGrid.searchAndOpenHyperlink(petramcoDraftCaseTemplateData.templateSummary);
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeTruthy();
            await viewCaseTemplatePage.clickBackArrowBtn();

            await utilityGrid.searchAndOpenHyperlink(petramcoInactiveCaseTemplateData.templateSummary);
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeTruthy();
            await viewCaseTemplatePage.clickBackArrowBtn();

            await utilityGrid.searchAndOpenHyperlink(psilonDraftCaseTemplateData.templateSummary);
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeTruthy();
            await viewCaseTemplatePage.clickBackArrowBtn();

            await utilityGrid.searchAndOpenHyperlink(petramcoActiveCaseTemplateData.templateSummary);
            expect(await viewCaseTemplatePage.isTaskFlowBtnEnabled()).toBeFalsy();
            await viewCaseTemplatePage.clickBackArrowBtn();
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //asahitya-check manually
    xdescribe('[4497]: [Task] Copy Case Template', () => {
        const randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplatePetramcoData, newCaseTemplate, manualTaskTemplateData, externalTaskTemplateData;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplatePetramcoData = {
                "templateName": 'caseTemplateName' + randomStr,
                "templateSummary": 'caseTemplateName' + randomStr,
                "templateStatus": "Draft",
                "category1": 'Applications',
                "category2": 'Help Desk',
                "category3": 'Incident',
                "casePriority": "Low",
                "caseStatus": "New",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3"
            }
            newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplatePetramcoData);
            manualTaskTemplateData = {
                "templateName": 'Manual task15002' + randomStr,
                "templateSummary": 'Manual task15002' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "- Global -",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            externalTaskTemplateData = {
                "templateName": 'External task15002' + randomStr,
                "templateSummary": 'External task15002' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTaskTemplateData);
            await apiHelper.associateCaseTemplateWithTwoTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId, externalTaskTemplate.displayId, "parallel");
        });

        it('[4497]: [Task] Copy Case Template', async () => {
            await navigationPage.signOut();
             await loginPage.login('qheroux');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', BWF_PAGE_TITLES.CASE_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchAndOpenHyperlink(caseTemplatePetramcoData.templateName);
            await editCaseTemplatePage.clickOnCopyCaseTemplate();
            await createCaseTemplatePage.setCompanyName('Psilon');
            await createCaseTemplatePage.setTemplateName('Copied Case template name' + randomStr);

            await createCaseTemplatePage.setOwnerCompanyValue('Psilon');
            await createCaseTemplatePage.setOwnerOrgDropdownValue('Psilon Support Org1');
            await createCaseTemplatePage.setOwnerGroupDropdownValue('Psilon Support Group1');
            await createCaseTemplatePage.clickSaveCaseTemplate();
            await viewCaseTemplatePage.clickOnTaskBox(externalTaskTemplateData.templateName);
            expect(await previewTaskTemplatePo.getTaskCompany()).toBe('Psilon');
            await previewTaskTemplatePo.clickOnBackButton();

            await navigationPage.gotoSettingsPage()
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', BWF_PAGE_TITLES.TASK_MANAGEMENT.TEMPLATES);
            await utilityGrid.searchRecord(externalTaskTemplateData.templateName);
            expect(await taskTemplateConsolePage.isCompanyColumnValueMatches(['Psilon', 'Petramco'])).toBeTruthy('Psilon task template is not copied');
            await utilityGrid.clearSearchBox();
            await utilityGrid.searchRecord(manualTaskTemplateData.templateName);
            expect(await taskTemplateConsolePage.isCompanyColumnValueMatches(['- Global -'])).toBeTruthy('Gloabl task template is copied');
        });
    });
});