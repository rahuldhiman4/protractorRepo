import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";

class ViewKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: '.status-transition',
        editLinkKnowledgeMetadata: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .btn-link',
        saveBtnEditMetadata: '[rx-view-component-id="7f856f67-5b84-47e0-b175-76a281e8a4fb"] .d-button_primary',
        editLinkOnKA:'[rx-view-component-id="ee521675-2407-4b2a-9470-013bfb328b30"] .rx-record-editor-edit',
        saveButtonONKA:'[rx-view-component-id="813f61fe-28db-4d22-bfa5-4055e8a583fc"] button',
        unflagButton:'[rx-view-component-id="b54365bf-0ead-4c54-8c8b-42aced61690e"] button',
        falgButton:'[rx-view-component-id="89dd2264-1895-4a7b-a0a4-01a4834a403b"] button',
        assigneeName:'[rx-view-component-id="5365589a-13ad-41f0-8831-b20175beb761"] .d-textfield__rx-value',
        kAUsefulYesButton:'[rx-view-component-id="9d4c48c9-fbd8-4e91-bc61-0e395f52bbe7"] button',
        kAUsefulNoButton:'[rx-view-component-id="21f93bfd-53e2-4983-9b15-162e7dd12a31"] button',
        percentageValue:'[rx-view-component-id="5cc2757f-7a22-4827-82c0-1e7dee2e12a2"] p',
        activityTab: '[rx-view-component-id="3982f4ea-16a0-41aa-982e-879143a19b00"] .rx-tab a',
        feedbackFlag:'8eb31993-888c-4a17-be30-4d91cbcdb10b',
        statusChnageBlade:'.modal-content',
        reviewPending:'[rx-view-component-id="f0cf7f67-da22-4149-a54d-ec3b95fe05e6"] button',
        KnwoledgeArticleReviewMessage :'[rx-view-component-id="d2dbea0a-503e-47d8-b4ed-b6dcc9dcf555"] span',
        regionValue:'[rx-view-component-id="d5c6cfef-2d53-48df-a03a-1a3e8381eef5"] .d-textfield__rx-value',
        siteValue:'[rx-view-component-id="aa218b2b-4fa3-4525-82f3-3e0f9bfc4193"] .d-textfield__rx-value'
    }

    async clickOnKAUsefulYesButton():Promise<void>{
        await $(this.selectors.kAUsefulYesButton).click();
    }

    async getRegionValue():Promise<string>{
        return await $(this.selectors.regionValue).getText();
    }

    async getSiteValue():Promise<string>{
        return await $(this.selectors.siteValue).getText();
    }

    async isKAUsefulYesButtonDisplayed():Promise<boolean>{
       return await $(this.selectors.kAUsefulYesButton).isDisplayed();
    }

    async clickOnKAUsefulNoButton():Promise<void>{
        await $(this.selectors.kAUsefulNoButton).click();
    }

    async isReviewMessageDisplayed(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.KnwoledgeArticleReviewMessage, value)).isPresent();
    }

    async getStatusValue():Promise<string>{
//        await utilCommon.waitUntilPopUpDisappear();
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }

    async clickEditKnowledgeMedataData(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.editLinkKnowledgeMetadata)));
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkKnowledgeMetadata)));
        await $(this.selectors.editLinkKnowledgeMetadata).click();
    }
 
    async isStatusChangeBladePresent():Promise<boolean>{
        await $(this.selectors.statusChange).click();
        return await $(this.selectors.statusChnageBlade).isPresent();
    }
    
     async getAssigneeValue():Promise<string>{
        return await $(this.selectors.assigneeName).getText();
     }  

     async clickOnEditLink():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkOnKA)));
        await $(this.selectors.editLinkOnKA).click();
     }

     async isEditLinkDisplayedOnKA():Promise<boolean>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkOnKA)));
        return await $(this.selectors.editLinkOnKA).isDisplayed();
     }

  
     async clickOnUnFlagButton():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.unflagButton)));
        await $(this.selectors.unflagButton).click();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.flagBlade)));
     }

     async clickOnFlagButton():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.falgButton)));
        await $(this.selectors.falgButton).click();
//        await browser.wait(this.EC.visibilityOf($(this.selectors.flagBlade)));
     }

  
     async isUnFlagButtonDisplayed():Promise<boolean>{
       return await $(this.selectors.unflagButton).isDisplayed();
     }

     async clickOnActivityTab(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.activityTab).last()));
        await $$(this.selectors.activityTab).last().click();
    }

    async clickOnInformationTab():Promise<void>{
        await $$(this.selectors.activityTab).first().click();
    }

     async getPercentageValue():Promise<string>{
        return await $(this.selectors.percentageValue).getText();
     }

     async clickReviewPendingLink():Promise<void>{
        await $(this.selectors.reviewPending).click();
    }       
}

export default new ViewKnowledgePage();
