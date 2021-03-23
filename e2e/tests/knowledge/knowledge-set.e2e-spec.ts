import {browser} from 'protractor';
import apiHelper from '../../api/api.helper';
import loginPage from '../../pageobject/common/login.po';
import navigationPage from '../../pageobject/common/navigation.po';
import consoleKnowledgeSetPo from '../../pageobject/settings/knowledge-management/console-knowledge-set.po';
import createKnowledgeSetPo from '../../pageobject/settings/knowledge-management/create-knowledge-set.po';
import editKnowledgeSet from '../../pageobject/settings/knowledge-management/edit-knowledge-set.po';
import {BWF_BASE_URL, BWF_PAGE_TITLES} from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import utilityGrid from '../../utils/utility.grid';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import apiCoreUtil from '../../api/api.core.util';
import createKnowledgePage from '../../pageobject/knowledge/create-knowlege.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';

describe('Knowledge Article Set', () => {
  let knowledgeManagementApp = 'Knowledge Management';
  let knowledgeArticlesTitleStr = 'Knowledge Articles';
  beforeAll(async () => {
    await browser.get(BWF_BASE_URL);
    await apiHelper.apiLogin('tadmin');
    await apiHelper.deleteKnowledgeSet('6375');
    await loginPage.login('elizabeth');
  });

  afterAll(async () => {
    await utilityCommon.closeAllBlades();
    await navigationPage.signOut();
  });

  describe('[6357]: Knowledge set_Tenant Administrator creates knowledge set', async () => {
    let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let knowledgesetFacilities = 'knowledgeSetFacilities_' + randomStr;

    it('[6357]: Knowledge set_Tenant Administrator creates knowledge set', async () => {
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
      expect(await createKnowledgeSetPo.isFieldRequired('Knowledge Set')).toBeTruthy('Knowledge Set field is not tagged as required');
      expect(await createKnowledgeSetPo.isFieldRequired('Description')).toBeTruthy('Description field is not tagged as required');
      expect(await createKnowledgeSetPo.isFieldRequired('Company')).toBeTruthy('Company field is not tagged as required');
      await createKnowledgeSetPo.clickCreateNewButton();
      expect(await createKnowledgeSetPo.getDescriptionLabel()).toBe('Description');
      expect(await createKnowledgeSetPo.getApplicationIDLabel()).toBe('Application ID');
      expect(await createKnowledgeSetPo.getApplicationBundleLabel()).toBe('Application Bundle ID');
      expect(await createKnowledgeSetPo.isFieldRequired('Application Description')).toBeTruthy('Application Description field is not tagged as required');
      expect(await createKnowledgeSetPo.isFieldRequired('Application ID')).toBeTruthy('Application ID field is not tagged as required');
      expect(await createKnowledgeSetPo.isFieldRequired('Application Bundle ID')).toBeTruthy('Application Bundle ID field is not tagged as required');
      await createKnowledgeSetPo.clickCreateNewApplicationCancelBtn();
      await createKnowledgeSetPo.setKnowledgeSetName('6375' + randomStr);
      await createKnowledgeSetPo.setCompanyValue('Petramco');
      await createKnowledgeSetPo.setDescriptionValue('Sample Description' + randomStr);
      await createKnowledgeSetPo.addNewApplication('Approval', 'desc1' + randomStr);
      await createKnowledgeSetPo.addNewApplication('Assignment', 'desc2' + randomStr);
      await createKnowledgeSetPo.addNewApplication('Case Management Service', 'desc3' + randomStr);
      await createKnowledgeSetPo.clickAssociateBtn();
      expect(await createKnowledgeSetPo.isApplicationAvaialableForAssociation('com.bmc.arsys.rx.approval')).toBeTruthy('Approval Application is not present');
      expect(await createKnowledgeSetPo.isApplicationAvaialableForAssociation('com.bmc.arsys.rx.assignment')).toBeTruthy('Assignment Application is not present');
      expect(await createKnowledgeSetPo.isApplicationAvaialableForAssociation('com.bmc.dsm.case-lib')).toBeTruthy('Case Management Application is not present');
      await createKnowledgeSetPo.checkApplicationCheckboxes(['com.bmc.arsys.rx.approval', 'com.bmc.arsys.rx.assignment', 'com.bmc.dsm.case-lib']);
      await createKnowledgeSetPo.clickSelectBtn();
      await createKnowledgeSetPo.clickSaveBtn();
      await utilityCommon.closeAllBlades();
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeTruthy('Record is not Present');
      await utilityGrid.searchAndOpenHyperlink('6375' + randomStr);
      expect(await editKnowledgeSet.isApplicationNameListed('com.bmc.arsys.rx.approval')).toBeTruthy('Approval Application is not present');
      expect(await editKnowledgeSet.isApplicationNameListed('com.bmc.arsys.rx.assignment')).toBeTruthy('Assignment Application is not present');
      expect(await editKnowledgeSet.isApplicationNameListed('com.bmc.dsm.case-lib')).toBeTruthy('Case Management Application is not present');
      await utilityCommon.closeAllBlades();
      await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
      await createKnowledgeSetPo.setKnowledgeSetName('6375_1' + randomStr);
      await createKnowledgeSetPo.setCompanyValue('Petramco');
      await createKnowledgeSetPo.setDescriptionValue('Sample Description1' + randomStr);
      await createKnowledgeSetPo.clickAssociateBtn();
      await createKnowledgeSetPo.checkApplicationCheckboxes(['com.bmc.dsm.bwfa']);
      await createKnowledgeSetPo.clickSelectBtn();
      await createKnowledgeSetPo.clickSaveBtn();
      await utilityCommon.closeAllBlades();
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeTruthy('Record is not Present');
    });

    it('[6357]: Verify if case assignment mapping is accessible to different LOB Case BA', async () => {
      await navigationPage.signOut();
      await loginPage.login('fritz');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeFalsy('Knowledge set are displayed to different LOB Case BA.');
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeFalsy('Knowledge set are displayed to different LOB Case BA.');
      await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
      await createKnowledgeSetPo.setKnowledgeSetName(knowledgesetFacilities);
      await createKnowledgeSetPo.setCompanyValue('Petramco');
      await createKnowledgeSetPo.setDescriptionValue('Sample Description1' + randomStr);
      await createKnowledgeSetPo.clickAssociateBtn();
      await createKnowledgeSetPo.checkApplicationCheckboxes(['com.bmc.dsm.bwfa']);
      await createKnowledgeSetPo.clickSelectBtn();
      await createKnowledgeSetPo.clickSaveBtn();
      expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
      await utilityCommon.closeAllBlades();
      expect(await utilityGrid.isGridRecordPresent(knowledgesetFacilities)).toBeTruthy('Record is not Present');
    });

    it('[6357]: Verify if case assignment mapping is accessible to Case BA belonging to different company with same LOB', async () => {
      await navigationPage.signOut();
      await loginPage.login('gwixillian');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeTruthy('Knowledge set are not displayed to Case BA with same LOB and different Company.');
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeTruthy('Knowledge set are not displayed to Case BA with same LOB and different Company');;
      expect(await utilityGrid.isGridRecordPresent(knowledgesetFacilities)).toBeFalsy('Knowledge set are displayed to same LOB Case BA.');
    });

    it('[6357]: Verify if case assignment mapping is accessible to Case Manager user having access to multiple LOB', async () => {
      await navigationPage.signOut();
      await loginPage.login('qyuan', 'Password_1234');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      await utilityGrid.selectLineOfBusiness('Human Resource');
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeTruthy('Knowledge set are not displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeTruthy('Knowledge set are not displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent(knowledgesetFacilities)).toBeFalsy('Knowledge set are displayed to Case BA with multiple LOB access');
      await utilityGrid.selectLineOfBusiness('Facilities');
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeFalsy('Knowledge set are displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeFalsy('Knowledge set are displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent(knowledgesetFacilities)).toBeTruthy('Knowledge set are not displayed to Case BA with multiple LOB access');
    });

    it('[6357]: Verify if case assignment mapping is accessible to Case BA user having access to multiple LOB', async () => {
      await navigationPage.signOut();
      await loginPage.login('qyuan', 'Password_1234');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      await utilityGrid.selectLineOfBusiness('Facilities');
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeFalsy('Knowledge set are displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeFalsy('Knowledge set are displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent(knowledgesetFacilities)).toBeTruthy('Knowledge set are not displayed to Case BA with multiple LOB access');
      await utilityGrid.selectLineOfBusiness('Human Resource');
      expect(await utilityGrid.isGridRecordPresent('6375' + randomStr)).toBeTruthy('Knowledge set are not displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent('6375_1' + randomStr)).toBeTruthy('Knowledge set are not displayed to Case BA with multiple LOB access');
      expect(await utilityGrid.isGridRecordPresent(knowledgesetFacilities)).toBeFalsy('Knowledge set are displayed to Case BA with multiple LOB access');
      await utilityGrid.searchAndOpenHyperlink('6375' + randomStr);
      await editKnowledgeSet.setKnowledgeSetName('6375_updated' + randomStr);
      await editKnowledgeSet.removeApplicationAssociation('com.bmc.arsys.rx.approval');
      await editKnowledgeSet.clickSaveButton();
      expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('Record saved successfully confirmation message not displayed.');
      await utilityCommon.closePopUpMessage();
      await utilityCommon.closeAllBlades();
    });
    it('[6357]: create same name record in same LOB', async () => {
      //create same name record in same LOB
      await navigationPage.signOut();
      await loginPage.login('jbarnes');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      await utilityGrid.selectLineOfBusiness('Facilities');
      await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
      await createKnowledgeSetPo.setKnowledgeSetName(knowledgesetFacilities);
      await createKnowledgeSetPo.setCompanyValue('Petramco');
      await createKnowledgeSetPo.setDescriptionValue('Sample Description1' + randomStr);
      await createKnowledgeSetPo.clickSaveBtn();
      expect(await utilityCommon.isPopUpMessagePresent(`Knowledge Set with name already exists for selected company.`)).toBeTruthy('Error message absent');
      await createKnowledgeSetPo.clickCancelBtn();
      await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
      await utilityCommon.closePopUpMessage();
    });
    it('[6357]: create same name record in different LOB', async () => {
      //create same name record in different LOB
      await utilityGrid.selectLineOfBusiness('Human Resource');
      await consoleKnowledgeSetPo.clickOnAddKnowledgeSetBtn();
      await createKnowledgeSetPo.setKnowledgeSetName(knowledgesetFacilities);
      await createKnowledgeSetPo.setCompanyValue('Petramco');
      await createKnowledgeSetPo.setDescriptionValue('Sample Description1' + randomStr);
      // verify LOB is there
      expect(await createKnowledgeSetPo.getLobValue()).toBe('Human Resource');
      await createKnowledgeSetPo.clickSaveBtn();
      expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy('success message absent');
      // open the record and verify LOB is on edit screen
      await utilityCommon.closePopUpMessage();
      await editKnowledgeSet.clickCancelButton();
      await utilityGrid.searchAndOpenHyperlink(knowledgesetFacilities);
      expect(await editKnowledgeSet.getLobValue()).toBe('Human Resource');
      await editKnowledgeSet.clickCancelButton();
    });
    afterAll(async () => {
      await utilityCommon.closeAllBlades();
      await navigationPage.signOut();
      await loginPage.login('elizabeth');
    });

  });

  describe('[5594]:Knowledge Article Template visibility contains Knowledge Set associated with KM and BWF', async () => {
    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let knowledgeSetTitle = 'KnowledgeSet_' + randomStr, articleData, articleDetails;
    const knowledgeTemplateStr = 'ArticleTemplate_' + randomStr;
    beforeAll(async () => {
      let knowledgeSetData = {
        knowledgeSetTitle: `${knowledgeSetTitle}`,
        knowledgeSetDesc: `${knowledgeSetTitle}_Desc`,
        company: 'Petramco'
      }
      await apiHelper.apiLogin('elizabeth');
      await apiHelper.createKnowledgeSet(knowledgeSetData);
      let knowledgeArticleTemplateData = {
        templateName: knowledgeTemplateStr,
        sectionTitle: 'articleSection',
        knowledgeSetTitle: knowledgeSetData.knowledgeSetTitle
      }
      await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
      let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
      articleData = {
        'knowledgeSet': `${knowledgeSetTitle}`,
        'title': `${knowledgeSetTitle}`,
        'templateId': knowledgeTemplateId,
        'categoryTier1': 'Employee Relations',
        'categoryTier2': 'Compensation',
        'categoryTier3': 'Bonus',
        'region': 'Australia',
        'site': 'Canberra',
        'company': 'Petramco',
        'assignedCompany': 'Petramco',
        'assigneeBusinessUnit': 'United Kingdom Support',
        'assigneeSupportGroup': 'GB Support 1',
        'assignee': 'KMills',
        'articleDesc': `${knowledgeSetTitle}_Desc`
      }
      articleDetails = await apiHelper.createKnowledgeArticle(articleData);
    });
    it('[5594]:Knowledge Article Template visibility contains Knowledge Set associated with KM and BWF', async () => {
      await navigationPage.signOut();
      await loginPage.login('elizabeth');
      await navigationPage.switchToApplication(knowledgeManagementApp);
      expect(await knowledgeArticlesConsolePo.getKnowledgeArticleConsoleTitle()).toEqual(knowledgeArticlesTitleStr);
      await utilityGrid.searchAndOpenHyperlink(articleDetails.displayId);
      expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitle, 'Article set is not displayed');
    });

    it('[5594]:Knowledge Article Template visibility contains Knowledge Set associated with KM and BWF', async () => {
      await utilityCommon.switchToDefaultWindowClosingOtherTabs();
      await navigationPage.signOut();
      await loginPage.login('qtao');
      await navigationPage.switchToApplication(knowledgeManagementApp);
      await navigationPage.gotoCreateKnowledge();
      await createKnowledgePage.clickOnTemplate(knowledgeTemplateStr);
      await createKnowledgePage.clickOnUseSelectedTemplateButton();
      await createKnowledgePage.addTextInKnowlegeTitleField('knowledgeTitle' + randomStr);
      await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitle);
      await createKnowledgePage.clickOnSaveKnowledgeButton();
      await previewKnowledgePo.clickGoToArticleButton();
      expect(await viewKnowledgeArticlePo.getKnowledgeSet()).toBe(knowledgeSetTitle, 'Article set is not displayed');
    });
    it('[5594]:Knowledge Article Template visibility contains Knowledge Set associated with KM and BWF', async () => {
      await utilityCommon.switchToDefaultWindowClosingOtherTabs();
      await navigationPage.signOut();
      await loginPage.login('elizabeth');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      await utilityGrid.searchAndOpenHyperlink(knowledgeSetTitle);
      await editKnowledgeSet.removeApplicationAssociation('com.bmc.dsm.bwfa');
      await editKnowledgeSet.clickSaveButton();
      await utilityCommon.closePopUpMessage();
      await utilityCommon.closeAllBlades();
      await navigationPage.signOut();
      await loginPage.login('qtao');
      await navigationPage.switchToApplication(knowledgeManagementApp);
      await navigationPage.gotoCreateKnowledge();
      expect(await createKnowledgePage.isTemplatePresent(knowledgeTemplateStr)).toBeTruthy(`Template ${knowledgeTemplateStr} is not present`);
    });
    it('[5594]:Knowledge Article Template visibility contains Knowledge Set associated with KM and BWF', async () => {
      await utilityCommon.switchToDefaultWindowClosingOtherTabs();
      await navigationPage.signOut();
      await loginPage.login('elizabeth');
      await navigationPage.gotoSettingsPage();
      await navigationPage.gotoSettingsMenuItem('Knowledge Management--Knowledge Sets', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.KNOWLEDGE_SETS);
      await utilityGrid.searchAndOpenHyperlink(knowledgeSetTitle);
      await editKnowledgeSet.removeApplicationAssociation('com.bmc.dsm.knowledge');
      await editKnowledgeSet.clickSaveButton();
      await utilityCommon.closePopUpMessage();
      await utilityCommon.closeAllBlades();
      await navigationPage.signOut();
      await loginPage.login('fritz'); // Knowledge set created under LOB: HR should not visible to user belonging to LOB: Finance
      await navigationPage.switchToApplication(knowledgeManagementApp);
      await navigationPage.gotoCreateKnowledge();
      expect(await createKnowledgePage.isTemplatePresent(knowledgeTemplateStr)).toBeFalsy(`Template ${knowledgeTemplateStr} is not present`);
    });
    afterAll(async () => {
      await utilityCommon.switchToDefaultWindowClosingOtherTabs();
      await navigationPage.signOut();
      await loginPage.login('elizabeth');
    });
  });
});
