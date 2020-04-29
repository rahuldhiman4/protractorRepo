import { resolve } from "path";
import { $, protractor, ProtractorExpectedConditions, $$ } from "protractor";
import utilCommon from '../../utils/util.common';

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
        priority: '0cf493f2-9e6b-4f23-bf3e-ba210c2baef8',
        dynamicDate: '[class="input-group"] input[ng-model="date"]',
        dynamicDateTime: 'input[ng-model="datetime"]',
        taskSummary: '[rx-view-component-id="1261e01e-00fb-4e2c-b2ac-72e837f9fcea"] input',
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

    async setDateTimeDynamicFieldValue(value: string): Promise<void> {
        await $(this.selectors.dynamicDateTime).clear();
        await $(this.selectors.dynamicDateTime).sendKeys(value);
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
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMe)));
        await $(this.selectors.assignToMe).click();
    }

    async clickOnChangeAssignementButton() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changesAssignmentButton)));
        await $(this.selectors.changesAssignmentButton).click();
    }

    async clickOnSaveButton() {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changesAssignmentButton)))
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async getTaskTypeValueAttribute(attribute: string): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getAttribute(attribute);
    }

    async clickOnCancelButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async getTaskTypeValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async processNamePresentInTask(): Promise<boolean> {
        //        await browser.wait(this.EC.invisibilityOf($(this.selectors.processNameValue)));
        return await $(this.selectors.processNameValue).isPresent();
    }

    async clickOnAttachButton(): Promise<void> {
        await $(this.selectors.attachButton).click();
    }

    async selectPriorityValue(priority: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.priority, priority);
    }

    async selectTaskCategoryTier1(categoryTier1: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier1, categoryTier1);
    }

    async selectTaskCategoryTier2(categoryTier2: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier2, categoryTier2);
    }

    async selectTaskCategoryTier3(categoryTier3: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier3, categoryTier3);
    }

    async selectTaskCategoryTier4(categoryTier4: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.categoryTier4, categoryTier4);
    }

    async isDynamicFieldDisplayed(value: string): Promise<boolean> {
        return await $(`.textfield[title=${value}]`).isPresent().then(async (result) => {
            if (result) return await $(`.textfield[title=${value}]`).isDisplayed();
            else return false;
        });
    }

    async addAttachmentInDynamicField(attachmentField: string, fileToUpload: string): Promise<void> {
        const absolutePath = resolve(__dirname, fileToUpload);
        let attachmentLocator = `input[name=${attachmentField}]`;
        await $(attachmentLocator).sendKeys(absolutePath);
    }

    async setDynamicFieldValue(fieldName: string, fieldValue: string): Promise<void> {
        await $(`adapt-textfield[title=${fieldName}] input`).sendKeys(fieldValue);
    }

    async updateTaskSummary(summary: string): Promise<void> {
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(summary);
    }
}

export default new EditTask();