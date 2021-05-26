import { $,protractor, ProtractorExpectedConditions } from "protractor";

class FlagUnflagKABlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        unflagButtonOnBlade:'[rx-view-component-id="5707f17e-63f2-41f7-ac55-13a6937c83b9"] button',
        flagButtonOnBlade:'[rx-view-component-id="bd9d6e7a-1875-4299-9b63-5dc89eb2bfe9"] button',
        tellUsComment:'[rx-view-component-id="2b192056-a661-49b7-948f-4c75dbc4ffea"] textarea',
    }

     async setTextInTellUsMore(value:string):Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flagComment)));
        await $(this.selectors.tellUsComment).clear();
        await $(this.selectors.tellUsComment).sendKeys(value);
     }


     async clickOnUnFlageButtonOnBlade():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.unflagButtonOnBlade)));
        await $(this.selectors.unflagButtonOnBlade).click();
//        await browser.wait(this.EC.invisibilityOf($(this.selectors.flagBlade)));
//        await utilCommon.closePopUpMessage();
     }

     async clickOnFlageButtonOnBlade():Promise<void>{
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.flagButtonOnBlade)));
        await $(this.selectors.flagButtonOnBlade).click();
//        await browser.wait(this.EC.invisibilityOf($(this.selectors.flagBlade)));
     }

}

export default new FlagUnflagKABlade();
