import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationEventConsolePage from '../../pageobject/settings/notification-config/console-notification-event.po';
import notificationTempGridPage from "../../pageobject/settings/notification-config/console-notification-template.po";
import createNotificationEventPage from '../../pageobject/settings/notification-config/create-notification-event.po';
import createNotificationTemplatePage from '../../pageobject/settings/notification-config/create-notification-template.po';
import editNotificationTemplate from "../../pageobject/settings/notification-config/edit-notification-template.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe("Notification Template", () => {
    let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //radhiman
    describe('[DRDMV-19109]: [Copy Notification] - UI behavior when copying a notification template', async () => {
        let notificationTemplateName = 'DRDMV-19109_CopiedTemplate';
        it('[DRDMV-19109]: [Copy Notification] - UI behavior when copying a notification template', async () => {
            await expect(notificationTempGridPage.isCopyTemplateButtonDisabled()).toBeTruthy();
            await utilGrid.searchAndSelectGridRecord("Task SLA Missed");
            await notificationTempGridPage.clickCopyTemplate();
            //Validate 'Copy Template' Window title and fields present
            await expect(notificationTempGridPage.getTitleCopyNotificationTemplateWindow()).toBe("Copy Template");
            await expect(notificationTempGridPage.isCompanyDropDownPresentInCopyTempWindow()).toBeTruthy();
            await expect(notificationTempGridPage.isTemplateNameTxtBoxPresentInCopyTempWindow()).toBeTruthy();
            //Clear All fields and validate if the Copy button is disabled
            await notificationTempGridPage.setTemplateNamePresentInCopyTempWindow(" ");
            await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
            // Select company drpdwn value and keep tempName empty and validate if the Copy button is disabled
            await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow("Petramco");
            await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
            //Clear company drpdwn value and Enter some tempName and validate if the Copy button is disabled
            await notificationTempGridPage.clearCompanyDropDownValPresentInCopyTempWindow();
            await notificationTempGridPage.setTemplateNamePresentInCopyTempWindow(notificationTemplateName);
            await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
            //Select Company drpdown value again, and click Copy Template button
            await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow("Petramco");
            await notificationTempGridPage.clickCopyTemplateButtonInCopyTempWindow();
            await editNotificationTemplate.clickOnCancelButton();
            //Validate if the new copied template is created
            await utilGrid.clickCheckBoxOfValueInGrid("Task SLA Missed");
            await utilGrid.clearFilter();
            expect(await utilGrid.isGridRecordPresent(notificationTemplateName)).toBeTruthy("Notification template not copied");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate(notificationTemplateName);
        });
    });

    //asahitya  
    it('[DRDMV-14062]: To create new template with an event', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', 'Manage Notification Event - Business Workflows');
        await notificationEventConsolePage.clickAddNotificationEventBtn();
        await createNotificationEventPage.setEventName('Case Priority Change' + randomStr);
        await createNotificationEventPage.setCompanyValue('Petramco');
        await createNotificationEventPage.setDescription('DRDMV-14062 Desc');
        await createNotificationEventPage.saveEventConfig();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
        await notificationTempGridPage.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePage.selectModuleName('Cases');
        expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Business Unit's Manager", "Assigned Department's Manager", "Assigned Group's Manager", "Assignee", "Assignee's Manager", "Contact", "Contact's Manager", "External Requester", "Requester", "Requester's Manager", "Assigned Business Unit", "Assigned Department", "Assigned Group"])).toBeTruthy('Recipient List is not matching');
        await createNotificationTemplatePage.selectEvent('Case Priority Change' + randomStr);
        await createNotificationTemplatePage.setTemplateName('DRDMV-14062' + randomStr);
        await createNotificationTemplatePage.setDescription('DRDMV-14062' + randomStr);
        await createNotificationTemplatePage.setAlertMessage('Priority is change');
        await createNotificationTemplatePage.clickOnEmailTab();
        await createNotificationTemplatePage.setSubject('Priority is change');
        await editNotificationTemplate.clickRecipientsCheckbox("Assignee's Manager", "BCC");
        await editNotificationTemplate.clickRecipientsCheckbox("External Requester", "TO");
        await editNotificationTemplate.clickRecipientsCheckbox("Assigned Group", "CC");
        await createNotificationTemplatePage.clickOnSaveButton();
        await utilCommon.closeBladeOnSettings();
        await utilGrid.searchAndOpenHyperlink('DRDMV-14062' + randomStr);
        expect(await editNotificationTemplate.getEventName()).toBe('Case Priority Change' + randomStr);
        expect(await editNotificationTemplate.getModuleName()).toBe('Cases');
        expect(await editNotificationTemplate.isRecipientsCheckboxChecked("Assignee's Manager", "BCC")).toBeTruthy();
        expect(await editNotificationTemplate.isRecipientsCheckboxChecked("External Requester", "TO")).toBeTruthy();
        expect(await editNotificationTemplate.isRecipientsCheckboxChecked("Assigned Group", "CC")).toBeTruthy();
        await utilCommon.closeBladeOnSettings();
        await utilGrid.clearGridSearchBox();
    });

    //asahitya
    it('[DRDMV-2835]: AC: Notification Template_Console Columns', async () => {
        let columns: string[] = ['GUID', 'ID', 'Label'];
        let allColumns: string[] = ['Company', 'Description', 'Event', 'Modified Date', 'Module Name', 'Status', 'Template Name', 'GUID', 'ID', 'Label'];
        let defaultColumns: string[] = ['Company', 'Description', 'Event', 'Modified Date', 'Module Name', 'Status', 'Template Name'];
        await notificationTempGridPage.addGridColumns(columns);
        expect(await notificationTempGridPage.areColumnHeaderMatches(allColumns)).toBeTruthy('Columns are not matching');
        expect(await notificationTempGridPage.isGridColumnSorted('Template Name')).toBeTruthy('Template Name column is not sorted');
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
        expect(await notificationTempGridPage.areColumnHeaderMatches(allColumns)).toBeTruthy('Columns are not matching');
        expect(await notificationTempGridPage.isGridColumnSorted('Template Name')).toBeTruthy('Template Name column is not sorted');
        await notificationTempGridPage.removeGridColumns(columns);
        expect(await notificationTempGridPage.areColumnHeaderMatches(defaultColumns)).toBeTruthy('Default Columns are not matching');
    });

    //asahitya
    describe('[DRDMV-14061]: Availability of Recipient List on OOB Global Template', async () => {
        it('[DRDMV-14061]: Availability of Recipient List on OOB Global Template', async () => {
            await utilGrid.searchAndOpenHyperlink('New Signature Template');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers", "Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Case Approval Module is not matching');
            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Case Watchlist - Status Change');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Followers"])).toBeTruthy('Recipient List of Case Watchlist Module is not matching');
            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Case Agent Assignment');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Business Unit's Manager", "Assigned Department's Manager", "Assigned Group's Manager", "Assignee", "Assignee's Manager", "Contact", "Contact's Manager", "External Requester", "Requester", "Requester's Manager", "Assigned Business Unit", "Assigned Department", "Assigned Group"])).toBeTruthy('Recipient List of Cases Module is not matching');
            await utilCommon.closeBladeOnSettings();
        });
        it('[DRDMV-14061]: Availability of Recipient List on OOB Global Template', async () => {
            await utilGrid.searchAndOpenHyperlink('Article Reviewer Assignment');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Reviewer", "Assignee", "Assignee's Manager", "Reviewer's Manager"])).toBeTruthy('Recipient List of Knowledge Module is not matching');
            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Knowledge Approve');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers", "Reviewer", "Assignee", "Assigned Group", "Reviewer Group", "Author"])).toBeTruthy('Recipient List of Knowledge Approval Module is not matching');
            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Case SLA Missed');
            expect(await createNotificationTemplatePage.areRecipientsMatches([])).toBeTruthy('Recipient List of SLA Module is not matching');
            await utilCommon.closeBladeOnSettings();
        });
        it('[DRDMV-14061]: Availability of Recipient List on OOB Global Template', async () => {
            await utilGrid.searchAndOpenHyperlink('Notes from Activity Feed in Case');
            expect(await createNotificationTemplatePage.areRecipientsMatches([])).toBeTruthy('Recipient List of Social Module is not matching');
            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Task - Approve Template');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers", "Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Task Approval Module is not matching');
            await utilCommon.closeBladeOnSettings();
            await utilGrid.searchAndOpenHyperlink('Task Agent Assignment');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Tasks Module is not matching');
            await utilCommon.closeBladeOnSettings();
            // await utilGrid.searchAndOpenHyperlink('MC Flow Error');
            // expect(await createNotificationTemplatePage.areRecipientsMatches(["Multi-cloud Admins"])).toBeTruthy('Recipient List of MultiCloud Module is not matching');
            // await utilCommon.closeBladeOnSettings();
        });
    });

    it('[DRDMV-14082]: Add new recipient as Individual/Group and availability of fields on Add recipient screen', async () => {
        let eventData = {
            eventName: 'DRDMV-14082' + randomStr
        }
        let notificationData = {
            description: 'DRDMV-14082 desc',
            module: 'Cases',
            eventName: 'DRDMV-14082' + randomStr,
            templateName: 'DRDMV-14082 name' + randomStr,
            alertMessage: 'Alert Message text',
            emailBody: 'Email Body text',
            emailSubject: 'Email Subject text'
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createNotificationEvent(eventData);
        await apiHelper.createNotificationTemplate(notificationData);

        await utilGrid.searchAndOpenHyperlink('DRDMV-14082 name' + randomStr);
        await editNotificationTemplate.clickAddRecipientsBtn();
        expect(await editNotificationTemplate.isSearchRecipientDispalyed()).toBeTruthy('Search Recipient field is not dispalyed');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Recipient Type');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Company');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Business Unit');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Department');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Support Group');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Save');
        expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Cancel');

        await editNotificationTemplate.selectDropdownWithName('Company', 'Petramco');
        await editNotificationTemplate.selectDropdownWithName('Business Unit', 'HR Support');
        await editNotificationTemplate.selectDropdownWithName('Support Group', 'Compensation and Benefits');
        await editNotificationTemplate.clickApplyButton();
        await editNotificationTemplate.selectIndividualRecipient('Elizabeth Peters');
        await editNotificationTemplate.saveAddRecipients();

        await editNotificationTemplate.clickAddRecipientsBtn();
        await editNotificationTemplate.selectRecipientType('Group');
        await editNotificationTemplate.selectDropdownWithName('Company', 'Petramco');
        await editNotificationTemplate.selectDropdownWithName('Business Unit', 'Australia Support');
        await editNotificationTemplate.clickApplyButton();
        await editNotificationTemplate.selectIndividualRecipient('AU Support 1');
        await editNotificationTemplate.saveAddRecipients();
        await editNotificationTemplate.clickRecipientsCheckbox('Elizabeth Peters', 'TO');
        await editNotificationTemplate.clickRecipientsCheckbox('SG - Australia Support - AU Support 1', 'CC');
        await editNotificationTemplate.clickOnSaveButton();

        await utilGrid.searchAndOpenHyperlink('DRDMV-14082 name' + randomStr);
        await editNotificationTemplate.clickRecipientsCheckbox('Elizabeth Peters', 'TO');
        await editNotificationTemplate.clickRecipientsCheckbox('SG - Australia Support - AU Support 1', 'CC');
        await editNotificationTemplate.clickOnSaveButton();

        await utilGrid.searchAndOpenHyperlink('DRDMV-14082 name' + randomStr);
        expect(await editNotificationTemplate.isRecipientDisplayed('Elizabeth Peters')).toBeTruthy('Elizabeth is not present in Recipient list');
        expect(await editNotificationTemplate.isRecipientDisplayed('SG - Australia Support - AU Support 1')).toBeTruthy('AU Support 1 is not present in Recipient list');
        await utilCommon.closeBladeOnSettings();
    });

    describe('[DRDMV-16012,DRDMV-16038,DRDMV-16037]: Verify Able to define Notification template which allow to be used for Email based approval', () => {
        it('[DRDMV-16012,DRDMV-16038,DRDMV-16037]: Verify Able to define Notification template which allow to be used for Email based approval', async () => {
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            expect(await createNotificationTemplatePage.isEmailBasedApprovalFlagDisplayed()).toBeFalsy('Email based approval flag is displayed');
            await createNotificationTemplatePage.setTemplateName('Email Based Approval DRDMV-16012');
            await createNotificationTemplatePage.selectModuleName('Case - Approval');
            await createNotificationTemplatePage.selectNthEvent('Email Based Approval', 1);
            await createNotificationTemplatePage.selectEmailBasedApprovalToggle(true);
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers"])).toBeTruthy('Recipient List of Case Approval Module is not matching');
            await createNotificationTemplatePage.setDescription('Description');
            await createNotificationTemplatePage.setAlertMessage('Sample Alert Text');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Sample Subject text');
            await createNotificationTemplatePage.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closeAllBlades();

            await utilGrid.clearFilter();
            await utilGrid.searchAndOpenHyperlink('Email Based Approval DRDMV-16012');
            expect(await editNotificationTemplate.getEventName()).toBe('Email Based Approval');
            expect(await editNotificationTemplate.isEmailBasedApprovalFlagEnabled()).toBeFalsy('Toggle is enabled');
            expect(await editNotificationTemplate.isNotificationMethodDisabled()).toBeTruthy('Notification Method is enabled');
            await editNotificationTemplate.updateDescription('Updated description');
            await editNotificationTemplate.openAlertEditMessageText();
            await editNotificationTemplate.updateAlertEmailMsgs('Updated Alert Subject');
            await editNotificationTemplate.saveEmailAlertMsg();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await editNotificationTemplate.clickOnEmailTab();
            await editNotificationTemplate.openEmailBodyEditMessageText();
            await editNotificationTemplate.updateAlertEmailMsgs('Updated Email Body');
            await editNotificationTemplate.saveEmailAlertMsg();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await editNotificationTemplate.openEmailSubjectEditMessageText();
            await editNotificationTemplate.updateEmailSubject('Updated Email Subject');
            await editNotificationTemplate.saveEmailAlertMsg();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await editNotificationTemplate.clickOnSaveButton();
            await utilCommon.closeBladeOnSettings();
            await utilGrid.clearGridSearchBox();
            await utilGrid.searchAndSelectGridRecord('Email Based Approval DRDMV-16012');
            await notificationTempGridPage.deleteTemplate();
            expect(await utilCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy();
        });
        it('[DRDMV-16012,DRDMV-16038,DRDMV-16037]: Verify Able to define Notification template which allow to be used for Email based approval', async () => {
            //Create the notification template with Email Based Approval Flag as No
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.setTemplateName('Email Based Approval DRDMV-16012_2');
            await createNotificationTemplatePage.selectModuleName('Case - Approval');
            await createNotificationTemplatePage.selectNthEvent('Email Based Approval', 1);
            await createNotificationTemplatePage.selectEmailBasedApprovalToggle(false);
            await createNotificationTemplatePage.setDescription('Description2');
            await createNotificationTemplatePage.setAlertMessage('Sample Alert Text2');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Sample Subject text2');
            await createNotificationTemplatePage.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await utilGrid.clearGridSearchBox();
            await utilGrid.searchAndSelectGridRecord('Email Based Approval DRDMV-16012_2');
            await notificationTempGridPage.deleteTemplate();
            expect(await utilCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy();

            //Create the notification template without selecting Email Based Approval
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.setTemplateName('Email Based Approval DRDMV-16012_3');
            await createNotificationTemplatePage.selectModuleName('Case - Approval');
            await createNotificationTemplatePage.selectNthEvent('Email Based Approval', 1);
            await createNotificationTemplatePage.setDescription('Description3');
            await createNotificationTemplatePage.setAlertMessage('Sample Alert Text3');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Sample Subject text3');
            await createNotificationTemplatePage.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await utilGrid.clearGridSearchBox();
            await utilGrid.searchAndSelectGridRecord('Email Based Approval DRDMV-16012_3');
            await notificationTempGridPage.deleteTemplate();
            expect(await utilCommon.isPopUpMessagePresent('Record(s) deleted successfully.')).toBeTruthy();
        });
        afterAll(async () => {
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.deleteEmailOrNotificationTemplate('Email Based Approval DRDMV-16012');
            await apiHelper.deleteEmailOrNotificationTemplate('Email Based Approval DRDMV-16012_2');
            await apiHelper.deleteEmailOrNotificationTemplate('Email Based Approval DRDMV-16012_3');
        });
    });

    it('[DRDMV-16034]: Verify Notification method selected as alert will throw an error on save if Email based approval is selcted', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
        await notificationTempGridPage.clickOnCreateNotificationTemplate();
        expect(await createNotificationTemplatePage.isEmailBasedApprovalFlagDisplayed()).toBeFalsy('Email based approval flag is displayed');
        await createNotificationTemplatePage.setTemplateName('Email Based Approval DRDMV-16034');
        await createNotificationTemplatePage.selectModuleName('Case - Approval');
        await createNotificationTemplatePage.selectDefaultNotificationMethod('Alert');
        await createNotificationTemplatePage.selectEvent('Email Based Approval');
        await createNotificationTemplatePage.selectEmailBasedApprovalToggle(true);
        expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers"])).toBeTruthy('Recipient List of Case Approval Module is not matching');
        await createNotificationTemplatePage.setDescription('Description');
        await createNotificationTemplatePage.setAlertMessage('Sample Alert Text');
        await createNotificationTemplatePage.clickOnEmailTab();
        await createNotificationTemplatePage.setSubject('Sample Subject text');
        await createNotificationTemplatePage.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (222107): A template already exists for the selected combination of event, module, and line of business. Specify a different combination.')).toBeTruthy();
        await utilCommon.closeBladeOnSettings();
        await notificationTempGridPage.clickOnCreateNotificationTemplate();
        await createNotificationTemplatePage.setTemplateName('Email Based Approval DRDMV-16034');
        await createNotificationTemplatePage.selectModuleName('Case - Approval');
        await createNotificationTemplatePage.selectEvent('Case Reopened');
        expect(await createNotificationTemplatePage.isEmailBasedApprovalFlagDisplayed()).toBeFalsy('Email based approval flag is displayed');
        await utilCommon.closeBladeOnSettings();
    });

    it('[DRDMV-16035]: Verify OOB Notification Event and Template for Email based Approval', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', 'Manage Notification Event - Business Workflows');
        await utilGrid.clearFilter();
        await utilGrid.addFilter('Company', '- Global -', 'text');
        await utilGrid.searchOnGridConsole('Email Based Approval');
        expect(await notificationEventConsolePage.getDescriptionValue()).toBe('Notification Event');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
        await utilGrid.clearFilter();
        await utilGrid.addFilter('Company', '- Global -', 'textbox');
        await utilGrid.searchAndOpenHyperlink('Email Based Approval');
        expect(await editNotificationTemplate.getSelectedFieldValue('Event')).toBe('Email Based Approval');
        expect(await editNotificationTemplate.getSelectedFieldValue('Company')).toBe('- Global -');
        expect(await editNotificationTemplate.getSelectedFieldValue('Status')).toBe('Active');
        expect(await editNotificationTemplate.getSelectedFieldValue('Module')).toBe('Case - Approval');
        expect(await editNotificationTemplate.getSelectedFieldValue('Default Notification Method')).toBe('Email');
        expect(await editNotificationTemplate.isEmailBasedApprovalFlagTrue()).toBeTruthy('Email Based Approval Flag is not set to true');
        expect(await createNotificationTemplatePage.areRecipientsMatches(['Approvers'])).toBeTruthy('Recipients list is not matching');
        expect(await editNotificationTemplate.getDescriptionValue()).toBe('Email Based Approval Notification Template');
        await editNotificationTemplate.clickOnEmailTab();
        await editNotificationTemplate.openEmailSubjectEditMessageText();
        expect(await editNotificationTemplate.getEmailSubjectValue()).toBe('$10051$ has been sent for approval.');
        await editNotificationTemplate.cancelEmailSubjectBlade();
        await editNotificationTemplate.openEmailBodyEditMessageText();
        expect(await editNotificationTemplate.isEmailBodyContains('Case Details')).toBeTruthy('Case Details is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Requester')).toBeTruthy('Requester is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Request Date')).toBeTruthy('Request Date is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Case ID')).toBeTruthy('Case ID is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Priority')).toBeTruthy('Priority is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Status')).toBeTruthy('Status is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Summary')).toBeTruthy('Summary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Description')).toBeTruthy('Descripton is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Requester Primary')).toBeTruthy('Requester Primary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Created Date Primary')).toBeTruthy('Created Date Primary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Request Secondary')).toBeTruthy('Request Secondary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Priority  Primary')).toBeTruthy('Priority Primary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Ticket Status GUID Primary')).toBeTruthy('Ticket Status GUID Primary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Summary Primary')).toBeTruthy('Summary Primary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Description Primary')).toBeTruthy('Description Primary is not present');
        expect(await editNotificationTemplate.isEmailBodyContains('Below mentioned case is sent for approval')).toBeTruthy('Below mentioned case is sent for approval is not present');

        await editNotificationTemplate.cancelEmailBodyBlade();
        await utilCommon.closeBladeOnSettings();
    });

});
