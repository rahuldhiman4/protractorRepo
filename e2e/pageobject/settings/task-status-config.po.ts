import { ProtractorExpectedConditions, protractor, browser, $ } from "protractor"
import utilCommon from "../../utils/ui/util.common"

class TaskStatusConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        companyGrid: '6f415311-8708-4f63-9d1a-b373bad77377',
        editLifeCycleButton: '[rx-view-component-id="60be22c5-444b-4452-97da-fd67e6fc77f2"] button.btn-edit-status-transition',
        companyDropdown: '[rx-view-component-id="6f415311-8708-4f63-9d1a-b373bad77377"] .ui-select-toggle',
        crossStatusViewSettingMsg: ".icon-cross"
    }

    async setCompanyDropdown(company:string): Promise<void>{
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyDropdown)));
        await utilCommon.selectDropDown(this.selectors.companyGrid, company);
    }

    async isEditLifrCycleBtnDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.editLifeCycleButton)));
        return await $(this.selectors.editLifeCycleButton).getAttribute("disabled")=="true";
    }

}

export default new TaskStatusConfigPage();