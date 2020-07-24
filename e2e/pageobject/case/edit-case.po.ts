import { resolve } from 'path';
import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions, Key } from "protractor";
import utilityCommon from "../../utils/utility.common";

class CaseEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editLink: '.edit-link',
        changeCaseTemplate: '[rx-view-component-id="f6cc5a13-26cd-4412-ae4e-6c6cc5e21908"] button',
        selectCaseTemplate: '[rx-view-component-id="702fa086-4ddb-4741-b2cf-f16e22a49826"] button',
        assignToMe: '[rx-view-component-id="094f8581-1f5f-4e45-ad67-fd92d81c8e94"] button',
        changeAssignment: '[rx-view-component-id="459e6f41-abd3-4726-8dc2-25bab758877f"] button',
        saveCaseButton: '[rx-view-component-id="518308c0-34ea-4e75-a3a8-b4b07fc91de9"] button',
        summary: '[rx-view-component-id="244ffab2-bf04-4769-a5ac-c2a1f430e393"] input',
        summaryGuid: '244ffab2-bf04-4769-a5ac-c2a1f430e393',
        descriptionGuid: '9d3ef0fc-c49f-425f-a9e1-52422ba87f4f',
        descriptionLabel: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] label',
        priorityGuid: 'add23d12-52e7-4c43-aa78-2aa0c6125bb5',
        priorityRequiredText: '[rx-view-component-id="add23d12-52e7-4c43-aa78-2aa0c6125bb5"] .btn-secondary',
        clearContactButton: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .d-icon-cross',
        categoryTier1Guid: '593784cc-6bce-4bfd-82e1-7ca55aa28517',
        categoryTier2Guid: '7beae951-8345-4f97-9cac-48933083928f',
        categoryTier3Guid: '68d56b74-b9ad-444e-8dfc-ddec1e16897f',
        categoryTier4Guid: 'aa75da42-eeb4-4a6f-946b-74d5316b7641',
        categoryTier1Drpbox: '[rx-view-component-id="593784cc-6bce-4bfd-82e1-7ca55aa28517"] adapt-select',
        categoryTier2Drpbox: '[rx-view-component-id="7beae951-8345-4f97-9cac-48933083928f"] adapt-select',
        categoryTier3Drpbox: '[rx-view-component-id="68d56b74-b9ad-444e-8dfc-ddec1e16897f"] adapt-select',
        labelGuid: 'd9b7ead5-02e4-4af4-b87e-9103439922b7',
        siteGuid: '664af3b6-dde6-47a7-84f9-4a5ad721e993',
        clearSiteField: '[rx-view-component-id="664af3b6-dde6-47a7-84f9-4a5ad721e993"] .btn-secondary',
        resolutionCodeGuid: '32eeffe4-f5c1-4fc8-9c91-25946cc86d66',
        siteChangeReason: '[rx-view-component-id="54d1727e-1b2d-4f4f-8fb4-a3174746ee1d"] input',
        targetDateDate: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] .ng-valid-date',
        targetDateHours: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] input[ng-model="hours"]',
        targetDateMinutes: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] input[ng-model="minutes"]',
        targetDateMeredian: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] button.d-timepicker__input',
        resolutionDescription: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] textarea',
        attachLink: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] button',
        requesterPersonImage: 'img.person-profile-image',
        requesterText: '.person-main .text-field',
        siteText: '.person-location span',
        requesterPersonNameLink: '.person-name a',
        personEmailLink: '.bwf-person-email button',
        personPhoneLink: '.bwf-person-phone .person-phone-link',
        contact: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] input',
        contactNameLink: '.dropdown-item .flexi-type-ahead-person-card-item',
        cancelBtn: '[rx-view-component-id="f535ec30-5892-4150-a4a2-ffa74c9135cb"] button',
        caseTitle: '[rx-view-component-id="8ebc1637-af05-4a08-b873-4f810c4981b9"] span',
        assigneeCompany: '[rx-view-component-id="196878af-30b3-4ae2-ae7f-4c65baa5d951"] adapt-select',
        assigneeCompanyGuid: '196878af-30b3-4ae2-ae7f-4c65baa5d951',
        department: '[rx-view-component-id="3265d389-cd00-45ca-b65a-8335c67582b7"] adapt-select',
        assigneee: '[rx-view-component-id="7f1c67bf-9c39-4c46-b9ff-8d21ebaff4cb"] adapt-select',
        buisnessUnit: '[rx-view-component-id="54e4d84f-daca-4988-b064-d79084ab9421"] adapt-select',
        assignedGroup: '[rx-view-component-id="116edc77-c040-42db-8a32-dc836e4cb254"] adapt-select',
        assignedGroupGuid: '116edc77-c040-42db-8a32-dc836e4cb254',
        activityFeed: '.activity__wrapper  .activity__body a',
        activityChangeFile: '.d-icon-file_plus_o',
        closedTip: '.bwf-attachment-container__remove .d-icon-cross',
        attachmentField: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] .bwf-attachment-button input',
        dynamicFieldDate: 'bwf-date-field input.form-control.i-date',
        dynamicBooleanValue: 'button.d-icon-check_adapt',
        dynamicFieldDateTime: 'input[ng-model="datetime"]',
        dynamicFieldTime: '.dynamic-time-field input[ng-model="hours"]',
        dynamicFieldsName: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group label',
        dynamicFieldInput: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] input',
        dynamicAttachmentField: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .bwf-attachment-button input',
        tabText: '.nav-link-wrapper',
    }

    async removeAttachment(): Promise<void> {
        await $(this.selectors.closedTip).click();
    }

    async waitForEditCasePageToBeDisplayed(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.cancelBtn)));
        await $(this.selectors.cancelBtn).isEnabled();
    }

    async clickOnAssignToMe(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMe)));
        await $(this.selectors.assignToMe).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignment)));
        await $(this.selectors.changeAssignment).click();
    }

    async clickSaveCase(): Promise<void> {
        let saveButton = this.selectors.saveCaseButton + '[disabled="disabled"]';
        await browser.wait(this.EC.invisibilityOf($(saveButton)), 3000);
        await $(this.selectors.saveCaseButton).click();
    }

    async isSaveCaseEnable(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        return await $(this.selectors.saveCaseButton).isEnabled();
    }


    async clickOnCancelCaseButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelBtn)));
        await $(this.selectors.cancelBtn).click();
    }

    async clearCaseSummary(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summary)));
        await $(this.selectors.summary).clear();
        await $(this.selectors.summary).sendKeys('m' + Key.BACK_SPACE);
    }

    async setCaseSummary(summary: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summary)));
        await $(this.selectors.summary).clear();
        await $(this.selectors.summary).sendKeys(summary);
    }

    async updateCasePriority(casePriority: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.priorityGuid, casePriority);
    }

    async updateCaseCategoryTier1(caseCategoryTier1: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1Guid, caseCategoryTier1);
    }

    async updateCaseCategoryTier2(caseCategoryTier2: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2Guid, caseCategoryTier2);
    }

    async updateCaseCategoryTier3(caseCategoryTier3: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3Guid, caseCategoryTier3);
    }

    async updateCaseCategoryTier4(caseCategoryTier4: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier4Guid, caseCategoryTier4);
    }

    async updateLabel(label: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, label);
    }

    async updateCaseSite(caseSite: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.siteGuid, caseSite);
    }

    async updateSiteChangeReason(siteChangeReasonVal: string): Promise<void> {
        let siteChangeReasonSelector = await this.selectors.siteChangeReason;
        //        await browser.wait(this.EC.elementToBeClickable($(siteChangeReasonSelector)));
        await $((siteChangeReasonSelector)).clear;
        await $((siteChangeReasonSelector)).sendKeys(siteChangeReasonVal);
    }

    async updateContact(contactFullName: string): Promise<void> {
        let contactSelector = await this.selectors.contact;
        //        await browser.wait(this.EC.elementToBeClickable($(contactSelector)));
        await $((contactSelector)).clear;
        await $((contactSelector)).sendKeys(contactFullName);
        await $(this.selectors.contactNameLink).click();
    }

    async updateTargetDate(date: string, hours: string, minutes: string, meredian: string) {
        let targerDateDateSelector = await this.selectors.targetDateDate;
        //        await browser.wait(this.EC.elementToBeClickable($(targerDateDateSelector)));
        await $((targerDateDateSelector)).clear;
        await $((targerDateDateSelector)).sendKeys(date);
        await $((this.selectors.targetDateHours)).clear;
        await $((this.selectors.targetDateHours)).sendKeys(hours);
        await $((this.selectors.targetDateMinutes)).clear;
        await $((this.selectors.targetDateMinutes)).sendKeys(minutes);
        await $((this.selectors.targetDateMeredian)).clear;
        await $((this.selectors.targetDateMeredian)).sendKeys(meredian);
    }

    async updateResolutionCode(resolutionCode: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.resolutionCodeGuid, resolutionCode);
    }

    async isValuePresentInResolutionCode(resolutionCode: string): Promise<void> {
        await utilityCommon.isValuePresentInDropDown(this.selectors.resolutionCodeGuid, resolutionCode);
    }

    async setResolutionDescription(resolutionDescription: string): Promise<void> {
        await $(this.selectors.resolutionDescription).clear();
        await $(this.selectors.resolutionDescription).sendKeys(resolutionDescription);
    }

    async updateDescription(description: string): Promise<void> {
        await utilityCommon.setCKEditor(description, this.selectors.descriptionGuid);
    }

    async clickOnAttachLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachLink)));
        await $((this.selectors.attachLink)).click();
    }

    async getRequesterName(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterPersonNameLink)));
        return await $(this.selectors.requesterPersonNameLink).getText();
    }

    async getRequesterPhoneNo(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.personPhoneLink)));
        return await (await $(this.selectors.personPhoneLink).getText()).trim();
    }

    async getRequesterEmail(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.personEmailLink)));
        return await (await $(this.selectors.personEmailLink).getText()).trim();
    }

    async isSummaryRequiredText(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        return await utilityCommon.isRequiredTagToField(this.selectors.summaryGuid);
    }

    async isPriorityRequiredText(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.priorityRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.priorityGuid);
    }

    async isAssignedCompanyRequiredText(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeCompany)));
        return await utilityCommon.isRequiredTagToField(this.selectors.assigneeCompanyGuid);
    }

    async isAssignedGroupRequiredText(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroup)));
        return await utilityCommon.isRequiredTagToField(this.selectors.assignedGroupGuid);
    }

    async isClearContactButtonEnable(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.clearContactButton)));
        return await $(this.selectors.clearContactButton).isEnabled();
    }

    async isClearSiteButtonClickable(): Promise<boolean> {
        try {
            return await $(this.selectors.clearSiteField).isEnabled();
        } catch (error) {
            return false;
        }
    }

    async isAttachmentLinkClickable(): Promise<boolean> {
        try {
            return await $(this.selectors.attachLink).isEnabled();
        } catch (error) {
            return false;
        }

    }

    async isCategoryTier1Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Drpbox)));
        return await $(this.selectors.categoryTier1Drpbox).getAttribute("aria-disabled") == 'true';
    }

    async isCategoryTier2Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Drpbox)));
        return await $(this.selectors.categoryTier2Drpbox).getAttribute("aria-disabled") == 'true';
    }

    async isCategoryTier3Disabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Drpbox)));
        return await $(this.selectors.categoryTier3Drpbox).getAttribute("aria-disabled") == 'true';
    }

    async isChangeAssignmentButtonPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeAssignment)));
        return await $(this.selectors.changeAssignment).isDisplayed();
    }

    async isAssignToMePresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Drpbox)));
        return await $(this.selectors.categoryTier3Drpbox).isDisplayed();
    }

    async isActivityPresent(): Promise<boolean> {
        return await $(this.selectors.categoryTier3Drpbox).isDisplayed();
    }

    async isResourcePresent(): Promise<boolean> {
        // Resources tab is linked text, hence this type of validation
        return await element(by.cssContainingText(this.selectors.tabText, 'Resources'));
    }

    async getAssignedCompanyReadable(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeCompany)));
        return await $(this.selectors.assigneeCompany).getAttribute('aria-disabled');
    }

    async getDepartmentCompanyReadable(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.department)));
        return await $(this.selectors.department).getAttribute('aria-disabled');
    }

    async getAssigneeReadable(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneee)));
        return await $(this.selectors.assigneee).getAttribute('aria-disabled');
    }

    async getBuisnessUnitReadable(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.buisnessUnit)));
        return await $(this.selectors.buisnessUnit).getAttribute('aria-disabled');
    }

    async getAssignedGroupReadable(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroup)));
        return await $(this.selectors.assignedGroup).getAttribute('aria-disabled');
    }

    async isActivityFeedPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.activityFeed)));
        return await $(this.selectors.activityFeed).isDisplayed();
    }

    async isActivityChangeFilePresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.activityChangeFile)));
        return await $(this.selectors.activityChangeFile).isDisplayed();
    }

    async isRequesterTextDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterText)));
        return await $(this.selectors.requesterText).isDisplayed();
    }

    async isRequesterImageDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterPersonImage)));
        return await $(this.selectors.requesterPersonImage).isDisplayed();
    }

    async isSiteTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.siteText)));
        return await $(this.selectors.siteText).isDisplayed();
    }

    async clickOnRequesterName(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesterPersonNameLink)));
        return await $(this.selectors.requesterPersonNameLink).click();
    }

    async getSelectCaseTemplate(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.selectCaseTemplate)));
        return await $(this.selectors.selectCaseTemplate).getText();
    }

    async clickOnSelectCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectCaseTemplate)));
        return await $(this.selectors.selectCaseTemplate).click();
    }

    async getChangeCaseTemplate(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeCaseTemplate)));
        return await $(this.selectors.changeCaseTemplate).getText();
    }

    async clickOnChangeCaseTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeCaseTemplate)));
        await $(this.selectors.changeCaseTemplate).click();
    }

    async isChangeCaseTemplateButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.changeCaseTemplate).isDisplayed();
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFieldLocator = `.simple-field .form-control-label`;
        let dynamicFields: number = await $$(dynamicFieldLocator).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await (await $$(dynamicFieldLocator).get(i).getText()).trim();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }

    async addAttachment(attachmentField: string, fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        let dynamicFieldLabel: number = await $$(this.selectors.dynamicFieldsName).count();
        for (let i = 0; i < dynamicFieldLabel; i++) {
            let labelvalue = await (await $$(this.selectors.dynamicFieldsName).get(i).getText()).trim();
            if (labelvalue == attachmentField) {
                await $$('[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group').get(i).$('bwf-attachment-button input[type="file"]').sendKeys(absPathArray.join('\n'))
            }
        }
    }

    async addDescriptionAttachment(fileToUpload: string): Promise<void> {
        const absolutePath = resolve(__dirname, fileToUpload);
        console.log(absolutePath);
        await $(this.selectors.attachmentField).sendKeys(absolutePath);
    }

    async setDynamicFieldValue(fieldName: string, fieldValue: string): Promise<void> {
        let dynamicTextFields: number = await $$('bwf-text-field').count();
        for (let i = 0; i < dynamicTextFields; i++) {
            let labelvalue = await $$('bwf-text-field').get(i).$('label').getText();
            if (labelvalue == fieldName) {
                $$('bwf-text-field').get(i).$('input').sendKeys(fieldValue);
            }
        }
    }

    async setDateValueInDynamicField(value: string): Promise<void> {
        await $(this.selectors.dynamicFieldDate).sendKeys(value);
    }

    async clickOnTrueValueOfDynamicField(): Promise<void> {
        await $(this.selectors.dynamicBooleanValue).click();
    }

    async setDateTimeDynamicFieldValue(value: string): Promise<void> {
        await utilityCommon.setDateField('376ec3d3-9381-4613-bb06-1e8dbbaf6b18', value);
    }

    async setInvalidDateTimeDynamicField(value: string): Promise<void> {
        await $('bwf-datetime-field input.form-control.i-date-time').sendKeys(value);
    }

    async selectValueFromList(fieldName: string, value: string): Promise<void> {
        await utilityCommon.selectDropDown('376ec3d3-9381-4613-bb06-1e8dbbaf6b18', value);
    }

    async setTimeInDynamicField(value: string): Promise<void> {
        await $(this.selectors.dynamicFieldTime).sendKeys(value);
    }
}

export default new CaseEditPage();