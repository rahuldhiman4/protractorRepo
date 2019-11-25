import { ProtractorExpectedConditions, protractor, browser, element, by, $, $$ } from "protractor"
import util from "../../utils/util.common";
import manageTask from "../../pageobject/task/manage-task-blade.po";

class CaseEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editLink: '.edit-link',
        changeAssignment: '[rx-view-component-id="459e6f41-abd3-4726-8dc2-25bab758877f"] button',
        assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
        selectOptions: '.options-box .options li',
        searchAsignee: '.d-icon-search input',
        assignee: '.rx-assignment-person-fullName',
        assignButton: '.rx-assignment-modal-footer button.d-button_primary',
        saveCaseButton: '[rx-view-component-id="518308c0-34ea-4e75-a3a8-b4b07fc91de9"] button',
        statusChange: '[rx-view-component-id="48bbcbbf-564c-4d46-8dc2-1e7670c187ff"] .status-transition',
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"]',
        statusChangeReason: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"]',
        saveUpdateStatus: '[rx-view-component-id="ee5dd503-a10e-4d22-9ac5-99c400892bb7"] button',
        addTaskButton: '[rx-view-component-id="db1c57fc-c332-40fa-b1c0-759e21d9ad5c"] button',
        addTaskFromTemplateButton: '[rx-view-component-id="d02d64d8-5a76-4cdc-8263-1d45b2da4dd1"] button',
        taskTemplateGridId: "da1ffbb0-567a-4199-b94f-413bee7f149b",
        templateGridSaveButton: '[rx-view-component-id="b7f9f666-5c22-463a-bc86-4cb66e26fa35"] button',
        taskFromManageTasks: '[draggable] a',
        taskStatusChange: '[rx-view-component-id="1437179f-34be-4cb3-8f85-cf0ac6a83394"] .status-transition',
        taskStatusDropDown: '[rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"]',
        taskStatusChangeReason: '[rx-view-component-id="baf69b56-c37b-4a0b-9e68-f18558738ebb"]',
        saveUpdateTaskStatus: '[rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        viewCaseLink: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
        slaProgressBar: '[rx-view-component-id="55cb7986-e724-40f3-9f92-5744c6c9514d"] .d-progress__bar',
        summary: '[rx-view-component-id="244ffab2-bf04-4769-a5ac-c2a1f430e393"] .d-textfield__input',
        caseDescription: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] .rx-description-textarea-edit',
        priorityGuid: 'add23d12-52e7-4c43-aa78-2aa0c6125bb5',
        categoryTier1Guid: 'b144d2ce-fd89-4977-9b3f-136a4b984efe',
        categoryTier2Guid: '7beae951-8345-4f97-9cac-48933083928f',
        categoryTier3Guid: '68d56b74-b9ad-444e-8dfc-ddec1e16897f',
        categoryTier4Guid: 'aa75da42-eeb4-4a6f-946b-74d5316b7641',
        labelGuid: 'd9b7ead5-02e4-4af4-b87e-9103439922b7',
        siteGuid: '664af3b6-dde6-47a7-84f9-4a5ad721e993',
        resolutionCodeGuid: '32eeffe4-f5c1-4fc8-9c91-25946cc86d66',
        siteChangeReason: '[rx-view-component-id="54d1727e-1b2d-4f4f-8fb4-a3174746ee1d"] input',
        targetDateDate: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] .ng-valid-date',
        targetDateHours: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] input[ng-model="hours"]',
        targetDateMinutes: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] input[ng-model="minutes"]',
        targetDateMeredian: '[rx-view-component-id="0b8f81f4-9e06-4475-b6a6-7d7270e72bbd"] button.d-timepicker__input',
        resolutionDescription: '[rx-view-component-id="923de542-50b0-482f-a370-3823d0c07645"] textarea',
        attachLink: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] button',
        personLink: '.person-link',
        personEmailLink: '.ac-link-person-email',
        personPhoneLink: '.ac-link-person-phone',
        contact: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] input',
        contactNameLink: '[rx-view-component-id="b28c2da7-08e2-4dfd-bfcd-f836483e625b"] a',
        cancelBtn: '[rx-view-component-id="f535ec30-5892-4150-a4a2-ffa74c9135cb"] button',
        caseTitle: '[rx-view-component-id="8ebc1637-af05-4a08-b873-4f810c4981b9"] span',
        caseIdText: '[rx-view-component-id="7b47ca08-e9d4-4656-8f96-3bc751c098b0"] .title',
        sourceText: '[rx-view-component-id="8abd013f-26cd-4aa5-a3bb-63b063d3a7ec"] .d-textfield__rx-value',
        categoryTier1Text: '[rx-view-component-id="b144d2ce-fd89-4977-9b3f-136a4b984efe"] .d-textfield__rx-value',
        categoryTier2Text: '[rx-view-component-id="7beae951-8345-4f97-9cac-48933083928f"] .d-textfield__rx-value',
        categoryTier3Text: '[rx-view-component-id="68d56b74-b9ad-444e-8dfc-ddec1e16897f"] .d-textfield__rx-value',
        categoryTier4Text: '[rx-view-component-id="aa75da42-eeb4-4a6f-946b-74d5316b7641"] .d-textfield__rx-value',
        caseTemplateText: '[rx-view-component-id="a3fed42a-3de2-4df8-880f-a7528c3999e6"] .d-textfield__rx-value',
        flowsetText: '[rx-view-component-id="73fb70b0-2992-4dc5-b7ed-3d3d13cc4d6b"] .d-textfield__rx-value',
        descriptionText: '[rx-view-component-id="9d3ef0fc-c49f-425f-a9e1-52422ba87f4f"] div[ng-transclude]',
        assigneeText: '[rx-view-component-id="dfe65f6f-7aea-476c-8042-f3aa34e3fb04"] .person-link a',
        assignedGroupText: '[rx-view-component-id="66c1bbab-901d-42ed-b5e6-a04cb54d559f"] .d-textfield__rx-value',
        departmentText: '[rx-view-component-id="795da3b4-6442-4b07-b6e1-7ce7c9987352"] .d-textfield__rx-value',
        businessUnitText: '[rx-view-component-id="f14326b0-0c70-4827-8a02-95e82527409a"] .d-textfield__rx-value',
        assignedCompanyText: '[rx-view-component-id="8b4d78f0-fbda-420c-928f-3dee49fde4fc"] .d-textfield__rx-value',
        emailLink: '[rx-view-component-id="58a437ec-fc5b-4721-a583-1d6c80cfe6a6"] button',
        attachmentsLink: '[rx-view-component-id="58a437ec-fc5b-4721-a583-1d6c80cfe6a6"] button',
        addToWatchlist: '[rx-view-component-id="df24e195-e4f2-4114-af3f-e8a07691bdfd"] button',
        stopWatching: '[rx-view-component-id="a62c849f-5bb0-480f-9811-50def59d82d0"] button',
        relatedCasesTab: '[rx-view-component-id="b3763a3b-0113-42a9-8e68-74bde7464352"] a[title="Related Cases"]',
        relatedPersonTab: '[rx-view-component-id="b3763a3b-0113-42a9-8e68-74bde7464352"] a[title="Related Persons"]',
        caseAccessTab: '[rx-view-component-id="b3763a3b-0113-42a9-8e68-74bde7464352"] a[title="Case Access"]',
        resourcesTab: '[rx-view-component-id="4a577ada-86cd-43fe-88b1-4b627dce93e6"] a[title="Resources"]',
        activityTab: '[rx-view-component-id="4a577ada-86cd-43fe-88b1-4b627dce93e6"] a[title="Activity"]'
    }

    async clickEditCaseButton(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLink)));
        await $(this.selectors.editLink).click();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignment).click();
    }

    async selectSupportGroup(supportGroup: string): Promise<void> {
        const lastDropDown = await $$(this.selectors.assignmentDropDownList).last();
        await browser.wait(this.EC.elementToBeClickable(lastDropDown.$('button')));
        await lastDropDown.$('button').click();
        await browser.wait(this.EC.visibilityOf(lastDropDown.$('input')));
        await lastDropDown.$('input').sendKeys(supportGroup);
        await browser.wait(this.EC.or(async () => {
            let count = await lastDropDown.$$(this.selectors.selectOptions).count();
            return count == 1;
        }))
        await expect(await lastDropDown.$$(this.selectors.selectOptions).first().getText()).toBe(supportGroup);
        await lastDropDown.$$(this.selectors.selectOptions).first().click();
    }

    async selectAssignee(name: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
        await $(this.selectors.searchAsignee).sendKeys(name);
        await browser.actions().sendKeys(protractor.Key.ENTER).perform();
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.assignee).count();
            return count >= 2;
        }))
        await element(by.cssContainingText(this.selectors.assignee, name)).click();
    }

    async clickAssignButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignButton)));
        await $(this.selectors.assignButton).click();
    }

    async clickSaveCase(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        await $(this.selectors.saveCaseButton).click();
    }

    async verifyCaseAssignee(name: string): Promise<void> {
        expect(await browser.wait(this.EC.visibilityOf($(`a[title="${name}"]`))));
    }

    async changeCaseStatus(statusValue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        await $(this.selectors.statusChange).click();
        const statusUpdate = $(this.selectors.statusDropDown);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('[aria-label="Status activate"]')));
        await (statusUpdate.$('[aria-label="Status activate"]')).click();
        await element(by.cssContainingText(this.selectors.statusDropDown + ' .ui-select__rx-choice', statusValue)).click();
    }

    async setStatusReason(statusValue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChangeReason)));
        await $(this.selectors.statusChangeReason).click();
        const statusReason = $(this.selectors.statusChangeReason);
        await browser.wait(this.EC.elementToBeClickable(statusReason.$('input[type="search"]')));
        await (statusReason.$('input[type="search"]')).sendKeys(statusValue);
        var option = await element(by.cssContainingText((this.selectors.statusChangeReason + ' .ui-select__rx-choice'), statusValue));
        await browser.wait(this.EC.visibilityOf(option));
        await option.click();
    }

    async clickSaveStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateStatus)));
        await $(this.selectors.saveUpdateStatus).click();
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
    }

    async clickAddTaskButton() {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addTaskButton)));
        await $(this.selectors.addTaskButton).click();
    }

    async addTaskFromTaskTemplate(templateName: string) {
        await manageTask.clickAddTaskFromTemplateButton();
        await manageTask.setTaskSearchBoxValue(templateName);
        await manageTask.clickFirstCheckBoxInTaskTemplateSearchGrid();
        await manageTask.clickOnTaskGridSaveButton();
    }

    async changeTaskStatus(statusValue: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.taskStatusChange)));
        await $(this.selectors.taskStatusChange).click();
        const statusUpdate = await $(this.selectors.taskStatusDropDown);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('[aria-label="Status activate"]')));
        await (statusUpdate.$('[aria-label="Status activate"]')).click();
        await element(by.cssContainingText(this.selectors.taskStatusDropDown + ' .ui-select__rx-choice', statusValue)).click();
    }

    async setTaskStatusReason(statusValue: string): Promise<void> {
        const statusUpdate = await $(this.selectors.taskStatusChangeReason);
        await browser.wait(this.EC.elementToBeClickable(statusUpdate.$('.ui-select-toggle')));
        await (statusUpdate.$('.ui-select-toggle')).click();
        await browser.wait(this.EC.visibilityOf(element(by.cssContainingText(this.selectors.taskStatusChangeReason + ' .ui-select__rx-choice', statusValue))));
        await element(by.cssContainingText(this.selectors.taskStatusChangeReason + ' .ui-select__rx-choice', statusValue)).click();
    }

    async clickTaskSaveStatus(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveUpdateTaskStatus)));
        await $(this.selectors.saveUpdateTaskStatus).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
    }

    async clickViewCaseLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewCaseLink)));
        await $(this.selectors.viewCaseLink).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLink)));
    }

    async getSlaBarColor(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.slaProgressBar)));
        return await $(this.selectors.slaProgressBar).getCssValue('background-color');
    }

    async updateCaseSummary(summary: string): Promise<void> {
        var summarySelector = await this.selectors.summary;
        await browser.wait(this.EC.elementToBeClickable($(summarySelector)));
        await $((summarySelector)).clear;
        await $((summarySelector)).sendKeys(summary);
    }

    async updateCasePriority(casePriority: string): Promise<void> {
        await util.selectDropDown(this.selectors.priorityGuid, casePriority);
    }

    async updateCaseCategoryTier1(caseCategoryTier1: string): Promise<void> {
        await util.selectDropDown(this.selectors.categoryTier1Guid, caseCategoryTier1);
    }

    async updateCaseCategoryTier2(caseCategoryTier2: string): Promise<void> {
        await util.selectDropDown(this.selectors.categoryTier2Guid, caseCategoryTier2);
    }

    async updateCaseCategoryTier3(caseCategoryTier3: string): Promise<void> {
        await util.selectDropDown(this.selectors.categoryTier3Guid, caseCategoryTier3);
    }

    async updateCaseCategoryTier4(caseCategoryTier4: string): Promise<void> {
        await util.selectDropDown(this.selectors.categoryTier4Guid, caseCategoryTier4);
    }

    async updateLabel(label: string): Promise<void> {
        await util.selectDropDown(this.selectors.labelGuid, label);
    }

    async updateCaseSite(caseSite: string): Promise<void> {
        await util.selectDropDown(this.selectors.siteGuid, caseSite);
    }

    async updateSiteChangeReason(siteChangeReasonVal: string): Promise<void> {
        var siteChangeReasonSelector = await this.selectors.siteChangeReason;
        await browser.wait(this.EC.elementToBeClickable($(siteChangeReasonSelector)));
        await $((siteChangeReasonSelector)).clear;
        await $((siteChangeReasonSelector)).sendKeys(siteChangeReasonVal);
    }

    async updateContact(contactFullName: string): Promise<void> {
        var contactSelector = await this.selectors.contact;
        await browser.wait(this.EC.elementToBeClickable($(contactSelector)));
        await $((contactSelector)).clear;
        await $((contactSelector)).sendKeys(contactFullName);
        await $(this.selectors.contactNameLink).click();
    }

    async updateTargetDate(date: string, hours: string, minutes: string, meredian: string) {
        var targerDateDateSelector = await this.selectors.targetDateDate;
        await browser.wait(this.EC.elementToBeClickable($(targerDateDateSelector)));
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
        await util.selectDropDown(this.selectors.resolutionCodeGuid, resolutionCode);
    }

    async updateResolutionDescription(resolutionDescription: string): Promise<void> {
        await util.selectDropDown(this.selectors.resolutionDescription, resolutionDescription);
    }

    async updateDescription(descriptionVal: string): Promise<void> {
        var caseDescriptionSelector = await this.selectors.caseDescription;
        await browser.wait(this.EC.elementToBeClickable($(caseDescriptionSelector)));
        await $((caseDescriptionSelector)).clear;
        await $((caseDescriptionSelector)).sendKeys(descriptionVal);
    }

    async clickOnAttachLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachLink)));
        await $((this.selectors.attachLink)).click();
    }

    async getSourceText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.sourceText)));
        return await $(this.selectors.sourceText).getText();
    }

    async getCategoryTier1Text(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Text)));
        return await $(this.selectors.categoryTier1Text).getText();
    }

    async getCategoryTier2Text(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Text)));
        return await $(this.selectors.categoryTier2Text).getText();
    }

    async getCategoryTier3Text(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Text)));
        return await $(this.selectors.categoryTier3Text).getText();
    }

    async getCategoryTier4Text(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4Text)));
        return await $(this.selectors.categoryTier4Text).getText();
    }

    async getcaseTemplateText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.caseTemplateText)));
        return await $(this.selectors.caseTemplateText).getText();
    }

    async getflowsetText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.flowsetText)));
        return await $(this.selectors.flowsetText).getText();
    }

    async getcaseDescriptionText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.descriptionText)));
        return await $(this.selectors.descriptionText).getText();
    }

    async getAssigneeText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeText)));
        return await $(this.selectors.assigneeText).getText();
    }

    async getAssignedGroupText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroupText)));
        return await $(this.selectors.assignedGroupText).getText();
    }

    async getDepartmentText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.departmentText)));
        return await $(this.selectors.departmentText).getText();
    }

    async getBusinessUnitText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.businessUnitText)));
        return await $(this.selectors.businessUnitText).getText();
    }

    async getAssignedCompanyText(): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedCompanyText)));
        return await $(this.selectors.assignedCompanyText).getText();
    }

    async clickEmailLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.emailLink)));
        await $(this.selectors.assignedCompanyText).click();
    }

    async clickAttachmentsLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.attachmentsLink)));
        await $(this.selectors.attachmentsLink).click();
    }

    async clickAddToWatchlistLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addToWatchlist)));
        await $(this.selectors.addToWatchlist).click();
    }

    async clickstopWatchingLink(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.stopWatching)));
        await $(this.selectors.stopWatching).click();
    }

    async navigateToRelatedCasesTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.relatedCasesTab)));
        await $(this.selectors.relatedCasesTab).click();
    }

    async navigateToRelatedPersonsTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.relatedPersonTab)));
        await $(this.selectors.relatedPersonTab).click();
    }

    async navigateToCaseAccessTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseAccessTab)));
        await $(this.selectors.caseAccessTab).click();
    }

    async navigateToResourcesTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.resourcesTab)));
        await $(this.selectors.resourcesTab).click();
    }

    async navigateToActivityTab(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.activityTab)));
        await $(this.selectors.activityTab).click();
    }
}

export default new CaseEditPage();