import { $, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateTaskTemplatePage {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7"] input',
        templateNameGuid: '2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7',
        taskSummary: '[rx-view-component-id="c19d336e-7339-4970-b69a-100108d672fd"] input',
        taskSummaryGuid: 'c19d336e-7339-4970-b69a-100108d672fd',
        taskCompny: 'f62bd26b-c464-4dff-ab7b-e4446d1cbf99',
        taskPriority: '1b9c265f-e618-4f0a-9b21-55dbb78e0cd1',
        label: 'df2fba00-56d2-412c-ac22-b2990fcd4337',
        taskCategoryDrpDown1: 'b4b55a43-81bc-43aa-877b-32e71babf229',
        taskCategoryDrpDown2: '1fa4a29b-2234-4b17-8f2e-0649d1df860e',
        taskCategoryDrpDown3: '09e9fc7b-03ab-45ec-83b2-7dbb42e64f23',
        taskCategoryDrpDown4: '44f1eacf-54a4-473d-b764-4735948ed204',
        changeAssignmentButton: '[rx-view-component-id="0bd0a580-775d-491f-be52-87c14a8b6e2d"] button',
        taskDescriptionGuid: 'b9b752cf-8cef-4598-9a8d-85748b13f0d7',
        templateStatus: '09db292a-212a-433e-8c20-a92f8c4e5168',
        ownerCompany: '87ec3995-3350-4e3f-ab19-0f1e7846fbd7',
        buisnessUnit: 'a81cc2df-7b89-4367-81f7-f0ad5e786ca2',
        department: '5ae20516-9fd9-47f1-9f16-93726cd33de4',
        ownerGroup: '61278673-8106-419c-83e4-a9e00f12f835',
        saveButton: '[rx-view-component-id="5001f6ea-4438-4485-bdd2-c952a12a1a34"] button',
        cancelButton: '[rx-view-component-id="3f760e5f-70e9-4fbf-8b05-cd7d460f8818"] button',
        processBundleIdDrpDownForNewProcess: 'e8a2406c-6991-4ea1-bfdf-bde29abe2ef7',
        processBundleIdDrpDownForExistingProcess: '[rx-view-component-id="71e09acc-0077-4e55-9c24-7f6bdc90ce5d"] .d-icon-right-angle_down',
        toggleBox: '0ef8534e-a8bf-40c3-bdc1-a91edde177c4',
        toggleBoxRequiredText: '[rx-view-component-id="0ef8534e-a8bf-40c3-bdc1-a91edde177c4"] label',
        newProcessName: '[rx-view-component-id="eefdf45b-47af-48cb-8c8b-a82c73f7d5a4"] input',
        searchProcess: '.d-icon-search',
        setInputdataInProcess: '[rx-view-component-id="71e09acc-0077-4e55-9c24-7f6bdc90ce5d"] input',
        selectNameInProcess: '.rx-definition-picker__instance-name mark',
        addTaskTemplateTitle: '[rx-view-component-id="e564f60e-d84f-41fc-b130-998cdc60eca4"] span',
        templateMetadataTitle: '[rx-view-component-id="24bd49d8-5ca3-451a-86a1-eb26b687e801"] span',
        processBundleIdRequiredTxt: '5f30b3d4-caa2-4c28-8af6-cebf094bc2e8',
        newprocessGuid: 'eefdf45b-47af-48cb-8c8b-a82c73f7d5a4',
    }

    async setTemplateName(inputValue: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(inputValue);
    }

    async setTaskSummary(inputValue: string): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(inputValue);
    }

    async setTaskDescription(inputValue: string): Promise<void> {
        await utilCommon.setCKEditor(inputValue, this.selectors.taskDescriptionGuid);
    }

    async updateTaskDescription(inputValue: string): Promise<void> {
        await utilCommon.updateCKEditor(inputValue, this.selectors.taskDescriptionGuid);
    }

    async clickOnAssignment(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickOnSaveTaskTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
        //  await utilCommon.closePopUpMessage();
    }

    async clickOnCancelTaskTemplate(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }

    async selectCompanyByName(companyName: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCompny, companyName);
    }

    async isProcessTitlePresent(newProcess: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.newprocessGuid, newProcess);
    }

    async selectTaskPriority(priority: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskPriority, priority);
    }

    async selectLabel(label: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.label, label);
    }

    async selectTaskCategoryTier1(category1: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown1, category1);
    }

    async selectTaskCategoryTier2(category2: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown2, category2);
    }

    async selectTaskCategoryTier3(category3: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown3, category3);
    }

    async selectTaskCategoryTier4(category4: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.taskCategoryDrpDown4, category4);
    }

    async selectTemplateStatus(status: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.templateStatus, status);
    }

    async selectOwnerCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerCompany, company);
    }

    async selectBuisnessUnit(buisnessunit: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.buisnessUnit, buisnessunit);
    }

    async selectDepartment(departmentname: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.department, departmentname);
    }

    async selectOwnerGroup(ownergroup: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.ownerGroup, ownergroup);
    }

    async setNewProcessName(bundle: string, inputValue: string): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.toggleBox, true);
        await utilCommon.selectDropDown(this.selectors.processBundleIdDrpDownForNewProcess, bundle);
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.newProcessName)));
        await $(this.selectors.newProcessName).clear();
        await $(this.selectors.newProcessName).sendKeys(inputValue);
    }

    async setExistingProcessName(processName: string): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.toggleBox, false);
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.processBundleIdDrpDownForExistingProcess)));
        await $(this.selectors.processBundleIdDrpDownForExistingProcess).click();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchProcess)));
        await $(this.selectors.searchProcess).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.setInputdataInProcess)));
        await $(this.selectors.setInputdataInProcess).sendKeys(processName);
        //        await browser.sleep(1000);
        var option = await element(by.cssContainingText(this.selectors.selectNameInProcess, processName));
        //        await browser.wait(this.EC.elementToBeClickable(option));
        await option.click();
    }

    async setcreateNewProcess(processName: boolean): Promise<void> {
        await utilCommon.selectToggleButton(this.selectors.toggleBox, processName);
    }
    async isTemplateNameRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.templateNameGuid);
    }

    async isTaskSummaryRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.taskSummaryGuid);
    }

    async isTaskPriorityRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.taskPriority);
    }

    async isTemplateStatusRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.templateStatus);
    }

    async isOwnerComapnyRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.ownerCompany);
    }

    async isOwnerGroupRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.ownerGroup);
    }

    async isCreateNewProcessRequiredText(): Promise<boolean> {
        let value: string = await browser.executeScript('return window.getComputedStyle(arguments[0], ":after").content;', $(this.selectors.toggleBoxRequiredText));
        return value.trim().substring(3, value.length - 2) === 'required';
    }

    async isProcessBundleIdRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.processBundleIdRequiredTxt);
    }

    async isNewProcessNameRequiredText(): Promise<boolean> {
        return await utilCommon.isRequiredTagToField(this.selectors.newprocessGuid);
    }

    async isTaskDescriptionTitlePresent(value: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskDescriptionGuid, value);
    }

    async isTaskCategoryTier1TitlePresent(value: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryDrpDown1, value);
    }

    async isTaskCategoryTier2TitlePresent(value: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryDrpDown2, value);
    }

    async isTaskCategoryTier3TitlePresent(value: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryDrpDown3, value);
    }

    async isTaskCategoryTier4TitlePresent(value: string): Promise<boolean> {
        return await utilCommon.isFieldLabelDisplayed(this.selectors.taskCategoryDrpDown4, value);
    }

    async isAddTaskTemplateTitleDisplayed(value: string): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.addTaskTemplateTitle)));
        return await $(this.selectors.addTaskTemplateTitle).getText() == value;
    }

    async isTemplateMetadataTitleDisplayed(value: string): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.templateMetadataTitle)));
        return await $(this.selectors.templateMetadataTitle).getText() == value;
    }
}

export default new CreateTaskTemplatePage();