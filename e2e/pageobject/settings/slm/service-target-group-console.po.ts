import { $ } from "protractor";

class ServiceTargetGroupConsolePage {
    selectors = {
        addServiceTargetGroup: '[rx-view-component-id="65b76257-fae2-4e39-bfe3-5ffbb93e96a3"] button',
        deleteButton: '.d-icon-left-cross'
    }

    async isAddServiceTargetGroupBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.addServiceTargetGroup).isEnabled();
    }

    async isDeleteButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isEnabled();
    }

    async clickAddServiceTargetGroupBtn(): Promise<void> {
        await $(this.selectors.addServiceTargetGroup).click();
    }

}

export default new ServiceTargetGroupConsolePage();