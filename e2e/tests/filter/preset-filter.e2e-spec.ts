import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import knowledgeConsolePo from '../../pageobject/knowledge/knowledge-articles-console.po';
import taskConsolePo from '../../pageobject/task/console-task.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Preset Filter Funcational Verification', () => {
    let randomStr1 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseAgentuserData;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad-KA not visible on Console defect
    describe('[12086]: Verify Preset Filter Retain Same After Logout And Login In', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let taskId;
        let knowledgeArticleData;
        let knowledgeTitle = 'knowledgeTitle' + randomStr;

        beforeAll(async () => {
            //  Create Case
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23413" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng" 
            }

            await apiHelper.apiLogin('qfeng'); 
            newCase = await apiHelper.createCase(caseData1);

            let articleData = {
                "knowledgeSet": "HR",
                "title": "KATitle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 3",
                "assignee": "qfeng"  //"assignee": caseAgentUserId
            }
            articleData.title = knowledgeTitle;
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);

            // login in with created user.
            await navigationPage.signOut();
            await loginPage.login('qfeng'); 
        });
        it('[12086]: Goto Case console and clear filter from case task and knowledge', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await navigationPage.gotoTaskConsole();
            await utilityGrid.clearFilter();
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await navigationPage.signOut();
            await loginPage.login('qfeng'); 
        });

        it('[12086]: Verify default preset filter on case console', async () => {
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Cases'])).toBeTruthy('My Open Cases is missing');
            await utilityGrid.searchRecord(newCase.displayId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });

        it('[12086]: Add task in case', async () => {
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary('adhocTaskSummary');
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink('adhocTaskSummary');
            taskId = await viewTaskPo.getTaskID();
            await navigationPage.gotoTaskConsole();
        });

        it('[12086]: Verify default preset filter on task console', async () => {
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Tasks'])).toBeTruthy('My Open Tasks is missing');
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(taskId, " Task ID NOT displayed in Task console");
        });

        it('[12086]: Verify default preset filter on knowledge console', async () => {
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Articles'])).toBeTruthy('My Open Articles is missing');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
        });
        it('[12086]: Verify retain same case filter after logout and login in', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng'); 
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Cases'])).toBeTruthy('My Open Cases is missing');

            await utilityGrid.searchRecord(newCase.displayId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });
        it('[12086]: Verify retain same task filter after logout and login in', async () => {
            await navigationPage.gotoTaskConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Tasks'])).toBeTruthy('My Open Tasks is missing');
            await utilityGrid.searchRecord(taskId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(taskId, " Task ID NOT displayed in Task console");
        });
        it('[12086]: Verify retain same article filter after logout and login in', async () => {
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Articles'])).toBeTruthy('My Open Tasks is missing');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
        });
        it('[12086]: Clear Filter with logout login in and verify same filter again able to applied or not', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await navigationPage.signOut();
            await loginPage.login('qfeng'); 
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Articles'])).toBeTruthy('My Open Tasks is missing');

            await utilityGrid.applyPresetFilter('My Open Articles');
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Articles'])).toBeTruthy('My Open Tasks is missing');
            await utilityGrid.searchRecord(knowledgeArticleData.displayId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityGrid.clearFilter();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //kgaikwad
    describe('[12085]: Verify custom preset filter permission and add new dynamic filter in already saved applied filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;
        let filtername2 = 'filtername2' + randomStr;

        beforeAll(async () => {
            //  Create Case
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23413" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData1);
        });

        it('[12085]: Add filter on already applied filter', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Case ID", newCase.displayId, "default");
            let openArticle: string[] = [`Case ID: ${newCase.displayId}`];
            expect(await utilityGrid.isAppliedFilterMatches(openArticle)).toBeTruthy();
            await utilityGrid.saveFilter(filtername1);
            let openArticle1: string[] = [`Case ID: ${newCase.displayId}`];
            expect(await utilityGrid.isAppliedFilterMatches(openArticle1)).toBeTruthy();
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");

            await utilityGrid.addFilter("Requester", 'Qiang Du', "default");
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');

            await utilityGrid.saveFilter(filtername2);
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Requester: Qiang Du'])).toBeTruthy('Requester: Qiang Du Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });

        it('[12085]: Verify permission of custom preset filter', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername2)).toBeFalsy('FailureMsg: Preset filter is displayed');
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername2)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityGrid.clearFilter();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad-KA not visible on Console defect
    describe('[12084]: Verify Functionality Of Delete Custom Preset Filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let newCase2;
        let adhoctaskId;
        let knowledgeArticleData;
        let knowledgeTitle = 'knowledgeTitle' + randomStr;
        let filtername1 = 'filtername1' + randomStr;
        let filtername2 = 'filtername2' + randomStr;

        beforeAll(async () => {
            //  Create Case
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Summary DRDMV23485" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData1);

            //Knowledge Article
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KATitle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 3",
                "assignee": "qkatawazi"
            }
            articleData.title = knowledgeTitle;
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            // Create case with user
            await apiHelper.apiLogin('qdu');
            caseData1.Requester = 'qtao'
            newCase2 = await apiHelper.createCase(caseData1);
        });

        it('[12084]: Custom filter should retain on case console after delete custom preset filter', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.clickRefreshIcon();

            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, `Case ID: ${newCase.displayId}`])).toBeTruthy('Requester: Qiang Du, Summary Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
            await utilityGrid.deleteCustomPresetFilter(filtername1);
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, `Case ID: ${newCase.displayId}`])).toBeTruthy('Requester: Qiang Du, Summary Missing filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
        });

        it('[12084]: Add adhoc task', async () => {
            await caseConsolePo.clickFirstLinkInCaseSearchGrid();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary(`Summary DRDMV23485${randomStr}`);
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink(`Summary DRDMV23485${randomStr}`);
            adhoctaskId = await viewTaskPo.getTaskID();
            await navigationPage.gotoTaskConsole();
        });

        it('[12084]: Custom filter should retain on task console after delete custom preset filter', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Status', 'Staged', "default");

            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, 'Status: Staged'])).toBeTruthy('Summary, Status: Staged Missing filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(adhoctaskId, " adhoctaskId NOT displayed in task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " task Summary NOT displayed in case console");

            await utilityGrid.deleteCustomPresetFilter(filtername1);
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, 'Status: Staged'])).toBeTruthy('Summary, Status: Staged Missing filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(adhoctaskId, " adhoctaskId NOT displayed in task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Status')).toBe(`Staged`, " Status NOT displayed on task console");
        });

        it('[12084]: Custom filter should retain on knowledge article console after delete custom preset filter', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Knowledge Set", 'HR', "default");
            await utilityGrid.addFilter('Modified By', 'qkatawazi', "default");
            await utilityGrid.addFilter('Article ID', knowledgeArticleData.displayId, "default");

            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches(['Knowledge Set: HR', 'Modified By: qkatawazi', `Article ID: ${knowledgeArticleData.displayId}`])).toBeTruthy('Knowledge Set, Modified By Article ID Missing from applied filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " knowledgeArticleData.displayId NOT displayed in knowledge article console");

            await utilityGrid.deleteCustomPresetFilter(filtername1);
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isAppliedFilterMatches(['Knowledge Set: HR', 'Modified By: qkatawazi', `Article ID: ${knowledgeArticleData.displayId}`])).toBeTruthy('Knowledge Set, Modified By Article ID Missing from applied filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " knowledgeArticleData.displayId NOT displayed in knowledge article console");
        });

        it('[12084]: Case Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, `Case ID: ${newCase.displayId}`])).toBeTruthy('Summary, Case ID By Article ID Missing from applied filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
            await utilityGrid.clearFilter();
        });

        it('[12084]: Task Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.gotoTaskConsole();
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, `Status: Staged`])).toBeTruthy('Summary, Status By Article ID Missing from applied filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(adhoctaskId, " adhoctaskId NOT displayed in task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " task Summary NOT displayed in case console");
            await utilityGrid.clearFilter();
        });

        it('[12084]: Knowledge Aeticle Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect(await utilityGrid.isAppliedFilterMatches(['Knowledge Set: HR', 'Modified By: qkatawazi', `Article ID: ${knowledgeArticleData.displayId}`])).toBeTruthy('Knowledge Set, Modified By Article ID Missing from applied filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " knowledgeArticleData.displayId NOT displayed in knowledge article console");
            await utilityGrid.clearFilter();
        });

        it('[12084]: Try adding the same filter with same qualification but with different users.', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Company', 'Petramco', "default");
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");

            await utilityGrid.saveFilter(filtername2);
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, `Company: Petramco`, `Case ID: ${newCase.displayId}`])).toBeTruthy('Requester: Qiang Du, Company, Summary Missing filter name');

            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
            await utilityGrid.clearFilter();
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "text");
            await utilityGrid.addFilter('Company', 'Petramco', "text");
            await utilityGrid.addFilter('Case ID', newCase2.displayId, "text");

            await utilityGrid.saveFilter(filtername2);
            expect(await utilityGrid.isAppliedFilterMatches([`Summary: Summary DRDMV23485${randomStr}`, 'Company: Petramco', `Case ID: ${newCase2.displayId}`])).toBeTruthy('Requester: Qiang Du, Company, Summary Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase2.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await utilityGrid.clearFilter();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //kgaikwad
    describe('[12081]: Verify update preset filter and also verify duplicate preset filter name', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;

        beforeAll(async () => {
            //  Create Case
            let caseData1 = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23489" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData1);
        });

        it('[12081]: Update custom preset filter with adding more qualifications', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");

            await utilityGrid.updateCustomPresetFilter('Assignee', 'Qadim Katawazi', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Requester', 'Qiang Du', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Summary', `Test case for DRDMV23489${randomStr}`, 'default', filtername1);

            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Requester: Qiang Du', `Summary: Test case for DRDMV23489${randomStr}`, 'Assignee: Qadim Katawazi'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");

        });
        it('[12081]: Add multiple custom preset filter with same name', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter("Case ID", newCase.displayId, "default");
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`])).toBeTruthy('Applied filter is missing');

            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isPresetFilterNameDisplayed(`${filtername1}-2`)).toBeTruthy('FailureMsg: Preset filter is missing');

            await utilityGrid.addFilter("Assignee", 'Qadim Katawazi', 'default');
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isPresetFilterNameDisplayed(`${filtername1}-3`)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Assignee: Qadim Katawazi'])).toBeTruthy('Applied filter is missing');

            await utilityGrid.addFilter('Requester', 'Qiang Du', 'default');
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isPresetFilterNameDisplayed(`${filtername1}-4`)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Assignee: Qadim Katawazi', 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });

    //kgaikwad
    describe('[12080]: Duplicate preset filter name with different scenarios', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;
        let filtername2 = 'filtername2' + randomStr;
        let filtername3 = 'filtername3' + randomStr;

        beforeAll(async () => {
            //  Create Case
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23490" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
        });

        it('[12080]: Verify that users can create shared Preset filters and Custom Preset filters with the same name.', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.deleteCustomPresetFilter('My Open Cases');
            await utilityGrid.applyPresetFilter('My Open Cases');
            expect(await utilityGrid.isAppliedFilterMatches(['My Open Cases'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getCountPresetFilter('My Open Cases')).toEqual(1);
            expect(await utilityGrid.isPresetFilterNameDisplayed('My Open Cases')).toBeTruthy('My Open Cases preset filter is missing')

            await utilityGrid.searchRecord(newCase.displayId);
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.saveFilter('My Open Cases');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            expect(await utilityGrid.getCountPresetFilter('My Open Cases')).toEqual(2);
            await utilityGrid.clickRefreshIcon();
        });
        it('[12080]: Verify if a user updates the name of the existing filter', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);

            await utilityGrid.addFilter('Assignee', 'Qadim Katawazi', 'default');
            await utilityGrid.addFilter('Case ID\n(1 selected)', newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername2);
            await utilityGrid.updateCustomPresetFilter('Requester', 'Qiang Du', 'default', filtername2, "filterNew");
            await utilityGrid.updateCustomPresetFilter('Summary', `Test case for DRDMV23490${randomStr}`, 'default', "filterNew");

            expect(await utilityGrid.isPresetFilterNameDisplayed("filterNew")).toBeTruthy('FailureMsg: Preset filter is missing');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, `Summary: Test case for DRDMV23490${randomStr}`, 'Assignee: Qadim Katawazi', 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });

        it('[12080]: Verify user can update the new filter name and qualifications in existing custom preset filter.', async () => {
            await utilityGrid.updateCustomPresetFilter('Requester', 'Qiang Du', 'default', filtername1, filtername3);
            await utilityGrid.updateCustomPresetFilter('Assignee', 'Qadim Katawazi', 'default', filtername3);
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('filtername1 preset filter is displayed')
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername3)).toBeTruthy('filtername3 preset filter is missing')
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Assignee: Qadim Katawazi', 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            await utilityGrid.clearFilter();
        });
    });

    //kgaikwad
    describe('[12079]: Verify UI filters available on Case Task Knowledge Console	', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let adhoctaskId;
        let knowledgeArticleData;
        let knowledgeTitle = 'knowledgeTitle' + randomStr;
        let filtername1 = 'filtername1' + randomStr;
        let filtername2 = 'filtername2' + randomStr;

        beforeAll(async () => {
            //  Create Case
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23490" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
            // Create knowledge
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KATitle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 3",
                "assignee": "qkatawazi"
            }
            articleData.title = knowledgeTitle;
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[12079]: Verify all the Captions and Dynamic filters available on Case Console', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            await utilityGrid.clickOnFilterButton();

            await utilityGrid.clickOnFilterTab('Available ');

            expect(await caseConsolePo.isFieldLabelDisplayed('Applied filters')).toBeTruthy('Applied filter label is missing');
            expect(await utilityGrid.isAppliedFilterInputBoxDisplayedOnPresetFilter).toBeTruthy(`AppliedFilterInputBox is missing`);

            let dynamicFilterArr1: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr1.includes('Assigned Group')).toBeTruthy(`Assigned Group is missing`);
            expect(dynamicFilterArr1.includes('Assignee')).toBeTruthy(`Assignee  is missing`);
            expect(dynamicFilterArr1.includes('Assignee Login Name')).toBeTruthy(`Assignee Login Name is missing`);
            expect(dynamicFilterArr1.includes('Case ID')).toBeTruthy(`Case ID is missing`);
            expect(dynamicFilterArr1.includes('Case Site')).toBeTruthy(`Case Site is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 1')).toBeTruthy(`Category Tier 1 is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 2')).toBeTruthy(`Category Tier 2 is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 3')).toBeTruthy(`Category Tier 3 is missing`);
            expect(dynamicFilterArr1.includes('Company')).toBeTruthy(`Company is missing`);
            expect(dynamicFilterArr1.includes('Created Date')).toBeTruthy(`Created Date is missing`);
            expect(dynamicFilterArr1.includes('ID')).toBeTruthy(`ID is missing`);
            expect(dynamicFilterArr1.includes('Modified By')).toBeTruthy(`Modified By is missing`);
            expect(dynamicFilterArr1.includes('Modified Date')).toBeTruthy(`Modified Date is missing`);
            expect(dynamicFilterArr1.includes('Priority')).toBeTruthy(`Priority is missing`);
            expect(dynamicFilterArr1.includes('Region')).toBeTruthy(`Region is missing`);
            expect(dynamicFilterArr1.includes('Request ID')).toBeTruthy(`Request ID is missing`);
            expect(dynamicFilterArr1.includes('Requester')).toBeTruthy(`Requester is missing`);
            expect(dynamicFilterArr1.includes('SLM Status')).toBeTruthy(`SLM Status is missing`);
            expect(dynamicFilterArr1.includes('Source')).toBeTruthy(`Source is missing`);
            expect(dynamicFilterArr1.includes('Status Value')).toBeTruthy(`Status Value is missing`);
            expect(dynamicFilterArr1.includes('Summary')).toBeTruthy(`Summary is missing`);
            expect(dynamicFilterArr1.includes('Target Date')).toBeTruthy(`Target Date is missing`);

            await utilityGrid.clickOnFilterTab('Saved');
            expect(await caseConsolePo.isFieldLabelDisplayed('Created by me')).toBeTruthy('Created by me label is missing');
            expect(await caseConsolePo.isFieldLabelDisplayed('Shared with me')).toBeTruthy('Shared with me label is missing');

            await utilityGrid.clickRefreshIcon();
            expect(await utilityGrid.isPresetFilterNameDisplayed('My Open Cases')).toBeTruthy(`My Open Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('My Open Breached Cases')).toBeTruthy(`My Open Breached Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Unassigned Cases')).toBeTruthy(`All Unassigned Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('VIP Open Cases')).toBeTruthy(`VIP Open Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Open Breached Cases')).toBeTruthy(`All Open Breached Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Open Cases')).toBeTruthy(`All Open Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('Critical Priority Open Cases')).toBeTruthy(`Critical Priority Open Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('High Priority Open Cases')).toBeTruthy(`High Priority Open Cases is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Cases In Last 1 month')).toBeTruthy(`All Cases In Last 1 month is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Cases  In Last 3 months')).toBeTruthy(`All Cases  In Last 3 months is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Cases  In Last 6 months')).toBeTruthy(`All Cases  In Last 6 months is missing`);

            await utilityGrid.clickOnFilterButton();
            await utilityGrid.clickOnFilterTab('Saved');
            await utilityGrid.clickEditPresetFilterButton(filtername1);

            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Filter name(required)')).toBeTruthy('Filter name label is missing');
            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Applied filters(required)')).toBeTruthy('Applied filters label is missing');

            expect(await utilityGrid.getHeaderOnEditCustomPresetFilter()).toBe(`Edit: ${filtername1}`);

            let dynamicFilterArr2: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr2.includes('Assigned Group')).toBeTruthy(`Assigned Group is missing`);
            expect(dynamicFilterArr2.includes('Assignee')).toBeTruthy(`Assignee is missing`);
            expect(dynamicFilterArr2.includes('Assignee Login Name')).toBeTruthy(`Assignee Login Name is missing`);
            expect(dynamicFilterArr2.includes('Case ID')).toBeTruthy(`Case ID is missing`);
            expect(dynamicFilterArr2.includes('Case Site')).toBeTruthy(`Case Site is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 1')).toBeTruthy(`Category Tier 1 is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 2')).toBeTruthy(`Category Tier 2 is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 3')).toBeTruthy(`Category Tier 3 is missing`);
            expect(dynamicFilterArr2.includes('Company')).toBeTruthy(`Company is missing`);
            expect(dynamicFilterArr2.includes('Created Date')).toBeTruthy(`Created Date is missing`);
            expect(dynamicFilterArr2.includes('ID')).toBeTruthy(`ID is missing`);
            expect(dynamicFilterArr2.includes('Modified By')).toBeTruthy(`Modified By is missing`);
            expect(dynamicFilterArr2.includes('Modified Date')).toBeTruthy(`Modified Date is missing`);
            expect(dynamicFilterArr2.includes('Priority')).toBeTruthy(`Priority is missing`);
            expect(dynamicFilterArr2.includes('Region')).toBeTruthy(`Region is missing`);
            expect(dynamicFilterArr2.includes('Request ID')).toBeTruthy(`Request ID is missing`);
            expect(dynamicFilterArr2.includes('Requester')).toBeTruthy(`Requester is missing`);
            expect(dynamicFilterArr2.includes('SLM Status')).toBeTruthy(`SLM Status is missing`);
            expect(dynamicFilterArr2.includes('Source')).toBeTruthy(`Source is missing`);
            expect(dynamicFilterArr2.includes('Status Value')).toBeTruthy(`Status Value is missing`);
            expect(dynamicFilterArr2.includes('Summary')).toBeTruthy(`Summary is missing`);
            expect(dynamicFilterArr2.includes('Target Date')).toBeTruthy(`Target Date is missing`);

            await utilityGrid.clickBackButtonOnEditCustomPresetFilter();
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            await utilityGrid.clickEditFilterCancelButton();
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            expect(await utilityGrid.isAppliedFilterInputBoxDisplayedOnPresetFilter).toBeTruthy(`AppliedFilterInputBox is missing`);
            await utilityGrid.clickEditFilterCancelButton();
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.updateCustomPresetFilter('Requester', 'Qiang Du', 'default', filtername1, filtername2);
            await utilityGrid.deleteCustomPresetFilter(filtername1);
        });

        it('[12079]: Add adhoc task', async () => {
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("AdHocSummary" + randomStr);
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink("AdHocSummary" + randomStr);
            adhoctaskId = await viewTaskPo.getTaskID();
            await navigationPage.gotoTaskConsole();
        });

        it('[12079]: Verify all the Captions and Dynamic filters available on Task Console', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Task ID', adhoctaskId, "default");
            await utilityGrid.saveFilter(filtername1);
            await utilityGrid.clickOnFilterButton();

            await utilityGrid.clickOnFilterTab('Available ');
            expect(await taskConsolePo.isFieldLabelDisplayed('Applied filters')).toBeTruthy('Applied filter label is missing');
            expect(await utilityGrid.isAppliedFilterInputBoxDisplayedOnPresetFilter).toBeTruthy(`AppliedFilterInputBox is missing`);

            let dynamicFilterArr1: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr1.includes('Assigned Group')).toBeTruthy(`Assigned Group is missing`);
            expect(dynamicFilterArr1.includes('Assignee')).toBeTruthy(`Assignee  is missing`);
            expect(dynamicFilterArr1.includes('Assignee Login Name')).toBeTruthy(`Assignee Login Name is missing`);
            expect(dynamicFilterArr1.includes('Case ID')).toBeTruthy(`Case ID is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 1')).toBeTruthy(`Category Tier 1 is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 2')).toBeTruthy(`Category Tier 2 is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 3')).toBeTruthy(`Category Tier 3 is missing`);
            expect(dynamicFilterArr1.includes('Created Date')).toBeTruthy(`Created Date is missing`);
            expect(dynamicFilterArr1.includes('Label')).toBeTruthy(`Label is missing`);
            expect(dynamicFilterArr1.includes('Modified By')).toBeTruthy(`Modified By is missing`);
            expect(dynamicFilterArr1.includes('Modified Date')).toBeTruthy(`Modified Date is missing`);
            expect(dynamicFilterArr1.includes('Priority')).toBeTruthy(`Priority is missing`);
            expect(dynamicFilterArr1.includes('SLM Status')).toBeTruthy(`SLM Status is missing`);
            expect(dynamicFilterArr1.includes('Status')).toBeTruthy(`Status is missing`);
            expect(dynamicFilterArr1.includes('Status Value')).toBeTruthy(`Status Value is missing`);
            expect(dynamicFilterArr1.includes('Summary')).toBeTruthy(`Summary is missing`);
            expect(dynamicFilterArr1.includes('Target Date')).toBeTruthy(`Target Date is missing`);
            expect(dynamicFilterArr1.includes('Task ID')).toBeTruthy(`Task ID is missing`);
            expect(dynamicFilterArr1.includes('Task Type')).toBeTruthy(`Task Type is missing`);

            await utilityGrid.clickOnFilterTab('Saved');
            expect(await taskConsolePo.isFieldLabelDisplayed('Created by me')).toBeTruthy('Created by me label is missing');
            expect(await taskConsolePo.isFieldLabelDisplayed('Shared with me')).toBeTruthy('Shared with me label is missing');

            await utilityGrid.clickRefreshIcon();
            expect(await utilityGrid.isPresetFilterNameDisplayed('My Open Tasks')).toBeTruthy(`My Open Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('My Open Breached Tasks')).toBeTruthy(`My Open Breached Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Unassigned Tasks')).toBeTruthy(`All Unassigned Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Open Breached Tasks')).toBeTruthy(`All Open Breached Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Open Tasks')).toBeTruthy(`All Open Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('Critical Priority Open Tasks')).toBeTruthy(`Critical Priority Open Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('High Priority Open Tasks')).toBeTruthy(`High Priority Open Tasks is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Tasks In Last 1 month')).toBeTruthy(`All Tasks In Last 1 month is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Tasks In Last 3 months')).toBeTruthy(`All Tasks In Last 3 months is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Tasks In Last 6 months')).toBeTruthy(`All Tasks In Last 6 months is missing`);

            await utilityGrid.clickOnFilterButton();
            await utilityGrid.clickOnFilterTab('Saved');
            await utilityGrid.clickEditPresetFilterButton(filtername1);

            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Filter name(required)')).toBeTruthy('Filter name label is missing');
            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Applied filters(required)')).toBeTruthy('Applied filters label is missing');

            expect(await utilityGrid.getHeaderOnEditCustomPresetFilter()).toBe(`Edit: ${filtername1}`);

            let dynamicFilterArr2: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr2.includes('Assigned Group')).toBeTruthy(`Assigned Group is missing`);
            expect(dynamicFilterArr2.includes('Assignee')).toBeTruthy(`Assignee  is missing`);
            expect(dynamicFilterArr2.includes('Assignee Login Name')).toBeTruthy(`Assignee Login Name is missing`);
            expect(dynamicFilterArr2.includes('Case ID')).toBeTruthy(`Case ID is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 1')).toBeTruthy(`Category Tier 1 is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 2')).toBeTruthy(`Category Tier 2 is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 3')).toBeTruthy(`Category Tier 3 is missing`);
            expect(dynamicFilterArr2.includes('Created Date')).toBeTruthy(`Created Date is missing`);
            expect(dynamicFilterArr2.includes('Label')).toBeTruthy(`Label is missing`);
            expect(dynamicFilterArr2.includes('Modified By')).toBeTruthy(`Modified By is missing`);
            expect(dynamicFilterArr2.includes('Modified Date')).toBeTruthy(`Modified Date is missing`);
            expect(dynamicFilterArr2.includes('Priority')).toBeTruthy(`Priority is missing`);
            expect(dynamicFilterArr2.includes('SLM Status')).toBeTruthy(`SLM Status is missing`);
            expect(dynamicFilterArr2.includes('Status')).toBeTruthy(`Status is missing`);
            expect(dynamicFilterArr2.includes('Status Value')).toBeTruthy(`Status Value is missing`);
            expect(dynamicFilterArr2.includes('Summary')).toBeTruthy(`Summary is missing`);
            expect(dynamicFilterArr2.includes('Target Date')).toBeTruthy(`Target Date is missing`);
            expect(dynamicFilterArr2.includes('Task ID')).toBeTruthy(`Task ID is missing`);
            expect(dynamicFilterArr2.includes('Task Type')).toBeTruthy(`Task Type is missing`);

            await utilityGrid.clickBackButtonOnEditCustomPresetFilter();
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            await utilityGrid.clickEditFilterCancelButton();
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            expect(await utilityGrid.isAppliedFilterInputBoxDisplayedOnPresetFilter).toBeTruthy(`AppliedFilterInputBox is missing`);
            await utilityGrid.clickEditFilterCancelButton();
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.updateCustomPresetFilter('Status', 'Staged', 'default', filtername1, filtername2);
            await utilityGrid.deleteCustomPresetFilter(filtername1);
            await utilityGrid.clearFilter();
        });

        it('[12079]: Verify all the Captions and Dynamic filters available on the Knowledge Article Console.', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Article ID', knowledgeArticleData.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            await utilityGrid.clickOnFilterButton();

            await utilityGrid.clickOnFilterTab('Available ');

            expect(await knowledgeConsolePo.isFieldLabelDisplayed('Applied filters')).toBeTruthy('Applied filter label is missing');
            expect(await utilityGrid.isAppliedFilterInputBoxDisplayedOnPresetFilter).toBeTruthy(`AppliedFilterInputBox is missing`);

            let dynamicFilterArr1: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr1.includes('Article ID')).toBeTruthy(`Article ID Group is missing`);
            expect(dynamicFilterArr1.includes('Assigned Group')).toBeTruthy(`Assigned Group  is missing`);
            expect(dynamicFilterArr1.includes('Assignee')).toBeTruthy(`Assignee  is missing`);
            expect(dynamicFilterArr1.includes('Assignee Login Name')).toBeTruthy(`Assignee Login Name is missing`);
            expect(dynamicFilterArr1.includes('Author')).toBeTruthy(`Author is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 1')).toBeTruthy(`Category Tier 1 is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 2')).toBeTruthy(`Category Tier 2 is missing`);
            expect(dynamicFilterArr1.includes('Category Tier 3')).toBeTruthy(`Category Tier 3 is missing`);
            expect(dynamicFilterArr1.includes('Company')).toBeTruthy(`Company is missing`);
            expect(dynamicFilterArr1.includes('Flagged')).toBeTruthy(`Flagged is missing`);
            expect(dynamicFilterArr1.includes('ID')).toBeTruthy(`ID is missing`);
            expect(dynamicFilterArr1.includes('Knowledge Set')).toBeTruthy(`Knowledge Set is missing`);
            expect(dynamicFilterArr1.includes('Modified By')).toBeTruthy(`Modified By is missing`);
            expect(dynamicFilterArr1.includes('Modified Date')).toBeTruthy(`Modified Date is missing`);
            expect(dynamicFilterArr1.includes('PrevDocReference')).toBeTruthy(`PrevDocReference is missing`);
            expect(dynamicFilterArr1.includes('Region')).toBeTruthy(`Region is missing`);
            expect(dynamicFilterArr1.includes('Review Status')).toBeTruthy(`Review Status is missing`);
            expect(dynamicFilterArr1.includes('Reviewer')).toBeTruthy(`Reviewer is missing`);
            expect(dynamicFilterArr1.includes('Reviewer Group')).toBeTruthy(`Reviewer Group is missing`);
            expect(dynamicFilterArr1.includes('Status')).toBeTruthy(`Status is missing`);
            expect(dynamicFilterArr1.includes('Status Value')).toBeTruthy(`Status Value is missing`);
            expect(dynamicFilterArr1.includes('Template Name')).toBeTruthy(`Template Name is missing`);
            expect(dynamicFilterArr1.includes('Title')).toBeTruthy(`Title is missing`);
            expect(dynamicFilterArr1.includes('Version')).toBeTruthy(`Version is missing`);

            await utilityGrid.clickOnFilterTab('Saved');
            expect(await knowledgeConsolePo.isFieldLabelDisplayed('Created by me')).toBeTruthy('Created by me label is missing');
            expect(await knowledgeConsolePo.isFieldLabelDisplayed('Shared with me')).toBeTruthy('Shared with me label is missing');


            expect(await utilityGrid.isPresetFilterNameDisplayed('My Open Articles')).toBeTruthy(`My Open Articles is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Published Articles')).toBeTruthy(`All Published Articles is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Externally Published Articles')).toBeTruthy(`All Externally Published Articles is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Articles In Last 1 month')).toBeTruthy(`All Articles In Last 1 month is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Articles In Last 3 months')).toBeTruthy(`All Articles In Last 3 months is missing`);
            expect(await utilityGrid.isPresetFilterNameDisplayed('All Articles In Last 6 months')).toBeTruthy(`All Articles In Last 6 months is missing`);

            await utilityGrid.clickOnFilterButton();
            await utilityGrid.clickOnFilterTab('Saved');
            await utilityGrid.clickEditPresetFilterButton(filtername1);

            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Filter name(required)')).toBeTruthy('Filter name label is missing');
            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Applied filters(required)')).toBeTruthy('Applied filters label is missing');

            expect(await utilityGrid.getHeaderOnEditCustomPresetFilter()).toBe(`Edit: ${filtername1}`);

            let dynamicFilterArr2: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr2.includes('Assignee Login Name')).toBeTruthy(`Assignee Login Name is missing`);
            expect(dynamicFilterArr2.includes('Author')).toBeTruthy(`Author is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 1')).toBeTruthy(`Category Tier 1 is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 2')).toBeTruthy(`Category Tier 2 is missing`);
            expect(dynamicFilterArr2.includes('Category Tier 3')).toBeTruthy(`Category Tier 3 is missing`);
            expect(dynamicFilterArr2.includes('Company')).toBeTruthy(`Company is missing`);
            expect(dynamicFilterArr2.includes('Flagged')).toBeTruthy(`Flagged is missing`);
            expect(dynamicFilterArr2.includes('ID')).toBeTruthy(`ID is missing`);
            expect(dynamicFilterArr2.includes('Knowledge Set')).toBeTruthy(`Knowledge Set is missing`);
            expect(dynamicFilterArr2.includes('Modified By')).toBeTruthy(`Modified By is missing`);
            expect(dynamicFilterArr2.includes('Modified Date')).toBeTruthy(`Modified Date is missing`);
            expect(dynamicFilterArr2.includes('PrevDocReference')).toBeTruthy(`PrevDocReference is missing`);
            expect(dynamicFilterArr2.includes('Region')).toBeTruthy(`Region is missing`);
            expect(dynamicFilterArr2.includes('Review Status')).toBeTruthy(`Review Status is missing`);
            expect(dynamicFilterArr2.includes('Reviewer')).toBeTruthy(`Reviewer is missing`);
            expect(dynamicFilterArr2.includes('Reviewer Group')).toBeTruthy(`Reviewer Group is missing`);
            expect(dynamicFilterArr2.includes('Status')).toBeTruthy(`Status is missing`);
            expect(dynamicFilterArr2.includes('Status Value')).toBeTruthy(`Status Value is missing`);
            expect(dynamicFilterArr2.includes('Template Name')).toBeTruthy(`Template Name is missing`);
            expect(dynamicFilterArr2.includes('Title')).toBeTruthy(`Title is missing`);
            expect(dynamicFilterArr2.includes('Version')).toBeTruthy(`Version is missing`);

            await utilityGrid.clickBackButtonOnEditCustomPresetFilter();
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            await utilityGrid.clickEditFilterCancelButton();
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            expect(await utilityGrid.isAppliedFilterInputBoxDisplayedOnPresetFilter).toBeTruthy(`AppliedFilterInputBox is missing`);
            await utilityGrid.clickEditFilterCancelButton();
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.updateCustomPresetFilter('Status', 'In Progress', 'default', filtername1, filtername2);
            await utilityGrid.deleteCustomPresetFilter(filtername1);
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
            await utilityCommon.closeAllBlades();
        });
    });

    //kgaikwad - Fixed
    describe('[12072]: Verify mandatary fields with verify validation on edit custom fields', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;
        let filtername2 = 'filtername2' + randomStr;

        beforeAll(async () => {
            //  Create Case1
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23490" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
        });

        it('[12072]: Verify mandatary fields with verify validation on edit custom fields', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            await utilityGrid.clickOnFilterButton();
            await utilityGrid.clickOnFilterTab('Saved');
            await utilityGrid.clickEditPresetFilterButton(filtername1);

            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Filter name(required)')).toBeTruthy('Filter name label is missing');
            expect(await utilityGrid.isRequiredLabelDisplayedOnEditFilter('Applied filters(required)')).toBeTruthy('Applied filters label is missing');

            await utilityGrid.clearFilterNameOnEditPresetFilter();
            await utilityGrid.clickEditFilterSaveButton();
            await utilityGrid.removeFilterValue('Case ID\n(1 selected)', newCase.displayId);
            expect(await utilityGrid.IsEditPresetFilterSaveButtonEnabled()).toBeFalsy('Preset filters save buton is enabled');
            expect(await utilityGrid.isValidationMessageDisplayedOnEditPresetFilter('Filter name is required')).toBeTruthy('Filter name is required validation message missing');
            expect(await utilityGrid.isValidationMessageDisplayedOnEditPresetFilter('Required: Please fill out this field')).toBeTruthy('Required: Please fill out this field validation message missing');
            await utilityGrid.clickBackButtonOnEditCustomPresetFilter();
            await utilityGrid.clickRefreshIcon();
            await utilityGrid.updateCustomPresetFilter('Requester', 'Qiang Du', 'default', filtername1, filtername2);

            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername2)).toBeTruthy('Preset filter name is missing');
            expect(await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('Preset filter name is displayed');
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`, 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });

    //kgaikwad
    describe('[12070]: After back to screen custom filter values retain same and also sorting retain same', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let adhoctaskId;
        let knowledgeArticleData;
        let knowledgeTitle = 'knowledgeTitle' + randomStr;
        let filtername1 = 'filtername1' + randomStr;

        beforeAll(async () => {
            //Create Case1
            let caseData = {
                "Requester": "qdu",
                "Summary": "Test case for DRDMV23498" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);

            // Create Knowledge
            let articleData = {
                "knowledgeSet": "HR",
                "title": "KATitle",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 3",
                "assignee": "qkatawazi"
            }
            articleData.title = knowledgeTitle;
            knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        });

        it('[12070]: Verify that Applied Custom Preset filter and sorting is retained when the user navigates back to Case Console from any other page.', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', 'Petramco', "default");
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches(['Company: Petramco'])).toBeTruthy('Applied filter is missing');
            await utilityGrid.updateCustomPresetFilter('Assignee', 'Qadim Katawazi', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Assigned Group', 'US Support 3', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Requester', 'Qiang Du', 'default', filtername1);

            expect(await utilityGrid.isAppliedFilterMatches(['Company: Petramco', 'Assignee: Qadim Katawazi', `Assigned Group: US Support 3`, 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.isGridColumnSorted('Case ID', 'descending')).toBeTruthy('Column not sorted on case console page');

            let caseId1 = await utilityGrid.getFirstGridRecordColumnValue('Case ID');
            await navigationPage.gotoTaskConsole();
            await navigationPage.gotoCaseConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['Company: Petramco', 'Assignee: Qadim Katawazi', `Assigned Group: US Support 3`, 'Requester: Qiang Du'])).toBeTruthy('Applied filter is missing');

            let caseId2 = await utilityGrid.getFirstGridRecordColumnValue('Case ID');
            expect(caseId1).toBe(caseId2);
            expect(await utilityGrid.isGridColumnSorted('Case ID', 'descending')).toBeTruthy('Column not sorted on case console page');
        });

        it('[12070]: Add adhoc task', async () => {
            await utilityGrid.clickRefreshIcon();
            await caseConsolePo.searchAndOpenCase(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary("AdHocSummary" + randomStr);
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink("AdHocSummary" + randomStr);
            adhoctaskId = await viewTaskPo.getTaskID();
            await navigationPage.gotoTaskConsole();
        });

        it('[12070]: Verify that Applied Custom Preset filter and sorting is retained when the user navigates back to Task Console from any other page', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Status', 'Staged', "default");
            expect(await utilityGrid.isAppliedFilterMatches(['Status: Staged'])).toBeTruthy('Applied filter is missing');
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches(['Status: Staged'])).toBeTruthy('Applied filter is missing');

            await utilityGrid.updateCustomPresetFilter('Assignee', 'Qadim Katawazi', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Assigned Group', 'US Support 3', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Task Type', 'Manual', 'checkbox', filtername1);

            expect(await utilityGrid.isAppliedFilterMatches(['Assignee: Qadim Katawazi', `Assigned Group: US Support 3`, 'Status: Staged', 'Task Type: Manual'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.isGridColumnSorted('Task ID', 'descending')).toBeTruthy('Column not sorted on case console page');
            let taskId1 = await utilityGrid.getFirstGridRecordColumnValue('Task ID');
            await navigationPage.gotoCaseConsole();
            await navigationPage.gotoTaskConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['Assignee: Qadim Katawazi', 'Assigned Group: US Support 3', 'Status: Staged', 'Task Type: Manual'])).toBeTruthy('Applied filter is missing');

            let taskId2 = await utilityGrid.getFirstGridRecordColumnValue('Task ID');
            expect(taskId1).toBe(taskId2);
            expect(await utilityGrid.isGridColumnSorted('Task ID', 'descending')).toBeTruthy('Column not sorted on case console page');
        });

        it('[12070]: Verify that Applied Custom Preset filter and sorting is retained when the user navigates back to Knowledge Article Console from any other page', async () => {
            await navigationPage.gotoKnowledgeConsole();

            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Company', 'Petramco', "default");
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches(['Company: Petramco'])).toBeTruthy('Applied filter is missing');

            await utilityGrid.updateCustomPresetFilter('Knowledge Set', 'HR', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Status', 'In Progress', 'default', filtername1);
            await utilityGrid.updateCustomPresetFilter('Template Name', 'Reference', 'default', filtername1);

            expect(await utilityGrid.isAppliedFilterMatches(['Company: Petramco', 'Knowledge Set: HR', 'Status: In Progress', 'Template Name: Reference'])).toBeTruthy('Applied filter is missing');
            expect(await utilityGrid.isGridColumnSorted('Article ID', 'descending')).toBeTruthy('Column not sorted on case console page');
            let taskId1 = await utilityGrid.getFirstGridRecordColumnValue('Article ID');
            await navigationPage.gotoTaskConsole();
            await navigationPage.gotoKnowledgeConsole();
            expect(await utilityGrid.isAppliedFilterMatches(['Company: Petramco', 'Knowledge Set: HR', 'Status: In Progress', 'Template Name: Reference'])).toBeTruthy('Applied filter is missing');

            let taskId2 = await utilityGrid.getFirstGridRecordColumnValue('Article ID');
            expect(taskId1).toBe(taskId2);
            expect(await utilityGrid.isGridColumnSorted('Article ID', 'descending')).toBeTruthy('Column not sorted on case console page');
        });
        afterAll(async () => {
            await utilityGrid.clearFilter();
        });
    });

    //kgaikwad
    describe('[12069]: Verify user unable to filter on case console of knowledge article properties', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;

        beforeAll(async () => {
            //  Create Case1
            let caseData = {
                "Requester": "qdu",
                "Summary": "Summary DRDMV23506" + randomStr,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
        });

        it('[12069]: Verify user unable to filter on case console of knowledge article properties', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilter();
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            expect(await utilityGrid.isAppliedFilterMatches([`Case ID: ${newCase.displayId}`])).toBeTruthy('Applied filter is missing');
            await utilityGrid.clickOnFilterButton();
            await utilityGrid.clickOnFilterTab('Available ');

            let dynamicFilterArr1: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr1.includes('Case ID')).toBeTruthy(`Case ID is missing`);
            expect(dynamicFilterArr1.includes('Article ID')).toBeFalsy(`Article ID is displayed`);
            await utilityGrid.clickOnFilterTab('Saved');
            await utilityGrid.clickEditPresetFilterButton(filtername1);
            let dynamicFilterArr2: string[] = await utilityGrid.getAllDynamicFilterName();
            expect(dynamicFilterArr2.includes('Case ID')).toBeTruthy(`Case ID is missing`);
            expect(dynamicFilterArr2.includes('Article ID')).toBeFalsy(`Article ID is displayed`);
        });
        afterAll(async () => {
            await utilityGrid.clickEditFilterCancelButton();
            await utilityCommon.closeAllBlades();
            await utilityGrid.clearFilter();
        });
    });

});
