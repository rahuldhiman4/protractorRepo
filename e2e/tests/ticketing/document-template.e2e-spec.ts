import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import documentTemplateConsolePo from '../../pageobject/settings/document-management/document-template-console.po';
import editDocumentTemplatePo from '../../pageobject/settings/document-management/edit-document-template.po';
import utilCommon from '../../utils/util.common';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import createMenuItemsBladePo from '../../pageobject/settings/application-config/create-menu-items-blade.po';

describe('Document Template', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    }); 

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });
    
    //kgaikwad
    it('DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972 : Verify Document template creation with Case business analyst only and different validations on the window', async () => {
        try {
            let templateRandVal1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let templateRandVal2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let documentBody = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let labelRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            await createMenuItemsBladePo.selectMenuNameDropDown('Label');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await utilCommon.waitUntilSpinnerToHide();
            await localizeValuePopPo.setLocalizeValue(labelRandVal);
            await localizeValuePopPo.clickOnSaveButton();
            await utilCommon.waitUntilSpinnerToHide();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
            await utilCommon.waitUntilPopUpDisappear();
            
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            await createDocumentTemplatePo.clickOnAddTemplate();
            expect(await createDocumentTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            await createDocumentTemplatePo.setTemplateName(templateRandVal1);
            await createDocumentTemplatePo.setCompany('Petramco');
            await createDocumentTemplatePo.selectLabelDropDown(labelRandVal);
            await createDocumentTemplatePo.setDescription(description);
            await createDocumentTemplatePo.setDocumentBody(documentBody);
            await createDocumentTemplatePo.clickOnSaveButton();
            await utilCommon.waitUntilPopUpDisappear();

            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(templateRandVal2);
            expect(await createDocumentTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            await createDocumentTemplatePo.setCompany('- Global -');
            await createDocumentTemplatePo.selectLabelDropDown(labelRandVal);
            await createDocumentTemplatePo.setDescription(description);
            await createDocumentTemplatePo.setDocumentBody(documentBody);
            await createDocumentTemplatePo.clickOnSaveButton();
            await utilCommon.waitUntilPopUpDisappear();

            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal1)).toBeTruthy('Template Name is missing');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('Petramco')).toBeTruthy('Company Name is missing');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal)).toBeTruthy('label is missing');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description)).toBeTruthy('Description Name is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody)).toBeTruthy('Document body text is missing');
            await editDocumentTemplatePo.clickOnCancelButton();

            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal2);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal2)).toBeTruthy('Template Name is missing for Global company');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('- Global -')).toBeTruthy('Global Company Name is missing ');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal)).toBeTruthy('label is missing of Global company');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description)).toBeTruthy('Description Name is missing of Global company ');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody)).toBeTruthy('Document body text is missing of Global company');
            expect(await editDocumentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('company drop down is enabled of Global company');
            await editDocumentTemplatePo.clickOnCancelButton();

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            expect(await documentTemplateConsolePo.isGridRecordPresent(templateRandVal1)).toBeFalsy('Record is visible with "gwixillian" login');
            await await documentTemplateConsolePo.searchOnGridConsole(templateRandVal2);
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Template Name')).toBe(templateRandVal2,'Template name is missing on Grid');
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Company')).toBe('- Global -','Global Company name is missing on Grid');
            
            await documentTemplateConsolePo.clearGridSearchBox();
            await documentTemplateConsolePo.selectCheckBox(templateRandVal2);
            await documentTemplateConsolePo.clickOnDeleteButton();
            await utilCommon.clickOnWarningOk();
            
            console.log('Step:1');
            expect(await documentTemplateConsolePo.isGridRecordPresent(templateRandVal2)).toBeFalsy('template name is preset on grid')
            console.log('Step:2');
        } catch (e) {
            console.log(e);
            await expect(true).toBeFalsy();
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    },180*1000)
})