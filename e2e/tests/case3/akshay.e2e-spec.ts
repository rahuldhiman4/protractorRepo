import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Case Edit Backlog Test', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //ashastra
    describe('[4075]: A Resolution Code can be associated with multiple Flowsets', async () => {
        beforeAll(async () => {
            // precondition test data preparation
        });
        it('[4075]: A Resolution Code can be associated with multiple Flowsets', async () => {
            // step 1,2,3
        });
        it('[4075]: A Resolution Code can be associated with multiple Flowsets', async () => {
            // step 4,5,6
        });
        afterAll(async () => {
            // cleanup if needed
        });
    });
});
