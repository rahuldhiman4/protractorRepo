import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import ConsoleEmailConfig from '../../pageobject/settings/email/console-email-configuration.po';
import createEmailConfigPo from '../../pageobject/settings/email/create-email-config.po';
import editEmailConfigPo from '../../pageobject/settings/email/edit-email-config.po';
import editExclusiveSubjectPo from '../../pageobject/settings/email/edit-exclusive-subject.po';
import newExclusiveSubjectPo from '../../pageobject/settings/email/new-exclusive-subject.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
describe('Configuration Email ', () => {
    let incomingGUID, outgoingGUID, emailGuid, emailconfigGUID;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //ankagraw
    describe('[DRDMV-8528,DRDMV-8527]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let emailID = "bmctemptestemail@gmail.com";
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            emailGuid = await apiHelper.createEmailConfiguration();
        });
        it('Verify Email configuration header', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            let emailHeaders: string[] = ["Email ID", "Company", "Default Email", "Status"];
            let add: string[] = ["ID"];
            let newEmailHeaders: string[] = ["Email ID", "ID", "Company", "Default Email", "Status"];
            expect(await ConsoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
            await ConsoleEmailConfig.addHeader(add);
            expect(await ConsoleEmailConfig.coloumnHeaderMatches(newEmailHeaders)).toBeTruthy();
            await ConsoleEmailConfig.removeHeader(add);
            expect(await ConsoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
            await ConsoleEmailConfig.searchAndSelectCheckbox(emailID);
            await ConsoleEmailConfig.deleteConfigurationEmail();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-8528,DRDMV-8527]: Verify Email configuration header', async () => {
            await ConsoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.selectEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.clickSave();
        });
    });

    //ankagraw
    describe('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        let emailID = "bmctemptestemail@gmail.com";
        it('Verify Email configuration Grid view', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            expect(await newExclusiveSubjectPo.isSaveButtonEnabled()).toBeFalsy();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Delete" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("update" + randomStr);
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('Set the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('update' + randomStr)).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('update' + randomStr);
            await editEmailConfigPo.editExclusiveSubjectsButton();
            await editExclusiveSubjectPo.setSubject('updated123' + randomStr);
            await editExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('Delete' + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeFalsy();
        });
        it('Delete the Email configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.clickCheckBoxOfValueInGrid(emailID);
            await ConsoleEmailConfig.deleteConfigurationEmail();
            await utilCommon.clickOnWarningOk();
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeFalsy();
        });
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Verify Global Exclusion should be displayed', async () => {
            await apiHelper.apiLogin('tadmin');
            emailGuid = await apiHelper.createEmailConfiguration();
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
        });
    });

    //ankagraw
    it('[DRDMV-10410,DRDMV-10418,DRDMV-10428]: Support Group: Associate Support group tab in Email Configuration.', async () => {
        let emailID = "bmctemptestemail@gmail.com";
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
        await utilGrid.searchAndOpenHyperlink(emailID);
        await editEmailConfigPo.selectTab("Associated Support Group");
        expect(await editEmailConfigPo.isSupportGroupListHeaderPresentInAssociatedSupportGroupTab()).toBeTruthy();
        expect(await editEmailConfigPo.isAssociatedSupportGroupListHeaderPresentInAssociatedSupportGroupTab()).toBeTruthy();
        await editEmailConfigPo.selectBusinessUnitInAssociatedSupportGroupTab("Facilities Support");
        expect(await editEmailConfigPo.getSupportGroupFromSupportGroupListInAssociatedSupportGroupTab()).toBe("Facilities");
    });

    //ankagraw
    it('[DRDMV-10419]: Support Group: Default Email checkbox', async () => {
        let emailID = "bmctemptestemail@gmail.com";
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
        await utilGrid.searchAndOpenHyperlink(emailID);
        await editEmailConfigPo.clickDefaultMailIdCheckbox("False");
        await editEmailConfigPo.clickSaveButton();
        expect(await utilCommon.isPopUpMessagePresent("One Email Id for the company needs to be marked as default. If another email configurations for the company exist, please mark one of them as default instead")).toBeTruthy();
        await editEmailConfigPo.clickDefaultMailIdCheckbox("True");
        expect(await editEmailConfigPo.isSaveButtonEnabled()).toBeFalsy();
    });

    //ankagraw
    it('[DRDMV-10438,DRDMV-10437,DRDMV-10436,DRDMV-10552]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let emailID = "bmctemptestemail@gmail.com";
        let acknowledgementTemplateHeaders: string[] = ["Type", "Operation Type", "Ticket Status", "Template Name"];
        await navigationPage.gotoSettingsPage();
        expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
        await utilGrid.searchAndOpenHyperlink(emailID);
        await editEmailConfigPo.selectTab("Acknowledgment Templates");
        expect(await editEmailConfigPo.isColumnPresentInAcknowledgementTemplateGrid(acknowledgementTemplateHeaders)).toBeTruthy();
        expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Update"));
        expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Create"));
        await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
        await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
        expect(await editEmailConfigPo.isTicketTypeAcknowledgementTemplateDisabled()).toBeTruthy("Ticket Type is enable");
        expect(await editEmailConfigPo.isOperationTypeAcknowledgementTemplateDisabled()).toBeTruthy("Operation Type is enable");
        expect(await editEmailConfigPo.isTicketStatusAcknowledgementTemplateDisabled()).toBeTruthy("Ticket status is enable");
        await editEmailConfigPo.selectAcknowledgementTemplate("Case Create Ack Template");
        await editEmailConfigPo.clickSaveAcknowledgementTemplate();
        expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid('Case Create Ack Template')).toBeTruthy();
    });
});