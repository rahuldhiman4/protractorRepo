import { $,protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class editNotificationTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        saveButton: '[rx-view-component-id="50e25982-5452-4f20-ac79-5682de7cb467"] button',
        cancelButton: '[rx-view-component-id="2a50e7b7-b260-4749-ad9d-1d7cb65b5d95"] button'
    }
   
    async clickOnCancelButton():Promise<void>{
        await $(this.selectors.cancelButton).click();
        await utilCommon.clickOnWarningOk();
    }

    async clickOnCancelButtonWithoutWarning():Promise<void>{
                await $(this.selectors.cancelButton).click();
            }
        
    async clickOnSaveButton():Promise<void>{
        await $(this.selectors.saveButton).click();
    }

}
export default new editNotificationTemplate(); 