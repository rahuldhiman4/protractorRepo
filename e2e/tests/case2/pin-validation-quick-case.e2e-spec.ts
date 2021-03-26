import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { IKnowledgeArticleTemplate } from '../../data/interface/knowledge.interface';
import previewCasePo from '../../pageobject/case/case-preview.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import pinValidationPo from '../../pageobject/case/pin-validation.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resourcesTabPo from '../../pageobject/common/resources-tab.po';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import editKnowledgePage from "../../pageobject/knowledge/edit-knowledge.po";
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('PIN Validation Quick Case', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('gderuno');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[4644,5233,5227,5224,5223]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
        let casetemplatePsilon1, newCaseTemplate;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}1Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}1Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','2', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'ENFORCED');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
            await browser.sleep(3000); // hardwait to reflect case template validation
        });
        it('[4644,5233,5227,5224,5223]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is unsuccessful.'])).toBeTruthy();
            await pinValidationPo.clickOnPINCancelBtn();
            await utilityCommon.closePopUpMessage();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            expect(await previewCasePo.isRequesterNameDisplayed('Gleeu Wixillian')).toBeTruthy();
            expect(await previewCasePo.isCaseSummaryDisplayed(casetemplatePsilon1.templateSummary)).toBeTruthy();
            expect(await previewCasePo.getAssigneeDetails()).toContain('Psilon');
            expect(await previewCasePo.isRequesterEmailIdDisplayed('gwixillian@psilon.com')).toBeTruthy();
            expect(await previewCasePo.isDescriptionDisplayed('Gleeu Wixillian ' + `${casetemplatePsilon1.templateName}`)).toBeTruthy();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[4644,5233,5227,5224,5223]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','0', 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[4644,5233,5227,5224,5223]:Case creation via Quick Case ,Template validation is ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','1', 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await navigationPage.signOut();
            await loginPage.login('gderuno');
        });
    });

    describe('[5235,5234,5229,5228,5225]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
        let casetemplatePsilon1, newCaseTemplate;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}2Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','0', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'OPTIONAL');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
        });
        it('[5235,5234,5229,5228,5225]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[5235,5234,5229,5228,5225]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','1', 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[5235,5234,5229,5228,5225]:Case creation via Quick Case ,Template validation is OPTIONAL', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','2', 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await navigationPage.signOut();
            await loginPage.login('gderuno');
        });
    });

    describe('[5201,5246,5206,5204]:Case creation via Quick Case ,Template validation is OPTIONAL and NONE', async () => {
        let assignmentData, casetemplatePsilon1, newCaseTemplate, knowledgeArticleTemplateData: IKnowledgeArticleTemplate, knowledgeSetData;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}2Casetemplate`,
                "caseStatus": "New",
                "casePriority": "Low",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','0', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'NONE');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
            await apiHelper.apiLogin('tadmin');
            knowledgeSetData = {
                knowledgeSetTitle: 'KASetPsilon' + randomStr,
                knowledgeSetDesc: 'KAPsilon_Desc' + randomStr,
                company: 'Psilon'
            }
            assignmentData = {
                "assignmentMappingName": randomStr + "AssignmentMapping",
                "company": "Psilon",
                "supportCompany": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
            }
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            knowledgeArticleTemplateData = {
                templateName: 'KATemplatePsilon' + randomStr,
                sectionTitle: "articleSection",
                knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            apiHelper.deleteApprovalMapping('Knowledge');
        });
        it('[5201,5246,5206,5204]:Case creation via Quick Case ,Template validation is OPTIONAL and NONE', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeArticleTemplateData.templateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(`${randomStr}2Casetemplate`);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetData.knowledgeSetTitle);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            await utilityCommon.closePopUpMessage();
        });
        it('[5201,5246,5206,5204]:Case creation via Quick Case ,Template validation is OPTIONAL and NONE', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeFalsy();
            await quickCasePo.setCaseSummary('PINValidation' + randomStr);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await editCasePo.clickOnCancelCaseButton();
        });
        it('[5201,5246,5206,5204]:Case creation via Quick Case ,Template validation is OPTIONAL and NONE', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeFalsy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.enterAdvancedSearchText(casetemplatePsilon1.templateName);
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchFiltersButton("Apply");
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(casetemplatePsilon1.templateName)).toEqual(casetemplatePsilon1.templateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeFalsy();
        });
        it('[5201,5246,5206,5204]:Case creation via Quick Case ,Template validation is OPTIONAL and NONE', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','1', 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData.assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
        });
    });

    describe('[5231,5230,5205,5226]:Case creation via Quick Case,Template validation is OPTIONAL & NONE & ENFORCED', async () => {
        let assignmentData, casetemplatePsilon1, newCaseTemplate, knowledgeArticleTemplateData: IKnowledgeArticleTemplate, knowledgeSetData;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}2Casetemplate`,
                "caseStatus": "New",
                "casePriority": "Low",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','1', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'NONE');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
            await apiHelper.apiLogin('tadmin');
            knowledgeSetData = {
                knowledgeSetTitle: 'KASetPsilon' + randomStr,
                knowledgeSetDesc: 'KAPsilon_Desc' + randomStr,
                company: 'Psilon'
            }
            assignmentData = {
                "assignmentMappingName": randomStr + "AssignmentMapping",
                "company": "Psilon",
                "supportCompany": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
            }
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            knowledgeArticleTemplateData = {
                templateName: 'KATemplatePsilon' + randomStr,
                sectionTitle: "articleSection",
                knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle,
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            apiHelper.deleteApprovalMapping('Knowledge');
        });
        it('[5231,5230,5205,5226]:Case creation via Quick Case,Template validation is OPTIONAL & NONE & ENFORCED', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeArticleTemplateData.templateName);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField(`${randomStr}2Casetemplate`);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetData.knowledgeSetTitle);
            await createKnowledgePage.clickAssignToMeButton();
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePage.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePage.setKnowledgeStatus('Publish Approval');
            await utilityCommon.closePopUpMessage();
        });
        it('[5231,5230,5205,5226]:Case creation via Quick Case,Template validation is OPTIONAL & NONE & ENFORCED', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await quickCasePo.setCaseSummary('PINValidation' + randomStr);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await browser.sleep(2000); // requird to populate "did not validate the PIN of the requester" in case activity
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
        });
        it('[5231,5230,5205,5226]:Case creation via Quick Case,Template validation is OPTIONAL and NONE', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await quickCasePo.setCaseSummary('PINValidation' + randomStr);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await resourcesTabPo.clickOnAdvancedSearchOptions();
            await resourcesTabPo.enterAdvancedSearchText(casetemplatePsilon1.templateName);
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesTabPo.clickOnAdvancedSearchFiltersButton("Apply");
            await resourcesTabPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesTabPo.getAdvancedSearchResultForParticularSection(casetemplatePsilon1.templateName)).toEqual(casetemplatePsilon1.templateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[5231,5230,5205,5226]:Case creation via Quick Case,Template validation is OPTIONAL & NONE & ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION','2', 'Psilon');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("gwixillian");
            await quickCasePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is unsuccessful.'])).toBeTruthy();
            await pinValidationPo.clickOnPINCancelBtn();
            await utilityCommon.closePopUpMessage();
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeFalsy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeFalsy('Section is Present');
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await quickCasePo.setCaseSummary(casetemplatePsilon1.templateName);
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Cases')).toBeTruthy('Section is Present');
            expect(await resourcesTabPo.isSectionTitleDisplayed('Recommended Knowledge')).toBeTruthy('Section is Present');
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.deleteReadAccessOrAssignmentMapping(assignmentData.assignmentMappingName);
            await navigationPage.signOut();
            await loginPage.login('gderuno');
        });
    });
});