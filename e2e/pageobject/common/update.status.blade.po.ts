import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../utils/util.common';

class UpdateStatus {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusDropDown: '[rx-view-component-id="3c8d9278-fc1f-430c-b866-cdc9d217318b"], [rx-view-component-id="8b4cef48-0a4c-4ec1-bc4c-cce47179c964"]',
        statusReasonDropDown: '[rx-view-component-id="049c43a1-4cbd-482d-980d-5db4ed78f295"], [rx-view-component-id="baf69b56-c37b-4a0b-9e68-f18558738ebb"]',
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