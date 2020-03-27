import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import quickCase from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import composeMail from '../../pageobject/email/compose-mail.po';
import utilCommon from '../../utils/util.common';

describe("Quick Case", () => {

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterEach(async () => {
        await browser.refresh();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    })

    it('[DRDMV-8387]: UI validation Email Option via Quick case', async () => {
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        await quickCase.setCaseSummary('new case');
        await quickCase.createCaseButton();
        await utilCommon.closePopUpMessage();
        await quickCase.gotoCaseButton();
        let quickCaseId: string = await viewCasePo.getCaseID();
        await viewCasePo.clickOnEmailLink();
        expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
        expect(await composeMail.isSubjectPresent()).toBeTruthy('Subject title missing');
        expect(await composeMail.getSubject()).toBe(quickCaseId + ":");
        expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
        expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
        expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
        expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        await composeMail.closeComposeEmail();
    });

    //ptidke
    it('[DRDMV-773]: [Quick Case] Case template selection via !', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'caseTemplateDRDMV773Active';
        let casTemplateSummary = randomStr + 'CaseSummaryDRDMV773Active';
        let templateData = {
            "templateName": `${caseTemplateName}`,
            "templateSummary": `${casTemplateSummary}`,
            "templateStatus": "Active",
            "company": "Petramco",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "supportGroup": "Facilities",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createCaseTemplate(templateData);

        let caseTemplateDraft = randomStr + 'caseTemplateDraftDRDMV-773';
        let casTemplateSummaryDraft = randomStr + 'caseTemplateDraftSummaryDRDMV-773';
        let templateDataDraft = {
            "templateName": `${caseTemplateDraft}`,
            "templateSummary": `${casTemplateSummaryDraft}`,
            "templateStatus": "Draft",
            "company": "Petramco",
            "resolveCaseonLastTaskCompletion": "1",
            "assignee": "Fritz",
            "supportGroup": "Facilities",
        }
        await apiHelper.apiLogin('fritz');
        await apiHelper.createCaseTemplate(templateDataDraft);

        let caseTemplatePsilon = randomStr + 'caseTemplatePsilonDRDMV773';
        let casTemplateSummaryPsilon = randomStr + 'caseTemplatePsilonSummaryDRDMV773';
        let templateDataPsilon = {
            "templateName": `${caseTemplatePsilon}`,
            "templateSummary": `${casTemplateSummaryPsilon}`,
            "templateStatus": "Active",
            "company": "Psilon",
        }
        await apiHelper.apiLogin('gwixillian');
        await apiHelper.createCaseTemplate(templateDataPsilon);
        await navigationPage.gotoQuickCase();
        expect(await quickCase.selectCaseTemplate(caseTemplateName)).toBeFalsy('template is present');
        await quickCase.selectRequesterName('adam');
        expect(await quickCase.selectCaseTemplate(caseTemplateDraft)).toBeFalsy('template is present');
        await quickCase.selectRequesterName('fritz');
        expect(await quickCase.selectCaseTemplate(caseTemplatePsilon)).toBeFalsy('template is present');
        await quickCase.selectRequesterName('fritz');
        await quickCase.selectCaseTemplate(caseTemplateName);
        await quickCase.createCaseButton();
        await quickCase.gotoCaseButton();
        expect(await viewCasePo.getCaseTemplateText()).toBe(caseTemplateName);
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        await quickCase.selectRoleValue('Related to');
        expect(await quickCase.selectCaseTemplate(caseTemplateDraft)).toBeFalsy('template is present');
    }, 480 * 1000);

    //ptidke
    it('[DRDMV-741]: [Quick Case] UI validation including Source field in Quick Case', async () => {
        let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let activeSourceUI = await menuItemDataFile['sourceMenuItem'].menuItemName + randomStr;
        menuItemDataFile['sourceMenuItem'].menuItemName = activeSourceUI;
        await apiHelper.apiLogin('qkatawazi');
        //active yes on UI
        await apiHelper.createNewMenuItem(menuItemDataFile['sourceMenuItem']);
        let inActiveSource741 = await menuItemDataFile['sourceInActive'].menuItemName + randomStr;
        menuItemDataFile['sourceInActive'].menuItemName = inActiveSource741;
        //Inactive 
        await apiHelper.createNewMenuItem(menuItemDataFile['sourceInActive']);
        let sourceDeprecated741 = await menuItemDataFile['sourceDeprecated'].menuItemName + randomStr;
        menuItemDataFile['sourceDeprecated'].menuItemName = sourceDeprecated741;
        //deprecated
        await apiHelper.createNewMenuItem(menuItemDataFile['sourceDeprecated']);
        let activeSourceNotUI = await menuItemDataFile['sourceActiveNotOnUI'].menuItemName + randomStr;
        menuItemDataFile['sourceActiveNotOnUI'].menuItemName = activeSourceNotUI;
        //Not on UI
        await apiHelper.createNewMenuItem(menuItemDataFile['sourceActiveNotOnUI']);
        //creation of quick case
        await navigationPage.gotoQuickCase();
        expect(await quickCase.getDescriptionDetails()).toContain("Begin by entering person's name, email, login ID or employee ID after the @ symbol. Then enter a description of the case.");
        expect(await quickCase.getResourcesText()).toContain('Quick Case finds resources for you while you take notes');
        expect(await quickCase.getSelectedSourceValue()).toContain('Agent');
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary('new case creation');
        await quickCase.selectSourceValue(activeSourceUI);
        await quickCase.createCaseButton();
        await quickCase.gotoCaseButton();
        expect(await viewCasePo.getSourceValue()).toContain(activeSourceUI);
        await navigationPage.gotoQuickCase();
        expect(await quickCase.isValuePresentInSourceDropDown(sourceDeprecated741)).toBeFalsy(sourceDeprecated741 + 'is present');
        expect(await quickCase.isValuePresentInSourceDropDown(inActiveSource741)).toBeFalsy(inActiveSource741 + 'is present');
        expect(await quickCase.isValuePresentInSourceDropDown(activeSourceNotUI)).toBeFalsy(activeSourceNotUI + 'is present');
    });
})