import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';

class ViewTask {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        dropDownOption: '[rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"] .dropdown_select__menu-content button',
        statusDropDown: '8b4cef48-0a4c-4ec1-bc4c-cce47179c964',
        saveStatus: '[rx-view-component-id="6759ba60-df0d-4d5e-8eb9-5101490fd4d4"] button',
        cancleStatus: '[rx-view-component-id="debcdc88-fb42-4003-96d6-1eeb807206b7"] button',
        allStatus: '.dropdown_select__menu .dropdown-item',
        updateStatusDropDown: '[rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"] button',
        taskTypeValue: '[rx-view-component-id="057f2521-313b-40c9-be56-829827512abf"] .read-only-content',
        editButton: '.float-right',
        categoryTier1Value: '[rx-view-component-id="909ad3ad-6706-4d46-bb5a-bc48fa6ca98e"] .read-only-content',
        categoryTier2Value: '[rx-view-component-id="49d231d9-ee81-4d7c-90af-d7ca785a32d4"] .read-only-content',
        categoryTier3Value: '[rx-view-component-id="c8858fb5-5b21-4e0d-a947-c0130a72b51a"] .read-only-content',
        categoryTier4Value: '[rx-view-component-id="ff1636f8-4efe-4447-9c04-f32799904f2b"] .read-only-content',
        labelValue: '[rx-view-component-id="4c2784af-c080-4630-8f16-d9e6b07e87a2"] .read-only-content',
        descriptionValue: '[rx-view-component-id="6053a7e8-5194-420b-965a-1c3bfe3ad0a1"] .bwf-description-textarea-read',
        processnameValue: '[rx-view-component-id="7260c238-9e41-4d31-90de-2d46443117b4"] .read-only-content',
        statusReason: '[rx-view-component-id="7cdf9e18-c230-4098-8872-ddce9f005373"] .read-only-content',
        taskIdText: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .text-field',
        viewCaseLink: '[rx-view-component-id="036a7325-43e3-47e6-bb50-7f8d9fe8d118"] button',
        taskIcon: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] i',
        taskPriority: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .selection-field',
        taskTimeDetails: '[rx-view-component-id="75371088-cfeb-4554-a939-2fe7b2aa098b"] .date-info',
        caseIdText: '.rx-record-preview-card__field .rx-record-preview-card__value',
        caseSummary: '.rx-record-preview-card__field .rx-record-preview-card__value',
        taskSummary: '[rx-view-component-id="fa66e566-757c-4d10-a850-9ea3bd037707"] span',
        taskStatus: '[rx-view-component-id="1437179f-34be-4cb3-8f85-cf0ac6a83394"] span',
        requesterName: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .person-name .person-link',
        requesterContact: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .person-phone-link',
        requesterMail: '[rx-view-component-id="3a7ac43c-0c25-4a46-abc6-9d59c2da09f7"] .bwf-person-email button',
        assigneeName: '[rx-view-component-id="1801d8c6-4997-4253-b716-809b39909598"] .person-main',
        assignGroupText: '[rx-view-component-id="2193d81d-8ea7-457f-8a8e-9d0378a7a43a"] label',
        assignCompany: '[rx-view-component-id="5cb6b3e9-1f3b-412f-a757-fb9c2a462e32"] label',
        taskStatusGuid: 'aea81ee2-85d9-4bb6-adb4-08c29028d45d',
        attachmentName: 'bwf-attachment-viewer .bwf-attachment-container__file-name',
        showMoreLessAttachmentLink: 'bwf-attachment-viewer button.ng-star-inserted span',
        saveAdhocTask: '[rx-view-component-id="a19228d0-81a9-4b19-9cb3-b5bd9550966f"] button',
        attachmentFile: '.justify-content-start .bwf-attachment-container__file-name',
        attachmentpath: '.rx-attachment-view .d-icon-cross',
        showMore:'.rx-attachment-show-text',
        dynamicFieldsName:'[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] label',
        dynamicFieldsValue:'[rx-view-component-id="4c988a95-b148-475f-b91c-9788d8e6c0cb"] .read-only-content',
        assignmentSection:'[rx-view-component-id="a202d36e-32db-4093-9c92-c4f7a514f3d7"] .person-badge',
        assignedGroupValue:'[rx-view-component-id="2193d81d-8ea7-457f-8a8e-9d0378a7a43a"] .read-only-content',
        assignedCompanyValue:'[rx-view-component-id="5cb6b3e9-1f3b-412f-a757-fb9c2a462e32"] .read-only-content',
        businessUnitValue:'[rx-view-component-id="4ad9dc88-aa95-4fb7-8128-7df004dfca8f"] .read-only-content', 
        departmentValue:'[rx-view-component-id="411571a0-2577-4403-bcf2-3999dc84f5df"] .read-only-content',
        manageDynamicField: '[rx-view-component-id="7ac78e56-c471-4e50-bca8-53568ad6e4af"] button',
        emailLink:'[rx-view-component-id="b721ed87-8e6b-4279-9e21-d4348c6a4599"] button',
        tab: 'button[role="tab"] span.nav-link-wrapper',
    }

    async clickEmailLink():Promise<void>{
        await $(this.selectors.emailLink).click();
    }
    
    async getTaskSummaryValue():Promise<string>{
        return await $(this.selectors.taskSummary).getText();
    }

    async getPriorityValue():Promise<string>{
        return await $(this.selectors.taskPriority).getText();
    }

    async isAttachedDocumentPresent(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).isPresent();
    }

    async clickOnAttachedDocumentFile(fileName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentFile, fileName)).click();
    }
    async clickOnRequesterEmail(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.requesterEmailLink)));
        await $(this.selectors.requesterMail).click();
    }

    async allTaskOptionsPresent(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let drpDwnvalue: number = await $$(this.selectors.dropDownOption).count();
        for (let i = 0; i < drpDwnvalue; i++) {
            let ab: string = await $$(this.selectors.dropDownOption).get(i).getText();
            arr[i] = ab;
        }
        arr = arr.sort();
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async clickOnChangeStatus(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.changeStatusButton)));
        await $(this.selectors.taskStatus).click();
    }

    async clickOnSaveStatus(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveStatus)));
        await $(this.selectors.saveStatus).click();
    }

    async clickOnCancelStatus(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancleStatus)));
        await $(this.selectors.cancleStatus).click();
    }

    async changeTaskStatus(statusValue: string): Promise<void> {
       // await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusDropDown)), 2000);
        await utilityCommon.selectDropDown(this.selectors.statusDropDown, statusValue);
    }

    async getUpdateTaskStatusDrpdownValue(no: number): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.allStatus)));
        return await $$(this.selectors.allStatus).get(no).getText();
    }


    async clickOnUpdateStatusDrpdown(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.updateStatusDropDown)));
        await $(this.selectors.updateStatusDropDown).click();
    }

    async clickOnEditTask(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)),3000);
        await $(this.selectors.editButton).click();
    }

    async isTaskIdTextDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIdText)));
        return await $(this.selectors.taskIdText).isDisplayed();
    }

    async isTaskIconDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIcon)));
        return await $(this.selectors.taskIcon).isDisplayed();
    }

    async isTaskPriorityDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskPriority)));
        return await $(this.selectors.taskPriority).isDisplayed();
    }

    async isTaskTimeDetailsDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTimeDetails)));
        return await $(this.selectors.taskTimeDetails).isDisplayed();
    }

    async isTaskSummaryDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        return await $(this.selectors.taskSummary).isDisplayed();
    }

    async isCaseSummaryDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.caseSummary)));
        return await $$(this.selectors.caseSummary).get(1).isDisplayed();
    }

    async isCaseViewLinkDisplayed(): Promise<boolean> {
        try {
            return await $(this.selectors.viewCaseLink).isEnabled();
        } catch (error) {
            return false;
        }
    }

    async istaskStatusDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskStatus)));
        return await $(this.selectors.taskStatus).isDisplayed();
    }

    async getTaskStatusValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskStatus)));
        return await $(this.selectors.taskStatus).getText();
    }

    async isEditLinkDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editButton)));
        return await $(this.selectors.editButton).isDisplayed();
    }

    async isViewCaseLinkDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.viewCaseLink)));
        return await $(this.selectors.viewCaseLink).isDisplayed();
    }

    async isRequesterNameDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterName)));
        return await $(this.selectors.requesterName).isDisplayed();
    }

    async isRequesterContactDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterContact)));
        return await $(this.selectors.requesterContact).isDisplayed();
    }

    async isRequesterMailDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.requesterMail)));
        return await $(this.selectors.requesterMail).isDisplayed();
    }

    async isCategoryTier1ValueDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).isDisplayed();
    }

    async isCategoryTier2ValueDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).isDisplayed();
    }

    async isCategoryTier3ValueDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).isDisplayed();
    }

    async isAssigneeNameDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assigneeName)));
        return await $(this.selectors.assigneeName).isDisplayed();
    }

    async isAssignCompanyDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignCompany)));
        return await $(this.selectors.assignCompany).isDisplayed();
    }

    async isAssignGroupTextDisplayed(): Promise<boolean> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignGroupText)));
        return await $(this.selectors.assignGroupText).isDisplayed();
    }

    async clickOnTab(tabName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.tab, tabName)).click();
    }

    async clickOnViewCase(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.viewCaseLink)),2000);
        await $(this.selectors.viewCaseLink).click();
        //        await utilCommon.waitUntilSpinnerToHide();
    }

    async getCategoryTier1Value(): Promise<string> {
        //        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier1Value)));
        return await $(this.selectors.categoryTier1Value).getText();
    }

    async getCategoryTier2Value(): Promise<string> {
        //        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier2Value)));
        return await $(this.selectors.categoryTier2Value).getText();
    }

    async getCategoryTier3Value(): Promise<string> {
        //        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier3Value)));
        return await $(this.selectors.categoryTier3Value).getText();
    }

    async getCategoryTier4Value(): Promise<string> {
        //        await browser.wait(this.EC.presenceOf($(this.selectors.categoryTier4Value)));
        return await $(this.selectors.categoryTier4Value).getText();
    }

    async getLabelValue(): Promise<string> {
        //        await browser.wait(this.EC.presenceOf($(this.selectors.labelValue)));
        return await $(this.selectors.labelValue).getText();
    }

    async getDescriptionValue(): Promise<string> {
        //        await browser.wait(this.EC.presenceOf($(this.selectors.descriptionValue)));
        return await $(this.selectors.descriptionValue).getText();
    }

    async getTaskTypeValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskTypeValue)));
        return await $(this.selectors.taskTypeValue).getText();
    }

    async getProcessNameValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.processnameValue)));
        return await $(this.selectors.processnameValue).getText();
    }

    async getStatusReason(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.processnameValue)));
        return await $(this.selectors.statusReason).getText();
    }

    async isProcessNameValue(): Promise<boolean> {
        return await $(this.selectors.processnameValue).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.processnameValue).getText() ? true : false;
            } else {
                console.log("Flowset not present");
                return false;
            }
        });
    }

    async getTaskID(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.taskIdText)),2000);
        return await $(this.selectors.taskIdText).getText();

    }

    async isAttachedFileNamePresent(fileName: string): Promise<boolean> {        
        return await element(by.cssContainingText(this.selectors.attachmentName, fileName)).isPresent();
    }

    async clickOnAttachments(attachmentName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentName, attachmentName)).click();
    }

    async clickOnSaveViewAdhoctask(): Promise<void> {
        await $(this.selectors.saveAdhocTask).click();
    }

    async getShowMoreLessAttachmentsLinkText():Promise<string>{
        return await $(this.selectors.showMoreLessAttachmentLink).getText();
    }

    async clickShowMoreShowLessLink():Promise<void>{
        return await $(this.selectors.showMoreLessAttachmentLink).click();
    }
    
    async isFileDisplayed(fileName:string):Promise<boolean>{
        return await $(`.rx-attachment-view-thumbnail [alt=${fileName}]`).isDisplayed();
    }

    async getDynamicFieldName(fieldName:string):Promise<string>{
        return await $(`.fields-container .form-group label[title=${fieldName}]`).getText();
    }

    async getDynamicFieldValue(fieldName:string):Promise<string>{
        let dynamicFields:number= await $$('.fields-container .form-group label').count();
        for(let i=0; i<dynamicFields;i++){
           let field= await $$('.fields-container .form-group label').get(i).getText();
           if(fieldName==field){
             return await $$('.fields-container .form-group .read-only-content').get(i).getText();
           }
        }
        return null;
    }

    async getValueOfDynamicFields(fieldName:string):Promise<string>{
        let dynamicFields:number= await $$(this.selectors.dynamicFieldsName).count();
        for(let i=0; i<dynamicFields;i++){
           let field= await $$(this.selectors.dynamicFieldsName).get(i).getText();
           if(fieldName==field){
             return await $$(this.selectors.dynamicFieldsValue).get(i).getText();
           }
        }
        return null;
     }

    async getAssignedGroupText(): Promise<string> {
        return await $(this.selectors.assignedGroupValue).getText();
    }

    async getAssigneeText(): Promise<string> {
        return await $(this.selectors.assigneeName).getText();
    }

    async getDepartmentText(): Promise<string> {
        return await $(this.selectors.departmentValue).getText();
    }

    async getBusinessUnitText(): Promise<string> {
        return await $(this.selectors.businessUnitValue).getText();
    }

    async getAssignedCompanyText(): Promise<string> {
        return await $(this.selectors.assignedCompanyValue).getText();
    }

    async isDynamicFieldPresent(fieldName:string):Promise<boolean>{
        let dynamicFields: number = await $$(this.selectors.dynamicFieldsName).count();
        for (let i = 0; i < dynamicFields; i++) {
            let field = await (await $$(this.selectors.dynamicFieldsName).get(i).getText()).trim();
            if (fieldName == field) {
                return true;
            }
        }
        return false;
    }
    async isDynamicFieldSectionPresent(): Promise<boolean>{
        return await $(this.selectors.dynamicFieldsName).isPresent();
    }

    async isAssignmentSectionDisplayed():Promise<boolean>{
        return await $(this.selectors.assignmentSection).isDisplayed();
    }
}

export default new ViewTask();