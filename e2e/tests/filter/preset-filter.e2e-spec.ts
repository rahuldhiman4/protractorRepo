import { browser } from "protractor";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import apiHelper from '../../api/api.helper';
import utilityGrid from '../../utils/utility.grid';
import viewCasePo from '../../pageobject/case/view-case.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import createAdhocTaskPo from '../../pageobject/task/create-adhoc-task.po';
import viewTaskPo from '../../pageobject/task/view-task.po';

describe('Preset Filter Funcational Verification', () => {
    let randomStr1 = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseAgentuserData;
    let caseAgentUserId = "caseAgent1"+randomStr1;
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');

        
        // Create User and assigned Document Manager Permission to agent
        await apiHelper.apiLogin('tadmin');
        caseAgentuserData = {
            "firstName": "caseAgent2",
            "lastName": "user2",
            "userId": caseAgentUserId,
            "userPermission": ["Case Agent", "Document Manager"]
        }
        
        await apiHelper.createNewUser(caseAgentuserData);
        await apiHelper.associatePersonToCompany(caseAgentuserData.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(caseAgentuserData.userId, 'US Support 3');
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
                    "Assignee": caseAgentUserId
                }
                console.log('randomStr>>>>>>>>>.',randomStr);
                
                await apiHelper.apiLogin(caseAgentuserData.userId+"@petramco.com","Password_1234");
                newCase = await apiHelper.createCase(caseData1);

                let articleData = {
                    "knowledgeSet": "HR",
                    "title": "KATitle",
                    "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                    "assignedCompany": "Petramco",
                    "assigneeBusinessUnit": "United States Support",
                    "assigneeSupportGroup": "US Support 3",
                    "assignee": caseAgentUserId
                }
                articleData.title = knowledgeTitle;
                knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
                
                // login in with created user.
                await navigationPage.signOut(); 
                await loginPage.login(caseAgentuserData.userId+"@petramco.com","Password_1234");
            });
    
            it('[DRDMV-23481]: Verify default preset filter on case console', async () => {
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Cases')).toBeTruthy('My Open Cases is missing');
               await utilityGrid.searchRecord(newCase.displayId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            });
            
            it('[DRDMV-23481]: Add task in case', async () => {
                await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
                await viewCasePo.clickAddTaskButton();
                await manageTaskBladePo.clickAddAdhocTaskButton();
                await createAdhocTaskPo.setSummary('adhocTaskSummary');
                await createAdhocTaskPo.clickSaveAdhoctask();
                await manageTaskBladePo.clickTaskLink('adhocTaskSummary');
                taskId = await viewTaskPo.getTaskID();
                await navigationPage.gotoTaskConsole();
            });

            it('[DRDMV-23481]: Verify default preset filter on task console', async () => {
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Tasks')).toBeTruthy('My Open Tasks is missing');
               await utilityGrid.searchRecord(taskId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(taskId, " Task ID NOT displayed in Task console");
            });

            it('[DRDMV-23481]: Verify default preset filter on knowledge console', async () => {
                await navigationPage.gotoKnowledgeConsole();
               expect (await utilityGrid.isAppliedFilterDisplayed('My Open Articles')).toBeTruthy('My Open Case is missing');
               await utilityGrid.searchRecord(knowledgeArticleData.displayId);
               expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
            });
            it('[DRDMV-23481]: Verify retain same case filter after logout and login in', async () => {
                await navigationPage.signOut();
                await loginPage.login(caseAgentuserData.userId+"@petramco.com","Password_1234");
                expect (await utilityGrid.isAppliedFilterDisplayed('My Open Cases')).toBeTruthy('My Open Cases is missing');
                await utilityGrid.searchRecord(newCase.displayId);
                expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
            });
            it('[DRDMV-23481]: Verify retain same task filter after logout and login in', async () => {
                await navigationPage.gotoTaskConsole();
                expect (await utilityGrid.isAppliedFilterDisplayed('My Open Tasks')).toBeTruthy('My Open Tasks is missing');
                await utilityGrid.searchRecord(taskId);
                expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(taskId, " Task ID NOT displayed in Task console");
            });
            it('[DRDMV-23481]: Verify retain same article filter after logout and login in', async () => {
                await navigationPage.gotoKnowledgeConsole();
                expect (await utilityGrid.isAppliedFilterDisplayed('My Open Articles')).toBeTruthy('My Open Case is missing');
                await utilityGrid.searchRecord(knowledgeArticleData.displayId);
                expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
            });
            it('[DRDMV-23481]: Clear Filter with logout login in and verify same filter again able to applied or not', async () => {
                await navigationPage.gotoCaseConsole();
                await utilityGrid.clearFilter();
                await navigationPage.signOut();
                await loginPage.login(caseAgentuserData.userId+"@petramco.com","Password_1234");
                expect (await utilityGrid.isAppliedFilterDisplayed('My Open Articles')).toBeFalsy('My Open Articles is displayed');
                await utilityGrid.applyPresetFilter('My Open Articles');
                expect (await utilityGrid.isAppliedFilterDisplayed('My Open Articles')).toBeTruthy('My Open Articles is missing');
                await utilityGrid.searchRecord(newCase.displayId);
                expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " Article ID NOT displayed in Task console");
            });
            afterAll(async () => {
                await utilityCommon.closeAllBlades();
                await navigationPage.signOut();
                await loginPage.login('qkatawazi');
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
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            await utilityGrid.saveFilter(filtername1);
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");

            await utilityGrid.addFilter("Requester", 'Qiang Du', "default");
            expect (await utilityGrid.isAppliedFilterDisplayed('Requester: Qiang Du')).toBeTruthy('Requester: Qiang Du Missing filter name');
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');

            await utilityGrid.saveFilter(filtername2);
            expect (await utilityGrid.isAppliedFilterDisplayed('Requester: Qiang Du')).toBeTruthy('Requester: Qiang Du Missing filter name');
            expect (await utilityGrid.getAppliedFilterName()).toBe(`Case ID: ${newCase.displayId}`, 'Missing filter name');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in Task console");
         });

         it('[DRDMV-23484]: Verify permission of custom preset filter', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
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

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    
    });

    //kgaikwad
    describe('[DRDMV-23485]: Verify Functionality Of Delete Custom Preset Filter', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let newCase;
        let newCase2;
        let adhoctaskId;
        let knowledgeArticleData;
        let knowledgeTitle ='knowledgeTitle'+randomStr;
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
            
            // Knowledge Article
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

        it('[DRDMV-23485]: Custom filter should retain on case console after delete custom preset filter', async () => {
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Case ID',newCase.displayId, "default");
            
            await utilityGrid.saveFilter(filtername1);
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Case ID: ${newCase.displayId}`)).toBeTruthy('Summary missing filter on case console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");

            await utilityGrid.deleteCustomPresetFilter(filtername1);
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Case ID: ${newCase.displayId}`)).toBeTruthy('Summary missing filter on case console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
        });

        it('[DRDMV-23485]: Add adhoc task', async () => {
            await utilityGrid.searchAndOpenHyperlink(newCase.displayId);
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.clickAddAdhocTaskButton();
            await createAdhocTaskPo.setSummary(`Summary DRDMV23485${randomStr}`);
            await createAdhocTaskPo.clickSaveAdhoctask();
            await manageTaskBladePo.clickTaskLink(`Summary DRDMV23485${randomStr}`);
            adhoctaskId = await viewTaskPo.getTaskID(); 
            await navigationPage.gotoTaskConsole();
        });

        it('[DRDMV-23485]: Custom filter should retain on task console after delete custom preset filter', async () => {
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Status','Staged', "default");
            
            await utilityGrid.saveFilter(filtername1);
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on task console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Status: Staged`)).toBeTruthy('Status: Staged is on task console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(adhoctaskId, " adhoctaskId NOT displayed in task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " task Summary NOT displayed in case console");

            await utilityGrid.deleteCustomPresetFilter(filtername1);
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Status: Staged`)).toBeTruthy('Status: Staged is on task console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(adhoctaskId, " adhoctaskId NOT displayed in task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Status')).toBe(`Staged`, " Status NOT displayed on task console");
        });

        it('[DRDMV-23485]: Custom filter should retain on knowledge article console after delete custom preset filter', async () => {
            await navigationPage.gotoKnowledgeConsole();
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Knowledge Set", 'HR', "default");
            await utilityGrid.addFilter('Modified By','qkatawazi', "default");
            await utilityGrid.addFilter('Article ID',knowledgeArticleData.displayId, "default");
            
            await utilityGrid.saveFilter(filtername1);
            expect (await utilityGrid.isAppliedFilterDisplayed('Knowledge Set: HR')).toBeTruthy('Knowledge Set: HR missing on knowledge article console');
            expect (await utilityGrid.isAppliedFilterDisplayed('Modified By: qkatawazi')).toBeTruthy('Modified By: qkatawazi missing filter on knowledge article console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Article ID: ${knowledgeArticleData.displayId}`)).toBeTruthy('Company: Petramco is on knowledge article console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " knowledgeArticleData.displayId NOT displayed in knowledge article console");

            await utilityGrid.deleteCustomPresetFilter(filtername1);
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isAppliedFilterDisplayed('Knowledge Set: HR')).toBeTruthy('Knowledge Set: HR missing on knowledge article console');
            expect (await utilityGrid.isAppliedFilterDisplayed('Modified By: qkatawazi')).toBeTruthy('Modified By: qkatawazi missing filter on knowledge article console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Article ID: ${knowledgeArticleData.displayId}`)).toBeTruthy('Company: Petramco is on knowledge article console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " knowledgeArticleData.displayId NOT displayed in knowledge article console");
        });

        it('[DRDMV-23485]: Case Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Case ID: ${newCase.displayId}`)).toBeTruthy('Summary missing filter on case console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
        });

        it('[DRDMV-23485]: Task Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.gotoTaskConsole();
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on task console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Status: Staged`)).toBeTruthy('Status: Staged is on task console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Task ID')).toBe(adhoctaskId, " adhoctaskId NOT displayed in task console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " task Summary NOT displayed in case console");
        });

        it('[DRDMV-23485]: Knowledge Aeticle Custom filter should stay deleted after logout and login in', async () => {
            await navigationPage.gotoKnowledgeConsole();
            expect (await utilityGrid.isPresetFilterNameDisplayed(filtername1)).toBeFalsy('FailureMsg: Preset filter is displayed');
            expect (await utilityGrid.isAppliedFilterDisplayed('Knowledge Set: HR')).toBeTruthy('Knowledge Set: HR missing on knowledge article console');
            expect (await utilityGrid.isAppliedFilterDisplayed('Modified By: qkatawazi')).toBeTruthy('Modified By: qkatawazi missing filter on knowledge article console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Article ID: ${knowledgeArticleData.displayId}`)).toBeTruthy('Company: Petramco is on knowledge article console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Article ID')).toBe(knowledgeArticleData.displayId, " knowledgeArticleData.displayId NOT displayed in knowledge article console");
        });

        it('[DRDMV-23485]: Try adding the same filter with same qualification but with different users.', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Company', 'Petramco', "default");
            await utilityGrid.addFilter('Case ID', newCase.displayId, "default");
            
            await utilityGrid.saveFilter(filtername2);
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Company: Petramco`)).toBeTruthy('Company: Petramco is on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Case ID: ${newCase.displayId}`)).toBeTruthy('Company: Petramco is on case console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");

            await navigationPage.signOut();
            await loginPage.login('qdu');
            await utilityGrid.clearFilterPreset();
            await utilityGrid.addFilter("Summary", `Summary DRDMV23485${randomStr}`, "default");
            await utilityGrid.addFilter('Company','Petramco', "default");
            await utilityGrid.addFilter('Case ID', newCase2.displayId, "default");
            
            await utilityGrid.saveFilter(filtername2);
            expect (await utilityGrid.isAppliedFilterDisplayed(`Summary: Summary DRDMV23485${randomStr}`)).toBeTruthy('Summary missing filter on case console');
            expect (await utilityGrid.isAppliedFilterDisplayed(`Company: Petramco`)).toBeTruthy('Company: Petramco is on case console');
            expect(await utilityGrid.getFirstGridRecordColumnValue('Case ID')).toBe(newCase2.displayId, " Case Id NOT displayed in case console");
            expect(await utilityGrid.getFirstGridRecordColumnValue('Summary')).toBe(`Summary DRDMV23485${randomStr}`, " Case Id NOT displayed in case console");
    });

        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

});
});
