import { resolve } from 'path';
import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions, Key } from "protractor";
import utilityCommon from "../../utils/utility.common";
import ckeEditor from '../../pageobject/common/ck-editor/ckeditor-ops.po';

class CaseEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editLink: '.edit-link',
        changeCaseTemplate: '[rx-view-component-id="f6cc5a13-26cd-4412-ae4e-6c6cc5e21908"] button',
        selectCaseTemplate: '[rx-view-component-id="702fa086-4ddb-4741-b2cf-f16e22a49826"] button',
        assignToMe: 'button.d-icon-left-user_plus',
        changeAssignment: '[rx-view-component-id="459e6f41-abd3-4726-8dc2-25bab758877f"] button',
        saveCaseButton: '[rx-view-component-id="518308c0-34ea-4e75-a3a8-b4b07fc91de9"] button',
        summary: '[rx-view-component-id="244ffab2-bf04-4769-a5ac-c2a1f430e393"] input',
        summaryGuid: '244ffab2-bf04-4769-a5ac-c2a1f430e393',
        descriptionGuid: '9d3ef0fc-c49f-425f-a9e1-52422ba87f4f',
        descriptionLabel: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] label',
        priorityGuid: 'add23d12-52e7-4c43-aa78-2aa0c6125bb5',
        priorityRequiredText: '[rx-view-component-id="add23d12-52e7-4c43-aa78-2aa0c6125bb5"] .btn-secondary',
        clearContactButton: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] .d-icon-cross',
        categoryTier1Guid: '59769557-4b17-4a1a-952f-63e9418fb7ff',
        categoryTier2Guid: '0aa422df-d89a-40ac-8956-c4f5480b2e36',
        categoryTier3Guid: 'f59cd305-9f35-4d39-891e-8824a97724e2',
        categoryTier4Guid: '7f7f2d24-1f78-427e-b972-f99e55f1d070',
        categoryTier1Drpbox: '[rx-view-component-id="59769557-4b17-4a1a-952f-63e9418fb7ff"] button',
        categoryTier2Drpbox: '[rx-view-component-id="0aa422df-d89a-40ac-8956-c4f5480b2e36"] button',
        categoryTier3Drpbox: '[rx-view-component-id="f59cd305-9f35-4d39-891e-8824a97724e2"] button',
        labelGuid: '5ea1ef24-abf0-45da-86e6-23a90c8b215b',
        caseLabel: '[rx-view-component-id="5ea1ef24-abf0-45da-86e6-23a90c8b215b"] .btn-secondary',
        siteGuid: '52af2f63-7a8e-45ab-9344-3c326d4340a1',
        clearSiteField: '[rx-view-component-id="664af3b6-dde6-47a7-84f9-4a5ad721e993"] .btn-secondary',
        resolutionCodeGuid: '155eb52a-4680-42a4-ae91-7505ab92eb31',
        siteChangeReason: '[rx-view-component-id="54d1727e-1b2d-4f4f-8fb4-a3174746ee1d"] input',
        targetDateDate: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] .ng-valid-date',
        targetDateHours: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] input[ng-model="hours"]',
        targetDateMinutes: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] input[ng-model="minutes"]',
        targetDateMeredian: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] button.d-timepicker__input',
        resolutionDescription: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] textarea',
        attachLink: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] button',
        requesterPersonImage: '.person-summary .person-thumbnail',
        requesterDefaultImage: '.person-summary .default-thumbnail',
        requesterText: '.person-main .text-field',
        siteText: '.person-location span',
        requesterPersonNameLink: '.person-name a',
        personEmailLink: '.bwf-person-email button',
        personPhoneLink: '.bwf-person-phone .person-phone-link',
        contact: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] input',
        contactNameLink: '.dropdown-item .flexi-type-ahead-person-card-item',
        cancelBtn: '[rx-view-component-id="f535ec30-5892-4150-a4a2-ffa74c9135cb"] button',
        caseTitle: '[rx-view-component-id="8ebc1637-af05-4a08-b873-4f810c4981b9"] span',
        assigneeCompany: '[rx-view-component-id="196878af-30b3-4ae2-ae7f-4c65baa5d951"] button',
        assigneeCompanyGuid: '196878af-30b3-4ae2-ae7f-4c65baa5d951',
        department: '[rx-view-component-id="3265d389-cd00-45ca-b65a-8335c67582b7"] adapt-select',
        buisnessUnit: '[rx-view-component-id="54e4d84f-daca-4988-b064-d79084ab9421"] button',
        assignedGroup: '[rx-view-component-id="116edc77-c040-42db-8a32-dc836e4cb254"] button',
        assignedGroupGuid: '116edc77-c040-42db-8a32-dc836e4cb254',
        activityFeed: '.activity__wrapper  .activity__body a',
        activityChangeFile: '.d-icon-file_plus_o',
        closedTip: '.bwf-attachment-container__remove .d-icon-cross',
        attachmentField: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] .bwf-attachment-button input',
        dynamicFieldDate: 'bwf-date-field input.form-control.i-date',
        dynamicBooleanValue: 'button.d-icon-check_adapt',
        dynamicFieldDateTime: 'input[ng-model="datetime"]',
        dynamicFieldTime: '.i-time',
        dynamicFieldsName: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .form-group label',
        dynamicFieldInput: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] input',
        dynamicAttachmentField: '[rx-view-component-id="376ec3d3-9381-4613-bb06-1e8dbbaf6b18"] .bwf-attachment-button input',
        tabText: '.nav-link-wrapper',
        dynamciFieldDownLoadIcon: '.bwf-text-color-active',
        lobValue: '[rx-view-component-id="694535e8-ab22-4ddc-8d2a-ceb017cf4fbf"] button',
        lineofbusiness: '[rx-view-component-id="694535e8-ab22-4ddc-8d2a-ceb017cf4fbf"] .adapt-select',
        assigneeValue: '[rx-view-component-id="13635426-50b0-4b53-8026-a1682ab656e8"] button div.rx-select__search-button-title',
        dynamicFields: '.simple-field .form-control-label',
    }

    async removeAttachment(): Promise<void> {
        await $(this.selectors.closedTip).click();
    }

    async waitForEditCasePageToBeDisplayed(): Promise<void> {
        await $(this.selectors.cancelBtn).isEnabled();
    }

    async clickOnAssignToMe(): Promise<void> {
        await $(this.selectors.assignToMe).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignment).click();
    }

    async clickSaveCase(): Promise<void> {
        await utilityCommon.scrollToElement($(this.selectors.saveCaseButton));
        await $(this.selectors.saveCaseButton).click();
    }

    async isSaveCaseEnable(): Promise<boolean> {
        return await $(this.selectors.saveCaseButton).isEnabled();
    }


    async clickOnCancelCaseButton(): Promise<void> {
        await $(this.selectors.cancelBtn).click();
    }

    async clearCaseSummary(): Promise<void> {
        await $(this.selectors.summary).clear();
        await $(this.selectors.summary).sendKeys('m' + Key.BACK_SPACE);
    }

    async setCaseSummary(summary: string): Promise<void> {
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

    async isCaseLabelValueDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseLabel, labelName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.caseLabel, labelName)).isDisplayed();
            else return false;
        });
    }

    async updateCaseSite(caseSite: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.siteGuid, caseSite);
    }

    async updateSiteChangeReason(siteChangeReasonVal: string): Promise<void> {
        let siteChangeReasonSelector = await this.selectors.siteChangeReason;
        await $((siteChangeReasonSelector)).clear;
        await $((siteChangeReasonSelector)).sendKeys(siteChangeReasonVal);
    }

    async updateContact(contactFullName: string): Promise<void> {
        let contactSelector = await this.selectors.contact;
        await $((contactSelector)).clear;
        await $((contactSelector)).sendKeys(contactFullName);
        await $(this.selectors.contactNameLink).click();
    }

    async updateTargetDate(date: string, hours: string, minutes: string, meredian: string) {
        let targerDateDateSelector = await this.selectors.targetDateDate;
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

    async isResolutionCodePresent(resolutionCode: string): Promise<boolean> {
        return await utilityCommon.isValuePresentInDropDown(this.selectors.resolutionCodeGuid, resolutionCode);
    }

    async isValuePresentInResolutionCode(resolutionCode: string): Promise<void> {
        await utilityCommon.isValuePresentInDropDown(this.selectors.resolutionCodeGuid, resolutionCode);
    }

    async isValuePresentInCategoryTier1(categoryTier1: string): Promise<boolean> {
        return await utilityCommon.isValuePresentInDropDown(this.selectors.categoryTier1Guid, categoryTier1);
    }

    async setResolutionDescription(resolutionDescription: string): Promise<void> {
        await $(this.selectors.resolutionDescription).clear();
        await $(this.selectors.resolutionDescription).sendKeys(resolutionDescription);
    }

    async updateDescription(description: string): Promise<void> {
        await utilityCommon.setCKEditor(description, this.selectors.descriptionGuid);
    }

    async clickOnAttachLink(): Promise<void> {
        await $((this.selectors.attachLink)).click();
    }

    async getRequesterName(): Promise<string> {
        return await $(this.selectors.requesterPersonNameLink).getText();
    }

    async getRequesterPhoneNo(): Promise<string> {
        return await (await $(this.selectors.personPhoneLink).getText()).trim();
    }

    async getRequesterEmail(): Promise<string> {
        return await (await $(this.selectors.personEmailLink).getText()).trim();
    }

    async isSummaryRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagPresent(this.selectors.summaryGuid);
    }

    async isPriorityRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagPresent(this.selectors.priorityGuid);
    }

    async isAssignedCompanyRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.assigneeCompanyGuid);
    }

    async isAssignedGroupRequiredText(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.assignedGroupGuid);
    }

    async isClearContactButtonEnable(): Promise<boolean> {
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
        return await $(this.selectors.categoryTier1Drpbox).getAttribute("aria-disabled") == 'true';
    }

    async isCategoryTier2Disabled(): Promise<boolean> {
        return await $(this.selectors.categoryTier2Drpbox).getAttribute("aria-disabled") == 'true';
    }

    async isCategoryTier3Disabled(): Promise<boolean> {
        return await $(this.selectors.categoryTier3Drpbox).getAttribute("aria-disabled") == 'true';
    }

    async isChangeAssignmentButtonPresent(): Promise<boolean> {
        return await $(this.selectors.changeAssignment).isDisplayed();
    }

    async isAssignToMePresent(): Promise<boolean> {
        return await $(this.selectors.categoryTier3Drpbox).isDisplayed();
    }

    async isActivityPresent(): Promise<boolean> {
        return await $(this.selectors.categoryTier3Drpbox).isDisplayed();
    }

    async isResourcePresent(): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.tabText, 'Resources'));
    }

    async getAssignedCompanyReadable(): Promise<string> {
        return await $(this.selectors.assigneeCompany).getAttribute('aria-disabled');
    }

    async getDepartmentCompanyReadable(): Promise<string> {
        return await $(this.selectors.department).getAttribute('aria-disabled');
    }

    async getBuisnessUnitReadable(): Promise<string> {
        return await $(this.selectors.buisnessUnit).getAttribute('aria-disabled');
    }

    async getAssignedGroupReadable(): Promise<string> {
        return await $(this.selectors.assignedGroup).getAttribute('aria-disabled');
    }

    async isActivityFeedPresent(): Promise<boolean> {
        return await $(this.selectors.activityFeed).isDisplayed();
    }

    async isActivityChangeFilePresent(): Promise<boolean> {
        return await $(this.selectors.activityChangeFile).isDisplayed();
    }

    async isRequesterTextDisplayed(): Promise<boolean> {
        return await $(this.selectors.requesterText).isDisplayed();
    }

    async isRequesterImageDisplayed(): Promise<boolean> {
        return await $(this.selectors.requesterPersonImage).isDisplayed() || await $(this.selectors.requesterDefaultImage).isDisplayed();
    }

    async isSiteTextPresent(): Promise<boolean> {
        return await $(this.selectors.siteText).isDisplayed();
    }

    async clickOnRequesterName(): Promise<void> {
        return await $(this.selectors.requesterPersonNameLink).click();
    }

    async getSelectCaseTemplate(): Promise<string> {
        return await $(this.selectors.selectCaseTemplate).getText();
    }

    async clickOnSelectCaseTemplate(): Promise<void> {
        await $(this.selectors.selectCaseTemplate).click();
    }

    async getChangeCaseTemplate(): Promise<string> {
        return await $(this.selectors.changeCaseTemplate).getText();
    }

    async clickOnChangeCaseTemplate(): Promise<void> {
        await utilityCommon.scrollToElement($(this.selectors.changeCaseTemplate));
        await $(this.selectors.changeCaseTemplate).click();
    }

    async isChangeCaseTemplateButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.changeCaseTemplate).isDisplayed();
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFieldLocator = `[rx-view-component-id="465ce519-19f3-4d8f-8725-888255768aa7"] .simple-field .form-control-label`;
        let dynamicFields: number = await $$(dynamicFieldLocator).count();
        await utilityCommon.scrollToElement($(dynamicFieldLocator));
        let status: boolean = false;
        for (let i: number = 0; i < dynamicFields; i++) {
            let field = await (await $$(dynamicFieldLocator).get(i).getText()).trim();
            if (fieldName == field) {
                status = true;
                break;
            }
        }
        return status;
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

    async addDescriptionAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async setDynamicFieldValue(fieldName: string, fieldValue: string): Promise<void> {
        let dynamicTextFields: number = await $$('bwf-text-field').count();
        for (let i = 0; i < dynamicTextFields; i++) {
            let labelvalue = await $$('bwf-text-field').get(i).$('label').getText();
            if (labelvalue == fieldName) {
                await $$('bwf-text-field').get(i).$('input').clear();
                await $$('bwf-text-field').get(i).$('input').sendKeys(fieldValue);
            }
        }
    }

    async setDateValueInDynamicField(value: string): Promise<void> {
        await $(this.selectors.dynamicFieldDate).clear();
        await $(this.selectors.dynamicFieldDate).sendKeys(value);
    }

    async clickOnTrueValueOfDynamicField(): Promise<void> {
        await $(this.selectors.dynamicBooleanValue).click();
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

    async getCategoryTier1(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier1Guid}"] button`).getText();
    }

    async getCategoryTier2(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier2Guid}"] button`).getText();
    }

    async getCategoryTier3(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier3Guid}"] button`).getText();
    }

    async getCategoryTier4(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier4Guid}"] button`).getText();
    }

    async getAssigneeValue(): Promise<string> {
        return await $$(this.selectors.assigneeValue).last().getText();
    }

    async clickDownloadDynamicFile(downloadButtonNumber: number): Promise<void> {
        await $$(this.selectors.dynamciFieldDownLoadIcon).get(downloadButtonNumber - 1).click();
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    };

    async isLineOfBusinessReadOnly(): Promise<boolean> {
        return await $(this.selectors.lineofbusiness).getAttribute('aria-readonly') == 'true';
    }

    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
            case "Label": {
                guid = this.selectors.labelGuid;
                break;
            }
            case "Category Tier 1": {
                guid = this.selectors.categoryTier1Guid;
                break;
            }
            case "Category Tier 2": {
                guid = this.selectors.categoryTier2Guid;
                break;
            }
            case "Category Tier 3": {
                guid = this.selectors.categoryTier3Guid;
                break;
            }
            case "Category Tier 4": {
                guid = this.selectors.categoryTier4Guid;
                break;
            }
            default: {
                console.log('Drop Down name does not match');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(guid, value);
    }

    async setDescriptionNumberList(values: string[]): Promise<void> {
        await ckeEditor.setNumberList(values, this.selectors.descriptionGuid);
    }

    async setDescriptionBulletList(values: string[]): Promise<void> {
        await ckeEditor.setBulletList(values, this.selectors.descriptionGuid);
    }

}

export default new CaseEditPage();