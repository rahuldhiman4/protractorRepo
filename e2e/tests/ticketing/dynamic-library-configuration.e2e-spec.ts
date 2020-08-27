import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import localizeValuePopPo from '../../pageobject/common/localize-value-pop.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import createDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/create-dynamic-field-library-config.po';
import dynamicFieldLibraryConfigConsolePo from '../../pageobject/settings/application-config/dynamic-field-library-config-console.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import editDynamicFieldLibraryConfigPo from '../../pageobject/settings/application-config/edit-dynamic-field-library-config.po';
import utilGrid from '../../utils/util.grid';

describe('Dynamic Library Configuration', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
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
        await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomString);
        await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
        await localizeValuePopPo.setLocalizeValue('LibTextField' + randomString);
        await localizeValuePopPo.clickOnSaveButton();
        await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
        await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
        await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
        await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        //field Number Type  
        await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
        await createDynamicFieldLibraryConfigPo.setFieldName('LibTextField' + randomString);
        await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
        await localizeValuePopPo.setLocalizeValue('LibNumberField' + randomString);
        await localizeValuePopPo.clickOnSaveButton();
        await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
        await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
        await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
        await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        expect(await utilCommon.isPopUpMessagePresent('ERROR (382): The value(s) for this entry violate a unique index that has been defined for this record definition.')).toBeTruthy();
        await utilCommon.closePopUpMessage();
        await createDynamicFieldLibraryConfigPo.clickCancelButton();
        await utilCommon.clickOnWarningOk();
    });

    describe('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Application Configuration--Dynamic Field Library', 'Field Management Console - Business Workflows');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteDynamicFieldAndGroup();

            //field Text type    
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('ABCDEFGHIJKLMNOPQRSTUVWXYZ' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('TEXT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('123456789');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('123456789' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('NUMBER');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('ABC1237GC234wer324werfer7df');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('ABC1237GC234wer324werfer7df' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Agent');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('BOOLEAN');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('@#$%^&*()_-++{[}');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('@#$%^&*()_-++{[}' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('System');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('DATE');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('Field 123 Test_1');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('Field 123 Test_1' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Task Assignee');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('ATTACHMENT');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await dynamicFieldLibraryConfigConsolePo.clickAddDynamicFieldButton();
            await createDynamicFieldLibraryConfigPo.setFieldName('List');
            await createDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue('List' + randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await createDynamicFieldLibraryConfigPo.setStatusValue('Active');
            await createDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await createDynamicFieldLibraryConfigPo.setFieldValueType('LIST');
            await createDynamicFieldLibraryConfigPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.clickCancelButton();
        });
        it('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.searchAndOpenHyperlink('ABCDEFGHIJKLMNOPQRSTUVWXYZ' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString+"ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilGrid.searchAndOpenHyperlink('123456789' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue("123456789"+randomString);
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.searchAndOpenHyperlink('ABC1237GC234wer324werfer7df' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString+"ABC1237GC234wer324werfer7df");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilGrid.searchAndOpenHyperlink('@#$%^&*()_-++{[}' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString+'@#$%^&*()_-++{[}');
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
        it('[DRDMV-13104,DRDMV-13103]: [Dynamic Data] - Add all type of fields in Field Library', async () => {
            await utilGrid.searchAndOpenHyperlink('Field 123 Test_1' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString+"Field 123 Test_1");
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Requester');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();

            await utilGrid.searchAndOpenHyperlink('List' + randomString);
            await editDynamicFieldLibraryConfigPo.clickOnLocalizeButton();
            await localizeValuePopPo.setLocalizeValue(randomString+'List');
            await localizeValuePopPo.clickOnSaveButton();
            await editDynamicFieldLibraryConfigPo.setInformationSourceValueType('Task Assignee');
            await editDynamicFieldLibraryConfigPo.setStatusValue('Inactive');
            await editDynamicFieldLibraryConfigPo.clickOnSaveButton();
        });
    });
});