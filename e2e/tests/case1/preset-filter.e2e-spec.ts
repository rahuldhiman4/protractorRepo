import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiHelper from '../../api/api.helper';
import utilityGrid from '../../utils/utility.grid';
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import viewTaskPo from '../../pageobject/task/view-task.po';

describe('Preset Filter', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[DRDMV-23481]: Verify Preset Filter Retain Same After Logout And Login In', async () => {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let newCase;
            let taskId;
            let knowledgeArticleData;
            let knowledgeTitle = 'knowledgeTitle'+randomStr;
            
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
    
            it('[DRDMV-23481]: Apply preset filter on case console and verify retain same filter after logout and login in', async () => {
                await utilityGrid.clearFilterPreset();
               await utilityGrid.applyPresetFilter('My Open Cases');
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Cases')).toBeTruthy('My Open Cases is missing');
               await utilityGrid.searchRecord(newCase.displayId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
               await navigationPage.signOut();
               await loginPage.login('qkatawazi');
               await utilityGrid.getAppliedFilterName('My Open Cases'); 
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Cases')).toBeTruthy('My Open Cases is missing');
               await utilityGrid.searchRecord(newCase.displayId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            });
            
            it('[DRDMV-23481]: Add task in case', async () => {
                await caseConsolePo.searchAndOpenCase(newCase.displayId);
                await viewCasePo.clickAddTaskButton();
                await manageTaskBladePo.clickAddAdhocTaskButton();
                await createAdhocTaskPo.setSummary('adhocTaskSummary');
                await createAdhocTaskPo.clickSaveAdhoctask();
                await manageTaskBladePo.clickTaskLink('adhocTaskSummary');
                taskId = await viewTaskPo.getTaskID();
                await navigationPage.gotoTaskConsole();
            });

            it('[DRDMV-23481]: Apply preset filter on task console and verify retain same filter after logout and login in', async () => {
                await utilityGrid.clearFilterPreset();
               await utilityGrid.applyPresetFilter('My Open Tasks');
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Tasks')).toBeTruthy('My Open Tasks is missing');
               await utilityGrid.searchRecord(taskId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(taskId, " Task ID NOT displayed in Task console");

               await navigationPage.signOut();
               await loginPage.login('qkatawazi');
               await navigationPage.gotoTaskConsole();
               await utilityGrid.getAppliedFilterName('My Open Tasks'); 
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Tasks')).toBeTruthy('My Open Tasks is missing');
               await utilityGrid.searchRecord(taskId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(taskId, " Task ID NOT displayed in Task console");
            });

            it('[DRDMV-23481]: Apply preset filter on knowledge console and verify retain same filter after logout and login in', async () => {
                await navigationPage.gotoKnowledgeConsole();
                await utilityGrid.clearFilterPreset();
               await utilityGrid.applyPresetFilter('My Open Articles');
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Articles')).toBeTruthy('My Open Case is missing');
               await utilityGrid.searchRecord(knowledgeArticleData.displayId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");

               await navigationPage.signOut();
               await loginPage.login('qkatawazi');
               await navigationPage.gotoKnowledgeConsole();
               await utilityGrid.getAppliedFilterName('My Open Articles'); 
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Articles')).toBeTruthy('My Open Case is missing');
               await utilityGrid.searchRecord(knowledgeArticleData.displayId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
            });
        });

    //kgaikwad
    describe('[DRDMV-23484]: Verify custom preset filter permission and add new dynamic filter in already saved applied filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;
        let filtername2 = 'filtername2'+ randomStr;

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

        it('[DRDMV-23484]: Add filter on already applied filter', async () => {
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Case ID", newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");

            await utilityGrid.addFilter("Requester", 'Qiang Du', "default");
            await utilityGrid.saveFilter(filtername2);
            expect (await utilityGrid.isAppliedFilterDisplayed('Requester: Qiang Du')).toBeTruthy('Requester: Qiang Du Missing filter name');
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
         });

         it('[DRDMV-23484]: Verify permission of custom preset filter', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername2)).toBeFalsy('FailureMsg: Preset filter is displayed');
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername2)).toBeTruthy('FailureMsg: Preset filter is missing');
            expect (await utilityGrid.isAppliedFilterDisplayed('Requester: Qiang Du')).toBeTruthy('Requester: Qiang Du Missing filter name');
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });
    });

    //kgaikwad
    describe('[DRDMV-23485]: Verify Functionality Of Delete Custom Preset Filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let filtername1 = 'filtername1' + randomStr;

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

        it('[DRDMV-23485]: Custom filter should retain on case console after delete custom preset filter', async () => {
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Case ID", newCase.displayId, "default");
            await utilityGrid.saveFilter(filtername1);
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            await utilityGrid.deleteCustomPresetFilter(filtername1);

            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            

        });
        it('[DRDMV-23485]: Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
        });
    });
});