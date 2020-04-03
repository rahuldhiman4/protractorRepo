import { $, protractor, ProtractorExpectedConditions, Key, browser } from "protractor";
import utilCommon from '../../../utils/util.common';

class CopyNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        companyGuid: '34d9572a-6eb0-41e0-8a1b-e51ea397dfc3',
        createCopy:'[rx-view-component-id="e40bc7e7-74c7-4cbd-9bff-207d176543b7"] button',
    }

    async setCompanyValue(value:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.companyGuid)),3000);
        await utilCommon.selectDropDown(this.selectors.companyGuid,value);
    }

    async clickOnCreateCopyButton():Promise<void>{
        await $(this.selectors.createCopy).click();      
    }
}
export default new CopyNotificationTemplate();