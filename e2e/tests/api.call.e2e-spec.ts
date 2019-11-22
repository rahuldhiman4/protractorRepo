import { ProtractorExpectedConditions, protractor } from "protractor";
import loginApi from "../api/login.api";
import caseApi from "../api/create.case.api";
import caseTemplateApi from "../api/create.casetemplate.api";

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    it('should create case', async () => {
        await loginApi.apiLogin('qtao');
        var newCase = await caseApi.createCase('qdu', "new test case");
        console.log("new case is created===", newCase.id);
        console.log("new case is created===", newCase.displayId);
    });

    it('should create case template', async () => {
        await loginApi.apiLogin('qkatawazi');
        var newCaseTemplate = await caseTemplateApi.createCaseTemplate("My New CaseTemplate9", 'draft');
        console.log("draft case Template is created===", newCaseTemplate.id);
        console.log("draft case Template is created===", newCaseTemplate.displayId);
        var newCaseTemplate = await caseTemplateApi.createCaseTemplate("My New CaseTemplate10", 'active');
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
    });
})

