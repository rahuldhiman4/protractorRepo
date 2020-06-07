import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';

describe('Dynamic Library Configuration', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('[DRDMV-13109]: [-ve] [Dynamic Data] - Create another Field with Same Name (ID) from Field Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteDynamicFieldAndGroup();
        //field Text type    
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField'+randomString);
        await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
        await localizeValuePopPo.setLocalizeValue('LibTextField'+randomString);
        await localizeValuePopPo.clickOnSaveButton();
        await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
        await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
        await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
        await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        //field Number Type  
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField'+randomString);
        await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
        await localizeValuePopPo.setLocalizeValue('LibNumberField'+randomString);
        await localizeValuePopPo.clickOnSaveButton();
        await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
        await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
        await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
        await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
    });
})