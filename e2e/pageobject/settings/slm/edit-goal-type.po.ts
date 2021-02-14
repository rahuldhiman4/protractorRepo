import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import { DropDownType } from '../../../utils/constants';
import utilityCommon from '../../../utils/utility.common';

class GoalTypeConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        status: '[rx-view-component-id="57b81b04-b4ff-4624-a04f-fceaa4a7eb08"] button',
        saveButton: '[rx-view-component-id="c8de82b4-12c7-4ba2-b9f1-e4884b86c471"] button',
        closeButton: '[rx-view-component-id="b733c9ab-7fff-4038-8ba2-cb1ce47f59e9"] button',
        goalTypeName: '[rx-view-component-id="b77cea55-9244-4d58-9d07-06773ff05c60"] input',
        goalType: '[rx-view-component-id="f766b2ae-1205-4c7b-bf5b-b6ac1190fd7c"] button',
        statusGuid: '57b81b04-b4ff-4624-a04f-fceaa4a7eb08',
        goalTypeStatusDropDown: '[rx-view-component-id="57b81b04-b4ff-4624-a04f-fceaa4a7eb08"] button',
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
        await utilityCommon.selectDropDown(this.selectors.statusGuid, goalTypeStatus);
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