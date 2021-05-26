import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import editCasePo from '../../pageobject/case/edit-case.po';
import pinValidationPo from '../../pageobject/case/pin-validation.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import activityTabPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('PIN Validation Create Case', () => {

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

    describe('[4643,5219,5211,5214,5210]:Case creation via Create Case ,Template validation is ENFORCED', async () => {
        let casetemplatePsilon1, newCaseTemplate,configGuid;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}1Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}1Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": 'Purchasing Card',
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '2', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'ENFORCED');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
            await browser.sleep(3000); // hardwait to reflect case template validation
        });
        it('[4643,5219,5211,5214,5210]:Case creation via Create Case ,Template validation is ENFORCED', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is unsuccessful.'])).toBeTruthy();
            await pinValidationPo.clickOnPINCancelBtn();
            await utilityCommon.closePopUpMessage();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            expect(await previewCasePo.isRequesterNameDisplayed('Gleeu Wixillian')).toBeTruthy();
            expect(await previewCasePo.isCaseTemplateDisplayed(casetemplatePsilon1.templateName)).toBeTruthy();
            expect(await previewCasePo.getAssigneeDetails()).toContain('Psilon');
            expect(await previewCasePo.isRequesterEmailIdDisplayed('gwixillian@psilon.com')).toBeTruthy();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[4643,5219,5211,5214,5210]:Case creation via Create Case ,Template validation is ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '0', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[4643,5219,5211,5214,5210]:Case creation via Create Case ,Template validation is ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '1', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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

    describe('[5221,5220,5216,5215,5212]:Case creation via Create Case ,Template validation is OPTIONAL', async () => {
        let casetemplatePsilon1, newCaseTemplate;
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}2Summary`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": 'Purchasing Card',
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "ownerBU": "Psilon Support Org1",
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('gderuno');
            newCaseTemplate = await apiHelper.createCaseTemplate(casetemplatePsilon1);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '0', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'OPTIONAL');
            await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Active');
        });
        it('[5221,5220,5216,5215,5212]:Case creation via Create Case ,Template validation is OPTIONAL', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[5221,5220,5216,5215,5212]:Case creation via Create Case ,Template validation is OPTIONAL', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '1', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[5221,5220,5216,5215,5212]:Case creation via Create Case ,Template validation is OPTIONAL', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '2', 'Psilon');
            await apiHelper.updateCaseTemplateIdentitiyValidation(newCaseTemplate.id, 'ENFORCED');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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

    describe('[5218,5213,5217,5222]:Case creation via Create Case ,Template validation is OPTIONAL and NONE', async () => {
        let casetemplatePsilon1, newCaseTemplate;
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            casetemplatePsilon1 = {
                "templateName": `${randomStr}2Casetemplate`,
                "templateStatus": "Draft",
                "templateSummary": `${randomStr}2Casetemplate`,
                "caseStatus": "New",
                "casePriority": "Low",
                "categoryTier1": 'Purchasing Card',
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
        });
        it('[5218,5213,5217,5222]:Case creation via Create Case ,Template validation is OPTIONAL and NONE', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeFalsy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await editCasePo.clickOnCancelCaseButton();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeFalsy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await editCasePo.clickOnCancelCaseButton();
        });
        it('[5218,5213,5217,5222]:Case creation via Create Case ,Template validation is OPTIONAL and NONE', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '1', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("1234");
            expect(await utilityCommon.isPopupMsgsMatches([`Requester's PIN not validated for this case.`])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
        });
        it('[5218,5213,5217,5222]:Case creation via Create Case ,Template validation is OPTIONAL and NONE', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '2', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(casetemplatePsilon1.templateName);
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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

    describe('[5200,5207,5208,5209]:Case creation via Create Case without Template ,Template validation is OPTIONAL and NONE and ENFORCED', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '0', 'Psilon');
        });
        it('[5200,5207,5208,5209]:Case creation via Create Case without Template ,Template validation is OPTIONAL and NONE and ENFORCED', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeFalsy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeFalsy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeFalsy();
            await editCasePo.clickOnCancelCaseButton();
        });
        it('[5200,5207,5208,5209]:Case creation via Create Case without Template ,Template validation is OPTIONAL and NONE and ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '1', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await activityTabPo.isTextPresentInActivityLog('validated the PIN of the requester')).toBeTruthy();
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeFalsy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await activityTabPo.clickOnRefreshButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            expect(await activityTabPo.isTextPresentInActivityLog('did not validate the PIN of the requester')).toBeTruthy();
            await viewCasePo.clickEditCaseButton();
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Requester is not validated for this case.')).toBeTruthy();
            await editCasePo.clickOnCancelCaseButton();
        });
        it('[5200,5207,5208,5209]:Case creation via Create Case without Template ,Template validation is OPTIONAL and NONE and ENFORCED', async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteCommonConfiguration('IDENTITY_VALIDATION','Psilon');
            await apiHelper.createCommonConfig('IDENTITY_VALIDATION', '2', 'Psilon');
            await navigationPage.gotoCreateCase();
            await createCasePo.selectRequester('gwixillian');
            await createCasePo.setSummary('Summary' + randomStr);
            await createCasePo.clickAssignToMeButton();
            expect(await createCasePo.isSaveCaseButtonDisabled()).toBeTruthy('Save button Enabled');
            expect(await pinValidationPo.isIdentityValidationMessageDisplayed('Please validate the requester.')).toBeTruthy();
            await pinValidationPo.validatePin("12345");
            expect(await utilityCommon.isPopupMsgsMatches(['Validation of requester is successful.'])).toBeTruthy();
            await createCasePo.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
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
});