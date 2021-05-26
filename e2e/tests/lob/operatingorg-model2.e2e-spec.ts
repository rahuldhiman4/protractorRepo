import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import coreApi from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import * as notesTemplateData from '../../data/ui/Social/notesTemplate.api';
import { RESOLUTION_CODE_ACTIVE_ON_UI } from '../../data/ui/ticketing/menu.item.ui';
import previewCasePage from '../../pageobject/case/case-preview.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePage from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
import changeAssignmentBladePo from '../../pageobject/common/change-assignment.po';
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesPo from '../../pageobject/common/resources-tab.po';
import updateStatusBladePo from '../../pageobject/common/update.status.blade.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import selectEmailTemplateBladePo from '../../pageobject/email/select-email-template-blade.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import notesTemplateUsage from '../../pageobject/social/note-template-usage.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import casePreviewPo from '../../pageobject/case/case-preview.po';
let emailTemplateData = require('../../data/ui/email/email.template.api.json');

let supportGroupDataHR, supportGroupDataFacilities, userData0, userData1, userData2, userData3;

xdescribe('Operating Orgnization Data Model Extended Tests', () => {
    let personDataFile = require('../../data/ui/foundation/person.ui.json');
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await createFoundationDataForAssigneeValidations();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function createFoundationDataForAssigneeValidations() {
        await apiHelper.apiLogin('tadmin');
        supportGroupDataHR = {
            "orgName": "Petramco HR",
            "relatedOrgId": null,
            "domainTag": "Human Resource"
        }

        supportGroupDataFacilities = {
            "orgName": "Petramco Facilities",
            "relatedOrgId": null,
            "domainTag": "Facilities"
        }

        userData0 = {
            "firstName": "xod user23625_1",
            "lastName": "test",
            "userId": "user23625_1",
            "userPermission": ["Case Agent", "Human Resource", "Case Business Analyst", "Knowledge Publisher"]
        }

        userData2 = {
            "firstName": "bto user23625_2",
            "lastName": "test",
            "userId": "user23625_2",
            "userPermission": ["Case Agent", "Facilities", "Case Business Analyst", "Knowledge Publisher"]
        }

        await apiHelper.createNewUser(userData0);
        await apiHelper.createNewUser(userData2);
        let orgId = await coreApi.getBusinessUnitGuid('Canada Support');
        supportGroupDataHR.relatedOrgId = orgId;
        supportGroupDataFacilities.relatedOrgId = orgId;
        await apiHelper.createSupportGroup(supportGroupDataHR);
        await apiHelper.createSupportGroup(supportGroupDataFacilities);
        await apiHelper.associatePersonToCompany(userData0.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData0.userId, "US Support 3");
        await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");

        await apiHelper.apiLogin('tadmin');
        userData3 = {
            "firstName": "operating hr tst",
            "lastName": "usr",
            "userId": "oprusr",
            "userPermission": ["Case Agent", "Facilities", "Case Business Analyst", "Knowledge Publisher"]
        }
        await apiHelper.createNewUser(userData3);
        await apiHelper.associatePersonToCompany(userData3.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData3.userId, "Facilities");
    }

    describe('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
        let caseTemplateData, facilitiesTemplateData, caseTemplateDataPsilon, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        let commonNameForOtherLoB = randomStr + "FacilitiesDRDMV23488";
        let facilitiescaseData, facilitiesGlobalTemplateData, facilitiesarticleData;
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            caseTemplateDataPsilon = {
                "templateName": `psilonDraftCaseTemplate${randomStr}`,
                "templateSummary": `psilonDraftCaseTemplate${randomStr}`,
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataPsilon);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval')).toBeTruthy('Status Not Set');
            facilitiesTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + "Facilities1DRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
                "lineOfBusiness": 'Facilities'
            };
            facilitiesGlobalTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + "Facilities2DRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "casePriority": "Low",
                "lineOfBusiness": 'Facilities'
            };
            facilitiescaseData = {
                "Requester": "franz",
                "Summary": commonNameForOtherLoB,
                "Assigned Company": "Petramco",
                "categoryTier1": 'Purchasing Card',
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz",
                "Line of Business": 'Facilities'
            };
            facilitiesarticleData = {
                "knowledgeSet": "Facilities",
                "title": commonNameForOtherLoB,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz",
                "lineOfBusiness": 'Facilities'
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(facilitiesTemplateData);
            await apiHelper.createCaseTemplate(facilitiesGlobalTemplateData);
            await apiHelper.createCase(facilitiescaseData);
            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(facilitiesarticleData);
            let knowledgeArticleGUID1 = knowledgeArticleData1.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'PublishApproval')).toBeTruthy('Status Not Set');
        });
        it('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('PetramcoCaseSummary' + randomStr);
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await browser.sleep(5000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
        });
        it('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'AU Support 1');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
        });
        it('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await apiHelper.apiLogin(userData1.userId + '@petramco.com', 'Password_1234');
            caseTemplateData.templateName = randomStr + "2Case DRDMV23488";
            await apiHelper.createCaseTemplate(caseTemplateData);
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + "2Case DRDMV23488");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('randomStr + "2Case DRDMV23488"');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('Frieda');
            await quickCasePo.setCaseSummary(commonNameForOtherLoB);
            expect(await quickCasePo.selectCaseTemplate(facilitiesGlobalTemplateData.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName)).toBeFalsy('template is present');
            expect(await resourcesPo.isRecommendedKnowledgePresent(facilitiesarticleData.title)).toBeFalsy();
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(facilitiesarticleData.title);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.isRecommendedKnowledgePresent(facilitiesarticleData.title)).toBeFalsy();
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeFalsy('12063Summary' + randomStr);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('gderuno');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateData.templateName)).toBeFalsy('template is present');
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataPsilon.templateName)).toBeFalsy('template is present');
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await casePreviewPo.clickGoToCaseButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(randomStr + "FacilitiesDRDMV23488");
            expect(await quickCasePo.selectCaseTemplate(randomStr + "2Case DRDMV23488")).toBeTruthy('template is present');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB with diff Company', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData1.userId + "@petramco.com", 'Password_1234');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('gderuno');
            await quickCasePo.setCaseSummary('PsilonCaseSummary' + randomStr);
            await quickCasePo.selectCaseTemplate(caseTemplateDataPsilon.templateName);
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await casePreviewPo.clickGoToCaseButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('gderuno');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateData.templateName)).toBeTruthy('template is present');
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataPsilon.templateName)).toBeTruthy('template is present');
            await navigationPage.signOut();
            await loginPage.login('idphylum1@petramco.com', 'Password_1234');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent('PetramcoCaseSummary' + randomStr)).toBeFalsy('PetramcoCaseSummary' + randomStr);
            expect(await utilityGrid.isGridRecordPresent('PsilonCaseSummary' + randomStr)).toBeFalsy('PsilonCaseSummary' + randomStr);
        });
        it('[60204,60214]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has Multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.clearFilter();
            await utilityGrid.selectLineOfBusiness("Human Resource");
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2Case DRDMV23488")).toBeTruthy('12063Summary' + randomStr);
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeFalsy('Field is enabled');
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            await utilityGrid.selectLineOfBusiness("Facilities");
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await utilityGrid.selectLineOfBusiness("Human Resource");
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Employee Relations')).toBeTruthy('Value is present in  Category Tier 1 drop down');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness("Facilities");
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Facilities Support')).toBeTruthy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness("Human Resource");
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Australia Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(caseTemplateData.templateName);
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.selectLineOfBusiness("Facilities");
            expect(await utilityGrid.isGridRecordPresent(caseTemplateData.templateName)).toBeFalsy('12063Summary' + randomStr);
            await utilityGrid.selectLineOfBusiness("Human Resource");
            expect(await utilityGrid.isGridRecordPresent(caseTemplateData.templateName)).toBeTruthy('12063Summary' + randomStr);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[60217]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let response, notesTemplate2, emailTemplateOraclePsilon, templateData2, tempNotesTemplateData1, templateData, externaltemplateData, automatedtemplateData, emailTemplateName, emailTemplateName1, notesTemplateName, notesTemplateBody, notesTemplateName1, notesTemplateBody1;
        let resolutionCode = 'resolutionCode' + randomStr;
        beforeAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            templateData = {
                "templateName": 'Manual task19011' + randomStr,
                "templateSummary": 'Manual task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.createManualTaskTemplate(templateData);
            externaltemplateData = {
                "templateName": 'External task19011' + randomStr,
                "templateSummary": 'External task19011' + randomStr,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": '- Global -',
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.createExternalTaskTemplate(externaltemplateData);
            automatedtemplateData = {
                "templateName": 'Automated task19011' + randomStr,
                "templateSummary": 'Automated task19011' + randomStr,
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": 'Auto Proces' + randomStr,
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 1",
                "assignee": "qtao",
            }
            await apiHelper.createAutomatedTaskTemplate(automatedtemplateData);
            //create an email template 
            emailTemplateName = await emailTemplateData['emailTemplateToComposeEmail'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmail'].TemplateName = emailTemplateName;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmail']);
            emailTemplateName1 = await emailTemplateData['emailTemplateToComposeEmailGlobal'].TemplateName + randomStr;
            emailTemplateData['emailTemplateToComposeEmailGlobal'].TemplateName = emailTemplateName1;
            await apiHelper.createEmailTemplate(emailTemplateData['emailTemplateToComposeEmailGlobal']);

            // Create Resoution code
            await apiHelper.apiLogin('qkatawazi');
            let resolutionCodeActiveOnUIData = cloneDeep(RESOLUTION_CODE_ACTIVE_ON_UI)
            resolutionCode = resolutionCodeActiveOnUIData.menuItemName + randomStr;
            resolutionCodeActiveOnUIData.menuItemName = resolutionCode;
            await apiHelper.createNewMenuItem(resolutionCodeActiveOnUIData);

            // Create Notes Template
            tempNotesTemplateData1 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD);
            notesTemplateName = tempNotesTemplateData1.templateName + randomStr;
            notesTemplateBody = tempNotesTemplateData1.body + randomStr;
            tempNotesTemplateData1.body = notesTemplateBody;
            tempNotesTemplateData1.templateName = notesTemplateName;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData1);

            let tempNotesTemplateData2 = cloneDeep(notesTemplateData.NOTES_TEMPLATE_MANDATORY_FIELD_GLOBAL);
            notesTemplateName1 = tempNotesTemplateData2.templateName + randomStr;
            notesTemplateBody1 = tempNotesTemplateData2.body + randomStr;
            tempNotesTemplateData2.body = notesTemplateBody1;
            tempNotesTemplateData2.templateName = notesTemplateName1;
            await apiHelper.createNotesTemplate("Case", tempNotesTemplateData2);
            let caseData = {
                "Requester": "qtao",
                "Summary": "Summary" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qfeng"
            };
            response = await apiHelper.createCase(caseData);
            await apiHelper.apiLogin('gderuno');
            templateData2 = {
                "templateName": "PsilonName" + randomStr,
                "templateSummary": "PsilonSummary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": "Psilon",
                "ownerCompany": "Psilon",
                "ownerBusinessUnit": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gwixillian",
            }
            await apiHelper.createManualTaskTemplate(templateData2);
            notesTemplate2 = {
                "templateName": "notesTemplatePsilon" + randomStr,
                "company": "Psilon",
                "templateStatus": 1,
                "body": "this is notes template description Oracle",
            }
            await apiHelper.createNotesTemplate("Case", notesTemplate2);
            emailTemplateOraclePsilon = {
                "TemplateName": "PsilonEmail" + randomStr,
                "Company": "Psilon",
                "Status": 1,
                "Description": "Leave details",
                "EmailMessageSubject": "Leave summary",
                "EmailMessageBody": "Hello testing Global Oracle",
            }
            await apiHelper.createEmailTemplate(emailTemplateOraclePsilon);
        });
        it('[60217]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await viewCasePage.clickOnEmailLink();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateName);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateName1);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateName1);
            await selectEmailTemplateBladePo.searchEmailTemplate(emailTemplateOraclePsilon.TemplateName);
            expect(await selectEmailTemplateBladePo.getGridRecordValue("Template Name")).toBe(emailTemplateOraclePsilon.TemplateName);
            await selectEmailTemplateBladePo.clickOnCancelButton();
            await composeMailPo.clickOnSelectEmailTemplateLink();
            await selectEmailTemplateBladePo.searchAndSelectEmailTemplate(emailTemplateName);
            await selectEmailTemplateBladePo.clickOnApplyButton();
            await composeMailPo.setToOrCCInputTextbox('To', 'fritz.schulz@petramco.com');
            await composeMailPo.clickOnSendButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[60217]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            await viewCasePage.clickAddTaskButton();
            await manageTaskBladePo.clickAddTaskFromTemplateButton();
            await manageTaskBladePo.searchTaskTemplate(templateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(automatedtemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(automatedtemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(externaltemplateData.templateSummary);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(externaltemplateData.templateSummary);
            await manageTaskBladePo.searchTaskTemplate(templateData2.TemplateName);
            expect(await manageTaskBladePo.getGridRecordValue("Template Name")).toBe(templateData2.TemplateName);
            await manageTaskBladePo.clickTaskGridCancelButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(templateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(automatedtemplateData.templateSummary);
            await manageTaskBladePo.addTaskFromTaskTemplate(externaltemplateData.templateSummary);
            await manageTaskBladePo.clickCloseButton();
        });
        it('[60217]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Case Notes Template
            await activityTabPo.clickActivityNoteTextBox();
            await activityTabPo.clickOnNotesTemplate();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateName)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplateName1)).toBeTruthy();
            expect(await notesTemplateUsage.isTemplatePresent(notesTemplate2.templateName)).toBeTruthy();
            await notesTemplateUsage.clickOnCancelBtn();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response.displayId);
            await notesTemplateUsage.clickAddNoteAndAddNoteTemplate(notesTemplateName);
            expect(await ckeditorValidationPo.getTextCkEditorTextArea()).toContain(notesTemplateBody);
            await activityTabPo.clickOnPostButton();
            expect(await activityTabPo.isTextPresentInActivityLog(tempNotesTemplateData1.body)).toBeTruthy();
        });
        it('[60217]:[Operating Organization] [Cases] : Verify the behavior where Email Templates, Task Templates, Resolution Codes, Notes templates are filtered / displayed based on the Line of Business on Cases.', async () => {
            // Verify Resolution Code
            await viewCasePage.clickEditCaseButton();
            await editCasePo.updateResolutionCode(resolutionCode);
            await editCasePo.setResolutionDescription(resolutionCode);
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
            await updateStatusBladePo.changeStatus('Resolved');
            await updateStatusBladePo.selectStatusReason('Auto Resolved');
            await updateStatusBladePo.clickSaveStatus();
            await utilityCommon.closePopUpMessage();
            expect(await viewCasePage.getTextOfStatus()).toBe('Resolved');
            expect(await viewCasePage.getResolutionCodeValue()).toBe(resolutionCode);
            expect(await viewCasePage.getResolutionDescription()).toBe(resolutionCode);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await composeMailPo.clickOnDiscardButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[60237]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetTitle = 'KnowledgeSet_' + randomStr, articleData, articleDetails;
        const knowledgeTemplateStr = 'ArticleTemplate_' + randomStr;
        beforeAll(async () => {
            // Knowledge set under LOB HR
            let knowledgeSetData = {
                knowledgeSetTitle: `${knowledgeSetTitle}`,
                knowledgeSetDesc: `${knowledgeSetTitle}_Desc`,
                company: 'Petramco'
            }
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            // Knowledge Template under LOB HR
            let knowledgeArticleTemplateData = {
                templateName: knowledgeTemplateStr,
                sectionTitle: "articleSection",
                knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            await coreApi.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        });
        it('[60237]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeTemplateStr);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toContain('Human Resource', 'value not matched with expected');
            await expect(createKnowledgePage.isLineOfBusinessDisable());
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Employee Relations')).toBeTruthy('Failure: Operational Category 1 is missing');

            //Verify Knowledge set and category belonging to LOB Finanace are not visible
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', 'Facilities')).toBeFalsy('Failure: Knowledge Set is available');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is missing');

            //Knowledge creation
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeSetTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await createKnowledgePage.clickChangeAssignmentButton();
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on create knowledge article
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[60237]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.getCategoryTier1SelectedValue()).toBe('Employee Relations');
            expect(await editKnowledgePo.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Failure: Operational Category 1 is missing');
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on edit Knowledge article
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on SME Review blade
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editKnowledgePo.clickSaveStatusBtn();
        });
        it('[60237]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await knowledgeArticlesConsolePo.isGridRecordPresent(knowledgeSetTitle)).toBeFalsy('Artcile is present');
        });
    });

    describe('[60205]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple companies for the single Line of Business', () => {
        let twoCompanyUser, knowledgeSetDataHR, knowledgeSetDataFacilities, knowledgeArticleDataDiffLOB, articleId;
        let randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            twoCompanyUser = {
                "firstName": "DRDMV23625",
                "lastName": "test",
                "userId": "DRDMV_23625_test",
                "userPermission": ["Case Agent", "Human Resource", "Case Business Analyst", "Knowledge Publisher"]
            }

            knowledgeSetDataHR = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco'
            }

            knowledgeSetDataFacilities = {
                knowledgeSetTitle: `KS Facilities ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_Facilitiesssss`,
                company: 'Petramco',
                lineOfBusiness: 'Facilities'
            }

            knowledgeArticleDataDiffLOB = {
                "knowledgeSet": 'Facilities',
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz",
                "lineOfBusiness": "Facilities"
            }

            await apiHelper.apiLogin("tadmin");
            await apiHelper.updateFoundationEntity('Person', 'Monika', { functionalRole: "Human Resource" });
            await apiHelper.createKnowledgeSet(knowledgeSetDataHR);
            await apiHelper.createKnowledgeSet(knowledgeSetDataFacilities);
            await apiHelper.createNewUser(twoCompanyUser);
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Petramco");
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Psilon");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "US Support 3");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "Psilon Support Group1");
            await apiHelper.associatePersonToCompany('ncage', "Psilon");
            await browser.sleep(9000); //Waiting for user data to be reflected
            await apiHelper.apiLogin("fritz");
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOB);
        });
        it('[60205]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(`${twoCompanyUser.userId}@petramco.com`, 'Password_1234');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Human Resource');
            expect(await createKnowledgePage.isLineOfBusinessDisable()).toBeTruthy();
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataHR.knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataFacilities.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');

            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');

            await createKnowledgePage.addTextInKnowlegeTitleField(`Title ${randomStr}`);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');

            //Validating Assignment fields
            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Saving the Article
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            articleId = await viewKnowledgeArticlePo.getKnowledgeArticleId();
        });
        it('[60205]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple companies for the single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.isLobSectionEnabled()).toBeTruthy();
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeFalsy();
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();

            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            expect(await accessTabPo.isAgentPresent(userData0.firstName)).toBeTruthy('User is not Present');
            expect(await accessTabPo.isAgentPresent(userData2.firstName)).toBeFalsy('User is Present');
            await accessTabPo.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            await editKnowledgePo.setCategoryTier1('Payroll');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Payroll');

            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOB.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await navigationPage.signOut();
        });
        it('[60205]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple companies for the single Line of Business', async () => {
            await loginPage.login('ppeter');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');

            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');

            await navigationPage.signOut();
            await loginPage.login('monika');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.selectLineOfBusiness('Finance');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');
        });
        it('[60205]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('ncage');
            await navigationPage.gotoCreateKnowledge();
            await utilityGrid.selectLineOfBusiness('Human Resource')
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('DRDMV23625');
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[60218]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', () => {
        let knowledgeSetDataHR, knowledgeSetDataFacilities, articleId, knowledgeArticleTemplateDataHR, knowledgeArticleTemplateDataFacilities, knowledgeArticleDataSameLOB;
        let randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            knowledgeSetDataHR = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco'
            }

            knowledgeSetDataFacilities = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco',
                lineOfBusiness: 'Facilities'
            }

            knowledgeArticleTemplateDataHR = {
                templateName: `tname HR ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Human Resource"
            }

            knowledgeArticleTemplateDataFacilities = {
                templateName: `tname Facilities ${randomStr}`,
                sectionTitle: "articleSection",
                lineOfBusiness: "Facilities"
            }

            knowledgeArticleDataSameLOB = {
                "knowledgeSet": 'HR',
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "qfeng",
                "lineOfBusiness": "Human Resource"
            }

            await apiHelper.apiLogin("tadmin");
            await apiHelper.createKnowledgeSet(knowledgeSetDataHR);
            await apiHelper.createKnowledgeSet(knowledgeSetDataFacilities);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataHR);
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateDataFacilities);
        });
        it('[60218]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');

            await navigationPage.gotoCreateKnowledge();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataHR.templateName)).toBeFalsy('Template is present');
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();

            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataFacilities.knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataHR.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');

            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is present');

            //Validating Assignment fields
            await navigationPage.gotoCreateKnowledge();
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();

            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Creating the Article
            await createKnowledgePage.addTextInKnowlegeTitleField(`Title ${randomStr}`);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            articleId = await viewKnowledgeArticlePo.getKnowledgeArticleId();
        });
        it('[60218]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', async () => {
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.isLobSectionEnabled()).toBeTruthy();
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();

            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            expect(await accessTabPo.isAgentPresent(userData0.firstName)).toBeTruthy('User is not Present');
            expect(await accessTabPo.isAgentPresent(userData2.firstName)).toBeFalsy('User is Present');
            await accessTabPo.clickCloseKnowledgeAccessBlade();
        });
        it('[60218]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to multiple Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');
            await editKnowledgePo.setCategoryTier1('Payroll');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Payroll');

            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData0.firstName} ${userData0.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Validating that Knowledge Template is filtered on the basis of LOB
            await navigationPage.gotoCreateKnowledge();
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataHR.templateName)).toBeTruthy('Template is not present');
            expect(await createKnowledgePage.isTemplatePresent(knowledgeArticleTemplateDataFacilities.templateName)).toBeFalsy('Template is present');

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataSameLOB.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
        let facilitiescaseData, facilitiesGlobalTemplateData, facilitiesarticleData, caseTemplateDataGlobal, caseTemplateData, facilitiesTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV23488";
        let commonNameForOtherLoB = randomStr + "FacilitiesDRDMV23488";
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            caseTemplateDataGlobal = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV23488',
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCaseTemplate(caseTemplateDataGlobal);
            await apiHelper.createCase(caseData);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
            facilitiesTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + "Facilities1DRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
                "lineOfBusiness": 'Facilities'
            };
            facilitiesGlobalTemplateData = {
                "templateName": commonNameForOtherLoB,
                "templateSummary": randomStr + "Facilities2DRDMV23488",
                "caseStatus": "Assigned",
                "templateStatus": "Active",
                "company": "- Global -",
                "casePriority": "Low",
                "lineOfBusiness": 'Facilities'
            };
            facilitiescaseData = {
                "Requester": "fritz",
                "Summary": commonNameForOtherLoB,
                "Assigned Company": "Petramco",
                "categoryTier1": 'Purchasing Card',
                "Business Unit": "Facilities Support",
                "Support Group": "Facilities",
                "Assignee": "Fritz",
                "Line of Business": 'Facilities'
            };
            facilitiesarticleData = {
                "knowledgeSet": "Facilities",
                "title": commonNameForOtherLoB,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz",
                "lineOfBusiness": 'Facilities'
            };
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(facilitiesTemplateData);
            await apiHelper.createCaseTemplate(facilitiesGlobalTemplateData);
            await apiHelper.createCase(facilitiescaseData);
            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(facilitiesarticleData);
            let knowledgeArticleGUID1 = knowledgeArticleData1.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID1, 'PublishApproval')).toBeTruthy('Status Not Set');
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await browser.sleep(7000); //Hard wait for KA Indexing
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await previewCasePage.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            await viewCasePage.clickOnTab('Resources');
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Human Resource', 'LOB is not correct');
            await viewCasePage.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCasePage.clickBackButton();
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'AU Support 1');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await apiHelper.apiLogin('qkatawazi');
            caseTemplateData.templateName = randomStr + "2CaseDRDMV23488";
            await apiHelper.createCaseTemplate(caseTemplateData);
            await viewCasePage.clickEditCaseButton();
            await editCasePo.clickOnChangeCaseTemplate();
            await selectCasetemplateBladePo.selectCaseTemplate(randomStr + "2CaseDRDMV23488");
            await editCasePo.clickSaveCase();
            await utilityCommon.closePopUpMessage();
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2CaseDRDMV23488")).toBeTruthy(randomStr + "2CaseDRDMV23488");
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(randomStr + "2CaseDRDMV23488")).toBeFalsy(randomStr + "2CaseDRDMV23488");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('frieda');
            await quickCasePo.setCaseSummary(commonName);
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDataGlobal.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateData.templateName)).toBeFalsy('template is present');
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary('new case');
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Human Resource');
            await casePreviewPo.clickGoToCaseButton();
            await viewCasePage.clickEditCaseButton();
            expect(await editCasePo.isValuePresentInDropdown("Category Tier 1", 'Phones')).toBeFalsy('Value is present in  Category Tier 1 drop down');
            expect(await editCasePo.isLineOfBusinessReadOnly()).toBeTruthy('Field is enabled');
            await editCasePo.updateCasePriority('High');
            await editCasePo.updateCaseCategoryTier1('Employee Relations');
            await editCasePo.updateCaseCategoryTier2('Compensation');
            await editCasePo.updateCaseCategoryTier3('Bonus');
            await editCasePo.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropDown("AssignedGroup", 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await editCasePo.clickChangeAssignmentButton();
            await changeAssignmentBladePo.setDropDownValue('AssignedGroup', 'AU Support 1');
            await changeAssignmentBladePo.setDropDownValue('Assignee', 'RA3 Liu');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editCasePo.clickSaveCase();
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Employee Relations');
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Compensation');
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Bonus');
            expect(await viewCasePage.getAssignedGroupValue()).toBe("AU Support 1");
            expect(await viewCasePage.getAssigneeText()).toBe("RA3 Liu");
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName);
            expect(await resourcesPo.getKnowledgeArticleInfo()).toContain('Facilities', 'LOB is not correct');
            await quickCasePo.clickFirstRecommendedCases();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await previewCasePage.clickBackButton();
            await quickCasePo.createCaseButton();
            await utilityCommon.closePopUpMessage();
            expect(await previewCasePage.getLineOfBusinessValue()).toBe('Facilities');
            await casePreviewPo.clickGoToCaseButton();
        });
        it('[12082]:[Operating Organization][Quick Case]: Verify the behavior when the case agent is able to create a case when it has access to single LOB', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateDataGlobal.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getLineOfBusinessValue()).toBe('Human Resource');
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.setCaseSummary(commonNameForOtherLoB);
            expect(await quickCasePo.selectCaseTemplate(facilitiesGlobalTemplateData.templateName)).toBeFalsy('template is present');
            expect(await quickCasePo.selectCaseTemplate(facilitiesTemplateData.templateName)).toBeFalsy('template is present');
            expect(await resourcesPo.isRecommendedKnowledgePresent(facilitiesarticleData.title)).toBeFalsy();
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(facilitiesarticleData.title);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.isRecommendedKnowledgePresent(facilitiesarticleData.title)).toBeFalsy();
        });
    });
});
