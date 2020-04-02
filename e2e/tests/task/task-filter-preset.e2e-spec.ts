import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import * as taskData from "../../data/ui/case/presetFilter.data.ui";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfig from "../../pageobject/settings/common/status-config.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilGrid from "../../utils/util.grid";

describe('Task Console Preset Filter', () => {

    let randomString: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteServiceTargets();
        const personDataFile = require('../../data/ui/foundation/person.ui.json');
        let personData1 = personDataFile['PhylumCaseAgent1'];
        await apiHelper.createNewUser(personData1);
        await apiHelper.associatePersonToSupportGroup(personData1.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData1.userId, 'Phylum');

        let personData2 = personDataFile['PhylumCaseAgent2'];
        await apiHelper.createNewUser(personData2);
        await apiHelper.associatePersonToSupportGroup(personData2.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData2.userId, 'Phylum');

        let personData3 = personDataFile['PhylumCaseAgent3'];
        await apiHelper.createNewUser(personData3);
        await apiHelper.associatePersonToSupportGroup(personData3.userId, 'Phylum Support Group1');
        await apiHelper.associatePersonToCompany(personData3.userId, 'Phylum');

        await loginPage.loginWithCredentials('idphylum1@petramco.com', 'Password_1234');
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');

        //Create the new status Configurations
        browser.sleep(6000);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Task Management--Status Configuration', 'Configure Task Status Tranistions - Business Workflows');
        await statusConfig.setCompanyDropdown('Phylum', 'task');
        await statusConfig.clickEditLifeCycleLink();
        await statusConfig.addCustomStatus('Completed', 'Closed', 'AfterCompleted');

        await browser.refresh();
        await statusConfig.setCompanyDropdown('Phylum', 'task');
        await statusConfig.clickEditLifeCycleLink();
        await statusConfig.addCustomStatus('In Progress', 'Completed', 'BeforeCompleted');

        //Creating the Automated Task Template which will fail
        taskData.FAILED_TASK_TEMPLATE.templateName = taskData.FAILED_TASK_TEMPLATE.templateName + randomString;
        await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE);
        await navigationPage.gotoTaskConsole();
    }, 200 * 1000);

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
    });

    xit('[DRDMV-20883]: Validate the My Open Cases filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];

        //Creating the task 1 and updating it to In Progress state
        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response2.displayId)
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'InProgress');

        //Creating the task 2 in Staging state
        let response3 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response4.displayId);

        //Creating the task 3 and updating it to Assigned state
        let response5 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response6.displayId)
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');

        //Creating the task 4 and updating it to Pending state
        let response7 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response8.displayId)
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'Pending');

        //Creating the task 5 and updating it to Before Completed state
        let response17 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response18.displayId)
        await apiHelper.updateCaseStatus(response17.id, 'InProgress');
        await apiHelper.updateTaskStatus(response18.id, 'InProgress');
        await apiHelper.updateTaskStatus(response18.id, 'BeforeCompleted');

        //Creating the task 6 and updating it to Completed state
        let response9 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response10.displayId)
        await apiHelper.updateCaseStatus(response9.id, 'InProgress');
        await apiHelper.updateTaskStatus(response10.id, 'Completed', 'Successful');

        //Creating the task 7 and updating it to Canceled state
        let response11 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response12.displayId)
        await apiHelper.updateCaseStatus(response11.id, 'InProgress');
        await apiHelper.updateTaskStatus(response12.id, 'Canceled');

        //Creating the task 8 and updating it to Closed state
        let response13 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response14 = await apiHelper.createAdhocTask(response13.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response14.displayId)
        await apiHelper.updateCaseStatus(response13.id, 'InProgress');
        await apiHelper.updateTaskStatus(response14.id, 'Closed');

        //Creating the task 9 and updating it to Failed state
        let response15 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName = taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName + randomString;
        let response16 = await apiHelper.addTaskToCase(taskData.CREATE_TASK_FROM_TASK_TEMPLATE, response15.id);
        await apiHelper.apiLogin('tadmin');
        taskId.push(await (await apiHelper.getCreatedTaskIds(response16)).displayId);
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        await apiHelper.updateCaseStatus(response15.id, 'InProgress');

        //Creating the task 10 and updating it to After Completed state
        let response19 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response20.displayId)
        await apiHelper.updateCaseStatus(response19.id, 'InProgress');
        await apiHelper.updateTaskStatus(response20.id, 'Completed', 'Successful');
        await apiHelper.updateTaskStatus(response20.id, 'AfterCompleted');

        //Creating the Open task 11 with Assignee as support group
        let response21 = await apiHelper.createCase(taskData.NEW_CRITICALPRIORITY_DRDMV_20878_5);
        let response22 = await apiHelper.createAdhocTask(response21.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        taskId.push(response22.displayId)

        //Creating the Open task 12 with Assignee as another user
        let response23 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response24 = await apiHelper.createAdhocTask(response23.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response24.displayId)
        await apiHelper.updateCaseStatus(response23.id, 'InProgress');
        await apiHelper.updateTaskStatus(response24.id, 'InProgress');

        await utilGrid.applyPresetFilter('My Open Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('My Open Tasks');

        for (let i: number = 0; i < 5; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        for (let i: number = 5; i < 11; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 11; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    }, 330 * 1000);

    it('[DRDMV-20884]: Validate the All Open Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];

        //Creating the task 1 and updating it to In Progress state
        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response2.displayId)
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'InProgress');

        //Creating the task 2 in Staging state
        let response3 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response4.displayId);

        //Creating the task 3 and updating it to Assigned state
        let response5 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response6.displayId)
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');

        //Creating the task 4 and updating it to Pending state
        let response7 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response8.displayId)
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'Pending');

        //Creating the task 5 and updating it to Before Completed state
        let response17 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response18.displayId)
        await apiHelper.updateCaseStatus(response17.id, 'InProgress');
        await apiHelper.updateTaskStatus(response18.id, 'InProgress');
        await apiHelper.updateTaskStatus(response18.id, 'BeforeCompleted');

        //Creating the task 6 and updating it to Completed state
        let response9 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response10.displayId)
        await apiHelper.updateCaseStatus(response9.id, 'InProgress');
        await apiHelper.updateTaskStatus(response10.id, 'Completed', 'Successful');

        //Creating the task 7 and updating it to Canceled state
        let response11 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response12.displayId)
        await apiHelper.updateCaseStatus(response11.id, 'InProgress');
        await apiHelper.updateTaskStatus(response12.id, 'Canceled');

        //Creating the task 8 and updating it to Closed state
        let response13 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response14 = await apiHelper.createAdhocTask(response13.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response14.displayId)
        await apiHelper.updateCaseStatus(response13.id, 'InProgress');
        await apiHelper.updateTaskStatus(response14.id, 'Closed');

        //Creating the task 9 and updating it to Failed state
        let response15 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName = taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName + randomString;
        let response16 = await apiHelper.addTaskToCase(taskData.CREATE_TASK_FROM_TASK_TEMPLATE, response15.id);
        await apiHelper.apiLogin('tadmin');
        taskId.push(await (await apiHelper.getCreatedTaskIds(response16)).displayId);
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        await apiHelper.updateCaseStatus(response15.id, 'InProgress');

        //Creating the task 10 and updating it to After Completed state
        let response19 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response20.displayId)
        await apiHelper.updateCaseStatus(response19.id, 'InProgress');
        await apiHelper.updateTaskStatus(response20.id, 'Completed', 'Successful');
        await apiHelper.updateTaskStatus(response20.id, 'AfterCompleted');

        await utilGrid.applyPresetFilter('All Open Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('All Open Tasks');

        for (let i: number = 0; i < 5; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        for (let i: number = 5; i < 9; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 9; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

    }, 360 * 1000);

    it('[DRDMV-20885]: Validate the High Priority Open Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];

        //Create Low Priority and Assigned status Task
        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_LOW_PRIORITY);
        taskId.push(response2.displayId)
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');

        //Create Medium Priority and Assigned status Task
        let response3 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_MEDIUM_PRIORITY);
        taskId.push(response4.displayId)
        await apiHelper.updateCaseStatus(response3.id, 'InProgress');

        //Create Critical Priority and Assigned status Task
        let response5 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response6.displayId)
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');

        //Create High Priority and Completed status Task
        let response7 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response8.displayId)
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'Completed', 'Successful');

        //Create High Priority and Canceled status Task
        let response9 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response10.displayId)
        await apiHelper.updateCaseStatus(response9.id, 'InProgress');
        await apiHelper.updateTaskStatus(response10.id, 'Canceled');

        //Create High Priority and Closed status Task
        let response11 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response12.displayId)
        await apiHelper.updateCaseStatus(response11.id, 'InProgress');
        await apiHelper.updateTaskStatus(response12.id, 'Closed');

        //Create High Priority and Failed status Task
        let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY.templateName + randomString1;
        await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_HIGH_PRIORITY);
        let response13 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName = taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName + randomString1;
        let response14 = await apiHelper.addTaskToCase(taskData.CREATE_TASK_FROM_TASK_TEMPLATE, response13.id);
        await apiHelper.apiLogin('tadmin');
        taskId.push(await (await apiHelper.getCreatedTaskIds(response14)).displayId);
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        await apiHelper.updateCaseStatus(response13.id, 'InProgress');

        //Create High Priority and After Completed status Task
        let response15 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response16.displayId)
        await apiHelper.updateCaseStatus(response15.id, 'InProgress');
        await apiHelper.updateTaskStatus(response16.id, 'Completed', 'Successful');
        await apiHelper.updateTaskStatus(response16.id, 'AfterCompleted');

        //Create High Priority and staged status Task
        let response17 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response18.displayId);

        //Create High Priority and Assigned status Task
        let response19 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response20.displayId)
        await apiHelper.updateCaseStatus(response19.id, 'InProgress');

        //Create High Priority and In Progress status Task
        let response21 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response22 = await apiHelper.createAdhocTask(response21.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response22.displayId);
        await apiHelper.updateCaseStatus(response21.id, 'InProgress');
        await apiHelper.updateTaskStatus(response22.id, 'InProgress');

        //Create High Priority and Pending status Task
        let response23 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response24 = await apiHelper.createAdhocTask(response23.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response24.displayId);
        await apiHelper.updateCaseStatus(response23.id, 'InProgress');
        await apiHelper.updateTaskStatus(response24.id, 'Pending');

        //Create High Priority and Before Completed status Task
        let response25 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response26 = await apiHelper.createAdhocTask(response25.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response26.displayId)
        await apiHelper.updateCaseStatus(response25.id, 'InProgress');
        await apiHelper.updateTaskStatus(response26.id, 'InProgress');
        await apiHelper.updateTaskStatus(response26.id, 'BeforeCompleted');

        await utilGrid.applyPresetFilter('High Priority Open Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('High Priority Open Tasks');

        for (let i: number = 8; i < 13; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        for (let i: number = 0; i < 8; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 13; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    }, 450 * 1000);

    it('[DRDMV-20886]: Validate the Critical Priority Open Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];

        //Create Low Priority and Assigned status Task
        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_LOW_PRIORITY);
        taskId.push(response2.displayId)
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');

        //Create Medium Priority and Assigned status Task
        let response3 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_MEDIUM_PRIORITY);
        taskId.push(response4.displayId)
        await apiHelper.updateCaseStatus(response3.id, 'InProgress');

        //Create Critical Priority and Assigned status Task
        let response5 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response6.displayId)
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');

        //Create High Priority and Completed status Task
        let response7 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response8.displayId)
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'Completed', 'Successful');

        //Create High Priority and Canceled status Task
        let response9 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response10.displayId)
        await apiHelper.updateCaseStatus(response9.id, 'InProgress');
        await apiHelper.updateTaskStatus(response10.id, 'Canceled');

        //Create High Priority and Closed status Task
        let response11 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response12.displayId)
        await apiHelper.updateCaseStatus(response11.id, 'InProgress');
        await apiHelper.updateTaskStatus(response12.id, 'Closed');

        //Create High Priority and Failed status Task
        let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName + randomString1;
        await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY);
        let response13 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName = taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName + randomString1;
        let response14 = await apiHelper.addTaskToCase(taskData.CREATE_TASK_FROM_TASK_TEMPLATE, response13.id);
        await apiHelper.apiLogin('tadmin');
        taskId.push(await (await apiHelper.getCreatedTaskIds(response14)).displayId);
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        await apiHelper.updateCaseStatus(response13.id, 'InProgress');

        //Create High Priority and After Completed status Task
        let response15 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response16.displayId)
        await apiHelper.updateCaseStatus(response15.id, 'InProgress');
        await apiHelper.updateTaskStatus(response16.id, 'Completed', 'Successful');
        await apiHelper.updateTaskStatus(response16.id, 'AfterCompleted');

        //Create High Priority and staged status Task
        let response17 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response18 = await apiHelper.createAdhocTask(response17.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response18.displayId);

        //Create High Priority and Assigned status Task
        let response19 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response20 = await apiHelper.createAdhocTask(response19.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response20.displayId)
        await apiHelper.updateCaseStatus(response19.id, 'InProgress');

        //Create High Priority and In Progress status Task
        let response21 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response22 = await apiHelper.createAdhocTask(response21.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response22.displayId);
        await apiHelper.updateCaseStatus(response21.id, 'InProgress');
        await apiHelper.updateTaskStatus(response22.id, 'InProgress');

        //Create High Priority and Pending status Task
        let response23 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response24 = await apiHelper.createAdhocTask(response23.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response24.displayId);
        await apiHelper.updateCaseStatus(response23.id, 'InProgress');
        await apiHelper.updateTaskStatus(response24.id, 'Pending');

        //Create High Priority and Before Completed status Task
        let response25 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response26 = await apiHelper.createAdhocTask(response25.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response26.displayId)
        await apiHelper.updateCaseStatus(response25.id, 'InProgress');
        await apiHelper.updateTaskStatus(response26.id, 'InProgress');
        await apiHelper.updateTaskStatus(response26.id, 'BeforeCompleted');

        await utilGrid.applyPresetFilter('Critical Priority Open Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('Critical Priority Open Tasks');

        for (let i: number = 8; i < 13; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        for (let i: number = 0; i < 8; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 13; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

    }, 420 * 1000);

    it('[DRDMV-20887]: Validate the All Unassigned Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];

        //Creating the task 1 with assignee as logged in user
        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response2.displayId);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'Completed', 'Successful');

        //Creating the task 2 with Assignee as another user
        let response3 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response4.displayId);
        await apiHelper.updateCaseStatus(response3.id, 'InProgress');
        await apiHelper.updateTaskStatus(response4.id, 'Completed', 'Successful');

        //Creating the task with Assignee as support group
        let response5 = await apiHelper.createCase(taskData.NEW_CRITICALPRIORITY_DRDMV_20878_5);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        taskId.push(response6.displayId);

        await utilGrid.applyPresetFilter('All Unassigned Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('All Unassigned Tasks');

        expect(await utilGrid.isGridRecordPresent(taskId[2])).toBeTruthy(taskId[2] + ' :Record is not available');


        for (let i: number = 0; i < 2; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 3; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    }, 230 * 1000);

    xit('[DRDMV-20888]: Validate the All Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];

        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_ASSIGNEDTOLOGGEDINUSER);
        taskId.push(response2.displayId)
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'Completed', 'Successful');

        //Creating the task with Assignee as support group
        let response3 = await apiHelper.createCase(taskData.NEW_CRITICALPRIORITY_DRDMV_20878_5);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_ASSIGNTOLOGGEDINUSERGROUP);
        taskId.push(response4.displayId);

        //Creating the task with Assignee as another user
        let response5 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_ASSIGNTOANOTHERUSER);
        taskId.push(response6.displayId);
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');
        await apiHelper.updateTaskStatus(response6.id, 'Pending');

        //Create Critical Priority and Completed status Task
        let response7 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response8.displayId)
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'Completed', 'Successful');

        //Create High Priority and Completed status Task
        let response9 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_HIGH_PRIORITY);
        taskId.push(response10.displayId)
        await apiHelper.updateCaseStatus(response9.id, 'InProgress');
        await apiHelper.updateTaskStatus(response10.id, 'Completed', 'Successful');

        await utilGrid.applyPresetFilter('All Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('All Tasks');

        for (let i: number = 0; i < 5; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 5; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

    }, 250 * 1000);

    it('[DRDMV-20889]: Validate the All Open Breached Tasks filter after applying and removing the filter', async () => {
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        let taskId: string[] = [];
        await apiHelper.createSVT(taskData.SERVICE_TARGET_ASSIGNED_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_INPROGRESS_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_PENDING_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_CANCELED_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_FAILED_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_COMPLETED_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_BEFORECOMPLETED_TASK);
        await apiHelper.createSVT(taskData.SERVICE_TARGET_AFTERCOMPLETED_TASK);

        let response5 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response6 = await apiHelper.createAdhocTask(response5.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response6.displayId);
        await apiHelper.updateCaseStatus(response5.id, 'InProgress');
        await apiHelper.updateTaskStatus(response6.id, 'Completed', 'Successful');

        let response9 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response10 = await apiHelper.createAdhocTask(response9.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response10.displayId);
        await apiHelper.updateCaseStatus(response9.id, 'InProgress');
        await apiHelper.updateTaskStatus(response10.id, 'Canceled');

        let response11 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response12 = await apiHelper.createAdhocTask(response11.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response12.displayId);
        await apiHelper.updateCaseStatus(response11.id, 'InProgress');
        await apiHelper.updateTaskStatus(response12.id, 'Completed', 'Successful');
        await apiHelper.updateTaskStatus(response12.id, 'AfterCompleted');

        let randomString1: string = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName = taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY.templateName + randomString1;
        await apiHelper.createAutomatedTaskTemplate(taskData.FAILED_TASK_TEMPLATE_CRITICAL_PRIORITY);
        let response13 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName = taskData.CREATE_TASK_FROM_TASK_TEMPLATE.templateName + randomString1;
        let response14 = await apiHelper.addTaskToCase(taskData.CREATE_TASK_FROM_TASK_TEMPLATE, response13.id);
        await apiHelper.apiLogin('tadmin');
        taskId.push(await (await apiHelper.getCreatedTaskIds(response14)).displayId);
        await apiHelper.apiLoginWithCredential('idphylum1@petramco.com', 'Password_1234');
        await apiHelper.updateCaseStatus(response13.id, 'InProgress');

        let response1 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response2 = await apiHelper.createAdhocTask(response1.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response2.displayId);
        await apiHelper.updateCaseStatus(response1.id, 'InProgress');
        await apiHelper.updateTaskStatus(response2.id, 'InProgress');

        let response3 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response4 = await apiHelper.createAdhocTask(response3.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response4.displayId);
        await apiHelper.updateCaseStatus(response3.id, 'InProgress');
        await apiHelper.updateTaskStatus(response4.id, 'Pending');

        let response7 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response8 = await apiHelper.createAdhocTask(response7.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response8.displayId);
        await apiHelper.updateCaseStatus(response7.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'InProgress');
        await apiHelper.updateTaskStatus(response8.id, 'BeforeCompleted');

        let response15 = await apiHelper.createCase(taskData.ASSIGNED_CRITICAL);
        let response16 = await apiHelper.createAdhocTask(response15.id, taskData.TASK_DATA_CRITICAL_PRIORITY);
        taskId.push(response16.displayId);
        await apiHelper.updateCaseStatus(response15.id, 'InProgress');

        await utilGrid.applyPresetFilter('All Open Breached Tasks');
        expect(await utilGrid.getAppliedFilterName()).toBe('All Open Breached Tasks');

        await browser.sleep(130000);
        await browser.refresh();
        expect(await utilGrid.isGridRecordPresent(taskId[7])).toBeFalsy(taskId[7] + ' :Record is available');

        browser.sleep(120000);
        await browser.refresh();
        for (let i: number = 4; i < 7; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }

        for (let i: number = 0; i < 4; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeFalsy(taskId[i] + ' :Record is available');
        }

        await utilGrid.clearFilter();

        for (let i: number = 0; i < 7; i++) {
            expect(await utilGrid.isGridRecordPresent(taskId[i])).toBeTruthy(taskId[i] + ' :Record is not available');
        }
    }, 660 * 1000);
})