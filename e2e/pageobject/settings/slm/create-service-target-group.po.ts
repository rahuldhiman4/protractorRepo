import { $, by, protractor, ProtractorExpectedConditions, element } from "protractor";
import utilCommon from '../../../utils/util.common';

class CreateServiceTargetGroup {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        groupName: 'input[placeholder="Enter Group Name"]',
        company: 'span[aria-label="Company activate"]',
        dataSource: 'span[aria-label="Data Source activate"]',
        goalType: 'span[aria-label="Goal Type activate"]',
        saveButton: '[class="d-button d-button_primary d-button_large"]',
        lob: '[class="bwf-lob-selection d-textfield"] input',
        serviceTarget: 'input[aria-label="Search for available Service Targets"]',
        serviceTargetdrpdwn: '.slm-group-list-item__description',
    }

    async setGroupName(groupName: string): Promise<void> {
        await $(this.selectors.groupName).sendKeys(groupName);
    }

    async searchServiceTarget(servicetarget: string): Promise<void> {
        await $(this.selectors.serviceTarget).sendKeys(servicetarget);
    }

    async isLobEnabled(): Promise<boolean> {
        return await $(this.selectors.groupName).isEnabled();
    }

    async isServiceTargetPresent(serviceTarget: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.serviceTargetdrpdwn, serviceTarget)).isPresent().then(async (present) => {
            if (present) return await element(by.cssContainingText(this.selectors.serviceTargetdrpdwn, serviceTarget)).isDisplayed();
            else return null;
        });
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.groupName).getText();
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

}

export default new CreateServiceTargetGroup();