import { resolve } from "path";
import { $, $$, Key, protractor, ProtractorExpectedConditions } from "protractor";
import ckeditorValidationPo from '../../pageobject/common/ck-editor/ckeditor-validation.po';
import utilityCommon from '../../utils/utility.common';
import changeAssignmentBladePo from "../common/change-assignment.po";
import ckeditorOpsPo from '../common/ck-editor/ckeditor-ops.po';
import CreateTaskTemplatePage from "../settings/task-management/create-tasktemplate.po";
import manageTaskBladePo from "./manage-task-blade.po";

class CreateAdhocTaskTemplatePage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        descriptionGuid: '84ebb434-1cf8-4363-94d2-c77d9c9e2f68',
        taskSummary: '[rx-view-component-id="76b6b259-a085-4d9f-91ac-8c5cbb2bc725"] input',
        priority: 'fe14bbd7-3b72-4e88-b224-b58d3a0eb132',
        label: '4fa18764-42fe-415a-a0b5-b5529428932f',
        categoryTier1: 'd4ef7224-b54b-48bb-b180-103a1f8e0086',
        categoryTier2: 'cf0b83a7-b47d-4947-9046-2c63674c841e',
        categoryTier3: '50e1c4ab-7ce2-4f8a-bf08-0f172eec713f',
        categoryTier4: 'b0a2be68-aaf0-4a7f-9b70-27020f5b32e7',
        assignToMeButton: '[rx-view-component-id="0d11a862-c378-49cc-bda8-2d6efbd2beeb"] .d-icon-left-user_plus',
        changeAssignmentButton: '[rx-view-component-id="1b94ca7a-b3e0-49b7-94a3-70c1aff3c8a4"] button',
        saveAdhocTask: '[rx-view-component-id="e971ed74-8ded-44a4-945f-338067be3df9"] button',
        canceladhocTask: '[rx-view-component-id="73fcc0fa-3282-42a2-bf5d-0e4e4de5fcac"] button',
        status: '[rx-view-component-id="5c6f476e-c95c-4b24-b202-b4029c94ec02"] .dropdown-toggle',
        attachmentLink: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] [type=button]',
        attachmentLimitWarning: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] .bwf-attachment-limit-warning',
        buisnessUnit: '[rx-view-component-id="d290526a-893e-40c8-bbce-0a8e30c934c0"] .dropdown-toggle',
        assignee: '[rx-view-component-id="58085538-2875-4bf0-a880-f977bdeb842a"] .dropdown-toggle',
        department: '[rx-view-component-id="0cfce715-9fa8-4f61-b670-5aff2b0540f3"] .dropdown-toggle',
        assignedGroup: '[rx-view-component-id="6a22a1f6-8bb2-4f28-8e91-399b3fa6c08d"] .dropdown-toggle',
        taskSummaryRequiredText: '76b6b259-a085-4d9f-91ac-8c5cbb2bc725',
        assignedGroupRequiredText: '6a22a1f6-8bb2-4f28-8e91-399b3fa6c08d',
        attachmentField: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] input[type="file"]',
        description: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"]',
        adHocTaskTextArea: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] .cke_editable_themed',
        numberIcon: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] .cke_button__numberedlist_icon',
        bulletIcon: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] .cke_button__bulletedlist_icon',
        lineOfBussiness: '[rx-view-component-id="832baf9f-dd74-44f2-b63d-6f240baaab9b"] input',
        assignmentGuid: '0d11a862-c378-49cc-bda8-2d6efbd2beeb'
    }

    async addAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async setDescription(description: string): Promise<void> {
        await utilityCommon.setCKEditor(description, this.selectors.descriptionGuid);
    }

    async updateTaskDescription(description: string): Promise<void> {
        await utilityCommon.updateCKEditor(description, this.selectors.descriptionGuid);
    }

    async clickOnLeftAlignIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnLeftAlignIcon(this.selectors.descriptionGuid);
    }

    async clickOnRightAlignIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnRightAlignIcon(this.selectors.descriptionGuid);
    }

    async clickOnCenterAlignIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnCenterAlignIcon(this.selectors.descriptionGuid);
    }

    async selectColor(value: string): Promise<void> {
        await ckeditorOpsPo.selectColor(value, this.selectors.descriptionGuid);
    }

    async enterNewLineInCKE(): Promise<void> {
        await ckeditorOpsPo.enterNewLineInCKE(this.selectors.descriptionGuid);
    }

    async clickOnBoldIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnBoldIcon(this.selectors.descriptionGuid);
    }

    async clickOnItalicIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnItalicIcon(this.selectors.descriptionGuid);
    }

    async clickOnUnderLineIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnUnderLineIcon(this.selectors.descriptionGuid);
    }

    async setSummary(summary: string): Promise<void> {
        await $(this.selectors.taskSummary).sendKeys(summary);
    }

    async clickSaveAdhoctask(expectedTaskCount?: number): Promise<void> {
        await $(this.selectors.saveAdhocTask).click();
        if (expectedTaskCount) await manageTaskBladePo.waitUntilNumberOfTaskLinkAppear(expectedTaskCount);
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickAssignToMeButton(): Promise<void> {
        await $(this.selectors.assignToMeButton).click();
    }

    async isAttachmentButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.attachmentLink).isDisplayed();
    }

    async clickAttachButton(): Promise<void> {
        await $(this.selectors.attachmentLink).click();
    }

    async ischangeAssignmentButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.changeAssignmentButton).isDisplayed();
    }

    async clickAssignButton(): Promise<void> {
        await $(this.selectors.assignToMeButton).click();
    }

    async clickCancelAdhoctask(): Promise<void> {
        await $(this.selectors.canceladhocTask).click();
    }

    async selectPriority(priority: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.priority, priority);
    }

    async selectLabel(label: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.label, label);
    }

    async selectCategoryTier1(categoryTier1: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1, categoryTier1);
    }

    async selectCategoryTier2(categoryTier2: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2, categoryTier2);
    }

    async selectCategoryTier3(categoryTier3: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3, categoryTier3);
    }

    async selectCategoryTier4(categoryTier4: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier4, categoryTier4);
    }

    async getStatusAttribute(): Promise<string> {
        return await $(this.selectors.status).getAttribute('aria-disabled');
    }

    async getBuisnessUnitAttribute(): Promise<string> {
        return await $(this.selectors.buisnessUnit).getAttribute('class');
    }

    async getAssigneeAttribute(): Promise<string> {
        return await $(this.selectors.assignee).getAttribute('disabled');
    }

    async getDepartmentAttribute(): Promise<string> {
        return await $(this.selectors.department).getAttribute('class');
    }

    async getAssignedGroupAttribute(): Promise<string> {
        return await $(this.selectors.assignedGroup).getAttribute('class');
    }

    async getSaveButtonAttribute(attribute: string): Promise<string> {
        return await $(this.selectors.saveAdhocTask).getAttribute(attribute);
    }

    async isTaskSummaryRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.taskSummaryRequiredText);
    }

    async isPriorityRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.priority);
    }

    async isAssignedGroupRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.assignedGroupRequiredText);
    }

    async isAssignToMeButtonDisplayd(): Promise<boolean> {
        return await $(this.selectors.assignToMeButton).isDisplayed();
    }

    async getchangeAssignmentButtonText(): Promise<string> {
        return await $(this.selectors.changeAssignmentButton).getText();
    }

    async isProcessFieldPresent() {
        try {
            return await $(CreateTaskTemplatePage.selectors.toggleBox).isPresent();
        } catch (error) {
            return false;
        }
    }

    async isAttachmentButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.attachmentLink).isEnabled();
    }

    async getAttachmentLimitWarningText(): Promise<string> {
        return await $(this.selectors.attachmentLimitWarning).getText();
    }

    async addAttachmentInDescription(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async getCategoryTier1(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier1}"] button`).getText();
    }

    async getCategoryTier2(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier2}"] button`).getText();
    }

    async getCategoryTier3(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier3}"] button`).getText();
    }

    async getCategoryTier4(): Promise<string> {
        return await $(`[rx-view-component-id="${this.selectors.categoryTier4}"] button`).getText();
    }

    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
            case "Label": {
                guid = this.selectors.label;
                break;
            }
            case "Priority": {
                guid = this.selectors.priority;
                break;
            }
            case "Category Tier 1": {
                guid = this.selectors.categoryTier1;
                break;
            }
            case "Category Tier 2": {
                guid = this.selectors.categoryTier2;
                break;
            }
            case "Category Tier 3": {
                guid = this.selectors.categoryTier3;
                break;
            }
            case "Category Tier 4": {
                guid = this.selectors.categoryTier4;
                break;
            }
            default: {
                console.log('Drop Down name does not match');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(guid, value);
    }

    async isTextLeftAlignInCkEditorTextArea(bodyText: string): Promise<boolean> {
        let leftAlignemntElement = await $$('[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] div.cke_enable_context_menu p').get(8);
        return await ckeditorValidationPo.isTextLeftAlignInCkEditorTextArea(bodyText, leftAlignemntElement);
    }

    async setInsertRemoveNumberList(value: string): Promise<void> {
        await $(this.selectors.adHocTaskTextArea).sendKeys(Key.CONTROL, Key.END);
        await $(this.selectors.adHocTaskTextArea).sendKeys(Key.ENTER);
        await $(this.selectors.numberIcon).click();
        await $(this.selectors.adHocTaskTextArea).sendKeys(value);
    }

    async setInsertRemoveBulletedList(value: string): Promise<void> {
        await $(this.selectors.adHocTaskTextArea).sendKeys(Key.CONTROL, Key.END);
        await $(this.selectors.adHocTaskTextArea).sendKeys(Key.ENTER);
        await $(this.selectors.bulletIcon).click();
        await $(this.selectors.adHocTaskTextArea).sendKeys(value);
    }

    async clickMaximizeMinimizeIcon(): Promise<void> {
        await ckeditorOpsPo.clickMaximizeMinimizeIcon(this.selectors.descriptionGuid);
    }

    async clickOnLinkIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnLinkIcon(this.selectors.descriptionGuid);
    }

    async clickOnTableIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnTableIcon(this.selectors.descriptionGuid);
    }

    async clickOnImageIcon(): Promise<void> {
        await ckeditorOpsPo.clickOnImageIcon(this.selectors.descriptionGuid);
    }

    async getLineOfBussinessValue(): Promise<string> {
        let elementPresent = await $(this.selectors.lineOfBussiness).isPresent()
        if (elementPresent == true) return await $(this.selectors.lineOfBussiness).getAttribute("placeholder");
        else return await $('[rx-view-component-id="832baf9f-dd74-44f2-b63d-6f240baaab9b"] .dropdown-toggle').getText();

    }

    async getAssignedGroupText(): Promise<string> {
        return await changeAssignmentBladePo.getDropDownValue("AssignedGroup", this.selectors.assignmentGuid);
    }

    async getAssigneeValue(): Promise<string> {
        return await changeAssignmentBladePo.getDropDownValue("Assignee", this.selectors.assignmentGuid);
    }

    async isDropDownListSorted(dropdown: string): Promise<boolean> {
        return await changeAssignmentBladePo.isDropDownListSorted(dropdown, this.selectors.assignmentGuid);
    }

    async isValuePresentInDropDown(dropdown: string, dropDownValue: string): Promise<boolean> {
        return await changeAssignmentBladePo.isValuePresentInDropDown(dropdown, dropDownValue, this.selectors.assignmentGuid);
    }
}

export default new CreateAdhocTaskTemplatePage();
