import { resolve } from "path";
import { $, protractor, ProtractorExpectedConditions, $$, element, by } from "protractor";
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import ckeditorOpsPo from '../common/ck-editor/ckeditor-ops.po';

class EditTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] .dropdown-toggle',
        cancelButton: '[rx-view-component-id="705c3907-a82e-4de4-a8b0-32fe00483403"] button',
        processNameValue: '[rx-view-component-id="7260c238-9e41-4d31-90de-2d46443117b4"] input',
        assignToMe: '.d-icon-left-user_plus',
        saveButton: '[rx-view-component-id="a19228d0-81a9-4b19-9cb3-b5bd9550966f"] button',
        changesAssignmentButton: '[rx-view-component-id="c423242c-28ca-4fd2-a81c-4495bf2fffb7"] button',
        attachmentField: '[rx-view-component-id="6053a7e8-5194-420b-965a-1c3bfe3ad0a1"] input[type="file"]',
        attachButton: '[rx-view-component-id="6053a7e8-5194-420b-965a-1c3bfe3ad0a1"] button',
        categoryTier1: '909ad3ad-6706-4d46-bb5a-bc48fa6ca98e',
        categoryTier2: '49d231d9-ee81-4d7c-90af-d7ca785a32d4',
        categoryTier3: 'c8858fb5-5b21-4e0d-a947-c0130a72b51a',
        categoryTier4: 'ff1636f8-4efe-4447-9c04-f32799904f2b',
        priority: 'e638927a-e1e1-46e7-bfe3-8fe9904a5c5a',
        dynamicDate: '.i-date',
        dynamicBooleanValue: 'button.d-icon-check_adapt',
        dynamicFieldTime: '.i-time',
        dynamicDateTime: '.fields-container .i-date-time',
        taskSummary: '[rx-view-component-id="1261e01e-00fb-4e2c-b2ac-72e837f9fcea"] input',
        dynamicFieldName: '[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] label',
        ckeditorGuid: '6053a7e8-5194-420b-965a-1c3bfe3ad0a1',
        refreshActivity: '.d-icon-left-refresh',
        categoryTier1Value: '[rx-view-component-id="909ad3ad-6706-4d46-bb5a-bc48fa6ca98e"] .dropdown-toggle',
        categoryTier2Value: '[rx-view-component-id="49d231d9-ee81-4d7c-90af-d7ca785a32d4"] .dropdown-toggle',
        categoryTier3Value: '[rx-view-component-id="c8858fb5-5b21-4e0d-a947-c0130a72b51a"] .dropdown-toggle',
        requesterName: '[rx-view-component-id="4860ff6b-01b4-49b3-b257-c043ae1ab232"] .person-name .person-link',
        requesterMail: '[rx-view-component-id="4860ff6b-01b4-49b3-b257-c043ae1ab232"] .bwf-person-email button',
        assigneeName: '[rx-view-component-id="a0c63feb-58f4-487a-9d23-36088df553b3"] .dropdown-toggle',
        assignGroupText: '[rx-view-component-id="60b50604-dfc9-42ef-9688-1db148b00809"] .dropdown-toggle',
        assignCompany: '[rx-view-component-id="f1c5abf8-7093-4d14-9f51-f4ba888c6607"] .dropdown-toggle', 
        taskSummaryRequiredText: '1261e01e-00fb-4e2c-b2ac-72e837f9fcea',  
        assignedCompanyRequiredText: 'f1c5abf8-7093-4d14-9f51-f4ba888c6607',
        assignedGroupRequiredText: '60b50604-dfc9-42ef-9688-1db148b00809',
        priorityRequiredText: 'e638927a-e1e1-46e7-bfe3-8fe9904a5c5a',
        taskTypeRequiredText: '057f2521-313b-40c9-be56-829827512abf',
        taskLabel: '[rx-view-component-id="4c2784af-c080-4630-8f16-d9e6b07e87a2"] .btn-secondary',
        labelGuid: '4c2784af-c080-4630-8f16-d9e6b07e87a2'
    }

    async isAutomatedTaskTypeDisabled(): Promise<boolean> {
        return await $(this.selectors.taskTypeValue).getAttribute('disabled') == 'true' ? true : false;
    }

    async isProcessNameDisabled(): Promise<boolean> {
        return await $(this.selectors.processNameValue).getAttribute('readOnly') == 'true' ? true : false;
    }

    async setDateValueInDynamicField(value: string): Promise<void> {
        await $(this.selectors.dynamicDate).clear();
        await $(this.selectors.dynamicDate).sendKeys(value);
    }

    async selectValueFromList(value: string): Promise<void> {
        await utilityCommon.selectDropDown('4c988a95-b148-475f-b91c-9788d8e6c0cb', value);
    }

    async setLabel(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, value);
    }

    async setDateTimeDynamicFieldValue(value: string): Promise<void> {
        await $(this.selectors.dynamicDateTime).sendKeys(value);
    }

    async setTimeInDynamicField(value: string): Promise<void> {
        await $(this.selectors.dynamicFieldTime).sendKeys(value);
    }

    async addAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async removeAttachment(fileName: string): Promise<void> {
        let attachmentsIcon = await $$('bwf-attachment-viewer .justify-content-start');
        for (let i: number = 0; i < attachmentsIcon.length; i++) {
            let attachmentName = await attachmentsIcon[i].$('.bwf-attachment-container__file-name').getText();
            if (attachmentName == fileName) {
                await attachmentsIcon[i].$('.d-icon-cross').click();
            }
        }
    }

    async clickOnAssignToMe() {
        await $(this.selectors.assignToMe).click();
    }

    async clickOnRefreshActivity() {
        await $(this.selectors.refreshActivity).click();
    }

    async clickOnChangeAssignementButton() {
        await $(this.selectors.changesAssignmentButton).click();
    }

    async clickOnSaveButton() {
        await $(this.selectors.saveButton).click();
    }

    async getTaskTypeValueAttribute(attribute: string): Promise<string> {
        return await $(this.selectors.taskTypeValue).getAttribute(attribute);
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async getTaskTypeValue(): Promise<string> {
        return await $(this.selectors.taskTypeValue).getText();
    }

    async processNamePresentInTask(): Promise<boolean> {
        return await $(this.selectors.processNameValue).isPresent();
    }

    async clickOnAttachButton(): Promise<void> {
        await $(this.selectors.attachButton).click();
    }

    async setDescription(descriptionText: string): Promise<void> {
        await ckeditorOpsPo.setCKEditor(descriptionText,this.selectors.ckeditorGuid);
    }

    async selectPriorityValue(priority: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.priority, priority);
   }

	async selectTaskCategoryTier1(categoryTier1: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1, categoryTier1);
    }

    async selectTaskCategoryTier2(categoryTier2: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2, categoryTier2);
    }

    async clickOnTrueValueOfDynamicField(): Promise<void> {
        await $(this.selectors.dynamicBooleanValue).click();
    }

    async selectTaskCategoryTier3(categoryTier3: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3, categoryTier3);
    }

    async selectTaskCategoryTier4(categoryTier4: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier4, categoryTier4);
    }

    async isDynamicFieldDisplayed(value: string): Promise<boolean> {
        let dynamicFieldCount = await $$(this.selectors.dynamicFieldName).count();
        for (let i = 0; i < dynamicFieldCount; i++) {
            let fieldLabel = await (await $$(this.selectors.dynamicFieldName).get(i).getText()).trim();
            if (value == fieldLabel) {
                return true;
            }
        }
        return false;
    }

    async addAttachmentInDynamicField(attachmentField: string, fileToUpload: string[]): Promise<void> {
        let dynamicField = await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group').count();
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        for (let i = 0; i < dynamicField; i++) {
            let labelvalue = await (await $$(this.selectors.dynamicFieldName).get(i).getText()).trim();
            if (labelvalue == attachmentField) {
               await $$('[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .form-group').get(i).$('bwf-attachment-button input[type="file"]').sendKeys(absPathArray.join('\n'))
            }
        }
    }

    async setDynamicFieldValue(fieldName: string, fieldValue: string): Promise<void> {
        let dynamicTextFields: number = await $$('bwf-text-field').count();
        for (let i = 0; i < dynamicTextFields; i++) {
            let labelvalue = await $$('bwf-text-field').get(i).$('label').getText();
            if (labelvalue == fieldName) {
                await $$('bwf-text-field').get(i).$('input').sendKeys(fieldValue);
            }
        }
    }

    async updateTaskSummary(summary: string): Promise<void> {
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(summary);
    }

    async isRequesterNameDisplayed(requesterName:string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.requesterName,requesterName)).isPresent().then(async (result) => {
            if (result){
                return await element(by.cssContainingText(this.selectors.requesterName,requesterName)).isDisplayed();
            }else return false;
        });
    }

    async isFieldsDisplyed(labelName:string):  Promise<boolean> {
        let locator: string = undefined;
        switch (labelName) {
            case "Assign Group": {
                locator = this.selectors.assignGroupText;
                break;
            }
            case "Assign Company": {
                locator = this.selectors.assignCompany;
                break;
            }
            case "Assignee Name": {
                locator = this.selectors.assigneeName;
                break;
            }
            case "CategoryTier3Value": {
                locator = this.selectors.categoryTier3Value;
                break;
            }
            case "CategoryTier1Value": {
                locator = this.selectors.categoryTier1Value;
                break;
            }
            case "CategoryTier2Value": {
                locator = this.selectors.categoryTier2Value;
                break;
            }
            case "Requester Mail": {
                locator = this.selectors.requesterMail;
                break;
            }
            case "Assignment Section": {
                locator = this.selectors.assignToMe;
                break;
            }
            default: {
                console.log(labelName, ' is not a valid parameter');
                break;
            }
        }
        return await $(locator).isPresent().then(async (result) => {
            if (result){
                return await $(locator).isDisplayed();
            }else return false;
        });
    }

    async isRequiredTextPresent(labelName:string): Promise<boolean> {
        let locator: string = undefined;
        switch (labelName) {
            case "Task Summary": {
                locator = this.selectors.taskSummaryRequiredText;
                break;
            }
            case "Priority": {
                locator = this.selectors.priorityRequiredText;
                break;
            }
            case "Assigned Company": {
                locator = this.selectors.assignedCompanyRequiredText;
                break;
            }
            case "Assigned Group": {
                locator = this.selectors.assignedGroupRequiredText;
                break;
            }
            default: {
                console.log(labelName, ' is not a valid parameter');
                break;
            }
        }
        return await utilityCommon.isRequiredTagToField(locator);
    }

    async getTaskCategoryTier4(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier4}"] button`).getText();
    }

    async isTaskLabelValueDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.taskLabel, labelName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.taskLabel, labelName)).isDisplayed();
            else return false;
        });
    }
    
}

export default new EditTask();