import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { BWF_BASE_URL } from '../../utils/constants';
import loginPage from "../../pageobject/common/login.po";
import utilityCommon from '../../utils/utility.common';
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';
import applicationConfigPo from '../../pageobject/common/common-services/application-config.po';

describe('Application Configuration', () => {
    beforeAll(async () => {

        await browser.get(BWF_BASE_URL);
        await loginPage.login("elizabeth");
   });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DMDRV-22773] : [Common Config] - Only Operating, Service Provider, Customer type of Primary organizations and global company should be returned in company field', () => {
        let userData;
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');

            userData = {
                "firstName": "Case BA User - 22773",
                "lastName": "3428",
                "userId": "22773User",
                "emailId": "3428_User@petramco.com",
                "userPermission": ["Case Business Analyst", "Foundation Read", "Human Resource"]
            }
            await apiHelper.createNewUser(userData);
            await apiHelper.associatePersonToCompany(userData.userId, "Petramco");
            await apiHelper.associatePersonToCompany(userData.userId, "Amazon");
            await apiHelper.associatePersonToCompany(userData.userId, "Alienware");
            await apiHelper.associatePersonToCompany(userData.userId, "Phyto");
            await apiHelper.associatePersonToCompany(userData.userId, "Phylum");
            await apiHelper.associatePersonToCompany(userData.userId, "BMCOpsMonitoring");
            await apiHelper.associatePersonToCompany(userData.userId, "Google");
        });

        it('[3428]:[Common Config] - Only Operating, Service Provider, Customer type of Primary organizations and global company should be returned in company field', async () => {
            await navigationPage.signOut();
            await loginPage.login(userData.userId+'@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Common Configurations', 'Common Configurations - Business Workflows');
            await applicationConfigPo.clickApplicationConfiguration('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_TIME_FORMAT');
            await applicationConfigPo.clickAddConfigurationValue();
            expect(await utilCommon.isDropDownOptionsMatches('Company', ['- Global -', 'Petramco', 'Phyto', 'Phylum', 'BMCOpsMonitoring'])).toBeTruthy();
            await applicationConfigPo.clickCancelButton();
            await applicationConfigPo.clickApplicationConfiguration('ADD_DWP_SURVEY_ON_CASE');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('ADD_DWP_SURVEY_ON_CASE');
            await applicationConfigPo.clickAddConfigurationValue();
            expect(await utilCommon.isDropDownOptionsMatches('Company', ['- Global -', 'Petramco', 'Phyto', 'Phylum', 'BMCOpsMonitoring'])).toBeTruthy();
            await applicationConfigPo.clickCancelButton();
            
        });
    });
})