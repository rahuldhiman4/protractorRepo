import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleEmailConfigurationPo from '../../pageobject/settings/email/console-email-configuration.po';
import createEmailConfigPo from '../../pageobject/settings/email/create-email-config.po';
import editEmailConfigPo from '../../pageobject/settings/email/edit-email-config.po';
import lobManagmentCreatePo from '../../pageobject/settings/lob/create-lob-config.po';
import lobManagmentConsolePo from '../../pageobject/settings/lob/define-lob-config.po';
import lobManagmentEditPo from '../../pageobject/settings/lob/edit-lob-config.po';
import lobManagementConsolePo from '../../pageobject/settings/lob/lob-management-console.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

xdescribe('Line of Business Permissions Tests Extended', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[5480]: [Email Configuration] Configure email with One Line of Business', async () => {
        let emailID = "test@gmail.com";
        let incomingEmail = {
            'mailBoxName': 'testEmail@gmail.com'
        }
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
        });
        it('[5480]: [Email Configuration] Configure email with One Line of Business', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await consoleEmailConfigurationPo.clickNewEmailConfiguration();
            expect(await createEmailConfigPo.isLineOfBusinessEnabled()).toBeFalsy();
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.clickSave();

            await consoleEmailConfigurationPo.clickNewEmailConfiguration();
            expect(await createEmailConfigPo.isLineOfBusinessEnabled()).toBeFalsy();
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.clickSave();
            expect(await utilityCommon.isPopUpMessagePresent('The alternate email IDs are already used. Specify different alternate email IDs.')).toBeTruthy();
            await createEmailConfigPo.clickCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5480]: [Email Configuration] Configure email with One Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('qliu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.setDescription("destrt");
            await editEmailConfigPo.clickSaveButton();
            await consoleEmailConfigurationPo.searchAndSelectCheckbox(emailID);
            expect(await consoleEmailConfigurationPo.isDeleteConfigurationEmailBtnEnable()).toBeTruthy();
        });
        it('[5480]: [Email Configuration] Configure email with One Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await consoleEmailConfigurationPo.clickNewEmailConfiguration();
            expect(await createEmailConfigPo.isLineOfBusinessEnabled()).toBeFalsy();
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.clickSave();
            expect(await utilityCommon.isPopUpMessagePresent('The alternate email IDs are already used. Specify different alternate email IDs.')).toBeTruthy();
            await createEmailConfigPo.clickCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5480]: [Email Configuration] Configure email with One Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await utilityGrid.selectLineOfBusiness("Human Resource");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.setDescription("updated description");
            await editEmailConfigPo.clickSaveButton();
            await consoleEmailConfigurationPo.searchAndSelectCheckbox(emailID);
            expect(await consoleEmailConfigurationPo.isDeleteConfigurationEmailBtnEnable()).toBeTruthy();

            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            expect(await consoleEmailConfigurationPo.isClickNewEmailConfigurationBtnPresent()).toBeFalsy();
            await consoleEmailConfigurationPo.searchAndSelectCheckbox(emailID);
        });
    });

    //ankagraw
    describe('[3952]: Verify Case BA can configure to allow all external users in trusted domain and Blocked email', async () => {
        let incomingEmail = {
            'mailBoxName': 'testEmail@gmail.com'
        }
        let emailIDHR = {
            'email': 'HR@bmc.com'
        }
        let emailIDFacility = {
            'email': 'Facilities@bmc.com',
            'lineOfBusiness': 'Facilities',
        }

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailIDHR);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailIDFacility);
        });
        it('[3952]: Verify Case BA can configure to allow all external users in trusted domain and Blocked email', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness("Human Resource");
            await utilityGrid.searchAndOpenHyperlink(emailIDHR.email);
            await editEmailConfigPo.selectTab("Trusted Email");
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail("*@*");
            await editEmailConfigPo.selectMappedRequesterDropDown("Al Allbrook");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();
            expect(await utilityCommon.isPopUpMessagePresent('*@* enables case creation for emails sent from any email ID.')).toBeTruthy("Popup message doesn't match");

            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail("testingCheck@gmail.com");
            await editEmailConfigPo.selectMappedRequesterDropDown("Adam Pavlik");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();

            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail("testingCheck@gmail.com");
            await editEmailConfigPo.selectMappedRequesterDropDown("Adam Warlock");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Mapping for same email address or domain already exists.')).toBeTruthy();
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');

            await editEmailConfigPo.selectAndClickCheckboxOnTrustedEmail("testingCheck@gmail.com");
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test");
            await editEmailConfigPo.clickEditTrustedEmailSaveButtonOnTrustedEmail();
            expect(await utilityCommon.isPopUpMessagePresent('Please enter valid Trusted Email')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test");
            await editEmailConfigPo.clickEditTrustedEmailSaveButtonOnTrustedEmail();
            expect(await utilityCommon.isPopUpMessagePresent('Please enter valid Trusted Email')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
        });
        it('[3952]: Verify Case BA can configure to allow all external users in trusted domain and Blocked email', async () => {
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailSaveButtonOnTrustedEmail();
            expect(await editEmailConfigPo.isRecordPresentonTrustedEmail("Test@xyz.com")).toBeTruthy();
            await editEmailConfigPo.selectAndClickCheckboxOnTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickRemoveTrustedEmailButtonOnTrustedEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await editEmailConfigPo.isRecordPresentonTrustedEmail("Test@xyz.com")).toBeFalsy();
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail("testingCheck@gmail.com");
            await editEmailConfigPo.selectMappedRequesterDropDown("Adam Pavlik");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();
            await editEmailConfigPo.selectTab("Blocked Email");
            await editEmailConfigPo.clickOnNewBlockedEmailBtn();
            await editEmailConfigPo.setEmailOnBlockedNewEmail("testingCheck@gmail.com");
            await editEmailConfigPo.clickOnSaveBlockedEmailBtn();
            await editEmailConfigPo.clickOnNewBlockedEmailBtn();
            await editEmailConfigPo.setEmailOnBlockedNewEmail("testingCheck@gmail.com");
            await editEmailConfigPo.clickOnSaveBlockedEmailBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Mapping for same email address or domain already exists.')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
        });
        it('[3952]: Verify Case BA can configure to allow all external users in trusted domain and Blocked email', async () => {
            await editEmailConfigPo.setEmailOnBlockedNewEmail("*@*");
            await editEmailConfigPo.clickOnSaveBlockedEmailBtn();
            expect(await utilityCommon.isPopUpMessagePresent('Please enter valid email address')).toBeTruthy();
            await utilityCommon.closePopUpMessage();
            await editEmailConfigPo.setEmailOnBlockedNewEmail("testing123@acc.com");
            await editEmailConfigPo.clickOnSaveBlockedEmailBtn();
            expect(await editEmailConfigPo.isRecordPresentonBlockedEmail("testing123@acc.com")).toBeTruthy();
            await editEmailConfigPo.selectAndClickCheckboxOnBlockedEmail("testing123@acc.com");
            await editEmailConfigPo.clickOnDelteBlockedEmailBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await editEmailConfigPo.isRecordPresentonBlockedEmail("testing123@acc.com")).toBeFalsy();
            await editEmailConfigPo.clickOnNewBlockedEmailBtn();
            await editEmailConfigPo.setEmailOnBlockedNewEmail("testing@bmc.com");
            await editEmailConfigPo.clickOnSaveBlockedEmailBtn();
        });
        it('[3952]: Verify Case BA can configure to allow all external users in trusted domain and Blocked email', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', BWF_PAGE_TITLES.EMAIL.CONFIGURATION);
            await utilityGrid.selectLineOfBusiness("Facilities");
            await utilityGrid.searchAndOpenHyperlink(emailIDFacility.email);
            await editEmailConfigPo.selectTab("Trusted Email");
            expect(await editEmailConfigPo.isRecordPresentonTrustedEmail("testingCheck@gmail.com")).toBeFalsy();
            await editEmailConfigPo.selectTab("Blocked Email");
            expect(await editEmailConfigPo.isRecordPresentonBlockedEmail("testing@bmc.com")).toBeFalsy();
        });
    });

    //ankagraw
    describe('[12040]: Validate that tenant admin/case BA is able to view/update the LOB record', async () => {
        it('[12040]: Validate that tenant admin/case BA is able to view/update the LOB record', async () => {
            await navigationPage.signOut();
            await loginPage.login('tadmin');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Define Line of Business', 'LOB Management Console - Business Workflows');
            await lobManagmentConsolePo.clickAddLobBtn();
            await lobManagmentCreatePo.setName('testLOB');
            await lobManagmentCreatePo.setDescription('descriptionLOB');
            await lobManagmentCreatePo.saveLob();
            //waiting for lob create
            await browser.sleep(200000);
            await apiHelper.apiLogin('tadmin');
            await apiHelper.updateFoundationEntity('Person', 'qkatawazi', { functionalRole: "testLOB" });
            await lobManagmentConsolePo.searchAndOpenLob('testLOB');
            await lobManagmentEditPo.setName('testLOB123');
            await lobManagmentEditPo.setDescription('descriptionLOB123');
            expect(await lobManagmentEditPo.isBundleNameEnabled()).toBeTruthy();
            await lobManagmentEditPo.clickOnSaveButton();
            await lobManagmentConsolePo.searchAndOpenLob('testLOB123');
            expect(await lobManagmentEditPo.getBundleNameText()).toBe('com.petramco.testLOB');
            await lobManagmentEditPo.clickOnCancelButton();
        });

        it('[12040]: Validate that tenant admin/case BA is able to view/update the LOB record', async () => {
            let lineOfBusinessConfigurationList: string[] = ['Line of Business', 'Define Line of Business', 'Manage Line of Business']
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Manage Line of Business', 'LOB Configuration - Edit - Business Workflows');
            expect(await lobManagementConsolePo.isLobBundleDisabled()).toBeTruthy();
            await apiHelper.apiLogin('tadmin');
            expect(await apiCoreUtil.getPersonFunctionalRoles('qkatawazi')).toContain(await apiCoreUtil.getLineOfBusinessGuid('testLOB123'));
            expect(await lobManagementConsolePo.isTabPresent("Agents")).toBeTruthy();
            expect(await lobManagementConsolePo.isTabPresent("Categorization")).toBeTruthy();
            expect(await lobManagementConsolePo.isTabPresent("Support Group")).toBeTruthy();
            await lobManagementConsolePo.setLobDescription(' Human Resource Description');
            await lobManagementConsolePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            expect(await navigationPage.isSettingSubMenusMatches("Line of Business", lineOfBusinessConfigurationList)).toBeFalsy("Application Configuration");

            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Manage Line of Business', 'LOB Configuration - Edit - Business Workflows');
            expect(await lobManagementConsolePo.isLobBundleDisabled()).toBeTruthy();
            await lobManagementConsolePo.setLobDescription('Facilities Description');
            await lobManagementConsolePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        it('[12040]: Validate that tenant admin/case BA is able to view/update the LOB record', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Manage Line of Business', 'LOB Configuration - Edit - Business Workflows');
            await utilityGrid.selectLineOfBusiness("Human Resource");
            await lobManagementConsolePo.setLobDescription(' Human Resource');
            await lobManagementConsolePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Line of Business--Manage Line of Business', 'LOB Configuration - Edit - Business Workflows');
            await utilityGrid.selectLineOfBusiness("Facilities");
            await lobManagementConsolePo.setLobDescription('Facilities');
            await lobManagementConsolePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });
    });
});
