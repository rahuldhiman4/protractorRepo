import { $ } from "protractor";

class ServiceTargetGroupConsolePage {
    selectors = {
        addServiceTargetGroup: '[rx-view-component-id="57be1b9a-c969-49d3-830a-8af8acd7e774"] button',
        deleteButton: '.d-icon-left-trash'
    }

    async isAddServiceTargetGroupBtnVisible(): Promise<boolean> {
        return await $(this.selectors.addServiceTargetGroup).isPresent().then(async (result) => {
            if(result) return await $(this.selectors.addServiceTargetGroup).isDisplayed();
            else return false;
        });
    }

    async isDeleteButtonPresent(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isPresent().then(async (result) => {
            if(result) return await $(this.selectors.deleteButton).isDisplayed();
            else return false;
        });
    }

    async clickAddServiceTargetGroupBtn(): Promise<void> {
        await $(this.selectors.addServiceTargetGroup).click();
    }

}

export default new ServiceTargetGroupConsolePage();