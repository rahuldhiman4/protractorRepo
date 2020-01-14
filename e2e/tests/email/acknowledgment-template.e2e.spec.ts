import { browser } from "protractor";
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createMenuItemsBladePo from '../../pageobject/settings/application-config/create-menu-items-blade.po';
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import utilCommon from '../../utils/util.common';
describe('AcknowledgmentTemplate', () => {

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
    it('DRDMV-10896,DRDMV-10901,DRDMV-10922,DRDMV-10895 : Acknowledgment Template : Acknowledgment Template creation', async () => {
        // try {
        let label = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Menu Items', 'Menu Items - Business Workflows');
        await createMenuItemsBladePo.clickOnMenuOptionLink();
        await createMenuItemsBladePo.selectMenuNameDropDown('Label');
        await createMenuItemsBladePo.clickOnLocalizeLink();
        await utilCommon.waitUntilSpinnerToHide();
        await localizeValuePopPo.setLocalizeValue(label);
        await localizeValuePopPo.clickOnSaveButton();
        await utilCommon.waitUntilSpinnerToHide();
        await createMenuItemsBladePo.selectStatusDropDown('Active');
        await createMenuItemsBladePo.selectAvailableOnUiToggleButton(true);
        await createMenuItemsBladePo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await navigationPage.gotoCaseConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
        await createAcknowledgmentTemplatesPo.ClickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        let arr: string[] = ["Label"];
        await consoleAcknowledgmentTemplatePo.addColumnOnGrid(arr);
        let arr2: string[] = ['Template Name', 'Subject', "Company", "Status", "Label"];
        expect(await consoleAcknowledgmentTemplatePo.areGridColumnHeaderMatches(arr2)).toBeTruthy('Column header not matches');

        await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName);
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName, 'Private template name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Private template subject is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Private template company name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Private template status is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Private template label is missing');

        await createAcknowledgmentTemplatesPo.ClickOnAddAcknowlegeTemplateButton();
        await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
        await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
        await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
        await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
        await createAcknowledgmentTemplatesPo.setDescription(description);
        await createAcknowledgmentTemplatesPo.setSubject(subject);
        await createAcknowledgmentTemplatesPo.setBody(body);
        await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        await utilCommon.waitUntilPopUpDisappear();

        await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName2);
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Public template name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Public template subject is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Public template company name is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Public template status is missing');
        expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Public template label is missing');
        await consoleAcknowledgmentTemplatePo.removeColumnOnGrid(arr);

        await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
        await consoleAcknowledgmentTemplatePo.searchAndSelectFirstCheckBoxWOGrid(templateName);
        await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName)).toBeFalsy('Public template name is preset on grid')

        await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
        await consoleAcknowledgmentTemplatePo.searchAndSelectFirstCheckBoxWOGrid(templateName2);
        await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName2)).toBeFalsy('Public template name is preset on grid')
    }, 210 * 1000)
})
