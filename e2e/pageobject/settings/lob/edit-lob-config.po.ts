import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class DefineLOBEdit {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        name: '[rx-view-component-id="93948d36-241e-4ceb-ac5c-d3f5149ca89a"] input',
        description: '[rx-view-component-id="2c6875b9-ca79-4bed-8da7-075710055aba"] textarea',
        bundleName: '[rx-view-component-id="e55d20c1-0202-4364-9088-8214997576d8"] input',
        cancelButton: '[rx-view-component-id="47f9ec05-7d53-43af-98da-4b7be07ece1f"] button'
    }

    async isFieldRequired(fieldName: string): Promise<boolean> {
        let guid: string = undefined;
        switch (fieldName) {
            case "Name": {
                guid = '93948d36-241e-4ceb-ac5c-d3f5149ca89a';
                break;
            }
            case "Description": {
                guid = '2c6875b9-ca79-4bed-8da7-075710055aba';
                break;
            }
            case "Status": {
                guid = '8ea375d8-a074-485f-a534-5a3b56cbb30c';
                break;
            }
            default: {
                console.log(fieldName, ' is not a valid parameter');
                break;
            }
        }
        return await utilCommon.isRequiredTagToField(guid);
    }

    async getBundleName(): Promise<string> {
        return await $(this.selectors.bundleName).getAttribute('value');
    }

    async getName(): Promise<string> {
        return await $(this.selectors.name).getAttribute('value');
    }

    async getDescription(): Promise<string> {
        return await $(this.selectors.description).getAttribute('value');
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

}
export default new DefineLOBEdit();