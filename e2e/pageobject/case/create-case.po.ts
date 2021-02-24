import { resolve } from "path";
import { $, $$, by, element, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../utils/utility.common';
import selectCasetemplateBladePo from './select-casetemplate-blade.po';
import utilityGrid from '../../utils/utility.grid';
class CreateCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createCaseTitle: '[rx-view-component-id="20fd268e-bab1-44f9-af13-a27fe2f1cf50"] span',
        priorityGuid: '367e71d0-f31f-452a-934b-d7a78125cdf1',
        attachmentLink: '[rx-view-component-id="e494b462-7749-44aa-922e-fc5d9b3dd5cb"] button',
        autoCategorization: '[rx-view-component-id="cfb3cc65-210c-4530-b529-3bc414b6d8dc"] button',
        changeAssignment: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignedCompany: '[rx-view-component-id="8bdf1730-165d-4703-a3fe-26a830a7f947"] button',
        businessUnit: '[rx-view-component-id="3c0986c0-c2b1-44e3-bd29-ac4757e55a66"] button',
        department: '[rx-view-component-id="a2a501d1-ac3c-460f-8422-2a559be7445e"] .adapt-select',
        assignedGroup: '[rx-view-component-id="79750d81-d8e5-447e-b923-94c54f2d3310"] .adapt-select',
        assignee: '[rx-view-component-id="43c3e9ee-dde2-4e10-94e9-c6ee68217cda"] .dropdown-toggle',
        sourceGuid: 'e658258a-bc01-4325-a5be-2dfad7aaefdd',
        requesterInput: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] input.form-control',
        requesters: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] .dropdown-item',
        summary: '[rx-view-component-id="d73c8aff-f9e0-4eef-8226-a65f19fab4db"] input',
        summaryGuid: 'd73c8aff-f9e0-4eef-8226-a65f19fab4db',
        contactInput: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] input.form-control',
        contacts: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] .dropdown-item',
        siteDropDown: '[rx-view-component-id="d1a3e796-16c6-4e94-82d4-9ffc5dedfbb3"] .dropdown-toggle',
        site: '[rx-view-component-id="d1a3e796-16c6-4e94-82d4-9ffc5dedfbb3"] input.form-control',
        siteOption: '[rx-view-component-id="d1a3e796-16c6-4e94-82d4-9ffc5dedfbb3"] .rx-select__options button',
        priorityDropDown: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .dropdown-toggle',
        priorityOption: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .dropdown-item',
        descriptionGuid: 'e494b462-7749-44aa-922e-fc5d9b3dd5cb',
        categoryTier1Guid: '51754f35-9122-4c1f-8e31-e1061aa52002',
        categoryTier2Guid: 'f29162d1-0c65-48be-988b-9255a48303f8',
        categoryTier3Guid: '485e16b5-feb8-400e-8013-0b3f7469c047',
        categoryTier4Guid: '0d2b0cd6-a316-401b-b812-d6c8117fcbff',
        assignToMeButton: '[rx-view-component-id="8bdf1730-165d-4703-a3fe-26a830a7f947"] .d-icon-left-user_plus',
        saveCaseButton: '[rx-view-component-id="cdb4375b-706d-4efc-be66-a8f32b1434ed"] button',
        selectCaseTemplateButton: '[rx-view-component-id="db1cc7ef-0430-42ad-8f28-1e524347cfb3"] button',
        clearTemplateButton: '[rx-view-component-id="d996182c-0930-40ed-987f-43e6da0a8d8a"] button',
        company: '[rx-view-component-id="a7cfc996-f8c8-4ef0-afe4-18ca7e1fef88"] .dropdown-toggle',
        contactGuid: 'e1f5a770-e416-4ed1-bfea-eefeed86544b',
        assigneGuid: '43c3e9ee-dde2-4e10-94e9-c6ee68217cda',
        assignedGroupGuid: '79750d81-d8e5-447e-b923-94c54f2d3310',
        labelGuid: 'b7b2b2c3-a4a2-432c-afab-2dd3bca10356',
        attachmentField: '[rx-view-component-id="e494b462-7749-44aa-922e-fc5d9b3dd5cb"] input[type="file"]',
        clearRequesterButton: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] .d-icon-cross',
        templateValue: 'td .no-href-link',
        cancelButton: '[rx-view-component-id="3e34f97b-e0f1-492e-bb7d-609b5ccc8d4f"] button',
        autoCategorize: '[rx-view-component-id="cfb3cc65-210c-4530-b529-3bc414b6d8dc"] button',
        recommendedTemplate: 'div.bwf-search-fields__title-text',
        categoryTier1Value: '[rx-view-component-id="51754f35-9122-4c1f-8e31-e1061aa52002"] .dropdown-toggle',
        categoryTier2Value: '[rx-view-component-id="f29162d1-0c65-48be-988b-9255a48303f8"] .dropdown-toggle',
        categoryTier3Value: '[rx-view-component-id="485e16b5-feb8-400e-8013-0b3f7469c047"] .dropdown-toggle',
        categoryTier4Value: '[rx-view-component-id="0d2b0cd6-a316-401b-b812-d6c8117fcbff"] .dropdown-toggle',
        lobLabel: '[rx-view-component-id="f0aa7414-4a27-400f-8d0a-c0e7adaab0fc"] .form-control-label span',
        lobValue: '[rx-view-component-id="f0aa7414-4a27-400f-8d0a-c0e7adaab0fc"] button',
        lobSection: '[rx-view-component-id="f0aa7414-4a27-400f-8d0a-c0e7adaab0fc"] adapt-select',
        lineofbusiness: '[rx-view-component-id="f0aa7414-4a27-400f-8d0a-c0e7adaab0fc"] .rx-select__search-button-title',
        lobGuid: 'f0aa7414-4a27-400f-8d0a-c0e7adaab0fc',
        assignedBusinessUnitValue: '[rx-view-component-id="3c0986c0-c2b1-44e3-bd29-ac4757e55a66"] button',
        assignedSupportGroupValue: '[rx-view-component-id="79750d81-d8e5-447e-b923-94c54f2d3310"] button',
        assigneeValue: '[rx-view-component-id="43c3e9ee-dde2-4e10-94e9-c6ee68217cda"] button'
    }

    async addDescriptionAttachment(fileToUpload: string[]): Promise<void> {
        const absPathArray = fileToUpload.map((curStr) => { return resolve(__dirname, curStr) });
        console.log(absPathArray);
        await $(this.selectors.attachmentField).sendKeys(absPathArray.join('\n'));
    }

    async getCreateCaseTitle(): Promise<string> {
        return await $(this.selectors.createCaseTitle).getText();
    }

    async getCompany(): Promise<string> {
        return await $(this.selectors.company).getText();
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await $(this.selectors.changeAssignment).click();
    }

    async isAssigneToMeEnabled(): Promise<boolean> {
        return await $(this.selectors.assignToMeButton).isEnabled();
    }

    async isAutocategorizationEnabled(): Promise<boolean> {
        return await $(this.selectors.autoCategorization).isEnabled();
    }

    async isAssignToMePresent(): Promise<boolean> {
        return await $(this.selectors.assignToMeButton).isDisplayed();
    }

    async isChangeAssignmentButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.changeAssignment).isEnabled();
    }

    async isRequesterRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField('be946309-c359-40fe-a579-1a0e0d04bb01');
    }

    async isPriorityRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.priorityGuid);
    }

    async isSourceRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.sourceGuid);
    }

    async isSummaryRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.summaryGuid);
    }

    async isCompanyRequiredTextPresent(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField('a7cfc996-f8c8-4ef0-afe4-18ca7e1fef88');
    }

    async getLineOfBusinessLabel(): Promise<string> {
        return await $(this.selectors.lobLabel).getText();
    }

    async isLineOfBusinessFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.lobSection).isEnabled();
    }

    async getLineOfBusinessFieldValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }

    async isSelectCaseTemplateButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.selectCaseTemplateButton).isEnabled();
    }

    async isClearTemplateButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.clearTemplateButton).isEnabled();
    }

    async isAssignedCompanyReadOnly(): Promise<boolean> {
        return await $(this.selectors.assignedCompany).getAttribute('disabled') == 'true';
    }

    async isBusinessUnitReadOnly(): Promise<boolean> {
        return await $(this.selectors.businessUnit).getAttribute('aria-readonly') == 'true';
    }

    async isDepartmentReadOnly(): Promise<boolean> {
        return await $(this.selectors.assignedCompany).getAttribute('aria-readonly') == 'true';
    }

    async isAssignedGroupReadOnly(): Promise<boolean> {
        return await $(this.selectors.assignedCompany).getAttribute('aria-readonly') == 'true';
    }

    async isAssigneeReadOnly(): Promise<boolean> {
        return await $(this.selectors.assignee).isEnabled() == false ? true : false;
    }

    async selectRequester(requester: string): Promise<void> {
        await $(this.selectors.requesterInput).clear();
        await $(this.selectors.requesterInput).sendKeys(requester);
        await $$(this.selectors.requesters).first().click();
    }

    async selectSite(siteName: string): Promise<void> {
        await $(this.selectors.siteDropDown).click();
        await $(this.selectors.site).click();
        await $(this.selectors.site).sendKeys(siteName);
        await element(by.cssContainingText(this.selectors.siteOption, siteName)).click();
    }

    async setLabel(label: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.labelGuid, label);
    }

    async setSource(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.sourceGuid, value);
    }

    async setPriority(priorityVal: string): Promise<void> {
        await $(this.selectors.priorityDropDown).click();
        await element(by.cssContainingText(this.selectors.priorityOption, priorityVal)).click();
    }

    async clickOnPriority(): Promise<void> {
        await $(this.selectors.priorityDropDown).click();
    }

    async updateCaseDescription(value:string):Promise<void>{
        await utilityCommon.updateCKEditor(value,this.selectors.descriptionGuid);
    }

    async setSummary(summary: string): Promise<void> {
        await $(this.selectors.summary).sendKeys(summary);
    }

    async clearSummary(): Promise<void> {
        await $(this.selectors.summary).clear();
    }

    async allPriorityOptionsPresent(list: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.priorityGuid, list);
    }

    async setDescription(description: string): Promise<void> {
        await utilityCommon.setCKEditor(description, this.selectors.descriptionGuid);
    }

    async isCategoryTier1DropDownValueDisplayed(categValue: string): Promise<boolean> {
        return await utilityCommon.isValuePresentInDropDown(this.selectors.categoryTier1Guid, categValue);
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
        await $(this.selectors.assignToMeButton).click();
    }

    async clickSaveCaseButton(): Promise<void> {
        await $(this.selectors.saveCaseButton).click();
    }

    async isSaveCaseButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveCaseButton).isEnabled();
    }

    async clickSaveCaseButtonWithoutMessageDisappear(): Promise<void> {
        await $(this.selectors.saveCaseButton).click();
    }

    async isAttachmentButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.saveCaseButton).isDisplayed();
    }

    async clickSelectCaseTemplateButton(): Promise<void> {
        await $(this.selectors.selectCaseTemplateButton).click();
    }

    async clickClearTemplateButton(): Promise<void> {
        await $(this.selectors.clearTemplateButton).click();
    }

    async setContactName(contact: string): Promise<void> {
        await $(this.selectors.contactInput).sendKeys(contact);
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

    async getAssigneeTitle(assignee: string): Promise<void> {
        await utilityCommon.isFieldLabelDisplayed(this.selectors.assigneGuid, assignee);
    }

    async clickClearRequesterButton(): Promise<void> {
        await $(this.selectors.clearRequesterButton).click();
    }

    async isTemplateNamePresent(templateName: string): Promise<boolean> {
        await selectCasetemplateBladePo.clickOnAllTemplateTab();
        await utilityGrid.searchRecord(templateName);
        return await element(by.cssContainingText(this.selectors.templateValue, templateName)).isPresent();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnAutoCategorize(): Promise<void> {
        //await utilityCommon.scrollToElement($(this.selectors.autoCategorize));
        await $(this.selectors.autoCategorize).isEnabled().then(async (result) => {
            if (result) await $(this.selectors.autoCategorize).click();
        });
    }

    async isRecommendedTemplatePresent(templateName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.recommendedTemplate, templateName)).isPresent();
    }

    async isAutoCategorizeButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.autoCategorize).isEnabled();
    }

    async getCategoryTier1Value(): Promise<string> {
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async isSaveCaseButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.saveCaseButton).getAttribute("disabled") == "true";
    }

    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
            case "Label": {
                guid = this.selectors.labelGuid;
                break;
            }
            case "Source": {
                guid = this.selectors.sourceGuid;
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

    async isLineOfBusinessDisabled(): Promise<boolean> {
        return await $(this.selectors.lineofbusiness).getAttribute("disabled") == "true";
    }

    async getLineOfBusinessValue(): Promise<string> {
        let elementPresent = await $(this.selectors.lineofbusiness).isPresent()
          if (elementPresent == true) return await $(this.selectors.lineofbusiness).getText();
      }

    async selectLineOfBusiness(value: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.lobGuid, value);
    }

    async isValuePresentInLineOfBusinessDropDown(value: string): Promise<boolean> {
        return await utilityCommon.isValuePresentInDropDown(this.selectors.lobGuid, value);
    }

    async getAssigneeGroupValue(): Promise<string> {
        return await $(this.selectors.assignedSupportGroupValue).getText();
    }

    async getAssigneeBusinessUnitValue(): Promise<string> {
        return await $(this.selectors.assignedBusinessUnitValue).getText();
    }

    async getAssigneeValue(): Promise<string> {
        return await $(this.selectors.assigneeValue).getText();
    }
}

export default new CreateCasePage();