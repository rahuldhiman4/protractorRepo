import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class FeedbackKnowledgeBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        tellUsComment:'[rx-view-component-id="2b192056-a661-49b7-948f-4c75dbc4ffea"] textarea',
        saveButtonOnFeedBack:'[rx-view-component-id="dea0a638-5396-45eb-bb61-06290e663d4e"] button',
        feedbackFlag:'8eb31993-888c-4a17-be30-4d91cbcdb10b',
    }
    async selectFlag(value:boolean):Promise<void>{
        await utilCommon.selectToggleButton(this.selectors.feedbackFlag,value);
    }

     async setTextInTellUsMore(value:string):Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flagComment)));
        await $(this.selectors.tellUsComment).clear();
        await $(this.selectors.tellUsComment).sendKeys(value);
     }

     async clickOnSaveButtonOnFeedBack():Promise<void>{
        await $(this.selectors.saveButtonOnFeedBack).click();
    }
}

export default new FeedbackKnowledgeBlade();
