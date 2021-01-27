import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class GoalTypeConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] button',
        saveButton: '[rx-view-component-id="4b12ddce-1f8a-45fa-904c-e1a472254492"] button',
        closeButton: '[rx-view-component-id="496593b2-24b6-4a4d-bcc1-5a4899992582"] button',
        goalTypeName: '[rx-view-component-id="3a87092d-7c2f-4c3d-b3db-285af38753db"] input',
        goalType: '[rx-view-component-id="ffc11039-6ae1-48b9-9fe4-39b547217e71"] button',
        statusDropDown: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] .dropdown-menu .rx-select__options',
        goalTypeStatusDropDown: '[rx-view-component-id="16be0d06-4165-49f0-ba10-5478ae4ad12e"] button',
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.status).getAttribute("aria-disabled") == "true";
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

    async isGoalTypeFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.goalType).getAttribute("aria-disabled") == "true";
    }

    async isGoalTypeNameFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.goalTypeName).getAttribute("readonly") == "true";
    }

    async selectGoalTypeStatus(goalTypeStatus: string): Promise<void> {
        await utilityCommon.selectDropDown($(this.selectors.statusDropDown), goalTypeStatus, DropDownType.Label);
    }

    async clickSaveGoalTypeButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)), 2000);
        await $(this.selectors.saveButton).click();
    }

    async clickCloseGoalTypeButton(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.closeButton)), 2000);
        await $(this.selectors.closeButton).click();
    }

    async getGoalTypeNameFieldValue(): Promise<string> {
        return await $(this.selectors.goalTypeName).getAttribute("innerText");
    }

    async getGoalTypeFieldValue(): Promise<string> {
        return await $(this.selectors.goalType).getAttribute("innerText");
    }

    async getStatusDropDownFieldValue(): Promise<string> {
        return await $(this.selectors.status).getAttribute("innerText");
    }

    async isGoalTypeFieldRequired(): Promise<boolean> {
        return await $(this.selectors.goalType).getAttribute("aria-required") == "true";
    }

    async isGoalTypeNameFieldRequired(): Promise<boolean> {
        return await $(this.selectors.goalTypeName).getAttribute("required") == "true";
    }

    async isStatusFieldRequired(): Promise<boolean> {
        return await $(this.selectors.goalTypeStatusDropDown).getAttribute("aria-required") == "true";
    }


}

export default new GoalTypeConfigEditPage();