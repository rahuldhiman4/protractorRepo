import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePage from '../../pageobject/case/case-console.po';
import createCasePage from "../../pageobject/case/create-case.po";
import editCasePage from '../../pageobject/case/edit-case.po';
import { default as selectCaseTemplate, default as selectCaseTemplateBlade } from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from "../../pageobject/case/view-case.po";
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import KnowledgeConsolePage from "../../pageobject/knowledge/knowledge-articles-console.po";
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import createMenuItems from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import editMenuItemsConfigPo from '../../pageobject/settings/application-config/edit-menu-items-config.po';
import menuItemConsole from '../../pageobject/settings/application-config/menu-items-config-console.po';
import addReadAccess from '../../pageobject/settings/case-management/add-read-access-configuration.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import createCaseTemplate from '../../pageobject/settings/case-management/create-casetemplate.po';
import editCaseTemplate from '../../pageobject/settings/case-management/edit-casetemplate.po';
import caseTemplatePreview from '../../pageobject/settings/case-management/preview-case-template-cases.po';
import consoleReadAcess from '../../pageobject/settings/case-management/read-access-console.po';
import viewCaseTemplate from '../../pageobject/settings/case-management/view-casetemplate.po';
import selectTaskTemplate from "../../pageobject/settings/task-management/console-tasktemplate.po";
import createTaskTemplate from '../../pageobject/settings/task-management/create-tasktemplate.po';
import taskTemplatePreview from '../../pageobject/settings/task-management/preview-task-template-cases.po';
import taskConsolepage from "../../pageobject/task/console-task.po";
import manageTask from "../../pageobject/task/manage-task-blade.po";
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import viewTasktemplatePage from '../../pageobject/settings/task-management/view-tasktemplate.po';

