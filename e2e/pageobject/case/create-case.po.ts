import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import viewCasePo from '../../pageobject/case/view-case.po';
import utilCommon from '../../utils/util.common';

class CreateCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        autoCategorization: '[rx-view-component-id="cfb3cc65-210c-4530-b529-3bc414b6d8dc"] button',
        changeAssignment: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
        assignedCompany: '[rx-view-component-id="8ac19557-eebc-4c14-9304-efc60d01e09f"] .ui-select-match',
        buisnessUnit: '[rx-view-component-id="3c0986c0-c2b1-44e3-bd29-ac4757e55a66"] .ui-select-match',
        department: '[rx-view-component-id="a2a501d1-ac3c-460f-8422-2a559be7445e"] .ui-select-match',
        assignedGroup: '[rx-view-component-id="79750d81-d8e5-447e-b923-94c54f2d3310"] .ui-select-match',
        assignee: '[rx-view-component-id="43c3e9ee-dde2-4e10-94e9-c6ee68217cda"] .ui-select-match',
        assignedCompanyRequiredText: '[rx-view-component-id="8ac19557-eebc-4c14-9304-efc60d01e09f"] rx-select-with-pagination',
        sourceRequiredText: '[rx-view-component-id="e658258a-bc01-4325-a5be-2dfad7aaefdd"] .ui-select-container',
        priorityRequiredText: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .ui-select-container',
        requesterInput: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] input.person-input',
        requesters: '[rx-view-component-id="be946309-c359-40fe-a579-1a0e0d04bb01"] .uib-typeahead-match',
        contacts: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] .uib-typeahead-match',
        summary: '[rx-view-component-id="d73c8aff-f9e0-4eef-8226-a65f19fab4db"] input',
        contactInput: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] input',
        contactRequesters: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] .uib-typeahead-match',
        site: '[rx-view-component-id="1113b368-e1eb-40e9-898f-65c075565462"] input[type="search"]',
        siteOption: '[rx-view-component-id="1113b368-e1eb-40e9-898f-65c075565462"] .ui-select__rx-choice',
        priorityDropDown: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .ui-select-toggle',
        priority: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] input[type="search"]',
        priorityOption: '[rx-view-component-id="367e71d0-f31f-452a-934b-d7a78125cdf1"] .ui-select__rx-choice',
        description: '[rx-view-component-id="e494b462-7749-44aa-922e-fc5d9b3dd5cb"] textarea',
        category1: '[rx-view-component-id="9e97113b-b045-4cd6-b776-368bea50f137"]',
        category2: '[rx-view-component-id="20067485-2b38-44a0-a6ed-aec998df377b"]',
        category3: '[rx-view-component-id="9bfb3795-0543-4a17-a374-28dc586d1e03"]',
        category4: '[rx-view-component-id="ba093458-4486-4619-8587-4d3edbd45e45"]',
        assignToMeButton: '[rx-view-component-id="000ed75a-487c-4fa2-b615-7d7b0bddc6dc"] button',
        saveCaseButton: '[rx-view-component-id="cdb4375b-706d-4efc-be66-a8f32b1434ed"] button',
        gotoCaseButton__preview: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        viewCaseButton: '[rx-view-component-id="fbfc234b-c34f-4aab-ac54-b3a9eddecebf"] button',
        selectCaseTemplateButton: '[rx-view-component-id="db1cc7ef-0430-42ad-8f28-1e524347cfb3"] button',
        clearTemplateButton: '[rx-view-component-id="d996182c-0930-40ed-987f-43e6da0a8d8a"] button',
        contact: '[rx-view-component-id="e1f5a770-e416-4ed1-bfea-eefeed86544b"] input',
    }

    async clickChangeAssignmentButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignment)));
        await $(this.selectors.changeAssignment).click();
    }

    async isAssigneToMeDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeButton)));
        return await $(this.selectors.assignToMeButton).getAttribute('disabled') == 'true' ? true : false;;
    }

    async isAutocategorizationDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.autoCategorization)));
        return await $(this.selectors.autoCategorization).getAttribute('disabled') == 'true' ? true : false;;
    }

    async isAssignToMePresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeButton)));
        return await $(this.selectors.assignToMeButton).isDisplayed();
    }

    async isChangeAssignmentButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeAssignment)));
        return await $(this.selectors.changeAssignment).getAttribute('disabled') == 'true' ? true : false;;
    }

    async isRequesterRequiredTextPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesterInput)));
        return await $(this.selectors.requesterInput).getAttribute('ng-required') == 'true' ? true : false;;
    }

    async isPriorityRequiredTextPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.priorityRequiredText)));
        return await $(this.selectors.priorityRequiredText).getAttribute('required') == 'true' ? true : false;;
    }

    async isSourceRequiredTextPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.sourceRequiredText)));
        return await $(this.selectors.sourceRequiredText).getAttribute('required') == 'true' ? true : false;;
    }

    async isSummaryRequiredTextPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.summary)));
        return await $(this.selectors.summary).getAttribute('required') == 'true' ? true : false;;
    }

    async isAssignedCompanyRequiredTextPresent(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignedCompanyRequiredText)));
        return await $(this.selectors.assignedCompanyRequiredText).getAttribute('is-required') == 'true' ? true : false;;
    }

    async isSelectCaseTemplateButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectCaseTemplateButton)));
        return await $(this.selectors.selectCaseTemplateButton).getAttribute('disabled') == 'true' ? true : false;;
    }

    async isClearTemplateButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.clearTemplateButton)));
        return await $(this.selectors.clearTemplateButton).getAttribute('disabled') == 'true' ? true : false;;
    }

    async isAssignedCompanyReadOnly(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignedCompany)));
        return await $(this.selectors.assignedCompany).getAttribute('readonly') == 'true' ? true : false;;
    }

    async isBuisnessUnitReadOnly(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.buisnessUnit)));
        return await $(this.selectors.buisnessUnit).getAttribute('readonly') == 'true' ? true : false;;
    }

    async isDepartmentReadOnly(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.department)));
        return await $(this.selectors.department).getAttribute('readonly') == 'true' ? true : false;;
    }

    async isAssignedGroupReadOnly(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignedGroup)));
        return await $(this.selectors.assignedGroup).getAttribute('readonly') == 'true' ? true : false;;
    }

    async isAssigneeReadOnly(): Promise<boolean> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignee)));
        return await $(this.selectors.assignee).getAttribute('readonly') == 'true' ? true : false;;
    }

    async selectRequester(requester: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterInput)));
        await $(this.selectors.requesterInput).sendKeys(requester);
        await browser.wait(this.EC.visibilityOf($(this.selectors.requesters)));
        await $$(this.selectors.requesters).first().click();
    }

    async selectContact(contactName: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.contactInput)));
        await $(this.selectors.contactInput).sendKeys(contactName);
        await browser.wait(this.EC.visibilityOf($(this.selectors.contactRequesters)));
        await $$(this.selectors.contactRequesters).first().click();
    }

    async selectSite(siteName: string): Promise<void> {
        await $(this.selectors.site).click();
        await $(this.selectors.site).sendKeys(siteName);
        await element(by.cssContainingText(this.selectors.siteOption, siteName)).click();
    }

    async setPriority(priorityVal: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.priorityDropDown)));
        await $(this.selectors.priorityDropDown).click();
        await $(this.selectors.priority).sendKeys(priorityVal);
        await element(by.cssContainingText(this.selectors.priorityOption, priorityVal)).click();
    }

    async setSummary(summary: string): Promise<void> {
        await $(this.selectors.summary).sendKeys(summary);
    }

    async setDescription(description: string): Promise<void> {
        await $(this.selectors.description).sendKeys(description);
    }

    async selectCategoryTier1(categValue: string): Promise<void> {
        let categ1 = $(this.selectors.category1);
        await (categ1.$('.ui-select-match')).click();
        await (categ1.$('input')).sendKeys(categValue);
        await browser.wait(this.EC.elementToBeClickable(categ1.$(`[title="${categValue}"]`)));
        await (categ1.$(`[title="${categValue}"]`)).click();
    }

    async selectCategoryTier2(categValue: string): Promise<void> {
        let categ2 = $(this.selectors.category2);
        await (categ2.$('.ui-select-match')).click();
        await (categ2.$('input')).sendKeys(categValue);
        await browser.wait(this.EC.elementToBeClickable(categ2.$(`[title="${categValue}"]`)));
        await (categ2.$(`[title="${categValue}"]`)).click();
    }

    async selectCategoryTier3(categValue: string): Promise<void> {
        let categ3 = $(this.selectors.category3);
        await (categ3.$('.ui-select-match')).click();
        await (categ3.$('input')).sendKeys(categValue);
        await browser.wait(this.EC.elementToBeClickable(categ3.$(`[title="${categValue}"]`)));
        await (categ3.$(`[title="${categValue}"]`)).click();
    }

    async clickAssignToMeButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeButton)));
        await $(this.selectors.assignToMeButton).click();
    }

    async clickSaveCaseButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveCaseButton)));
        await $(this.selectors.saveCaseButton).click();
        await utilCommon.waitUntilPopUpDisappear();
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isSaveCaseButtonDisabled(): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.saveCaseButton)));
        return await $(this.selectors.saveCaseButton).getAttribute("disabled") == 'true' ? true : false;;
    }

    async clickGoToCaseButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.gotoCaseButton__preview)));
        await $(this.selectors.gotoCaseButton__preview).click();
        await browser.wait(this.EC.elementToBeClickable($(viewCasePo.selectors.addTaskButton)));
        await utilCommon.waitUntilSpinnerToHide();
    }

    async clickSelectCaseTemplateButton(): Promise<void> {
        await $(this.selectors.selectCaseTemplateButton).click();
    }

    async clickClearTemplateButton(): Promise<void> {
        await $(this.selectors.clearTemplateButton).click();
    }

    async setContactName(contact: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.contact)));
        await $(this.selectors.contact).sendKeys(contact);
        await browser.wait(this.EC.visibilityOf($(this.selectors.contacts)));
        await $$(this.selectors.contacts).first().click();
    }

    async selectCategoryTier4(categValue: string): Promise<void> {
        let categ4 = $(this.selectors.category4);
        await (categ4.$('.ui-select-match')).click();
        await (categ4.$('input')).sendKeys(categValue);
        await browser.wait(this.EC.elementToBeClickable(categ4.$(`[title="${categValue}"]`)));
        await (categ4.$(`[title="${categValue}"]`)).click();
    }

}

export default new CreateCasePage();