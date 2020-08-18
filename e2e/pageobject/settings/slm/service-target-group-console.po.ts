import { $ } from "protractor";

class ServiceTargetGroupConsolePage {
    selectors = {
        addServiceTargetGroup: '.d-icon-left-plus',
        deleteButton: '.d-icon-left-cross'
    }

    async isAddServiceTargetGroupBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.addServiceTargetGroup).isEnabled();
    }

    async isDeleteButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.deleteButton).isEnabled();
    }

}

export default new ServiceTargetGroupConsolePage();