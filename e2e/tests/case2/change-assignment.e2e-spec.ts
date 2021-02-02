import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import { SOURCE_ACTIVE_NOT_ON_UI, SOURCE_DEPRECATED, SOURCE_INACTIVE, SOURCE_MENU_ITEM } from '../../data/ui/ticketing/menu.item.ui';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import quickCasePo from "../../pageobject/case/quick-case.po";
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPo from "../../pageobject/common/login.po";
import navigationPo from "../../pageobject/common/navigation.po";
import resourcesPo from '../../pageobject/common/resources-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import editCaseTemplatePo from "../../pageobject/settings/case-management/edit-casetemplate.po";
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import templateAccessTabPo from '../../pageobject/settings/case-management/template-access-tab.po';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import activityPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
import changeAssignmentPage from '../../pageobject/common/change-assignment-blade.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import _ = require('lodash');

describe("Change Assignment", () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPo.login("qkatawazi");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPo.signOut();
    });

    //apurva
    it('[4000001]:Verify that all the values are sorted for Company, Support Org, SG and Company Dropdown', async () => {
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.isDropDownListSorted("Company")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("SupportOrg")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("AssignedGroup")).toBeTruthy();
        expect(await changeAssignmentPage.isDropDownListSorted("Assignee")).toBeTruthy();
    });

    //apurva
    it('[4000002]:Verify the dropdown options contains Full name and hierarchy + Full Name for all the Assignment Field Dropdowns', async () => {
        await navigationPo.gotoCreateCase();
        await createCasePo.selectRequester('adam');
        await createCasePo.setSummary('Summary');
        expect(await changeAssignmentPage.getCompanyDefaultValue()).toBe('Petramco');
        await changeAssignmentPage.selectSupportOrg('United States Support');
        await changeAssignmentPage.selectAssignedGroup('US Support 3');
        await changeAssignmentPage.selectAssignee(' Kyle Kohri');
        expect(_.includes(await changeAssignmentPage.getAllDropDownValues("SupportOrg"),'United States Support\nPetramco > United States Support')).toBeTruthy();
    });
});
