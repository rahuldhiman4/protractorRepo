import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import caseConsolePo from '../../pageobject/case/case-console.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import activityTabPage from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';

import updateStatusBladePo  from '../../pageobject/common/update.status.blade.po';
import viewTaskPo from "../../pageobject/task/view-task.po";

describe('Case Activity', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-16756]:Validate Show More/Less option in Task Activity Tab', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues1 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNoteBodyText1 = `${randomValues1}\n${randomValues1}\n${randomValues1}\n${randomValues1}\n${randomValues1}`;
        let addNoteBodyText2 = `${randomValues1}\n${randomValues1}\n${randomValues1}\n${randomValues1}\n${randomValues1}\n${randomValues1}`;

        let filePath:string[]=['../../data/ui/attachment/articleStatus.png','../../data/ui/attachment/bwfJpg.jpg','../../data/ui/attachment/bwfJpg2.jpg','../../data/ui/attachment/bwfJpg3.jpg','../../data/ui/attachment/bwfJson1.json','../../data/ui/attachment/bwfJson2.json','../../data/ui/attachment/bwfJson3.json','../../data/ui/attachment/bwfJson4.json','../../data/ui/attachment/bwfJson5.json'];
        // Create Case
        let caseData = {
            "Requester": "Fritz",
            "Summary": "DRDMV-16730_TC" + summary,
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 3",
            "Assignee": "qfeng"
        }

        await apiHelper.apiLogin('qkatawazi');
        let newCase = await apiHelper.createCase(caseData);
        let caseId: string = newCase.displayId;

        // Create manual task template
        let manualTemplateData = {
            "templateName": "DRDMV-16756 template" + summary,
            "templateSummary": "DRDMV-16756_Manual_task template summary" + summary,
            "templateStatus": "Active",
            "taskCompany": '- Global -',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.createManualTaskTemplate(manualTemplateData);

        await caseConsolePo.searchAndOpenCase(caseId);
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
        await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);

        // Verify logs with 5 lines or less than 5 lines
        await activityTabPage.addActivityNote(addNoteBodyText1);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg1: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg2: Show more link is displayed');
        // Verify logs with more than 5 lines
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg3: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg4: Show more link is displayed');
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg5: BodyText is missing');
        expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg6: Show less missing for body text');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg7: Show more link is displayed');
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg8: BodyText is missing');
        // Verify logs with 5 lines  with 3 attachment
        await activityTabPage.addActivityNote(addNoteBodyText1);
        await activityTabPage.addAttachment([filePath[0], filePath[1]]);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg12: Show more link for attachment is missing')
        expect(await activityTabPage.isAttachedFileNameDisplayed('articleStatus.png')).toBeTruthy(`FailureMsg9: ${filePath[0]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy(`FailureMsg10: ${filePath[1]} is missing`);
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg13: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg14: Show more link is displayed');
        // Verify logs with more than 5 lines  with 3 attachment
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.addAttachment([filePath[2], filePath[3]]);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg18: Show more link for attachment is missing')
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy(`FailureMsg15: ${filePath[2]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg3.jpg')).toBeTruthy(`FailureMsg16: ${filePath[3]} is missing`);
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg19: Show more link is displayed');
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg20: BodyText is missing');
        expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg21: Show less missing for body text');
        // Verify logs with more than 5 lines  with more than 4 attachment
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.addAttachment([filePath[4], filePath[5], filePath[6], filePath[7], filePath[8]]);

        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg22: BodyText is missing');
        expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg23: Show More missing for body text');
        expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg24: Show more link for attachment is missing')
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg25: BodyText is missing');
        expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg43: ShowLess link is missing')
        expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg26: BodyText is missing');

        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson1.json')).toBeTruthy(`FailureMsg27: ${filePath[4]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson2.json')).toBeTruthy(`FailureMsg28: ${filePath[5]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson3.json')).toBeTruthy(`FailureMsg29: ${filePath[6]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson4.json')).toBeTruthy(`FailureMsg30: ${filePath[7]} is missing`);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson5.json')).toBeTruthy(`FailureMsg31: ${filePath[8]} is missing`);

        // Download Attachments Files
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson1.json')).toBeTruthy('FailureMsg32: bwfJson1.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson1.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson1.json')).toBeTruthy('FailureMsg33.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson2.json')).toBeTruthy('FailureMsg34: bwfJson2.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson2.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson2.json')).toBeTruthy('FailureMsg35: bwfJson2.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson3.json')).toBeTruthy('FailureMsg36: bwfJson3.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson3.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson3.json')).toBeTruthy('FailureMsg37: bwfJson3.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson4.json')).toBeTruthy('FailureMsg38: bwfJson4.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson4.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson4.json')).toBeTruthy('FailureMsg39: bwfJson4.json File is not downloaded.');

        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson5.json')).toBeTruthy('FailureMsg40: bwfJson5.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson5.json')
        expect(await utilityCommon.isFileDownloaded('bwfJson5.json')).toBeTruthy('FailureMsg41: bwfJson5.json File is not downloaded.');

        expect(activityTabPage.clickShowLessLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg42: Show less link for attachment is missing');

    });
})
