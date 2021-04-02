import {element, by, $, protractor, ProtractorExpectedConditions, $$, browser } from "protractor";

class CasePreview {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        fieldLabels: '.clearfix label',
        header: '.dp-header span',
        caseSummary: '[rx-view-component-id="2b082dbf-495a-4a0c-aadb-cf78555bbfb0"] span',
        gotoCaseButton: '[rx-view-component-id="529287cb-4d9d-4729-aa6c-5676980df72e"] button',
        caseId: '[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"] .title',
        priority: '[rx-view-component-id="6934b23e-3403-4b21-b4aa-a7a10283c8eb"] .selection-field',
        caseStatus: '[rx-view-component-id="6bbd4072-3626-49a4-8813-b1a456674fc7"] .status-transition',
        requesterName: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] a.person-link',
        requesterCompany: '.person-organization .text-secondary',
        contactName: '[rx-view-component-id="2b74f7f4-7a02-4662-a3be-80b246568c7b"] a.person-link',
        requestPhoneNumber: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .person-phone-link',
        requesterEmailId: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .bwf-person-email button',
        requesterSite: '[rx-view-component-id="a108323b-b110-41ed-9ad8-9dc7b0258c77"] .person-site-text',
        caseTemplate: '[rx-view-component-id="ffb8da80-b878-4b11-8aec-3bd146aab6c0"] div[title]',
        description: '[rx-view-component-id="c5be61e7-f05b-4e30-91d0-e67a32125ff9"] .collapse-block div div div',
        categoryTier1: '[rx-view-component-id="6766318e-f3b3-44ce-b35d-84222675513c"] div[title]',
        categoryTier2: '[rx-view-component-id="34ba16da-12ec-4871-a6b9-48376aa0e3c2"] div[title]',
        categoryTier3: '[rx-view-component-id="3c83d732-3139-4a72-8674-f25b8c3adc13"] div[title]',
        categoryTier4: '[rx-view-component-id="4c0ad2f9-edde-4f60-855a-dae532114d81"] div[title]',
        labelValue: '[rx-view-component-id="ab146574-d991-43bd-8a7b-0be34019164c"] div[title]',
        assignee: '[rx-view-component-id="2a8e0b48-6afb-4479-a904-35c10612d854"]',
        assignedDetails: '[rx-view-component-id="2a8e0b48-6afb-4479-a904-35c10612d854"] div[title]',
        assignedCompany: '[rx-view-component-id="3c3eaad4-9b00-48f0-b1d8-f3881e21e3bc"] div[title]',
        createNewCaseButton: '[rx-view-component-id="e8e6eafe-d19c-4eeb-ab37-8ff302505579"] button',
        source: '[rx-view-component-id="669b71fd-6e23-4625-91f6-139208e47538"] div[title]',
        label: '[rx-view-component-id="ab146574-d991-43bd-8a7b-0be34019164c"] div[title]',
        caseSite: '[rx-view-component-id="974e5fdd-5992-4f87-a640-267c4cc3daae"] div[title]',
        dynamicFieldsName: '[rx-view-component-id="40c6dac1-3d7a-402d-9d78-6ba29bb1c1f1"] label',
        backButton: '[rx-view-component-id="1483f92a-0736-4316-b2e5-084927069d38"] button',
        showMoreDescription:'.bwf-description-read-state button',
        lineOfBusiness: '[rx-view-component-id="2c8feca5-233a-4b48-b2bb-8f8d6ea454ad"] div[title]'
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.fieldLabels, labelName)).isDisplayed();
            } else return false;
        });
    }

    async clickOnShowMoreDescription():Promise<void>{
        await $(this.selectors.showMoreDescription).click();
    }

    async clickOncreateNewCaseButton(): Promise<void> {
        await $(this.selectors.createNewCaseButton).click();
    }

    async isSourceDisplayed(source: string): Promise<boolean> {
        return await $(this.selectors.source).getText() == source ? true : false;
    }

    async isLabelDisplayed(label: string): Promise<boolean> {
        return await $(this.selectors.label).getText() == label ? true : false;
    }

    async isCaseSiteDisplayed(caseSite: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseSite, caseSite)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseSite, caseSite)).isDisplayed();
            } else return false;
        });
    }

    async isTitleDisplayed(): Promise<boolean> {
        return await $(this.selectors.header).getText() == 'Case Preview' ? true : false;
    }

    async isCaseSummaryDisplayed(caseSummary: string): Promise<boolean> {
        return await $(this.selectors.caseSummary).getText() == caseSummary ? true : false;
    }

    async isCaseIdDisplayed(): Promise<boolean> {
        return await $(this.selectors.caseId).isDisplayed();
    }

    async isGlobalSearchCaseIdDisplayed(caseId: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.caseId, caseId)).isPresent().then(async (link) => {
            if (link) {
                return await element(by.cssContainingText(this.selectors.caseId, caseId)).isDisplayed();
            } else return false;
        });
    }

    async isPriorityDisplayed(priority: string): Promise<boolean> {
        return await $(this.selectors.priority).getText() == priority ? true : false;

    }

    async isCaseStatusDisplayed(status: string): Promise<boolean> {
        return await $(this.selectors.caseStatus).getText() == status ? true : false;
    }

    async isRequesterNameDisplayed(requesterName: string): Promise<boolean> {
        return await $(this.selectors.requesterName).getText() == requesterName ? true : false;
    }

    async isRequesterCompanyDisplayed(requesterCompany: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.requesterCompany, requesterCompany)).isPresent().then(async (link) => {
        if (link) {
            return await element(by.cssContainingText(this.selectors.requesterCompany, requesterCompany)).isDisplayed();
        } else return false;
    });
    }

    async isContactNameDisplayed(contactName: string): Promise<boolean> {
        return await $(this.selectors.contactName).getText() == contactName ? true : false;
    }

    async isRequesterPhoneDisplayed(requestPhoneNumber: string): Promise<boolean> {
        return await $(this.selectors.requestPhoneNumber).getText() == requestPhoneNumber ? true : false;
    }

    async isRequesterEmailIdDisplayed(requesterEmailId: string): Promise<boolean> {
        return await $(this.selectors.requesterEmailId).getText() == requesterEmailId ? true : false;
    }

    async isRequesterSiteDisplayed(requesterSite: string): Promise<boolean> {
        return await $(this.selectors.requesterSite).getText() == requesterSite ? true : false;
    }

    async isCaseTemplateDisplayed(caseTemplate: string): Promise<boolean> {
        return await $(this.selectors.caseTemplate).getText() == caseTemplate ? true : false;
    }

    async isDescriptionDisplayed(description: string): Promise<boolean> {
        let descriptionText = await $$(this.selectors.description).first().getText();
        return descriptionText.includes(description);
    }

    async iscreateNewCaseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNewCaseButton).isDisplayed();
    }

    async isCategoryTier1Displayed(categoryTier1: string): Promise<boolean> {
        return await $(this.selectors.categoryTier1).getText() == categoryTier1 ? true : false;
    }

    async isCategoryTier2Displayed(categoryTier2: string): Promise<boolean> {
        return await $(this.selectors.categoryTier2).getText() == categoryTier2 ? true : false;
    }

    async isCategoryTier3Displayed(categoryTier3: string): Promise<boolean> {
        return await $(this.selectors.categoryTier3).getText() == categoryTier3 ? true : false;
    }

    async getCategoryTier4(): Promise<string> {
        return await $(this.selectors.categoryTier4).getText();
    }

    async getLabelvalue(): Promise<string> {
        return await $(this.selectors.labelValue).getText();
    }

    async isAssigneeDisplayed(assignee: string): Promise<boolean> {
        let valueassignee: boolean = await $(this.selectors.assignee + ' .person-link').isPresent();
        if (valueassignee == true) {
            return await $(this.selectors.assignee + ' .person-link').getText() == assignee ? true : false;
        } else { return await $(this.selectors.assignee + ' .ac-person-absent').getText() == assignee ? true : false; }
    }


    async clickGoToCaseButton(): Promise<void> {
        await $(this.selectors.gotoCaseButton).isPresent().then(async (present) => {
            if(present) {
                await $(this.selectors.gotoCaseButton).isDisplayed().then(async (displayed) => {
                    if(displayed) await $(this.selectors.gotoCaseButton).click();
                });
            }
            else{
                await browser.sleep(1000);
                await $(this.selectors.gotoCaseButton).click();
            }
        });
    }

    async isCreateNewCaseButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNewCaseButton).isDisplayed();
    }

    async isGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="40c6dac1-3d7a-402d-9d78-6ba29bb1c1f1"] .group-container__name div[title=${groupName}]`).isDisplayed();
    }

    async isDynamicFieldDisplayed(fieldName: string): Promise<boolean> {
        let dynamicFields: number = await $$(this.selectors.dynamicFieldsName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await $$(this.selectors.dynamicFieldsName).get(i).getText();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }

    async clickBackButton(): Promise<void> {
        await $(this.selectors.backButton).click();
    }

    async getLineOfBusinessValue(): Promise<string> {
        return await $(this.selectors.lineOfBusiness).getText();
    }

    async getAssigneeDetails(): Promise<string> {
        return await $(this.selectors.assignedDetails).getText();
    }
}

export default new CasePreview();