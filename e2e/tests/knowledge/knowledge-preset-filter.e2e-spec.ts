import { cloneDeep } from 'lodash';
import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { ARTICLE_DATA_ASSIGNTOANOTHERUSER, ARTICLE_DATA_ASSIGNTOGROUP, ARTICLE_DATA_ASSIGNTOME, KNOWLEDGE_APPROVAL_FLOW_DATA, KNOWLEDGE_APPROVAL_MAPPING_DATA, KNOWLEDGE_SET_DATA } from "../../data/ui/case/presetFilter.data.ui";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfigPO from "../../pageobject/settings/common/status-config.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import dbConnectObj from '../../utils/utility.db-connect';
import utilityGrid from "../../utils/utility.grid";

describe('Knowledge Console Preset Filter', () => {
    let userIdKnowledgeCoach = "rflanagan";
    let passwordKnowledgeCoach = "Password_1234";
    let knowledgeSetTitle = undefined;
    let knowledgeModule = 'Knowledge';

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);

        //Create the Phylum users
        await apiHelper.apiLogin('tadmin');
        // const personDataFile = require('../../data/ui/foundation/person.ui.json');
        // let personData1 = personDataFile['PhylumKnowledgeUser1'];
        // await apiHelper.createNewUser(personData1);
        // await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        // await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');

        // let personData2 = personDataFile['PhylumKnowledgeUser2'];
        // await apiHelper.createNewUser(personData2);
        // await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Phylum Support Group1');
        // await apiHelper.associatePersonToCompany(personData2.userId, 'Phylum');

        //Create Knowledge Configuraton
        const randomStr = [...Array(2)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        knowledgeSetTitle = KNOWLEDGE_SET_DATA.knowledgeSetTitle + randomStr;

        KNOWLEDGE_SET_DATA.knowledgeSetTitle = knowledgeSetTitle;
        await apiHelper.createKnowledgeSet(KNOWLEDGE_SET_DATA);

        let approvalConfigGlobalTitle = KNOWLEDGE_APPROVAL_FLOW_DATA.flowName + randomStr;
        KNOWLEDGE_APPROVAL_FLOW_DATA.flowName = approvalConfigGlobalTitle;
        await apiHelper.createApprovalFlow(KNOWLEDGE_APPROVAL_FLOW_DATA, knowledgeModule);
        await apiHelper.deleteApprovalMapping(knowledgeModule);
        await apiHelper.createApprovalMapping(knowledgeModule, KNOWLEDGE_APPROVAL_MAPPING_DATA);
        //Update the sleep time to 9000 later
        //await browser.sleep(20000); //New user is created above, waiting for its backend access preperation
        await loginPage.login(userIdKnowledgeCoach, passwordKnowledgeCoach);
        try {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Knowledge Management--Status Configuration', BWF_PAGE_TITLES.KNOWLEDGE_MANAGEMENT.STATUS_CONFIGURATION);
            await statusConfigPO.setCompanyDropdown('Phylum', 'knowledge');
            await statusConfigPO.clickEditLifeCycleLink();
            await statusConfigPO.addCustomStatus('SME Review', 'Publish Approval', 'BeforePublished');
            await statusConfigPO.addCustomStatus('Published', 'Retire Approval', 'AfterPublished');
        }
        catch (ex) { throw ex; }
        finally { await utilityCommon.switchToDefaultWindowClosingOtherTabs(); }
        await navigationPage.gotoKnowledgeConsole();
    });

    afterAll(async () => {
        await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    describe('[3664]: Validate the My Open Articles filter after applying and removing the filter', async () => {
        let title = 'KnowledgeArticle';
        let knowledgeId: string[] = [];
        it('[3664]: Article data creation with multiple status 1', async () => {
            await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);

            let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
            let assignToGrpVar = cloneDeep(ARTICLE_DATA_ASSIGNTOGROUP);
            let assignToAnotherUserVar = cloneDeep(ARTICLE_DATA_ASSIGNTOANOTHERUSER);
            assignToMeVar.knowledgeSet = knowledgeSetTitle;
            assignToGrpVar.knowledgeSet = knowledgeSetTitle;
            assignToAnotherUserVar.knowledgeSet = knowledgeSetTitle;

            //Create article in In Progress status
            assignToGrpVar.title = title + "_In Progress";
            let knowledgeArticleData13 = await apiHelper.createKnowledgeArticle(assignToGrpVar);

            //Create article in In Progress status
            assignToMeVar.title = title + "_In Progress";
            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            knowledgeId.push(knowledgeArticleData1.displayId);

            //Create article in Draft status
            assignToMeVar.title = title + "_Draft";
            let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
            knowledgeId.push(knowledgeArticleData2.displayId);

            //Create article in SME Review status
            assignToMeVar.title = title + "_SME Review";
            let knowledgeArticleData5 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'SMEReview', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData5.displayId);

            //Create article in Publish Approval status
            assignToMeVar.title = title + "_Publish Approval";
            let knowledgeArticleData6 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData6.displayId);

            //Create article in BeforePublished(Custom status 1) status
            assignToMeVar.title = title + "_Before Published";
            let knowledgeArticleData7 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'SMEReview', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'BeforePublished');
            knowledgeId.push(knowledgeArticleData7.displayId);

            //Create article in Cancel Approval status
            assignToMeVar.title = title + "_Cancel Approval";
            let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'CancelApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData3.displayId);

            //Create article in Cancel status
            assignToMeVar.title = title + "_Cancel";
            let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'CancelApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData4.id, 'Approved');
            knowledgeId.push(knowledgeArticleData4.displayId);

            //Create article in Published status
            assignToMeVar.title = title + "_Published";
            let knowledgeArticleData8 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData8.id, 'Approved');
            knowledgeId.push(knowledgeArticleData8.displayId);

            knowledgeId.push(knowledgeArticleData13.displayId);
        });
        it('[3664]: Article data creation with multiple status 2', async () => {
            let assignToMe = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
            assignToMe.knowledgeSet = knowledgeSetTitle;

            //Create article in Closed status
            assignToMe.title = title + "_Closed";
            let knowledgeArticleData9 = await apiHelper.createKnowledgeArticle(assignToMe);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
            await browser.sleep(5000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'AfterPublished');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'RetireApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
            await browser.sleep(5000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Closed');
            knowledgeId.push(knowledgeArticleData9.displayId);

            //Create article in After Published status
            assignToMe.title = title + "_After Published";
            let knowledgeArticleData10 = await apiHelper.createKnowledgeArticle(assignToMe);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData10.id, 'Approved');
            await browser.sleep(10000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'AfterPublished');
            knowledgeId.push(knowledgeArticleData10.displayId);
        });
        it('[3664]: Article data creation with multiple status 3', async () => {
            let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
            let assignToAnotherUserVar = cloneDeep(ARTICLE_DATA_ASSIGNTOANOTHERUSER);
            assignToMeVar.knowledgeSet = knowledgeSetTitle;
            assignToAnotherUserVar.knowledgeSet = knowledgeSetTitle;

            //Create article in Retire Approval status
            assignToMeVar.title = title + "_Retire Approval";
            let knowledgeArticleData11 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData11.id, 'Approved');
            await browser.sleep(5000);  //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'AfterPublished');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'RetireApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData11.displayId);

            //Create article in Retired status
            assignToMeVar.title = title + "_Retired";
            let knowledgeArticleData12 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
            await browser.sleep(5000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'AfterPublished');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'RetireApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
            knowledgeId.push(knowledgeArticleData12.displayId);

            //Create article in In Progress status
            assignToAnotherUserVar.title = title + "_In Progress";
            let knowledgeArticleData14 = await apiHelper.createKnowledgeArticle(assignToAnotherUserVar);
            knowledgeId.push(knowledgeArticleData14.displayId);
        });
        it('[3664]: Validate the My Open Articles filter after applying and removing the filter', async () => {
            await utilityGrid.applyPresetFilter('My Open Articles');
            let openArticle: string[] = ['My Open Articles'];
            expect(await utilityGrid.isAppliedFilterMatches(openArticle)).toBeTruthy();

            for (let i: number = 0; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 5; i < 10; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
            }
        });
        it('[3664]: Validate the My Open Articles filter after applying and removing the filter', async () => {
            for (let i: number = 10; i < 14; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
            }
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 14; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
        });
    });

    describe('[3666]: Validate the All Published Articles filter after applying and removing the filter', async () => {
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';

        it('[3666]: Article data creation for different status 1', async () => {
            let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
            let assignToGrpVar = cloneDeep(ARTICLE_DATA_ASSIGNTOGROUP);
            let assignToAnotherUserVar = cloneDeep(ARTICLE_DATA_ASSIGNTOANOTHERUSER);

            await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
            assignToMeVar.knowledgeSet = knowledgeSetTitle;
            assignToGrpVar.knowledgeSet = knowledgeSetTitle;
            assignToAnotherUserVar.knowledgeSet = knowledgeSetTitle;

            //Create article in In Progress status
            assignToMeVar.title = title + "_In Progress";
            let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            knowledgeId.push(knowledgeArticleData1.displayId);

            //Create article in Draft status
            assignToMeVar.title = title + "_Draft";
            let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
            knowledgeId.push(knowledgeArticleData2.displayId);

            //Create article in Cancel Approval status
            assignToMeVar.title = title + "_Cancel Approval";
            let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'CancelApproval');
            knowledgeId.push(knowledgeArticleData3.displayId);

            //Create article in Cancel status
            assignToMeVar.title = title + "_Cancel";
            let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'CancelApproval');
            await apiHelper.approverAction(knowledgeArticleData4.id, 'Approved');
            knowledgeId.push(knowledgeArticleData4.displayId);

            //Create article in SME Review status
            assignToMeVar.title = title + "_SME Review";
            let knowledgeArticleData5 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData5.id, 'SMEReview', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData5.displayId);

            //Create article in Publish Approval status
            assignToMeVar.title = title + "_Publish Approval";
            let knowledgeArticleData6 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData6.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData6.displayId);

            //Create article in BeforePublished(Custom status 1) status
            assignToMeVar.title = title + "_Before Published";
            let knowledgeArticleData7 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'SMEReview', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData7.id, 'BeforePublished');
            knowledgeId.push(knowledgeArticleData7.displayId);

            //Create article in Closed status
            assignToMeVar.title = title + "_Closed";
            let knowledgeArticleData9 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
            await browser.sleep(10000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'AfterPublished');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'RetireApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData9.id, 'Approved');
            await browser.sleep(5000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData9.id, 'Closed');
            knowledgeId.push(knowledgeArticleData9.displayId);
        });

        it('[3666]: Article data creation for different status 2', async () => {
            let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
            assignToMeVar.knowledgeSet = knowledgeSetTitle;

            //Create article in After Published status
            assignToMeVar.title = title + "_After Published";
            let knowledgeArticleData10 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData10.id, 'Approved');
            await browser.sleep(5000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData10.id, 'AfterPublished');
            knowledgeId.push(knowledgeArticleData10.displayId);

            //Create article in Retire Approval status
            assignToMeVar.title = title + "_Retire Approval";
            let knowledgeArticleData11 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData11.id, 'Approved');
            await browser.sleep(10000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'AfterPublished');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData11.id, 'RetireApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            knowledgeId.push(knowledgeArticleData11.displayId);
        });

        it('[3666]: Article data creation for different status 3', async () => {
            let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
            assignToMeVar.knowledgeSet = knowledgeSetTitle;

            //Create article in Retired status
            assignToMeVar.title = title + "_Retired";
            let knowledgeArticleData12 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
            await browser.sleep(10000); //API takes time to Approve the status
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'AfterPublished');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData12.id, 'RetireApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData12.id, 'Approved');
            await browser.sleep(5000); //API takes time to Approve the status
            knowledgeId.push(knowledgeArticleData12.displayId);

            //Create article in Published status and mark it as External
            assignToMeVar.title = title + "_Published";
            await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
            let knowledgeArticleData13 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData13.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData13.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData13.id, 'Approved');
            knowledgeId.push(knowledgeArticleData13.displayId);

            //Create article in Published status
            assignToMeVar.title = title + "_Published";
            await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
            let knowledgeArticleData8 = await apiHelper.createKnowledgeArticle(assignToMeVar);
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'Draft');
            await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData8.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
            await apiHelper.approverAction(knowledgeArticleData8.id, 'Approved');
            knowledgeId.push(knowledgeArticleData8.displayId);

            await apiHelper.updateKnowledgeArticleExternalFlag(knowledgeArticleData13.id, true);
        });

        it('[3666]: Validate the All Published Articles filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.applyPresetFilter('All Published Articles');
            let allPublishedArticle: string[] = ['All Published Articles'];
            expect(await utilityGrid.isAppliedFilterMatches(allPublishedArticle)).toBeTruthy();

            for (let i: number = 11; i < 13; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
            for (let i: number = 0; i < 6; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
            }
        });
        it('[3666]: Validate the All Published Articles filter after applying and removing the filter', async () => {
            for (let i: number = 6; i < 11; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
            }
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 13; i++) {
                expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
            }
        });
    });

    it('[3665]: Validate the All Externally Published Articles filter after applying and removing the filter', async () => {
        let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        assignToMeVar.knowledgeSet = knowledgeSetTitle;

        //Create article in Published status
        assignToMeVar.title = title + "_Published";
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
        try { await apiHelper.approverAction(knowledgeArticleData2.id, 'Approved'); }
        catch (ex) { console.log("Already in published status"); }
        knowledgeId.push(knowledgeArticleData2.displayId);

        //Create article in Published status
        assignToMeVar.title = title + "_Published";
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
        try { await apiHelper.approverAction(knowledgeArticleData1.id, 'Approved'); }
        catch (ex) { console.log("Already in published status"); }
        knowledgeId.push(knowledgeArticleData1.displayId);

        await apiHelper.updateKnowledgeArticleExternalFlag(knowledgeArticleData2.id, true);

        await utilityGrid.applyPresetFilter('All Externally Published Articles');
        let externalPublishedArticle: string[] = ['All Externally Published Articles'];
        expect(await utilityGrid.isAppliedFilterMatches(externalPublishedArticle)).toBeTruthy();

        expect(await utilityGrid.isGridRecordPresent(knowledgeId[0])).toBeTruthy(knowledgeId[0] + ' :Record is not available');
        expect(await utilityGrid.isGridRecordPresent(knowledgeId[1])).toBeFalsy(knowledgeId[1] + ' :Record is available');

        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    });

    it('[3663]: Validate the All Articles In Last 1 month filter after applying and removing the filter', async () => {
        let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);

        let dbConnectVar = await dbConnectObj.dbConnect();
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        assignToMeVar.knowledgeSet = knowledgeSetTitle;

        //Create article in Draft status and update the created date below 1 month
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
        let displayId1 = knowledgeArticleData1.displayId;
        knowledgeId.push(displayId1);

        let dateForArticle1 = await utilityCommon.getOldDate(27);
        let dateEpochValueArticle1 = await dbConnectObj.dateEpochConverter(dateForArticle1);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle1}' WHERE c302300507 = '${displayId1}'`);

        //Create article in Published status and update the created date below 1 month
        assignToMeVar.title = title + "_Published";
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
        try { await apiHelper.approverAction(knowledgeArticleData2.id, 'Approved'); }
        catch (ex) { console.log("Already in published status"); }
        let displayId2 = knowledgeArticleData2.displayId;
        knowledgeId.push(displayId2);

        let dateForArticle2 = await utilityCommon.getOldDate(27);
        let dateEpochValueArticle2 = await dbConnectObj.dateEpochConverter(dateForArticle2);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle2}' WHERE c302300507 = '${displayId2}'`);

        //Create article in Draft status and update the created date above 1 month
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'Draft');
        let displayId3 = knowledgeArticleData3.displayId;
        knowledgeId.push(displayId3);

        let dateForArticle3 = await utilityCommon.getOldDate(33);
        let dateEpochValueArticle3 = await dbConnectObj.dateEpochConverter(dateForArticle3);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle3}' WHERE c302300507 = '${displayId3}'`);

        //Create article in Published status and update the created date below 1 month
        assignToMeVar.title = title + "_Published";
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'Draft');
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'PublishApproval', userIdKnowledgeCoach, 'Phylum Support Group1', 'Phylum');
        try { await apiHelper.approverAction(knowledgeArticleData4.id, 'Approved'); }
        catch (ex) { console.log("Already in published status"); }
        let displayId4 = knowledgeArticleData4.displayId;
        knowledgeId.push(displayId4);

        let dateForArticle4 = await utilityCommon.getOldDate(32);
        let dateEpochValueArticle4 = await dbConnectObj.dateEpochConverter(dateForArticle4);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle4}' WHERE c302300507 = '${displayId4}'`);

        await utilityGrid.applyPresetFilter('All Articles In Last 1 month');
        let allTaskFilter: string[] = ['All Articles In Last 1 month'];
        expect(await utilityGrid.isAppliedFilterMatches(allTaskFilter)).toBeTruthy();

        for (let i = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
        for (let i = 2; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeFalsy(knowledgeId[i] + ' :Record is available');
        }
        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    });

    it('[3660]: Validate the All Articles In Last 3 months filter after applying and removing the filter	', async () => {
        let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);

        let dbConnectVar = await dbConnectObj.dbConnect();
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        assignToMeVar.knowledgeSet = knowledgeSetTitle;

        //Create article with the created date below 1 month
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
        let displayId1 = knowledgeArticleData1.displayId;
        knowledgeId.push(displayId1);

        let dateForArticle1 = await utilityCommon.getOldDate(27);
        let dateEpochValueArticle1 = await dbConnectObj.dateEpochConverter(dateForArticle1);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle1}' WHERE c302300507 = '${displayId1}'`);

        //Create article with the created date above 1 month and below 3 months
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        let displayId2 = knowledgeArticleData2.displayId;
        knowledgeId.push(displayId2);

        let dateForArticle2 = await utilityCommon.getOldDate(80);
        let dateEpochValueArticle2 = await dbConnectObj.dateEpochConverter(dateForArticle2);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle2}' WHERE c302300507 = '${displayId2}'`);

        //Create article with the created date above 3 months
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'Draft');
        let displayId3 = knowledgeArticleData3.displayId;
        knowledgeId.push(displayId3);

        let dateForArticle3 = await utilityCommon.getOldDate(93);
        let dateEpochValueArticle3 = await dbConnectObj.dateEpochConverter(dateForArticle3);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle3}' WHERE c302300507 = '${displayId3}'`);
        await navigationPage.gotoCaseConsole();
        await navigationPage.switchToApplication('Knowledge Management');
        await utilityGrid.clearFilter();
        await utilityGrid.applyPresetFilter('All Articles In Last 3 months');
        let allTaskFilter: string[] = ['All Articles In Last 3 months'];
        expect(await utilityGrid.isAppliedFilterMatches(allTaskFilter)).toBeTruthy();
        for (let i = 0; i < 2; i++) {
            await browser.sleep(1000);// required in loop search
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }

        expect(await utilityGrid.isGridRecordPresent(knowledgeId[2])).toBeFalsy(knowledgeId[2] + ' :Record is available');
        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 3; i++) {
            await browser.sleep(500);// required in loop search
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    });

    it('[3515]: Validate the All Articles In Last 6 months filter after applying and removing the filter	', async () => {
        let assignToMeVar = cloneDeep(ARTICLE_DATA_ASSIGNTOME);

        let dbConnectVar = await dbConnectObj.dbConnect();
        await apiHelper.apiLogin(userIdKnowledgeCoach, passwordKnowledgeCoach);
        let knowledgeId: string[] = [];
        let title = 'KnowledgeArticle';
        assignToMeVar.knowledgeSet = knowledgeSetTitle;

        //Create article with the created date below 1 month
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData1 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData1.id, 'Draft');
        let displayId1 = knowledgeArticleData1.displayId;
        knowledgeId.push(displayId1);

        let dateForArticle1 = await utilityCommon.getOldDate(27);
        let dateEpochValueArticle1 = await dbConnectObj.dateEpochConverter(dateForArticle1);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle1}' WHERE c302300507 = '${displayId1}'`);

        //Create article with the created date above 1 month and below 3 months
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData2 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData2.id, 'Draft');
        let displayId2 = knowledgeArticleData2.displayId;
        knowledgeId.push(displayId2);

        let dateForArticle2 = await utilityCommon.getOldDate(80);
        let dateEpochValueArticle2 = await dbConnectObj.dateEpochConverter(dateForArticle2);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle2}' WHERE c302300507 = '${displayId2}'`);

        //Create article with the created date above 3 months and below 6 months
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData3 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData3.id, 'Draft');
        let displayId3 = knowledgeArticleData3.displayId;
        knowledgeId.push(displayId3);

        let dateForArticle3 = await utilityCommon.getOldDate(150);
        let dateEpochValueArticle3 = await dbConnectObj.dateEpochConverter(dateForArticle3);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle3}' WHERE c302300507 = '${displayId3}'`);

        //Create article with the created date above 3 months and below 6 months
        assignToMeVar.title = title + "_Draft";
        let knowledgeArticleData4 = await apiHelper.createKnowledgeArticle(assignToMeVar);
        await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData4.id, 'Draft');
        let displayId4 = knowledgeArticleData4.displayId;
        knowledgeId.push(displayId4);

        let dateForArticle4 = await utilityCommon.getOldDate(200);
        let dateEpochValueArticle4 = await dbConnectObj.dateEpochConverter(dateForArticle4);
        await dbConnectVar.query(`UPDATE t4326 SET c3 = '${dateEpochValueArticle4}' WHERE c302300507 = '${displayId4}'`);
        await utilityGrid.clearFilter();
        await utilityGrid.applyPresetFilter('All Articles In Last 6 months');
        let allTaskFilter: string[] = ['All Articles In Last 6 months'];
        expect(await utilityGrid.isAppliedFilterMatches(allTaskFilter)).toBeTruthy();

        for (let i = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }

        expect(await utilityGrid.isGridRecordPresent(knowledgeId[3])).toBeFalsy(knowledgeId[3] + ' :Record is available');
        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(knowledgeId[i])).toBeTruthy(knowledgeId[i] + ' :Record is not available');
        }
    });
});
