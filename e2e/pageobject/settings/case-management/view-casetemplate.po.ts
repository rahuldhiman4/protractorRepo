import { $, protractor, ProtractorExpectedConditions, $$, browser, element, by } from 'protractor';
class ViewCaseTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        identityValidationValue: '[rx-view-component-id="dead2a5c-4753-40c6-9709-4b8ea9c454fd"] .d-textfield__rx-value',
        templateName: '[rx-view-component-id="08a1650a-ac21-405a-8362-ddd780425a75"] span',
        caseTemplateId: '.text-field',
        CaseCompanyvalue: '[rx-view-component-id="39db6cc5-79ae-4934-a4bc-74765278fcda"] p',
        flowsetValue: '[rx-view-component-id="2fe19a48-630b-4380-8b17-cbff70023a89"] p',
        editButton: '[rx-view-component-id="672c4706-9ce0-46be-9a3a-a639ded79b23"] .rx-record-editor-edit',
        ownerGroup: '[rx-view-component-id="80799a06-c36d-4638-819a-2633a42a89e1"] p',
        ownerCompany: '[rx-view-component-id="5c445c06-0bdc-4995-a226-05da344dcf30"] p',
        templateStatus: '[rx-view-component-id="e5e9bf3e-8135-4d53-b03f-484545a64a5a"] p',
        resolveCaseOnLastTaskCompletion: '[rx-view-component-id="e4956197-0230-4272-8fc4-87358bd084bf"] p',
        categoryTier4: '[rx-view-component-id="fbc0f516-1f57-44ad-82ab-f8bbbe1aa5f5"] p',
        priority: '.selection-field',
        labelvalue: '[rx-view-component-id="06d4ad28-b48e-493a-b6b3-925fea737576"] p',
        buisnessUnitvalue: '[rx-view-component-id="40817c2b-387f-4859-82e9-0a3251cdc7dc"] .d-textfield__rx-value',
        departmentValue: '[rx-view-component-id="d5d0c773-b825-4be7-b357-4ed4eb73ee8d"] .d-textfield__rx-value',
        manageDynamicField: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] button',
        dynamicFieldsName: '[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] span',
        editTemplateMetaData: '[rx-view-component-id="c9f48c1b-75e2-411c-929c-76bdce069a3d"] .edit-link',
        assigneeNameValue: '[rx-view-component-id="b4f3f0e5-70ca-44e8-8e75-75d573167901"] .person-main a',
        assigneeBusinessUnitValue: '[rx-view-component-id="8019eb00-be2e-462f-8fd4-49d116fc167e"] .d-textfield__rx-value',
        assigneeDepartmentValue: '[rx-view-component-id="1a3d3085-da94-4981-986c-18be12795e3d"] .d-textfield__rx-value',
        categoryTier1: '[rx-view-component-id="241f0e58-3106-4f8a-a1cc-43554414bb7c"] p',
        categoryTier2: '[rx-view-component-id="4f950be7-d968-41a4-8bb9-018674e53f88"] p',
        categoryTier3: '[rx-view-component-id="a7fbc4bc-23c6-4f92-818a-5554107d04c0"] p',
        oneTask: '[rx-view-component-id="36ca22f7-98f8-423a-bf39-28361ef29eeb"] .rotatable path',
        multipleTask: 'g.rotatable div.content',
        backButton: '[rx-view-component-id="8abb8018-cca7-49a2-b610-023c2bae63cc"] button'
    }

    async clickOneTask(): Promise<void> {
        await $(this.selectors.oneTask).click();
    }

    async clickEditTemplateMetaData(): Promise<void> {
        await $(this.selectors.editTemplateMetaData).click();
    }

    async getIdentityValdationValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.identityValidationValue)));
        return await $(this.selectors.identityValidationValue).getText();
    }

    async getOwnerGroupValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).getText();
    }

    async getOwnerCompanyValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.ownerCompany).getText();
    }

    async getBuisnessUnitValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.buisnessUnitvalue).getText();
    }

    async getLabelValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.labelvalue).getText();
    }

    async getDepartmentValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.departmentValue).getText();
    }

    async getPriorityValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.priority).getText();
    }

    async getTemplateStatusValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateStatus)));
        return await $(this.selectors.templateStatus).getText();
    }

    async getCaseTemplateId(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateId)));
        return await $(this.selectors.caseTemplateId).getText();
    }

    async getCaseTemplateNameValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        return await $(this.selectors.templateName).getText();
    }

    async getResolveCaseOnLastTaskCompletionValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.resolveCaseOnLastTaskCompletion)));
        return await $(this.selectors.resolveCaseOnLastTaskCompletion).getText();
    }

    async getCaseCompanyValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.CaseCompanyvalue)));
        return await $(this.selectors.CaseCompanyvalue).getText();
    }

    async getFlowsetValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flowsetValue)));
        return await $(this.selectors.flowsetValue).getText();
    }

    async clickOnEditCaseTemplateButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        return await $(this.selectors.editButton).click();
    }

    async getCategoryTier4(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).getText();
    }

    async clickOnMangeDynamicFieldLink(): Promise<void> {
        await $(this.selectors.manageDynamicField).click();
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

    async isGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] .group-container__name div[title=${groupName}]`).isDisplayed();
    }
    async getAssigneeText(): Promise<string> {
        return await $(this.selectors.assigneeNameValue).getText();
    }

    async getAssigneeBusinessUnitValue(): Promise<string> {
        return await $(this.selectors.assigneeBusinessUnitValue).getText();
    }

    async getAssigneeDepartmentValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerCompanyValue)));
        return await $(this.selectors.assigneeDepartmentValue).getText();
    }

    async getCategoryTier1(): Promise<string> {
        return await $(this.selectors.categoryTier1).getText();
    }

    async getCategoryTier2(): Promise<string> {
        return await $(this.selectors.categoryTier2).getText();
    }

    async getCategoryTier3(): Promise<string> {
        return await $(this.selectors.categoryTier3).getText();
    }

    async isManageDynamicFieldLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.manageDynamicField).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.manageDynamicField).isDisplayed();
            } else {
                console.log("Managelink not present");
                return false;
            }
        });
    }

    async clickOnTask(taskName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.multipleTask)),3000);
        await element(by.cssContainingText(this.selectors.multipleTask, taskName)).isPresent().then(async (result) => {
            if (result) element(by.cssContainingText(this.selectors.multipleTask, taskName)).click();
            else {
                console.log('Task is Not Present');
            }
        });
    }

    async gotoCaseTemplateConsole(): Promise<void> {
        await $(this.selectors.backButton).click();
    }
}

export default new ViewCaseTemplate();