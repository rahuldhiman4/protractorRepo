import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilCommon from '../../utils/util.common';
import consoleFlowset from '../../pageobject/flowset/console-flowset-config.po';
import createFlowset from '../../pageobject/flowset/create-flowset-config.po';
import editFlowset from '../../pageobject/flowset/edit-flowset-config.po';
import apiHelper from '../../api/api.helper';

describe('Create Flow Set', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
        await utilCommon.waitUntilSpinnerToHide();
    });

    //ankagraw
    it('[DRDMV-6211]: [Flowsets] Create new flowset configuration', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let drpDownStatus: string[] = ['Draft', 'Active', 'Inactive'];
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await expect(consoleFlowset.isAddFlowsetButtonDisabled()).toBeFalsy("Add flowset is disabled");
        await consoleFlowset.clickOnAddFlowset();

        //verify the Titles
        await expect(createFlowset.isCompanyTitleDisplayed('Company')).toBeTruthy(" Company Title is not present");
        await expect(createFlowset.isFlowsetNameTitleDisplayed('Flowset Name')).toBeTruthy(" Flowset Name Title is not present");
        await expect(createFlowset.isDescriptionTitleDisplayed('Description')).toBeTruthy(" Description Title is not present");
        await expect(createFlowset.isStatusTitleDisplayed('Status')).toBeTruthy(" Status Title is not present");
        await createFlowset.clickOnStatus();
        await createFlowset.statusDropDownValuesDisplayed(drpDownStatus);
        //verify the Required Fields
        await expect(createFlowset.isCompanyRequiredTextDisplayed()).toBe("required", " Company Required text not present ");
        await expect(createFlowset.isFlowsetRequiredTextDisplayed()).toBe("required", " Flowset Name Required text not present ");
        await expect(createFlowset.isDescriptionRequiredTextDisplayed()).toBe("required", " Description Required text not present ");
        await expect(createFlowset.isStatusRequiredTextDisplayed()).toBe("required", " Status Required text not present ");

        //add Flowsets
        await createFlowset.selectCompany('Petramco');
        await createFlowset.setFlowsetname('Flowset' + randomStr);
        await createFlowset.setDescription("description" + randomStr);
        await createFlowset.selectStatus("Active");
        await createFlowset.clickSaveButton();
        await expect(editFlowset.getComapanyValue()).toBe('Petramco');
    });

    //ankagraw
    it('[DRDMV-6215]: [Flowsets] Edit/Delete Flowsets', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        //API call to create the flowset
        await apiHelper.apiLogin('qkatawazi');
        let flowsetData = require('../../data/ui/case/flowset.ui.json');
        let flowsetName: string = await flowsetData['flowsetMandatoryFields'].flowsetName + randomStr;
        flowsetData['flowsetMandatoryFields'].flowsetName = flowsetName;
        await apiHelper.createNewFlowset(flowsetData['flowsetMandatoryFields']);

        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Manage Flowsets--Define Flowsets', 'Flowsets - Console - Business Workflows');
        await consoleFlowset.searchAndSelectFlowset(flowsetName);
        await editFlowset.setFlowset("edit Flowset" + randomStr);
        await editFlowset.setDescription("edit description" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Active");
        await editFlowset.selectStatus("Draft");
        await editFlowset.clickSaveBtn();
        await consoleFlowset.searchAndSelectFlowset("edit Flowset" + randomStr);
        await expect(editFlowset.getStatusvalue()).toBe("Draft");
    });
});