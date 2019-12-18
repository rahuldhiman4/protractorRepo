import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import utilGrid from "../../utils/util.grid";
import activityTabPage from '../../pageobject/social/activity-tab.po';

describe('Complex Surveys', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qtao');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    beforeEach(async () => {
        await navigationPage.gotoCaseConsole();
        await utilGrid.clearFilter();
    });


    fit('DRDMV-18118: [Complex Survey] - Survey Details in Case having Stars', async () => {
        await apiHelper.apiLogin("qkatawazi");
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey1']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey1']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['ComplexSurveyWithAllDataType'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['ComplexSurveyWithAllDataType']);
        await utilGrid.searchAndOpenHyperlink(caseDisplayId);
        expect(await activityTabPage.getAllSurveyTextOnActivityTab()).toContain("Rating: 4 (out of 5)", "Rating is not matching");
        await activityTabPage.openSurveyReport();
        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(1)).toBe("How likely is it that you would recommend this Service to a friend or colleague? (This is Text Field type question, please describe in single line comment)", "Question 1 does not match");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(1)).toBe("This is an answeer to check text field type question in DWP Survey. Response in this field is received in single line without any line break but in display you ma see response in multiline based in display width.", "Answer 1 does not match");

        expect(await activityTabPage.getSurveyQuestionTextOnSurveyInfo(2)).toBe("Overall, how satisfied or dissatisfied are you with our company? (This is Text Area type question, please describe in multi line comment)", "Question 2 does not match");
        expect(await activityTabPage.getSurveyAnswerTextOnSurveyInfo(2)).toBe("This is an answer in multi line format to check display in BWF. 1. Very Satisfied 2. Somewhat satisfied 3. Neither satisfied nor dissatisfied 4. Somewhat dissatisfied 5. Very Satisfied", "Answer 2 does not match");

        expect(await activityTabPage.getComplexSurveyModalTitle()).toBe("Survey Information", "Modal title is not correct");
        expect(await activityTabPage.getRatingText()).toBe("Rating: 4 (out of 5)", "Rating is not correct");
        await activityTabPage.closeSurveyInformation();
        
    })

    it('DRDMV-18117: [Simple Survey] - Survey Details in Case which is submitted from DWP with different options', async () => {
        await apiHelper.apiLogin("qkatawazi");

        //Create and check the Simple Survey with Long feedback
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey1']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey1']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['SimpleSurveyLongFeedback'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyLongFeedback']);
        await utilGrid.searchAndOpenHyperlink(caseDisplayId);

        await navigationPage.gotoCaseConsole();

        //Create and check the Simple survey with short feedback
        let serviceReqId1: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey1']['Service Request ID'] = serviceReqId1;
        let response1 = await apiHelper.createCase(caseData['complexSurvey1']);
        let caseDisplayId1 = response1.displayId;
        cmplxSurveyData['SimpleSurveyShortFeedback'].serviceRequestId = serviceReqId1;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyShortFeedback']);
        await navigationPage.gotoCaseConsole();
        await utilGrid.searchAndOpenHyperlink(caseDisplayId1);

        await navigationPage.gotoCaseConsole();

        //Create and check Simple survey without question & answers and feedback
        let serviceReqId2: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        caseData['complexSurvey1']['Service Request ID'] = serviceReqId2;
        let response2 = await apiHelper.createCase(caseData['complexSurvey1']);
        let caseDisplayId2 = response2.displayId;
        cmplxSurveyData['SimpleSurveyNoQAAndNoFeedback'].serviceRequestId = serviceReqId2;
        await apiHelper.createComplexSurvey(cmplxSurveyData['SimpleSurveyNoQAAndNoFeedback']);
        await navigationPage.gotoCaseConsole();
        await utilGrid.searchAndOpenHyperlink(caseDisplayId2);

    })

    it('DRDMV-19366: [Complex Survey] - Survey Details in Case having Emoji', async () => {
        await apiHelper.apiLogin("qkatawazi");
        let serviceReqId: string = "sid" + [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = require('../../data/ui/case/case.ui.json');
        caseData['complexSurvey1']['Service Request ID'] = serviceReqId;
        let response = await apiHelper.createCase(caseData['complexSurvey1']);
        let caseDisplayId = response.displayId;
        let cmplxSurveyData = require("../../data/api/case/complexSurvey.api.json");
        cmplxSurveyData['ComplexSurveyWithQAAndFeedback'].serviceRequestId = serviceReqId;
        await apiHelper.createComplexSurvey(cmplxSurveyData['ComplexSurveyWithQAAndFeedback']);
        await utilGrid.searchAndOpenHyperlink(caseDisplayId);      
    })

})