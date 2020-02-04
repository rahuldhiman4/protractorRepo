import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from "../../../utils/util.common";

class CaseStatusConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        companyGrid: '11a8a316-3947-4479-8840-10436c8d6810',
        editLifeCycleButton: '[rx-view-component-id="9cf9ae8a-8b15-40d9-9e1a-bb53bd1b9270"] button.btn-edit-status-transition',
        companyDropdown: '[rx-view-component-id="11a8a316-3947-4479-8840-10436c8d6810"] .ui-select-toggle'
    }

    async setCompanyDropdown(company: string): Promise<void> {
//        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyDropdown)));
        await utilCommon.selectDropDown(this.selectors.companyGrid, company);
    }

    async isEditLifrCycleBtnDisabled(): Promise<boolean> {
//        await browser.wait(this.EC.visibilityOf($(this.selectors.editLifeCycleButton)));
        return await $(this.selectors.editLifeCycleButton).getAttribute("disabled") == "true";
    }

}

export default new CaseStatusConfigPage();