import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationTempGridPage from "../../pageobject/settings/notification-config/console-notification-template.po";
import editNotificationTemplate from "../../pageobject/settings/notification-config/edit-notification-template.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiHelper from '../../api/api.helper';
import utilGrid from '../../utils/util.grid';

describe("Notification Template", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //radhiman
    describe('[DRDMV-19109]: [Copy Notification] - UI behavior when copying a notification template', async () => {
        let notificationTemplateName = 'DRDMV-19109_CopiedTemplate';
        it('[DRDMV-19109]: [Copy Notification] - UI behavior when copying a notification template', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Notification Configuration--Manage Templates', 'Manage Notification Template - Business Workflows');
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
            expect(await utilGrid.isGridRecordPresent(notificationTemplateName)).toBeTruthy("Notification template not copied");
        });
        afterAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteEmailOrNotificationTemplate(notificationTemplateName);
        });
    });
});
