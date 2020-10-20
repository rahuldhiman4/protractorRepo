import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { ITaskTemplate } from '../../data/interface/template.interface';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import caseConsolePo from '../../pageobject/case/case-console.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCase from '../../pageobject/case/create-case.po';
import quickCasePo from '../../pageobject/case/quick-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import accessTabPo from '../../pageobject/common/access-tab.po';
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
import utilityGrid from '../../utils/utility.grid';

describe('Case Activity', () => {

    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qkatawazi');
        await apiHelper.apiLogin('tadmin');
        await apiHelper.setDefaultNotificationForUser('qkatawazi', "Alert");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //kgaikwad
    describe('[DRDMV-16767]: KA Activity Filter UI validation', async () => {
        it('[DRDMV-16767]: Create Knowledge Article And Navigate To Activity Tab', async () => {
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16767');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
        });
        it('[DRDMV-16767]: Verify Filter UI ', async () => {
            await activityTabPage.clickOnFilterButton();
            expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

            expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes'), 'General Notes is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Unflag')).toBe('Unflag'), 'Unflag is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextTaskFilterOption('Review')).toBe('Review');
            expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");

            await activityTabPage.selectFilterCheckBox('General Notes');
            expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');
        });
        it('[DRDMV-16767]: Select Filter Options', async () => {
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.selectFilterCheckBox('Flag');
            await activityTabPage.selectFilterCheckBox('Unflag');
            await activityTabPage.selectFilterCheckBox('Feedback');
            await activityTabPage.selectFilterCheckBox('Review');
            await activityTabPage.addAuthorOnFilter('Kadeem Hardison');
            await activityTabPage.clickOnFilterApplyButton();
            expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
        });
        it('[DRDMV-16767]: Verify Applied Filter List', async () => {
            expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextFromFilterList('Unflag')).toBe('Unflag'), 'Unflag is missing';
            expect(await activityTabPage.getTextFromFilterList('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
            expect(await activityTabPage.getTextFromFilterList('Review')).toBe('Review');

            expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            expect(await activityTabPage.getTextOfNmoreLink()).toBe('5 Show more');
            await activityTabPage.removeFilterList();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
            await activityTabPage.closeNmoreLink();

            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextFromFilterList('Unflag')).toBe('Unflag'), 'Assignment Change is missing';
            expect(await activityTabPage.getTextFromFilterList('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
            expect(await activityTabPage.getTextFromFilterList('Review')).toBe('Review');
            await activityTabPage.closeNmoreLink();

            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            await activityTabPage.removeFilterList();
            expect(await activityTabPage.isfilterListDisplayed('Flag')).toBeFalsy('Flag displayed');
        });
        it('[DRDMV-16767]: Clear Filter From UI And Verify Filter list Is Not Present ', async () => {
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.clickOnFilterClearButton();
            expect(await activityTabPage.isfilterPresent()).toBeFalsy('filter displayed');
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //kgaikwad
    describe('[DRDMV-18141]: Clicking on any tagged person name from Activity tab should navigate us to Persons Profile', async () => {
        let caseBodyText = `CaseBody${randomStr}`;
        it('[DRDMV-18141]: Verify After Click On Person Name It Should Navigate To Person Profile Page ', async () => {
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
    });

    //kgaikwad
    describe('[DRDMV-16768]: From KA Activity Filters > Person search behavior in Author field', async () => {
        it('[DRDMV-16768]: Create Knowledge Article And Navigate To Activity Tab ', async () => {
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16768');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
        });
        it('[DRDMV-16768]: Add/Remove All Types Of Users ', async () => {
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
        });
        it('[DRDMV-16768]: Verify Person Able to Search With FirstName/LastName/Email/LoginID/PersonID', async () => {
            await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Steyn');//LastName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('aborder@petramco.com');//Email        
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('qtao');//Login ID
            await activityTabPage.removeAuthorFromFilter();
        });
        it('[DRDMV-16768]: Verify Person Details Which Displayed On Person PopUp', async () => {
            await activityTabPage.searchAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isImgPresentOnUserPopUp()).toBeTruthy('Img is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPersonNamePresentOnUserPopUp('Angelina Jolie')).toBeTruthy('Name is Not Present On Author List PopUp');
            await expect(await activityTabPage.isEmailPresentOnUserPopUp('ajolie@petramco.com')).toBeTruthy('Email is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPhoneNumberPresentOnUserPopUp('+12124021501')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
            await expect(await activityTabPage.isCompanyPresentOnUserPopUp('Petramco')).toBeTruthy('Company is Not Present On Author List PopUp');
            await activityTabPage.clearAuthorSearchBoxOnFilter();
        });
        it('[DRDMV-16768]: Verify Author Field With Empty Non Empty Field', async () => {
            await activityTabPage.addAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');

            await activityTabPage.removeAuthorFromFilter();
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');

            await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
            await activityTabPage.clickOnFilterApplyButton();
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //kgaikwad
    describe('[DRDMV-16773]: [-ve] - Person details displayed in Activity who have long name', async () => {
        let summary = 'summaryDRDMV16773' + randomStr;
        let caseBodyText = 'caseBodyTextDRDMV16773' + randomStr;
        let taskBodyText = 'taskBodyTextDRDMV16773' + randomStr;
        let knowledgeBodyText = 'knowledgeBodyTextDRDMV16773' + randomStr;
        let manualTemplateData;

        beforeAll(async () => {
            manualTemplateData = {
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
        });
        it('[DRDMV-16773]: Create Case And Add Long Person Name In Activity Note ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16773');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await activityTabPage.addActivityNote(caseBodyText);
            await activityTabPage.addPersonInActivityNote('Jacqueline Featherstonehaugh');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(caseBodyText, 'Jacqueline Featherstonehaugh')).toBeTruthy('PersonName is not displayed correctly');
        });
        it('[DRDMV-16773]: Add Task And Inspect Long Person Name On Activity', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateName);
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
            await activityTabPage.addActivityNote(taskBodyText);
            await activityTabPage.addPersonInActivityNote('Jacqueline Featherstonehaugh');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(taskBodyText, 'Jacqueline Featherstonehaugh')).toBeTruthy('PersonName is not displayed correctly');
        });
        it('[DRDMV-16773]: Add Knowledge Article And Inspect Long Person Name On Activity', async () => {
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge page title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16773');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPage.addActivityNote(knowledgeBodyText);
            await activityTabPage.addPersonInActivityNote('Jacqueline Featherstonehaugh');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(knowledgeBodyText, 'Jacqueline Featherstonehaugh')).toBeTruthy('PersonName is not displayed correctly');
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //kgaikwad
    describe('[DRDMV-16733]: Case Activity Filter UI validation', async () => {
        it('[DRDMV-16773]: Create Case ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16733');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-16733]: Verify Case Filter On UI ', async () => {
            await activityTabPage.clickOnFilterButton();
            await expect(await activityTabPage.isApplyFilterButtonEnabled()).toBeFalsy('Filter button is enabled');
            await expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes'), 'General Notes is missing';
            await expect(await activityTabPage.getTextTaskFilterOption('Status Change')).toBe('Status Change', 'Status Change is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Emails')).toBe('Emails', 'Emails is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Assignment Change')).toBe('Assignment Change', 'Assignment Change is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Relationship Change')).toBe('Relationship Change', 'Relationship Change is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Approvals')).toBe('Approvals', 'Approvals is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Category Change')).toBe('Category Change', 'Category Change is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Case Views')).toBe('Case Views', 'Case Views is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Task Activities')).toBe('Task Activities', 'Task Activities is missing');
            await expect(await activityTabPage.getTextTaskFilterOption('Public')).toBe('Public', 'Public is missing');
            expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");
        });
        it('[DRDMV-16733]: Verify Filter Apply Button With Selecting/UnSelect Filter Option ', async () => {
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.isApplyFilterButtonEnabled()).toBeTruthy('Filter button is disabled');
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.isApplyFilterButtonEnabled()).toBeFalsy('Filter button is enabled');
        });
        it('[DRDMV-16733]: Verify Filters are applied and filter panel is closed ', async () => {
            await expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.selectFilterCheckBox('Status Change');
            await activityTabPage.selectFilterCheckBox('Assignment Change');
            await activityTabPage.selectFilterCheckBox('Category Change');
            await activityTabPage.addAuthorOnFilter('Kadeem Hardison');
            await activityTabPage.clickOnFilterApplyButton();
            await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
        });
        it('[DRDMV-16733]: Verify Applied Filter List Displayed On Activity Tab ', async () => {
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change'), 'Assignment Change is missing';
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change'), 'Category Change is missing';
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
        });
        it('[DRDMV-16733]: Verify Applied Filter List With Removed ', async () => {
            // Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
            await activityTabPage.closeNmoreLink();
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
            await activityTabPage.removeFilterList();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
            await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
            await activityTabPage.closeNmoreLink();
            // Click on + n more button (- Selected filter list is displayed )
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change'), 'Assignment Change is missing';
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change'), 'Category Change is missing';
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
            await activityTabPage.closeNmoreLink();
            // That particular filter is removed.
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
            await activityTabPage.removeFilterList();
            await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');
            // All filters are removed.
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.clickOnFilterClearButton();
            await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');
        });
    });

    //kgaikwad
    describe('[DRDMV-16760]: From Task Activity Filters > Person search behavior in Author field', async () => {
        let summary = 'summaryDRDMV16760' + randomStr;
        let manualTemplateData;
        beforeAll(async () => {
            manualTemplateData = {
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
        });

        it('[DRDMV-16760]: Create Case Add Task and Navigate To Task ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16760');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
        });
        it('[DRDMV-16760]: Add/Remove All Types Of Users ', async () => {
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
        });
        it('[DRDMV-16760]: Verify Person Able to Search With FirstName/LastName/Email/LoginID/PersonID ', async () => {
            await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('Steyn');//LastName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('aborder@petramco.com');//Email        
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('qtao');//Login ID
            await activityTabPage.removeAuthorFromFilter();
        });
        it('[DRDMV-16760]: Verify Person Details Which Displayed On Person PopUp', async () => {
            await activityTabPage.searchAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isImgPresentOnUserPopUp()).toBeTruthy('Img is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPersonNamePresentOnUserPopUp('Angelina Jolie')).toBeTruthy('Name is Not Present On Author List PopUp');
            await expect(await activityTabPage.isEmailPresentOnUserPopUp('ajolie@petramco.com')).toBeTruthy('Email is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPhoneNumberPresentOnUserPopUp('+12124021501')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
            await expect(await activityTabPage.isCompanyPresentOnUserPopUp('Petramco')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
        });
        it('[DRDMV-16760]: Verify Author Field With Empty Non Empty Field', async () => {
            await activityTabPage.clearAuthorSearchBoxOnFilter();
            await activityTabPage.addAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
            await activityTabPage.removeAuthorFromFilter();
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
            await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
            await activityTabPage.clickOnFilterApplyButton();
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //kgaikwad
    describe('[DRDMV-16734]: From Case Activity Filters > Person search behavior in Author field', async () => {
        it('[DRDMV-16734]: Create Case ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16734');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-16734]: Verify Person Able to Search With FirstName/LastName/Email/LoginID/PersonID ', async () => {
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.addAuthorOnFilter('Angelina Jolie');
            await activityTabPage.removeAuthorFromFilter();

            await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
            await activityTabPage.clearAuthorSearchBoxOnFilter();
            await activityTabPage.addAuthorOnFilter('Steyn');//LastName
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('aborder@petramco.com');//Email        
            await activityTabPage.removeAuthorFromFilter();
            await activityTabPage.addAuthorOnFilter('qtao');//Login ID
            await activityTabPage.removeAuthorFromFilter();
        });
        it('[DRDMV-16734]: Verify Person Details Which Displayed On Person PopUp', async () => {
            await activityTabPage.searchAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isImgPresentOnUserPopUp()).toBeTruthy('Img is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPersonNamePresentOnUserPopUp('Angelina Jolie')).toBeTruthy('Name is Not Present On Author List PopUp');
            await expect(await activityTabPage.isEmailPresentOnUserPopUp('ajolie@petramco.com')).toBeTruthy('Email is Not Present On Author List PopUp');
            await expect(await activityTabPage.isPhoneNumberPresentOnUserPopUp('+12124021501')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
            await expect(await activityTabPage.isCompanyPresentOnUserPopUp('Petramco')).toBeTruthy('Phone Number is Not Present On Author List PopUp');
            await activityTabPage.clearAuthorSearchBoxOnFilter();
        });
        it('[DRDMV-16734]: Verify Person Details Which Displayed On Person PopUp', async () => {
            await activityTabPage.addAuthorOnFilter('Angelina Jolie');
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
            await activityTabPage.removeAuthorFromFilter();
            await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
            await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
        });
    });

    //kgaikwad
    describe('[DRDMV-16759]: Task Activity Filter UI validation', async () => {
        let manualTemplateData;
        let autoTemplateData;
        let externalTemplateData: ITaskTemplate;
        beforeAll(async () => {
            manualTemplateData = {
                "templateName": "DRDMV-21617_task template" + randomStr,
                "templateSummary": "DRDMV-21617_Manual_task template summary" + randomStr,
                "templateStatus": "Active",
                "taskCompany": '- Global -',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTemplateData);

            // Create automated task template
            autoTemplateData = {
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

            autoTemplateData.templateName = autoTemplateData.templateName + randomStr;
            autoTemplateData.templateSummary = autoTemplateData.templateSummary + randomStr;
            autoTemplateData.processName = autoTemplateData.processName + randomStr;

            await apiHelper.createAutomatedTaskTemplate(autoTemplateData);

            externalTemplateData = {
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
            await apiHelper.createExternalTaskTemplate(externalTemplateData);
        });

        it('[DRDMV-16759]: Create Case And Navigate To Manual Task', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('manual task test case for DRDMV-16759');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            // On view case page.
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
        });
        it('[DRDMV-16759]: Verify Manual Task Filter On UI', async () => {
            await activityTabPage.clickOnFilterButton();
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);

            await expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes');
            await expect(await activityTabPage.getTextTaskFilterOption('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextTaskFilterOption('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextTaskFilterOption('Category Change')).toBe('Category Change');
            await expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);

            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            let manaulFilterPopup1: string = await activityTabPage.isFilterPopUpDisplayed();
            await expect(manaulFilterPopup1).toEqual('true');
        });
        it('[DRDMV-16759]: Verify Filters are applied and filter panel is closed', async () => {
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.selectFilterCheckBox('Status Change');
            await activityTabPage.selectFilterCheckBox('Assignment Change');
            await activityTabPage.selectFilterCheckBox('Category Change');
            await activityTabPage.addAuthorOnFilter('Kadeem Hardison');
            await activityTabPage.clickOnFilterApplyButton();

            await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
        });
        it('[DRDMV-16759]: Verify Applied Filter List Displayed On Manual Task Activity Tab', async () => {
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
        });
        it('[DRDMV-16759]: Verify Applied Filter List With Removed', async () => {
            await activityTabPage.closeNmoreLink();
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
            await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');

            await activityTabPage.removeFilterList();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
            await activityTabPage.closeNmoreLink();

            // Click on + n more button (- Selected filter list is displayed )
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
            await activityTabPage.closeNmoreLink();
            // That particular filter is removed.
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await activityTabPage.removeFilterList();
            console.log(await activityTabPage.isfilterListDisplayed('Status Change'));
            await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');

            // All filters are removed.
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.clickOnFilterClearButton();
            await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');
        });

        it('[DRDMV-16759]: Create Case And Navigate To Automation Task', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('auto task template test case for DRDMV-16759');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateSummary);
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
        });
        it('[DRDMV-16759]: Verify Automation Task Filter On UI', async () => {
            await activityTabPage.clickOnFilterButton();
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            await expect(await activityTabPage.getTextTaskFilterOption('General Notes')).toBe('General Notes');
            await expect(await activityTabPage.getTextTaskFilterOption('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextTaskFilterOption('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextTaskFilterOption('Category Change')).toBe('Category Change');

            await expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");

            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
        });
        it('[DRDMV-16759]: Verify Filters are applied and filter panel is closed', async () => {
            await expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');

            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.selectFilterCheckBox('Status Change');
            await activityTabPage.selectFilterCheckBox('Assignment Change');
            await activityTabPage.selectFilterCheckBox('Category Change');
            await activityTabPage.addAuthorOnFilter('Kadeem Hardison');

            await activityTabPage.clickOnFilterApplyButton();
            await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
        });
        it('[DRDMV-16759]: Verify Applied Filter List Displayed On Automation Task Activity Tab', async () => {
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
        });
        it('[DRDMV-16759]: Verify Applied Filter List With Removed', async () => {
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
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
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
        });

        it('[DRDMV-16759]: Create Case And Navigate To External Task', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('external task test case for DRDMV-16759');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();

            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(externalTemplateData.templateSummary);
            await manageTaskBladePo.clickTaskLink(externalTemplateData.templateSummary);
        });
        it('[DRDMV-16759]: Verify External Task Filter On UI', async () => {
            await activityTabPage.clickOnFilterButton();
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            let filterOption1: string = await activityTabPage.getTextTaskFilterOption('General Notes');
            let filterOption2: string = await activityTabPage.getTextTaskFilterOption('Status Change');
            let filterOption3: string = await activityTabPage.getTextTaskFilterOption('Assignment Change');
            let filterOption4: string = await activityTabPage.getTextTaskFilterOption('Category Change');
            await expect(filterOption1).toBe('General Notes');
            await expect(filterOption2).toBe('Status Change');
            await expect(filterOption3).toBe('Assignment Change');
            await expect(filterOption4).toBe('Category Change');
            await expect(await activityTabPage.isAuthorSearchBoxVisible()).toBeTruthy("authorSearchBoxVisbility is not visible");

            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeLessThan(1);
            await activityTabPage.selectFilterCheckBox('General Notes');
            await expect(await activityTabPage.checkFilterApplyButtonIsDisabledOrEnabled()).toBeGreaterThan(0);
            await expect(await activityTabPage.isFilterPopUpDisplayed()).toEqual('true');
        });
        it('[DRDMV-16759]: Verify Filters Are Applied And Filter Panel Is Closed', async () => {
            await activityTabPage.selectFilterCheckBox('General Notes');
            await activityTabPage.selectFilterCheckBox('Status Change');
            await activityTabPage.selectFilterCheckBox('Assignment Change');
            await activityTabPage.selectFilterCheckBox('Category Change');
            await activityTabPage.addAuthorOnFilter('Kadeem Hardison');
            await activityTabPage.clickOnFilterApplyButton();

            await expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
        });
        it('[DRDMV-16759]: Verify Applied Filter List Displayed On External Task Activity Tab', async () => {
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
        });
        it('[DRDMV-16759]: Verify Applied Filter List With Removed', async () => {
            await activityTabPage.closeNmoreLink();
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
            await expect(await activityTabPage.getTextOfNmoreLink()).toBe('4 Show more');
            await activityTabPage.removeFilterList();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextOfNmoreLink()).toBe('3 Show more');
            await activityTabPage.closeNmoreLink();
            // Click on + n more button (- Selected filter list is displayed )
            await activityTabPage.clickOnNmoreLink();
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
            await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
            expect(await activityTabPage.getTextFromFilterList('Author')).toBe('Author : Kadeem Hardison');
            await activityTabPage.closeNmoreLink();
            // That particular filter is removed.
            await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
            await activityTabPage.removeFilterList();
            console.log(await activityTabPage.isfilterListDisplayed('Status Change'));
            await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');
            // All filters are removed.
            await activityTabPage.clickOnFilterButton();
            await activityTabPage.clickOnFilterClearButton();
            await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');

        });
    });

    //kgaikwad
    describe('[DRDMV-18048]: While adding a note on Case one or more agent can be tagged in Comment', async () => {
        it('[DRDMV-18048]: Create Case ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setContactName('Angelina Jolie');
            await createCase.setSummary('test case for DRDMV-18048');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-18048]: Add More than One Agent And Verify That Person Displayed On Activity ', async () => {
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
        });
    });

    //kgaikwad
    describe('[DRDMV-16754]: Drill Down to different screens from Activities', async () => {
        let caseBodyText = "This is unique caseActivity text " + randomStr;
        let taskBodyText = "This is unique TaskActivity text " + randomStr;
        let knowledgeBodyText = "This is unique KnowledgeActivity text " + randomStr;
        let summary = 'summaryDRDMV16733' + randomStr;
        let caseIdText;
        let manualTemplateData;

        beforeAll(async () => {
            // Create manual task template
            manualTemplateData = {
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
        });

        it('[DRDMV-16754]: Create Case ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16754');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-16754]: Click On Person Names And Inspect Behavior With Case', async () => {
            await activityTabPage.addActivityNote(caseBodyText);
            await activityTabPage.clickOnPostButton();
            caseIdText = await viewCasePo.getCaseID();
            // Redirect on person profile
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
            await expect(browser.getTitle()).toBe('Person Profile - Business Workflows');
            await activityTabPage.clickOnHyperlinkFromActivity(1, caseIdText);
        });
        it('[DRDMV-16754]:Add Task Click On Person Names And Inspect Behavior ', async () => {
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTemplateData.templateSummary);
            await manageTaskBladePo.clickTaskLink(manualTemplateData.templateSummary);
            // View task page
            await expect(browser.getTitle()).toBe('Task Edit - Business Workflows');
            await activityTabPage.addActivityNote(taskBodyText);
            await activityTabPage.clickOnPostButton();
            let taskId: string = await viewTaskPo.getTaskID();
            // View Case Page
            await viewTaskPo.clickOnViewCase();
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
            await activityTabPage.clickOnHyperlinkFromActivity(3, caseIdText);
            // From Case > Activity > Click on Task ID from Task comment
            await activityTabPage.clickOnHyperlinkFromActivity(1, taskId);
            // Verification Open Task > Click on Person Name from Activity
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
        });
        it('[DRDMV-16754]:Create Knowledge Article', async () => {
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('Knowledge Article for DRDMV-16754');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
        });
        it('[DRDMV-16754]:Click On Person Names And Inspect Behavior', async () => {
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('knowoledge Edit link is missing');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
            await activityTabPage.addActivityNote(knowledgeBodyText);
            await activityTabPage.clickOnPostButton();
            await activityTabPage.clickOnHyperlinkFromActivity(1, 'Qadim Katawazi');
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    // ptidke
    describe('[DRDMV-7152]:  [Automatic Task] - Automatic Task: Social: Manual Comments', async () => {
        let randomString = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let taskBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        let autoTemplateData;
        beforeAll(async () => {
            autoTemplateData = {
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
        });
        it('[DRDMV-7152]: Create Case And Navigate On Task Page ', async () => {
            await navigationPage.gotoCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16773');
            await createCase.clickSaveCaseButton();
            await previewCasePo.clickGoToCaseButton();
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateName);
            await manageTaskBladePo.clickTaskLink(autoTemplateData.templateSummary);
        });
        it('[DRDMV-7152]: Verify Task Social Actvity With Single Line/One File Comment', async () => {
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
        });
        it('[DRDMV-7152]: Verify Task Social Actvity With Multiple Line/Html With Text Comment', async () => {
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
        });
        afterAll(async () => {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        });
    });

    //kgaikwad
    describe('[DRDMV-16582]: Check case view count log is displayed on the activity feed of case along with name of user and time', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId;
        beforeAll(async () => {
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
            caseId = newCase.displayId;
        });

        it('[DRDMV-16582]: Login In And Open Case ', async () => {
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.clickOnRefreshButton();
        });
        it('[DRDMV-16582]: Login In With Assignee User and Verify View Count ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qadim Katawazi  viewed the case. ')).toEqual(1);
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
            await navigationPage.gotoPersonProfile();
            await expect(await personProfilePo.getCaseViewCount(' Viewed the  ' + caseId)).toEqual(1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[DRDMV-16589]: Check case view count is not increased by opening same case by different places', async () => {
        let summary = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomString = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId;
        let manualTaskTemplateData;
        let caseData;

        beforeAll(async () => {
 
            // Create Case
            caseData = {
                "Requester": "qtao",
                "Summary": "DRDMV16589TC"+randomString,
                "Assigned Company": "Petramco",
                "Business Unit": "Canada Support",
                "Support Group": "CA Support 1",
                "Assignee": "qdu"
            }
            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
            
            // Create Task Template
            manualTaskTemplateData = {
                "templateName": "DRDMV-16589_task template" + summary,
                "templateSummary": "DRDMV-16589_Manual_task template summary" + summary,
                "templateStatus": "Active",
                "taskCompany": 'Petramco',
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Canada Support",
                "ownerGroup": "CA Support 1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            

        });
        it('[DRDMV-16589]: Verify View Case Count Thorght Task ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(caseId);
            // // Open Task
            expect(await viewCasePo.getCaseID()).toBe(caseId, 'CaseId is missing in qdu user');
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate(manualTaskTemplateData.templateName);
            await manageTaskBladePo.clickTaskLink(manualTaskTemplateData.templateSummary);
            await viewTaskPo.clickOnViewCase();
            // Goto case   
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qiang Du  viewed the case. ')).toEqual(1);
        });
        it('[DRDMV-16589]: Verify View Case Count Thorght Quick Case ', async () => {
            // Goto Quick Case
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.setCaseSummary(caseData.Summary);
            await quickCasePo.clickOnCaseSummaryInRecommendedCases(caseData.Summary);
            await quickCasePo.gotoCaseButton();
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qiang Du  viewed the case. ')).toEqual(1);
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName('qdu');
            await quickCasePo.setCaseSummary(caseData.Summary);
            await quickCasePo.saveCase();
            await quickCasePo.gotoCaseButton();
            await navigationPage.gotoCaseConsole();
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.isEmailLinkPresent()).toBeTruthy('FailuerMsg: Email Link is not present');
            await expect(await activityTabPage.getCaseViewCount('Qiang Du  viewed the case. ')).toEqual(1);
        });
        it('[DRDMV-16589]: Add Related Person', async () => {
            await viewCasePo.clickOnTab('Related Persons');
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qadim Katawazi', 'Related to');
            await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
            await expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qadim Katawazi', 'Related to')).toBeTruthy();
        });
        it('[DRDMV-16589]: Verify View Case Count Thorght Person Profile Related Case Tab', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await navigationPage.gotoPersonProfile();
            await personProfilePo.clickOnTab('Related Cases');
            await relatedCaseTab.clickOnCaseSummaryLink(caseData.Summary);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing');
            await activityTabPage.clickOnRefreshButton();
            await expect(await activityTabPage.getCaseViewCount('Qadim Katawazi  viewed the case. ')).toEqual(1);
            await expect(await activityTabPage.getCaseViewCount('Qiang Du  viewed the case. ')).toEqual(1);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //kgaikwad
    describe('[DRDMV-16591]: Check case count is changed with different permission of user read/write/no access to the case', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let getUrl;
        let passwd = 'Password_1234';
        let newCase;
        let caseId;

        beforeAll(async () => {
            // Create Case
            let caseData = {
                "Requester": "elizabeth",
                "Summary": "DRDMV-16591_TC" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }
            //Create a case with qfeng as Write Permission, qtao has no permission and qdu as Read Permission
            await apiHelper.apiLogin('qkatawazi');
            newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;
        });

        it('[DRDMV-16591]: Give Read Access To User', async () => {
            await caseConsolePo.searchAndOpenCase(caseId);
            await viewCasePo.clickOnTab('Case Access');
            //Read Access Agent
            await accessTabPo.clickToExpandAccessEntitiySearch('Agent Access','Case');
            await accessTabPo.selectAgent('qdu','Agent');
            await accessTabPo.clickAccessEntitiyAddButton('Agent');
            expect(await accessTabPo.isAccessTypeOfEntityDisplayed('Qiang Du','Read')).toBeTruthy('Failuer:Qiang Du Agent Name is missing');
            //Login with Read Permission User
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(caseId);
            expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing with qdu User');
        });
        it('[DRDMV-16591]: Login with Write User and check read user count', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing with qyuan User');
            await expect(await activityTabPage.getCaseViewCount('Qiang Du  viewed the case. ')).toEqual(1);
        });
        it('[DRDMV-16591]: Login with Read user and check user count', async () => {
            //Login with Read user and check write user count
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await caseConsolePo.searchAndOpenCase(caseId);
            await expect(await viewCasePo.getCaseID()).toBe(caseId, 'FailureMsg: CaseId is missing with qyuan User');
            await expect(await activityTabPage.getCaseViewCount('Qiao Feng  viewed the case. ')).toEqual(1);
        });
        it('[DRDMV-16591]: Login With No Access User And Verify Error Message', async () => {
            let url: string = await browser.getCurrentUrl();
            // Login with No Access user
            await navigationPage.signOut();
            await loginPage.login('qtao');
            await browser.get(url);
            await expect(await utilityCommon.getAllPopupMsg()).toContain(`Record Instance does not exist in the database. com.bmc.dsm.case-lib:Case:${newCase.id}`);
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //kgaikwad
    describe('[DRDMV-18052]: Alert Notification should be send to tagged persons other than Assignee and Requester', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseId;
        beforeAll(async () => {
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
            caseId = newCase.displayId;
        });
        it('[DRDMV-18052]: Open Case And Social Comment ', async () => {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.addActivityNote('From DRDMV-18052 ');
            await activityTabPage.addPersonInActivityNote('qkatawazi');
            await activityTabPage.clickOnPostButton();
        });
        it('[DRDMV-18052]: Click Alert Icon And Verify Alet Notification Of Social Comment', async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await notificationPo.clickOnNotificationIcon();
            await expect(await notificationPo.isAlertPresent('Qiao Feng added a note to ' + caseId)).toBeTruthy('Alert message is not present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //kgaikwad
    describe('[DRDMV-16730]: Show More/Less option in Case Activity Tab with Attachments', async () => {
        let summary = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues1 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues2 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues3 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues4 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues5 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let randomValues6 = [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNoteBodyText1 = `${randomValues1}\n${randomValues2}\n${randomValues3}\n${randomValues4}\n${randomValues5}`;
        let addNoteBodyText2 = `${randomValues1}\n${randomValues2}\n${randomValues3}\n${randomValues4}\n${randomValues5}\n${randomValues6}`;
        let caseId;
        let filePath1 = '../../data/ui/attachment/articleStatus.png';
        let filePath2 = '../../data/ui/attachment/bwfJpg.jpg';
        let filePath4 = '../../data/ui/attachment/bwfJpg2.jpg';
        let filePath5 = '../../data/ui/attachment/bwfJpg3.jpg';
        let filePath7 = '../../data/ui/attachment/bwfJson1.json';
        let filePath8 = '../../data/ui/attachment/bwfJson2.json';
        let filePath9 = '../../data/ui/attachment/bwfJson3.json';
        let filePath10 = '../../data/ui/attachment/bwfJson4.json';
        let filePath11 = '../../data/ui/attachment/bwfJson5.json';

        beforeAll(async () => {
            // Create Case
            let caseData = {
                "Requester": "qdu",
                "Summary": "DRDMV-16730_TC" + summary,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng"
            }

            await apiHelper.apiLogin('qkatawazi');
            let newCase = await apiHelper.createCase(caseData);
            caseId = newCase.displayId;

        });

        it('[DRDMV-16730]: Verify Logs With 5 Lines Or Less Than 5 Lines ', async () => {
            await caseConsolePo.searchAndOpenCase(caseId);
            await activityTabPage.addActivityNote(addNoteBodyText1);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg1: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg2: Show more link is displayed');
        });
        it('[DRDMV-16730]: Verify Logs With More Than 5 Lines ', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg3: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg4: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg5: BodyText is missing');
            await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg6: Show less missing for body text');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg7: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg8: BodyText is missing');
        });
        it('[DRDMV-16730]: Verify Logs With 5 Lines With 3 Attachment ', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText1);
            await activityTabPage.addAttachment([filePath1, filePath2]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg12: Show more link for attachment is missing')
            await expect(await activityTabPage.isAttachedFileNameDisplayed('articleStatus.png')).toBeTruthy(`FailureMsg9: ${filePath1} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy(`FailureMsg10: ${filePath2} is missing`);
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg13: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg14: Show more link is displayed');
        });
        it('[DRDMV-16730]: Verify Logs With More Than 5 Lines  With 3 Attachment ', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.addAttachment([filePath4, filePath5]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg18: Show more link for attachment is missing')
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy(`FailureMsg15: ${filePath4} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg3.jpg')).toBeTruthy(`FailureMsg16: ${filePath5} is missing`);
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg19: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg20: BodyText is missing');
            await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg21: Show less missing for body text');
        });
        it('[DRDMV-16730]: Verify Logs With More Than 5 Lines With More Than 4 Attachment ', async () => {
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
        });
        it('[DRDMV-16730]: Download Attachments Files ', async () => {
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

        });
    });

    //kgaikwad
    describe('[DRDMV-16765]: Validate Show More/Less option in KA Activity Tab', async () => {
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

        it('[DRDMV-16765]: Create Knowledge Article And Navigate To Activity Tab ', async () => {
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge Article title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test_KA_for_DRDMV-16765');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await utilityCommon.closePopUpMessage();
            await previewKnowledgePo.clickGoToArticleButton();
            await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
            await viewKnowledgeArticlePo.clickOnTab('Activity');
        });
        it('[DRDMV-16765]: Verify Logs With 5 Lines Or Less Than 5 Lines ', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText1);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg1: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg2: Show more link is displayed');
        });
        it('[DRDMV-16765]: Verify Logs With More Than 5 Lines', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg3: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg4: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg5: BodyText is missing');
            await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg6: Show less missing for body text');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg7: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg8: BodyText is missing');
        });
        it('[DRDMV-16765]: Verify Logs With 5 Lines  With 3 Attachment', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText1);
            await activityTabPage.addAttachment([filePath1, filePath2]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg12: Show more link for attachment is missing')
            await expect(await activityTabPage.isAttachedFileNameDisplayed('articleStatus.png')).toBeTruthy(`FailureMsg9: ${filePath1} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg.jpg')).toBeTruthy(`FailureMsg10: ${filePath2} is missing`);
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText1, 1)).toBeTruthy('FailureMsg13: BodyText is missing');
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeFalsy('FailureMsg14: Show more link is displayed');
        });
        it('[DRDMV-16765]: Verify Logs With More Than 5 Lines  With 3 Attachment', async () => {
            await activityTabPage.addActivityNote(addNoteBodyText2);
            await activityTabPage.addAttachment([filePath4, filePath5]);
            await activityTabPage.clickOnPostButton();
            await expect(await activityTabPage.clickShowMoreLinkInAttachmentActivity(1)).toBeFalsy('FailureMsg18: Show more link for attachment is missing')
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg2.jpg')).toBeTruthy(`FailureMsg15: ${filePath4} is missing`);
            await expect(await activityTabPage.isAttachedFileNameDisplayed('bwfJpg3.jpg')).toBeTruthy(`FailureMsg16: ${filePath5} is missing`);
            await expect(await activityTabPage.clickShowMoreLinkInActivity(1)).toBeTruthy('FailureMsg19: Show more link is displayed');
            await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText2, 1)).toBeTruthy('FailureMsg20: BodyText is missing');
            await expect(await activityTabPage.clickShowLessLinkInActivity(1)).toBeTruthy('FailureMsg21: Show less missing for body text');
        });
        it('[DRDMV-16765]: Verify Logs With More Than 5 Lines With More Than 4 Attachment', async () => {
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
        });
        it('[DRDMV-16765]: Verify Download Attachments Files', async () => {
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
        });
        afterAll(async () => {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

    });

    //kgaikwad
    describe('[DRDMV-16764]: Validate all type of social activities are displayed correctly in KA Activity tab', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let flag = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let unFlag = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let reviewPending = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let feedback = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let addNoteBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let knowledgePublisherUser = 'kmills';
        let knowledgeTitile = 'knowledge16764' + randomStr;
        let KADetails;

        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login(knowledgePublisherUser);
            await navigationPage.switchToApplication('Knowledge Management');

            await apiHelper.apiLogin(knowledgePublisherUser);
            let articleData = {
                "knowledgeSet": "HR",
                "title": `${knowledgeTitile}`,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United Kingdom Support",
                "assigneeSupportGroup": "GB Support 1",
                "assignee": "KMills"
            }
            KADetails = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(KADetails.id, "SMEReview", "KMills", "GB Support 2", "Petramco")).toBeTruthy("Article with SME Review status not updated.");
    });
    it('[DRDMV-16764]: Create Flag/UnFlag Activity Log', async () => {
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(KADetails.displayId);
        await expect(await viewKnowledgeArticlePo.isEditLinkDisplayedOnKA()).toBeTruthy('Edit button missing on knoledge page.');
        await viewKnowledgeArticlePo.clickOnFlagButton();
        await flagUnflagKnowledgePo.setTextInTellUsMore(flag);
        await flagUnflagKnowledgePo.clickOnFlageButtonOnBlade();

        await utilityCommon.closePopUpMessage();
        await viewKnowledgeArticlePo.clickOnUnFlagButton();
        await flagUnflagKnowledgePo.setTextInTellUsMore(unFlag);
        await flagUnflagKnowledgePo.clickOnUnFlageButtonOnBlade();
        await utilityCommon.closePopUpMessage();
    });
    it('[DRDMV-16764]: Create Feedback Activity Log', async () => {
        await viewKnowledgeArticlePo.clickOnKAUsefulNoButton();
        await feedbackBladeKnowledgeArticlePo.setTextInTellUsMore(feedback);
        await feedbackBladeKnowledgeArticlePo.clickOnSaveButtonOnFeedBack();
    });
    it('[DRDMV-16764]: Create Review Activity Log', async () => {
        await utilityCommon.closePopUpMessage();
        await viewKnowledgeArticlePo.clickReviewPendingLink();
        await reviewCommentsPo.setTextInTellUsMore(reviewPending);
        await reviewCommentsPo.clickApprovedButton();
        await utilityCommon.closePopUpMessage();
        await utilityCommon.closePopUpMessage();
    });
    it('[DRDMV-16764]: Create Commnet Activity Log', async () => {
        await viewKnowledgeArticlePo.clickOnTab('Activity');
        await activityTabPage.addActivityNote(addNoteBodyText);
        await activityTabPage.clickOnPostButton();
    });
    it('[DRDMV-16764]: Verify Flag/Unflag In Activity', async () => {
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
    });
    it('[DRDMV-16764]: Verify Feedback In Activity', async () => {
        // verify feedback in activity
        await expect(await activityTabPage.isLogIconDisplayedInActivity('comments', 3)).toBeTruthy('FailureMsg: Note pencil icon is missing')
        await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills has provided the feedback for the article', 3));
        await expect(await activityTabPage.isBodyDisplayedInActivity(feedback, 3)).toBeTruthy('FailureMsg: Kyle Mills has provided the feedback for the article is missing');
        await expect(await activityTabPage.isLockIconDisplayedInActivity(3)).toBeTruthy('FailureMsg1: LockIcon is missing');
    });
    it('[DRDMV-16764]: Verify Feedback In Activity', async () => {
        // verify Review in activity
        await expect(await activityTabPage.isLogIconDisplayedInActivity('pencil', 2)).toBeTruthy('FailureMsg: Note pencil icon is missing')
        await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills reviewed this article and provided this comment', 2));
        await expect(await activityTabPage.isBodyDisplayedInActivity(reviewPending, 2)).toBeTruthy('FailureMsg: Kyle Mills reviewed this article and provided this comment is missing');
        await expect(await activityTabPage.isLockIconDisplayedInActivity(2)).toBeTruthy('FailureMsg1: LockIcon is missing');
    });
    it('[DRDMV-16764]: Verify Add Note Actvity In Activity Log', async () => {
        // Verify KA comment
        await expect(await activityTabPage.isLogIconDisplayedInActivity('note_pencil', 1)).toBeTruthy('FailureMsg: Note pencil icon is missing')
        await expect(await activityTabPage.isTitleTextDisplayedInActivity('Kyle Mills added a note', 1));
        await expect(await activityTabPage.isAddNoteTextDisplayedInActivity(addNoteBodyText, 1)).toBeTruthy('FailureMsg: Kyle Mills added a note');
        await expect(await activityTabPage.isLockIconDisplayedInActivity(1)).toBeTruthy('FailureMsg1: LockIcon is missing');
    });
    afterAll(async () => {
        await navigationPage.signOut();
        await loginPage.login('qkatawazi');
    });

});
});






