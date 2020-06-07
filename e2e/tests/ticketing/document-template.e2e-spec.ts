import { browser } from "protractor";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createMenuItemsBladePo from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import imagePropertiesPo from '../../pageobject/settings/common/image-properties.po';
import createDocumentTemplatePo from '../../pageobject/settings/document-management/create-document-template.po';
import documentTemplateConsolePo from '../../pageobject/settings/document-management/document-template-console.po';
import editDocumentTemplatePo from '../../pageobject/settings/document-management/edit-document-template.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';

describe('Document Template', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Verify Document template creation with Case business analyst', async () => {
        let templateRandVal1 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateRandVal2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let documentBody = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let documentBody2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let labelRandVal = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let labelRandVal2 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('Create Menu item label', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            await createMenuItemsBladePo.selectMenuNameDropDown('Label');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(labelRandVal);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
            await createMenuItemsBladePo.clickOnMenuOptionLink();
            await createMenuItemsBladePo.selectMenuNameDropDown('Label');
            await createMenuItemsBladePo.clickOnLocalizeLink();
            await localizeValuePopPo.setLocalizeValue(labelRandVal2);
            await localizeValuePopPo.clickOnSaveButton();
            await createMenuItemsBladePo.selectStatusDropDown('Active');
            await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
            await createMenuItemsBladePo.clickOnSaveButton();
        });
        it('Create document template', async () => {
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
            await createDocumentTemplatePo.clickOnDocumentBodyImageButton();
            await imagePropertiesPo.addImg('Upload', '../../../data/ui/attachment/articleStatus.png');
            await createDocumentTemplatePo.clickOnSaveButton();
            await createDocumentTemplatePo.clickOnAddTemplate();
            await createDocumentTemplatePo.setTemplateName(templateRandVal2);
            expect(await createDocumentTemplatePo.isSaveButtonEnabled()).toBeFalsy('Save button is enabled');
            await createDocumentTemplatePo.setCompany('- Global -');
            await createDocumentTemplatePo.selectLabelDropDown(labelRandVal);
            await createDocumentTemplatePo.setDescription(description);
            await createDocumentTemplatePo.setDocumentBody(documentBody);
            await createDocumentTemplatePo.clickOnSaveButton();
        });
        it('Validation of document template', async () => {
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal1)).toBeTruthy('Template Name is missing');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('Petramco')).toBeTruthy('Petramco Company Name is missing');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal)).toBeTruthy('label is missing');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description)).toBeTruthy('Description Name is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody)).toBeTruthy('Document body text is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyImgDisplay()).toBeTruthy('Document body Img text is missing');
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal2);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal2)).toBeTruthy('Template Name is missing for Global company');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('- Global -')).toBeTruthy('Global Company Name is missing ');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal)).toBeTruthy('label is missing of Global company');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description)).toBeTruthy('Description Name is missing of Global company ');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody)).toBeTruthy('Document body text is missing of Global company');
            expect(await editDocumentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('company drop down is enabled of Global company');
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
        it('update document template', async () => {
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company Drop down is not disabled');
            expect(await editDocumentTemplatePo.isTemplateNameDisabled()).toBeTruthy('Template Name is disabled');
            await editDocumentTemplatePo.selectLabelDropDown(labelRandVal2);
            await editDocumentTemplatePo.updateDescription(description2);
            await editDocumentTemplatePo.updateDocumentBody(documentBody2);
            await editDocumentTemplatePo.clickOnSaveButton();
            await documentTemplateConsolePo.searchAndOpenDocumentTemplate(templateRandVal1);
            expect(await editDocumentTemplatePo.isTemplateNameDisplayed(templateRandVal1)).toBeTruthy('Template Name is missing');
            expect(await editDocumentTemplatePo.isCompanyNameDisplayed('Petramco')).toBeTruthy('Petramco 2 Company Name is missing');
            expect(await editDocumentTemplatePo.isLabelValueDisplayed(labelRandVal2)).toBeTruthy('label2 is missing');
            expect(await editDocumentTemplatePo.isDescriptionValueDisplayed(description2)).toBeTruthy('Description2 Name is missing');
            expect(await editDocumentTemplatePo.isDocumentBodyDisplayed(documentBody2)).toBeTruthy('Document body2 text is missing');
            await editDocumentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
            await documentTemplateConsolePo.searchOnGridConsole(templateRandVal1);
        });
        it('[DRDMV-14970,DRDMV-14974,DRDMV-14971,DRDMV-14972]: Verify Document template creation with Case business analyst only and different validations on the window', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Document Management--Templates', 'Document Templates - Business Workflows');
            expect(await documentTemplateConsolePo.isGridRecordPresent(templateRandVal1)).toBeFalsy('Record is visible with "gwixillian" login');
            await documentTemplateConsolePo.searchOnGridConsole(templateRandVal2);
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Template Name')).toBe(templateRandVal2, 'Template name is missing on Grid');
            expect(await documentTemplateConsolePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Global Company name is missing on Grid');
            await documentTemplateConsolePo.clearGridSearchBox();
            await documentTemplateConsolePo.selectCheckBox(templateRandVal2);
            await documentTemplateConsolePo.clickOnDeleteButton();
            await utilCommon.clickOnWarningOk();
            expect(await documentTemplateConsolePo.isGridRecordPresent(templateRandVal2)).toBeFalsy('template name is preset on grid');
        });
    });
})
