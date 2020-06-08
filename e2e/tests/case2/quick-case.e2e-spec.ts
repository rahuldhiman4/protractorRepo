import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePo from '../../pageobject/case/create-case.po';
import { default as quickCase, default as quickCasePo } from "../../pageobject/case/quick-case.po";
import { default as viewCasePage, default as viewCasePo } from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import resources from '../../pageobject/common/resources-tab.po';
import composeMail from '../../pageobject/email/compose-mail.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import editCaseTemplate from "../../pageobject/settings/case-management/edit-casetemplate.po";
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template-cases.po';
import { default as activityPo } from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

let RecommendedKnowledgeStr = "Recommended Knowledge ";
let applyBtn = "Apply";
describe("Quick Case", () => {
    const requester = "The requester of the case";
    const contact = "Another person contacting on behalf of the requester";
    let templateName797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let templateSummary797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
    let caseTemplateId797 = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await testData797();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    //kgaikwad
    it('[DRDMV-771]: [Quick Case] Similar cases search in Resources', async () => {
        let randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData = {
            "Requester": "apavlik",
            "Summary": randomStr + "summary",
            "description": randomStr + "description"
        }
        await apiHelper.apiLogin("qkatawazi");
        await apiHelper.createCase(caseData);
        await navigationPage.gotoQuickCase();
        let categoryvalues: string[] = [caseData.Summary, caseData.description];
        for (let i = 0; i < categoryvalues.length; i++) {
            let result: boolean = undefined;
            await quickCasePo.selectRequesterName('Adam Pavlik');
            await quickCasePo.setCaseSummary(categoryvalues[i]);
            let qcSummary = await quickCasePo.isCaseSummaryPresentInRecommendedCases(categoryvalues[0]);
            qcSummary = false ? result = false : result = true;
            await expect(result).toBeTruthy(`FailureMsg: Case Summary does not match for ${categoryvalues[i]}`);
        }
    });

    async function testData797() {
        let templateData = {
            "templateName": templateName797,
            "templateSummary": templateSummary797,
            "templateStatus": 'Active',
            "company": 'Petramco'
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);
        caseTemplateId797 = newCaseTemplate.id;
    }

    //kgaikwad
    it('[DRDMV-797]: [Quick Case] Case creation with inactive template (negative)', async () => {
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName("Adam Pavlik");
        await quickCasePo.selectCaseTemplate(templateName797);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateCaseTemplateStatus(caseTemplateId797, 'Draft');
        await quickCasePo.saveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
        await apiHelper.updateCaseTemplateStatus(caseTemplateId797, 'Inactive');
        await quickCasePo.saveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
        await utilityCommon.closePopUpMessage();
    });

    it('[DRDMV-800]: [Quick Case] Case creation with requester having same name as other company users', async () => {
        let userData1 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData1",
        }
        let userData2 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData2",
        }
        let userData3 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData3",
        }
        let userData4 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData4",
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData1);
        await apiHelper.createNewUser(userData2);
        await apiHelper.createNewUser(userData3);
        await apiHelper.createNewUser(userData4);
        
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('Person1 Person1');
        await quickCase.setCaseSummary('caseSummary');
        await quickCase.createCaseButton();
        await quickCase.gotoCaseButton();
        expect(await viewCasePo.getRequesterName()).toBe('Person1 Person1');
    });

    it('[DRDMV-1205]: [Quick Case] People search', async () => {
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('Allen');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('Allbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('all');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('aallbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('Al Allbrook');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('allen.allbrook@petramco.com');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
    });

    describe('[DRDMV-794]: [Quick Case] Requester, Contact, Subject Employee people selection', async () => {
        it('Employee people selection', async () => {
            await quickCase.clickStartOverButton();
            await quickCase.selectRequesterName('allen');
            expect(await quickCase.getDrpDownValueByIndex(1)).toBe('The requester of the case');
            await quickCase.selectRequesterName('adam');
            expect(await quickCase.getDrpDownValueByIndex(2)).toBe('Related to');
            await quickCase.selectRequesterName('bpitt');
            expect(await quickCase.getDrpDownValueByIndex(3)).toBe('Related to');
            await quickCase.selectRequesterName('brain');
            expect(await quickCase.getDrpDownValueByIndex(4)).toBe('Related to');
            await quickCase.selectDrpDownValueByIndex('Target', 1);
            expect(await quickCase.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
        });
        it('[DRDMV-794]: [Quick Case] Requester, Contact, Subject Employee people selection', async () => {
            await quickCase.selectRequesterName('kye');
            expect(await quickCase.getDrpDownValueByIndex(5)).toBe('The requester of the case');
            expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Target');
            await quickCase.selectDrpDownValueByIndex('The requester of the case', 1);
            expect(await quickCase.getDrpDownValueByIndex(1)).toBe('The requester of the case');
            expect(await quickCase.getDrpDownValueByIndex(5)).toBe('Another person contacting on behalf of the requester');
            await quickCase.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
            expect(await quickCase.getDrpDownValueByIndex(5)).toBe('The requester of the case');
            expect(await quickCase.getDrpDownValueByIndex(1)).toBe('Another person contacting on behalf of the requester');
            await quickCase.setCaseSummary('address');
            await quickCase.saveCase();
            expect(await previewCasePo.isRequesterNameDisplayed('Kye Petersen')).toBeTruthy();
            expect(await previewCasePo.isContactNameDisplayed('Al Allbrook')).toBeTruthy();
            await quickCase.gotoCaseButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-1087]:[Quick Case] Case Template search via !', async () => {
        let templateData,templateData1,randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let threeCharacterString = randomStr.substr(0, 3);
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + "Petramco",
                "templateSummary": randomStr + "Petramco",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Draft",
                "company": "Petramco",
            }
            templateData1 = {
                "templateName": randomStr + "Psilon",
                "templateSummary": randomStr + "Psilon",
                "templateStatus": "Active",
                "company": 'Psilon'
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createCaseTemplate(templateData1);
        });
        it('Checking change case template button for In Progress', async () => {
            //Draft Template Search 
            await navigationPage.gotoQuickCase();
            await quickCase.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(templateData.templateName)).toBeFalsy("Draft Template is founded");;
            //Active Template Verification
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(templateData.templateName);
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await navigationPage.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(templateData.templateName);
            await quickCase.setCaseSummary(templateData.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-1087]:[Quick Case] Case Template search via !', async () => {
            //Different Company Search
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(templateData1.templateName)).toBeFalsy("Template is same as employee comapny");
            //3 Character Search Template Verification
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(threeCharacterString)).toBeTruthy("Template is not founded");
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-786]:[Quick Case] Case creation with all case statuses in template', async () => {
        let templateData1,templateData2,templateData3,templateData4,randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData1 = {
                "templateName": randomStr + "Petramco1",
                "templateSummary": randomStr + "Petramco1",
                "templateStatus": "Active",
                "company": "Petramco",
                "caseStatus": "New",
                "businessUnit": "HR Support",
                "supportGroup": "Workforce Administration",
            }
            templateData2 = {
                "templateName": randomStr + "Petramco2",
                "templateSummary": randomStr + "Petramco2",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "caseStatus": "Assigned",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            templateData3 = {
                "templateName": randomStr + "Petramco3",
                "templateSummary": randomStr + "Petramco3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "caseStatus": "InProgress",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            templateData4 = {
                "templateName": randomStr + "Petramco4",
                "templateSummary": randomStr + "Petramco4",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Active",
                "company": "Petramco",
                "caseStatus": "Resolved",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData1);
            await apiHelper.createCaseTemplate(templateData2);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateData3);
            await apiHelper.createCaseTemplate(templateData4);
        });
        it('Creating the case with diffrent statuses', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(templateData1.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(templateData2.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');
        });
        it('[DRDMV-786]:[Quick Case] Case creation with all case statuses in template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(templateData4.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(templateData3.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-795]: [Quick Case] Case template search in Resources', async () => {
        let CaseTemplateDataInDraftStatus,randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');       
        beforeAll(async () => {
            CaseTemplateDataInDraftStatus = {
                "templateName": randomStr + 'templateDraft',
                "templateSummary":  randomStr + 'SummaryDraft',
                "caseStatus": "InProgress",
                "templateStatus": "Draft",
                "description": randomStr + 'Description',
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            let CaseTemplateDataWithDifferentOrganization = {
                "templateName": `${randomStr}` + 'WithOtherOrg',
                "templateSummary": `${randomStr}`,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(CaseTemplateDataInDraftStatus);
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(CaseTemplateDataWithDifferentOrganization);
        });
        it('Case template search in Resources', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            expect(await quickCase.selectCaseTemplate(CaseTemplateDataInDraftStatus.templateName)).toBeFalsy("Draft case template present");
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            expect(await quickCase.selectCaseTemplate(`${randomStr}` + 'WithOtherOrg')).toBeFalsy('Different organization case template present');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(CaseTemplateDataInDraftStatus.templateName);
            await editCaseTemplate.clickOnEditCaseTemplateMetadata();
            await editCaseTemplate.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplate.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-795]: [Quick Case] Case template search in Resources', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            expect(await quickCase.selectCaseTemplate(`${randomStr}` + 'WithOtherOrg')).toBeFalsy('Different organization case template present');
            await navigationPage.gotoQuickCase();
            await quickCase.clickStartOverButton();
            await quickCase.selectRequesterName('adam');
            expect(await quickCase.selectCaseTemplate(CaseTemplateDataInDraftStatus.templateName)).toBeTruthy("template not present1");
            await quickCase.setCaseSummary(CaseTemplateDataInDraftStatus.templateSummary);
            expect(await resources.getAdvancedSearchResultForParticularSection(CaseTemplateDataInDraftStatus.templateName)).toEqual(CaseTemplateDataInDraftStatus.templateName);
            await quickCase.setCaseSummary(CaseTemplateDataInDraftStatus.description);
            expect(await resources.getAdvancedSearchResultForParticularSection(CaseTemplateDataInDraftStatus.templateName)).toEqual(CaseTemplateDataInDraftStatus.templateName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //apdeshmu 
    describe('[DRDMV-767]:[Quick Case] Case creation with template (end-to-end)', async () => {
        let CaseTemplateData,randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let tasktemplateData = {
                "templateName": randomStr + "767Petramco",
                "templateSummary": randomStr + "767Petramco",
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            CaseTemplateData = {
                "templateName": randomStr + "767Petramco",
                "templateSummary": randomStr + "767Petramco",
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "Fritz",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "ownerBU": "Facilities Support",
                "ownerGroup": "Facilities",
                "supportCompany": "Petramco",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "priority": "Low",
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": randomStr + "767Petramco",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            }
            let assignmentData =
            {
                "assignmentMappingName": "DRDMV-767" + randomStr,
                "company": "Petramco",
                "supportCompany": "Petramco",
                "supportGroup": "Employee Relations",
                "assignee": "qliu",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "priority": "Low",
            }
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": randomStr + "767Petramco",
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Applications",
                "categoryTier2": "Help Desk",
                "categoryTier3": "Incident",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            await apiHelper.apiLogin('fritz');
            let automationTaskTemplate = await apiHelper.createAutomatedTaskTemplate(tasktemplateData);
            let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automationTaskTemplate.displayId);
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.createCase(caseData);
            await apiHelper.createKnowledgeArticle(articleData1);
        });
        it('Case creation with template', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(CaseTemplateData.templateName);
            await quickCasePo.selectRequesterName("fritz");
            await quickCase.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
            await quickCasePo.selectRequesterName("chetan");
            await quickCase.setCaseSummary(CaseTemplateData.templateName);
            await utilCommon.waitUntilSpinnerToHide();
            await quickCase.pinRecommendedCases(1);
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(CaseTemplateData.templateName);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await quickCase.pinRecommendedKnowledgeArticles(1);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-767]:[Quick Case] Case creation with template (end-to-end)', async () => {
            expect(await viewCasePage.getCaseSummary()).toBe(CaseTemplateData.templateName, "Template is not Found");
            expect(await viewCasePage.getCategoryTier1Value()).toBe('Purchasing Card', "Category is not displaying");
            expect(await viewCasePage.getCategoryTier2Value()).toBe('Policies', "Category is not displaying");
            expect(await viewCasePage.getCategoryTier3Value()).toBe('Card Issuance', "Category is not displaying");
            expect(await viewCasePage.getCaseStatusValue()).toBe('In Progress', "Status is not displaying");
            expect(await viewCasePage.getAssignedGroupText()).toBe('Facilities');
            expect(await viewCasePage.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePage.getCaseTemplateText()).toBe(CaseTemplateData.templateName);
            expect(await activityPo.isTextPresentInActivityLog("created the case")).toBeTruthy("Text is not present in activiy tab1");
            expect(await activityPo.isTextPresentInActivityLog("created the case")).toBeTruthy("Text is not present in activiy tab1");
            await utilityCommon.scrollUpOrDownTillElement(viewCasePage.selectors.addedTaskFromCaseTemplate);
            expect(await viewCasePage.isCoreTaskPresent(CaseTemplateData.templateName)).toBeTruthy("Task Is not added from Case Template");
            await viewCasePage.clickOnTab('Resources');
            await resources.clickOnAdvancedSearchOptions(CaseTemplateData.templateName);
            await resources.enterAdvancedSearchText(CaseTemplateData.templateName);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await resources.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resources.getAdvancedSearchResultForParticularSection(CaseTemplateData.templateName)).toEqual(CaseTemplateData.templateName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    describe('[DRDMV-624]:  Advanced Search UI verification on the Quick Case view', async () => {
        let articleData,randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let currentDate = new Date();
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let dateFormateValue: string = months[currentDate.getMonth()];
        let dateFormateNew: string = dateFormateValue.substring(0, 3);
        let dateFormate = dateFormateNew + " " + currentDate.getDate() + ", " + currentDate.getFullYear();
        beforeAll(async () => {
            articleData = {
                "knowledgeSet": "HR",
                "title": 'knowledge3542' + randomStr,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Workforce Administration",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "United States Support",
                "assigneeSupportGroup": "US Support 1",
                "assignee": "kayo"
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
            await apiHelper.createKnowledgeArticle(articleData);
        });
        it('Advanced Search UI verification on the Quick Case view', async () => {
            await navigationPage.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.setCaseSummary(articleData.title);
            await utilCommon.waitUntilSpinnerToHide();
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            expect(await quickCasePo.isFilterAvailable('ArticleStatus')).toBeTruthy();
            expect(await quickCasePo.isFilterAvailable('Knowledge Set')).toBeTruthy();
            expect(await quickCasePo.isFilterAvailable('Site')).toBeTruthy();
            expect(await quickCasePo.isFilterAvailable('Region')).toBeTruthy();
            expect(await quickCasePo.isFilterAvailable('Operational Category Tier 1')).toBeTruthy();
        });
        it('[DRDMV-624]: Advanced Search UI verification on the Quick Case view', async () => {
            let statusFieldValues: string[] = ["Select None", "Closed", "Retired", "Canceled", "In Progress", "Draft", "SME Review", "Published", "Publish Approval", "Retire Approval", "Request Cancelation"];
            expect(await resources.isAdvancedSearchFilterOptionDropDownValueDisplayed(statusFieldValues, 0)).toBeTruthy();
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            await resources.selectAdvancedSearchFilterOption('ArticleStatus', 'In Progress');
            await resources.selectAdvancedSearchFilterOption('Knowledge Set', 'HR');
            await resources.selectAdvancedSearchFilterOption('Operational Category Tier 1', 'Workforce Administration');
            await resources.selectAdvancedSearchFilterOption('Region', 'Australia');
            await resources.selectAdvancedSearchFilterOption('Site', 'Canberra');
            await resources.clickOnAdvancedSearchFiltersButton('Apply');
            expect(await quickCasePo.getKnowledgeArticleID()).toContain('KA-', 'KA ID not correct');
            expect(await quickCasePo.getKnowledgeArticleInfo()).toContain(articleData.title, 'title not correct');
            expect(await quickCasePo.getKnowledgeArticleInfo()).toContain('Fritz Schulz', 'Author not correct');
            expect(await quickCasePo.getKnowledgeArticleInfo()).toContain('In Progress', 'status not correct');
            expect(await quickCasePo.getKnowledgeArticleInfo()).toContain(dateFormate, 'KA ID not correct');
            await quickCasePo.clickArrowFirstRecommendedKnowledge();
            expect(await previewKnowledgePo.getKnowledgeArticleTitle()).toContain(articleData.title);
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy('viewArticle link Not peresent');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Status not displaying');
            await previewKnowledgePo.clickOnBackButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ptidke
    describe('[DRDMV-773]: [Quick Case] Case template selection via !', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseTemplateName = randomStr + 'templateActive';
        let casTemplateSummary = randomStr + 'SummaryActive';
        let caseTemplatePsilon = randomStr + 'PsilonTemplate';
        let casTemplateSummaryPsilon = randomStr + 'PsilonSummary';
        let caseTemplateDraft = randomStr + 'templateDraft';
        let casTemplateSummaryDraft = randomStr + 'SummaryDraft';
        beforeAll(async () => {
            let templateData = {
                "templateName": `${caseTemplateName}`,
                "templateSummary": `${casTemplateSummary}`,
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateData);
            let templateDataDraft = {
                "templateName": `${caseTemplateDraft}`,
                "templateSummary": `${casTemplateSummaryDraft}`,
                "templateStatus": "Draft",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateDataDraft);
            let templateDataPsilon = {
                "templateName": caseTemplatePsilon,
                "templateSummary": casTemplateSummaryPsilon,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(templateDataPsilon);
        });
        it('Case template selection via !', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            expect(await quickCase.selectCaseTemplate(caseTemplateName)).toBeTruthy('template is present1');
            await quickCase.selectRequesterName('adam');
            await quickCase.selectRoleValue('Related to');
            expect(await quickCase.selectCaseTemplate(caseTemplateDraft)).toBeFalsy('template is present2');
            await quickCase.selectRequesterName('fritz');
            expect(await quickCase.selectCaseTemplate(caseTemplatePsilon)).toBeFalsy('template is present3');
        });
        it('[DRDMV-773]: [Quick Case] Case template selection via !', async () => {
            await quickCase.clickStartOverButton();
            await quickCase.selectRequesterName('fritz');
            await quickCase.selectCaseTemplate(caseTemplateName);
            await quickCase.createCaseButton();
            await quickCase.gotoCaseButton();
            expect(await viewCasePo.getCaseTemplateText()).toBe(caseTemplateName);
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-796]: [Quick Case] Resources preview', async () => {
        let CaseTemplateData,randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            let userData1 = {
                "firstName": "Person1",
                "lastName": "Person1",
                "userId": "userData1",
            }
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createNewUser(userData1);
            let manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            CaseTemplateData = {
                "templateName": randomStr + 'Template',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
            }
            let caseData =
            {
                "Requester": "qtao",
                "Summary": randomStr + 'Template',
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            }
            let articleData = {
                "knowledgeSet": "HR",
                "title": randomStr + 'Template',
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            await apiHelper.apiLogin('qkatawazi');
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            let newCaseTemplate = await apiHelper.createCaseTemplate(CaseTemplateData);
            await apiHelper.createCase(caseData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
        });
        it('Creating case with template/Knowledge selection', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.selectRequesterName('adam');
            await quickCase.selectCaseTemplate(CaseTemplateData.templateName);
            await quickCase.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getCaseSummary()).toBe(CaseTemplateData.templateSummary);
            expect(await previewCaseTemplateCasesPo.getCaseStatus()).toBe("In Progress");
            expect(await previewCaseTemplateCasesPo.getCaseCompanyValue()).toBe("Petramco");
            expect(await previewCaseTemplateCasesPo.getCaseTemplateName()).toBe(CaseTemplateData.templateName);
            expect(await previewCaseTemplateCasesPo.getCasePriority()).toBe("Low");
            await previewCaseTemplateCasesPo.clickOnBackButton();
            await resources.clickOnAdvancedSearchOptions(RecommendedKnowledgeStr);
            await resources.enterAdvancedSearchText(CaseTemplateData.templateName);
            await resources.clickOnAdvancedSearchSettingsIconToOpen();
            await resources.clickOnAdvancedSearchFiltersButton(applyBtn);
            await quickCase.clickArrowFirstRecommendedKnowledge();
        });
        it('[DRDMV-796]: [Quick Case] Resources preview', async () => {
            expect(await previewKnowledgePo.isViewArticleLInkDisplay()).toBeTruthy('View article link not present');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Knowledge status not present');
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            await previewKnowledgePo.clickOnBackButton();
            await quickCase.createCaseButton();
            expect(await previewCasePo.isRequesterNameDisplayed('Adam Pavlik')).toBeTruthy();
            expect(await previewCasePo.isCaseSummaryDisplayed(CaseTemplateData.templateSummary)).toBeTruthy();
            expect(await previewCasePo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy();
            expect(await previewCasePo.isRequesterEmailIdDisplayed('apavlik@petramco.com')).toBeTruthy();
            expect(await previewCasePo.isDescriptionDisplayed('Adam Pavlik ' + `${CaseTemplateData.templateName}`)).toBeTruthy();
            await previewCasePo.clickGoToCaseButton();
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ptidke 
    describe('[DRDMV-741]: [Quick Case] UI validation including Source field in Quick Case', async () => {
        let activeSourceUI, inActiveSource741, sourceDeprecated741, activeSourceNotUI;
        beforeAll(async () => {
            let menuItemDataFile = require('../../data/ui/ticketing/menuItem.ui.json');
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            activeSourceUI = await menuItemDataFile['sourceMenuItem'].menuItemName + randomStr;
            menuItemDataFile['sourceMenuItem'].menuItemName = activeSourceUI;
            await apiHelper.apiLogin('qkatawazi');
            //active yes on UI
            await apiHelper.createNewMenuItem(menuItemDataFile['sourceMenuItem']);
            inActiveSource741 = await menuItemDataFile['sourceInActive'].menuItemName + randomStr;
            menuItemDataFile['sourceInActive'].menuItemName = inActiveSource741;
            //Inactive 
            await apiHelper.createNewMenuItem(menuItemDataFile['sourceInActive']);
            sourceDeprecated741 = await menuItemDataFile['sourceDeprecated'].menuItemName + randomStr;
            menuItemDataFile['sourceDeprecated'].menuItemName = sourceDeprecated741;
            //deprecated
            await apiHelper.createNewMenuItem(menuItemDataFile['sourceDeprecated']);
            activeSourceNotUI = await menuItemDataFile['sourceActiveNotOnUI'].menuItemName + randomStr;
            menuItemDataFile['sourceActiveNotOnUI'].menuItemName = activeSourceNotUI;
            //Not on UI
            await apiHelper.createNewMenuItem(menuItemDataFile['sourceActiveNotOnUI']);
        });
        it('Creating the case with source values', async () => {
            await navigationPage.gotoQuickCase();
            await quickCase.clickStartOverButton();
            expect(await quickCase.getDescriptionDetails()).toContain("Begin by entering person's name, email, login ID or employee ID after the @ symbol. Then enter a description of the case.");
            expect(await quickCase.getResourcesText()).toContain('Quick Case finds resources for you while you take notes');
            expect(await quickCase.getSelectedSourceValue()).toContain('Agent');
            await quickCase.selectRequesterName('fritz');
            await quickCase.setCaseSummary('new case creation');
            await quickCase.selectSourceValue(activeSourceUI);
            await quickCase.createCaseButton();
            await quickCase.gotoCaseButton();
            expect(await viewCasePo.getSourceValue()).toContain(activeSourceUI);
        });
        it('[DRDMV-741]: [Quick Case] UI validation including Source field in Quick Case', async () => {
            await navigationPage.gotoQuickCase();
            expect(await quickCase.isValuePresentInSourceDropDown(sourceDeprecated741)).toBeFalsy(sourceDeprecated741 + 'is present');
            expect(await quickCase.isValuePresentInSourceDropDown(inActiveSource741)).toBeFalsy(inActiveSource741 + 'is present');
            expect(await quickCase.isValuePresentInSourceDropDown(activeSourceNotUI)).toBeFalsy(activeSourceNotUI + 'is present');
        });
        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    it('[DRDMV-8387]: UI validation Email Option via Quick case', async () => {
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        await quickCase.setCaseSummary('new case');
        await quickCase.createCaseButton();
        await utilityCommon.closePopUpMessage();
        await quickCase.gotoCaseButton();
        let quickCaseId: string = await viewCasePo.getCaseID();
        await viewCasePo.clickOnEmailLink();
        expect(await composeMail.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
        expect(await composeMail.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
        expect(await composeMail.isSubjectPresent()).toBeTruthy('Subject title missing');
        expect(await composeMail.getSubject()).toBe(quickCaseId + ":");
        expect(await composeMail.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
        expect(await composeMail.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
        expect(await composeMail.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
        expect(await composeMail.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        expect(await composeMail.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        await composeMail.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });

    // tgarud 
    it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let unPublishedKA_Name = randomStr + ' UnPublished KA'
        let publishedKA_Name = randomStr + ' Published KA'
        let articleData = {
            "knowledgeSet": "HR",
            "title": "KnowledgeArticle",
            "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
            "keyword": "ArticleKeyword",
            "articleDesc": "ArticleDescription",
            "categoryTier1": "Applications",
            "categoryTier2": "Help Desk",
            "categoryTier3": "Incident",
            "region": "Australia",
            "site": "Canberra",
            "assignedCompany": "Petramco",
            "assigneeBusinessUnit": "United Kingdom Support",
            "assigneeSupportGroup": "GB Support 1",
            "assignee": "KMills"
        };
        await apiHelper.apiLogin('kmills');
        // Draft article
        articleData.title = unPublishedKA_Name;
        let unPublishedKA = await apiHelper.createKnowledgeArticle(articleData);
        expect(await apiHelper.updateKnowledgeArticleStatus(unPublishedKA.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
        // Published article
        articleData.title = publishedKA_Name;
        articleData.keyword = `${randomStr}_keyword`;
        articleData.articleDesc = `${randomStr}_description`;
        let publishedKA = await apiHelper.createKnowledgeArticle(articleData);
        let publishKA_GUID = publishedKA.id;
        expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "Draft")).toBeTruthy("Article with Draft status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "SMEReview", "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "PublishApproval")).toBeTruthy("Article with Published status not updated.");
        await browser.sleep(5000); // hardwait to get KA indexed
        // search draft article, should not find
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(unPublishedKA_Name);
        expect(await resources.isRecommendedKnowledgePresent(unPublishedKA_Name)).toBeFalsy(`${unPublishedKA_Name} Draft KA not disaplyed in Recommended Knowledge`);
        // search published article by name, should find
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(publishedKA_Name);
        expect(await resources.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} Published KA not disaplyed in Recommended Knowledge`);
        // search published article by keyword, should find.. this is failing keyword based search not working 
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(articleData.keyword);
        expect(await resources.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} Keyword search Published KA not disaplyed in Recommended Knowledge`);
        // search published article by description, should find
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(articleData.articleDesc);
        expect(await resources.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} Description search Published KA not disaplyed in Recommended Knowledge`);
        // Change KA status to closed so that can be used in last step
        expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "RetireApproval")).toBeTruthy("Article with Closed status not updated.");
        expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "Closed")).toBeTruthy("Article with Closed status not updated.");
        await browser.sleep(3000); // hardwait to reflect KA status as closed
        // search In Progress article, should not find
        expect(await apiHelper.updateKnowledgeArticleStatus(unPublishedKA.id, "In Progres")).toBeTruthy("Article with Draft status not updated.");
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(unPublishedKA_Name);
        expect(await resources.isRecommendedKnowledgePresent(unPublishedKA_Name)).toBeFalsy(`${unPublishedKA_Name} In Progress KA not disaplyed in Recommended Knowledge`);
        // search Canceled article, should not find
        expect(await apiHelper.updateKnowledgeArticleStatus(unPublishedKA.id, "Canceled")).toBeTruthy("Article with Canceled status not updated.");
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(unPublishedKA_Name);
        expect(await resources.isRecommendedKnowledgePresent(unPublishedKA_Name)).toBeFalsy(`${unPublishedKA_Name} Canceled KA not disaplyed in Recommended Knowledge`);
        // search Closed article, should not find
        await quickCase.clickStartOverButton();
        await quickCase.selectRequesterName('fritz');
        await quickCase.setCaseSummary(publishedKA_Name);
        expect(await resources.isRecommendedKnowledgePresent(publishedKA_Name)).toBeFalsy(`${publishedKA_Name} Closed KA disaplyed in Recommended Knowledge`);
    });

    //radhiman
    it('[DRDMV-18972]: Populating fields in Quick Case if only Required parameter is specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18972';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=PET00000104&desc=&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester1);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=61288992922&desc=&contact=');
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy();
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy;
    });

    //radhiman
    it('[DRDMV-18973]: Populating fields in Quick Case when all parameters are specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18973';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=PET00000104');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser@petramco.com');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=14085719604');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser');
        await browser.sleep(1000);
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
    });

    //radhiman
    it('[DRDMV-18980]: Populating fields in Quick Case with Required and one optional parameter', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18980';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=Change my Last Name&contact');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=&contact=14085719604');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy();
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qdu&desc=Change my Last Name&contact=');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester2);
        expect(await quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });

    //radhiman
    it('[DRDMV-18977]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=Change my Last Name&contact=PET000000000484');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=Change my Last Name&contact=');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=&contact=PET000000000484');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=&contact=');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case serch box is not empty');
    });

    //radhiman
    it('[DRDMV-18983]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18983';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=Test1&desc=Change my Last Name&contact=qliu');
        expect(await quickCase.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        expect(await quickCase.isCreateButtonDisabled()).toBeTruthy();
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=Change my Last Name&contact=test1');
        expect(await quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });
})
