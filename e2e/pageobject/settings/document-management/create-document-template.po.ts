import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class createDocumentTemplate{
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="98493095-1421-4405-8927-dd684b0d2006"] input',
        company: 'a80a3c32-ce91-485b-a56b-3bac1f78d40f',
        description:'[rx-view-component-id="933dd491-7d55-4735-b30a-f2826afe1461"] input',
        insertFieldLinkOnDocumentBody: '[rx-view-component-id="4c08281f-b2ce-4aeb-a0f5-13a4a4d98a7c"] .cke_button__expressioneditor_icon'
    }

    async setCompany(value:string):Promise<void>{
        await utilCommon.selectDropDown(this.selectors.company,value);
    }

    async setTemplateName(value:string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        await $(this.selectors.templateName).sendKeys(value);
    }

    async setDescription(value:string):Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.description)));
        await $(this.selectors.description).sendKeys(value);
    }

    async clickOnInsertFieldOfDocumentBody():Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.insertFieldLinkOnDocumentBody)),2000);
        await $(this.selectors.insertFieldLinkOnDocumentBody).click();
    }
}
export default new createDocumentTemplate();