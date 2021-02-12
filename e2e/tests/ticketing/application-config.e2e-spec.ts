import { browser } from "protractor";
import applicationConfigPo from '../../pageobject/common/common-services/application-config.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

describe('Application Configuration', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('morwenna');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3428] : [Common Config] - Only Operating, Service Provider, Customer type of Primary organizations and global company should be returned in company field', () => {
        it('[3428]:[Common Config] - Only Operating, Service Provider, Customer type of Primary organizations and global company should be returned in company field', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Common Configurations', BWF_PAGE_TITLES.APPLICATION_CONFIGURATIONS.COMMON_CONFIGURATION);
            await applicationConfigPo.clickApplicationConfiguration('DATE_TIME_FORMAT');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('DATE_TIME_FORMAT');
            await applicationConfigPo.clickAddConfigurationValue();
            expect(await utilityCommon.isAllDropDownValuesMatches('Company', ['- Global -', 'Petramco', 'Phyto', 'Phylum', 'BMCOpsMonitoring'])).toBeTruthy();
            await applicationConfigPo.clickCancelButton();
            await applicationConfigPo.clickApplicationConfiguration('ADD_DWP_SURVEY_ON_CASE');
            expect(await applicationConfigPo.getconfigurationHeaderValue()).toContain('ADD_DWP_SURVEY_ON_CASE');
            await applicationConfigPo.clickAddConfigurationValue();
            expect(await utilityCommon.isAllDropDownValuesMatches('Company', ['- Global -', 'Petramco', 'Phyto', 'Phylum', 'BMCOpsMonitoring'])).toBeTruthy();
            await applicationConfigPo.clickCancelButton();
        });
    });
});
