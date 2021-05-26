import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
let userData1, userData2 = undefined;


describe('Email Acknowledgment Template', () => {
    let label = "POSH";
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[5123]: Acknowledgment Template : Acknowledgment Template creation UI validations', async () => {
        it('[5123]: Acknowledgment Template : Acknowledgment Template creation UI validations', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            expect(await createAcknowledgmentTemplatesPo.isTemplateNameRequired()).toBeTruthy();
            expect(await createAcknowledgmentTemplatesPo.isCompanyRequired()).toBeTruthy();
            expect(await createAcknowledgmentTemplatesPo.isStatusRequired()).toBeTruthy();
            expect(await createAcknowledgmentTemplatesPo.isSubjectRequired()).toBeTruthy();
            expect(await createAcknowledgmentTemplatesPo.islineOfBusinessDisabled()).toBeTruthy();
            expect(await createAcknowledgmentTemplatesPo.isLocaleDisabled()).toBeTruthy();
        });
        afterAll(async () => {
            await createAcknowledgmentTemplatesPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
    });


    //kgaikwad
    describe('[5124,5120,5117]: Acknowledgment Template : Acknowledgment Template creation', async () => {
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr: string[] = ["Label"];

        it('[5124,5120,5117]: Acknowledgment Template : Acknowledgment Template creation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5124,5120,5117]: Acknowledgment Template : Acknowledgment Template creation', async () => {
            await consoleAcknowledgmentTemplatePo.addColumnOnGrid(arr);
            let arr2: string[] = ['Template Name', 'Subject', "Company", "Status", "Label"];
            expect(await consoleAcknowledgmentTemplatePo.areGridColumnHeaderMatches(arr2)).toBeTruthy('Column header not matches');
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName);
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName, 'Private template name is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Private template subject is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Private template company name is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Private template status is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Private template label is missing');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[5124,5120,5117]: Acknowledgment Template : Acknowledgment Template creation', async () => {
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName2);
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Public template name is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Public template subject is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('- Global -', 'Public template company name is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Public template status is missing');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, 'Public template label is missing');
            await consoleAcknowledgmentTemplatePo.removeColumnOnGrid(arr);
            await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
            await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord(templateName);
            await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
            expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName)).toBeFalsy('Private template name is preset on grid')
            await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
            await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord(templateName2);
            await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
            expect(await consoleAcknowledgmentTemplatePo.isGridRecordPresent(templateName2)).toBeFalsy('Public template name is preset on grid')

            // petramco ack template
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();

            // Global ack template
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[5124,5120,5117]: Verify if acknowledgment templates are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB email ack template is not visible to same LOB case manager');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email ack template is not visible to same LOB case manager');
        });

        it('[5124,5120,5117]: Verify if acknowledgment templates are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB email ack template is not visible to different LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email ack template is not visible to different LOB case BA');

        });

        it('[5124,5120,5117]: Verify if acknowledgment templates are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB email ack template is not visible to different LOB case manager');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email ack template is not visible to different LOB case manager');
        });

        it('[5124,5120,5117]: Verify if acknowledgment templates are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB email ack template is not visible to same LOB with different case BA');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email ack template is not visible to same LOB with different case BA');
        });

        it('[5124,5120,5117]: Verify if acknowledgment templates are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB email ack template is not visible to case manager with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email ack template is not visible to case manager with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB email ack template is visible to case manager with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email ack template is visible to case manager with multiple LOB access');
        });

        it('[5124,5120,5117]: Verify if acknowledgment templates are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeFalsy('Human Resources LOB email ack template is visible to case BA with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeFalsy('Human Resources LOB email ack template is visible to case BA with multiple LOB access');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateName)).toBeTruthy('Human Resources LOB email ack template is not visible to case BA with multiple LOB access');
            expect(await utilityGrid.isGridRecordPresent(templateName2)).toBeTruthy('Human Resources LOB email ack template is not visible to case BA with multiple LOB access');
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate(templateName2);
            await editAcknowledgmentTemplatePo.selectStatusDropDown('Inactive');
            await editAcknowledgmentTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //kgaikwad
    describe('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
        let templateName = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName2 = 'Public' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description2 = [...Array(11)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject2 = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(8)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body2 = [...Array(9)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let arr2: string[] = ["Label"];
        it('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName2);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            // 5121
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate(templateName);
            expect(await editAcknowledgmentTemplatePo.isModuleNameDisabled()).toBeTruthy('Module Name is enabled');
            expect(await editAcknowledgmentTemplatePo.isCompanyDropDownDisabled()).toBeTruthy('Company drop down is enabled');
            await editAcknowledgmentTemplatePo.updateDescription(description2);
            await editAcknowledgmentTemplatePo.selectStatusDropDown('Active');
            expect(await editAcknowledgmentTemplatePo.isLocalizedMessageButtonDisplayed()).toBeTruthy('Localize message button is missing');
            await editAcknowledgmentTemplatePo.selectlocaleDropDown('English (United States)');
            let arr: string[] = ["None","English (United States)", "German (Germany)", "Spanish (International Sort)","French (France)",  "Italian (Italy)", "Portuguese (Brazil)", "Swedish (Sweden)", "Dutch (Netherlands)","Danish (Denmark)"];
            expect(await editAcknowledgmentTemplatePo.isLocaleDropDownValueDisplayed(arr)).toBeTruthy('Values not displayed in locale drop down');

            await editAcknowledgmentTemplatePo.clickOnGridSearchIcon();
            await editAcknowledgmentTemplatePo.searchAndSelectGridRecord('body');
            await editAcknowledgmentTemplatePo.clickOnGridEditButton();
            await editAcknowledgmentTemplatePo.updateEditMessageTextBladeBody(body2);
            await editAcknowledgmentTemplatePo.clickOnEditMessageTextBladeSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await editAcknowledgmentTemplatePo.searchAndSelectGridRecord('subject');
            await editAcknowledgmentTemplatePo.clickOnGridEditButton();
            await editAcknowledgmentTemplatePo.updateEditMessageTextBladeSubject(subject2);
            await editAcknowledgmentTemplatePo.clickOnEditMessageTextBladeSaveButton();
            await utilityCommon.closePopUpMessage();
            await editAcknowledgmentTemplatePo.searchOnGridConsole('body');
            expect(await editAcknowledgmentTemplatePo.getSelectedGridRecordValue('Message')).toContain(body2, 'body not updated correctly');
            await editAcknowledgmentTemplatePo.searchOnGridConsole('subject');
            expect(await editAcknowledgmentTemplatePo.getSelectedGridRecordValue('Message')).toBe(subject2, 'subject not updated correctly');
            await editAcknowledgmentTemplatePo.clickOnSaveButton();
        });
        it('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            // 5115
            await consoleAcknowledgmentTemplatePo.clearGridFilter();
            await consoleAcknowledgmentTemplatePo.clearGridSearchBox();
            await consoleAcknowledgmentTemplatePo.addColumnOnGrid(arr2);
            await consoleAcknowledgmentTemplatePo.addFilter('Template Name', templateName2, 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Filter Template Name is missing in column');
            await utilityGrid.clearFilter();
            await consoleAcknowledgmentTemplatePo.addFilter('Label', label, 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Label')).toBe(label, ' Filter Label is missing in column');
            await consoleAcknowledgmentTemplatePo.addFilter('Status', 'Active', 'checkbox');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Status')).toBe('Active', 'Filter Label is missing in column');
            await consoleAcknowledgmentTemplatePo.addFilter('Company', 'Petramco', 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Filter Company is missing in column');
        });
        it('[5121,5115,5116]: Acknowledgment Template : Edit Acknowledgment Template UI validation', async () => {
            await consoleAcknowledgmentTemplatePo.addFilter('Subject', subject2, 'text');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject2, 'Filter Subject is missing in column');
            await consoleAcknowledgmentTemplatePo.removeColumnOnGrid(arr2);
            await consoleAcknowledgmentTemplatePo.clearGridFilter();
            // 5116
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole(templateName2);
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Template Name')).toBe(templateName2, 'Search Template Name is missing in column');
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole(subject);
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Subject')).toBe(subject, 'Search Subject is missing in column');
            await consoleAcknowledgmentTemplatePo.searchOnGridConsole('Petramco');
            expect(await consoleAcknowledgmentTemplatePo.getSelectedGridRecordValue('Company')).toBe('Petramco', 'Search Company is missing in column');
        });
    });

    //ptidke
    describe('[5119]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
        let templateName4 = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateName5 = 'Private' + [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let description = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let subject = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let body = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[5119]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName4);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        });
        it('[5119]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName4);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();

            expect(await utilityCommon.isPopUpMessagePresent('Template Already exist with given name:' + templateName4)).toBeTruthy('Duplicate private template name error message is missing');
            await utilityCommon.closePopUpMessage();
            await createAcknowledgmentTemplatesPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5119]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName5);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
        });
        it('[5119]: Acknowledgment Template: Acknowledgment Template creation with same name', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName5);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.selectLabelDropDown(label);
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.setBody(body);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();

            expect(await utilityCommon.isPopUpMessagePresent('Template Already exist with given name:' + templateName5)).toBeTruthy('Duplicate private template name error message is missing');
            await utilityCommon.closePopUpMessage();
            await createAcknowledgmentTemplatesPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5119]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName4);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent(`Template Already exist with given name:${templateName4}`)).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            await createAcknowledgmentTemplatesPo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5119]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateName4);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.setDescription(description);
            await createAcknowledgmentTemplatesPo.setSubject(subject);
            // verify LOB is there
            expect(await createAcknowledgmentTemplatesPo.getLobValue()).toBe("Facilities");
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            //expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent"); NO SUCCESS MESSAGE ON UI
            // open the record and verify LOB is on edit screen
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate(templateName4);
            expect(await editAcknowledgmentTemplatePo.getLobValue()).toBe("Facilities");
            await editAcknowledgmentTemplatePo.clickOnCancelButton();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
        });
    });
});
