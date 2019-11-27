import { ProtractorExpectedConditions, protractor } from "protractor";
import loginApi from "../api/login.api";
import caseApi from "../api/create.case.api";
import createRecordInstance from "../api/recordinstance.api";
import apiUtil from "../utils/api/api.common";

describe('Login and create case from API', () => {
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    xit('should create case', async () => {
        await loginApi.apiLogin('qtao');
        var newCase = await caseApi.createCase('qdu', "new test case");
        console.log("new case is created===", newCase.id);
        console.log("new case is created===", newCase.displayId);
    });

    xit('should create case template', async () => {
        await loginApi.apiLogin('qkatawazi');
        var newCaseTemplate = await createRecordInstance.createCaseTemplateWithRequiredFields("My New CaseTemplate9", 'draft');
        console.log("draft case Template is created===", newCaseTemplate.id);
        console.log("draft case Template is created===", newCaseTemplate.displayId);
        var newCaseTemplate = await createRecordInstance.createCaseTemplateWithRequiredFields("My New CaseTemplate10", 'active');
        console.log("active case Template is created===", newCaseTemplate.id);
        console.log("active case Template is created===", newCaseTemplate.displayId);
    });

    xit('should create new user', async () => {
        await loginApi.apiLogin('tadmin');
        var newUser = await createRecordInstance.createNewUser("myname","newlogin");
    });

    xit('get guid', async () => {
        await loginApi.apiLogin('tadmin');
        var petramcoGuid = await apiUtil.getOrganizationGuid("Petramco");
        console.log("Guid found::", petramcoGuid);
    });

    xit('associate entities', async () => {
        await loginApi.apiLogin('tadmin');
        var psilonGuid = await apiUtil.getOrganizationGuid("Psilon");
        var userGuid = await apiUtil.getPersonGuid("newlogin");
        console.log(userGuid, "::Guid found::", psilonGuid);
        await apiUtil.associateFoundationElements("Agent Supports Primary Organization", userGuid, psilonGuid);
    });

    it('create user with psilon and petramco access', async () => {
        await loginApi.apiLogin('tadmin');
        var newUserGuid = await createRecordInstance.createNewUser("DualCompany","dualLogin");
        var petramcoGuid = await apiUtil.getOrganizationGuid("Petramco");
        await apiUtil.associateFoundationElements("Agent Supports Primary Organization", newUserGuid, petramcoGuid);
        var psilonGuid = await apiUtil.getOrganizationGuid("Psilon");
        await apiUtil.associateFoundationElements("Agent Supports Primary Organization", newUserGuid, psilonGuid);
    });
})
