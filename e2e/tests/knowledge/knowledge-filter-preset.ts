import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { ARTICLE_DATA_ASSIGNTOANOTHERUSER, ARTICLE_DATA_ASSIGNTOGROUP, ARTICLE_DATA_ASSIGNTOME, KNOWLEDGE_APPROVAL_FLOW_DATA, KNOWLEDGE_APPROVAL_MAPPING_DATA, KNOWLEDGE_SET_DATA } from "../../data/ui/case/presetFilter.data.ui";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfigPO from "../../pageobject/settings/common/status-config.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from "../../utils/util.grid";
import utilityCommon from '../../utils/utility.common';

xdescribe('Knowledge Console Preset Filter', () => {

    let userIdKnowledgeCoach = "idphylumkuser@petramco.com";
    let passwordKnowledgeCoach = "Password_1234";
    let knowledgeSetTitle = undefined;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);

        //Create the Phylum users
        await apiHelper.apiLogin('tadmin');
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        let personData1 = personDataFile['PhylumKnowledgeUser1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');

        let personData2 = personDataFile['PhylumKnowledgeUser2'];
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData2.userId, 'Phylum');

        //Create Knowledge Configuraton
        const randomStr = [...Array(2)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        knowledgeSetTitle = KNOWLEDGE_SET_DATA.knowledgeSetTitle + randomStr;

        KNOWLEDGE_SET_DATA.knowledgeSetTitle = knowledgeSetTitle;
        await apiHelper.createKnowledgeSet(KNOWLEDGE_SET_DATA);

        let approvalConfigGlobalTitle = KNOWLEDGE_APPROVAL_FLOW_DATA.flowName + randomStr;
        KNOWLEDGE_APPROVAL_FLOW_DATA.flowName = approvalConfigGlobalTitle;
        await apiHelper.createKnowledgeApprovalFlow(KNOWLEDGE_APPROVAL_FLOW_DATA);
        await apiHelper.deleteKnowledgeApprovalMapping();
        await apiHelper.createKnowledgeApprovalMapping(KNOWLEDGE_APPROVAL_MAPPING_DATA);

        browser.sleep(6000);
        await loginPage.loginWithCredentials(userIdKnowledgeCoach, passwordKnowledgeCoach);
        await navigationPage.gotoKnowledgeConsole();
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', 'Configure Knowledge Status Transition - Business Workflows');
        await statusConfigPO.setCompanyDropdown('Phylum', 'knowledge');
        await statusConfigPO.clickEditLifeCycleLink();
        await statusConfigPO.addCustomStatus('SME Review', 'Publish Approval', 'BeforePublished');
        await utilityCommon.refresh();
        await statusConfigPO.setCompanyDropdown('Phylum', 'knowledge');
        await statusConfigPO.clickEditLifeCycleLink();
        await statusConfigPO.addCustomStatus('Published', 'Retire Approval', 'AfterPublished');
    }, 150 * 1000);

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    it('[DRDMV-20894]: Validate the My Open Articles filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        ARTICLE_DATA_ASSIGNTOME.knowledgeSet = knowledgeSetTitle;
        ARTICLE_DATA_ASSIGNTOGROUP.knowledgeSet = knowledgeSetTitle;
        ARTICLE_DATA_ASSIGNTOANOTHERUSER.knowledgeSet = knowledgeSetTitle;

        //Create article in In Progress status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_In Progress";
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        knowledgeId.push(knowledgeArticleData1.displayId);

        //Create article in Draft status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Draft";
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        knowledgeId.push(knowledgeArticleData2.displayId);

        //Create article in Cancel Approval status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Cancel Approval";
        let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'CancelApproval');
        knowledgeId.push(knowledgeArticleData3.displayId);

        //Create article in Cancel status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Cancel";
        let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'CancelApproval');
        await apiHelper.approverAction(knowledgeArticleData4.id, 'Approved');
        knowledgeId.push(knowledgeArticleData4.displayId);

        //Create article in SME Review status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_SME Review";
        let knowledgeArticleData5 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'SMEReview', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        knowledgeId.push(knowledgeArticleData5.displayId);

        //Create article in Publish Approval status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Publish Approval";
        let knowledgeArticleData6 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        knowledgeId.push(knowledgeArticleData6.displayId);

        //Create article in BeforePublished(Custom status 1) status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Before Published";
        let knowledgeArticleData7 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'SMEReview', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'BeforePublished');
        knowledgeId.push(knowledgeArticleData7.displayId);

        //Create article in Published status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Published";
        let knowledgeArticleData8 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData8.id, 'Approved');
        knowledgeId.push(knowledgeArticleData8.displayId);

        //Create article in Closed status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Closed";
        let knowledgeArticleData9 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'AfterPublished');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'RetireApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Retired');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Closed');
        knowledgeId.push(knowledgeArticleData9.displayId);

        //Create article in After Published status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_After Published";
        let knowledgeArticleData10 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData10.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'Published');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'AfterPublished');
        knowledgeId.push(knowledgeArticleData10.displayId);

        //Create article in Retire Approval status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Retire Approval";
        let knowledgeArticleData11 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData11.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'AfterPublished');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'RetireApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        knowledgeId.push(knowledgeArticleData11.displayId);

        //Create article in Retired status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Retired";
        let knowledgeArticleData12 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'AfterPublished');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'RetireApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'Retired');
        knowledgeId.push(knowledgeArticleData12.displayId);

        //Create article in In Progress status
        ARTICLE_DATA_ASSIGNTOGROUP.title = title + "_In Progress";
        let knowledgeArticleData13 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOGROUP);
        knowledgeId.push(knowledgeArticleData13.displayId);

        //Create article in In Progress status
        ARTICLE_DATA_ASSIGNTOANOTHERUSER.title = title + "_In Progress";
        let knowledgeArticleData14 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOANOTHERUSER);
        knowledgeId.push(knowledgeArticleData14.displayId);

        await utilGrid.applyPresetFilter('My Open Articles');
        expect(await utilGrid.getAppliedFilterName()).toBe('My Open Articles');

        for (let i: number = 0; i < 6; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }

        for (let i: number = 6; i < 14; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();
        for (let i: number = 0; i < 14; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    }, 600 * 1000);

    it('[DRDMV-20890]: Validate the All Published Articles filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        ARTICLE_DATA_ASSIGNTOME.knowledgeSet = knowledgeSetTitle;
        ARTICLE_DATA_ASSIGNTOGROUP.knowledgeSet = knowledgeSetTitle;
        ARTICLE_DATA_ASSIGNTOANOTHERUSER.knowledgeSet = knowledgeSetTitle;

        //Create article in In Progress status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_In Progress";
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        knowledgeId.push(knowledgeArticleData1.displayId);

        //Create article in Draft status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Draft";
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        knowledgeId.push(knowledgeArticleData2.displayId);

        //Create article in Cancel Approval status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Cancel Approval";
        let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'CancelApproval');
        knowledgeId.push(knowledgeArticleData3.displayId);

        //Create article in Cancel status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Cancel";
        let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'CancelApproval');
        await apiHelper.approverAction(knowledgeArticleData4.id, 'Approved');
        knowledgeId.push(knowledgeArticleData4.displayId);

        //Create article in SME Review status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_SME Review";
        let knowledgeArticleData5 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'SMEReview', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        knowledgeId.push(knowledgeArticleData5.displayId);

        //Create article in Publish Approval status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Publish Approval";
        let knowledgeArticleData6 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        knowledgeId.push(knowledgeArticleData6.displayId);

        //Create article in BeforePublished(Custom status 1) status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Before Published";
        let knowledgeArticleData7 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'SMEReview', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'BeforePublished');
        knowledgeId.push(knowledgeArticleData7.displayId);

        //Create article in Closed status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Closed";
        let knowledgeArticleData9 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'AfterPublished');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'RetireApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Retired');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Closed');
        knowledgeId.push(knowledgeArticleData9.displayId);

        //Create article in After Published status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_After Published";
        let knowledgeArticleData10 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData10.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'Published');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'AfterPublished');
        knowledgeId.push(knowledgeArticleData10.displayId);

        //Create article in Retire Approval status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Retire Approval";
        let knowledgeArticleData11 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData11.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'AfterPublished');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'RetireApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        knowledgeId.push(knowledgeArticleData11.displayId);

        //Create article in Retired status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Retired";
        let knowledgeArticleData12 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'AfterPublished');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'RetireApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'Retired');
        knowledgeId.push(knowledgeArticleData12.displayId);

        //Create article in Published status and mark it as External
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Published";
        let knowledgeArticleData13 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData13.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData13.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData13.id, 'Approved');
        knowledgeId.push(knowledgeArticleData13.displayId);

        //Create article in Published status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Published";
        let knowledgeArticleData8 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData8.id, 'Approved');
        knowledgeId.push(knowledgeArticleData8.displayId);

        await apiHelper.updateKnowledgeArticleExternalFlag(knowledgeArticleData13.id, true);

        await utilGrid.applyPresetFilter('All Published Articles');
        expect(await utilGrid.getAppliedFilterName()).toBe('All Published Articles');

        for (let i: number = 11; i < 13; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }

        for (let i: number = 0; i < 11; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();
        for (let i: number = 0; i < 13; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    }, 200 * 100);

    it('[DRDMV-20893]: Validate the All Externally Published Articles filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        ARTICLE_DATA_ASSIGNTOME.knowledgeSet = knowledgeSetTitle;

        //Create article in Published status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Published";
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData2.id, 'Approved');
        knowledgeId.push(knowledgeArticleData2.displayId);

        //Create article in Published status
        ARTICLE_DATA_ASSIGNTOME.title = title + "_Published";
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(ARTICLE_DATA_ASSIGNTOME);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval', 'idphylumkuser', 'Phylum Support Group1', 'Phylum');
        await apiHelper.approverAction(knowledgeArticleData1.id, 'Approved');
        knowledgeId.push(knowledgeArticleData1.displayId);

        await apiHelper.updateKnowledgeArticleExternalFlag(knowledgeArticleData2.id, true);

        await utilGrid.applyPresetFilter('All Externally Published Articles');
        expect(await utilGrid.getAppliedFilterName()).toBe('All Externally Published Articles');

        expect(await utilGrid.isGridRecordPresent(knowledgeId[1])).toBeTruthy(knowledgeId[1] + ' :Record is not available');
        expect(await utilGrid.isGridRecordPresent(knowledgeId[2])).toBeFalsy(knowledgeId[2] + ' :Record is available');

        await utilGrid.clearFilter();
        for (let i: number = 0; i < 2; i++) {
            expect(await utilGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    }, 150 * 1000);
})