describe("Create Case", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester = "Requester";
    const contact = "Contact";

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    //kgaikwad
    it('[DRDMV-15253]: Verify Category Tier 4 Can be Populated After Tier 3 selection', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao')
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('set summary');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.selectCategoryTier2('Social');
            await createCasePage.selectCategoryTier3('Chatter');
            await createCasePage.selectCategoryTier4('Failure');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    })

    //kgaikwad
    it('[DRDMV-17653]: Check Resolution Code and Resolution Description fields added on Case View and Status Change blade', async () => {
        try {
            let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            //await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(randVal);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItems.clickOnSaveButton();
            //await utilCommon.waitUntilPopUpDisappear();
            await utilGrid.searchRecord(randVal);
            await navigationPage.gotoCaseConsole();
            let caseData = {
                "Requester": "Fritz",
                "Summary": "Test case for DRDMV-2530",
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData);
            let caseId: string = newCase1.displayId;
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await caseConsolePage.searchAndOpenCase(caseId);
            expect(await $(viewCasePage.selectors.resolutionCodeText).isDisplayed()).toBeTruthy('Missing Resolution Text');
            expect(await $(viewCasePage.selectors.resolutionDescriptionText).isDisplayed()).toBeTruthy('Missing Resolution Description Text');
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateResolutionCode(randVal);
            await editCasePage.updateResolutionDescription(randVal);
            await editCasePage.clickSaveCase();
            //await utilCommon.waitUntilSpinnerToHide();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(randVal);
            expect(await viewCasePage.getResolutionDescription()).toBe(randVal);
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Customer Follow-Up Required');
            await viewCasePage.selectResolutionCodeDropDown(randVal);
            expect(await viewCasePage.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
            await viewCasePage.clickSaveStatus();
            //await utilCommon.waitUntilPopUpDisappear();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.selectResolutionCodeDropDown(randVal);
            expect(await viewCasePage.isResolutionDescriptionTextBoxEmpty()).toBeFalsy('Resolution Description Text Box is not empty');
            await viewCasePage.clickSaveStatus();
            //await utilCommon.waitUntilPopUpDisappear();
            expect(await viewCasePage.getTextOfStatus()).toBe('Closed');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 150 * 1000);

    //kgaikwad
    it('[DRDMV-18031]: [UI]Resolution Code can be view on Case with respect to input in field "Available on UI"', async () => {
        try {
            let randVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItems.clickOnMenuOptionLink();
            await createMenuItems.selectMenuNameDropDown('Resolution Code');
            await createMenuItems.clickOnLocalizeLink();
            //await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(randVal);
            await localizeValuePopPo.clickOnSaveButton();
            //await utilCommon.waitUntilSpinnerToHide();
            await createMenuItems.selectStatusDropDown('Active');
            await createMenuItems.selectAvailableOnUiToggleButton(true);
            await createMenuItems.clickOnSaveButton();
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.gotoCaseConsole();
            let caseData1 =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-2530",
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase1 = await apiHelper.createCase(caseData1);
            let caseId1: string = newCase1.displayId;
            await caseConsolePage.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            await editCasePage.updateResolutionCode(randVal);
            await editCasePage.clickSaveCase();
            //await utilCommon.waitUntilSpinnerToHide();

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            //await utilCommon.waitUntilSpinnerToHide();
            await menuItemConsole.searchAndEditMenuOption(randVal);
            await editMenuItemsConfigPo.selectAvailableOnUIToggleButton(false);
            await editMenuItemsConfigPo.clickOnSaveButton();
            //await utilCommon.waitUntilPopUpDisappear();

            await navigationPage.gotoCaseConsole();
            let caseData2 =
            {
                "Requester": "qtao",
                "Summary": "Test case for DRDMV-2530",
                "Support Group": "Compensation and Benefits",
                "Assignee": "qkatawazi"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase2 = await apiHelper.createCase(caseData2);
            let caseId2: string = newCase2.displayId;
            await caseConsolePage.searchAndOpenCase(caseId2);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isValuePresentInResolutionCode(randVal)).toBeFalsy('RandomCode is missing');
            await editCasePage.clickOnCancelCaseButton();
            await utilCommon.clickOnWarningOk();
            //await utilCommon.waitUntilSpinnerToHide();
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.searchAndOpenCase(caseId1);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isValuePresentInResolutionCode(randVal)).toBeFalsy('RandomCode is missing');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-16081]: Verify allow case reopen tag in case template', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplate1 = 'Case Template 1' + randomStr;
            let caseTemplate2 = 'Case Template 2' + randomStr;

            let caseTemplateSummary1 = 'Summary 1' + randomStr;
            let caseTemplateSummary2 = 'Summary 2' + randomStr;

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');

            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //case template without reopen case
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.clickOnChangeAssignmentButton();
            await changeAssignmentPage.setAssignee('Petramco', 'Compensation and Benefits', 'Qianru Tao');
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //create case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();

            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.clickOnReopenCaseLink();

            //add second case template
            await viewCasePage.clickEditCaseButton();
            await editCasePage.clickOnChangeCaseTemplate();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await editCasePage.clickSaveCase();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 210 * 1000);

    //ankagraw
    it('[DRDMV-1191,DRDMV-1198]: [Case Creation] Case creation with/without mandatory fields populated ', async () => {
        let prioirtyValue: string[] = ["Critical", "High", "Medium", "Low"];
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseSummary = 'Case Summary ' + randomStr;

        await navigationPage.gotCreateCase();
        expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
        await createCasePage.selectRequester('adam');
        expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy();
        //expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.'); Save button wont enable unless summary is set
        //await utilCommon.closePopUpMessage();
        //await utilCommon.waitUntilPopUpDisappear();
        await createCasePage.setSummary(caseSummary);
        expect(await createCasePage.allPriorityOptionsPresent(prioirtyValue)).toBeTruthy('Priority is not present');
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        expect(await viewCasePage.getPriorityValue()).toBe('Medium');
        await navigationPage.gotoCaseConsole();
        await caseConsolePage.setCaseSearchBoxValue(caseSummary);
        expect(await caseConsolePage.isCaseIdHyperlinked()).toBeTruthy('Unable to find the created case');
    });

    //ankagraw
    it('[DRDMV-1193,DRDMV-1190]: [Case Creation] Case Create view (UI verification) ', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = 'Summary ' + randomStr;

            await navigationPage.gotCreateCase();
            expect(await createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("required text present in Request");
            expect(await createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("required text present in Summary");
            expect(await createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("required text present in Priority");
            expect(await createCasePage.isCompanyRequiredTextPresent()).toBeTruthy("required text present in Assigned Company");
            expect(await createCasePage.isSelectCaseTemplateButtonEnabled()).toBeFalsy("Select Case template is Disabled");
            expect(await createCasePage.isClearTemplateButtonEnabled()).toBeFalsy("Clear Template is Disabled");
            expect(await createCasePage.isAutocategorizationEnabled()).toBeFalsy("Autocategorization is Disabled");
            expect(await createCasePage.isAssignedCompanyReadOnly()).toBeTruthy("Assigned Company read only");
            expect(await createCasePage.isBuisnessUnitReadOnly()).toBeTruthy("BuisnessUnit read only");
            expect(await createCasePage.isDepartmentReadOnly()).toBeTruthy("Department read only");
            expect(await createCasePage.isAssignedGroupReadOnly()).toBeTruthy("Assigned group read only");
            expect(await createCasePage.isAssigneeReadOnly()).toBeTruthy("Assignee read only");
            expect(await createCasePage.isAttachmentButtonDisplayed()).toBeTruthy("Attachment button not displayed");
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enables")
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseSummary);
            await createCasePage.setDescription('Description');
            await createCasePage.setContactName('kye');
            await createCasePage.selectSite('Pune');
            await createCasePage.selectCategoryTier1('Applications');
            await createCasePage.selectCategoryTier2('Social');
            await createCasePage.selectCategoryTier3('Chatter');
            await createCasePage.addDescriptionAttachment('../../data/ui/attachment/demo.txt');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getCaseSummary()).toBe(caseSummary);
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Applications');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Social');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Chatter');
            await navigationPage.gotoCaseConsole();
            await caseConsolePage.setCaseSearchBoxValue(caseSummary);
            expect(await caseConsolePage.isCaseIdHyperlinked()).toBeTruthy('Unable to find the created case');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 100 * 1000);

    //ankagraw
    it('[DRDMV-11856]: [Case Creation] create case with Global case template without flowset ', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplateSummary1 = 'Summary' + randomStr;

        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');

            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Global');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary(caseTemplate1);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await expect(viewCasePage.getCaseSummary()).toBe(caseTemplate1);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ankagraw
    it('[DRDMV-16076]: Reopen configurations available on Case Template Create screen ', async () => {

        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;
        let caseTemplate2 = 'Case Template 2' + randomStr;

        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let caseTemplateSummary2 = 'Summary 2' + randomStr;

        try {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');

            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //case template with reopen case
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows')).toEqual('Case Templates - Business Workflows');
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate2);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary2);
            await createCaseTemplate.setAllowCaseReopenValue('No');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();

            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeTruthy();

            //add second case template
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary 2');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate2);
            await createCasePage.clickAssignToMeButton();

            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            await expect(viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 240 * 1000);

    //ankagraw
    it('[DRDMV-1237]: [Global navigation] Navigation to Workspaces and Create subitems in the Shell ', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await navigationPage.gotoTaskConsole();
            await expect((await taskConsolepage.getTaskTitle()).trim()).toBe('Tasks', "task title is not displayed in task Console Page");
            await navigationPage.gotoCaseConsole();
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await navigationPage.gotoKnowledgeConsole();
            await expect((await KnowledgeConsolePage.getKnowledgeArticleTitle()).trim()).toBe('Knowledge Articles', "Knowledge title is not displayed in Knowledge Console Page");
            await navigationPage.gotCreateCase();
            await expect((await createCasePage.getCreateCaseTitle()).trim()).toBe('Create Case', "Create Case title is not displayed in Create Case Page");
            await navigationPage.gotoCreateKnowledge();
            await expect((await createKnowledgePage.getCreateKnowledgeTitle()).trim()).toBe('Create Knowledge', "Create Knowledge title is not displayed in Create knowledge Page");
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //ankagraw
    it('[DRDMV-7027]: [Permissions] [Global navigation] Access to the shell menu items for different roles', async () => {
        await navigationPage.gotoCaseConsole();
        await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
        await expect(navigationPage.isCaseConsoleDisplayed()).toBeTruthy("Case Console is not displayed ");
        await expect(navigationPage.isTaskConsoleDisplayed()).toBeTruthy("task Console is not displayed ");
        await expect(navigationPage.isKnowledgeConsoleDisplayed()).toBeTruthy("Knowledge Console is not displayed ");
        await expect(navigationPage.isCreateCaseDisplayed()).toBeTruthy("Create Case is not displayed ");
        await expect(navigationPage.isCreateKnowledge()).toBeTruthy("Create knowledge is not displayed ");
        await expect(navigationPage.isHelpIconDisplayed()).toBeTruthy('Help Icon is not Displayed');
        await expect(navigationPage.isQuickCaseDisplayed()).toBeTruthy('Quick case is not displayed');
//        browser.sleep(3000);
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await expect(navigationPage.isCaseConsoleDisplayed()).toBeTruthy("Case Console is not displayed ");
            await expect(navigationPage.isTaskConsoleDisplayed()).toBeTruthy("task Console is not displayed ");
            await expect(navigationPage.isKnowledgeConsoleDisplayed()).toBeTruthy("Knowledge Console is not displayed ");
            await expect(navigationPage.isCreateCaseDisplayed()).toBeTruthy("Create Case is not displayed ");
            await expect(navigationPage.isCreateKnowledge()).toBeTruthy("Create knowledge is not displayed ");
            await expect(navigationPage.isHelpIconDisplayed()).toBeTruthy('Help Icon is not Displayed');
            await expect(navigationPage.isQuickCaseDisplayed()).toBeTruthy('Quick case is not displayed');
            // await navigationPage.gotoSettingsPage();

            await navigationPage.signOut();
            await loginPage.login('qdu');
            await expect((await caseConsolePage.getCaseTitle()).trim()).toBe('Cases', "Case title is not displayed in Case Console Page");
            await expect(navigationPage.isCaseConsoleDisplayed()).toBeTruthy("Case Console is not displayed ");
            await expect(navigationPage.isTaskConsoleDisplayed()).toBeTruthy("task Console is not displayed ");
            await expect(navigationPage.isKnowledgeConsoleDisplayed()).toBeTruthy("Knowledge Console is not displayed ");
            await expect(navigationPage.isCreateCaseDisplayed()).toBeTruthy("Create Case is not displayed ");
            await expect(navigationPage.isCreateKnowledge()).toBeTruthy("Create knowledge is not displayed ");
            await expect(navigationPage.isHelpIconDisplayed()).toBeTruthy('Help Icon is not Displayed');
            await expect(navigationPage.isQuickCaseDisplayed()).toBeTruthy('Quick case is not displayed');
            //await navigationPage.gotoSettingsPage();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 150 * 1000);

    //ankagraw
    it('[DRDMV-8868]: [Case Creation] [Template Selection] Case/Task Template preview from Case creation', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": `manualTaskTemplateActive ${randomStr}`,
            "templateSummary": `manualTaskTemplateActive ${randomStr}`,
            "templateStatus": "Active",
        }
        await apiHelper.apiLogin('qkatawazi');

        let caseTemplateData = {
            "templateName": `Case template ${randomStr}`,
            "templateStatus": "Active",
            "templateSummary": `Summary ${randomStr}`,
        }

        let newTaskTemplate = await apiHelper.createManualTaskTemplate(templateData);
        let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
        console.log("active case Template is created===", newCaseTemplate.id, newTaskTemplate.id);
        try {
            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary' + randomStr);
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.searchAndOpenCaseTemplate(caseTemplateData.templateName);
            expect(await caseTemplatePreview.isCaseSummaryHeaderDisplayed()).toBeTruthy();
            expect(await caseTemplatePreview.isCaseCompanyTitleDisplayed('Case Company')).toBeTruthy();
            expect(await caseTemplatePreview.isCaseStatusTitleDisplayed('Case Status')).toBeTruthy();
            expect(await caseTemplatePreview.isCasePriorityTitleDisplayed('Case Priority')).toBeTruthy();
            expect(await caseTemplatePreview.isCaseCategoryTier1TitleDisplayed('Case Category Tier 1')).toBeTruthy();
            expect(await caseTemplatePreview.isCaseCategoryTier2TitleDisplayed('Case Category Tier 2')).toBeTruthy();
            expect(await caseTemplatePreview.isCaseCategoryTier3TitleDisplayed('Case Category Tier 3')).toBeTruthy();
            expect(await caseTemplatePreview.isCaseCategoryTier4TitleDisplayed('Case Category Tier 4')).toBeTruthy();
            expect(await caseTemplatePreview.isFlowsetTitleDisplayed('Flowset')).toBeTruthy();
            expect(await caseTemplatePreview.isLabelTitleDisplayed('Label')).toBeTruthy();
            expect(await caseTemplatePreview.isCaseDescriptionTitleDisplayed('Case Description')).toBeTruthy();
            expect(await caseTemplatePreview.isSupportCompanyTitleDisplayed('Support Company')).toBeTruthy();
            expect(await caseTemplatePreview.isSupportGroupTitleDisplayed('Support Group')).toBeTruthy();
            expect(await caseTemplatePreview.isAssigneeTitleDisplayed()).toBeTruthy();
            expect(await caseTemplatePreview.getCaseTemplateName()).toBe(caseTemplateData.templateName);
            expect(await caseTemplatePreview.getCaseSummary()).toBe(caseTemplateData.templateSummary);
            expect(await caseTemplatePreview.getCaseCompanyValue()).toBe('Petramco');
            expect(await caseTemplatePreview.getCasePriority()).toBe('Medium');
            expect(await caseTemplatePreview.getCaseStatus()).toBe('New');
            await caseTemplatePreview.clickOnBackButton();
            await selectCaseTemplateBlade.clickOnCancelButton();

            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddTaskFromTemplateButton();
            await manageTask.searchTaskAndClickOnLink(templateData.templateName);
            expect(await taskTemplatePreview.isTaskSummaryTitleDisplayed()).toBeTruthy();
            expect(await taskTemplatePreview.isTaskCompanyTitleDisplayed('Task Company')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskPriorityTitleDisplayed('Task Priority')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskCategoryTier1TitleDisplayed('Task Category Tier 1')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskCategoryTier2TitleDisplayed('Task Category Tier 2')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskCategoryTier3TitleDisplayed('Task Category Tier 3')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskCategoryTier4TitleDisplayed('Task Category Tier 4')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskTypeTitleDisplayed('Task Type')).toBeTruthy();
            expect(await taskTemplatePreview.isLabelTitleDisplayed('Label')).toBeTruthy();
            expect(await taskTemplatePreview.isTaskDescriptionTitleDisplayed('Task Description')).toBeTruthy();
            expect(await taskTemplatePreview.getTaskTemplateName()).toBe(templateData.templateName);
            expect(await taskTemplatePreview.getTaskSummary()).toBe(templateData.templateSummary);
            expect(await taskTemplatePreview.getTaskCompany()).toBe("Petramco");
            expect(await taskTemplatePreview.getTaskPriority()).toBe('Medium');
            expect(await taskTemplatePreview.getTaskType()).toBe('Manual');
            await taskTemplatePreview.clickOnBackButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 100 * 1000);

    //ankagraw
    it('[DRDMV-12061]: [ Task ] - Verify create case with Global task template having assignment', async () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let globalCategName = 'DemoCateg1';
        let categName2 = 'DemoCateg2';
        let categName3 = 'DemoCateg3';
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createOperationalCategory(globalCategName, true);
        await apiHelper.createOperationalCategory(categName2);
        await apiHelper.createOperationalCategory(categName3);
        await apiHelper.associateCategoryToCategory(globalCategName, categName2);
        await apiHelper.associateCategoryToCategory(categName2, categName3);

        let TaskTemplate = 'Manual task' + randomStr;
        let TaskSummary = 'Summary' + randomStr;

        //manual Task template
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Task Management--Templates', 'Task Templates - Business Workflows');
            await selectTaskTemplate.clickOnManualTaskTemplateButton();
            await createTaskTemplate.setTemplateName(TaskTemplate);
            await createTaskTemplate.setTaskSummary(TaskSummary);
            await createTaskTemplate.setTaskDescription('Description');
            await createTaskTemplate.selectCompanyByName('Global');
            await createTaskTemplate.selectTaskCategoryTier1(globalCategName);
            await createTaskTemplate.selectTaskCategoryTier2(categName2);
            await createTaskTemplate.selectTaskCategoryTier3(categName3);
            await createTaskTemplate.selectTemplateStatus('Active');
            await createTaskTemplate.clickOnSaveTaskTemplate();
            await expect(viewTasktemplatePage.getOwnerCompanyValue()).toBe("Petramco");
            //await utilCommon.waitUntilPopUpDisappear();

            //Create Case
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary1212');
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddTaskFromTemplateButton();
            await manageTask.setTaskSearchBoxValue(TaskSummary);
            await manageTask.clickFirstCheckBoxInTaskTemplateSearchGrid();
            await manageTask.clickOnTaskGridSaveButton();
            await manageTask.clickOnCloseButton();

            await apiHelper.apiLogin('tadmin');
            let userData = {
                "firstName": "Petramco",
                "lastName": "Psilon",
                "userId": "DRDMV-12061",
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Psilon");
            await navigationPage.signOut();
            await loginPage.loginWithCredentials(userData.userId + "@petramco.com", 'Password_1234');
            //Create Case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.clickAddTaskButton();
            await manageTask.clickAddTaskFromTemplateButton();
            await manageTask.setTaskSearchBoxValue(TaskSummary);
            await manageTask.clickFirstCheckBoxInTaskTemplateSearchGrid();
            await manageTask.clickOnTaskGridSaveButton();
            await manageTask.clickOnCloseButton();
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 180 * 1000);

    //ankagraw
    it('[DRDMV-15974]: Verify the status transition Closed->New is available only when Closed case is Reopened', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseTemplate1 = 'Case Template 1' + randomStr;
            let caseTemplateSummary1 = 'Summary 1' + randomStr;

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');

            //case template with reopen case
            await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
            await createCaseTemplate.setTemplateName(caseTemplate1);
            await createCaseTemplate.setCompanyName('Petramco');
            await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
            await createCaseTemplate.setAllowCaseReopenValue('Yes');
            await createCaseTemplate.setTemplateStatusDropdownValue('Active')
            await createCaseTemplate.clickSaveCaseTemplate();

            //add first case 
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary 2');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();

            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Error');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
            await viewCasePage.changeCaseStatus('Canceled');
            await viewCasePage.setStatusReason('Approval Rejected');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();

            //create case
            await navigationPage.gotCreateCase();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            await createCasePage.clickSelectCaseTemplateButton();
            await selectCaseTemplateBlade.selectCaseTemplate(caseTemplate1);
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await viewCasePage.changeCaseStatus('In Progress');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
            await viewCasePage.changeCaseStatus('Pending');
            await viewCasePage.setStatusReason('Error');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
            await viewCasePage.changeCaseStatus('Resolved');
            await viewCasePage.setStatusReason('Auto Resolved');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeFalsy();
            await viewCasePage.changeCaseStatus('Closed');
            await viewCasePage.clickSaveStatus();
            expect(await viewCasePage.isCaseReopenLinkPresent()).toBeTruthy();
            await viewCasePage.clickOnReopenCaseLink();
            expect(await viewCasePage.getTextOfStatus()).toBe('New');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 240 * 1000);

    //ankagraw
    it('[DRDMV-5479,DRDMV-1192]: Verify case assignment on Create Case', async () => {
        try {
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await navigationPage.gotCreateCase();
            expect(await createCasePage.isAssigneToMeEnabled()).toBeFalsy();
            expect(createCasePage.isChangeAssignmentButtonEnabled()).toBeFalsy();
            await createCasePage.selectRequester('adam');
            await createCasePage.setSummary('Summary');
            expect(await createCasePage.getCompany()).toBe('Petramco');
            await createCasePage.clickChangeAssignmentButton();
            expect(await changeAssignmentPage.isAssignToMeCheckBoxSelected()).toBeFalsy();
            expect(await changeAssignmentPage.getCompanyDefaultValue()).toBe('Petramco');
            await changeAssignmentPage.selectSupportGroup('Compensation and Benefits');
            await changeAssignmentPage.selectAssignee('Qadim Katawazi');
            await changeAssignmentPage.clickOnAssignButton();
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentPage.clickOnAssignToMeCheckBox();
            expect(await changeAssignmentPage.getAssigneeName()).toBe('Qianru Tao');
            await changeAssignmentPage.clickOnAssignButton();
            await createCasePage.clickChangeAssignmentButton();
            await changeAssignmentPage.selectSupportGroup('Compensation and Benefits');
            await changeAssignmentPage.selectAssigneeAsSupportGroup('Compensation and Benefits');
            await changeAssignmentPage.clickOnAssignButton();
            await createCasePage.clickAssignToMeButton();
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            expect(await viewCasePage.getAssignedGroupText()).toBe('Compensation and Benefits');
            expect(await viewCasePage.getAssigneeText()).toBe('Qianru Tao');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 90 * 1000);

    //ankagraw
    it('[DRDMV-11818]: [Global Case Template] Create/Update Case template with company and flowset as Global', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplate1 = 'Case Template 1' + randomStr;

        let caseTemplateSummary1 = 'Summary 1' + randomStr;
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetGlobalFields'].flowsetName + randomStr;
        flowsetData['flowsetGlobalFields'].flowsetName = flowsetName;
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNewFlowset(flowsetData['flowsetGlobalFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        await consoleCasetemplatePo.clickOnCreateCaseTemplateButton();
        await createCaseTemplate.setTemplateName(caseTemplate1);
        await createCaseTemplate.setCompanyName('- Global -');
        await createCaseTemplate.setCaseSummary(caseTemplateSummary1);
        await createCaseTemplate.setFlowsetValue(flowsetName);
        await createCaseTemplate.setTemplateStatusDropdownValue('Active')
        await createCaseTemplate.clickSaveCaseTemplate();
        //expect(await utilCommon.isErrorMsgPresent()).toBeTruthy(); //no error message
        //await utilCommon.waitUntilPopUpDisappear();
        expect(await viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
        expect(await viewCaseTemplate.getFlowsetValue()).toBe(flowsetName);
        await viewCaseTemplate.clickOnEditCaseTemplateButton();
        expect(await editCaseTemplate.isCaseCompanyDisabled()).toBeTruthy();

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Read Access', 'Case Read Access Configuration - Business Workflows');
        await consoleReadAcess.clickOnReadAccessConfiguration();
        await addReadAccess.setReadAccessConfigurationName("test");
        await addReadAccess.selectCompany('Global');
        await addReadAccess.selectFlowset(flowsetName);
        await addReadAccess.selectSupportCompany('Petramco');
        await addReadAccess.selectSupportGroup('AU Support 2');
        await addReadAccess.clickOnSave();
        try {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplate1);
            await expect(viewCaseTemplate.getCaseCompanyValue()).toBe('- Global -');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 140 * 1000);

    //ankagraw
    it('[DRDMV-1614]: [Case] Fields validation for case in New status ', async () => {
        try {
            const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseSummary = 'Case Summary ' + randomStr;

            await navigationPage.signOut();
            await loginPage.login("qtao");
            await navigationPage.gotCreateCase();
            expect(await createCasePage.isRequesterRequiredTextPresent()).toBeTruthy("Requester Reqired text not present");
            expect(await createCasePage.isSummaryRequiredTextPresent()).toBeTruthy("Summary Reqired text not present");
            expect(await createCasePage.isSourceRequiredTextPresent()).toBeTruthy("Source Reqired text not present");
            expect(await createCasePage.isPriorityRequiredTextPresent()).toBeTruthy("Priority Reqired text not present");
            expect(await createCasePage.isCompanyRequiredTextPresent()).toBeTruthy("Assigned Company Reqired text not present");
            expect((await createCasePage.getCreateCaseTitle()).trim()).toBe('Create Case', "Create Case title is not displayed in Create Case Page");
            expect(await createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is enabled");
            await createCasePage.selectRequester('adam');
            // await createCasePage.clickSaveCaseButtonWithoutMessageDisappear();
            // expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
            // await utilCommon.closePopUpMessage();
            await expect(createCasePage.isSaveCaseButtonEnabled()).toBeFalsy("Save button is Enabled");
            //await utilCommon.waitUntilPopUpDisappear();
            await createCasePage.setSummary(caseSummary);
            await createCasePage.clickSaveCaseButton();
            await createCasePage.clickGoToCaseButton();
            await expect(await viewCasePage.getCaseStatusValue()).toBe('New');
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePage.isSummaryRequiredText()).toBeTruthy("Summary Required text not present");
            expect(await editCasePage.isPriorityRequiredText()).toBeTruthy("Priority Required text not present");
            expect(await editCasePage.isAssignedCompanyRequiredText()).toBeTruthy("Assigned Company Required text not present");
            expect(await editCasePage.isAssignedGroupRequiredText()).toBeTruthy("Assigned Group Required text not present");
            await editCasePage.clearCaseSummary();
            await editCasePage.clickSaveCase();
            expect(await utilCommon.getPopUpMessage()).toBe('Resolve the field validation errors and then try again.');
        } catch (error) {
            throw error;
        } finally {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        }
    }, 180 * 1000);
});
