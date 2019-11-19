import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import commonUtils from "../../utils/util.common";

class CreateCaseTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        createCaseTemplate: '[rx-view-component-id="3a9fd0a9-2b68-4872-a022-7c56b377a4dc"] button',
        copyCaseTemplateOnCreate: '[rx-view-component-id="92e13921-bf7b-494e-9d65-609a07c36505"] button',
        templateName: '[rx-view-component-id="432c5f23-8c50-490d-9e94-8912ac4cd5e1"] input',
        caseSummary: '[rx-view-component-id="9aac1caa-d110-450e-a9a2-d87168ec6162"] input',
        caseDescription: '[rx-view-component-id="0e50e51b-b99d-481c-8c1e-cb92e8803634"] textarea',
        saveButton: '[rx-view-component-id="fee3e577-173c-4dec-8265-ec81580ed26d"] button',
        cancelButton: '[rx-view-component-id="be371341-8b3f-4433-93fa-33d242984010"] button',
        companyDropDown: '127214a1-bfc0-4a8c-acb7-cd2be137fa3c',
        flowset: 'e29c6d30-5ac3-4f18-a4c6-9192017d46ed',
        casePriority: '98327bc1-9ada-48f9-ab88-9787ddecd409',
        caseStatus: 'b6a6fc24-c3e7-4565-b2d2-848dd4a6747b',
        statusReason: 'b6a6fc24-c3e7-4565-b2d2-848dd4a6747b',
        label: '7ea99756-16a7-4aae-a8a0-8e5e11acfb77',
        caseCategoryTier1: '57b0a78a-b91a-46c3-8800-04acc0d81108',
        caseCategoryTier2: '42e3edda-f057-41e2-8160-7a9482e847dc',
        caseCategoryTier3: 'bb675d8f-82bc-497b-8b99-dfc1baa1dd41',
        caseCategoryTier4: 'ec532c69-dbc8-4473-b76d-ad90bec193d2',
        identityValidation: '768c4f0a-309f-4e7f-ba88-a0ef9a169d6f',
        assignmentMethod: '1930b678-6f96-41a3-a127-a483fc8ffd26',
        taskFailureConfiguration: '317fe9a4-3ca7-4a55-a647-18163fd4a572',
        allowCaseReopen: '317fe9a4-3ca7-4a55-a647-18163fd4a572',
        templateStatusDropdown:'3bebf8c9-1396-487a-b9ea-bf1e39d4d475',
        ownerCompany: '84efe67b-c540-4fd9-9a7a-724e9390656a',
        resolutionCode: 'f5b64175-c39b-4b6b-a6c4-956038a232b3',
        resolutionDescription: '8f8159e2-d647-4c46-ae71-ff56f1a81a0b',
        businessUnitDropdown: 'f5c9ce38-b11a-4c5a-b952-16903c1c383d',
        departmentDropdown: '70778256-c238-4a16-a24f-86b71cc3da87',
        ownerGroupDropdown: 'b3ebc604-b7dc-4090-90a5-9515d1ea7f3e',
        changeAssignmentButton: '[rx-view-component-id="5a23952e-aac4-4e00-af6c-b93a214e26a9"] button' ,
        clearButton: '[rx-view-component-id="863df084-ff37-4099-85d9-2bfcc4783adc"] button' ,
        reopentimelineDays: '[rx-view-component-id="c562f849-8baa-4324-bbfc-77f34c4cdbde"] input' 
    }
    
    async setCompanyName(companyValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.companyDropDown,companyValue);
    }
  
    async clickSaveCaseTemplate():Promise<void>{
        let element=$(this.selectors.saveButton);
        await browser.wait(this.EC.elementToBeClickable(element));
        await element.click();
    }

    async clickOnCancelButton():Promise<void>{
        let element=$(this.selectors.cancelButton);
        await browser.wait(this.EC.elementToBeClickable(element));
        await element.click();
    }

    async setCategoryTier1(tier1Value:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.caseCategoryTier1,tier1Value);
    }

    async setCategoryTier2(tier2Value:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.caseCategoryTier2,tier2Value);
    }

    async setCategoryTier3(tier3Value:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.caseCategoryTier3,tier3Value);
    }

    async setCategoryTier4(tier4Value:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.caseCategoryTier4,tier4Value);
    }

    async setLabelValue(labelValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.caseCategoryTier4,labelValue);
    }

    async setFlowsetValue(flowsetValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.flowset,flowsetValue);
    }

    async setIdentityValidationValue(identityValidationValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.flowset,identityValidationValue);
    }

    async setReopenTimelineDays(reopenDaysValues:string){
        await browser.wait(this.EC.visibilityOf($(this.selectors.reopentimelineDays)));
        await $(this.selectors.reopentimelineDays).sendKeys(reopenDaysValues);
    }

    async setPriorityValue(priorityValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.casePriority,priorityValue);
    }

    async setCaseStatusValue(caseStatusValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.caseStatus,caseStatusValue);
    }

    async setAllowCaseReopenValue(allowCaseReopenValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.allowCaseReopen,allowCaseReopenValue);
    }

    async setDepartmentDropdownValue(departmentDropdownValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.departmentDropdown,departmentDropdownValue);
    }

    async setOwnerCompanyValue(ownerCompanyValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.ownerCompany,ownerCompanyValue);
    }

    async setTaskFailureConfigurationValue(taskFailureConfigurationValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.ownerCompany,taskFailureConfigurationValue);
    }

    async setBusinessUnitDropdownValue(businessUnitDropdownValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.businessUnitDropdown,businessUnitDropdownValue);
    }

    async setAssignmentMethodValue(assignmentMethodValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.assignmentMethod,assignmentMethodValue);
    }

    async setOwnerGroupDropdownValue(ownerGroupValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.ownerGroupDropdown,ownerGroupValue);
    }

    async setTemplateStatusDropdownValue(templateStatusValue:string):Promise<void>{
        commonUtils.selectDropDown(this.selectors.templateStatusDropdown,templateStatusValue);
    }

    async clickOnChangeAssignmentButton():Promise<void>{
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickOnClearButton(){
        await $(this.selectors.clearButton).click();
    }

    async isResolutionCodeRequired(values:boolean):Promise<void>{
        commonUtils.selectToggleButton(this.selectors.resolutionCode,true)
    }

    async isResolutionDescriptionRequired(values:boolean):Promise<void>{
        commonUtils.selectToggleButton(this.selectors.resolutionDescription,true)
    }

    async setTemplateName(templateNameValue:string): Promise<void> {
        let element=$(this.selectors.templateName);
        await browser.wait(this.EC.visibilityOf(element));
        await element.clear();
        await element.sendKeys(templateNameValue);  
    }

    async setCaseSummary(caseSummaryValue:string): Promise<void> {
        let element=$(this.selectors.caseSummary);
        await browser.wait(this.EC.visibilityOf(element));
        await element.clear();
        await element.sendKeys(caseSummaryValue);  
    }

    async setCaseDescription(caseDescription:string): Promise<void> {
        let element=$(this.selectors.caseDescription);
        await browser.wait(this.EC.visibilityOf(element));
        await element.clear();
        await element.sendKeys(caseDescription);  
    }
}

export default new CreateCaseTemplate();