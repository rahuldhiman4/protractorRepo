import { resolve } from "path";
import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser} from "protractor";
import utilityCommon from '../../utils/utility.common';
import selectCasetemplateBladePo from './select-casetemplate-blade.po';
import utilGrid from '../../utils/util.grid';
import utilityGrid from '../../utils/utility.grid';
class CreateCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createCaseTitle: '[rx-view-component-id="20fd268e-bab1-44f9-af13-a27fe2f1cf50"] span',
        priorityGuid: '367e71d0-f31f-452a-934b-d7a78125cdf1',
        attachmentLink: '[rx-view-component-id="e494b462-7749-44aa-922e-fc5d9b3dd5cb"] button',
        autoCategorization: '[rx-view-component-id="cfb3cc65-210c-4530-b529-3bc414b6d8dc"] button',
        changeAssignment: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignedCompany: '[rx-view-component-id="8ac19557-eebc-4c14-9304-efc60d01e09f"] .dropdown-toggle',
        buisnessUnit: '[rx-view-component-id="3c0986c0-c2b1-44e3-bd29-ac4757e55a66"] .dropdown-toggle',
        department: '[rx-view-component-id="a2a501d1-ac3c-460f-8422-2a559be7445e"] .dropdown-toggle',
        assignedGroup: '[rx-view-component-id="79750d81-d8e5-447e-b923-94c54f2d3310"] .dropdown-toggle',
        assignee: '[rx-view-component-id="43c3e9ee-dde2-4e10-94e9-c6ee68217cda"] .dropdown-toggle',
        sourceGuid: 'e658258a-bc01-4325-a5be-2dfad7aaefdd',
        requesterInput: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] input.form-control',
        requesters: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] .dropdown-item',
        summary: '[rx-view-component-id="d73c8aff-f9e0-4eef-8226-a65f19fab4db"] input',
        summaryGuid: 'd73c8aff-f9e0-4eef-8226-a65f19fab4db',
        contactInput: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] input.form-control',
        contacts: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] .dropdown-item',
        siteDropDown: '[rx-view-component-id="1113b368-e1eb-40e9-898f-65c075565462"] .dropdown-toggle',
        site: '[rx-view-component-id="1113b368-e1eb-40e9-898f-65c075565462"] input.form-control',
        siteOption: '[rx-view-component-id="1113b368-e1eb-40e9-898f-65c075565462"] .dropdown_select__menu-content button',
        priorityDropDown: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .dropdown-toggle',
        priorityOption: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .dropdown_select__menu-content button',
        description: '[rx-view-component-id="e494b462-7749-44aa-922e-fc5d9b3dd5cb"] textarea',
        categoryTier1Guid: '9e97113b-b045-4cd6-b776-368bea50f137',
        categoryTier2Guid: '20067485-2b38-44a0-a6ed-aec998df377b',
        categoryTier3Guid: '9bfb3795-0543-4a17-a374-28dc586d1e03',
        categoryTier4Guid: 'ba093458-4486-4619-8587-4d3edbd45e45',
        assignToMeButton: '[rx-view-component-id="000ed75a-487c-4fa2-b615-7d7b0bddc6dc"] button',
        saveCaseButton: '[rx-view-component-id="cdb4375b-706d-4efc-be66-a8f32b1434ed"] button',
        selectCaseTemplateButton: '[rx-view-component-id="db1cc7ef-0430-42ad-8f28-1e524347cfb3"] button',
        clearTemplateButton: '[rx-view-component-id="d996182c-0930-40ed-987f-43e6da0a8d8a"] button',
        company: '[rx-view-component-id="a7cfc996-f8c8-4ef0-afe4-18ca7e1fef88"] .dropdown-toggle',
        contactGuid: 'e1f5a770-e416-4ed1-bfea-eefeed86544b',
        descriptionGuid: 'e494b462-7749-44aa-922e-fc5d9b3dd5cb',
        assigneGuid: '43c3e9ee-dde2-4e10-94e9-c6ee68217cda',
        assignedGroupGuid: '79750d81-d8e5-447e-b923-94c54f2d3310',
        labelGuid: '47f29467-cdd3-4e04-a7f2-ceb795e8b6e5',
        attachmentField: '[rx-view-component-id="e494b462-7749-44aa-922e-fc5d9b3dd5cb"] input[type="file"]',
        clearRequesterButton: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] .d-icon-cross',
        templateValue: 'td .btn-link',
    }

    async addDescriptionAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray=fileToUpload.map((curStr)=>{return resolve(__dirname, curStr)});
        console.log(absPathArray);
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async getCreateCaseTitle(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.createCaseTitle)));
        return await $(this.selectors.createCaseTitle).getText();
    }

    async getCompany(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.company)));
        return await $(this.selectors.company).getText();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignment)));
        await $(this.selectors.changeAssignment).click();
    }

    async isAssigneToMeEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeButton)));
        return await $(this.selectors.assignToMeButton).isEnabled();
    }

    async isAutocategorizationEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.autoCategorization)));
        return await $(this.selectors.autoCategorization).isEnabled();
    }

    async isAssignToMePresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeButton)));
        return await $(this.selectors.assignToMeButton).isDisplayed();
    }

    async isChangeAssignmentButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.changeAssignment)));
        return await $(this.selectors.changeAssignment).isEnabled();
    }

    async isRequesterRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterInput)));
        return await utilityCommon.isRequiredTagToField('be946309-c359-40fe-a579-1a0e0d04bb01');
    }

    async isPriorityRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.priorityGuid);
    }

    async isSourceRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.sourceRequiredText)));
        return await utilityCommon.isRequiredTagToField(this.selectors.sourceGuid);
    }

    async isSummaryRequiredTextPresent(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.summary)));
        return await utilityCommon.isRequiredTagToField(this.selectors.summaryGuid);
    }

    async isCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField('a7cfc996-f8c8-4ef0-afe4-18ca7e1fef88');
    }

    async isSelectCaseTemplateButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.selectCaseTemplateButton)));
        return await $(this.selectors.selectCaseTemplateButton).isEnabled();
    }

    async isClearTemplateButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.clearTemplateButton)));
        return await $(this.selectors.clearTemplateButton).isEnabled();
    }

    async isAssignedCompanyReadOnly(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedCompany)));
        return await $(this.selectors.assignedCompany).isEnabled() == false ? true : false;
    }

    async isBuisnessUnitReadOnly(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.buisnessUnit)));
        return await $(this.selectors.buisnessUnit).isEnabled() == false ? true : false;
    }

    async isDepartmentReadOnly(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.department)));
        return await $(this.selectors.department).isEnabled() == false ? true : false;
    }

    async isAssignedGroupReadOnly(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignedGroup)));
        return await $(this.selectors.assignedGroup).isEnabled() == false ? true : false;
    }

    async isAssigneeReadOnly(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignee)));
        return await $(this.selectors.assignee).isEnabled() == false ? true : false;
    }

    async selectRequester(requester: string): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.requesterInput)));
        await $(this.selectors.requesterInput).sendKeys(requester);
        //await browser.wait(this.EC.visibilityOf($(this.selectors.requesters)));
        await $$(this.selectors.requesters).first().click();
    }

    async selectSite(siteName: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.siteDropDown)));
        await $(this.selectors.siteDropDown).click();
        await $(this.selectors.site).click();
        await $(this.selectors.site).sendKeys(siteName);
        await element(by.cssContainingText(this.selectors.siteOption, siteName)).click();
    }

    async setLabel(label: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, label);
    }

    async setPriority(priorityVal: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.priorityDropDown)));
        await $(this.selectors.priorityDropDown).click();
        await element(by.cssContainingText(this.selectors.priorityOption, priorityVal)).click();
    }

    async clickOnPriority(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.priorityDropDown)));
        await $(this.selectors.priorityDropDown).click();
    }

    async setSummary(summary: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summary)));
        await $(this.selectors.summary).sendKeys(summary);
    }

    async allPriorityOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isDropDownValueDisplayed(this.selectors.priorityGuid, list);
    }

    async setDescription(description: string): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).sendKeys(description);
    }

    async selectCategoryTier1(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier1Guid, categValue);
    }

    async selectCategoryTier2(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier2Guid, categValue);
    }

    async selectCategoryTier3(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier3Guid, categValue);
    }

    async selectCategoryTier4(categValue: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.categoryTier4Guid, categValue);
    }

    async clickAssignToMeButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeButton)));
        await $(this.selectors.assignToMeButton).click();
    }

    async clickSaveCaseButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        await $(this.selectors.saveCaseButton).click();
        //        await utilityCommon.waitUntilPopUpDisappear();
        //        await utilityCommon.waitUntilSpinnerToHide();
    }

    async isSaveCaseButtonEnabled(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveCaseButton)));
        return await $(this.selectors.saveCaseButton).isEnabled();
    }

    async clickSaveCaseButtonWithoutMessageDisappear(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        await $(this.selectors.saveCaseButton).click();
    }

    async isAttachmentButtonDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.saveCaseButton)));
        return await $(this.selectors.saveCaseButton).isDisplayed();
    }

    async clickSelectCaseTemplateButton(): Promise<void> {
        await $(this.selectors.selectCaseTemplateButton).click();
    }

    async clickClearTemplateButton(): Promise<void> {
        await $(this.selectors.clearTemplateButton).click();
    }

    async setContactName(contact: string): Promise<void> {
        //await browser.wait(this.EC.visibilityOf($(this.selectors.contactInput)));
        await $(this.selectors.contactInput).sendKeys(contact);
        //await browser.wait(this.EC.visibilityOf($(this.selectors.contacts)));
        await $$(this.selectors.contacts).first().click();
    }

    async getCategoryTier1Title(categoryTier1: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier1Guid, categoryTier1);
    }

    async getCategoryTier2Title(categoryTier2: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier2Guid, categoryTier2);
    }

    async getCategoryTier3Title(categoryTier3: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier3Guid, categoryTier3);
    }

    async getCategoryTier4Title(categoryTier4: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.categoryTier4Guid, categoryTier4);
    }

    async getContactTitle(contact: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.contactGuid, contact);
    }

    async getDescriptionTitle(description: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.descriptionGuid, description);
    }

    async getAssigneeTitle(assignee: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.assigneGuid, assignee);
    }

    async clickClearRequesterButton(): Promise<void> {
        await $(this.selectors.clearRequesterButton).click();
    }

    async isTemplateNamePresent(templateName: string) :Promise<boolean>{    
        await selectCasetemplateBladePo.clickOnAllTemplateTab();
        await utilityGrid.searchRecord(templateName);
        return await element(by.cssContainingText(this.selectors.templateValue,templateName)).isPresent();
    }
}

export default new CreateCasePage();