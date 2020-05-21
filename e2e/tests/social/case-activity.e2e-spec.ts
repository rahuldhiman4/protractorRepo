import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { ITaskTemplate } from '../../data/api/interface/task.template.interface.api';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCase from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import caseAccessTabPo from '../../pageobject/common/case-access-tab.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePo from '../../pageobject/common/person-profile.po';
import relatedCaseTab from '../../pageobject/common/related-case-tab.po';
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import feedbackBladeKnowledgeArticlePo from '../../pageobject/knowledge/feedback-blade-Knowledge-article.po';
import flagUnflagKnowledgePo from '../../pageobject/knowledge/flag-unflag-knowledge.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import reviewCommentsPo from '../../pageobject/knowledge/review-comments.po';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';
import notificationPo from '../../pageobject/notification/notification.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilityCommon from '../../utils/utility.common';
import quickCasePo from '../../pageobject/case/quick-case.po';
import utilityGrid from '../../utils/utility.grid';

describe('Case Activity', () => {

    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //kgaikwad
    it('[DRDMV-16767]: KA Activity Filter UI validation', async () => {
        try {
            // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16767');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilityCommon.switchToNewTab(1);
            await utilityCommon.refresh();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            // 2nd Step: Inspect Case Activity UI - Click on Filter       
            await activityTabPage.clickOnFilterButton();
            // 3rd Step: Inspect Filter Panel UI
            // i) - Clear, Apply button (Apply button is disabled until any filter is selected)
            expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            // ii) - Case Filter options-->  -- General Notes -- Status Change -- Emails -- Assignment Change -- Relationship Change -- Approvals -- Category Change -- Case Views -- Task Activities - External Filter options -- Public - Author -- Search field for Author search
            expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes'), 'General Notes is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Unflag')).toBe('Unflag'), 'Unflag is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");
            // 4th Step: Check box is selected/unselect and Apply button is enabled/disable.   
            await activityTabPage.selectFilterCheckBox('General Notes');
            expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            // 5th step: Select some filters and click on Apply
            // i)Selected Filters are applied and filter panel is closed.
            expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.selectFilterCheckBox('Flag');
            await activityTabPage.selectFilterCheckBox('Unflag');
            await activityTabPage.selectFilterCheckBox('Feedback');
            await activityTabPage.addAuthorOnFilter('Angelina Jolie');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
            // ii) Selected Filters are displayed in Activity with first filter and + other selected filters
            expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextFromFilterList('Unflag')).toBe('Unflag'), 'Unflag is missing';
            expect(await activityTabPage.getTextFromFilterList('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie'), 'Author: ajolie is missing';
            // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
            await activityTabPage.closeNmoreLink();
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
            await activityTabPage.removeFilterList();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
            await activityTabPage.closeNmoreLink();
            // await utilCommon.waitUntilSpinnerToHide();
            // iv)- Click on + n more button (- Selected filter list is displayed )
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextFromFilterList('Unflag')).toBe('Unflag'), 'Assignment Change is missing';
            expect(await activityTabPage.getTextFromFilterList('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie'), 'Author: ajolie is missing';
            await activityTabPage.closeNmoreLink();
            //  v) - That particular filter is removed.
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            await activityTabPage.removeFilterList();
            expect(await activityTabPage.isfilterListDisplayed('Flag')).toBeFalsy('Flag displayed');
            // await utilCommon.waitUntilSpinnerToHide();
            // 6) All filters are removed.
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.clickOnFilterClearButton();
            expect(await activityTabPage.isfilterPresent()).toBeFalsy('filter displayed');
        } catch (e) {
            throw e;
        } finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });//, 150 * 1000);

    //kgaikwad
    it('[DRDMV-18141]: Clicking on any tagged person name from Activity tab should navigate us to Persons Profile', async () => {
        let caseBodyText = `CaseBody${randomStr}`;
        // 2nd Step :Open Case from pre condition and inspect its activities
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-18141');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await activityTabPage.addActivityNote(caseBodyText);
        await activityTabPage.addPersonInActivityNote('Elizabeth Jeffries');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperlinkOfActivityDisplay(caseBodyText, 'Elizabeth Jeffries')).toBeTruthy('PersonName is not displayed correctly');
        await activityTabPage.clickOnHyperlinkFromActivity(1, 'Elizabeth Jeffries');
        expect(await personProfilePo.getPersonName()).toBe('Elizabeth Jeffries'), 'Elizabeth Jeffries name is missing';
    });

    //kgaikwad
    it('[DRDMV-16768]: From KA Activity Filters > Person search behavior in Author field', async () => {
        try {
            // 1st step: Logged in successfully and Task profile gets opened
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16768');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilityCommon.switchToNewTab(1);
            await utilityCommon.refresh();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            // 2nd step: From Task Activity > Click on Filter and In Author filter > Search for all type of users from pre condition who have added comment in Task
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.addAuthorOnFilter('Elizabeth Peters');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Fritz Schulz');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Frieda Hoffmann');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Franz Schwarz');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Morwenna Rosales');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Hannah Haas');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Quigley Heroux');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Samuel Badree');
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Sapphire Blue');
            await activityTabPage.removeAuthorFromFilter();
            // 3rd Step: In Author field search for User using *First Name*, *Last Name*, *Email*, *Login ID*, and *Person ID*
            await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Steyn');//LastName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('aborder@petramco.com');//Email        
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('qtao');//Login ID
            await activityTabPage.removeAuthorFromFilter();
            // 4th Step: Search for User and inspect returned results.
            await activityTabPage.searchAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isImgPresentOnUserPopUp()).toBeTruthy('Img is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPersonNamePresentOnUserPopUp('Angelina Jolie')).toBeTruthy('Name is Not Present On Author List PopUp');
            await expect(await activityTabPage.isEmailPresentOnUserPopUp('ajolie@petramco.com')).toBeTruthy('Email is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPhoneNumberPresentOnUserPopUp('+12124021501')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
            await expect(await activityTabPage.isCompanyPresentOnUserPopUp('Petramco')).toBeTruthy('Company is Not Present On Author List PopUp');
            await activityTabPage.clearAuthorSearchBoxOnFilter();
            // 5th Step: User is selected and Author field gets disabled.
            await activityTabPage.addAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
            // i)- Click on x button from author field (- Field gets cleared and enabled to search another user)
            await activityTabPage.removeAuthorFromFilter();
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
            // ii) - Select another user and click on Apply
            await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
        } catch (e) {
            throw e;
        } finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    }, 350 * 1000);

    //kgaikwad
    it('[DRDMV-16773]: [-ve] - Person details displayed in Activity who have long name', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create manual task template
            let manualTemplateData = {
                "templateName": "DRDMV-16773_task template" + summary,
                "templateSummary": "DRDMV-16773_Manual_task template summary" + summary,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            let caseBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let taskBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgeBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // 2nd Step :Open Case from pre condition and inspect its activities
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16773');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await activityTabPage.addActivityNote(caseBodyText);
            await activityTabPage.addPersonInActivityNote('Jacqueline Featherstonehaugh');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(caseBodyText, 'Jacqueline Featherstonehaugh')).toBeTruthy('PersonName is not displayed correctly');
            // 2nd Step: Open Task from pre condition and inspect its activities
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateName);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTemplateData.templateSummary);
            await activityTabPage.addActivityNote(taskBodyText);
            await activityTabPage.addPersonInActivityNote('Jacqueline Featherstonehaugh');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(taskBodyText, 'Jacqueline Featherstonehaugh')).toBeTruthy('PersonName is not displayed correctly');
            // 3rd Step: Open KA from pre condition and inspect its activities
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge page title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16773');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilCommon.switchToNewWidnow(1);
            await utilityCommon.refresh();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPage.addActivityNote(knowledgeBodyText);
            await activityTabPage.addPersonInActivityNote('Jacqueline Featherstonehaugh');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(knowledgeBodyText, 'Jacqueline Featherstonehaugh')).toBeTruthy('PersonName is not displayed correctly');
        } catch (e) {
            throw e;
        } finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    }, 600 * 1000);

    //kgaikwad
    it('[DRDMV-16733]: Case Activity Filter UI validation', async () => {
        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16733');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        // 2nd Step: Inspect Case Activity UI - Click on Filter       
        await activityTabPage.clickOnFilterButton();
        // 3rd Step: Inspect Filter Panel UI
        // i) - Clear, Apply button (Apply button is disabled until any filter is selected)
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
        // ii) - Case Filter options-->  -- General Notes -- Status Change -- Emails -- Assignment Change -- Relationship Change -- Approvals -- Category Change -- Case Views -- Task Activities - External Filter options -- Public - Author -- Search field for Author search
        await expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes'), 'General Notes is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Emails')).toBe('Emails'), 'Emails is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Assignment Change')).toBe('Assignment Change'), 'Assignment Change is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Relationship Change')).toBe('Relationship Change'), 'Relationship Change is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Approvals')).toBe('Approvals'), 'Approvals is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Category Change')).toBe('Category Change'), 'Category Change is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Case Views')).toBe('Case Views'), 'Case Views is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Task Activities')).toBe('Task Activities'), 'Task Activities is missing';
        await expect(await activityTabPage.getTextTaskFilterOption('Public')).toBe('Public'), 'Public is missing';
        expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");
        // 4th Step: Check box is selected/unselect and Apply button is enabled/disable.   
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // 5th step: Select some filters and click on Apply
        // i)Selected Filters are applied and filter panel is closed.
        await expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');

        await activityTabPage.selectFilterCheckBox('General Notes');
        await activityTabPage.selectFilterCheckBox('Status Change');
        await activityTabPage.selectFilterCheckBox('Assignment Change');
        await activityTabPage.selectFilterCheckBox('Category Change');
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await activityTabPage.clickOnFilterApplyButton();
        await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');

        // ii) Selected Filters are displayed in Activity with first filter and + other selected filters
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change'), 'Assignment Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change'), 'Category Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie'), 'Author : ajolie is missing';
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
        await activityTabPage.closeNmoreLink();
        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change'), 'Assignment Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change'), 'Category Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie'), 'Author : ajolie is missing';
        await activityTabPage.closeNmoreLink();
        //  v) - That particular filter is removed.
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');
        // 6) All filters are removed.
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.clickOnFilterClearButton();
        await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');
    }, 340 * 1000);

    //kgaikwad
    it('[DRDMV-16760]: From Task Activity Filters > Person search behavior in Author field', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Create manual task template
        let manualTemplateData = {
            "templateName": "DRDMV-21617_task template" + summary,
            "templateSummary": "DRDMV-21617_Manual_task template summary" + summary,
            "templateStatus": "Active",
            "taskCompany": '- Global -',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(manualTemplateData);

        // 1st step: Logged in successfully and Task profile gets opened
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16760');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTemplateData.templateSummary);
        // 2nd step: From Task Activity > Click on Filter and In Author filter > Search for all type of users from pre condition who have added comment in Task
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.addAuthorOnFilter('Elizabeth Peters');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Fritz Schulz');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Frieda Hoffmann');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Franz Schwarz');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Morwenna Rosales');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Hannah Haas');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Quigley Heroux');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Samuel Badree');
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Sapphire Blue');
        await activityTabPage.removeAuthorFromFilter();
        // 3rd Step: In Author field search for User using *First Name*, *Last Name*, *Email*, *Login ID*, and *Person ID*
        await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('Steyn');//LastName
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('aborder@petramco.com');//Email        
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('qtao');//Login ID
        await activityTabPage.removeAuthorFromFilter();
        // 4th Step: Search for User and inspect returned results.
        await activityTabPage.searchAuthorOnFilter('Angelina Jolie');
        await expect(await activityTabPage.isImgPresentOnUserPopUp()).toBeTruthy('Img is Not Present On Author List PopUp');
        await expect(await activityTabPage.isPersonNamePresentOnUserPopUp('Angelina Jolie')).toBeTruthy('Name is Not Present On Author List PopUp');
        await expect(await activityTabPage.isEmailPresentOnUserPopUp('ajolie@petramco.com')).toBeTruthy('Email is Not Present On Author List PopUp');
        await expect(await activityTabPage.isPhoneNumberPresentOnUserPopUp('+12124021501')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
        await expect(await activityTabPage.isCompanyPresentOnUserPopUp('Petramco')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
        await activityTabPage.clearAuthorSearchBoxOnFilter();
        // 5th Step: User is selected and Author field gets disabled.       
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
        // i)- Click on x button from author field (- Field gets cleared and enabled to search another user)
        await activityTabPage.removeAuthorFromFilter();
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
        // ii) - Select another user and click on Apply
        await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
    }, 270 * 1000);

    //kgaikwad
    it('[DRDMV-16734]: From Case Activity Filters > Person search behavior in Author field', async () => {
        // 1st step: Login to BWF with Case agent and open case from pre condition
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16734');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        // 2nd Step: From Case Activity > Click on Filter and In Author filter > Search for all type of users from pre condition who have added comment in Case
        // i) Verify User is able to search for any user
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await activityTabPage.removeAuthorFromFilter();
        // 3rd In Author field search for User using *First Name*, *Last Name*, *Email*, *Login ID*, and *Person ID*
        await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
        await activityTabPage.clearAuthorSearchBoxOnFilter();
        await activityTabPage.addAuthorOnFilter('Steyn');//LastName
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('aborder@petramco.com');//Email        
        await activityTabPage.removeAuthorFromFilter();
        await activityTabPage.addAuthorOnFilter('qtao');//Login ID
        await activityTabPage.removeAuthorFromFilter();
        // 4th Step: Verify in Return results, Following person details are displayed: Person Profile Image, Person Name, Company Email, Phone
        await activityTabPage.searchAuthorOnFilter('Angelina Jolie');
        await expect(await activityTabPage.isImgPresentOnUserPopUp()).toBeTruthy('Img is Not Present On Author List PopUp');
        await expect(await activityTabPage.isPersonNamePresentOnUserPopUp('Angelina Jolie')).toBeTruthy('Name is Not Present On Author List PopUp');
        await expect(await activityTabPage.isEmailPresentOnUserPopUp('ajolie@petramco.com')).toBeTruthy('Email is Not Present On Author List PopUp');
        await expect(await activityTabPage.isPhoneNumberPresentOnUserPopUp('+12124021501')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
        await expect(await activityTabPage.isCompanyPresentOnUserPopUp('Petramco')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
        await activityTabPage.clearAuthorSearchBoxOnFilter();
        // 5th Step: User is selected and Author field gets disabled 
        // i) User is selected and Author field gets disabled 
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
        // ii)- Click on x button from author field (- Field gets cleared and enabled to search another user)
        await activityTabPage.removeAuthorFromFilter();
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
        // iii) - Select another user and click on Apply
        await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
    });//, 160 * 1000);

    //kgaikwad
    it('[DRDMV-16759]: Task Activity Filter UI validation', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // Create manual task template
        let manualTemplateData = {
            "templateName": "DRDMV-21617_task template" + randomString,
            "templateSummary": "DRDMV-21617_Manual_task template summary" + randomString,
            "templateStatus": "Active",
            "taskCompany": '- Global -',
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createManualTaskTemplate(manualTemplateData);
        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('manual task test case for DRDMV-16759');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        // On view case page.
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(manualTemplateData.templateSummary);

        // 2nd step: Inspect Task Activity UI - Click on FIlter
        await activityTabPage.clickOnFilterButton();

        //3rd step: Inspect Filter Panel UI
        // i) step: - Clear, Apply button (Apply button is disabled until any filter is selected)
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // ii) step:- Verify Task Filter options ,-- General Notes, -- Status Change, -- Assignment Change, -- Category Change
        await expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextTaskFilterOption('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextTaskFilterOption('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextTaskFilterOption('Category Change')).toBe('Category Change');
        // iii) step:- -- Search field for Author search
        await expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");

        // 4th step: Click on a filter option, - Click on selected filter again
        // i) Check box is selected and Apply button is enabled
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);

        // ii) - Check box is un selected and Apply button is disabled
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // 5th step: Select some filters and click on Apply
        // i)Selected Filters are applied and filter panel is closed.
        let manaulFilterPopup1: string = await activityTabPage.isFilterPopUpDisplayed();
        await expect(manaulFilterPopup1).toEqual('true');

        await activityTabPage.selectFilterCheckBox('General Notes');
        await activityTabPage.selectFilterCheckBox('Status Change');
        await activityTabPage.selectFilterCheckBox('Assignment Change');
        await activityTabPage.selectFilterCheckBox('Category Change');
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await activityTabPage.clickOnFilterApplyButton();

        await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');

        // ii) Selected Filters are displayed in Activity with first filter and + other selected filters
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie');
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');

        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
        await activityTabPage.closeNmoreLink();

        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie');
        await activityTabPage.closeNmoreLink();
        //  v) - That particular filter is removed.
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await activityTabPage.removeFilterList();
        console.log(await activityTabPage.isfilterListDisplayed('Status Change'));
        await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');

        // 6) All filters are removed.
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.clickOnFilterClearButton();
        await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // For Automation
        // Create automated task template
        let autoTemplateData = {
            "templateName": "auto task template ",
            "templateSummary": "auto task template summary ",
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Case Process ",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        autoTemplateData.templateName = autoTemplateData.templateName + randomString;
        autoTemplateData.templateSummary = autoTemplateData.templateSummary + randomString;
        autoTemplateData.processName = autoTemplateData.processName + randomString;

        await apiHelper.apiLogin('qkatawazi');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTemplateData);
        console.log("Automated task Template created===", autoTaskTemplate.id);

        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('auto task template test case for DRDMV-16759');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        // On view case page.
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(autoTemplateData.templateSummary);

        // 2nd step: Inspect Task Activity UI - Click on FIlter
        await activityTabPage.clickOnFilterButton();

        // 3rd step: Inspect Filter Panel UI
        // i) step: - Clear, Apply button (Apply button is disabled until any filter is selected)
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // ii) step:- Verify Task Filter options ,-- General Notes, -- Status Change, -- Assignment Change, -- Category Change
        await expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextTaskFilterOption('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextTaskFilterOption('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextTaskFilterOption('Category Change')).toBe('Category Change');
        // iii) step:- -- Search field for Author search
        await expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");

        // 4th step: Click on a filter option, - Click on selected filter again
        // i) Check box is selected and Apply button is enabled
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);

        // ii) - Check box is un selected and Apply button is disabled
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // 5th step: Select some filters and click on Apply
        // i)Selected Filters are applied and filter panel is closed.
        await expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');

        await activityTabPage.selectFilterCheckBox('General Notes');
        await activityTabPage.selectFilterCheckBox('Status Change');
        await activityTabPage.selectFilterCheckBox('Assignment Change');
        await activityTabPage.selectFilterCheckBox('Category Change');
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');

        await activityTabPage.clickOnFilterApplyButton();
        await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');

        // ii) Selected Filters are displayed in Activity with first filter and + other selected filters
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie');
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
        await activityTabPage.closeNmoreLink();

        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie');
        await activityTabPage.closeNmoreLink();
        //  v) - That particular filter is removed.
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await activityTabPage.removeFilterList();
        console.log(await activityTabPage.isfilterListDisplayed('Status Change'));
        await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');

        // 6) All filters are removed.
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.clickOnFilterClearButton();
        await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // For External
        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        let externalTemplateData: ITaskTemplate = {
            "templateName": "external task template name ",
            "templateSummary": "external task template summary ",
            "templateStatus": "Active",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        };
        externalTemplateData.templateName = externalTemplateData.templateName + randomStr;
        externalTemplateData.templateSummary = externalTemplateData.templateSummary + randomStr;

        await apiHelper.apiLogin('qkatawazi');
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
        console.log("External Task Template is created===", externalTaskTemplate.id);

        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('external task test case for DRDMV-16759');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();

        // On view case page.
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary);
        await manageTaskBladePo.clickTaskLinkOnManageTask(externalTemplateData.templateSummary);

        // 2nd step: Inspect Task Activity UI - Click on FIlter
        await activityTabPage.clickOnFilterButton();

        // 3rd step: Inspect Filter Panel UI
        // i) step: - Clear, Apply button (Apply button is disabled until any filter is selected)
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // ii) step:- Verify Task Filter options ,-- General Notes, -- Status Change, -- Assignment Change, -- Category Change
        let filterOption1: string = await activityTabPage.getTextTaskFilterOption('General Notes');
        let filterOption2: string = await activityTabPage.getTextTaskFilterOption('Status Change');
        let filterOption3: string = await activityTabPage.getTextTaskFilterOption('Assignment Change');
        let filterOption4: string = await activityTabPage.getTextTaskFilterOption('Category Change');
        await expect(filterOption1).toBe('General Notes');
        await expect(filterOption2).toBe('Status Change');
        await expect(filterOption3).toBe('Assignment Change');
        await expect(filterOption4).toBe('Category Change');
        // iii) step:- -- Search field for Author search
        await expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");

        // 4th step: Click on a filter option, - Click on selected filter again
        // i) Check box is selected and Apply button is enabled
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);

        // ii) - Check box is un selected and Apply button is disabled
        await activityTabPage.selectFilterCheckBox('General Notes');
        await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

        // 5th step: Select some filters and click on Apply
        // i)Selected Filters are applied and filter panel is closed.
        await expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');

        await activityTabPage.selectFilterCheckBox('General Notes');
        await activityTabPage.selectFilterCheckBox('Status Change');
        await activityTabPage.selectFilterCheckBox('Assignment Change');
        await activityTabPage.selectFilterCheckBox('Category Change');
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await activityTabPage.clickOnFilterApplyButton();

        await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');

        // ii) Selected Filters are displayed in Activity with first filter and + other selected filters
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie');
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
        await activityTabPage.closeNmoreLink();

        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author : ajolie');
        await activityTabPage.closeNmoreLink();
        //  v) - That particular filter is removed.
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await activityTabPage.removeFilterList();
        console.log(await activityTabPage.isfilterListDisplayed('Status Change'));
        await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');

        // 6) All filters are removed.
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.clickOnFilterClearButton();
        await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');
    }, 420 * 1000);

    //kgaikwad
    it('[DRDMV-18048]: While adding a note on Case one or more agent can be tagged in Comment', async () => {
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setContactName('Angelina Jolie');
        await createCase.setSummary('test case for DRDMV-18048');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await expect(await activityTabPage.getPersonCount('Hi hello @Allen')).toBeGreaterThan(3);
        await activityTabPage.clickOnRefreshButton();
        await activityTabPage.clearActivityNote();
        await activityTabPage.addPersonInActivityNote('Angelina');//FirstName
        await activityTabPage.addPersonInActivityNote('Steyn');//LastName
        await activityTabPage.addPersonInActivityNote('aborder@petramco.com');//Email
        await activityTabPage.addPersonInActivityNote('qtao');//Login ID
        await activityTabPage.clickOnPostButton();
        await expect(await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Angelina Jolie')).toBeTruthy("FirstName user is not present");
        await expect(await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Dale Steyn')).toBeTruthy("LastName user is not present");
        await expect(await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Allen Border')).toBeTruthy("EmailID user is not present");
        await expect(await activityTabPage.isLinkedTextPresentInBodyOfFirstActivity('Qianru Tao')).toBeTruthy("LoginID user is not present");
    }, 300 * 1000);

    //kgaikwad
    it('[DRDMV-16754]: Drill Down to different screens from Activities', async () => {
        try {
            let caseBodyText = "This is unique caseActivity text " + Math.floor(Math.random() * 1000000);
            let taskBodyText = "This is unique TaskActivity text " + Math.floor(Math.random() * 1000000);
            let knowledgeBodyText = "This is unique KnowledgeActivity text " + Math.floor(Math.random() * 1000000);
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            // Create manual task template
            let manualTemplateData = {
                "templateName": "DRDMV-21617_task template" + summary,
                "templateSummary": "DRDMV-21617_Manual_task template summary" + summary,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16754');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            // On view case page.
            // 2nd step verification From Case Activities, click on Different person names and inspect behavior
            await activityTabPage.addActivityNote(caseBodyText);
            await activityTabPage.clickOnPostButton();
            let caseIdText: string = await viewCasePo.getCaseID();
            // Redirect on person profile
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
            await expect(browser.getTitle()).toBe('Person Profile - Business Workflows');
            await activityTabPage.clickOnHyperlinkFromActivity(1, caseIdText);

            // 3nd step verification, From Case > Activity > Task related note > Click on Person name
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTemplateData.templateSummary);

            // View task page
            await expect(browser.getTitle()).toBe('Task Edit - Business Workflows');
            await activityTabPage.addActivityNote(taskBodyText);
            await activityTabPage.clickOnPostButton();
            let taskId: string = await viewTaskPo.getTaskID();

            // View Case Page
            await viewTaskPo.clickOnViewCase();
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
            await activityTabPage.clickOnHyperlinkFromActivity(2, caseIdText);

            // 4th step From Case > Activity > Click on Task ID from Task comment
            await activityTabPage.clickOnHyperlinkFromActivity(1, taskId);

            // 5th step verification Open Task > Click on Person Name from Activity
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');

            // 6th step verification
            // Open KA > Click on Person Name from Activity, On Crate Knowlege Page
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('Knowledge Article for DRDMV-16754');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await previewKnowledgePo.clickOnViewArticleLink();

            // View Knowledege Page
            await utilityCommon.switchToNewTab(1);
            await utilityCommon.refresh();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('knowoledge Edit link is missing');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPage.addActivityNote(knowledgeBodyText);
            await activityTabPage.clickOnPostButton();
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
        } catch (e) {
            throw e;
        } finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    }, 300 * 1000);

    // ptidke
    it('[DRDMV-7152]: [Automatic Task] - Automatic Task: Social: Manual Comments', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // Create automated task template
        let autoTemplateData = {
            "templateName": "auto task DRDMV-7152 template",
            "templateSummary": "auto task DRDMV-7152template summary",
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Case Process ",
            "taskCompany": "Petramco",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "Facilities Support",
            "ownerGroup": "Facilities"
        }

        autoTemplateData.templateName = autoTemplateData.templateName + randomString;
        autoTemplateData.templateSummary = autoTemplateData.templateSummary + randomString;
        autoTemplateData.processName = autoTemplateData.processName + randomString;
        await apiHelper.apiLogin('fritz');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTemplateData);
        console.log("Automated task Template created===", autoTaskTemplate.id);

        let filePath = '../../data/ui/attachment/bwfPdf.pdf';

        let taskBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotoCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16773');
        await createCase.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateName);
        await manageTaskBladePo.clickTaskLinkOnManageTask(autoTemplateData.templateSummary);
        //single line comment
        await activityTabPage.addActivityNote(taskBodyText);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.getFirstPostContent()).toContain(taskBodyText);
        //one file and commnet
        await activityTabPage.addActivityNote('step 2nd added ' + taskBodyText);
        await activityTabPage.addAttachment([filePath]);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.getFirstPostContent()).toContain('step 2nd added ' + taskBodyText);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('file is not present');
        await activityTabPage.clickAttachedFile('bwfPdf.pdf');
        expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('File is not downloaded.');
        //multiple line
        let newline: string = "this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things";
        await activityTabPage.addActivityNote(newline);
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnShowMore();
        expect(await activityTabPage.getFirstPostContent()).toContain(newline);
        //html with text
        let withHTML: string = "this is text for new line and add new things this is text for new line <p><img alt=''>new link<a>Google</a> New things</p> <p>This is new test<span>Font 72Font 72this is newly added text</span></p> <td><span style='color:#3498db;'>SettingColor</span></td>";
        await activityTabPage.addActivityNote(withHTML);
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnShowMore();
        expect(await activityTabPage.getFirstPostContent()).toContain(withHTML);
        let textWithMultipleAttachment: string = "new values with attachments";
        await activityTabPage.addActivityNote(textWithMultipleAttachment);
        for (let i = 0; i <= 5; i++) {
            await activityTabPage.addAttachment(['../../data/ui/attachment/demo.txt']);
        }
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.getFirstPostContent()).toContain(textWithMultipleAttachment);
        await activityTabPage.clickShowMoreLinkInAttachmentActivity(1);
        expect(await activityTabPage.getCountAttachedFiles('demo.txt')).toBe(6);
    }, 270 * 1000);

    //kgaikwad
    it('[DRDMV-16582]: Check case view count log is displayed on the activity feed of case along with name of user and time', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let caseData = {
                "Requester": "Fritz",
                "Summary": "Test case for DRDMV-8377RandVal" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.clickOnRefreshButton();
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qadim Katawazi  viewed the case. ')).toEqual(1);
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
            await navigationPage.gotoPersonProfile();
            await expect(await personProfilePo.getCaseViewCount(' Viewed the  ' + caseId)).toEqual(1);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 270 * 1000);

    //kgaikwad
    it('[DRDMV-16589]: Check case view count is not increased by opening same case by different places', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // Create Task Template
            let manualTaskTemplateData = {
                "templateName": "DRDMV-16589_tempname_" + randomString,
                "templateSummary": "DRDMV-16589_tempSummary_" + randomString,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            // Create Case
            let caseData = {
                "Requester": "Fritz",
                "Summary": summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            // // Open Task
            expect(await viewCasePo.getCaseID()).toBe(caseId,'CaseId is missing in qfreng user');
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTaskBladePo.clickTaskLinkOnManageTask(manualTaskTemplateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
            // Goto case   
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
            // Goto Quick Case
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qfeng');
            await quickCasePo.setCaseSummary(caseData.Summary);
            await quickCasePo.clickOnCaseSummaryInRecommendedCases(caseData.Summary);
            await quickCasePo.gotoCaseButton();
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qfeng');
            await quickCasePo.setCaseSummary(caseData.Summary);
            await quickCasePo.saveCase();
            await quickCasePo.gotoCaseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('FailuerMsg: Email Link is not present');
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);

            await viewCasePo.clickOnTab('Related Persons');
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Elizabeth Peters', 'Related to');
            await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
            await expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Elizabeth Peters', 'Related to')).toBeTruthy();

            await navigationPage.signOut();
            await loginPage.login('elizabeth');
            await navigationPage.gotoPersonProfile();
            await personProfilePo.clickOnTab('Related Cases');
            await relatedCaseTab.clickOnCaseSummaryLink(caseData.Summary);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing');
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Elizabeth Peters  viewed the case. ')).toEqual(1);
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 600 * 1000);

    //kgaikwad
    it('[DRDMV-16591]: Check case count is changed with different permission of user read/write/no access to the case', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let getUrl;
            let passwd = 'Password_1234';
            // Create Case
            let caseData = {
                "Requester": "Fritz",
                "Summary": "DRDMV-16591_TC" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }

            //Create a case with qfeng as Write Permission, qtao has no permission and Fabian as Read Permission
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsolePo.searchAndOpenCase(caseId);


            await viewCasePo.clickOnTab('Case Access');
            //Read Access Agent
            await caseAccessTabPo.clickOnSupportGroupAccessORAgentAccessButton('Agent Access');
            await caseAccessTabPo.selectAndAddAgent('Fabian');
            await expect(await caseAccessTabPo.isAgentNameOrSupportGroupNameDisplayed('Fabian Krause')).toBeTruthy('Failuer:Fabian Krause Agent Name is missing');

            //Login with Read Permission User
            await navigationPage.signOut();
            await loginPage.login('fabian');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing with Fabian User');

            //Login with Write User and check read user count
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing with qyuan User');
            await expect(await activityTabPage.getCaseViewCount('Fabian Krause  viewed the case. ')).toEqual(1);

            //Login with Read user and check write user count
            await navigationPage.signOut();
            await loginPage.login('fabian');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing with qyuan User');
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
            let url: string = await browser.getCurrentUrl();

            // Login with No Access user
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await browser.get(url);
            await expect(await utilityCommon.getAllPopupMsg()).toContain('ERROR (302): Record Instance does not exist in the database. com.bmc.dsm.case-lib:Case:');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    }, 700 * 1000);

    //kgaikwad
    it('[DRDMV-18052]: Alert Notification should be send to tagged persons other than Assignee and Requester', async () => {
        try {
            let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            // Create Case
            let caseData = {
                "Requester": "apavlik",
                "Summary": "DRDMV-18052_TC" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qkatawazi"
            }

            await apiHelper.apiLogin('qfeng');
            let newCase = await apiHelper.createCase(caseData);
            let caseId: string = newCase.displayId;
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.addActivityNote('From DRDMV-18052 ');
            await activityTabPage.addPersonInActivityNote('qkatawazi');
            await activityTabPage.clickOnPostButton();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await notificationPo.clickOnNotificationIcon();
            await expect(await notificationPo.isAlertPresent('Qiao Feng added a note to ' + caseId)).toBeTruthy('Alert message is not present');
        } catch (e) {
            throw e;
        } finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });

    //kgaikwad
    it('[DRDMV-16730]:Show More/Less option in Case Activity Tab with Attachments', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues1 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues2 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues3 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues4 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues5 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues6 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNoteBodyText1 = `${randomValues1}\n${randomValues2}\n${randomValues3}\n${randomValues4}\n${randomValues5}`;
        let addNoteBodyText2 = `${randomValues1}\n${randomValues2}\n${randomValues3}\n${randomValues4}\n${randomValues5}\n${randomValues6}`;

        let filePath1 = '../../data/ui/attachment/articleStatus.png';
        let filePath2 = '../../data/ui/attachment/bwfJpg.jpg';
        let filePath4 = '../../data/ui/attachment/bwfJpg2.jpg';
        let filePath5 = '../../data/ui/attachment/bwfJpg3.jpg';
        let filePath7 = '../../data/ui/attachment/bwfJson1.json';
        let filePath8 = '../../data/ui/attachment/bwfJson2.json';
        let filePath9 = '../../data/ui/attachment/bwfJson3.json';
        let filePath10 = '../../data/ui/attachment/bwfJson4.json';
        let filePath11 = '../../data/ui/attachment/bwfJson5.json';
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
        await caseConsolePo.searchAndOpenCase(caseId);
        // Verify logs with 5 lines or less than 5 lines
        await activityTabPage.addActivityNote(addNoteBodyText1);
        await activityTabPage.clickOnPostButton();
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg1: BodyText is missing');
        await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg2: Show more link is displayed');
        // Verify logs with more than 5 lines
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.clickOnPostButton();
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg3: BodyText is missing');
        await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg4: Show more link is displayed');
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg5: BodyText is missing');
        await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg6: Show less missing for body text');
        await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg7: Show more link is displayed');
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg8: BodyText is missing');
        // Verify logs with 5 lines  with 3 attachment
        await activityTabPage.addActivityNote(addNoteBodyText1);
        await activityTabPage.addAttachment([filePath1, filePath2]);
        await activityTabPage.clickOnPostButton();
        await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg12: Show more link for attachment is missing')
        await expect(await activityTabPage.isAttachedFileNameDisplayed('articleStatus.png')).toBeTruthy(`FailureMsg9: ${filePath1} is missing`);
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy(`FailureMsg10: ${filePath2} is missing`);
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg13: BodyText is missing');
        await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg14: Show more link is displayed');
        // Verify logs with more than 5 lines  with 3 attachment
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.addAttachment([filePath4, filePath5]);
        await activityTabPage.clickOnPostButton();
        await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg18: Show more link for attachment is missing')
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy(`FailureMsg15: ${filePath4} is missing`);
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg3.jpg')).toBeTruthy(`FailureMsg16: ${filePath5} is missing`);
        await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg19: Show more link is displayed');
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg20: BodyText is missing');
        await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg21: Show less missing for body text');
        // Verify logs with more than 5 lines  with more than 4 attachment
        await activityTabPage.addActivityNote(addNoteBodyText2);
        await activityTabPage.addAttachment([filePath7, filePath8, filePath9, filePath10, filePath11]);

        await activityTabPage.clickOnPostButton();
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg22: BodyText is missing');
        await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg23: Show More missing for body text');
        await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg24: Show more link for attachment is missing')
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg25: BodyText is missing');
        await expect(activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg43: ShowLess link is missing')
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg26: BodyText is missing');

        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson1.json')).toBeTruthy(`FailureMsg27: ${filePath7} is missing`);
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson2.json')).toBeTruthy(`FailureMsg28: ${filePath8} is missing`);
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson3.json')).toBeTruthy(`FailureMsg29: ${filePath9} is missing`);
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson4.json')).toBeTruthy(`FailureMsg30: ${filePath10} is missing`);
        await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson5.json')).toBeTruthy(`FailureMsg31: ${filePath11} is missing`);

        // Download Attachments Files
        expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson1.json')).toBeTruthy('FailureMsg32: bwfJson1.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson1.json')
        await expect(await utilityCommon.isFileDownloaded('bwfJson1.json')).toBeTruthy('FailureMsg33.json File is not downloaded.');

        await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson2.json')).toBeTruthy('FailureMsg34: bwfJson2.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson2.json')
        await expect(await utilityCommon.isFileDownloaded('bwfJson2.json')).toBeTruthy('FailureMsg35: bwfJson2.json File is not downloaded.');

        await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson3.json')).toBeTruthy('FailureMsg36: bwfJson3.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson3.json')
        await expect(await utilityCommon.isFileDownloaded('bwfJson3.json')).toBeTruthy('FailureMsg37: bwfJson3.json File is not downloaded.');

        await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson4.json')).toBeTruthy('FailureMsg38: bwfJson4.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson4.json')
        await expect(await utilityCommon.isFileDownloaded('bwfJson4.json')).toBeTruthy('FailureMsg39: bwfJson4.json File is not downloaded.');

        await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson5.json')).toBeTruthy('FailureMsg40: bwfJson5.json File is delete sucessfully');
        await activityTabPage.clickAndDownloadAttachmentFile('bwfJson5.json')
        await expect(await utilityCommon.isFileDownloaded('bwfJson5.json')).toBeTruthy('FailureMsg41: bwfJson5.json File is not downloaded.');

        await expect(activityTabPage.clickShowLessLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg42: Show less link for attachment is missing');

    }, 270 * 1000);

    //kgaikwad
    it('[DRDMV-16765]:Validate Show More/Less option in KA Activity Tab', async () => {
        try {
            let randomValues1 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomValues2 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomValues3 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomValues4 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomValues5 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let randomValues6 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let addNoteBodyText1 = `${randomValues1}\n${randomValues2}\n${randomValues3}\n${randomValues4}\n${randomValues5}`;
            let addNoteBodyText2 = `${randomValues1}\n${randomValues2}\n${randomValues3}\n${randomValues4}\n${randomValues5}\n${randomValues6}`;

            let filePath1 = '../../data/ui/attachment/articleStatus.png';
            let filePath2 = '../../data/ui/attachment/bwfJpg.jpg';
            let filePath4 = '../../data/ui/attachment/bwfJpg2.jpg';
            let filePath5 = '../../data/ui/attachment/bwfJpg3.jpg';
            let filePath7 = '../../data/ui/attachment/bwfJson1.json';
            let filePath8 = '../../data/ui/attachment/bwfJson2.json';
            let filePath9 = '../../data/ui/attachment/bwfJson3.json';
            let filePath10 = '../../data/ui/attachment/bwfJson4.json';
            let filePath11 = '../../data/ui/attachment/bwfJson5.json';

            // Create KA
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test_KA_for_DRDMV-16765');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.waitUntilPopUpDisappear();
            await previewKnowledgePo.clickOnViewArticleLink();
            await utilityCommon.waitUntilPopUpDisappear();
            await utilityCommon.switchToNewTab(1);
            await utilityCommon.refresh();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            // Verify logs with 5 lines or less than 5 lines
            await activityTabPage.addActivityNote(addNoteBodyText1);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg1: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg2: Show more link is displayed');
            // Verify logs with more than 5 lines
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg3: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg4: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg5: BodyText is missing');
            await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg6: Show less missing for body text');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg7: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg8: BodyText is missing');
            // Verify logs with 5 lines  with 3 attachment
            await activityTabPage.addActivityNote(addNoteBodyText1);
            await activityTabPage.addAttachment([filePath1, filePath2]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg12: Show more link for attachment is missing')
            await expect(await activityTabPage.isAttachedFileNameDisplayed('articleStatus.png')).toBeTruthy(`FailureMsg9: ${filePath1} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy(`FailureMsg10: ${filePath2} is missing`);
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg13: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg14: Show more link is displayed');
            // Verify logs with more than 5 lines  with 3 attachment
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.addAttachment([filePath4, filePath5]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg18: Show more link for attachment is missing')
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy(`FailureMsg15: ${filePath4} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg3.jpg')).toBeTruthy(`FailureMsg16: ${filePath5} is missing`);
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg19: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg20: BodyText is missing');
            await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg21: Show less missing for body text');
            // Verify logs with more than 5 lines  with more than 4 attachment
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.addAttachment([filePath7, filePath8, filePath9, filePath10, filePath11]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg22: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg23: Show More missing for body text');
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg24: Show more link for attachment is missing')
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg25: BodyText is missing');
            await expect(activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg43: ShowLess link is missing')
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg26: BodyText is missing');

            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson1.json')).toBeTruthy(`FailureMsg27: ${filePath7} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson2.json')).toBeTruthy(`FailureMsg28: ${filePath8} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson3.json')).toBeTruthy(`FailureMsg29: ${filePath9} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson4.json')).toBeTruthy(`FailureMsg30: ${filePath10} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJson5.json')).toBeTruthy(`FailureMsg31: ${filePath11} is missing`);

            // Download Attachments Files
            await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson1.json')).toBeTruthy('FailureMsg32: bwfJson1.json File is delete sucessfully');
            await activityTabPage.clickAndDownloadAttachmentFile('bwfJson1.json')
            await expect(await utilityCommon.isFileDownloaded('bwfJson1.json')).toBeTruthy('FailureMsg33.json File is not downloaded.');

            await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson2.json')).toBeTruthy('FailureMsg34: bwfJson2.json File is delete sucessfully');
            await activityTabPage.clickAndDownloadAttachmentFile('bwfJson2.json')
            await expect(await utilityCommon.isFileDownloaded('bwfJson2.json')).toBeTruthy('FailureMsg35: bwfJson2.json File is not downloaded.');

            await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson3.json')).toBeTruthy('FailureMsg36: bwfJson3.json File is delete sucessfully');
            await activityTabPage.clickAndDownloadAttachmentFile('bwfJson3.json')
            await expect(await utilityCommon.isFileDownloaded('bwfJson3.json')).toBeTruthy('FailureMsg37: bwfJson3.json File is not downloaded.');

            await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson4.json')).toBeTruthy('FailureMsg38: bwfJson4.json File is delete sucessfully');
            await activityTabPage.clickAndDownloadAttachmentFile('bwfJson4.json')
            await expect(await utilityCommon.isFileDownloaded('bwfJson4.json')).toBeTruthy('FailureMsg39: bwfJson4.json File is not downloaded.');

            await expect(await utilityCommon.deleteAlreadyDownloadedFile('bwfJson5.json')).toBeTruthy('FailureMsg40: bwfJson5.json File is delete sucessfully');
            await activityTabPage.clickAndDownloadAttachmentFile('bwfJson5.json')
            await expect(await utilityCommon.isFileDownloaded('bwfJson5.json')).toBeTruthy('FailureMsg41: bwfJson5.json File is not downloaded.');

            await expect(activityTabPage.clickShowLessLinkInAttachmentActivity(1)).toBeTruthy('FailureMsg42: Show less link for attachment is missing');
        }
        catch (e) {
            throw e;
        }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    }, 400 * 1000);

    //kgaikwad
    it('[DRDMV-16764]:Validate all type of social activities are displayed correctly in KA Activity tab', async () => {
        try {
            let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let flag = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let unFlag = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let reviewPending = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let feedback = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let addNoteBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgePublisherUser = 'kmills';
            let knowledgeTitile = 'knowledge16764' + randomStr;

            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToAnotherApplication('Knowledge Management');
            await utilCommon.switchToNewWidnow(1);

            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany":"Petramco",
                "assigneeBusinessUnit":"United Kingdom Support",
                "assigneeSupportGroup":"GB Support 1",
                "assignee": "KMills"
            }
            let KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(flag);
            await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();

            await utilityCommon.waitUntilPopUpDisappear();
            await viewKnowledgeArticlePo.clickOnUnFlagButton();
            await flagUnflagKnowledgePo.setTextInTellUsMore(unFlag);
            await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();

            await utilityCommon.waitUntilPopUpDisappear();
            await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
            await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(feedback);
            await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();

            await utilityCommon.waitUntilPopUpDisappear();
            await viewKnowledgeArticlePo.clickReviewPendingLink();
            await reviewCommentsPo.setTextInTellUsMore(reviewPending);
            await reviewCommentsPo.clickApprovedButton();

            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPage.addActivityNote(addNoteBodyText);
            await activityTabPage.clickOnPostButton();

            // verify flag in activity
            await expect(await activityTabPage.isLogIconDisplayedInActivity('flag', 5)).toBeTruthy('FailureMsg: Note pencil icon is missing')
            await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills flagged the article', 5));
            await expect(await activityTabPage.isBodyDisplayedInActivity(flag, 5)).toBeTruthy('FailureMsg: Kyle Mills flagged the article is missing');
            await expect(await activityTabPage.isLockIconDisplayedInActivity(5)).toBeTruthy('FailureMsg1: LockIcon is missing');

            // verify unflag in activity
            await expect(await activityTabPage.isLogIconDisplayedInActivity('unflag', 4)).toBeTruthy('FailureMsg: Note pencil icon is missing')
            await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills unflagged the article', 4));
            await expect(await activityTabPage.isBodyDisplayedInActivity(unFlag, 4)).toBeTruthy('FailureMsg: Kyle Mills unflagged the article is missing');
            await expect(await activityTabPage.isLockIconDisplayedInActivity(4)).toBeTruthy('FailureMsg1: LockIcon is missing');

            // verify feedback in activity
            await expect(await activityTabPage.isLogIconDisplayedInActivity('comments', 3)).toBeTruthy('FailureMsg: Note pencil icon is missing')
            await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills has provided the feedback for the article', 3));
            await expect(await activityTabPage.isBodyDisplayedInActivity(feedback, 3)).toBeTruthy('FailureMsg: Kyle Mills has provided the feedback for the article is missing');
            await expect(await activityTabPage.isLockIconDisplayedInActivity(3)).toBeTruthy('FailureMsg1: LockIcon is missing');

            // verify Review in activity
            await expect(await activityTabPage.isLogIconDisplayedInActivity('pencil', 2)).toBeTruthy('FailureMsg: Note pencil icon is missing')
            await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills reviewed this article and provided this comment', 2));
            await expect(await activityTabPage.isBodyDisplayedInActivity(reviewPending, 2)).toBeTruthy('FailureMsg: Kyle Mills reviewed this article and provided this comment is missing');
            await expect(await activityTabPage.isLockIconDisplayedInActivity(2)).toBeTruthy('FailureMsg1: LockIcon is missing');

            // Verify KA comment
            await expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg: Note pencil icon is missing')
            await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills added a note', 1));
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg: Kyle Mills added a note');
            await expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg1: LockIcon is missing');
        }
        catch (e) {
            throw e;
        }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        }
    });//, 220 * 1000);

})
