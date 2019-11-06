import { HttpClient } from "protractor-http-client"
import { ResponsePromise, JsonPromise } from 'protractor-http-client/dist/promisewrappers';
import { browser } from 'protractor';

export async function createCaseTemplate(templateName:string): Promise<void> {
    const http = new HttpClient(browser.baseUrl);
    var templateData = require('./case.template.json');
    templateData.fieldInstances[8].value = templateName;
    templateData.fieldInstances[1000001437].value = templateName;
    http.failOnHttpError = true;
    const userLoginResponse: ResponsePromise = await http.post(
        "/api/rx/authentication/loginrequest",
        { "userName": "qkatawazi@petramco.com", "password": "Password_1234" },
        { "X-Requested-By": "XMLHttpRequest", "Content-Type": "application/json" }
    );
    console.log(`API Login status: ${userLoginResponse.statusCode}`);

    const createCaseTemplateResponse: ResponsePromise = http.post(
        "/api/rx/application/record/recordinstance",
        templateData,
        { "X-Requested-By": "XMLHttpRequest", "Content-Type": "application/json" }
    );
    console.log(`Case template create status: ${createCaseTemplateResponse.statusCode}`);
}
