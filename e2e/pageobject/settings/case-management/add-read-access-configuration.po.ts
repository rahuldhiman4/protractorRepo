import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common'
class AddReadAccessConfigurationPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        accessMappingName: '[rx-view-component-id="4a195afd-0aa7-415a-b46d-c6cf42352e88"] input',
        companyGuid: '151d7e7f-9800-4e7b-b5cd-454f358e94c4',
        flowsetGuid: '41746e59-add8-46be-85e5-2a07142436c0',
        supportCompanyGuid: '21238f34-a5d5-4ec0-906e-1fe2243a057d',
        supportGroupGuid: '330fdd5d-03d9-4fbd-bbd1-3b4ac54268be',
        saveButton: '[rx-view-component-id="61ac81f7-e04f-496b-b9ed-65b3163cae6d"] button',
    }

    async setReadAccessConfigurationName(accessmapping:string): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.accessMappingName)));
        await $(this.selectors.accessMappingName).clear();
        await $(this.selectors.accessMappingName).sendKeys(accessmapping);
    }

    async clickOnSave(): Promise<void> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async selectCompany(company:string): Promise<void> {
       await utilCommon.selectDropDown(this.selectors.companyGuid,company);
    }

    async selectFlowset(flowset:string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.flowsetGuid,flowset);
     }

     async selectSupportCompany(supportCompany:string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.supportCompanyGuid,supportCompany);
     }

     async selectSupportGroup(supportGroup:string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.supportGroupGuid,supportGroup);
     }

}
export default new AddReadAccessConfigurationPage