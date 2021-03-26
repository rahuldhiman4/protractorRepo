import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import * as taskData from "../../data/ui/case/presetFilter.data.ui";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfig from "../../pageobject/settings/common/status-config.po";
import { BWF_BASE_URL, BWF_PAGE_TITLES } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import dbConnectObj from '../../utils/utility.db-connect';
import utilityGrid from "../../utils/utility.grid";
import apiCoreUtil from '../../api/api.core.util';

describe('Task Console Preset Filter', () => {
    let randomString: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    const caseModule = 'Case';
    const personDataFile = require('../../data/ui/foundation/person.ui.json');
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const suppGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');

    const userId = 'mcarney';
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteApprovalMapping(caseModule);
        //await foundationData('Phylum');
        await loginPage.login(userId);

        // Create the new status Configurations
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', BWF_PAGE_TITLES.TASK_MANAGEMENT.STATUS_CONFIGURATION);
        await statusConfig.setCompanyDropdown('Phylum', 'task');
        await statusConfig.clickEditLifeCycleLink();
        await statusConfig.addCustomStatus('Completed', 'Closed', 'AfterCompleted');
        await statusConfig.addCustomStatus('In Progress', 'Completed', 'BeforeCompleted');
        await navigationPage.gotoTaskConsole();

    });
    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationData(company: string) {

        let businessData = businessDataFile["PhylumBusinessUnitHRData"];
        businessData.relatedOrgId = company;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(5000); // timeout requried to reflect data on UI

        let suppGrpData = suppGrpDataFile["PhylumSuppGrpData"];
        suppGrpData.relatedOrgId = businessUnitId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(5000); // timeout requried to reflect data on UI

        let personDataParam = "HumanResouceCaseAgent1";
        let personData = personDataFile[personDataParam];
        await apiHelper.createNewUser(personData);
        await apiHelper.associatePersonToCompany(personData.userId, company);
        await apiHelper.associatePersonToSupportGroup(personData.userId, suppGrpData.orgName);

        let personDataParam1 = "HumanResouceCaseAgent2";
        let personData1 = personDataFile[personDataParam1];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToCompany(personData1.userId, company);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, suppGrpData.orgName);

        let personDataParam2 = "HumanResouceCaseAgent3";
        let personData2 = personDataFile[personDataParam2];
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToCompany(personData2.userId, company);
        await apiHelper.associatePersonToSupportGroup(personData2.userId, suppGrpData.orgName);
    }


    describe('[3673]: Validate the My Open Tasks filter after applying and removing the filter', () => {
        let taskId: string[] = [];
        it('[3673]: Task Data creation with different status', async () => {
            await apiHelper.apiLogin(userId);
            taskData.FAILED_TASK_TEMPLATE.templateName = taskData.FAILED_TASK_TEMPLATE.templateName + randomString;
            await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE).catch(() => {
                console.log('Issue while creating the Failed Task Template');
            });

            //Creating the task 1 and updating it to In Progress state
            let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response2.displayId)
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');
            await apiHelper.updateTaskStatus(response2.id, 'InProgress');

            //Creating the task 2 in Staging state
            let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response4.displayId);

            //Creating the task 3 and updating it to Assigned state
            let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response6.displayId)
            await apiHelper.updateCaseStatus(response5.id, 'InProgress');

            //Creating the task 4 and updating it to Pending state
            let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response8.displayId)
            await apiHelper.updateCaseStatus(response7.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'Pending');

            //Creating the task 5 and updating it to Before Completed state
            let response17 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response18.displayId)
            await apiHelper.updateCaseStatus(response17.id, 'InProgress');
            await apiHelper.updateTaskStatus(response18.id, 'InProgress');
            await apiHelper.updateTaskStatus(response18.id, 'BeforeCompleted');

            //Creating the task 6 and updating it to Completed state
            let response9 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response10.displayId)
            await apiHelper.updateCaseStatus(response9.id, 'InProgress');
            await browser.sleep(1000); //Wait to update the task to Assigned status
            await apiHelper.updateTaskStatus(response10.id, 'Completed', 'Successful');

            //Creating the task 7 and updating it to Canceled state
            let response11 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response12.displayId)
            await apiHelper.updateCaseStatus(response11.id, 'InProgress');
            await apiHelper.updateTaskStatus(response12.id, 'Canceled');

            //Creating the task 8 and updating it to Closed state
            let response13 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response14 = await apiHelper.createAdhocTask(response13.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response14.displayId)
            await apiHelper.updateCaseStatus(response13.id, 'InProgress');
            await apiHelper.updateTaskStatus(response14.id, 'Closed');

            //Creating the task 9 and updating it to Failed state
            let create_task_from_task_template = taskData.CREATE_TASK_FROM_TASK_TEMPLATE;
            let response15 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            create_task_from_task_template.templateName = create_task_from_task_template.templateName + randomString;

            let response16 = await apiHelper.addTaskToCase(create_task_from_task_template, response15.id);
            await apiHelper.apiLogin('tadmin');
            taskId.push((await apiHelper.getCreatedTaskIds(response16)).displayId);
            await apiHelper.apiLogin(userId);
            await apiHelper.updateCaseStatus(response15.id, 'InProgress');

            //Creating the task 10 and updating it to After Completed state
            let response19 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response20.displayId)
            await apiHelper.updateCaseStatus(response19.id, 'InProgress');
            await apiHelper.updateTaskStatus(response20.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(response20.id, 'AfterCompleted');

            //Creating the Open task 11 with Assignee as support group
            let response21 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
            let response22 = await apiHelper.createAdhocTask(response21.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
            taskId.push(response22.displayId)

            //Creating the Open task 12 with Assignee as another user
            let response23 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response24 = await apiHelper.createAdhocTask(response23.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
            taskId.push(response24.displayId)
            await apiHelper.updateCaseStatus(response23.id, 'InProgress');
            await apiHelper.updateTaskStatus(response24.id, 'InProgress');
        });
        it('[3673]: Validate the My Open Tasks filter after applying and removing the filter', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.applyPresetFilter('My Open Tasks');
            let openTaskFilter: string[] = ['My Open Tasks'];
            expect(await utilityGrid.isAppliedFilterMatches(openTaskFilter)).toBeTruthy();

            for (let i: number = 0; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 5; i < 11; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[3673]: Validate the My Open Tasks filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 11; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
    });

    describe('[3672]: Validate the All Open Tasks filter after applying and removing the filter', () => {
        let taskId: string[] = [];
        it('[3672]: Task Data creation with different status', async () => {
            await apiHelper.apiLogin(userId);

            //Creating the task 1 and updating it to In Progress state
            let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
            taskId.push(response2.displayId)
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');
            await apiHelper.updateTaskStatus(response2.id, 'InProgress');

            //Creating the task 2 in Staging state
            let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
            taskId.push(response4.displayId);

            //Creating the task 3 and updating it to Assigned state
            let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response6.displayId)
            await apiHelper.updateCaseStatus(response5.id, 'InProgress');

            //Creating the task 4 and updating it to Pending state
            let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response8.displayId)
            await apiHelper.updateCaseStatus(response7.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'Pending');

            //Creating the task 5 and updating it to Before Completed state
            let response17 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
            taskId.push(response18.displayId)
            await apiHelper.updateCaseStatus(response17.id, 'InProgress');
            await apiHelper.updateTaskStatus(response18.id, 'InProgress');
            await apiHelper.updateTaskStatus(response18.id, 'BeforeCompleted');

            //Creating the task 6 and updating it to Completed state
            let response9 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response10.displayId)
            await apiHelper.updateCaseStatus(response9.id, 'InProgress');
            await apiHelper.updateTaskStatus(response10.id, 'Completed', 'Successful');

            //Creating the task 7 and updating it to Canceled state
            let response11 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
            taskId.push(response12.displayId)
            await apiHelper.updateCaseStatus(response11.id, 'InProgress');
            await apiHelper.updateTaskStatus(response12.id, 'Canceled');

            //Creating the task 8 and updating it to Closed state
            let response13 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response14 = await apiHelper.createAdhocTask(response13.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
            taskId.push(response14.displayId)
            await apiHelper.updateCaseStatus(response13.id, 'InProgress');
            await apiHelper.updateTaskStatus(response14.id, 'Closed');

            //Creating the task 9 and updating it to Failed state
            let create_task_from_task_template = taskData.CREATE_TASK_FROM_TASK_TEMPLATE;
            let response15 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            //create_task_from_task_template.templateName = create_task_from_task_template.templateName;
            console.log('Second test case template name from 1(Task Temp creation):', taskData.FAILED_TASK_TEMPLATE.templateName);
            console.log('Second test case template name from 2(Task Creation of this):', create_task_from_task_template.templateName);
            let response16 = await apiHelper.addTaskToCase(create_task_from_task_template, response15.id);
            await apiHelper.apiLogin('tadmin');
            taskId.push((await apiHelper.getCreatedTaskIds(response16)).displayId);
            await apiHelper.apiLogin(userId);
            await apiHelper.updateCaseStatus(response15.id, 'InProgress');

            //Creating the task 10 and updating it to After Completed state
            let response19 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
            taskId.push(response20.displayId)
            await apiHelper.updateCaseStatus(response19.id, 'InProgress');
            await apiHelper.updateTaskStatus(response20.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(response20.id, 'AfterCompleted');
        });
        it('[3672]: Validate the All Open Tasks filter after applying and removing the filter', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.applyPresetFilter('All Open Tasks');
            let allOpenTaskFilter: string[] = ['All Open Tasks'];
            expect(await utilityGrid.isAppliedFilterMatches(allOpenTaskFilter)).toBeTruthy();

            for (let i: number = 0; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 5; i < 9; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[3672]: Validate the All Open Tasks filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 9; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
    });

    describe('[3671]: Validate the High Priority Open Tasks filter after applying and removing the filter', () => {
        let taskId: string[] = [];
        it('[3671]: Task data creation with different status 1', async () => {
            await apiHelper.apiLogin(userId);

            //Create Low Priority and Assigned status Task
            let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_LOW_PRIORITY);
            taskId.push(response2.displayId)
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');

            //Create Medium Priority and Assigned status Task
            let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_MEDIUM_PRIORITY);
            taskId.push(response4.displayId)
            await apiHelper.updateCaseStatus(response3.id, 'InProgress');

            //Create Critical Priority and Assigned status Task
            let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response6.displayId)
            await apiHelper.updateCaseStatus(response5.id, 'InProgress');

            //Create High Priority and Completed status Task
            let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response8.displayId)
            await apiHelper.updateCaseStatus(response7.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'Completed', 'Successful');

            //Create High Priority and Canceled status Task
            let response9 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response10.displayId)
            await apiHelper.updateCaseStatus(response9.id, 'InProgress');
            await apiHelper.updateTaskStatus(response10.id, 'Canceled');

            //Create High Priority and Closed status Task
            let response11 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response12.displayId)
            await apiHelper.updateCaseStatus(response11.id, 'InProgress');
            await apiHelper.updateTaskStatus(response12.id, 'Closed');

            //Create High Priority and Failed status Task
            let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY.templateName + randomString1;
            await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY).catch(() => {
                console.log('Issue in creation of Automated Task Template');
            });
            let response13 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let create_task_from_task_template = taskData.CREATE_TASK_FROM_TASK_TEMPLATE;
            create_task_from_task_template.templateName = taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY.templateName
            let response14 = await apiHelper.addTaskToCase(create_task_from_task_template, response13.id);
            await apiHelper.apiLogin('tadmin');
            taskId.push((await apiHelper.getCreatedTaskIds(response14)).displayId);
            await apiHelper.apiLogin(userId);
            await apiHelper.updateCaseStatus(response13.id, 'InProgress');
        });
        it('[3671]: Task data creation with different status 2', async () => {
            //Create High Priority and After Completed status Task
            let response15 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response16.displayId)
            await apiHelper.updateCaseStatus(response15.id, 'InProgress');
            await apiHelper.updateTaskStatus(response16.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(response16.id, 'AfterCompleted');

            //Create High Priority and staged status Task
            let response17 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response18.displayId);

            //Create High Priority and Assigned status Task
            let response19 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response20.displayId)
            await apiHelper.updateCaseStatus(response19.id, 'InProgress');

            //Create High Priority and In Progress status Task
            let response21 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response22 = await apiHelper.createAdhocTask(response21.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response22.displayId);
            await apiHelper.updateCaseStatus(response21.id, 'InProgress');
            await apiHelper.updateTaskStatus(response22.id, 'InProgress');

            //Create High Priority and Pending status Task
            let response23 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response24 = await apiHelper.createAdhocTask(response23.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response24.displayId);
            await apiHelper.updateCaseStatus(response23.id, 'InProgress');
            await apiHelper.updateTaskStatus(response24.id, 'Pending');

            //Create High Priority and Before Completed status Task
            let response25 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response26 = await apiHelper.createAdhocTask(response25.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response26.displayId)
            await apiHelper.updateCaseStatus(response25.id, 'InProgress');
            await apiHelper.updateTaskStatus(response26.id, 'InProgress');
            await apiHelper.updateTaskStatus(response26.id, 'BeforeCompleted');
        });
        it('[3671]: Validate the High Priority Open Tasks filter after applying and removing the filter', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.applyPresetFilter('High Priority Open Tasks');
            let HighPriorityTaskFilter: string[] = ['High Priority Open Tasks'];
            expect(await utilityGrid.isAppliedFilterMatches(HighPriorityTaskFilter)).toBeTruthy();

            for (let i: number = 8; i < 13; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[3671]: Validate the High Priority Open Tasks filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 13; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
    });

    describe('[3670]: Validate the Critical Priority Open Tasks filter after applying and removing the filter', () => {
        let taskId: string[] = [];
        it('[3670]: Task data creation with different status 1', async () => {
            await apiHelper.apiLogin(userId);

            //Create Low Priority and Assigned status Task
            let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_LOW_PRIORITY);
            taskId.push(response2.displayId)
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');

            //Create Medium Priority and Assigned status Task
            let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_MEDIUM_PRIORITY);
            taskId.push(response4.displayId)
            await apiHelper.updateCaseStatus(response3.id, 'InProgress');

            //Create Critical Priority and Assigned status Task
            let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_HIGH_PRIORITY);
            taskId.push(response6.displayId)
            await apiHelper.updateCaseStatus(response5.id, 'InProgress');

            //Create High Priority and Completed status Task
            let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response8.displayId)
            await apiHelper.updateCaseStatus(response7.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'Completed', 'Successful');

            //Create High Priority and Canceled status Task
            let response9 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response10.displayId)
            await apiHelper.updateCaseStatus(response9.id, 'InProgress');
            await apiHelper.updateTaskStatus(response10.id, 'Canceled');

            //Create High Priority and Closed status Task
            let response11 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response12.displayId)
            await apiHelper.updateCaseStatus(response11.id, 'InProgress');
            await apiHelper.updateTaskStatus(response12.id, 'Closed');



            //Create High Priority and Failed status Task
            let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName + randomString1;
            await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY).catch(() => {
                console.log('Issue in creation of Automated Task Template');
            });
            let response13 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let create_task_from_task_template = taskData.CREATE_TASK_FROM_TASK_TEMPLATE;
            create_task_from_task_template.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName;
            let response14 = await apiHelper.addTaskToCase(create_task_from_task_template, response13.id);
            await apiHelper.apiLogin('tadmin');
            taskId.push((await apiHelper.getCreatedTaskIds(response14)).displayId);
            await apiHelper.apiLogin(userId);
            await apiHelper.updateCaseStatus(response13.id, 'InProgress');
        });
        it('[3670]: Task data creation with different status 1', async () => {
            //Create High Priority and After Completed status Task
            let response15 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response16.displayId)
            await apiHelper.updateCaseStatus(response15.id, 'InProgress');
            await apiHelper.updateTaskStatus(response16.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(response16.id, 'AfterCompleted');

            //Create High Priority and staged status Task
            let response17 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response18.displayId);

            //Create High Priority and Assigned status Task
            let response19 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response20.displayId)
            await apiHelper.updateCaseStatus(response19.id, 'InProgress');

            //Create High Priority and In Progress status Task
            let response21 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response22 = await apiHelper.createAdhocTask(response21.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response22.displayId);
            await apiHelper.updateCaseStatus(response21.id, 'InProgress');
            await apiHelper.updateTaskStatus(response22.id, 'InProgress');

            //Create High Priority and Pending status Task
            let response23 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response24 = await apiHelper.createAdhocTask(response23.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response24.displayId);
            await apiHelper.updateCaseStatus(response23.id, 'InProgress');
            await apiHelper.updateTaskStatus(response24.id, 'Pending');

            //Create High Priority and Before Completed status Task
            let response25 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response26 = await apiHelper.createAdhocTask(response25.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response26.displayId)
            await apiHelper.updateCaseStatus(response25.id, 'InProgress');
            await apiHelper.updateTaskStatus(response26.id, 'InProgress');
            await apiHelper.updateTaskStatus(response26.id, 'BeforeCompleted');
        });
        it('[3670]: Validate the Critical Priority Open Tasks filter after applying and removing the filter', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.applyPresetFilter('Critical Priority Open Tasks');
            let criticalPriorityTaskFilter: string[] = ['Critical Priority Open Tasks'];
            expect(await utilityGrid.isAppliedFilterMatches(criticalPriorityTaskFilter)).toBeTruthy();

            for (let i: number = 8; i < 13; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[3670]: Validate the Critical Priority Open Tasks filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 13; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
    });

    it('[3669]: Validate the All Unassigned Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLogin(userId);
        let taskId: string[] = [];

        //Creating the task 1 with assignee as logged in user
        let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response2.displayId);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'Completed', 'Successful');

        //Creating the task 2 with Assignee as another user
        let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response4.displayId);
        await apiHelper.updateCaseStatus(response3.id, 'InProgress');
        await apiHelper.updateTaskStatus(response4.id, 'Completed', 'Successful');

        //Creating the task with Assignee as support group
        let response5 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        taskId.push(response6.displayId);

        await navigationPage.gotoTaskConsole();
        await utilityGrid.applyPresetFilter('All Unassigned Tasks');
        let unassignedTaskFilter: string[] = ['All Unassigned Tasks'];
        expect(await utilityGrid.isAppliedFilterMatches(unassignedTaskFilter)).toBeTruthy();

        expect(await utilityGrid.isGridRecordPresent(taskId[2])).toBeTruthy(taskId[2] + ' :Record is not available');


        for (let i: number = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    });

    describe('[3667]: Validate the All Open Breached Tasks filter after applying and removing the filter', () => {
        let taskId: string[] = [];
        it('[3667]: Create SVT data and task data', async () => {
            await apiHelper.apiLogin(userId);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_ASSIGNED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_INPROGRESS_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_PENDING_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_CANCELED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_FAILED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_COMPLETED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_BEFORECOMPLETED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_AFTERCOMPLETED_TASK);

            let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response6.displayId);
            await apiHelper.updateCaseStatus(response5.id, 'InProgress');
            await apiHelper.updateTaskStatus(response6.id, 'Completed', 'Successful');

            let response9 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response10.displayId);
            await apiHelper.updateCaseStatus(response9.id, 'InProgress');
            await apiHelper.updateTaskStatus(response10.id, 'Canceled');

            let response11 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response12.displayId);
            await apiHelper.updateCaseStatus(response11.id, 'InProgress');
            await apiHelper.updateTaskStatus(response12.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(response12.id, 'AfterCompleted');
        });
        it('[3667]: Task creation with different status', async () => {
            let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName + randomString1;
            await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY).catch(() => {
                console.log('Issue while creating the template');
            });
            let response13 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let create_task_from_task_template = taskData.CREATE_TASK_FROM_TASK_TEMPLATE;
            create_task_from_task_template.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName;
            let response14 = await apiHelper.addTaskToCase(create_task_from_task_template, response13.id);
            await apiHelper.apiLogin('tadmin');
            taskId.push(await (await apiHelper.getCreatedTaskIds(response14)).displayId);
            await apiHelper.apiLogin(userId);
            await apiHelper.updateCaseStatus(response13.id, 'InProgress');

            let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response2.displayId);
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');
            await apiHelper.updateTaskStatus(response2.id, 'InProgress');
            await browser.sleep(3000); // required to breach SLA

            let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response4.displayId);
            await apiHelper.updateCaseStatus(response3.id, 'InProgress');
            await apiHelper.updateTaskStatus(response4.id, 'Pending');
            await browser.sleep(3000); // required to breach SLA

            let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response8.displayId);
            await apiHelper.updateCaseStatus(response7.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'BeforeCompleted');

            let response15 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response16.displayId);
            await apiHelper.updateCaseStatus(response15.id, 'InProgress');
        });
        it('[3667]: Verification with 50 percent SVT warning Task', async () => {
            await navigationPage.gotoTaskConsole();
            await utilityGrid.applyPresetFilter('All Open Breached Tasks');
            let openBreachedTaskFilter: string[] = ['All Open Breached Tasks'];
            expect(await utilityGrid.isAppliedFilterMatches(openBreachedTaskFilter)).toBeTruthy();

            await browser.sleep(150000); // required to breach SLA
            expect(await utilityGrid.isGridRecordPresent(taskId[7])).toBeFalsy(taskId[7] + ' :Record is available');
        });
        it('[3667]: Validate the All Open Breached Tasks filter after applying and removing the filter', async () => {
            await browser.sleep(140000); // required to breach SLA
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 4; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[3667]: Validate the All Open Breached Tasks filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
    });

    describe('[3465]: Validate the My Open Breached Tasks filter after applying and removing the filter', () => {
        let taskId: string[] = [];
        it('[3465]: Create SVT data and task data', async () => {
            await apiHelper.apiLogin(userId);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_NEW_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_ASSIGNED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_INPROGRESS_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_PENDING_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_CANCELED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_FAILED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_COMPLETED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_BEFORECOMPLETED_TASK);
            await apiHelper.createSVT(taskData.SERVICE_TARGET_AFTERCOMPLETED_TASK);

            let response17 = await apiHelper.createCase(taskData.NEW_VIP);
            let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_CRITICAL_PRIORITY_UNASSIGNED);
            taskId.push(response18.displayId);

            let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response6.displayId);
            await apiHelper.updateCaseStatus(response5.id, 'InProgress');
            await apiHelper.updateTaskStatus(response6.id, 'Completed', 'Successful');

            let response9 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response10.displayId);
            await apiHelper.updateCaseStatus(response9.id, 'InProgress');
            await apiHelper.updateTaskStatus(response10.id, 'Canceled');

            let response11 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response12.displayId);
            await apiHelper.updateCaseStatus(response11.id, 'InProgress');
            await apiHelper.updateTaskStatus(response12.id, 'Completed', 'Successful');
            await apiHelper.updateTaskStatus(response12.id, 'AfterCompleted');
        });
        it('[3465]: Task creation with different status', async () => {
            let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName + randomString1;
            await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY).catch(() => {
                console.log('Issue while creating the template');
            });
            let response13 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let create_task_from_task_template = taskData.CREATE_TASK_FROM_TASK_TEMPLATE;
            create_task_from_task_template.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName;
            let response14 = await apiHelper.addTaskToCase(create_task_from_task_template, response13.id);
            await apiHelper.apiLogin('tadmin');
            taskId.push(await (await apiHelper.getCreatedTaskIds(response14)).displayId);
            await apiHelper.apiLogin(userId);
            await apiHelper.updateCaseStatus(response13.id, 'InProgress');

            let response1 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response2.displayId);
            await apiHelper.updateCaseStatus(response1.id, 'InProgress');
            await apiHelper.updateTaskStatus(response2.id, 'InProgress');
            await browser.sleep(3000); // required to breach SLA

            let response3 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response4.displayId);
            await apiHelper.updateCaseStatus(response3.id, 'InProgress');
            await apiHelper.updateTaskStatus(response4.id, 'Pending');
            await browser.sleep(3000); // required to breach SLA

            let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response8.displayId);
            await apiHelper.updateCaseStatus(response7.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'InProgress');
            await apiHelper.updateTaskStatus(response8.id, 'BeforeCompleted');

            let response15 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
            let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
            taskId.push(response16.displayId);
            await apiHelper.updateCaseStatus(response15.id, 'InProgress');
        });
        it('[3465]: Applying the Filter', async () => {
            await navigationPage.gotoTaskConsole();
            await browser.sleep(150000); // required to breach SLA
            await utilityGrid.applyPresetFilter('My Open Breached Tasks');
            let openBreachedTaskFilter: string[] = ['My Open Breached Tasks'];
            expect(await utilityGrid.isAppliedFilterMatches(openBreachedTaskFilter)).toBeTruthy();
        });
        it('[3465]: Validate the My Open Breached Tasks filter after applying and removing the filter', async () => {
            await browser.sleep(140000); // required to breach SLA
            await utilityGrid.clickRefreshIcon();
            for (let i: number = 5; i < 8; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }

            for (let i: number = 0; i < 5; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
            }
        });
        it('[3465]: Validate the My Open Breached Tasks filter after applying and removing the filter', async () => {
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
            }
        });
    });

    it('[3661]: Validate the All Tasks In Last 1 month filter after applying and removing the filter', async () => {
        let dbConnectVar = await dbConnectObj.dbConnect();
        await apiHelper.apiLogin(userId);
        let taskId: string[] = [];

        //Creating the task with Staged status and update the creation date below 1 month
        let response1 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId1 = response2.displayId;
        taskId.push(displayId1);

        let dateForTask1 = await utilityCommon.getOldDate(27);
        let dateEpochValueCase1 = await dbConnectObj.dateEpochConverter(dateForTask1);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase1}' WHERE display_id='${displayId1}'`);

        //Creating the task with Completed status and update the creation date below 1 month
        let response5 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        let displayId2 = response6.displayId;
        taskId.push(displayId2);
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');
        await apiHelper.updateTaskStatus(response6.id, 'Completed', 'Successful');

        let dateForTask2 = await utilityCommon.getOldDate(22);
        let dateEpochValueCase2 = await dbConnectObj.dateEpochConverter(dateForTask2);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase2}' WHERE display_id='${displayId2}'`);

        //Creating the task with Staged status and update the creation date above 1 month
        let response3 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId3 = response4.displayId;
        taskId.push(displayId3);

        let dateForTask3 = await utilityCommon.getOldDate(33);
        let dateEpochValueCase3 = await dbConnectObj.dateEpochConverter(dateForTask3);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase3}' WHERE display_id='${displayId3}'`);

        //Creating the task with Completed status and update the creation date below 1 month
        let response7 = await apiHelper.createCase(taskData.PRESET_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        let displayId4 = response8.displayId;
        taskId.push(displayId4);
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'Completed', 'Successful');

        let dateForTask4 = await utilityCommon.getOldDate(32);
        let dateEpochValueCase4 = await dbConnectObj.dateEpochConverter(dateForTask4);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase4}' WHERE display_id='${displayId4}'`);

        await navigationPage.gotoTaskConsole();
        await utilityGrid.applyPresetFilter('All Tasks In Last 1 month');
        let allTaskFilter: string[] = ['All Tasks In Last 1 month'];
        expect(await utilityGrid.isAppliedFilterMatches(allTaskFilter)).toBeTruthy();

        for (let i = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        for (let i = 2; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }
        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    });

    it('[3668]: Validate the All Tasks In Last 3 months filter after applying and removing the filter', async () => {
        let dbConnectVar = await dbConnectObj.dbConnect();
        await apiHelper.apiLogin(userId);
        let taskId: string[] = [];

        //Creating the task with the creation date below 1 month
        let response1 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId1 = response2.displayId;
        taskId.push(displayId1);

        let dateForTask1 = await utilityCommon.getOldDate(27);
        let dateEpochValueCase1 = await dbConnectObj.dateEpochConverter(dateForTask1);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase1}' WHERE display_id='${displayId1}'`);

        //Creating the task with the creation date below 3 months
        let response3 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId2 = response4.displayId;
        taskId.push(displayId2);

        let dateForTask2 = await utilityCommon.getOldDate(80);
        let dateEpochValueCase2 = await dbConnectObj.dateEpochConverter(dateForTask2);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase2}' WHERE display_id='${displayId2}'`);

        //Creating the task with the creation date above 3 months
        let response5 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId3 = response6.displayId;
        taskId.push(displayId3);

        let dateForTask3 = await utilityCommon.getOldDate(100);
        let dateEpochValueCase3 = await dbConnectObj.dateEpochConverter(dateForTask3);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueCase3}' WHERE display_id='${displayId3}'`);

        await navigationPage.gotoTaskConsole();
        await utilityGrid.applyPresetFilter('All Tasks In Last 3 months');
        let allTaskFilter: string[] = ['All Tasks In Last 3 months'];
        expect(await utilityGrid.isAppliedFilterMatches(allTaskFilter)).toBeTruthy();

        for (let i = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
        expect(await utilityGrid.isGridRecordPresent(taskId[2])).toBeFalsy(taskId[2] + ' :Record is available');

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    });

    it('[3529]: Validate the All Tasks In Last 6 months filter after applying and removing the filter', async () => {
        let dbConnectVar = await dbConnectObj.dbConnect();
        await apiHelper.apiLogin(userId);
        let taskId: string[] = [];

        //Creating the task with the creation date below 1 month
        let response1 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId1 = response2.displayId;
        taskId.push(displayId1);

        let dateForTask1 = await utilityCommon.getOldDate(27);
        let dateEpochValueTask1 = await dbConnectObj.dateEpochConverter(dateForTask1);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueTask1}' WHERE display_id='${displayId1}'`);

        //Creating the task with the creation date below 3 months
        let response3 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId2 = response4.displayId;
        taskId.push(displayId2);

        let dateForTask2 = await utilityCommon.getOldDate(80);
        let dateEpochValueTask2 = await dbConnectObj.dateEpochConverter(dateForTask2);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueTask2}' WHERE display_id='${displayId2}'`);

        //Creating the task with the creation date above 3 months
        let response5 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId3 = response6.displayId;
        taskId.push(displayId3);

        let dateForTask3 = await utilityCommon.getOldDate(150);
        let dateEpochValueTask3 = await dbConnectObj.dateEpochConverter(dateForTask3);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueTask3}' WHERE display_id='${displayId3}'`);

        //Creating the task with the creation date above 6 months
        let response7 = await apiHelper.createCase(taskData.NEW_PRESET_CRITICALPRIORITY);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        let displayId4 = response8.displayId;
        taskId.push(displayId4);

        let dateForTask4 = await utilityCommon.getOldDate(200);
        let dateEpochValueTask4 = await dbConnectObj.dateEpochConverter(dateForTask4);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_task_lib_Task SET created_date = '${dateEpochValueTask4}' WHERE display_id='${displayId4}'`);
        await navigationPage.gotoTaskConsole();
        await utilityGrid.applyPresetFilter('All Tasks In Last 6 months');
        let allTaskFilter: string[] = ['All Tasks In Last 6 months'];
        expect(await utilityGrid.isAppliedFilterMatches(allTaskFilter)).toBeTruthy();

        for (let i = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
        expect(await utilityGrid.isGridRecordPresent(taskId[3])).toBeFalsy(taskId[3] + ' :Record is available');

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

    });
});
