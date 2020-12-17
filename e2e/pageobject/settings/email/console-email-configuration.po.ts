import { $ } from 'protractor';
import utilGrid from '../../../utils/util.grid';

export class ConsoleEmailConfig {
    selectors = {
        addNewEmailConfiguration: '[rx-view-component-id="703593bc-16dd-4763-a8d7-b55777b0b76d"] button',
        emailConfigGuid: '03f16f3f-02ff-45c8-86be-bead72dd39cb',
        deleteButton: '[rx-view-component-id="dc52b8fa-3d4b-4db6-a496-d2ffc1d269af"] button',
    }

    async clickNewEmailConfiguration(): Promise<void> {
        await $(this.selectors.addNewEmailConfiguration).click();
    }

    async isNewEmailConfigurationEnabled(): Promise<boolean> {
      return  await $(this.selectors.addNewEmailConfiguration).isEnabled();
    }

    async deleteConfigurationEmail(): Promise<void> {
        await $(this.selectors.deleteButton).click();
    }

    async isClickNewEmailConfigurationBtnPresent(): Promise<boolean> {
       return await $(this.selectors.deleteButton).isPresent();
    }

    async isDeleteConfigurationEmailBtnEnable(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isEnabled();
     }

     async isDeleteConfigurationEmailBtnPresent(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent();
     }

    async getColumnHeaderValue(header:string): Promise<string> {
     return await utilGrid.getSelectedGridRecordValue(this.selectors.emailConfigGuid,header);
    }

    async searchAndSelectCheckbox(value:string): Promise<void> {
        await utilGrid.clickCheckBoxOfValueInGrid(value);
    }
    
    async searchValueOnGrid(value:string): Promise<void> {
        await utilGrid.searchOnGridConsole(value);
    }

    async coloumnHeaderMatches(value: string[]): Promise<boolean> {
        return await utilGrid.areColumnHeaderMatches(this.selectors.emailConfigGuid, value)
    }

    async addHeader(header: string[]): Promise<void> {
        await utilGrid.addGridColumn(this.selectors.emailConfigGuid,header);
    }

    async removeHeader(header: string[]): Promise<void> {
        await utilGrid.removeGridColumn(this.selectors.emailConfigGuid,header);
    }

    async isDeleteBtnDisplayed(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.deleteButton).isDisplayed();
            } else return false;
        });
    }

}

export default new ConsoleEmailConfig();