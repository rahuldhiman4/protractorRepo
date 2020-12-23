import { $,$$, by, protractor, ProtractorExpectedConditions, element } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateServiceTargetGroup {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        groupName: 'input[placeholder="Enter Group Name"]',
        company: 'span[aria-label="Company activate"]',
        dataSource: 'span[aria-label="Data Source activate"]',
        goalType: 'span[aria-label="Goal Type activate"]',
        saveButton: '[class="d-button d-button_primary d-button_large"]',
        lob: '[class="bwf-lob-selection d-textfield"] [class="btn btn-default form-control ui-select-toggle"]',
        serviceTarget: 'input[aria-label="Search for available Service Targets"]',
        serviceTargetdrpdwn: '.slm-group-list-item__description',
        selectServiceTarget: '.d-icon-circle_o',
        cancelButton: '[class="d-button d-button_secondary d-button_large"]',
        goalTypeDropDownInput: 'input[aria-label="Goal Type"]',
        dropDownOption: '.ui-select-choices-row',
        goalTypeDropDown: '.ui-select-match[placeholder="Select Goal Type"]',
        dataSourceDropDownInput: 'input[aria-label="Data Source"]',
        dataSourceDropDown: '.ui-select-match[placeholder="Select Data Source"]'

    }

    async setGroupName(groupName: string): Promise<void> {
        await $(this.selectors.groupName).sendKeys(groupName);
    }

    async searchServiceTarget(servicetarget: string): Promise<void> {
        await $(this.selectors.serviceTarget).sendKeys(servicetarget);
    }

    async isLobEnabled(attribute:string): Promise<string> {
        return await $(this.selectors.lob).getAttribute(attribute);
    }

    async isServiceTargetPresent(serviceTarget: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.serviceTargetdrpdwn, serviceTarget)).isPresent().then(async (present) => {
            if (present) return await element(by.cssContainingText(this.selectors.serviceTargetdrpdwn, serviceTarget)).isDisplayed();
            else return null;
        });
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lob).getText();
    }

    async selectCompany(company: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.company), company);
    }

    async selectDataSource(dataSource: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.dataSource), dataSource);
    }

    async selectGoalType(goalType: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.goalType), goalType);
    }

    async clickSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async isSVTOptionsPresentInDropDown(svtTitle: string): Promise<boolean> {
        await $(this.selectors.serviceTarget).clear();
        await $(this.selectors.serviceTarget).sendKeys(svtTitle);
        let values= await $$(this.selectors.serviceTargetdrpdwn).count();
        if (values >= 1) { return true; } else { return false; }
    } 

    async selectServiceTarget(svtTitle: string):Promise<void>{
        await $(this.selectors.serviceTarget).clear();
        await $(this.selectors.serviceTarget).sendKeys(svtTitle);
        await $(this.selectors.selectServiceTarget).click();
    }

    async clickCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnGoalTypeDropDown():Promise<void>{
        await $(this.selectors.goalTypeDropDown).click();
    }

    async isGoalTypeOptionPresentInDropDown(goalType: string): Promise<boolean> {
        await $(this.selectors.goalTypeDropDownInput).clear();
        await $(this.selectors.goalTypeDropDownInput).sendKeys(goalType);
        let values= await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    } 

    async clickOnDataSourceDropDown():Promise<void>{
        await $(this.selectors.dataSourceDropDown).click();
    }

    async clearDataSourceOptionFromDropDown(): Promise<void> {
        await $(this.selectors.dataSourceDropDownInput).clear();
    } 

    async clearGoalTypeOptionFromDropDown(): Promise<void> {
        await $(this.selectors.goalTypeDropDownInput).clear();
    } 

    async isDataSourceOptionPresentInDropDown(dataSource: string): Promise<boolean> {
        await $(this.selectors.dataSourceDropDownInput).clear();
        await $(this.selectors.dataSourceDropDownInput).sendKeys(dataSource);
        let values= await $$(this.selectors.dropDownOption).count();
        if (values >= 1) { return true; } else { return false; }
    } 



}

export default new CreateServiceTargetGroup();