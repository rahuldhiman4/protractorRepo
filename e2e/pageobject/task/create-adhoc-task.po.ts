import { resolve } from "path";
import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../utils/utility.common';
import CreateTaskTemplatePage from "../settings/task-management/create-tasktemplate.po";

class CreateAdhocTaskTemplatePage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        descriptionGuid: '84ebb434-1cf8-4363-94d2-c77d9c9e2f68',
        taskSummary: '[rx-view-component-id="76b6b259-a085-4d9f-91ac-8c5cbb2bc725"] input',
        priority: 'fe14bbd7-3b72-4e88-b224-b58d3a0eb132',
        label: '156b3220-56a1-4349-b595-670961ff215c',
        categoryTier1: '67d80ff1-f2b1-4ebc-ba87-8f60c8b56213',
        categoryTier2: 'de41a8b5-6db3-4ae9-b8f1-5268dfd464b3',
        categoryTier3: 'f6c05c79-5859-4651-8d44-56e83670944a',
        categoryTier4: '10c2b8c0-3171-49c7-b27e-95d123fb5d9a',
        assignToMeButton: '[rx-view-component-id="92301e09-2079-4181-b80c-e18536f9dc6e"] button',
        changeAssignmentButton: '[rx-view-component-id="1b94ca7a-b3e0-49b7-94a3-70c1aff3c8a4"] button',
        saveAdhocTask: '[rx-view-component-id="e971ed74-8ded-44a4-945f-338067be3df9"] button',
        canceladhocTask: '[rx-view-component-id="73fcc0fa-3282-42a2-bf5d-0e4e4de5fcac"] button',
        status: '[rx-view-component-id="5c6f476e-c95c-4b24-b202-b4029c94ec02"] .dropdown-toggle',
        attachmentLink: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] [type=button]',
        attachmentLimitWarning: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] .bwf-attachment-limit-warning',
        assignCompany: '[rx-view-component-id="359f0c65-e48c-458d-8f14-3c2fc85c5cf6"] .dropdown-toggle',
        buisnessUnit: '[rx-view-component-id="d290526a-893e-40c8-bbce-0a8e30c934c0"] .dropdown-toggle',
        assignee: '[rx-view-component-id="58085538-2875-4bf0-a880-f977bdeb842a"] .dropdown-toggle',
        department: '[rx-view-component-id="0cfce715-9fa8-4f61-b670-5aff2b0540f3"] .dropdown-toggle',
        assignedGroup: '[rx-view-component-id="6a22a1f6-8bb2-4f28-8e91-399b3fa6c08d"] .dropdown-toggle',
        taskSummaryRequiredText: '76b6b259-a085-4d9f-91ac-8c5cbb2bc725',
        assignedCompanyRequiredText: '359f0c65-e48c-458d-8f14-3c2fc85c5cf6',
        assignedGroupRequiredText: '6a22a1f6-8bb2-4f28-8e91-399b3fa6c08d',
        attachmentField: '[rx-view-component-id="84ebb434-1cf8-4363-94d2-c77d9c9e2f68"] input[type="file"]',
    }

    async addAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async setDescription(description: string): Promise<void> {
        await utilityCommon.setCKEditor(description, this.selectors.descriptionGuid);
    }

    async updateTaskDescription(description:string):Promise<void>{
        await utilityCommon.updateCKEditor(description, this.selectors.descriptionGuid);
    }

    async setSummary(summary: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        await $(this.selectors.taskSummary).sendKeys(summary);
    }

    async clickSaveAdhoctask(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveAdhocTask)));
        await $(this.selectors.saveAdhocTask).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickAssignToMeButton(): Promise<void> {
        await $(this.selectors.assignToMeButton).click();
    }

    async isAttachmentButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentLink)));
        return await $(this.selectors.attachmentLink).isDisplayed();
    }

    async clickAttachButton(): Promise<void> {
        await $(this.selectors.attachmentLink).click();
    }

    async ischangeAssignmentButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignmentButton)));
        return await $(this.selectors.changeAssignmentButton).isDisplayed();
    }

    async clickAssignButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignButton)));
        await $(this.selectors.assignToMeButton).click();
    }

    async clickCancelAdhoctask(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.canceladhocTask)));
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
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.status)));
        return await $(this.selectors.status).getAttribute('disabled');
    }

    async getAssignCompanyAttribute(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignCompany)));
        return await $(this.selectors.assignCompany).getAttribute('disabled');
    }

    async getBuisnessUnitAttribute(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.buisnessUnit)));
        return await $(this.selectors.buisnessUnit).getAttribute('disabled');
    }

    async getAssigneeAttribute(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignee)));
        return await $(this.selectors.assignee).getAttribute('disabled');
    }

    async getDepartmentAttribute(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.department)));
        return await $(this.selectors.department).getAttribute('disabled');
    }

    async getAssignedGroupAttribute(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignedGroup)));
        return await $(this.selectors.assignedGroup).getAttribute('disabled');
    }

    async getSaveButtonAttribute(attribute: string): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveAdhocTask)));
        return await $(this.selectors.saveAdhocTask).getAttribute(attribute);
    }

    async isTaskSummaryRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummaryRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.taskSummaryRequiredText);
    }

    async isPriorityRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.piorityRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.priority);
    }

    async isAssignedCompanyRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedCompanyRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.assignedCompanyRequiredText);

    }

    async isAssignedGroupRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroupRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.assignedGroupRequiredText);
    }

    async isAssignToMeButtonDisplayd(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignButton)));
        return await $(this.selectors.assignToMeButton).isDisplayed();
    }

    async getchangeAssignmentButtonText(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeAssignmentButton)));
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
        return $(this.selectors.attachmentLink).isEnabled();
    }

    async getAttachmentLimitWarningText(): Promise<string> {
        return $(this.selectors.attachmentLimitWarning).getText();
    }

    async addAttachmentInDescription(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }
}

export default new CreateAdhocTaskTemplatePage();