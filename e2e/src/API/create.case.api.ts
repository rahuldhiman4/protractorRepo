import { HttpClient } from "protractor-http-client"
import { ResponsePromise } from 'protractor-http-client/dist/promisewrappers';
import { browser } from 'protractor';

export interface ICase {
    id: string;
    displayId: string;
    summary: string;
}

export async function createCase(): Promise<ICase> {
    const http = new HttpClient(browser.baseUrl);
    http.failOnHttpError = true;
    const userLoginResponse: ResponsePromise = await http.post(
        "/api/rx/authentication/loginrequest",
        { "userName": "qkatawazi@petramco.com", "password": "Password_1234" },
        { "X-Requested-By": "XMLHttpRequest", "Content-Type": "application/json" }
    );
    console.log(userLoginResponse.statusCode);

    const createCaseResponse: ResponsePromise = http.post(
        "/api/com.bmc.dsm.case-lib/cases",
        { "Requester": "qtao", "Summary": "New case from Protractor" },
        { "X-Requested-By": "XMLHttpRequest", "Content-Type": "application/json" }
    );
    const location: any = await createCaseResponse.header('location');
    let caseUrlArr: string[] = JSON.stringify(location).split("/");
    let caseguid: string = caseUrlArr[caseUrlArr.length - 1].slice(0, -1);
    console.log("location ------------" + location.substr(location.indexOf('/api/')));
    
    const getCaseRecordInstance: ResponsePromise = http.get(location.substr(location.indexOf('/api/')));
//    const getCaseRecordInstance: ResponsePromise = http.get(Array.isArray(location) ? location[0] : location.substr(location.indexOf('/api/')));
//    getCaseRecordInstance.then(success => {
//        console.log(success);
//    });
//    let s = await getCaseRecordInstance.body('displayId');
    
    return getCaseRecordInstance.then(function (success) {
        let body: any = JSON.parse(success.body);
        return {
            id: body.id,
            displayId: body.displayId,
            summary: body.summary,
        };
    }, function (fail) {
        console.log("failed to get case display id");
    })
}
