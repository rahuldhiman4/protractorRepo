import { $, protractor, ProtractorExpectedConditions, browser } from "protractor";
import utilityCommon from '../../utils/utility.common';

class FeedbackKnowledgeBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tellUsComment:'[rx-view-component-id="2b192056-a661-49b7-948f-4c75dbc4ffea"] textarea',
        saveButtonOnFeedBack:'[rx-view-component-id="dea0a638-5396-45eb-bb61-06290e663d4e"] button',
        feedbackFlag:'8eb31993-888c-4a17-be30-4d91cbcdb10b',
        cancelButton:'[rx-view-component-id="c703f100-ad49-46ea-8081-7bf7e669bf4f"] button',
        flagArticle:'[rx-view-component-id="8eb31993-888c-4a17-be30-4d91cbcdb10b"] span.form-control-label',
    }
    
    async selectFlag(value:boolean):Promise<void>{
        await utilityCommon.selectToggleButton(this.selectors.feedbackFlag,value);
    }

     async setTextInTellUsMore(value:string):Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flagComment)));
        await $(this.selectors.tellUsComment).clear();
        await $(this.selectors.tellUsComment).sendKeys(value);
     }

     async isTellUsMoreDisplayedWithReuqired():Promise<string>{
        let nameElement = await $('[rx-view-component-id="2b192056-a661-49b7-948f-4c75dbc4ffea"] span.form-control-required');
        let value =  await nameElement.getText();
        return await value.substring(1,value.length-1);
     }

     async isSaveButtonDisplayed():Promise<boolean>{
        return await $(this.selectors.saveButtonOnFeedBack).isDisplayed();
     }

     async isCancelButtonDisplayed():Promise<boolean>{
       return await $(this.selectors.cancelButton).isDisplayed();
     }

     async isSaveButtonEnabled():Promise<boolean>{
         return await $(this.selectors.saveButtonOnFeedBack).isEnabled();
     }

     async isFlagDisplayed():Promise<boolean>{
        return await $(this.selectors.flagArticle).isDisplayed();
     }

     async clickOnSaveButtonOnFeedBack():Promise<void>{
        await $(this.selectors.saveButtonOnFeedBack).click();
    }

    async clickCancelButtonOnFeedBack():Promise<void>{
        await $(this.selectors.cancelButton).click();
    }
}

export default new FeedbackKnowledgeBlade();
