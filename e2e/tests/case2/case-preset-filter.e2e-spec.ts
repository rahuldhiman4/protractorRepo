import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import * as caseData from "../../data/ui/case/presetFilter.data.ui";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import statusConfig from "../../pageobject/settings/common/status-config.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import dbConnectObj from '../../utils/utility.db-connect';
import utilityGrid from "../../utils/utility.grid";

describe('Case Console Preset Filter', () => {

    const userId1 = "idphylum1@petramco.com";

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);

        //Create the Phylum users
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteServiceTargets();
        await apiHelper.deleteApprovalMapping();
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

        //Takes time to reflect created user data. So, hard wait is required here
        browser.sleep(5000);
        await loginPage.login(userId1, 'Password_1234');

        // Create the new status Configurations
        // Hard wait to reflect the Phylum Company in Case status config's Company Dropdown
        browser.sleep(6000);
        await navigationPage.gotoSettingsPage();
        await navigationPage.gotoSettingsMenuItem('Case Management--Status Configuration', 'Configure Case Status Transition - Business Workflows');
        await statusConfig.setCompanyDropdown('Phylum', 'case');
        await statusConfig.clickEditLifeCycleLink();
        await statusConfig.addCustomStatus('Resolved', 'Closed', 'AfterResolved');
        await statusConfig.addCustomStatus('In Progress', 'Resolved', 'BeforeResolved');

        //Set the user2 to VIP Requester
        await apiHelper.updatePersonAsVIP('idphylum2', 'Yes');
        await navigationPage.gotoCaseConsole();
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.updatePersonAsVIP('idphylum2', 'No');
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    it('[DRDMV-20843]: Validate the My Open Cases filter after applying and removing the filter', async () => {
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");
        let response1 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_1);
        caseId.push(response1.displayId);

        let response2 = await apiHelper.createCase(caseData.PENDING_NONVIP_DRDMV_20843_2);
        caseId.push(response2.displayId);

        let response3 = await apiHelper.createCase(caseData.INPROGRESS_NONVIP_DRDMV_20843_3);
        caseId.push(response3.displayId);

        let response4 = await apiHelper.createCase(caseData.ASSIGNED_VIP_DRDMV_20843_4);
        caseId.push(response4.displayId);

        let response10 = await apiHelper.createCase(caseData.BEFORERESOLVED_NONVIP_DRDMV_20843_7);
        caseId.push(response10.displayId);

        let response5 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_1);
        caseId.push(response5.displayId);
        let caseGuid1 = response5.id;
        await apiHelper.updateCaseStatus(caseGuid1, 'Resolved', 'Auto Resolved');

        let response6 = await apiHelper.createCase(caseData.INPROGRESS_NONVIP_DRDMV_20843_3);
        caseId.push(response6.displayId);
        let caseGuid2 = response6.id;
        await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

        let response7 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_1);
        caseId.push(response7.displayId);
        let caseGuid3 = response7.id;
        await apiHelper.updateCaseStatus(caseGuid3, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'AfterResolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'Closed');

        let response8 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_5);
        caseId.push(response8.displayId);

        let response9 = await apiHelper.createCase(caseData.PENDING_NONVIP_DRDMV_20843_6);
        caseId.push(response9.displayId);

        let response11 = await apiHelper.createCase(caseData.AFTERRESOLVED_NONVIP_DRDMV_20843_8);
        caseId.push(response11.displayId);

        await utilityGrid.clickRefreshIcon();
        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 11; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        await utilityGrid.applyPresetFilter('My Open Cases');
        expect(await utilityGrid.getAppliedFilterName()).toBe('My Open Cases');

        for (let i: number = 0; i < 5; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        for (let i: number = 5; i < 11; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 11; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

    });

    it('[DRDMV-20850]: Validate the VIP Open Cases filter after applying and removing the filter', async () => {
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.NEW_VIP_DRDMV_20850_1);
        caseId.push(response1.displayId);

        let response2 = await apiHelper.createCase(caseData.ASSIGNED_VIP_DRDMV_20850_2);
        caseId.push(response2.displayId);

        let response3 = await apiHelper.createCase(caseData.INPROGRESS_VIP_DRDMV_20850_3);
        caseId.push(response3.displayId);

        let response4 = await apiHelper.createCase(caseData.PENDING_VIP_DRDMV_20850_4);
        caseId.push(response4.displayId);

        let response9 = await apiHelper.createCase(caseData.BEFORERESOLVED_VIP_DRDMV_20850_5);
        caseId.push(response9.displayId);

        let response5 = await apiHelper.createCase(caseData.INPROGRESS_VIP_DRDMV_20850_3);
        caseId.push(response5.displayId);
        let caseGuid1 = response5.id;
        await apiHelper.updateCaseStatus(caseGuid1, 'Pending');
        await apiHelper.updateCaseStatus(caseGuid1, 'Resolved', 'Auto Resolved');

        let response6 = await apiHelper.createCase(caseData.INPROGRESS_VIP_DRDMV_20850_3);
        caseId.push(response6.displayId);
        let caseGuid2 = response6.id;
        await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

        let response7 = await apiHelper.createCase(caseData.ASSIGNED_VIP_DRDMV_20850_2);
        caseId.push(response7.displayId);
        let caseGuid3 = response7.id;
        await apiHelper.updateCaseStatus(caseGuid3, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'AfterResolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'Closed');

        let response8 = await apiHelper.createCase(caseData.PENDING_NONVIP_DRDMV_20843_6);
        caseId.push(response8.displayId);

        let response10 = await apiHelper.createCase(caseData.AFTERRESOLVED_NONVIP_DRDMV_20850_6);
        caseId.push(response10.displayId);

        await utilityGrid.applyPresetFilter('VIP Open Cases');
        expect(await utilityGrid.getAppliedFilterName()).toBe('VIP Open Cases');

        for (let i: number = 0; i < 5; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        for (let i: number = 5; i < 10; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 10; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

    });

    it('[DRDMV-20874]: Validate the All Open Cases filter after applying and removing the filter', async () => {
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.NEW_NONVIP_DRDMV_20874_1);
        caseId.push(response1.displayId);

        let response2 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_1);
        caseId.push(response2.displayId);

        let response3 = await apiHelper.createCase(caseData.INPROGRESS_NONVIP_DRDMV_20843_3);
        caseId.push(response3.displayId);

        let response4 = await apiHelper.createCase(caseData.PENDING_NONVIP_DRDMV_20843_2);
        caseId.push(response4.displayId);

        let response8 = await apiHelper.createCase(caseData.ASSIGNED_VIP_DRDMV_20850_2);
        caseId.push(response8.displayId);

        let response9 = await apiHelper.createCase(caseData.BEFORERESOLVED_NONVIP_DRDMV_20843_7);
        caseId.push(response9.displayId);

        let response5 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_1);
        caseId.push(response5.displayId);
        let caseGuid1 = response5.id;
        await apiHelper.updateCaseStatus(caseGuid1, 'Resolved', 'Auto Resolved');

        let response6 = await apiHelper.createCase(caseData.INPROGRESS_NONVIP_DRDMV_20843_3);
        caseId.push(response6.displayId);
        let caseGuid2 = response6.id;
        await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

        let response7 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_1);
        caseId.push(response7.displayId);
        let caseGuid3 = response7.id;
        await apiHelper.updateCaseStatus(caseGuid3, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'AfterResolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'Closed');

        let response10 = await apiHelper.createCase(caseData.AFTERRESOLVED_NONVIP_DRDMV_20843_8);
        caseId.push(response10.displayId);

        await utilityGrid.applyPresetFilter('All Open Cases');
        expect(await utilityGrid.getAppliedFilterName()).toBe('All Open Cases');

        for (let i: number = 0; i < 6; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        for (let i: number = 6; i < 10; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 10; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
    });

    it('[DRDMV-20875]: Validate the High Priority Open Cases filter after applying and removing the filter', async () => {
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.ASSIGNED_LOWPRIORITY_DRDMV_20875_1);
        caseId.push(response1.displayId);

        let response2 = await apiHelper.createCase(caseData.ASSIGNED_MEDIIUMPRIORITY_DRDMV_20875_2);
        caseId.push(response2.displayId);

        let response3 = await apiHelper.createCase(caseData.ASSIGNED_CRITICALPRIORITY_DRDMV_20875_3);
        caseId.push(response3.displayId);

        let response4 = await apiHelper.createCase(caseData.ASSIGNED_HIGHPRIORITY_DRDMV_20875_4);
        caseId.push(response4.displayId);
        let caseGuid1 = response4.id;
        await apiHelper.updateCaseStatus(caseGuid1, 'Resolved', 'Auto Resolved');

        let response5 = await apiHelper.createCase(caseData.ASSIGNED_HIGHPRIORITY_DRDMV_20875_4);
        caseId.push(response5.displayId);
        let caseGuid2 = response5.id;
        await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

        let response6 = await apiHelper.createCase(caseData.ASSIGNED_HIGHPRIORITY_DRDMV_20875_4);
        caseId.push(response6.displayId);
        let caseGuid3 = response6.id;
        await apiHelper.updateCaseStatus(caseGuid3, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'AfterResolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'Closed');

        let response12 = await apiHelper.createCase(caseData.AFTERRESOLVED_HIGHPRIORITY_DRDMV_20875_9);
        caseId.push(response12.displayId);

        let response7 = await apiHelper.createCase(caseData.NEW_HIGHPRIORITY_DRDMV_20875_5);
        caseId.push(response7.displayId);

        let response8 = await apiHelper.createCase(caseData.ASSIGNED_HIGHPRIORITY_DRDMV_20875_4);
        caseId.push(response8.displayId);

        let response9 = await apiHelper.createCase(caseData.INPROGRESS_HIGHPRIORITY_DRDMV_20875_6);
        caseId.push(response9.displayId);

        let response10 = await apiHelper.createCase(caseData.PENDING_HIGHPRIORITY_DRDMV_20875_7);
        caseId.push(response10.displayId);

        let response11 = await apiHelper.createCase(caseData.BEFORERESOLVED_HIGHPRIORITY_DRDMV_20875_8);
        caseId.push(response11.displayId);

        await utilityGrid.applyPresetFilter('High Priority Open Cases');
        expect(await utilityGrid.getAppliedFilterName()).toBe('High Priority Open Cases');

        for (let i: number = 7; i < 12; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        for (let i: number = 0; i < 7; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 12; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
    });

    it('[DRDMV-20878]: Validate the Critical Priority Open Cases filter after applying and removing the filter', async () => {
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.ASSIGNED_LOWPRIORITY_DRDMV_20878_1);
        caseId.push(response1.displayId);

        let response2 = await apiHelper.createCase(caseData.ASSIGNED_MEDIIUMPRIORITY_DRDMV_20878_2);
        caseId.push(response2.displayId);

        let response3 = await apiHelper.createCase(caseData.ASSIGNED_HIGHPRIORITY_DRDMV_20878_4);
        caseId.push(response3.displayId);

        let response4 = await apiHelper.createCase(caseData.ASSIGNED_CRITICALPRIORITY_DRDMV_20878_3);
        caseId.push(response4.displayId);
        let caseGuid1 = response4.id;
        await apiHelper.updateCaseStatus(caseGuid1, 'Resolved', 'Auto Resolved');

        let response5 = await apiHelper.createCase(caseData.ASSIGNED_CRITICALPRIORITY_DRDMV_20878_3);
        caseId.push(response5.displayId);
        let caseGuid2 = response5.id;
        await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

        let response6 = await apiHelper.createCase(caseData.ASSIGNED_CRITICALPRIORITY_DRDMV_20878_3);
        caseId.push(response6.displayId);
        let caseGuid3 = response6.id;
        await apiHelper.updateCaseStatus(caseGuid3, 'Resolved', 'Auto Resolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'AfterResolved');
        await apiHelper.updateCaseStatus(caseGuid3, 'Closed');

        let response12 = await apiHelper.createCase(caseData.AFTERRESOLVED_CRITCIALPRIORITY_DRDMV_20878_9);
        caseId.push(response12.displayId);

        let response7 = await apiHelper.createCase(caseData.NEW_CRITICALPRIORITY_DRDMV_20878_5);
        caseId.push(response7.displayId);

        let response8 = await apiHelper.createCase(caseData.ASSIGNED_CRITICALPRIORITY_DRDMV_20878_3);
        caseId.push(response8.displayId);

        let response9 = await apiHelper.createCase(caseData.INPROGRESS_CRITICALPRIORITY_DRDMV_20878_6);
        caseId.push(response9.displayId);

        let response10 = await apiHelper.createCase(caseData.PENDING_CRITICALPRIORITY_DRDMV_20878_7);
        caseId.push(response10.displayId);

        let response11 = await apiHelper.createCase(caseData.BEFORERESOLVED_CRITICALPRIORITY_DRDMV_20878_8);
        caseId.push(response11.displayId);

        await utilityGrid.applyPresetFilter('Critical Priority Open Cases');
        expect(await utilityGrid.getAppliedFilterName()).toBe('Critical Priority Open Cases');

        for (let i: number = 7; i < 12; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        for (let i: number = 0; i < 7; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 12; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

    });

    it('[DRDMV-20879]: Validate the All Unassigned Cases filter after applying and removing the filter', async () => {
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOLOGGEDINUSER_DRDMV_20879_1);
        caseId.push(response1.displayId);

        let response3 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response3.displayId);

        let response2 = await apiHelper.createCase(caseData.ASSIGNED_ASSIGNEDTOGROUP_DRDMV_20879_2);
        caseId.push(response2.displayId);

        await utilityGrid.applyPresetFilter('All Unassigned Cases');
        expect(await utilityGrid.getAppliedFilterName()).toBe('All Unassigned Cases');

        expect(await utilityGrid.isGridRecordPresent(caseId[2])).toBeTruthy(caseId[2] + ' :Record is not available');

        for (let i: number = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
        }

        await utilityGrid.clearFilter();

        for (let i: number = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
    });

    describe('[DRDMV-20881]: Validate the All Open Breached Cases filter after applying and removing the filter', () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLoginWithCredential(userId1, "Password_1234");
            await apiHelper.createSVT(caseData.SERVICE_TARGET_ASSIGNED);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_INPROGRESS);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_PENDING);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_CANCELED);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_RESOLVED);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_CUSTOMSTATUS1);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_CUSTOMSTATUS2);

            let response5 = await apiHelper.createCase(caseData.AFTERRESOLVED_CRITICAL);
            caseId.push(response5.displayId);

            let response3 = await apiHelper.createCase(caseData.RESOLVED_CRITICAL);
            caseId.push(response3.displayId);

            let response7 = await apiHelper.createCase(caseData.ASSIGNED_CRITICAL);
            caseId.push(response7.displayId);
            let caseGuid2 = response7.id;
            await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

            let response1 = await apiHelper.createCase(caseData.INPROGRESS_CRITICAL);
            caseId.push(response1.displayId);

            let response2 = await apiHelper.createCase(caseData.PENDING_CRITICAL);
            caseId.push(response2.displayId);

            let response4 = await apiHelper.createCase(caseData.BEFORERESOLVED_CRITICAL);
            caseId.push(response4.displayId);

            let response6 = await apiHelper.createCase(caseData.ASSIGNED_CRITICAL);
            caseId.push(response6.displayId);

            //Waiting for SVT to reach 50% SLA Time
            browser.sleep(130000);
        });

        it('[DRDMV-20881]: Validate the All Open Breached Cases filter after applying and removing the filter', async () => {
            await utilityGrid.applyPresetFilter('All Open Breached Cases');
            expect(await utilityGrid.getAppliedFilterName()).toBe('All Open Breached Cases');
            expect(await utilityGrid.isGridRecordPresent(caseId[5])).toBeFalsy(caseId[5] + ' :Record is available');

            //Waiting for SVT to Breached
            browser.sleep(120000);
            for (let i: number = 0; i < 3; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
            for (let i: number = 3; i < 7; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });
    });

    describe('[DRDMV-22214]: Validate the My Open Breached Cases filter after applying and removing the filter', () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLoginWithCredential(userId1, "Password_1234");
            await apiHelper.createSVT(caseData.SERVICE_TARGET_NEW);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_ASSIGNED);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_INPROGRESS);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_PENDING);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_CANCELED);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_RESOLVED);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_CUSTOMSTATUS1);
            await apiHelper.createSVT(caseData.SERVICE_TARGET_CUSTOMSTATUS2);

            //Displayed cases after applying filter
            let response1 = await apiHelper.createCase(caseData.INPROGRESS_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response1.displayId);

            let response2 = await apiHelper.createCase(caseData.PENDING_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response2.displayId);

            let response4 = await apiHelper.createCase(caseData.BEFORERESOLVED_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response4.displayId);

            let response6 = await apiHelper.createCase(caseData.ASSIGNED_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response6.displayId);

            //Filtered out cases after applying Filter
            let response5 = await apiHelper.createCase(caseData.AFTERRESOLVED_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response5.displayId);

            let response3 = await apiHelper.createCase(caseData.RESOLVED_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response3.displayId);

            let response7 = await apiHelper.createCase(caseData.ASSIGNED_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response7.displayId);
            let caseGuid2 = response7.id;
            await apiHelper.updateCaseStatus(caseGuid2, 'Canceled', 'Customer Canceled');

            let response8 = await apiHelper.createCase(caseData.ASSIGNED_CRITICAL);
            caseId.push(response8.displayId);

            let response9 = await apiHelper.createCase(caseData.NEW_CRITICAL_ASSIGNEDTOLOGGEDINUSER);
            caseId.push(response9.displayId);
            browser.sleep(120000);

        });

        it('[DRDMV-22214]: Validate the My Open Breached Cases filter after applying and removing the filter', async () => {
            await utilityGrid.applyPresetFilter('My Open Breached Cases');
            expect(await utilityGrid.getAppliedFilterName()).toBe('My Open Breached Cases');

            //Waiting for SVT to Breached
            browser.sleep(130000);
            for (let i: number = 0; i < 4; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
            for (let i: number = 4; i < 9; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeFalsy(caseId[i] + ' :Record is available');
            }
            await utilityGrid.clearFilter();
            for (let i: number = 0; i < 9; i++) {
                expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
            }
        });
    });

    it('[DRDMV-20880]: Validate the All Cases In Last 1 month filter after applying and removing the filter', async () => {
        let dbConnectVar = await dbConnectObj.dbConnect();
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_5);
        caseId.push(response1.displayId);
        let displayId1 = response1.displayId;

        let response3 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response3.displayId);
        let displayId3 = response3.displayId;

        let response4 = await apiHelper.createCase(caseData.ASSIGNED_NONVIP_DRDMV_20843_5);
        caseId.push(response4.displayId);
        let displayId4 = response4.displayId;

        let response2 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response2.displayId);
        let displayId2 = response2.displayId;

        let dateForCase1 = await utilityCommon.getOldDate(27);
        let dateEpochValueCase1 = await dbConnectObj.dateEpochConverter(dateForCase1);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase1}' WHERE display_id='${displayId1}'`);

        let dateForCase2 = await utilityCommon.getOldDate(35);
        let dateEpochValueCase2 = await dbConnectObj.dateEpochConverter(dateForCase2);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase2}' WHERE display_id='${displayId2}'`);

        let dateForCase3 = await utilityCommon.getOldDate(25);
        let dateEpochValueCase3 = await dbConnectObj.dateEpochConverter(dateForCase3);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase3}' WHERE display_id='${displayId3}'`);

        let dateForCase4 = await utilityCommon.getOldDate(33);
        let dateEpochValueCase4 = await dbConnectObj.dateEpochConverter(dateForCase4);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase4}' WHERE display_id='${displayId4}'`);

        await dbConnectObj.dbConnectionEnd(dbConnectVar);

        await utilityGrid.clearFilter();
        await utilityGrid.applyPresetFilter('All Cases In Last 1 month');
        expect(await utilityGrid.getAppliedFilterName()).toBe('All Cases In Last 1 month');

        for (let i: number = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }

        for (let i: number = 2; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[3])).toBeFalsy(caseId[3] + ' :Record is available');
        }

        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
    });

    it('[DRDMV-20900]: Validate the All Cases In Last 3 months filter after applying and removing the filter', async () => {
        let dbConnectVar = await dbConnectObj.dbConnect();
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response1.displayId);
        let displayId1 = response1.displayId;

        let response2 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response2.displayId);
        let displayId2 = response2.displayId;

        let response3 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response3.displayId);
        let displayId3 = response3.displayId;

        let dateForCase1 = await utilityCommon.getOldDate(88);
        let dateEpochValueCase1 = await dbConnectObj.dateEpochConverter(dateForCase1);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase1}' WHERE display_id='${displayId1}'`);

        let dateForCase2 = await utilityCommon.getOldDate(24);
        let dateEpochValueCase2 = await dbConnectObj.dateEpochConverter(dateForCase2);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase2}' WHERE display_id='${displayId2}'`);

        let dateForCase3 = await utilityCommon.getOldDate(100);
        let dateEpochValueCase3 = await dbConnectObj.dateEpochConverter(dateForCase3);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase3}' WHERE display_id='${displayId3}'`);

        await dbConnectObj.dbConnectionEnd(dbConnectVar);

        await utilityGrid.clearFilter();
        await utilityGrid.applyPresetFilter('All Cases  In Last 3 months');
        expect(await utilityGrid.getAppliedFilterName()).toBe('All Cases In Last 3 months');

        for (let i: number = 0; i < 2; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
        expect(await utilityGrid.isGridRecordPresent(caseId[2])).toBeFalsy(caseId[2] + ' :Record is available');

        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
    });

    it('[DRDMV-22035]: Validate the All Cases In Last 6 months filter after applying and removing the filter', async () => {
        let dbConnectVar = await dbConnectObj.dbConnect();
        let caseId: string[] = [];
        await apiHelper.apiLoginWithCredential(userId1, "Password_1234");

        let response1 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response1.displayId);
        let displayId1 = response1.displayId;

        let response3 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response3.displayId);
        let displayId3 = response3.displayId;

        let response2 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response2.displayId);
        let displayId2 = response2.displayId;

        let response4 = await apiHelper.createCase(caseData.RESOLVED_ASSIGNEDTOANOTHERUSER_DRDMV_20879_3);
        caseId.push(response4.displayId);
        let displayId4 = response4.displayId;

        let dateForCase1 = await utilityCommon.getOldDate(88);
        let dateEpochValueCase1 = await dbConnectObj.dateEpochConverter(dateForCase1);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase1}' WHERE display_id='${displayId1}'`);

        let dateForCase2 = await utilityCommon.getOldDate(24);
        let dateEpochValueCase2 = await dbConnectObj.dateEpochConverter(dateForCase2);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase2}' WHERE display_id='${displayId2}'`);

        let dateForCase3 = await utilityCommon.getOldDate(150);
        let dateEpochValueCase3 = await dbConnectObj.dateEpochConverter(dateForCase3);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase3}' WHERE display_id='${displayId3}'`);

        let dateForCase4 = await utilityCommon.getOldDate(200);
        let dateEpochValueCase4 = await dbConnectObj.dateEpochConverter(dateForCase4);
        await dbConnectVar.query(`UPDATE com_bmc_dsm_case_lib_Case SET created_date = '${dateEpochValueCase4}' WHERE display_id='${displayId4}'`);

        await dbConnectObj.dbConnectionEnd(dbConnectVar);

        await utilityGrid.clearFilter();
        await utilityGrid.applyPresetFilter('All Cases  In Last 6 months');
        expect(await utilityGrid.getAppliedFilterName()).toBe('All Cases In Last 6 months');

        for (let i: number = 0; i < 3; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
        expect(await utilityGrid.isGridRecordPresent(caseId[3])).toBeFalsy(caseId[3] + ' :Record is available');

        await utilityGrid.clearFilter();
        for (let i: number = 0; i < 4; i++) {
            expect(await utilityGrid.isGridRecordPresent(caseId[i])).toBeTruthy(caseId[i] + ' :Record is not available');
        }
    });
});
