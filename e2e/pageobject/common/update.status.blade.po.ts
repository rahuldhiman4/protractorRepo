import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class UpdateStatus {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"], [rx-view-component-id="aea81ee2-85d9-4bb6-adb4-08c29028d45d"]',
        statusReasonDropDown: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"], [rx-view-component-id="ba0ecd9e-dbd2-465d-b50a-4f38867e8591"]',
        resolutionCodeDropDownGuid: 'fb07b5ff-3c9b-454a-8b0c-a1dfd9987856',
    }

    async changeStatus(statusValue: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.statusDropDown), statusValue);
    }

    async setStatusReason(statusReasonValue: string): Promise<void> {
        await utilCommon.selectDropDown2($(this.selectors.statusReasonDropDown), statusReasonValue);
    }

    async selectResolutionCode(resolutionCode: string): Promise<void> {
        await utilCommon.selectDropDown(this.selectors.resolutionCodeDropDownGuid, resolutionCode);
    }
}

export default new UpdateStatus();