import { $ } from "protractor";
import utilityGrid from '../../../utils/utility.grid';

class NotificationEventConsolePage {

    selectors = {
        addNotificationEventButton: '[rx-view-component-id="a86ae6d5-e95a-4715-aac0-be26ee77c423"] button',
        guid: '3f57d36e-dd20-4d34-acac-b568fec6a9d4'
    }

    async clickAddNotificationEventBtn(): Promise<void> {
        await $(this.selectors.addNotificationEventButton).click();
    }

    async isAddNotificationEventBtnEnabled(): Promise<boolean> {
      return  await $(this.selectors.addNotificationEventButton).isEnabled();
    }

    async getDescriptionValue(): Promise<string> {
        return await utilityGrid.getFirstGridRecordColumnValue('Description', this.selectors.guid);
    }

}

export default new NotificationEventConsolePage();