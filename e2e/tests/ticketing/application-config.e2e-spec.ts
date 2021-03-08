import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import applicationConfigPo from '../../pageobject/settings/application-config/application-config.po';
import editApplicationConfigPo from '../../pageobject/settings/application-config/edit-application-config.po';
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
            // 1. Only Operating, Service Provider, Customer type of Primary organizations and global company should be returned
            await applicationConfigPo.isCompanyListMatches(['- Global -', 'Petramco', 'Phylum', 'Psilon']);
            // 2. Change company dropdown on grid
            await applicationConfigPo.selectCompany('Phylum');
            // 3. Open any one confing and check company field value and the field is grayed out (e.g. IDENTITY_VALIDATION)
            await applicationConfigPo.clickApplicationConfiguration('IDENTITY_VALIDATION');
            expect(await editApplicationConfigPo.getCompanyValue()).toBe('Phylum');
        });
    });
});
