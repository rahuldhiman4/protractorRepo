import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import { ITaskTemplate } from '../../data/api/interface/task.template.interface.api';
import createCase from '../../pageobject/case/create-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePo from '../../pageobject/common/person-profile.po';
import createKnowlegePo from '../../pageobject/knowledge/create-knowlege.po';
import activityTabPage from '../../pageobject/social/activity-tab.po';
import manageTaskBladePo from '../../pageobject/task/manage-task-blade.po';
import viewTaskPo from '../../pageobject/task/view-task.po';
import utilCommon from '../../utils/util.common';
import viewKnowledgeArticlePo from '../../pageobject/knowledge/view-knowledge-article.po';

describe('Case Activity', () => {

    const randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qkatawazi');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await browser.refresh();
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
            await createKnowlegePo.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickOnActivityTab();
            // // 2nd Step: Inspect Case Activity UI - Click on Filter       
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
            // await utilCommon.waitUntilSpinnerToHide();
            expect(await activityTabPage.isFilterPopUpDisplayed()).toBe('false');
            // ii) Selected Filters are displayed in Activity with first filter and + other selected filters
            expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextFromFilterList('Unflag')).toBe('Unflag'), 'Unflag is missing';
            expect(await activityTabPage.getTextFromFilterList('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie'), 'Author: ajolie is missing';
            // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
            await activityTabPage.closeNmoreLink();
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
            expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 4 more');
            await activityTabPage.removeFilterList();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 3 more');
            await activityTabPage.closeNmoreLink();
            // await utilCommon.waitUntilSpinnerToHide();
            // iv)- Click on + n more button (- Selected filter list is displayed )
            await activityTabPage.clickOnNmoreLink();
            expect(await activityTabPage.getTextFromFilterList('Flag')).toBe('Flag'), 'Flag is missing';
            expect(await activityTabPage.getTextFromFilterList('Unflag')).toBe('Unflag'), 'Assignment Change is missing';
            expect(await activityTabPage.getTextFromFilterList('Feedback')).toBe('Feedback'), 'Feedback is missing';
            expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie'), 'Author: ajolie is missing';
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
    }, 90 * 1000);

    //kgaikwad
    it('[DRDMV-18141]: Clicking on any tagged person name from Activity tab should navigate us to Persons Profile', async () => {
        let caseBodyText = `CaseBody${randomStr}`;
        // 2nd Step :Open Case from pre condition and inspect its activities
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-18141');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        await activityTabPage.addActivityNote(caseBodyText);
        await activityTabPage.addPersonInActivityNote('Elizabeth Jeffries');
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isHyperlinkOfActivityDisplay(caseBodyText, 'Elizabeth Jeffries')).toBeTruthy('PersonName is not displayed correctly');
        await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, 'Elizabeth Jeffries');
        expect(await personProfilePo.getPersonName()).toBe('Elizabeth Jeffries '), 'Elizabeth Jeffries name is missing';
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
            await createKnowlegePo.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickOnActivityTab();
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
            await activityTabPage.addAuthorOnFilter('Qiwei Liu');
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
            await activityTabPage.removeAuthorFromFilter();
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
    }, 90 * 1000);

    //kgaikwad
    it('[DRDMV-16773]: [-ve] - Person details displayed in Activity who have long name', async () => {
        try {
            let caseBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let taskBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            let knowledgeBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            // 2nd Step :Open Case from pre condition and inspect its activities
            await navigationPage.gotCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16773');
            await createCase.clickSaveCaseButton();
            await createCase.clickGoToCaseButton();

            await activityTabPage.addActivityNote(caseBodyText);
            await activityTabPage.addPersonInActivityNote('Jonathan Lowell Spencer Storm');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(caseBodyText, 'Jonathan Lowell Spencer Storm')).toBeTruthy('PersonName is not displayed correctly');
            // 2nd Step: Open Task from pre condition and inspect its activities
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate('File Report');
            await manageTaskBladePo.clickTaskLinkOnManageTask('File Report');
            await activityTabPage.addActivityNote(taskBodyText);
            await activityTabPage.addPersonInActivityNote('Jonathan Lowell Spencer Storm');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(taskBodyText, 'Jonathan Lowell Spencer Storm')).toBeTruthy('PersonName is not displayed correctly');
            // 3rd Step: Open KA from pre condition and inspect its activities
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows'), 'Knowledge page title is missing';
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('test case for DRDMV-16773');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await createKnowlegePo.clickOnviewArticleLinkButton();
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPage.addActivityNote(knowledgeBodyText);
            await activityTabPage.addPersonInActivityNote('Jonathan Lowell Spencer Storm');
            await activityTabPage.clickOnPostButton();
            expect(await activityTabPage.isHyperlinkOfActivityDisplay(knowledgeBodyText, 'Jonathan Lowell Spencer Storm')).toBeTruthy('PersonName is not displayed correctly');
        } catch (e) {
            throw e;
        } finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    }, 110 * 1000);

    //kgaikwad
    it('[DRDMV-16733]: Case Activity Filter UI validation', async () => {
        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16733');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
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
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie'), 'Author: ajolie is missing';
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes'), 'General Notes is missing';
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 4 more');
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 3 more');
        await activityTabPage.closeNmoreLink();
        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change'), 'Assignment Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change'), 'Category Change is missing';
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie'), 'Author: ajolie is missing';
        await activityTabPage.closeNmoreLink();
        //  v) - That particular filter is removed.
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change'), 'Status Change is missing';
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.isfilterListDisplayed('Status Change')).not.toBeTruthy('Status Change displayed');
        // 6) All filters are removed.
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.clickOnFilterClearButton();
        await expect(await activityTabPage.isfilterPresent()).not.toBeTruthy('filter displayed');
    });

    //kgaikwad
    it('[DRDMV-16760]: From Task Activity Filters > Person search behavior in Author field', async () => {
        // 1st step: Logged in successfully and Task profile gets opened
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16760');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate('File Report');
        await manageTaskBladePo.clickTaskLinkOnManageTask('File Report');
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
        await activityTabPage.addAuthorOnFilter('Qiwei Liu');
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
        await activityTabPage.removeAuthorFromFilter();
        // 5th Step: User is selected and Author field gets disabled.       
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
        // i)- Click on x button from author field (- Field gets cleared and enabled to search another user)
        await activityTabPage.removeAuthorFromFilter();
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
        // ii) - Select another user and click on Apply
        await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
    });

    //kgaikwad
    it('[DRDMV-16734]: From Case Activity Filters > Person search behavior in Author field', async () => {
        // 1st step: Login to BWF with Case agent and open case from pre condition
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16734');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        // 2nd Step: From Case Activity > Click on Filter and In Author filter > Search for all type of users from pre condition who have added comment in Case
        // i) Verify User is able to search for any user
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await activityTabPage.removeAuthorFromFilter();
        // 3rd In Author field search for User using *First Name*, *Last Name*, *Email*, *Login ID*, and *Person ID*
        await activityTabPage.addAuthorOnFilter('Angelina');//FirstName
        await activityTabPage.removeAuthorFromFilter();
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
        await activityTabPage.removeAuthorFromFilter();
        // 5th Step: User is selected and Author field gets disabled 
        // i) User is selected and Author field gets disabled 
        await activityTabPage.addAuthorOnFilter('Angelina Jolie');
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeFalsy('Author field is empty');
        // ii)- Click on x button from author field (- Field gets cleared and enabled to search another user)
        await activityTabPage.removeAuthorFromFilter();
        await expect(await activityTabPage.isAuthorBoxEmpty()).toBeTruthy('Author field is not empty');
        // iii) - Select another user and click on Apply
        await activityTabPage.addAuthorOnFilter('Elizabeth Jeffries');
    });

    //kgaikwad
    it('[DRDMV-16759]: Task Activity Filter UI validation', async () => {
        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('manual task test case for DRDMV-16759');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();

        // On view case page.
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate('File Report');
        await manageTaskBladePo.clickTaskLinkOnManageTask('File Report');

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
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie');
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 4 more');

        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 3 more');
        await activityTabPage.closeNmoreLink();

        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie');
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
        }

        autoTemplateData.templateName = autoTemplateData.templateName + randomStr;
        autoTemplateData.templateSummary = autoTemplateData.templateSummary + randomStr;
        autoTemplateData.processName = autoTemplateData.processName + randomStr;

        await apiHelper.apiLogin('qkatawazi');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTemplateData);
        console.log("Automated task Template created===", autoTaskTemplate.id);

        // 1st step: Login to BWFA as Case agent and open Manual Task from pre condition
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('auto task template test case for DRDMV-16759');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();

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
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie');
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 4 more');
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 3 more');
        await activityTabPage.closeNmoreLink();

        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie');
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
        };
        externalTemplateData.templateName = externalTemplateData.templateName + randomStr;
        externalTemplateData.templateSummary = externalTemplateData.templateSummary + randomStr;

        await apiHelper.apiLogin('qkatawazi');
        let externalTaskTemplate = await apiHelper.createExternalTaskTemplate(externalTemplateData);
        console.log("External Task Template is created===", externalTaskTemplate.id);

        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('external task test case for DRDMV-16759');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();

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
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie');
        // iii)- Filter is removed and next filter gets displayed in UI and +n more count reduced by 1
        await activityTabPage.closeNmoreLink();
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('General Notes')).toBe('General Notes');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 4 more');
        await activityTabPage.removeFilterList();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextOfNmoreLink()).toBe('+ 3 more');
        await activityTabPage.closeNmoreLink();

        // iv)- Click on + n more button (- Selected filter list is displayed )
        await activityTabPage.clickOnNmoreLink();
        await expect(await activityTabPage.getTextFromFilterList('Status Change')).toBe('Status Change');
        await expect(await activityTabPage.getTextFromFilterList('Assignment Change')).toBe('Assignment Change');
        await expect(await activityTabPage.getTextFromFilterList('Category Change')).toBe('Category Change');
        await expect(await activityTabPage.getTextFromFilterList('ajolie')).toBe('Author: ajolie');
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
    }, 210 * 1000);

    //kgaikwad
    it('[DRDMV-18048]: While adding a note on Case one or more agent can be tagged in Comment', async () => {
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.selectContact('Angelina Jolie');
        await createCase.setSummary('test case for DRDMV-18048');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        await expect(await activityTabPage.getPersonCount('Hi hello @Allen')).toBeGreaterThan(3);
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

    //kgaikwad
    it('[DRDMV-16754]: Drill Down to different screens from Activities', async () => {
        try {
            let caseBodyText = "This is unique caseActivity text " + Math.floor(Math.random() * 1000000);
            let taskBodyText = "This is unique TaskActivity text " + Math.floor(Math.random() * 1000000);
            let knowledgeBodyText = "This is unique KnowledgeActivity text " + Math.floor(Math.random() * 1000000);
            await navigationPage.gotCreateCase();
            await createCase.selectRequester('Al Allbrook');
            await createCase.setSummary('test case for DRDMV-16754');
            await createCase.clickSaveCaseButton();
            await createCase.clickGoToCaseButton();

            // On view case page.
            // 2nd step verification From Case Activities, click on Different person names and inspect behavior
            await activityTabPage.addActivityNote(caseBodyText);
            await activityTabPage.clickOnPostButton();
            let caseIdText: string = await viewCasePo.getCaseID();
            // Redirect on person profile
            await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, 'Qadim Katawazi');
            await expect(browser.getTitle()).toBe('Person Profile - Business Workflows');
            await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, caseIdText);

            // 3nd step verification, From Case > Activity > Task related note > Click on Person name
            await viewCasePo.clickAddTaskButton();
            await manageTaskBladePo.addTaskFromTaskTemplate('File Report');
            await manageTaskBladePo.clickTaskLinkOnManageTask('File Report');

            // View task page
            await expect(browser.getTitle()).toBe('Task Edit - Business Workflows');
            await activityTabPage.addActivityNote(taskBodyText);
            await activityTabPage.clickOnPostButton();
            let taskId: string = await viewTaskPo.getTaskID();

            // View Case Page
            await viewTaskPo.clickOnViewCase();
            await activityTabPage.clickOnHyperlinkFromActivity(taskBodyText, 'Qadim Katawazi');
            await activityTabPage.clickOnHyperlinkFromActivity(caseBodyText, caseIdText);

            // 4th step From Case > Activity > Click on Task ID from Task comment
            await activityTabPage.clickOnHyperlinkFromActivity(taskBodyText, taskId);

            // 5th step verification Open Task > Click on Person Name from Activity
            await activityTabPage.clickOnHyperlinkFromActivity(taskBodyText, 'Qadim Katawazi');

            // 6th step verification
            // Open KA > Click on Person Name from Activity, On Crate Knowlege Page
            await navigationPage.gotoCreateKnowledge();
            await expect(browser.getTitle()).toBe('Knowledge Article Templates Preview - Business Workflows');
            await createKnowlegePo.clickOnTemplate('Reference');
            await createKnowlegePo.clickOnUseSelectedTemplateButton();
            await createKnowlegePo.addTextInKnowlegeTitleField('Knowledge Article for DRDMV-16754');
            await createKnowlegePo.selectKnowledgeSet('HR');
            await createKnowlegePo.clickOnSaveKnowledgeButton();
            await createKnowlegePo.clickOnviewArticleLinkButton();

            // View Knowledege Page
            await utilCommon.switchToNewWidnow(1);
            await viewKnowledgeArticlePo.clickOnActivityTab();
            await activityTabPage.addActivityNote(knowledgeBodyText);
            await activityTabPage.clickOnPostButton();
            await activityTabPage.clickOnHyperlinkFromActivity(knowledgeBodyText, 'Qadim Katawazi');
        } catch (e) {
            throw e;
        } finally {
            await utilCommon.switchToDefaultWindowClosingOtherTabs();
        }
    }, 150 * 1000);

    it('[DRDMV-7152]: [Automatic Task] - Automatic Task: Social: Manual Comments', async () => {
        // Create automated task template
        let autoTemplateData = {
            "templateName": "auto task DRDMV-7152 template",
            "templateSummary": "auto task DRDMV-7152template summary",
            "templateStatus": "Active",
            "processBundle": "com.bmc.dsm.case-lib",
            "processName": "Case Process ",
        }

        autoTemplateData.templateName = autoTemplateData.templateName + randomStr;
        autoTemplateData.templateSummary = autoTemplateData.templateSummary + randomStr;
        autoTemplateData.processName = autoTemplateData.processName + randomStr;
        await apiHelper.apiLogin('fritz');
        let autoTaskTemplate = await apiHelper.createAutomatedTaskTemplate(autoTemplateData);
        console.log("Automated task Template created===", autoTaskTemplate.id);

        let filePath = '../../data/ui/attachment/bwfPdf.pdf';
        
        let taskBodyText = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        await navigationPage.gotCreateCase();
        await createCase.selectRequester('Al Allbrook');
        await createCase.setSummary('test case for DRDMV-16773');
        await createCase.clickSaveCaseButton();
        await createCase.clickGoToCaseButton();
        await viewCasePo.clickAddTaskButton();
        await manageTaskBladePo.addTaskFromTaskTemplate(autoTemplateData.templateName);
        await manageTaskBladePo.clickTaskLinkOnManageTask(autoTemplateData.templateSummary);
        //single line comment
        await activityTabPage.addActivityNote(taskBodyText);
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.getFirstPostContent()).toContain(taskBodyText);
        //one file and commnet
        await activityTabPage.addActivityNote('step 2nd added '+taskBodyText);
        await activityTabPage.addAttachment(filePath);
        await activityTabPage.clickOnPostButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await activityTabPage.getFirstPostContent()).toContain('step 2nd added '+taskBodyText);
        expect(await activityTabPage.isAttachedFileNameDisplayed('bwfPdf.pdf')).toBeTruthy('file is not present');
        await activityTabPage.clickAttachedFile('bwfPdf.pdf');
        expect(await utilCommon.isFileDownloaded('bwfPdf.pdf')).toBeTruthy('File is not downloaded.');   
        //multiple line
        let newline:string= "this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things this is text for new line and add new things";   
        await activityTabPage.addActivityNote(newline);
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnShowMore();
        expect(await activityTabPage.getFirstPostContent()).toContain(newline);
        //html with text
        let withHTML:string= "this is text for new line and add new things this is text for new line <p><img alt=''>new link<a>Google</a> New things</p> <p>This is new test<span>Font 72Font 72this is newly added text</span></p> <td><span style='color:#3498db;'>SettingColor</span></td>";   
        await activityTabPage.addActivityNote(withHTML);
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnShowMore();
        expect(await activityTabPage.getFirstPostContent()).toContain(withHTML);
        let textWithMultipleAttachment:string= "new values with attachments";   
        await activityTabPage.addActivityNote(textWithMultipleAttachment);
        for(let i=0;i<=5;i++){
        await activityTabPage.addAttachment('../../data/ui/attachment/demo.txt');
        }
        await activityTabPage.clickOnPostButton();
        await utilCommon.waitUntilSpinnerToHide();
        expect(await activityTabPage.getFirstPostContent()).toContain(textWithMultipleAttachment);
        expect(await activityTabPage.getCountAttachedFiles('demo.txt')).toBe(6);
    });
})
