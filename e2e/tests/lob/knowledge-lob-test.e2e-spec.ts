import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiCoreUtil from '../../api/api.core.util';
import createKnowledgePage from "../../pageobject/knowledge/create-knowlege.po";
import changeAssignmentBladePo from '../../pageobject/common/change-assignment-blade.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import editKnowledgePo from '../../pageobject/knowledge/edit-knowledge.po';
import knowledgeArticlesConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import statusBladeKnowledgeArticlePo from '../../pageobject/knowledge/status-blade-knowledge-article.po';
import utilityGrid from '../../utils/utility.grid';
import coreApi from '../../api/api.core.util';
import accessTabPo from '../../pageobject/common/access-tab.po';


describe('Knowledge Article Creation', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', () => {
        const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgeSetTitle = 'KnowledgeSet_' + randomStr, articleData, articleDetails;
        const knowledgeTemplateStr = 'ArticleTemplate_' + randomStr;
        beforeAll(async () => {
            // Knowledge set under LOB HR
            let knowledgeSetData = {
                knowledgeSetTitle: `${knowledgeSetTitle}`,
                knowledgeSetDesc: `${knowledgeSetTitle}_Desc`,
                company: 'Petramco'
            }
            await apiHelper.apiLogin('elizabeth');
            await apiHelper.createKnowledgeSet(knowledgeSetData);
            // Knowledge Template under LOB HR
            let knowledgeArticleTemplateData = {
                templateName: knowledgeTemplateStr,
                sectionTitle: "articleSection"
            }
            await apiHelper.createKnowledgeArticleTemplate(knowledgeArticleTemplateData);
            let knowledgeTemplateId = await apiCoreUtil.getKnowledgeTemplateGuid(knowledgeTemplateStr);
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate(knowledgeTemplateStr);
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toContain('Human Resource', 'value not matched with expected');
            await expect(createKnowledgePage.isLineOfBusinessDisable());
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Employee Relations')).toBeTruthy('Failure: Operational Category 1 is missing');

            //Verify Knowledge set and category belonging to LOB Finanace are not visible
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', 'Facilities')).toBeFalsy('Failure: Knowledge Set is available');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is missing');

            //Knowledge creation
            await createKnowledgePage.addTextInKnowlegeTitleField(knowledgeSetTitle);
            await createKnowledgePage.selectKnowledgeSet(knowledgeSetTitle);
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');
            await createKnowledgePage.selectCategoryTier2Option('Compensation');
            await createKnowledgePage.selectCategoryTier3Option('Bonus');
            await createKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on create knowledge article
            await changeAssignmentBladePo.selectBusinessUnit('United States Support')
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.getCategoryTier1SelectedValue()).toBe('Employee Relations');
            expect(await editKnowledgePo.isValuePresentInDropdown('Category Tier 1', 'Facilities')).toBeFalsy('Failure: Operational Category 1 is missing');
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on edit Knowledge article
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await utilityCommon.closePopUpMessage();
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBladePo.selectCompany('Petramco');
            // Need to add validation to verify Business unit , support group, Agent are visible as per logged in user LOB - Human Resource on SME Review blade
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            await changeAssignmentBladePo.selectAssignee('Qadim Katawazi');
            await changeAssignmentBladePo.clickOnAssignButton();
            await editKnowledgePo.clickSaveStatusBtn();
        });
        it('[DRDMV-23597]: [Operating Organization] [Knowledge] Verify the Knowledge Article Creation with respect to Line of Business when user has access to single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            expect(await knowledgeArticlesConsolePo.isGridRecordPresent(knowledgeSetTitle)).toBeFalsy('Artcile is present');
        });
    });

    describe('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', () => {
        let twoCompanyUser, supportGroupDataHR, supportGroupDataFacilities, knowledgeSetDataHR, knowledgeSetDataFacilities, userData1, userData2, knowledgeArticleDataDiffLOB, articleId;
        let randomStr = [...Array(7)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            twoCompanyUser = {
                "firstName": "DRDMV23625",
                "lastName": "test",
                "userId": "DRDMV_23625_test",
                "userPermission": ["Case Agent", "Human Resource", "Case Business Analyst", "Knowledge Publisher"]
            }


            knowledgeSetDataHR = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco'
            }

            knowledgeSetDataFacilities = {
                knowledgeSetTitle: `KS HR ${randomStr}`,
                knowledgeSetDesc: `${randomStr}_Desc_HR`,
                company: 'Petramco',
                lineOfBusiness: 'Facilities'
            }

            knowledgeArticleDataDiffLOB = {
                "knowledgeSet": 'HR',
                "title": `${randomStr} title Diff LOB`,
                "templateId": "AGGAA5V0HGVMIAOK04TZO94MC355RA",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Facilities Support",
                "assigneeSupportGroup": "Facilities",
                "assignee": "Fritz",
                "lineOfBusiness": "Facilities"
            }

            await apiHelper.apiLogin("tadmin");
            await apiHelper.updateFoundationEntity('Person', 'Monika', { functionalRole: "Human Resource" });
            await apiHelper.createKnowledgeSet(knowledgeSetDataHR);
            await apiHelper.createKnowledgeSet(knowledgeSetDataFacilities);
            await apiHelper.createNewUser(twoCompanyUser);
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Petramco");
            await apiHelper.associatePersonToCompany(twoCompanyUser.userId, "Psilon");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "US Support 3");
            await apiHelper.associatePersonToSupportGroup(twoCompanyUser.userId, "Psilon Support Group1");
            await browser.sleep(9000); //Waiting for user data to be reflected
            await apiHelper.createKnowledgeArticle(knowledgeArticleDataDiffLOB);
            await apiHelper.associatePersonToCompany('ncage', "Psilon");
            //Create data for Assignment value validations
            supportGroupDataHR = {
                "orgName": "Petramco HR",
                "relatedOrgId": null,
                "domainTag": "Human Resource"
            }

            supportGroupDataFacilities = {
                "orgName": "Petramco Facilities",
                "relatedOrgId": null,
                "domainTag": "Facilities"
            }

            userData1 = {
                "firstName": "xod user23625_1",
                "lastName": "test",
                "userId": "user23625_1",
                "userPermission": ["Case Agent", "Human Resource", "Case Business Analyst", "Knowledge Publisher"]
            }

            userData2 = {
                "firstName": "bto user23625_2",
                "lastName": "test",
                "userId": "user23625_2",
                "userPermission": ["Case Agent", "Facilities", "Case Business Analyst", "Knowledge Publisher"]
            }

            await apiHelper.createNewUser(userData1);
            await apiHelper.createNewUser(userData2);
            let orgId = await coreApi.getBusinessUnitGuid('Canada Support');
            supportGroupDataHR.relatedOrgId = orgId;
            supportGroupDataFacilities.relatedOrgId = orgId;
            await apiHelper.createSupportGroup(supportGroupDataHR);
            await apiHelper.createSupportGroup(supportGroupDataFacilities);
            await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");
            await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
            await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login(`${twoCompanyUser.userId}@petramco.com`, 'Password_1234');
            await navigationPage.gotoCreateKnowledge();
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            expect(await createKnowledgePage.getValueOfLineOFBusiness()).toBe('Human Resource');
            expect(await createKnowledgePage.isLineOfBusinessDisable()).toBeTruthy();
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataHR.knowledgeSetTitle)).toBeTruthy('Failure: Knowledge Set is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Knowledge Set', knowledgeSetDataFacilities.knowledgeSetTitle)).toBeFalsy('Failure: Knowledge Set is available');

            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');

            await createKnowledgePage.addTextInKnowlegeTitleField(`Title ${randomStr}`);
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.selectCategoryTier1Option('Employee Relations');

            //Validating Assignment fields
            await createKnowledgePage.clickChangeAssignmentButton();
            await changeAssignmentBladePo.selectCompany('Petramco');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeTruthy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            //Saving the Article
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            articleId = await viewKnowledgeArticlePo.getKnowledgeArticleId();
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await editKnowledgePo.getLineOfBusinessValue()).toBe('Human Resource');
            expect(await editKnowledgePo.isLobSectionEnabled()).toBeTruthy();
            await editKnowledgePo.cancelKnowledgeMedataDataChanges();
            await viewKnowledgeArticlePo.clickEditKnowledgeAccess();
            await accessTabPo.clickToExpandAccessEntitiySearch('Support Group Access', 'Knowledge');
            await accessTabPo.selectAccessEntityDropDown('Petramco', 'Select Company');
            expect(await accessTabPo.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await accessTabPo.selectAccessEntityDropDown('Australia Support', 'Select Business Unit');
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await accessTabPo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();

            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access', 'Knowledge');
            expect(await accessTabPo.isAgentPresent(userData1.firstName)).toBeTruthy('User is not Present');
            expect(await accessTabPo.isAgentPresent(userData2.firstName)).toBeFalsy('User is Present');
            await accessTabPo.clickCloseKnowledgeAccessBlade();

            await viewKnowledgeArticlePo.clickEditKnowledgeMedataData();
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Applications')).toBeTruthy('Failure: Operational Category 1 is missing');
            expect(await createKnowledgePage.isValuePresentInDropdown('Category Tier 1', 'Facilties')).toBeFalsy('Failure: Operational Category 1 is present');
            await editKnowledgePo.setCategoryTier1('Payroll');
            await editKnowledgePo.saveKnowledgeMedataDataChanges();
            expect(await viewKnowledgeArticlePo.getCategoryTier1Value()).toBe('Payroll');

            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            await changeAssignmentBladePo.selectCompany('Petramco');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Australia Support')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Business Unit', 'Facilities Support')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('Canada Support');
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco HR')).toBeTruthy();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Support Group', 'Petramco Facilities')).toBeFalsy();
            await changeAssignmentBladePo.selectBusinessUnit('United States Support');
            await changeAssignmentBladePo.selectSupportGroup('US Support 3');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData1.firstName} ${userData1.lastName}`)).toBeTruthy('User is not present on Assignment blade');
            expect(await changeAssignmentBladePo.isPersonAvailableOnAssignBlade(`${userData2.firstName} ${userData2.lastName}`)).toBeFalsy('User is present on Assignment blade');
            await changeAssignmentBladePo.clickOnCancelButton();

            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(knowledgeArticleDataDiffLOB.title)).toBeFalsy('Record is present');

            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('ppeter');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');

            await navigationPage.signOut();
            await loginPage.login('qyuan');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');

            await navigationPage.signOut();
            await loginPage.login('monika');
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.selectLineOfBusiness('Finance');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeFalsy(articleId + ' Record is present');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(articleId)).toBeTruthy(articleId + ' Record is not present');
        });

        it('[DRDMV-23625]: [Operating Organization][Create Case]: Verify the behavior when the case agent is able to create a case when user has access to multiple companies for the single Line of Business', async () => {
            await navigationPage.signOut();
            await loginPage.login('ncage');
            await navigationPage.gotoCreateKnowledge();
            await utilityGrid.selectLineOfBusiness('Human Resource')
            await createKnowledgePage.clickOnTemplate('Reference');
            await createKnowledgePage.clickOnUseSelectedTemplateButton();
            await createKnowledgePage.addTextInKnowlegeTitleField('DRDMV23625');
            await createKnowledgePage.selectKnowledgeSet('HR');
            await createKnowledgePage.clickChangeAssignmentButton();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
            await changeAssignmentBladePo.clickOnCancelButton();
            await createKnowledgePage.clickOnSaveKnowledgeButton();
            await previewKnowledgePo.clickGoToArticleButton();
            await editKnowledgePo.setKnowledgeStatus('Draft');
            await editKnowledgePo.setKnowledgeStatusWithoutSave('SME Review');
            await statusBladeKnowledgeArticlePo.clickChangeReviewerBtn();
            expect(await changeAssignmentBladePo.isValuePresentInDropdown('Company', 'Psilon')).toBeFalsy();
            await utilityCommon.closeAllBlades();
        });

        
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });
})
