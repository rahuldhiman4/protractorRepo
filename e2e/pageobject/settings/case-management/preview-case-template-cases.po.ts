import utilityCommon from '../../../utils/utility.common';
import { $, protractor, element, by, ProtractorExpectedConditions, $$ } from "protractor";

class PreviewCaseTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        caseSummary: 'a2f98969-6981-4931-b38b-69b1684cd9bf',
        caseSummaryValue: '[rx-view-component-id="a2f98969-6981-4931-b38b-69b1684cd9bf"] .read-only-content',
        caseTemplateName: '[rx-view-component-id="7570f145-6939-4462-bd01-b11b9405a08c"] span',
        caseStatus: '5ed66ea0-28ff-41b6-b587-ed42d0b2d9b2',
        caseStatusValue: '[rx-view-component-id="5ed66ea0-28ff-41b6-b587-ed42d0b2d9b2"] .read-only-content',
        caseCompany: 'f87f672b-230f-4ced-95b7-fddcfcf86509',
        caseCompanyValue: '[rx-view-component-id="f87f672b-230f-4ced-95b7-fddcfcf86509"] .read-only-content',
        casePriority: '747196f3-6773-434f-b1ac-9b83ac6aa8cf',
        casePriorityValue: '[rx-view-component-id="747196f3-6773-434f-b1ac-9b83ac6aa8cf"] .read-only-content',
        caseCategoryTier1: 'ca3b842c-0069-4cc2-b013-1e00a0f2eb19',
        caseCategoryTier2: '267deae6-a5c6-409f-85c3-9acc1bdc8598',
        caseCategoryTier3: 'b9e2c0da-ea81-4491-9039-c99d5f2da122',
        caseCategoryTier4: 'e374b6aa-ac7d-42e6-89dd-c91404e98572',
        flowset: 'e196128e-f1cc-41b0-b976-0d24a0096762',
        label: '376c34ee-cd90-4c37-9cac-5a16053b6cef',
        caseDescription: '169adf6c-7674-448b-9732-0eecbebae380',
        supportGroup: '665d77b9-5446-4318-add1-65e3bc8157eb',
        supportCompany: 'a6a721e0-4a98-4d1f-85a8-27c7075a5a2a',
        assignee: '.person-main label',
        backButton: '[rx-view-component-id="83c4c73b-86b4-4894-b4c2-4d0525bed20d"] button',
        dynamicFieldName: '[rx-view-component-id="3cacaba4-7a3b-411f-85c1-cb76bb7bc789"] span',
        showMoreDescriptionLink: '[rx-view-component-id="169adf6c-7674-448b-9732-0eecbebae380"] button',
    }

    async clickShowMoreDescriptionLink(): Promise<void> {
        await $(this.selectors.showMoreDescriptionLink).click();
    }

    async clickOnBackButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.backButton)));
        return await $(this.selectors.backButton).click();
    }

    async getCaseTemplateName(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateName)));
        return await $(this.selectors.caseTemplateName).getText();
    }

    async getCaseSummary(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseSummaryValue)));
        return await $(this.selectors.caseSummaryValue).getText();
    }

    async getCasePriority(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.casePriorityValue)));
        return await $(this.selectors.casePriorityValue).getText();
    }

    async getCaseStatus(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseStatusValue)));
        return await $(this.selectors.caseStatusValue).getText();
    }

    async getCaseCompanyValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseCompanyValue)));
        return await $(this.selectors.caseCompanyValue).getText();
    }

    async isCaseSummaryHeaderDisplayed(caseSummary: string): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseSummary)));
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseSummary, caseSummary);
    }

    async isCaseCompanyTitleDisplayed(caseCompany: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseCompany, caseCompany);
    }

    async isCaseStatusTitleDisplayed(caseStatusname: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseStatus, caseStatusname);
    }

    async isCasePriorityTitleDisplayed(casePriority: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.casePriority, casePriority);
    }

    async isCaseCategoryTier1TitleDisplayed(caseCategoryTier1: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseCategoryTier1, caseCategoryTier1);
    }

    async isCaseCategoryTier2TitleDisplayed(caseCategoryTier2: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseCategoryTier2, caseCategoryTier2);
    }

    async isCaseCategoryTier3TitleDisplayed(caseCategoryTier3: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseCategoryTier3, caseCategoryTier3);
    }

    async isCaseCategoryTier4TitleDisplayed(caseCategoryTier4: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.caseCategoryTier4, caseCategoryTier4);
    }

    async isFlowsetTitleDisplayed(flowset: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.flowset, flowset);
    }

    async isLabelTitleDisplayed(label: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.label, label);
    }

    async isCaseDescriptionTitleDisplayed(caseDescription: string): Promise<boolean> {
        let fieldLabel = '[rx-view-component-id="169adf6c-7674-448b-9732-0eecbebae380"] label span';
        return await element(by.cssContainingText(fieldLabel, caseDescription)).isPresent().then(async (result) => {
            if (result) {
                return await element(by.cssContainingText(fieldLabel, caseDescription)).getText() == caseDescription ? true : false;
            } else {
                console.log(caseDescription, " not present");
                return false;
            }
        });
    }

    async isSupportGroupTitleDisplayed(supportGroup: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.supportGroup, supportGroup);
    }

    async isSupportCompanyTitleDisplayed(supportCompany: string): Promise<boolean> {
        return await utilityCommon.isFieldLabelDisplayed(this.selectors.supportCompany, supportCompany);
    }

    async isAssigneeTitleDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignee)));
        return await $(this.selectors.assignee).isDisplayed();
    }

    async isGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="3cacaba4-7a3b-411f-85c1-cb76bb7bc789"] .group-container__name div[title=${groupName}]`).isDisplayed();
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.dynamicFieldName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$(this.selectors.dynamicFieldName).get(i).getText();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }
}

export default new PreviewCaseTemplateBlade();