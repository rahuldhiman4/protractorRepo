import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationEventConsolePage from '../../pageobject/settings/notification-config/console-notification-event.po';
import notificationTempGridPage from "../../pageobject/settings/notification-config/console-notification-template.po";
import createNotificationEventPage from '../../pageobject/settings/notification-config/create-notification-event.po';
import createNotificationTemplatePage from '../../pageobject/settings/notification-config/create-notification-template.po';
import editNotificationEventPage from '../../pageobject/settings/notification-config/edit-notification-event.po';
import editNotificationTemplate from "../../pageobject/settings/notification-config/edit-notification-template.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES, DropDownType } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';


describe("Notification Template", () => {
    let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //Failing -even after clear save button is enabled   - log defect
    describe('[3898]: [Copy Notification] - UI behavior when copying a notification template', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notificationTemplateName = '3898_CopiedTemplate' + randomStr;
        let notificationTemplateNameUpdated = '3898_CopiedTemplate_Updated' + randomStr;
        it('[3898]: [Copy Notification] - UI behavior when copying a notification template', async () => {
            await expect(notificationTempGridPage.isCopyTemplateButtonDisabled()).toBeTruthy();
            await utilityGrid.searchAndSelectGridRecord("Task SLA Missed");
            await notificationTempGridPage.clickCopyTemplate();
            //Validate 'Copy Template' Window title and fields present
            expect(await notificationTempGridPage.getTitleCopyNotificationTemplateWindow()).toBe("Copy Template");
            expect(await notificationTempGridPage.isCompanyDropDownPresentInCopyTempWindow()).toBeTruthy();
            expect(await notificationTempGridPage.isTemplateNameTxtBoxPresentInCopyTempWindow()).toBeTruthy();
            //Clear All fields and validate if the Copy button is disabled
            await notificationTempGridPage.clearTemplateNamePresentInCopyTempWindow();
            await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
            // Select company drpdwn value and keep tempName empty and validate if the Copy button is disabled
            await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow("Petramco");
            expect(await notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
            //Clear company drpdwn value and Enter some tempName and validate if the Copy button is disabled
            await notificationTempGridPage.clearCompanyDropDownValPresentInCopyTempWindow();
            await notificationTempGridPage.setTemplateNamePresentInCopyTempWindow(notificationTemplateName);
            expect(await notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
            //Select Company drpdown value again, and click Copy Template button
            await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow("Petramco");
            await notificationTempGridPage.clickCopyTemplateButtonInCopyTempWindow();
            await utilityCommon.closePopUpMessage();
            await browser.sleep(1000);
            await editNotificationTemplate.clickOnCancelButton();
            //Validate if the new copied template is created
            await utilityGrid.clickCheckBoxOfValueInGrid("Task SLA Missed");
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateName)).toBeTruthy("Notification template not copied");
        });

        it('[3898]: [Copy Notification] - UI behavior when copying a notification template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.searchAndSelectGridRecord("Case Agent Assignment");
            await notificationTempGridPage.clickCopyTemplate();
            //Select Company drpdown value again, and click Copy Template button
            await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow("Petramco");
            await notificationTempGridPage.setTemplateNamePresentInCopyTempWindow(notificationTemplateNameUpdated);
            await notificationTempGridPage.clickCopyTemplateButtonInCopyTempWindow();
            expect(await utilityCommon.isPopUpMessagePresent('Template is copied successfully')).toBeTruthy('Record saved successfully confirmation message not displayed.');
            await utilityCommon.closePopUpMessage();
            await editNotificationTemplate.clickOnCancelButton();
            await utilityGrid.clickCheckBoxOfValueInGrid("Case Agent Assignment");
            await utilityGrid.clearFilter();
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeTruthy("Notification template not copied");
        });

        it('[3898]: Verify if copied notification templates are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeTruthy('Human Resources LOB copied notification templates is not visible to same LOB case manager');
        });

        it('[3898]: Verify if copied notification templates are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeFalsy('Human Resources LOB copied notification templates is not visible to different LOB case BA');
        });

        it('[3898]: Verify if copied notification templates are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeFalsy('Human Resources LOB copied notification templates is not visible to different LOB case manager');
        });

        it('[3898]: Verify if copied notification templates are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeTruthy('Human Resources LOB copied notification templates is not visible to same LOB with different case BA');
        });

        it('[3898]: Verify if copied notification templates are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeTruthy('Human Resources LOB copied notification templates is not visible to case manager with multiple LOB access');

            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeFalsy('Human Resources LOB copied notification templates is visible to case manager with multiple LOB access');
        });

        it('[3898]: Verify if copied notification templates are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeFalsy('Human Resources LOB copied notification templates is visible to case BA with multiple LOB access');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(notificationTemplateNameUpdated)).toBeTruthy('Human Resources LOB copied notification templates is not visible to case BA with multiple LOB access');
            await utilityGrid.searchAndOpenHyperlink(notificationTemplateNameUpdated);
            await editNotificationTemplate.updateDescription('updated desc');
            await editNotificationTemplate.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate(notificationTemplateName);
            await apiHelper.deleteEmailOrNotificationTemplate(notificationTemplateNameUpdated);
        });
    });

    //asahitya  - IT block 2 -check with anant-run again
    describe('[4589]: To create new template with an event', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let notificationEventHRGlobal = "Case Notification Event HR Global" + randomStr;
        let notificationEventHRPetramco = "Case Notification Event HR Petramco" + randomStr;
        let notificationEventHRGlobalInactive = "Case Notification Event HR Global Inactive" + randomStr;
        let notificationEventHRPetramcoInactive = "Case Notification Event HR Petramco Inactive" + randomStr;
        let notificationEventFacilitiesGlobal = "Case Notification Event Facilities Global" + randomStr;
        let notificationEventFacilitiesPetramco = "Case Notification Event Facilities Petramco" + randomStr;
        let notificationEventFacilitiesGlobalInactive = "Case Notification Event Facilities Global Inactive" + randomStr;
        let notificationEventFacilitiesPetramcoInactive = "Case Notification Event Facilities Petramco Inactive" + randomStr;

        beforeAll(async () => {

            let eventDataHRPetramco = {
                "eventName": notificationEventHRPetramco,
                "status": 1,
                "company": "Petramco",
                "eventDescription": notificationEventHRPetramco + "_Desc",
                "lineOfBusiness": "Human Resource"
            }

            let eventDataHRGlobal = {
                "eventName": notificationEventHRGlobal,
                "status": 1,
                "company": "- Global -",
                "eventDescription": notificationEventHRGlobal + "_Desc",
                "lineOfBusiness": "Human Resource"
            }
            let eventDataHRPetramcoInactive = {
                "eventName": notificationEventHRPetramcoInactive,
                "status": 2,
                "company": "Petramco",
                "eventDescription": notificationEventHRPetramcoInactive + "_Desc",
                "lineOfBusiness": "Human Resource"
            }
            let eventDataHRGlobalInactive = {
                "eventName": notificationEventHRGlobalInactive,
                "status": 2,
                "company": "- Global -",
                "eventDescription": notificationEventHRGlobalInactive + "_Desc",
                "lineOfBusiness": "Human Resource"
            }

            let eventDataFacilitiesPetramco = {
                "eventName": notificationEventFacilitiesPetramco,
                "status": 1,
                "company": "Petramco",
                "eventDescription": notificationEventFacilitiesPetramco + "_Desc",
                "lineOfBusiness": "Facilities"
            }

            let eventDataFacilitiesGlobal = {
                "eventName": notificationEventFacilitiesGlobal,
                "status": 1,
                "company": "- Global -",
                "eventDescription": notificationEventFacilitiesGlobal + "_Desc",
                "lineOfBusiness": "Facilities"
            }
            let eventDataFacilitiesPetramcoInactive = {
                "eventName": notificationEventFacilitiesPetramcoInactive,
                "status": 2,
                "company": "Petramco",
                "eventDescription": notificationEventFacilitiesPetramcoInactive + "_Desc",
                "lineOfBusiness": "Facilities"
            }
            let eventDataFacilitiesGlobalInactive = {
                "eventName": notificationEventFacilitiesGlobalInactive,
                "status": 2,
                "company": "- Global -",
                "eventDescription": notificationEventFacilitiesGlobalInactive + "_Desc",
                "lineOfBusiness": "Facilities"
            }

            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotificationEvent(eventDataHRPetramco);
            await apiHelper.createNotificationEvent(eventDataHRGlobal);
            await apiHelper.createNotificationEvent(eventDataHRPetramcoInactive);
            await apiHelper.createNotificationEvent(eventDataHRGlobalInactive);

            await apiHelper.apiLogin('fritz');
            await apiHelper.createNotificationEvent(eventDataFacilitiesPetramco);
            await apiHelper.createNotificationEvent(eventDataFacilitiesGlobal);
            await apiHelper.createNotificationEvent(eventDataFacilitiesPetramcoInactive);
            await apiHelper.createNotificationEvent(eventDataFacilitiesGlobalInactive);

        });

        it('[4589]: Verify notification event validation wrt same LOB ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_EVENTS);
            await notificationEventConsolePage.clickAddNotificationEventBtn();
            await createNotificationEventPage.setEventName(notificationEventHRGlobal);
            await createNotificationEventPage.setCompanyValue('Petramco');
            await createNotificationEventPage.setDescription('4589 Desc');
            await createNotificationEventPage.saveEventConfig();
            expect(await utilityCommon.isPopUpMessagePresent('An Event with same name already exists.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            await createNotificationEventPage.setEventName('Case Priority Change' + randomStr);
            await createNotificationEventPage.saveEventConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            //validate on edit mode
            await utilityGrid.searchAndOpenHyperlink('Case Priority Change' + randomStr);
            await editNotificationEventPage.setEventName(notificationEventHRGlobal);
            await editNotificationEventPage.saveEventConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Event Name is not allowed to change.')).toBeTruthy("Error message absent");
            await editNotificationEventPage.setEventName(notificationEventHRGlobal + "_updated");
            await editNotificationEventPage.saveEventConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Event Name is not allowed to change.')).toBeTruthy("Error message absent");
            await utilityCommon.closePopUpMessage();
            await editNotificationEventPage.cancelEventConfig();
            await utilityCommon.closePopUpMessage();
        });

        it('[4589]: To create new template with an event', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.selectModuleName('Cases');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Contact", "Contact's Manager", "External Requester", "Requester", "Requester's Manager", "Assigned Group"])).toBeTruthy('Recipient List is not matching');

            //Validations for notification event wrt LOB
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, 'Access Change')).toBeTruthy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventHRGlobal)).toBeTruthy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventHRPetramco)).toBeTruthy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, 'Agent Assignment')).toBeTruthy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventFacilitiesGlobal)).toBeFalsy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventHRPetramcoInactive)).toBeFalsy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventHRPetramcoInactive)).toBeFalsy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventHRGlobalInactive)).toBeFalsy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventFacilitiesGlobalInactive)).toBeFalsy;
            expect(await utilityCommon.isValuePresentInDropDown(createNotificationTemplatePage.selectors.eventGuid, notificationEventFacilitiesPetramcoInactive)).toBeFalsy;
            await createNotificationTemplatePage.setTemplateName('4589' + randomStr);
            await createNotificationTemplatePage.setDescription('4589' + randomStr);
            await createNotificationTemplatePage.setAlertMessage('Priority is change');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Priority is change');
            await editNotificationTemplate.clickRecipientsCheckbox("Assignee's Manager", "BCC");
            await editNotificationTemplate.clickRecipientsCheckbox("External Requester", "TO");
            await editNotificationTemplate.clickRecipientsCheckbox("Assigned Group", "CC");
            await createNotificationTemplatePage.selectEvent('Case Priority Change' + randomStr);
            await createNotificationTemplatePage.clickOnSaveButton();
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('4589' + randomStr);
            expect(await editNotificationTemplate.getEventName()).toBe('Case Priority Change' + randomStr);
            expect(await editNotificationTemplate.getModuleName()).toBe('Cases');
            expect(await editNotificationTemplate.isRecipientsCheckboxChecked("Assigned Group", "CC")).toBeTruthy();
            expect(await editNotificationTemplate.isRecipientsCheckboxChecked("Assignee's Manager", "BCC")).toBeTruthy();
            expect(await editNotificationTemplate.isRecipientsCheckboxChecked("External Requester", "TO")).toBeTruthy();
            await editNotificationTemplate.clickOnCancelButton();
        });

        it('[4589]: Verify notification template validation wrt same LOB ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.selectModuleName('Cases');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Contact", "Contact's Manager", "External Requester", "Requester", "Requester's Manager", "Assigned Group"])).toBeTruthy('Recipient List is not matching');
            await createNotificationTemplatePage.setTemplateName('4589' + randomStr);
            await createNotificationTemplatePage.setDescription('4589' + randomStr);
            await createNotificationTemplatePage.selectEvent('Access Change');
            await createNotificationTemplatePage.setAlertMessage('Priority is change');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Priority is change');
            await editNotificationTemplate.clickRecipientsCheckbox("Assignee's Manager", "BCC");
            await editNotificationTemplate.clickRecipientsCheckbox("External Requester", "TO");
            await editNotificationTemplate.clickRecipientsCheckbox("Assigned Group", "CC");
            await createNotificationTemplatePage.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('A template already exists for the selected combination of event, module, and line of business. Specify a different combination.')).toBeTruthy("record saved successful message is not displayed.");
            await utilityCommon.closeAllBlades();
        });

        it('[4589]: Verify notification event validation wrt different LOB ', async () => {
            await utilityCommon.closePopUpMessage();
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_EVENTS);
            await notificationEventConsolePage.clickAddNotificationEventBtn();
            await createNotificationEventPage.setEventName(notificationEventHRGlobal);
            await createNotificationEventPage.setCompanyValue('Petramco');
            await createNotificationEventPage.setDescription('4589 Desc');
            await createNotificationEventPage.saveEventConfig();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("record saved successful message is not displayed.");
        });

        it('[4589]: Verify notification template validation wrt different LOB ', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.selectModuleName('Cases');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Contact", "Contact's Manager", "External Requester", "Requester", "Requester's Manager", "Assigned Group"])).toBeTruthy('Recipient List is not matching');
            await createNotificationTemplatePage.setTemplateName('4589' + randomStr);
            await createNotificationTemplatePage.setDescription('4589' + randomStr);
            await createNotificationTemplatePage.setAlertMessage('Priority is change');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Priority is change');
            await editNotificationTemplate.clickRecipientsCheckbox("Assignee's Manager", "BCC");
            await editNotificationTemplate.clickRecipientsCheckbox("External Requester", "TO");
            await editNotificationTemplate.clickRecipientsCheckbox("Assigned Group", "CC");
            await createNotificationTemplatePage.selectEvent(notificationEventHRGlobal);
            await createNotificationTemplatePage.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("record saved successful message is not displayed.");
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login("qkatawazi");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        });

    });

    //asahitya-log defect for company column DRDMV-25149
    it('[5917]: AC: Notification Template_Console Columns', async () => {
        let columns: string[] = ['Modified By', 'ID', 'Label'];
        let allColumns: string[] = ['Company', 'Description', 'Event', 'Modified Date', 'Module Name', 'Status', 'Template Name', 'Modified By', 'ID', 'Label'];
        let defaultColumns: string[] = ['Company', 'Description', 'Event', 'Modified Date', 'Module Name', 'Status', 'Template Name'];
        expect(await notificationTempGridPage.areColumnHeaderMatches(defaultColumns)).toBeTruthy('Default Columns are not matching');
        await utilityGrid.sortGridColumn('Description', 'descending');
        await utilityGrid.sortGridColumn('Description', 'ascending');
        expect(await notificationTempGridPage.isGridColumnSorted('Description')).toBeTruthy('Template Name column is not sorted');
        await notificationTempGridPage.addGridColumns(columns);
        expect(await notificationTempGridPage.areColumnHeaderMatches(allColumns)).toBeTruthy('Columns are not matching');
        await notificationTempGridPage.removeGridColumns(columns);
    });

    //asahitya-fixed-passed in full run
    describe('[4590]: Availability of Recipient List on OOB Global Template', async () => {
        it('[4590]: Availability of Recipient List on OOB Global Template', async () => {
            await utilityGrid.searchAndOpenHyperlink('New Signature Template');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers", "Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Case Approval Module is not matching');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Case Watchlist - Status Change');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Followers"])).toBeTruthy('Recipient List of Case Watchlist Module is not matching');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Case Agent Assignment');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Contact", "Contact's Manager", "External Requester", "Requester", "Requester's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Cases Module is not matching');
            await utilityCommon.closeAllBlades();
        });
        it('[4590]: Availability of Recipient List on OOB Global Template', async () => {
            await utilityGrid.searchAndOpenHyperlink('Article Reviewer Assignment');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Reviewer", "Assignee", "Assignee's Manager", "Reviewer's Manager"])).toBeTruthy('Recipient List of Knowledge Module is not matching');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Knowledge Approve');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers", "Reviewer", "Assignee", "Assigned Group", "Reviewer Group", "Author"])).toBeTruthy('Recipient List of Knowledge Approval Module is not matching');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Case SLA Missed');
            expect(await createNotificationTemplatePage.areRecipientsMatches([])).toBeTruthy('Recipient List of SLA Module is not matching');
            await utilityCommon.closeAllBlades();
        });
        it('[4590]: Availability of Recipient List on OOB Global Template', async () => {
            await utilityGrid.searchAndOpenHyperlink('Notes from Activity Feed in Case');
            expect(await createNotificationTemplatePage.areRecipientsMatches([])).toBeTruthy('Recipient List of Social Module is not matching');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Task - Approve Template');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers", "Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Task Approval Module is not matching');
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink('Task Agent Assignment');
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group"])).toBeTruthy('Recipient List of Tasks Module is not matching');
            // await utilityGrid.searchAndOpenHyperlink('MC Flow Error');
            // expect(await createNotificationTemplatePage.areRecipientsMatches(["Multi-cloud Admins"])).toBeTruthy('Recipient List of MultiCloud Module is not matching');
            // await utilityCommon.closeAllBlades();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });
    //Defect
    describe('[4588]: Add new recipient as Individual/Group and availability of fields on Add recipient screen', async () => {
        it('[4588]: Add new recipient as Individual/Group and availability of fields on Add recipient screen', async () => {
            let eventData = {
                eventName: randomStr+'4588'
            }
            let notificationData = {
                description: '4588 desc',
                module: 'Cases',
                eventName: randomStr+'4588',
                templateName: randomStr+'4588 name',
                alertMessage: 'Alert Message text',
                emailBody: 'Email Body text',
                emailSubject: 'Email Subject text'
            }
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createNotificationEvent(eventData);
            await apiHelper.createNotificationTemplate(notificationData);

            await utilityGrid.searchAndOpenHyperlink(eventData.eventName);
            await editNotificationTemplate.clickAddRecipientsBtn();
            expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Recipient Type');
            expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Search Recipient');
            expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Save');
            expect(await editNotificationTemplate.getAllFieldsLabel()).toContain('Cancel');
        });
        // added due to defect failed reaming test cases
        it('[4588]: Add new recipient as Individual/Group and availability of fields on Add recipient screen', async () => {
            await editNotificationTemplate.searchRecipient('Elizabeth Peters');
            await editNotificationTemplate.saveAddRecipients();

            await editNotificationTemplate.clickAddRecipientsBtn();
            await editNotificationTemplate.setDropDownValue('RecipientType', 'Group');
            await editNotificationTemplate.setDropDownValue('AssignedGroup', 'AU Support 1');
            await editNotificationTemplate.saveAddRecipients();
            await editNotificationTemplate.clickRecipientsCheckbox('Elizabeth Peters', 'TO');
            await editNotificationTemplate.clickRecipientsCheckbox('Petramco > Australia Support > AU Support 1', 'CC');
            await editNotificationTemplate.clickOnSaveButton();

            await utilityGrid.searchAndOpenHyperlink(randomStr+'4588 name');
            await editNotificationTemplate.clickRecipientsCheckbox('Elizabeth Peters', 'TO');
            await editNotificationTemplate.clickRecipientsCheckbox('Petramco > Australia Support > AU Support 1', 'CC');
            await editNotificationTemplate.clickOnSaveButton();

            await utilityGrid.searchAndOpenHyperlink(randomStr+'4588 name');
            expect(await editNotificationTemplate.isRecipientDisplayed('Elizabeth Peters')).toBeTruthy('Elizabeth is not present in Recipient list');
            expect(await editNotificationTemplate.isRecipientDisplayed('Petramco > Australia Support > AU Support 1')).toBeTruthy('AU Support 1 is not present in Recipient list');
        });
        afterAll(async () => {
            await editNotificationTemplate.clickOnCancelButton();
            await editNotificationTemplate.clickCancelButtonAddRecipient();
            await utilityCommon.closeAllBlades();

        });
    });
    
    describe('[4371]: Verify Able to define Notification template which allow to be used for Email based approval', async () => {
        it('[4371]: Verify Able to define Notification template which allow to be used for Email based approval', async () => {
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            expect(await createNotificationTemplatePage.isEmailBasedApprovalFlagDisplayed()).toBeFalsy('Email based approval flag is displayed');
            await createNotificationTemplatePage.setTemplateName('Email Based Approval 4371');
            await createNotificationTemplatePage.selectModuleName('Case - Approval');
            await createNotificationTemplatePage.selectEvent('Email Based Approval');
            await createNotificationTemplatePage.selectEmailBasedApprovalToggle(true);
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Approvers"])).toBeTruthy('Recipient List of Case Approval Module is not matching');
            await createNotificationTemplatePage.selectEmailBasedApprovalToggle(false);
            expect(await createNotificationTemplatePage.areRecipientsMatches(["Assigned Group's Manager", "Assignee", "Assignee's Manager", "Assigned Group", "Approvers"])).toBeTruthy('Recipient List of Case Approval Module is not matching');
            await createNotificationTemplatePage.setDescription('Description');
            await createNotificationTemplatePage.setAlertMessage('Sample Alert Text');
            await createNotificationTemplatePage.clickOnEmailTab();
            await createNotificationTemplatePage.setSubject('Sample Subject text');
            await createNotificationTemplatePage.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent('A template already exists for the selected combination of event, module, and line of business. Specify a different combination.')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });

    describe('[4357]: Verify Notification method selected as alert will throw an error on save if Email based approval is selcted', async () => {
        it('[4357]: Verify Notification method selected as alert will throw an error on save if Email based approval is selcted', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            expect(await createNotificationTemplatePage.isEmailBasedApprovalFlagDisplayed()).toBeFalsy('Email based approval flag is displayed');
            await createNotificationTemplatePage.setTemplateName('Email Based Approval 4357');
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
            expect(await utilityCommon.isPopUpMessagePresent('A template already exists for the selected combination of event, module, and line of business. Specify a different combination.')).toBeTruthy();
            await utilityCommon.closeAllBlades();
            await notificationTempGridPage.clickOnCreateNotificationTemplate();
            await createNotificationTemplatePage.setTemplateName('Email Based Approval 4357');
            await createNotificationTemplatePage.selectModuleName('Case - Approval');
            await createNotificationTemplatePage.selectEvent('Case Reopened');
            expect(await createNotificationTemplatePage.isEmailBasedApprovalFlagDisplayed()).toBeFalsy('Email based approval flag is displayed');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
        });
    });
    
    it('[4356]: Verify OOB Notification Event and Template for Email based Approval', async () => {
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Events', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_EVENTS);
        await utilityGrid.clearFilter();
        await utilityGrid.addFilter('Company', '- Global -', 'text');
        await utilityGrid.searchRecord('Email Based Approval');
        expect(await notificationEventConsolePage.getDescriptionValue()).toBe('Notification Event');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', BWF_PAGE_TITLES.NOTIFICATION_CONFIGURATION.MANAGE_TEMPLATES);
        await utilityGrid.clearFilter();
        await utilityGrid.addFilter('Company', '- Global -', 'textbox');
        await utilityGrid.searchAndOpenHyperlink('Email Based Approval');
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
        await editNotificationTemplate.clickEmailUncheckvalue();
        await editNotificationTemplate.openEmailBodyEditMessageText();
        await browser.sleep(1000);
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
        await utilityCommon.closeAllBlades();
    });

});
