import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import activityTabPage from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from "../../utils/utility.grid";

describe('Complex Surveys', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qfeng');
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.addCommonConfig('ADD_DWP_SURVEY_ON_CASE', [true], 'Petramco');
    });

    afterAll(async () => {
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.deleteCommonConfig('ADD_DWP_SURVEY_ON_CASE', 'Petramco');
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    beforeEach(async () => {
        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
    });

    it('[DRDMV-18118]: [Complex Survey] - Survey Details in Case having Stars', async () => {
        await apiHelper.apiLogin("qkatawazi");

        //Testing the UI with Date Time at top
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['SurveyDateTimeTop_DRDMV-18118_1'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SurveyDateTimeTop_DRDMV-18118_1']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 4 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("Fri Dec 13 2019 9:26:00 PM");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 4 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("Fri Dec 13 2019 9:26:00 PM");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("This is an answer in multiline format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied\n6. Extremely Satisfied\n7. Beyond Expectations\n8. Over and Above\n9. Excellent\n10. Precious");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("Very High Quality");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("Unique");
        await activityTabPage.closeSurveyInformation();

        //Testing the UI with Radio button at top
        await navigationPage.gotoCaseConsole();
        let serviceReqId1: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId1;
        let response1 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId1 = response1.displayId;
        cmplxSurveyData['SurveyRadioButtonTop_DRDMV-18118_2'].serviceRequestId = serviceReqId1;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SurveyRadioButtonTop_DRDMV-18118_2']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId1);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 3 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("Extremely Well");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 3 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("Fri Dec 13 2019 9:20:00 PM");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("This is an answer in multiline format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("Very High Quality");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("Unique");
        await activityTabPage.closeSurveyInformation();

        //Testing the UI with Checkbox at top
        await navigationPage.gotoCaseConsole();
        let serviceReqId2: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId2;
        let response2 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId2 = response2.displayId;
        cmplxSurveyData['SurveyCheckboxTop_DRDMV-18118_3'].serviceRequestId = serviceReqId2;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SurveyCheckboxTop_DRDMV-18118_3']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId2);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 5 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 5 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("Unique");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Fri Dec 13 2019 9:20:00 PM");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("This is an answer in multiline format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("Very High Quality");
        await activityTabPage.closeSurveyInformation();

        //Testing the UI with Dropdown at top
        await navigationPage.gotoCaseConsole();
        let serviceReqId3: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId3;
        let response3 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId3 = response3.displayId;
        cmplxSurveyData['SurveyDropdownTop_DRDMV-18118_4'].serviceRequestId = serviceReqId3;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SurveyDropdownTop_DRDMV-18118_4']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId3);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 5 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("Very High Quality");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 5 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("Very High Quality");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("Unique");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("Fri Dec 13 2019 9:20:00 PM");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("This is an answer in multiline format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied");
        await activityTabPage.closeSurveyInformation();

        //Testing the UI with Text field at top
        await navigationPage.gotoCaseConsole();
        let serviceReqId4: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId4;
        let response4 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId4 = response4.displayId;
        cmplxSurveyData['SurveyTextFieldTop_DRDMV-18118_5'].serviceRequestId = serviceReqId4;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SurveyTextFieldTop_DRDMV-18118_5']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId4);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 1 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 1 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width. Repeated text again - This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("Very High Quality");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Unique");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("Fri Dec 13 2019 9:20:00 PM");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("This is an answer in multiline format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied");
        await activityTabPage.closeSurveyInformation();

        //Testing the UI with Text Area at top
        await navigationPage.gotoCaseConsole();
        let serviceReqId5: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId5;
        let response5 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId5 = response5.displayId;
        cmplxSurveyData['SurveyTextAreaTop_DRDMV-18118_6'].serviceRequestId = serviceReqId5;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SurveyTextAreaTop_DRDMV-18118_6']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId5);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 2 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 2 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multiline comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("Line 1- This is\nLine2 - an answer\nLine3 - in multiline format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied\nResponse in this field is received in single line without any line break but in display you may see response in multiline based in display width. Repeated text again - This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width. Repeated text again - This is an answer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you may see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("Very High Quality");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("Unique");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("Fri Dec 13 2019 9:20:00 PM");
        await activityTabPage.closeSurveyInformation();
    });//, 140 * 1000);

    it('[DRDMV-18117]: [Simple Survey] - Survey Details in Case which is submitted from DWP with different options', async () => {
        await apiHelper.apiLogin("qkatawazi");

        //Create and check the Simple Survey with Long feedback
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['SimpleSurveyLongFeedback_DRDMV-18117_1'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyLongFeedback_DRDMV-18117_1']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 3 (out of 5)", "Rating does not match");
        let stringText = "Line 1 - Definition: \nLine 2 - Survey Feedback\nLine 3 – Is added as long text in single line, this";
        expect(await (await activityTabPage.getAllSurveyTextOnActivityTab()).trim()).toContain(await stringText.trim());
        expect(await activityTabPage.getDWPIconClassAttribute()).toContain("d-icon-thumb_up_adapt", "DWP survey icon does not macth");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getComplexSurveyModalTitle()).toBe("Survey Information", "Modal title is not correct");
        expect(await activityTabPage.getRatingText()).toBe("Rating: 3 (out of 5)", "Rating is not correct");
        expect(await (await activityTabPage.getDWPFeedback()).trim()).toBe(await stringText.trim());
        await activityTabPage.closeSurveyInformation();

        await navigationPage.gotoCaseConsole();
        let serviceReqId1: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId1;
        let response1 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId1 = response1.displayId;
        cmplxSurveyData['SimpleSurveyShortFeedback_DRDMV-18117_2'].serviceRequestId = serviceReqId1;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyShortFeedback_DRDMV-18117_2']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId1);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 5 (out of 5)", "Rating does not match");
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain(" Short Feedback in one line ");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getRatingText()).toBe("Rating: 5 (out of 5)", "Rating is not correct");
        expect(await activityTabPage.getDWPFeedback()).toBe(" Short Feedback in one line ", "Feedback is not matching");
        await activityTabPage.closeSurveyInformation();

        await navigationPage.gotoCaseConsole();
        let serviceReqId2: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId2;
        let response2 = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId2 = response2.displayId;
        cmplxSurveyData['SimpleSurveyShortWithoutQuestions_DRDMV-18117_3'].serviceRequestId = serviceReqId2;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyShortWithoutQuestions_DRDMV-18117_3']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId2);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 2 (out of 5)", "Rating does not match");
        expect(await activityTabPage.isViewSurveyInformationLinkPresent()).toBeFalsy("Link is present");
    });

    it('[DRDMV-19366]: [Complex Survey] - Survey Details in Case having Emoji', async () => {
        await apiHelper.apiLogin("qkatawazi");
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['ComplexSurveyQuestionsAndFeedback_DRDMV-19366'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['ComplexSurveyQuestionsAndFeedback_DRDMV-19366']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
        expect(await activityTabPage.getRatingTextOnActivityTab()).toBe("Rating: 1 (out of 5)", "Rating does not match");
        expect(await (await activityTabPage.getAllSurveyTextOnActivityTab()).localeCompare("Definition: Survey Feedback\nSurvey Feedback is tool which provides an organization with a honest opinion of what")).toBeTruthy("Definition: Survey Feedback\nSurvey Feedback is tool which provides an organization with a honest opinion of what");
        await activityTabPage.openSurveyReport();
        //expect(await activityTabPage.getDWPFeedback).toBe("Definition: Survey Feedback\nSurvey Feedback is tool which provides an organization with a honest opinion of what their present or future customers think about them and helps them in taking an informed decision.\n\nRead Next\nSurvey Research\nSurvey\n\n\nSteps Involved in Survey Feedback:\n\n(a) Identifying the objective of conducting the survey.\n\n(b) Informing all the members including the team leads and other employees about the procedure for conducting the survey.\n\n(c) Starting the ground work.\n\n(d) Organizing and conducting the interviews of target groups.\n\n(e) Analyzing the data obtained and generating a report out of that.\n\n(f) Based on the report providing proper feedback.\n\n(g) Presenting the final report to the top management.\n\n(h) Devising policies so that the survey results can help to serve the given objective.\n\n\n\nBenefits:\n\nKnowing the wants and needs of the customers with respect to the products and services is the driving force for product innovation. Customer is the king in today’");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("This is an answeer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you ma see response in multiline based in display width.");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multi line comment)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("This is an answer in multi line format to check display in BWF.\n1. Very Satisfied\n2. Somewhat satisfied\n3. Neither satisfied nor dissatisfied\n4. Somewhat dissatisfied\n5. Very Satisfied");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(3)).toBe("By what time did you expect resolution for this service ? (This is Date Time type question, Please select date and time)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(3)).toBe("Fri Dec 13 2019 3:25:00 PM");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(4)).toBe("How would you rate the knowledge of our SMEs ? (This is Radio Button question, User can select only one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(4)).toBe("Extremely Well");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(5)).toBe("How would you rate quality of our service ? (This is Single Select drop down list question, user can select one option)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(5)).toBe("Very High Quality");
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(6)).toBe("Which of the following words would you use to describe our products? Select all that apply. (This is Checkbox type question, user can select multiple options)");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(6)).toBe("Exremely Reliable");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(7)).toBe("High Quality");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(8)).toBe("Good Value for Money");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(9)).toBe("Unique");
        await activityTabPage.closeSurveyInformation();
    });

    it('[DRDMV-18123]: [Complex Survey] - Survey Details Order in Case Activity', async () => {
        await apiHelper.apiLogin("qkatawazi");
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['SimpleSurveyLongFeedback_DRDMV-18117_1'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyLongFeedback_DRDMV-18117_1']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
        await activityTabPage.addActivityNote("hello");
        await activityTabPage.clickOnPostButton();
        expect(await activityTabPage.isComplexSurveyOrderIsThird()).toBeTruthy();
    });

    it('[DRDMV-18125]: [Complex Survey] - Filter survey details in Case Activity', async () => {
        await apiHelper.apiLogin("qkatawazi");
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['SimpleSurveyLongFeedback_DRDMV-18117_1'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyLongFeedback_DRDMV-18117_1']);
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
        await activityTabPage.addActivityNote("hello");
        await activityTabPage.clickOnPostButton();
        await activityTabPage.clickOnFilterButton();
        await activityTabPage.selectFilterCheckBox('Surveys');
        await activityTabPage.clickOnFilterApplyButton();
        expect(await activityTabPage.isOnlySurveyRecordFiltered()).toBeTruthy("Multiple records are present");
    });
});
