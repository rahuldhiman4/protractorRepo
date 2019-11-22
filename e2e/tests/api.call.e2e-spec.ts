import { ProtractorExpectedConditions, protractor } from "protractor";
import loginApi from "../api/login.api";
import caseApi from "../api/create.case.api";

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    it('should create case', async () => {
        await loginApi.apiLogin('qtao');
        var newCase = await caseApi.createCase('qdu', "new test case");
        console.log("new case is created===", newCase.id);
        console.log("new case is created===", newCase.displayId);
    });
})

