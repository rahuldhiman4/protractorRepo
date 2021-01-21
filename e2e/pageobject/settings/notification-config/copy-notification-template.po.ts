import { $, protractor, ProtractorExpectedConditions, Key, browser } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class CopyNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: '34d9572a-6eb0-41e0-8a1b-e51ea397dfc3',
        createCopy:'[rx-view-component-id="e40bc7e7-74c7-4cbd-9bff-207d176543b7"] button',
        templateName: '[rx-view-component-id="d56917a7-af1d-4eb2-94b7-3a2d6604bc3e"] input'
    }

    async setCompanyValue(value:string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyGuid,value);
    }

    async setTemplateName(value:string): Promise<void> {
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(value);
    }

    async clickOnCreateCopyButton():Promise<void>{
        await $(this.selectors.createCopy).click();      
    }
}
export default new CopyNotificationTemplate();