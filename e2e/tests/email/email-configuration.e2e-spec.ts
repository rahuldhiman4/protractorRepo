import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import consoleEmailConfig from '../../pageobject/settings/email/console-email-configuration.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import createEmailConfigPo from '../../pageobject/settings/email/create-email-config.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import editEmailConfigPo from '../../pageobject/settings/email/edit-email-config.po';
import editExclusiveSubjectPo from '../../pageobject/settings/email/edit-exclusive-subject.po';
import newExclusiveSubjectPo from '../../pageobject/settings/email/new-exclusive-subject.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

let userData1, userData2 = undefined;

describe('Email Configuration', () => {
    let emailID = "bmctemptestemail@gmail.com";
    let facilitiesEmailID = "bwfqa2019@gmail.com"
   
    let incomingEmail = {
        'mailBoxName': 'testEmail@gmail.com'
    }

    let emailConfig = {
        email: emailID,
        incomingMailBoxName: incomingEmail.mailBoxName,
    }

    let emailConfig2 = {
        email: "newbmctemp@gmail.com",
        incomingMailBoxName: incomingEmail.mailBoxName,
    }

    let emailConfigFacilities = {
        email: emailID,
        incomingMailBoxName: incomingEmail.mailBoxName,
        lineOfBusiness: "Facilities"
    }

    let differntEmailConfigFacilities = {
        email: "bwfqa2019@gmail.com",
        incomingMailBoxName: incomingEmail.mailBoxName,
        lineOfBusiness: "Facilities"
    }

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await apiHelper.createEmailBox('incoming', incomingEmail);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createEmailConfiguration(emailConfig);
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw #passed
    describe('[5463,5464]: [Email Configuration] Verify Email configuration Grid view', async () => {
        it('[5463,5464]: Verify Email configuration header', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            let emailHeaders: string[] = ["Email IDs", "Company", "Status"];
            let add: string[] = ["Created By","Created Date", "Display ID", "ID","Modified By","Modified Date"];
            let newEmailHeaders: string[] = ["Email IDs", "Company", "Status","Created By","Created Date", "Display ID", "ID","Modified By","Modified Date"];
            expect(await consoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
            await consoleEmailConfig.addHeader(add);
            expect(await consoleEmailConfig.coloumnHeaderMatches(newEmailHeaders)).toBeTruthy();
            await consoleEmailConfig.removeHeader(add);
            expect(await consoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
        });
        it('[5463,5464]: Verify Email configuration header', async () => {
            await consoleEmailConfig.searchAndSelectCheckbox(emailID);
            await consoleEmailConfig.deleteConfigurationEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.clickSave();
            expect(await utilityCommon.isPopUpMessagePresent("Saved successfully.")).toBeTruthy();
        });
        it('[5463,5464]: Verify email configuration is accessible to Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email Configuration for Human resource LOB are not displayed to the Case Manager of same LOB');
        });
        it('[5463,5464]: Verify email configuration is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB are not displayed to the Case Manager of Facilities LOB');
        });
        it('[5463,5464]: Verify email configuration is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB are not displayed to the Case Manager of Facilities LOB');

        });
        it('[5463,5464]: Verify email configuration are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB is not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email Configuration for Human resource LOB is not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');

        });
        it('[5463,5464]: Verify email configuration are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB are not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email Configuration for Human resource LOB is not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');
        });
        it('[5463,5464]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.setDescription("test");
            await createEmailConfigPo.clickSave();
            expect(await utilityCommon.isPopUpMessagePresent('The alternate email IDs are already used. Specify different alternate email IDs.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            await createEmailConfigPo.clickCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5463,5464]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            let facilitiesEmail = "facilitymail@gmail.com"
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setEmailID(facilitiesEmail);
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.setDescription("test");
            // verify LOB is there
            expect(await createEmailConfigPo.getLobValue()).toBe("Facilities");
            await createEmailConfigPo.clickSave();
            // expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent"); SUCCESS MESSAGE IS NOT PRESENT ON UI
            // open the record and verify LOB is on edit screen
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmail);
            expect(await editEmailConfigPo.getLobValue()).toBe("Facilities");
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5474,5473,5472,5471,5470,5469]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[5474,5473,5472,5471,5470,5469]: Verify Email configuration Grid view', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            expect(await newExclusiveSubjectPo.isSaveButtonEnabled()).toBeFalsy();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify Email configuration Grid view and add new exclusive', async () => {
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Delete" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("update" + randomStr);
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('[5474,5473,5472,5471,5470,5469]: Set the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('update' + randomStr)).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid('update' + randomStr);
            await editEmailConfigPo.editExclusiveSubjectsButton();
            await editExclusiveSubjectPo.setSubject('updated123' + randomStr);
            await editExclusiveSubjectPo.clickSaveButton();
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid('Delete' + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeFalsy();
        });
        it('[5474,5473,5472,5471,5470,5469]: Delete the Email configuration', async () => {
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.searchAndSelectGridRecord(emailID);
            await consoleEmailConfig.deleteConfigurationEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(differntEmailConfigFacilities);
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify Global Exclusion should be displayed', async () => {
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });


        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy('Exclusion subject is not displayed on Human Resource email configuration to Case manager user');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Exclusion subject is not displayed on Human Resource email configuration to Case manager user');
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email configuration for Human Resource LOB is displayed to Facilities LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(facilitiesEmailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email configuration for Human Resource LOB is displayed to Facilities LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(facilitiesEmailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
            expect(await utilityGrid.isGridRecordPresent(facilitiesEmailID)).toBeFalsy();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email ID is not present');
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy('Record is not present in Exclusive grid');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Record is present in Exclusive grid');
            await utilityCommon.closeAllBlades();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email ID is present');
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy('Record is present in Exclusive grid');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Record is display in Exclusive grid');
            await utilityCommon.closeAllBlades();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify new Global Value with existing or old configuration', async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig2);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await utilityGrid.searchAndOpenHyperlink(emailConfig2.email);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            expect(await newExclusiveSubjectPo.isSaveButtonEnabled()).toBeFalsy();
            await newExclusiveSubjectPo.setSubject("Global2" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global2' + randomStr)).toBeTruthy();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            // Verify Global2 with old email id
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global2' + randomStr)).toBeFalsy();

            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated('Global2' + randomStr);
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Global2' + randomStr)).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            // Change LOB and verify same
            await utilityGrid.selectLineOfBusiness('Facilities');
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global2' + randomStr)).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated('Global2' + randomStr);
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Global2' + randomStr)).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw #passed
    describe('[5257,5258,5259,5232]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let acknowledgementTemplateHeaders: string[] = ["Type", "Operation Type", "Ticket Status", "Template Name"];
        it('[5257,5258,5259,5232]: Verify all templates', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            expect(await editEmailConfigPo.isColumnPresentInAcknowledgementTemplateGrid(acknowledgementTemplateHeaders)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Update"));
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Create"));
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
        });
        it('[5257,5258,5259,5232]: update the delete template', async () => {
            expect(await editEmailConfigPo.isTicketTypeAcknowledgementTemplateDisabled()).toBeTruthy("Ticket Type is enable");
            expect(await editEmailConfigPo.isOperationTypeAcknowledgementTemplateDisabled()).toBeTruthy("Operation Type is enable");
            expect(await editEmailConfigPo.isTicketStatusAcknowledgementTemplateDisabled()).toBeTruthy("Ticket status is enable");
            await editEmailConfigPo.selectAcknowledgementTemplate("Case Create Ack Template");
            await editEmailConfigPo.clickSaveAcknowledgementTemplate();
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid('Case Create Ack Template')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw #passed
    describe('[5249,5182,5250]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        it('[5249,5182,5250]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid("Private" + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeFalsy();
        });

        it('[5249,5182,5250]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
            expect(await editEmailConfigPo.isNewAvailableGlobalSubjectsDisplayed()).toBeTruthy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Private" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Private" + randomStr)).toBeFalsy();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.clickAvailableExclusionSubjectsCheckbox();
            await editEmailConfigPo.clickAssociatedSupportGroupRightArrow();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw #passed
    describe('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
            await apiHelper.createEmailConfiguration(differntEmailConfigFacilities);
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await utilityGrid.searchAndOpenHyperlink("bwfqa2019@gmail.com");
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createEmailConfiguration({ "email": "psilon@gmail.com", "incomingMailBoxName": incomingEmail.mailBoxName, "company": "Psilon" });
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink("psilon@gmail.com");
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.searchAndSelectRecordInExclusiveGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeFalsy("Private comment is present");
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Private" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Private" + randomStr)).toBeFalsy();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw #passed
    describe('[5183]: Exclusion Subject: Associate exclusion subject list verification for newly added exclusion subject', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
        });
        it('[5183]: Add exclusive subject', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        it('[5183]: Exclusion Subject: Associate exclusion subject list verification for newly added exclusion subject', async () => {
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Private" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Private" + randomStr)).toBeFalsy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw #passed
    describe('[5180,5179]: Exclusion Subject: Associate exclusion subject validation for newly added public subject with newly added email config', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
        });
        it('[5180,5179]: Add exclusive subject', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        it('[5180,5179]: Exclusion Subject: Associate exclusion subject validation for newly added public subject with newly added email config', async () => {
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createEmailConfiguration({ "email": "psilon@gmail.com", "incomingMailBoxName": incomingEmail.mailBoxName, "company": "Psilon" });

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink("psilon@gmail.com");
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming');
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
        });
    });

    //ankagraw #passed
    describe('[5114,5251,5168,5104,5382]: Acknowledgment Template: Deletion & status update shouldnt allow when Acknowledgment Template associated with email id', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateStatus = "Draft";
            caseTemplateData.templateName = randomStr + 'caseTemplateNameDraft'
            await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateStatus = "Inactive";
            caseTemplateData.templateName = randomStr + 'caseTemplateNameInactive'
            await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
        });
        it('[5114,5251,5168,5104,5382]: Exclusion Subject : Default associated public exclusion subject list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isCreateEmailTemplpateLinkDisplayed()).toBeTruthy();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(randomStr + 'caseTemplateNameDraft')).toBeFalsy();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(randomStr + 'caseTemplateNameInactive')).toBeFalsy();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(randomStr + 'caseTemplateName')).toBeTruthy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            expect(await editEmailConfigPo.isListAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent()).toBeFalsy("AvailableExclusionsSubject");
            expect(await editEmailConfigPo.isListAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent()).toBeTruthy("AssociatedExclusionsSubject");
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid('Case Closed Ack Template')).toBeTruthy("'Case Closed Ack Template' record not present");
        });
        it('[5114,5251,5168,5104,5382]: Acknowledgment Template: Deletion & status update shouldnt allow when Acknowledgment Template associated with email id', async () => {
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord('Case Closed Ack Template');
            await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
            expect(await utilityCommon.isPopUpMessagePresent("Template is already in use hence it can not be deleted.")).toBeTruthy("ERROR : Template is already in use hence it can not be deleted.");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate('Case Closed Ack Template');
            await editAcknowledgmentTemplatePo.selectStatusDropDown('Inactive');
            await editAcknowledgmentTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent("The Acknowledgement template is in use, so status cannot be changed")).toBeTruthy("The Acknowledgement template is in use, so status cannot be changed");
            await editAcknowledgmentTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
    });

    // #passed
    describe('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
        let templateData, randomStr = Math.floor(Math.random() * 1000000);
        it('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            templateData = {
                "templateName": 'GlobalCaseTemplateName' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummary' + randomStr,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": 'United States Support',
                "ownerGroup": "US Support 3",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName(templateData.templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('companytemplateName' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectDefaultCaseTemplate(templateData.templateName);
            await editEmailConfigPo.clickSaveButton();
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown('companytemplateName' + randomStr)).toBeTruthy();
            await editEmailConfigPo.clickCancelAcknowledgementTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown(templateData.templateName)).toBeTruthy();
            await editEmailConfigPo.clickCancelAcknowledgementTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5336,5337]: Verify acknowledgment template is accessible to Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy('Global Email Acknowledgement template for Human resource LOB are not displayed to the Case Manager of same LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Human resource LOB are not displayed to the Case Manager of same LOB');
        });

        it('[5336,5337]: Verify acknowledgment template is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');

            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('FacilitiesGlobalAckTemplate' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();

            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('FacilitiesAckTemplate' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[5336,5337]: Verify acknowledgment template is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case manager of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case manager of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeTruthy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case manager of same LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case manager of same LOB');
        });

        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeTruthy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');
        });
        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy('Global Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeFalsy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');

        });
        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown('companytemplateName' + randomStr)).toBeTruthy();
            await editEmailConfigPo.clickCancelAcknowledgementTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown(templateData.templateName)).toBeTruthy();
            await editEmailConfigPo.clickCancelAcknowledgementTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown('FacilitiesGlobalAckTemplate' + randomStr)).toBeFalsy();
            await editEmailConfigPo.clickCancelAcknowledgementTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown('FacilitiesAckTemplate' + randomStr)).toBeFalsy();
            await editEmailConfigPo.clickCancelAcknowledgementTemplate();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });

        it('[5336,5337]: Verify acknowledgment template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', BWF_PAGE_TITLES.EMAIL.ACKNOWLEDGMENT_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeTruthy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');

        });
        it('[5336,5337]: Verify acknowledgment template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy('Global Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeFalsy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //ankagraw #passed
    describe('[4707]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
        let trustedMail: string = "test@abc.com"
        it('[4707]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Trusted Email");
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            expect(await editEmailConfigPo.isMappedRequesterRequiredTextPresent()).toBeTruthy();
            expect(await editEmailConfigPo.isNewTrustedEmailRequiredTextPresent()).toBeTruthy();
            await editEmailConfigPo.setNewTrustedEmail(trustedMail);
            expect(await editEmailConfigPo.isNewTrustedEmailSaveBtnDisabled()).toBeTruthy();
            expect(await editEmailConfigPo.isValuePresentInDropDown("Barney")).toBeFalsy();
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            expect(await editEmailConfigPo.isValuePresentInDropDown("Thorn")).toBeFalsy();
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            expect(await editEmailConfigPo.isValuePresentInDropDown("Ochoa")).toBeFalsy();
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4707]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail(trustedMail);
            await editEmailConfigPo.selectMappedRequesterDropDown("Adam Pavlik");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();
            await editEmailConfigPo.selectAndClickCheckboxOnTrustedEmail(trustedMail);
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailCancelButtonOnTrustedEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            await editEmailConfigPo.clickEditTrustedEmailCancelButtonOnTrustedEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailSaveButtonOnTrustedEmail();
            expect(await editEmailConfigPo.isRecordPresentonTrustedEmail("Test@xyz.com")).toBeTruthy();
        });
    });
});
