import { browser, protractor, ProtractorExpectedConditions } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import notificationTempGridPage from "../../pageobject/notification/console-notificationTemplate.po";
import utilCommon from '../../utils/util.common';

describe("Notification Template", () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const manageNotificationTempNavigation = 'Notification Configuration--Manage Templates';
    const notifTempGridPageTitle = 'Manage Notification Template - Business Workflows';

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    it('[DRDMV-19109]: [Copy Notification] - UI behavior when copying a notification template', async () => {
        let notificationData = require('../../data/ui/notification/notificationTemplate.ui.json');
        let expectedJsonName = 'notificationData_DRDMV19109';
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem(manageNotificationTempNavigation, notifTempGridPageTitle);
        await expect(notificationTempGridPage.isCopyTemplateButtonDisabled()).toBeTruthy();
        await notificationTempGridPage.searchTemplate(notificationData[expectedJsonName].TemplateName);
        await notificationTempGridPage.selectTemplate();
        await notificationTempGridPage.clickCopyTmplate();
        //Validate 'Copy Template' Window title and fields present
        await expect(notificationTempGridPage.getTitleCopyNotificationTemplateWindow()).toBe(notificationData[expectedJsonName].CopyTemplateHeader);
        await expect(notificationTempGridPage.isCompanyDropDownPresentInCopyTempWindow()).toBeTruthy();
        await expect(notificationTempGridPage.isTemplateNameTxtBoxPresentInCopyTempWindow()).toBeTruthy();
        //Clear All fields and validate if the Copy button is disabled
        await notificationTempGridPage.setTemplateNamePresentInCopyTempWindow(" ");
        await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
        // Select company drpdwn value and keep tempName empty and validate if the Copy button is disabled
        await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow(notificationData[expectedJsonName].Company);
        await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
        //Clear company drpdwn value and Enter some tempName and validate if the Copy button is disabled
        await notificationTempGridPage.clearCompanyDropDownValPresentInCopyTempWindow();
        await notificationTempGridPage.setTemplateNamePresentInCopyTempWindow(notificationData[expectedJsonName].CopiedTemplateName);
        await expect(notificationTempGridPage.isCopyTemplateButtonDisabledInCopyTempWindow()).toBeTruthy();
        //Select Company drpdown value again, and click Copy Template button
        await notificationTempGridPage.setCompanyDropDownValPresentInCopyTempWindow(notificationData[expectedJsonName].Company);
        await notificationTempGridPage.clickCopyTemplateButtonInCopyTempWindow();
        //Validate if the new copied template is created
        await notificationTempGridPage.searchTemplate(notificationData[expectedJsonName].CopiedTemplateName);
        await notificationTempGridPage.clickAndOpenTemplate(notificationData[expectedJsonName].CopiedTemplateName);
    });

})