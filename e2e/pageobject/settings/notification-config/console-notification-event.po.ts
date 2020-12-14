import { $ } from "protractor";
import utilGrid from '../../../utils/util.grid';

class NotificationEventConsolePage {

    selectors = {
        addNotificationEventButton: '[rx-view-component-id="8bd6d456-fdf1-4ee4-9832-31f391960627"] button',
        guid: 'd19cba75-0acd-4a6b-ada7-5c6a2815b271'
    }

    async clickAddNotificationEventBtn(): Promise<void> {
        await $(this.selectors.addNotificationEventButton).click();
    }

    async isAddNotificationEventBtnEnabled(): Promise<boolean> {
      return  await $(this.selectors.addNotificationEventButton).isEnabled();
    }

    async getDescriptionValue(): Promise<string> {
        return await utilGrid.getSelectedGridRecordValue(this.selectors.guid, 'Description');
    }

}

export default new NotificationEventConsolePage();