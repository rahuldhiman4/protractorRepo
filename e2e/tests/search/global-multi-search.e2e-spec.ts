import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import searchPo from '../../pageobject/search/global-search.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import personProfilePo from '../../pageobject/common/person-profile.po';

export interface IIDs {
    id: string;
    displayId: string;
}
describe('Multi Search Validation', () => {
    let caseModule = "Case";
    let taskModule = "Task";
    let KAModule = "Knowledge Article";
    let caseTemplateModule = "Case Templates";
    let taskTemplateModule = "Task Templates";
    let documentModule = "Documents";
    let peopleModule = "People";
    let updatedDate;

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('elizabeth');
        // Create Date
        let year: string;
        let month: string;
        let date: string;


        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        year = new Number(numYear).toString();

        let numMonth: number = objDate.getUTCMonth() + 1;
        let monthArr: string[] = ["Null", "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "August", "September", "October", "November", "December"];
        month = monthArr[numMonth];

        let numDate: number = objDate.getUTCDate();
        let date1 = new Number(numDate);
        date = date1.toString();

        updatedDate = month + " " + date + ", " + year;
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function createCase(caseSummary: string, caseDescription?: string): Promise<IIDs> {
        let caseData = {
            "Requester": "qkatawazi",
            "Summary": "caseSummary",
            "Description": "",
            "Assigned Company": "Petramco",
            "Business Unit": "Canada Support",
            "Support Group": "CA Support 1",
            "Assignee": "qdu"
        }

        caseData.Summary = caseSummary;
        caseData.Description = caseDescription;
        let getcaseId = await apiHelper.createCase(caseData);
        return {
            id: getcaseId.id,
            displayId: getcaseId.displayId
        };
    }

    async function createTask(taskName: string, caseIdTask: string, description?: string): Promise<string> {
        let taskData = {
            "taskName": "taskName",
            "description": "taskdescription",
            "company": "Petramco",
            "businessUnit": "Latin America Support",
            "supportGroup": "LA Support 2",
            "assignee": "qcolumbcille",
        }
        taskData.taskName = taskName;
        taskData.description = description;
        let getTaskId = await apiHelper.createAdhocTask(caseIdTask, taskData);
        return getTaskId.displayId;
    }

    async function createKnowledgeArticleWithPublish(knowledgeTitle: string, keyword?: string): Promise<string> {
        let articleData = {
            "knowledgeSet": "HR",
            "title": "KATitle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "assignedCompany": "Petramco",
            "keyword": "",
            "assigneeBusinessUnit": "Canada Support",
            "assigneeSupportGroup": "CA Support 1",
            "assignee": "qdu"
        }

        articleData.title = knowledgeTitle;
        if (keyword) {
            articleData.keyword = keyword;
        }
        let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'Draft')).toBeTruthy('FailureMsg Status Not Set');
        expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleData.id, 'PublishApproval', 'qdu', 'CA Support 1', 'Petramco')).toBeTruthy('FailureMsg Status Not Set');
        return knowledgeArticleData.displayId;
    }

    async function createCaseTemplate(templateName: string, templateSummary: string, templateStatus: string, company: string, description?: string): Promise<string> {
        let caseTemplateDisplayId
        let caseTemplateData = {
            "templateName": "caseTemplateName",
            "templateSummary": "caseTemplateSummary",
            "categoryTier1": 'Applications',
            "categoryTier2": 'Social',
            "categoryTier3": 'Chatter',
            "casePriority": "Low",
            "templateStatus": "",
            "company": "",
            "description": "",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 1",
            "assignee": "qdu",
            "ownerBU": "United States Support",
            "ownerGroup": "US Support 1"
        }

        if (description) {
            caseTemplateData.description = description;
        }
        caseTemplateData.templateName = templateName;
        caseTemplateData.templateSummary = templateSummary;
        caseTemplateData.templateStatus = templateStatus;
        caseTemplateData.company = company;
        let caseTemplateResponse = await apiHelper.createCaseTemplate(caseTemplateData);
        return caseTemplateDisplayId = caseTemplateResponse.displayId;

    }

    async function createTaskTemplate(templateName: string, templateStatus: string, taskCompany: string, description?: string): Promise<string> {
        let taskDetails;
        let taskDisplayId;
        let manualTaskTemplateData = {
            "templateName": "manualTemplateName",
            "templateSummary": "TemplateSummary",
            "templateStatus": "",
            "taskCompany": "",
            "description": "",
            "businessUnit": "Canada Support",
            "supportGroup": "CA Support 1",
            "assignee": "qdu",
            "ownerCompany": "Petramco",
            "ownerBusinessUnit": "United States Support",
            "ownerGroup": "US Support 3"
        }

        if (description) {
            manualTaskTemplateData.description = description;
        }
        manualTaskTemplateData.templateName = templateName;
        manualTaskTemplateData.templateStatus = templateStatus;
        manualTaskTemplateData.taskCompany = taskCompany;
        taskDetails = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
        return taskDisplayId = taskDetails.displayId;
    }

    async function createPublishDocumentLibrary(docLibTitle: string, attachment: string, keywordTag?: string): Promise<string> {
        let publishDocData = {
            docLibTitle: docLibTitle,
            company: 'Petramco',
            businessUnit: 'Canada Support',
            ownerGroup: 'CA Support 1',
            keywordTag: ""
        }

        if (keywordTag) {
            publishDocData.keywordTag = keywordTag;
        }
        let docLib = await apiHelper.createDocumentLibrary(publishDocData, attachment);
        await apiHelper.publishDocumentLibrary(docLib);
        return docLib.displayId;

    }

    async function createNewUser(firstName: string, lastName: string, loginId: string, emailId: string, company?: string): Promise<void> {
        var caseAgentuserData = {
            "firstName": firstName,
            "lastName": lastName,
            "userId": loginId,
            "emailId": emailId,
            "userPermission": "AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA;AGGADG1AAO0VGAP8SXEGP7VU2U4ZS8",
        }
        if (company) {
            await apiHelper.createNewUser(caseAgentuserData);
            await apiHelper.associatePersonToCompany(caseAgentuserData.userId, company);
        } else {
            await apiHelper.createNewUser(caseAgentuserData, 'Inactive');
        }
    }
  
    //kgaikwad
    describe('[DRDMV-16124]: Global search with only People Category', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let firstName = 'firstNameDRDMV16124' + randomStr;
        let lastName = 'lastNameDRDMV16124' + randomStr;
        let loginId = 'loginIdDRDMV16124' + randomStr;
        let emailId = `emailIdDRDMV16124${randomStr}@petramco.com`;
        let dummyText = 'DummayDRDMV16123' + randomStr;
        let inactiveFirstName = 'inactiveFirstNameDRDMV16124' + randomStr;
        let inactiveLastName = 'inactiveLastNameDRDMV16124' + randomStr;
        let nonMatchingFirstName = 'nonMatchingFirstNameDRDMV16124' + randomStr;
        let nonMatchingLastName = 'nonMatchingLastNameDRDMV16124' + randomStr;
        let nonAccessFirstName = 'nonAccessFirstNameDRDMV16124' + randomStr;
        let nonAccessLastName = 'nonAccessLastNameDRDMV16124' + randomStr;
        let company = "Petramco";

        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            // Create Person
            for (let a = 1; a < 6; a++) {
                await createNewUser(firstName, lastName, loginId + a, emailId, company);
            }

            // Create Person With Inactive Status
            await createNewUser(inactiveFirstName, inactiveLastName, loginId + 11, emailId);

            // Non maching Document 
            await createNewUser(nonMatchingFirstName, nonMatchingLastName, loginId + 12, emailId, company);

            // Non access Document
            await createNewUser(nonAccessFirstName, nonAccessLastName, loginId + 13, emailId, company);
        });

        it('[DRDMV-16124]: Verify First Name', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue('People');
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, peopleModule, 1)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(emailId, peopleModule, 1)).toBeTruthy(`${emailId} emailId is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 2)).toBeTruthy(`FailureMsg5: ${firstName} ${lastName} 2 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 3)).toBeTruthy(`FailureMsg6: ${firstName} ${lastName} 3 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 4)).toBeTruthy(`FailureMsg7: ${firstName} ${lastName} 4 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 5)).toBeTruthy(`FailureMsg8: ${firstName} ${lastName} 5 Person Name is missing`);
        });

        it('[DRDMV-16124]: Verify FirstName LastName', async () => {
            await searchPo.searchRecord(lastName);
            expect(await searchPo.isModuleTitleDisplayed(lastName, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: Person module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(updatedDate, peopleModule, 1)).toBeTruthy(`${updatedDate} updatedDate is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(emailId, peopleModule, 1)).toBeTruthy(`${emailId} emailId is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 2)).toBeTruthy(`FailureMsg5: ${firstName} ${lastName} 2 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 3)).toBeTruthy(`FailureMsg6: ${firstName} ${lastName} 3 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 4)).toBeTruthy(`FailureMsg7: ${firstName} ${lastName} 4 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 5)).toBeTruthy(`FailureMsg8: ${firstName} ${lastName} 5 Person Name is missing`);

            await searchPo.clickOnLeftPannelRecord(`${firstName} ${lastName}`, peopleModule);
        });

        it('[DRDMV-16124]: Verify People Preview Fields', async () => {
            expect(await personProfilePo.isFieldLabelDisplayed('Employee')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Job Title')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Corporate ID')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Type')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Login ID')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Functional Roles')).toBeTruthy('FailureMsg22: field label displayed');
            expect(await personProfilePo.isFieldLabelDisplayed('Site')).toBeTruthy('FailureMsg22: field label displayed');

            expect(await personProfilePo.getPersonName()).toBe(`${firstName} ${lastName}`, 'FailureMsg22: first Name is missing');
            expect(await personProfilePo.getCompany()).toBe(company, 'FailureMsg22: company name is missing');
            expect(await personProfilePo.getLoginID()).toContain(loginId, 'FailureMsg22: Login id is missing');
            expect(await personProfilePo.getEmail()).toBe(emailId, 'FailureMsg22: emailId is missing');
            await personProfilePo.clickOnTab('Related Persons');
            await personProfilePo.clickOnTab('Requested Cases');
            await personProfilePo.clickOnTab('Assigned Cases');
            await personProfilePo.clickOnTab('Support Groups');
            await personProfilePo.clickOnTab('Related Cases');
        });

        it('[DRDMV-16124]: Verify People with non matching Name', async () => {
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${nonMatchingFirstName} ${nonMatchingLastName}`, peopleModule)).toBeFalsy(`FailureMsg9: ${nonMatchingFirstName} ${nonMatchingLastName} 6 person is displayed`);
        });

        it('[DRDMV-16124]: Verify Person With FirstName & LastName At a Same Time ', async () => {
            await searchPo.searchRecord(`${firstName} ${lastName}`);
            expect(await searchPo.isModuleTitleDisplayed(`${firstName} ${lastName}`, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 2)).toBeTruthy(`FailureMsg5: ${firstName} ${lastName} 2 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 3)).toBeTruthy(`FailureMsg6: ${firstName} ${lastName} 3 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 4)).toBeTruthy(`FailureMsg7: ${firstName} ${lastName} 4 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 5)).toBeTruthy(`FailureMsg8: ${firstName} ${lastName} 5 Person Name is missing`);
        });

        it('[DRDMV-16124]: Clear search and verify record displayed on left pannel ', async () => {
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 People is missing`);
            await searchPo.clickClearSearchButton();
            expect(await searchPo.isClearSearchButtonDisplayed()).toBeFalsy('FailureMsg60: Search box is cleared and cross button gets hide');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 People is missing`);
        });

        it('[DRDMV-16124]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyText);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyText, peopleModule)).toBeFalsy(`FailureMsg62: ${dummyText} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyText, 'People (0)', peopleModule)).toBeTruthy('FailureMsg63: People module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(peopleModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule)).toBeFalsy(`FailureMsg4: ${firstName} ${lastName} 1 People is missing`);
        });

        it('[DRDMV-16124]: Verify search functionality with Inactive Person ', async () => {
            await searchPo.searchRecord(inactiveFirstName);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(inactiveFirstName, peopleModule)).toBeFalsy(`FailureMsg62: ${inactiveFirstName} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(inactiveFirstName, 'People (0)', peopleModule)).toBeTruthy('FailureMsg63: People module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(peopleModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${inactiveFirstName} ${nonMatchingLastName}`, peopleModule)).toBeFalsy(`FailureMsg4: ${firstName} ${lastName} 1 People is Displayed`);
        });

        it('[DRDMV-16124]: Verify saerch people with other company user', async () => {
            await navigationPage.signOut();
            await loginPage.login('werusha')
            await navigationPage.gotoSearch();
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (0)', peopleModule)).toBeTruthy('FailureMsg63: people module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(peopleModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.searchRecord(lastName);
            expect(await searchPo.isModuleTitleDisplayed(lastName, 'People (0)', peopleModule)).toBeTruthy('FailureMsg65: people module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(peopleModule)).toBeTruthy(`FailureMsg66: No result found validation is missing`);

            await searchPo.searchRecord(nonAccessFirstName);
            expect(await searchPo.isModuleTitleDisplayed(nonAccessFirstName, 'People (0)', peopleModule)).toBeTruthy('FailureMsg67: people module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(peopleModule)).toBeTruthy(`FailureMsg68: No result found validation is missing`);

            await searchPo.searchRecord(nonAccessLastName);
            expect(await searchPo.isModuleTitleDisplayed(nonAccessLastName, 'People (0)', peopleModule)).toBeTruthy('FailureMsg69: people module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(peopleModule)).toBeTruthy(`FailureMsg70: No result found validation is missing`);
        });
        
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('elizabeth');
        });
    });

    //kgaikwad
    describe('[DRDMV-16133]: Global search based on change in category by keeping the same search pattern', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/search/globalsearch1.pdf';
        let caseSummary = '1caseSummaryDRDMV16133' + randomStr;
        let taskSummary = '1taskSummaryDRDMV16133' + randomStr;
        let commonSearchAll = 'commonSearchDRDMV16133' + randomStr;
        let caseTemplateName = 'caseTemplateDRDMV16133' + randomStr;
        let taskTemplateName = 'taskTemplateDRDMV16133' + randomStr;
        let lastName = 'lastNameDRDMV16133' + randomStr;
        let loginId = 'loginIdDRDMV16133' + randomStr;

        let caseDisplayId = [];
        let taskDisplayId = [];
        let kaDisplayId = [];
        let caseDetails;
        let caseTemplateDisplayId = [];
        let taskTemplateDisplayId = [];

        beforeAll(async () => {
            await apiHelper.apiLogin('elizabeth');
        });

        it('[DRDMV-16133]: Create Case With API', async () => {
            for (let a = 1; a <= 5; a++) {
                caseDetails = await createCase(caseSummary, commonSearchAll);
                caseDisplayId[a] = caseDetails.displayId;
            }
        });

        it('[DRDMV-16133]: Create Task With API', async () => {
            for (let b = 1; b <= 5; b++) {
                taskDisplayId[b] = await createTask(taskSummary, caseDetails.id, commonSearchAll);
            }
        });

        it('[DRDMV-16133]: Create Knowledge Article With API', async () => {
            for (let e = 1; e <= 5; e++) {
                await browser.sleep(1000); //Need this sleep create record with correct count and avoid skip the record from loop
                kaDisplayId[e] = await createKnowledgeArticleWithPublish(commonSearchAll);
            }
        });

        it('[DRDMV-16133]: Create Case Template With API', async () => {
            for (let c = 1; c <= 5; c++) {
                caseTemplateDisplayId[c] = await createCaseTemplate(caseTemplateName + c, commonSearchAll, 'Active', 'Petramco');
            }
        });

        it('[DRDMV-16133]: Create Task Template With API', async () => {
            for (let d = 1; d <= 5; d++) {
                taskTemplateDisplayId[d] = await createTaskTemplate(taskTemplateName + d, 'Active', 'Petramco', commonSearchAll);
            }
        });

        it('[DRDMV-16133]: Create Document Library With API', async () => {
            for (let f = 1; f <= 5; f++) {
                await createPublishDocumentLibrary(commonSearchAll, attachmentFilePath);
            }
        });

        it('[DRDMV-16133]: Create Document Library With API', async () => {
            await apiHelper.apiLogin('tadmin');
            for (let g = 1; g <= 5; g++) {
                await createNewUser(commonSearchAll, lastName, loginId + g, 'DRDMV16133@petramco.com', 'Petramco');
            }
        });

        it('[DRDMV-16133]: Verify Case Displayed On Left Pannel', async () => {
            await navigationPage.gotoSearch();
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.searchRecord(commonSearchAll);

            // Verify Case With Left Pannel
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[1], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[2], caseModule)).toBeTruthy(`FailureMsg5: ${caseDisplayId[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[3], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[4], caseModule)).toBeTruthy(`FailureMsg7: ${caseDisplayId[4]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[5], caseModule)).toBeTruthy(`FailureMsg8: ${caseDisplayId[5]} case id  is missing`);
        });

        it('[DRDMV-16133]: Verify Task Displayed On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[5], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId[5]} task id  is missing`);
        });

        it('[DRDMV-16133]: Verify Knowledge Article Displayed On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[1], KAModule)).toBeTruthy(`FailureMsg11: ${kaDisplayId[1]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[2], KAModule)).toBeTruthy(`FailureMsg12: ${kaDisplayId[2]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[3], KAModule)).toBeTruthy(`FailureMsg13: ${kaDisplayId[3]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[4], KAModule)).toBeTruthy(`FailureMsg14: ${kaDisplayId[4]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[5], KAModule)).toBeTruthy(`FailureMsg15: ${kaDisplayId[5]} Knowledge Article id  is missing`);
        });

        it('[DRDMV-16133]: Verify Case Template Displayed On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case Template module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[4], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId[4]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[5], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId[5]} case id  is missing`);
        });

        it('[DRDMV-16133]: Verify Task Templates Displayed On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task Template module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[1], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[1]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[2], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[2]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[3], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[3]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[4]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[5], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[5]} task template id  is missing`);
        });

        it('[DRDMV-16133]: Verify Documents Displayed On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 1)).toBeTruthy(`FailureMsg4: ${commonSearchAll} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 2)).toBeTruthy(`FailureMsg4: ${commonSearchAll} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 3)).toBeTruthy(`FailureMsg5: ${commonSearchAll} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 4)).toBeTruthy(`FailureMsg6: ${commonSearchAll} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 5)).toBeTruthy(`FailureMsg7: ${commonSearchAll} 5 Document is missing`);
        });

        it('[DRDMV-16133]: Verify People Displayed On Left Pannel', async () => {
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${commonSearchAll} ${lastName} 1 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 2)).toBeTruthy(`FailureMsg5: ${commonSearchAll} ${lastName} 2 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 3)).toBeTruthy(`FailureMsg6: ${commonSearchAll} ${lastName} 3 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 4)).toBeTruthy(`FailureMsg7: ${commonSearchAll} ${lastName} 4 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 5)).toBeTruthy(`FailureMsg8: ${commonSearchAll} ${lastName} 5 Person Name is missing`);
        });

        it('[DRDMV-16133]: Change Category To Case and verify records are still displayed', async () => {
            await searchPo.selectCategoryDropDownValue(caseModule);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[1], caseModule)).toBeTruthy(`FailureMsg4: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[2], caseModule)).toBeTruthy(`FailureMsg5: ${caseDisplayId[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[3], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[4], caseModule)).toBeTruthy(`FailureMsg7: ${caseDisplayId[4]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[5], caseModule)).toBeTruthy(`FailureMsg8: ${caseDisplayId[5]} case id  is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeFalsy('FailureMsg2: KA module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeFalsy('FailureMsg2: Document module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeFalsy('FailureMsg2: People module title is displayed');
        });

        it('[DRDMV-16133]: Change Category To Task and verify records are still displayed', async () => {
            // Verify Task After Change Category To Task Category
            await searchPo.selectCategoryDropDownValue(taskModule);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[1], taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[2], taskModule)).toBeTruthy(`FailureMsg7: ${taskDisplayId[2]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[3], taskModule)).toBeTruthy(`FailureMsg8: ${taskDisplayId[3]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[4], taskModule)).toBeTruthy(`FailureMsg9: ${taskDisplayId[4]} task id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId[5], taskModule)).toBeTruthy(`FailureMsg10: ${taskDisplayId[5]} task id  is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeFalsy('FailureMsg2: KA module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeFalsy('FailureMsg2: Document module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeFalsy('FailureMsg2: People module title is displayed');
        });

        it('[DRDMV-16133]: Change Category To Knowledge Article and verify records are still displayed', async () => {
            await searchPo.selectCategoryDropDownValue('Knowledge');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[1], KAModule)).toBeTruthy(`FailureMsg11: ${kaDisplayId[1]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[2], KAModule)).toBeTruthy(`FailureMsg12: ${kaDisplayId[2]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[3], KAModule)).toBeTruthy(`FailureMsg13: ${kaDisplayId[3]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[4], KAModule)).toBeTruthy(`FailureMsg14: ${kaDisplayId[4]} Knowledge Article id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId[5], KAModule)).toBeTruthy(`FailureMsg15: ${kaDisplayId[5]} Knowledge Article id  is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeFalsy('FailureMsg2: Document module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeFalsy('FailureMsg2: People module title is displayed');
        });

        it('[DRDMV-16133]: Change Category To Case Template and verify records are still displayed', async () => {
            await searchPo.selectCategoryDropDownValue('Case Template');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[1], caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[2], caseTemplateModule)).toBeTruthy(`FailureMsg6: ${caseTemplateDisplayId[2]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[3], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId[3]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[4], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId[4]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId[5], caseTemplateModule)).toBeTruthy(`FailureMsg7: ${caseTemplateDisplayId[5]} case id  is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeFalsy('FailureMsg2: KA module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeFalsy('FailureMsg2: Document module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeFalsy('FailureMsg2: People module title is displayed');
        });

        it('[DRDMV-16133]: Change Category to Task Template and verify records are still displayed', async () => {
            await searchPo.selectCategoryDropDownValue('Task Template');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[1], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[1]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[2], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[2]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[3], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[3]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[4], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[4]} task template id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId[5], taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId[5]} task template id  is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeFalsy('FailureMsg2: KA module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeFalsy('FailureMsg2: Document module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeFalsy('FailureMsg2: People module title is displayed');
        });

        it('[DRDMV-16133]: Change Category to Documents and verify records are still displayed', async () => {
            await searchPo.selectCategoryDropDownValue('Document');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 1)).toBeTruthy(`FailureMsg4: ${commonSearchAll} 1 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 2)).toBeTruthy(`FailureMsg4: ${commonSearchAll} 2 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 3)).toBeTruthy(`FailureMsg5: ${commonSearchAll} 3 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 4)).toBeTruthy(`FailureMsg6: ${commonSearchAll} 4 Document is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(commonSearchAll, documentModule, 5)).toBeTruthy(`FailureMsg7: ${commonSearchAll} 5 Document is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeFalsy('FailureMsg2: KA module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeFalsy('FailureMsg2: People module title is displayed');
        });

        it('[DRDMV-16133]: Change Category to People and verify records are still displayed', async () => {
            await searchPo.selectCategoryDropDownValue(peopleModule);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'People (5)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 1)).toBeTruthy(`FailureMsg4: ${commonSearchAll} ${lastName} 1 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 2)).toBeTruthy(`FailureMsg5: ${commonSearchAll} ${lastName} 2 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 3)).toBeTruthy(`FailureMsg6: ${commonSearchAll} ${lastName} 3 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 4)).toBeTruthy(`FailureMsg7: ${commonSearchAll} ${lastName} 4 Person Name is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${commonSearchAll} ${lastName}`, peopleModule, 5)).toBeTruthy(`FailureMsg8: ${commonSearchAll} ${lastName} 5 Person Name is missing`);
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Cases (5)', caseModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Tasks (5)', taskModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Knowledge Articles (5)', KAModule)).toBeFalsy('FailureMsg2: KA module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Case Templates (5)', caseTemplateModule)).toBeFalsy('FailureMsg2: Case module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Task Templates (5)', taskTemplateModule)).toBeFalsy('FailureMsg2: Task module title is displayed');
            expect(await searchPo.isModuleTitleDisplayed(commonSearchAll, 'Documents (5)', documentModule)).toBeFalsy('FailureMsg2: Document module title is displayed');
        });
    });

    //kgaikwad
    describe('[DRDMV-16825]: Recent searches stored on Global search', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let attachmentFilePath = 'e2e/data/ui/search/globalsearch1.pdf';
        let caseSummary = '1caseSummaryDRDMV16825' + randomStr;
        let inSensitiveCaseSummary = '1CaSeSumMaryDRDMV16825' + randomStr;
        let nonAccessCaseSummary = '2caseSummaryDRDMV16825' + randomStr;
        let caseDescription = 'caseDescriptionDRDMV16825' + randomStr;
        let taskSummary = '1taskSummaryDRDMV16825' + randomStr;
        let taskDescription = 'taskDescriptionDRDMV16825' + randomStr;
        let caseTemplateName = 'caseTemplateDRDMV16825' + randomStr;
        let caseTemplateSummary = 'caseTemplateSummaryDRDMV16825' + randomStr;
        let taskTemplateName = 'taskTemplateDRDMV16825' + randomStr;
        let knowledgeTitle = 'knowledgeTitleDRDMV16825' + randomStr;
        let documentName = 'documentNameDRDMV16825' + randomStr;
        let firstName = 'firstNameDRDMV16825' + randomStr;
        let lastName = 'lastNameDRDMV16825' + randomStr;
        let dummyText = 'dummyTextDRDMV16825' + randomStr;
        let loginId = 'loginIdDRDMV16825' + randomStr;
        let caseDisplayId = [];
        let taskDisplayId;
        let caseTemplateDisplayId;
        let taskTemplateDisplayId;
        let kaDisplayId;
        let caseDetails;
        beforeAll(async () => {

            await apiHelper.apiLogin('fritz');
            await createCase(nonAccessCaseSummary);

            await apiHelper.apiLogin('elizabeth');
            // Create Case
            for (let a = 1; a <= 5; a++) {
                caseDetails = await createCase(caseSummary, caseDescription);
                caseDisplayId[a] = caseDetails.displayId;
            }

            // Create Task
            taskDisplayId = await createTask(taskSummary, caseDetails.id, taskDescription);
            
            // Create Case Template
            caseTemplateDisplayId = await createCaseTemplate(caseTemplateName , caseTemplateSummary, 'Active', 'Petramco');
            
            // Create Task Template
            taskTemplateDisplayId = await createTaskTemplate(taskTemplateName , 'Active', 'Petramco');

            // Create Knowledge Article
            kaDisplayId = await createKnowledgeArticleWithPublish(knowledgeTitle);

            // Create Document Library
            await createPublishDocumentLibrary(documentName, attachmentFilePath);

            // Create New User
            await apiHelper.apiLogin('tadmin');
            await createNewUser(firstName, lastName, loginId, 'DRDMV16825@petramco.com', 'Petramco');
        });

        it('[DRDMV-16825]: Verify Recent With Case Summary', async () => {
            await navigationPage.gotoSearch();
            await searchPo.selectCategoryDropDownValue('All');
            expect(await searchPo.isCategoryDropDownSelectedValueDisplayed('All')).toBeTruthy('FailureMsg1: Default value from catergory drop down is missing');
            await searchPo.selectCategoryDropDownValue(caseModule);

            await searchPo.searchRecord(caseSummary);
            expect(await searchPo.isModuleTitleDisplayed(caseSummary, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Cases module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[2], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[3], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[4], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[5], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(caseSummary)).toBeTruthy('case summary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(caseSummary)).toBe(1, 'Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Recent With Case Descripiton', async () => {
            await searchPo.searchRecord(caseDescription);
            expect(await searchPo.isModuleTitleDisplayed(caseDescription, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg2: Cases module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[2], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[3], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[4], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[5], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(caseDescription)).toBeTruthy('FailureMsg6: case description is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(caseDescription)).toBe(1, 'FailureMsg6: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]:  Check Duplicates Case Summary Are Displayed Only 1 Times', async () => {
            await searchPo.searchRecord(caseDescription);
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(caseDescription)).toBeTruthy('FailureMsg6: case description is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(caseDescription)).toBe(1, 'FailureMsg6: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Task Summary Stored In Recent Search', async () => {
            await searchPo.selectCategoryDropDownValue('All');
            await searchPo.searchRecord(taskSummary);
            expect(await searchPo.isModuleTitleDisplayed(taskSummary, 'Tasks (1)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskSummary, taskModule)).toBeTruthy(`FailureMsg5: ${taskSummary} Task summary is missing`);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId, taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId[1]} task id  is missing`);
        
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(taskSummary)).toBeTruthy('FailureMsg3: task summary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(taskSummary)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Task Description Stored In Recent Search', async () => {
            await searchPo.searchRecord(taskDescription);
            expect(await searchPo.isModuleTitleDisplayed(taskDescription, 'Tasks (1)', taskModule)).toBeTruthy('FailureMsg2: Task module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskDisplayId, taskModule)).toBeTruthy(`FailureMsg6: ${taskDisplayId} task id  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(taskDescription)).toBeTruthy('FailureMsg3: taskDescription is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(taskDescription)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Case Template Name Stored In Recent Search', async () => {
            await searchPo.searchRecord(caseTemplateName);
            expect(await searchPo.isModuleTitleDisplayed(caseTemplateName, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId} caseTemplateDisplayId  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(caseTemplateName)).toBeTruthy('FailureMsg3: caseTemplateName is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(caseTemplateName)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Case Template Summary Stored In Recent Search', async () => {
            await searchPo.searchRecord(caseTemplateSummary);
            expect(await searchPo.isModuleTitleDisplayed(caseTemplateSummary, 'Case Templates (1)', caseTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseTemplateDisplayId, caseTemplateModule)).toBeTruthy(`FailureMsg4: ${caseTemplateDisplayId} caseTemplateDisplayId  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(caseTemplateSummary)).toBeTruthy('FailureMsg3: caseTemplateSummary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(caseTemplateSummary)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Task Template Name Stored In Recent Search', async () => {
            await searchPo.searchRecord(taskTemplateName);
            expect(await searchPo.isModuleTitleDisplayed(taskTemplateName, 'Task Templates (1)', taskTemplateModule)).toBeTruthy('FailureMsg2: Case module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(taskTemplateDisplayId, taskTemplateModule)).toBeTruthy(`FailureMsg4: ${taskTemplateDisplayId} taskTemplateDisplayId  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(taskTemplateName)).toBeTruthy('FailureMsg3: taskTemplateName is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(taskTemplateName)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Knowledge Title Stored In Recent Search', async () => {
            await searchPo.searchRecord(knowledgeTitle);
            expect(await searchPo.isModuleTitleDisplayed(knowledgeTitle, 'Knowledge Articles (1)', KAModule)).toBeTruthy('FailureMsg2: KA module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(kaDisplayId, KAModule)).toBeTruthy(`FailureMsg4: ${kaDisplayId} Knowledge Article id  is missing`);
        
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(knowledgeTitle)).toBeTruthy('FailureMsg3: knowledgeTitle is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(knowledgeTitle)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Document Name Stored In Recent Search', async () => {
            await searchPo.searchRecord(documentName);
            expect(await searchPo.isModuleTitleDisplayed(documentName, 'Documents (1)', documentModule)).toBeTruthy('FailureMsg2: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(documentName, documentModule, 1)).toBeTruthy(`FailureMsg4: ${documentName} 1 Document is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(documentName)).toBeTruthy('FailureMsg3: documentName is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(documentName)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');

        it('[DRDMV-16825]: Verify First Name Stored In Recent Search', async () => {
            await searchPo.searchRecord(firstName);
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (1)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
        
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(firstName)).toBeTruthy('FailureMsg3: documentName is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(firstName)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Last Name Stored In Recent Search', async () => {
            await searchPo.searchRecord(lastName);
            expect(await searchPo.isModuleTitleDisplayed(lastName, 'People (1)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
        
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(lastName)).toBeTruthy('FailureMsg3: documentName is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(lastName)).toBe(1, 'FailureMsg4: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify After aad 11th Record First Record Gets Hide Automatically', async () => {
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(caseSummary)).toBeFalsy('case summary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(caseSummary)).toBe(0, 'Count of recent search is incorrect');

        });
     
        it('[DRDMV-16825]: Verify Record Non Access Record But Still It Stoed In Recent Search', async () => {
            await searchPo.searchRecord(nonAccessCaseSummary);
            expect(await searchPo.isModuleTitleDisplayed(nonAccessCaseSummary, 'Cases (0)', caseModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(documentModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(nonAccessCaseSummary)).toBeTruthy('FailureMsg64: nonAccessCaseSummary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(nonAccessCaseSummary)).toBe(1, 'FailureMsg64: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Record with Insensitive Record & Duplicate record', async () => {
            await searchPo.searchRecord(inSensitiveCaseSummary);
            expect(await searchPo.isModuleTitleDisplayed(inSensitiveCaseSummary, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(inSensitiveCaseSummary)).toBeTruthy('FailureMsg64: nonAccessCaseSummary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(inSensitiveCaseSummary)).toBe(1, 'FailureMsg64: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify Insensitive Duplicate record', async () => {
            await searchPo.searchRecord(inSensitiveCaseSummary);
            expect(await searchPo.isModuleTitleDisplayed(inSensitiveCaseSummary, 'Cases (5)', caseModule)).toBeTruthy('FailureMsg63: Document module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(caseDisplayId[1], caseModule)).toBeTruthy(`FailureMsg6: ${caseDisplayId[1]} case id  is missing`);

            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.isRecentSearchesDropDownValueDisplayed(inSensitiveCaseSummary)).toBeTruthy('FailureMsg64: nonAccessCaseSummary is missing from recent search')
            expect (await searchPo.getCountOfRecentDropDownValue(inSensitiveCaseSummary)).toBe(1, 'FailureMsg64: Count of recent search is incorrect');
        });

        it('[DRDMV-16825]: Verify search functionality with dummy text ', async () => {
            await searchPo.searchRecord(dummyText);
            expect(await searchPo.isRecordDisplayedOnLeftPannel(dummyText, KAModule)).toBeFalsy(`FailureMsg62: ${dummyText} dummyText  is displayed`);
            expect(await searchPo.isModuleTitleDisplayed(dummyText, 'Knowledge Articles (0)', KAModule)).toBeTruthy('FailureMsg63: KA module title is missing');
            expect(await searchPo.isBlankRecordValidationDisplayedOnLeftPanel(KAModule)).toBeTruthy(`FailureMsg64: No result found validation is missing`);
        });

        it('[DRDMV-16825]: Select Record From Recent Search  ', async () => {
            await searchPo.selectRecentSearchDropDownValue(firstName)
            expect(await searchPo.isModuleTitleDisplayed(firstName, 'People (1)', peopleModule)).toBeTruthy('FailureMsg2: People module title is missing');
            expect(await searchPo.isRecordDisplayedOnLeftPannel(`${firstName} ${lastName}`, peopleModule)).toBeTruthy(`FailureMsg4: ${firstName} ${lastName} 1 Person Name is missing`);
        });

        it('[DRDMV-16825]: Verify Recent Search Is Displayed On Top  ', async () => {
            await navigationPage.gotoSearch();
            await searchPo.searchRecord('Record1');
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.getRecentSerachDropDownValue(1)).toBe('Record1','FailureMsg64: Record1 is displayed on top');

            await searchPo.searchRecord('Record2');
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.getRecentSerachDropDownValue(1)).toBe('Record2','FailureMsg65: Record1 is displayed on top');
            expect(await searchPo.getRecentSerachDropDownValue(2)).toBe('Record1','FailureMsg64: Record1 is displayed on 2 no');

            await searchPo.searchRecord('Record3');
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.getRecentSerachDropDownValue(1)).toBe('Record3','FailureMsg66: Record1 is displayed on top');
            expect(await searchPo.getRecentSerachDropDownValue(2)).toBe('Record2','FailureMsg65: Record1 is displayed on 2 no');
            expect(await searchPo.getRecentSerachDropDownValue(3)).toBe('Record1','FailureMsg64: Record1 is displayed on 3 no');
            
            await searchPo.searchRecord('Record1');
            await searchPo.clickOnRecentSearchDropDownButton();
            expect(await searchPo.getRecentSerachDropDownValue(1)).toBe('Record1','FailureMsg64: Record1 is displayed on top');
            expect(await searchPo.getRecentSerachDropDownValue(2)).toBe('Record3','FailureMsg66: Record1 is displayed on 2 no');
            expect(await searchPo.getRecentSerachDropDownValue(3)).toBe('Record2','FailureMsg65: Record1 is displayed on 3 no');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        });
    });
});
});

