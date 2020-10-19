import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import previewCasePo from '../../pageobject/case/case-preview.po';
import quickCasePo from "../../pageobject/case/quick-case.po";
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPo from "../../pageobject/common/login.po";
import navigationPo from "../../pageobject/common/navigation.po";
import resourcesPo from '../../pageobject/common/resources-tab.po';
import composeMailPo from '../../pageobject/email/compose-mail.po';
import previewKnowledgePo from '../../pageobject/knowledge/preview-knowledge.po';
import consoleCasetemplatePo from '../../pageobject/settings/case-management/console-casetemplate.po';
import editCaseTemplatePo from "../../pageobject/settings/case-management/edit-casetemplate.po";
import previewCaseTemplateCasesPo from '../../pageobject/settings/case-management/preview-case-template.po';
import activityPo from '../../pageobject/social/activity-tab.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';
import viewCasetemplatePo from '../../pageobject/settings/case-management/view-casetemplate.po';
import createCasePo from '../../pageobject/case/create-case.po';
import selectCasetemplateBladePo from '../../pageobject/case/select-casetemplate-blade.po';
import casePreviewPo from '../../pageobject/case/case-preview.po';
import templateAccessTabPo from '../../pageobject/settings/case-management/template-access-tab.po';
import { SOURCE_MENU_ITEM, SOURCE_INACTIVE, SOURCE_DEPRECATED, SOURCE_ACTIVE_NOT_ON_UI } from '../../data/ui/ticketing/menu.item.ui';
import { cloneDeep } from 'lodash';

describe("Quick Case", () => {
    const requester = "The requester of the case";
    const contact = "Another person contacting on behalf of the requester";

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPo.login("qkatawazi");

        //Creating new users
        let userData1 = undefined, userData2 = undefined, userData3 = undefined, userData4 = undefined;
        userData1 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData1",
            "company": "Petramco"
        }
        userData2 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData2",
            "company": "Petramco"
        }
        userData3 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData3",
            "company": "Petramco"
        }
        userData4 = {
            "firstName": "Person1",
            "lastName": "Person1",
            "userId": "userData4",
            "company": "Petramco"
        }
        await apiHelper.apiLogin('tadmin');
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        await apiHelper.createNewUser(userData3);
        await apiHelper.associatePersonToCompany(userData3.userId, "Petramco");
        await apiHelper.createNewUser(userData4);
        await apiHelper.associatePersonToCompany(userData4.userId, "Petramco");
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPo.signOut();
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
        await navigationPo.gotoQuickCase();
        let categoryvalues: string[] = [caseData.Summary, caseData.description];
        for (let i = 0; i < categoryvalues.length; i++) {
            let result: boolean = undefined;
            await quickCasePo.selectRequesterName('Adam Pavlik');
            await quickCasePo.setCaseSummary(categoryvalues[i]);
            let qcSummary = await quickCasePo.isCaseSummaryPresentInRecommendedCases(categoryvalues[0]);
            qcSummary = false ? result = false : result = true;
            await expect(result).toBeTruthy(`FailureMsg: Case Summary does not match for ${categoryvalues[i]}`);
            await quickCasePo.clickStartOverButton();
        }
    });

    //kgaikwad
    it('[DRDMV-797]: [Quick Case] Case creation with inactive template (negative)', async () => {
        let randomStr = [...Array(15)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData = {
            "templateName": randomStr + "CaseTemplate DRDMV797",
            "templateSummary": randomStr + "Summary DRDMV797",
            "templateStatus": 'Active',
            "company": 'Petramco'
        }
        await apiHelper.apiLogin('qkatawazi');
        let newCaseTemplate = await apiHelper.createCaseTemplate(templateData);

        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName("Adam Pavlik");
        await quickCasePo.selectCaseTemplate(templateData.templateName);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Draft');
        await quickCasePo.saveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
        await apiHelper.updateCaseTemplateStatus(newCaseTemplate.id, 'Inactive');
        await quickCasePo.saveCase();
        expect(await utilityCommon.getAllPopupMsg()).toContain('Template is Inactive. Cannot create case.', 'FailureMsg: Pop up Msg is missing for inactive template');
        await utilityCommon.closePopUpMessage();
    });

    it('[DRDMV-1205]: [Quick Case] People search', async () => {
        await navigationPo.gotoQuickCase();
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName('Allen');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName('Allbrook');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName('all');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName('aallbrook');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName('Al Allbrook');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
        await quickCasePo.clickStartOverButton();
        await quickCasePo.selectRequesterName('allen.allbrook@petramco.com');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe('Al Allbrook');
    });

    describe('[DRDMV-794]: [Quick Case] Requester, Contact, Subject Employee people selection', async () => {
        it('[DRDMV-794]: Employee people selection', async () => {
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('allen');
            expect(await quickCasePo.getDrpDownValueByIndex(1)).toBe('The requester of the case');
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.getDrpDownValueByIndex(2)).toBe('Related to');
            await quickCasePo.selectRequesterName('bpitt');
            expect(await quickCasePo.getDrpDownValueByIndex(3)).toBe('Related to');
            await quickCasePo.selectRequesterName('brain');
            expect(await quickCasePo.getDrpDownValueByIndex(4)).toBe('Related to');
            await quickCasePo.selectDrpDownValueByIndex('Target', 1);
            expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy('Save button Enabled');
        });
        it('[DRDMV-794]: [Quick Case] Requester, Contact, Subject Employee people selection', async () => {
            await quickCasePo.selectRequesterName('kye');
            expect(await quickCasePo.getDrpDownValueByIndex(5)).toBe('The requester of the case');
            expect(await quickCasePo.getDrpDownValueByIndex(1)).toBe('Target');
            await quickCasePo.selectDrpDownValueByIndex('The requester of the case', 1);
            expect(await quickCasePo.getDrpDownValueByIndex(1)).toBe('The requester of the case');
            expect(await quickCasePo.getDrpDownValueByIndex(5)).toBe('Another person contacting on behalf of the requester');
            await quickCasePo.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
            expect(await quickCasePo.getDrpDownValueByIndex(5)).toBe('The requester of the case');
            expect(await quickCasePo.getDrpDownValueByIndex(1)).toBe('Another person contacting on behalf of the requester');
            await quickCasePo.setCaseSummary('address');
            await quickCasePo.saveCase();
            expect(await previewCasePo.isRequesterNameDisplayed('Kye Petersen')).toBeTruthy();
            expect(await previewCasePo.isContactNameDisplayed('Al Allbrook')).toBeTruthy();
            await quickCasePo.gotoCaseButton();
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    it('[DRDMV-800]: [Quick Case] Case creation with requester having same name as other company users', async () => {
        await navigationPo.gotoQuickCase();
        await quickCasePo.selectRequesterName('Person1 Person1');
        await quickCasePo.setCaseSummary('caseSummary');
        await quickCasePo.createCaseButton();
        await quickCasePo.gotoCaseButton();
        expect(await viewCasePo.getRequesterName()).toBe('Person1 Person1');
    });

    describe('[DRDMV-786]: [Quick Case] Case creation with all case statuses in template', async () => {
        let templateData1, templateData2, templateData3, templateData4, randomStr = [...Array(15)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            templateData1 = {
                "templateName": randomStr + "CaseTemplate1 DRDMV786",
                "templateSummary": randomStr + "Summary1 DRDMV786",
                "templateStatus": "Active",
                "company": "Petramco",
                "caseStatus": "New",
                "businessUnit": "HR Support",
                "supportGroup": "Workforce Administration"
            }
            templateData2 = {
                "templateName": randomStr + "CaseTemplate2 DRDMV786",
                "templateSummary": randomStr + "Summary2 DRDMV786",
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
                "templateName": randomStr + "CaseTemplate3 DRDMV786",
                "templateSummary": randomStr + "Summary3 DRDMV786",
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
                "templateName": randomStr + "CaseTemplate4 DRDMV786",
                "templateSummary": randomStr + "Summary4 DRDMV786",
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
        it('[DRDMV-786]: Creating the case with diffrent statuses', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(templateData1.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('New');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(templateData2.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Assigned');
        });
        it('[DRDMV-786]: [Quick Case] Case creation with all case statuses in template', async () => {
            await navigationPo.signOut();
            await loginPo.login('fritz');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(templateData4.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('Resolved');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("fritz");
            await quickCasePo.selectCaseTemplate(templateData3.templateName);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
            expect(await viewCasePo.getCaseStatusValue()).toContain('In Progress');
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    describe('[DRDMV-1087]: [Quick Case] Case Template search via !', async () => {
        let templateData, templateData1, randomStr = [...Array(15)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let threeCharacterString = randomStr.substr(0, 3);
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + "CaseTemplateDraft DRDMV1087",
                "templateSummary": randomStr + "SummaryDraft DRDMV1087",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "casePriority": "Low",
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3"
            }
            templateData1 = {
                "templateName": randomStr + "CaseTemplatePsilon DRDMV1087",
                "templateSummary": randomStr + "SummaryPsilon DRDMV1087",
                "templateStatus": "Active",
                "company": 'Psilon',
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "rrovnitov",
                "ownerBU": 'Psilon Support Org1',
                "ownerGroup": "Psilon Support Group1"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createCaseTemplate(templateData1);
        });
        it('[DRDMV-1087]: Checking change case template button for In Progress', async () => {
            //Draft Template Search 
            await navigationPo.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(templateData.templateName)).toBeFalsy("Draft Template is founded");;
            //Active Template Verification
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        });
        it('[DRDMV-1087]: Checking change case template button', async () => {
            await utilGrid.searchAndOpenHyperlink(templateData.templateName);
            await editCaseTemplatePo.clickOnEditCaseTemplateMetadata();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await navigationPo.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(templateData.templateName);
            await quickCasePo.setCaseSummary(randomStr);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-1087]: [Quick Case] Case Template search via !', async () => {
            //Different Company Search
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(templateData1.templateName)).toBeFalsy("Template is same as employee comapny");
            //3 Character Search Template Verification
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(threeCharacterString)).toBeTruthy("Template not found");
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-795]: [Quick Case] Case template search in Resources', async () => {
        let caseTemplateDraftStatus, caseTemplatePsilon, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateDraftStatus = {
                "templateName": randomStr + 'CaseTemplateDraft DRDMV795',
                "templateSummary": randomStr + 'SummaryDraft DRDMV795',
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
            caseTemplatePsilon = {
                "templateName": randomStr + 'PsilonCaseTemplate DRDMV795',
                "templateSummary": randomStr + 'PsilonSummary DRDMV795',
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Psilon",
                "businessUnit": "Psilon Support Org1",
                "supportGroup": "Psilon Support Group1",
                "assignee": "gderuno",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateDraftStatus);
            await apiHelper.apiLogin('gderuno');
            await apiHelper.createCaseTemplate(caseTemplatePsilon);
        });
        it('[DRDMV-795]: Case template search in Resources', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDraftStatus.templateName)).toBeFalsy("Draft case template present");
        });
        it('[DRDMV-795]: Draft Case template search in Resources', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplatePsilon.templateName)).toBeFalsy('Psilon case template present');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
        });
        it('[DRDMV-795]: Psilon Case template search in Resources', async () => {
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(caseTemplateDraftStatus.templateName);
            await editCaseTemplatePo.clickOnEditCaseTemplateMetadata();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplatePsilon.templateName)).toBeFalsy('Different organization case template present');
        });
        it('[DRDMV-795]: [Quick Case] Case template search in Resources', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(caseTemplateDraftStatus.templateName)).toBeTruthy("template not present1");
            await quickCasePo.setCaseSummary(caseTemplateDraftStatus.templateSummary);
            expect(await resourcesPo.getAdvancedSearchResultForParticularSection(caseTemplateDraftStatus.templateName)).toEqual(caseTemplateDraftStatus.templateName);
            await quickCasePo.setCaseSummary(caseTemplateDraftStatus.description);
            expect(await resourcesPo.getAdvancedSearchResultForParticularSection(caseTemplateDraftStatus.templateName)).toEqual(caseTemplateDraftStatus.templateName);
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //apdeshmu
    describe('[DRDMV-767]: [Quick Case] Case creation with template (end-to-end)', async () => {
        let tasktemplateData, caseTemplateData, randomStr = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV767";
        beforeAll(async () => {
            tasktemplateData = {
                "templateName": randomStr + "767Petramco",
                "templateSummary": randomStr + "767Petramco",
                "templateStatus": "Active",
                "processBundle": "com.bmc.dsm.case-lib",
                "processName": `Case Process 1 ${randomStr}`,
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "United States Support",
                "ownerGroup": "US Support 3"
            }
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + "Summary DRDMV767",
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": 'qkatawazi',
                "ownerBU": "United States Support",
                "ownerGroup": "US Support 3",
                "supportCompany": "Petramco",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "priority": "Low",
            }
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "Assignee": "qkatawazi"
            }
            let assignmentData = {
                "assignmentMappingName": commonName,
                "company": "Petramco",
                "supportCompany": "Petramco",
                "businessUnit": "HR Support",
                "supportGroup": "Employee Relations",
                "assignee": "Elizabeth",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "priority": "Low",
            }
            let articleData1 = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "categoryTier1": "Employee Relations",
                "categoryTier2": "Compensation",
                "categoryTier3": "Bonus",
                "region": "Australia",
                "site": "Canberra",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            }
            await apiHelper.apiLogin('qkatawazi');
            let automationTaskTemplate = await apiHelper.createAutomatedTaskTemplate(tasktemplateData);
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, automationTaskTemplate.displayId);
            await apiHelper.createCaseAssignmentMapping(assignmentData);
            await apiHelper.createCase(caseData);
            await apiHelper.createKnowledgeArticle(articleData1);
        });
        it('[DRDMV-767]: Case creation with template', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
        });
        it('[DRDMV-767]: Case creation with template', async () => {
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("adam");
            await quickCasePo.selectDrpDownValueByIndex('Another person contacting on behalf of the requester', 1);
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName("chetan");
            await quickCasePo.setCaseSummary(caseTemplateData.templateName);
            await quickCasePo.pinRecommendedCases(0);
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton("Apply");
            await resourcesPo.pinRecommendedKnowledgeArticles(1);
            await quickCasePo.saveCase();
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-767]: [Quick Case] Case creation with template (end-to-end)', async () => {
            expect(await viewCasePo.getCaseSummary()).toBe(caseTemplateData.templateName, "Template is not Found");
            expect(await viewCasePo.getCategoryTier1Value()).toBe('Employee Relations', "Category is not displaying");
            expect(await viewCasePo.getCategoryTier2Value()).toBe('Compensation', "Category is not displaying");
            expect(await viewCasePo.getCategoryTier3Value()).toBe('Bonus', "Category is not displaying");
            expect(await viewCasePo.getCaseStatusValue()).toBe('In Progress', "Status is not displaying");
            expect(await viewCasePo.getAssignedGroupText()).toBe('US Support 3');
            expect(await viewCasePo.getAssignedCompanyText()).toBe('Petramco');
            expect(await viewCasePo.getCaseTemplateText()).toBe(caseTemplateData.templateName);
            expect(await activityPo.isTextPresentInActivityLog("created the case")).toBeTruthy("Text is not present in activiy tab1");
            expect(await activityPo.isTextPresentInActivityLog("created the case")).toBeTruthy("Text is not present in activiy tab1");
            expect(await viewCasePo.isCoreTaskPresent(tasktemplateData.templateSummary)).toBeTruthy("Task Is not added from Case Template");
            await viewCasePo.clickOnTab('Resources');
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton("Apply");
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.getAdvancedSearchResultForParticularSection(caseTemplateData.templateName)).toEqual(caseTemplateData.templateName);
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //ptidke
    describe('[DRDMV-773]: [Quick Case] Case template selection via !', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData, templateDataDraft, templateDataPsilon;
        beforeAll(async () => {
            templateData = {
                "templateName": randomStr + "CaseTemplateActive DRDMV773",
                "templateSummary": randomStr + "SummaryActive DRDMV773",
                "templateStatus": "Active",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateData);
            templateDataDraft = {
                "templateName": randomStr + "CaseTemplateDraft DRDMV773",
                "templateSummary": randomStr + "SummaryDrft DRDMV773",
                "templateStatus": "Draft",
                "company": "Petramco",
                "resolveCaseonLastTaskCompletion": "1",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
            }
            await apiHelper.apiLogin('fritz');
            await apiHelper.createCaseTemplate(templateDataDraft);
            templateDataPsilon = {
                "templateName": randomStr + "PsilonTemplate DRDMV773",
                "templateSummary": randomStr + "PsilonSummary DRDMV773",
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
        it('[DRDMV-773]: Case template selection via !', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(templateData.templateName)).toBeTruthy('template is present1');
        });
        it('[DRDMV-773]: Case template selection via !', async () => {
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectRoleValue('Related to');
            expect(await quickCasePo.selectCaseTemplate(templateDataDraft.templateName)).toBeFalsy('template is present2');
        });
        it('[DRDMV-773]: Case template selection via !', async () => {
            await quickCasePo.selectRequesterName('fritz');
            expect(await quickCasePo.selectCaseTemplate(templateDataPsilon.templateName)).toBeFalsy('template is present3');
        });
        it('[DRDMV-773]: [Quick Case] Case template selection via !', async () => {
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.selectCaseTemplate(templateData.templateName);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await viewCasePo.getCaseTemplateText()).toBe(templateData.templateName);
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-796]: [Quick Case] Resources preview', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let commonName = randomStr + "Case DRDMV796";
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            let manualTaskTemplateData = {
                "templateName": `manualTaskTemplateDraft ${randomStr}`,
                "templateSummary": `manualTaskTemplateDraft ${randomStr}`,
                "templateStatus": "Active",
                "taskCompany": "Petramco",
                "ownerCompany": "Petramco",
                "ownerBusinessUnit": "Facilities Support",
                "ownerGroup": "Facilities"
            }
            caseTemplateData = {
                "templateName": commonName,
                "templateSummary": randomStr + 'Summary DRDMV796',
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "company": "Petramco",
                "businessUnit": "Facilities Support",
                "supportGroup": "Facilities",
                "assignee": "Fritz",
                "casePriority": "Low",
            };
            let caseData = {
                "Requester": "qtao",
                "Summary": commonName,
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "categoryTier1": "Purchasing Card",
                "categoryTier2": "Policies",
                "categoryTier3": "Card Issuance",
                "Assignee": "qkatawazi"
            };
            let articleData = {
                "knowledgeSet": "HR",
                "title": commonName,
                "templateId": "AGGAA5V0HGVMIAOK2JE7O965BK1BJW",
                "assignedCompany": "Petramco",
                "assigneeBusinessUnit": "Australia Support",
                "assigneeSupportGroup": "AU Support 3",
                "assignee": "KWilliamson"
            };
            await apiHelper.apiLogin('qkatawazi');
            let manualTaskTemplate = await apiHelper.createManualTaskTemplate(manualTaskTemplateData);
            let newCaseTemplate = await apiHelper.createCaseTemplate(caseTemplateData);
            await apiHelper.createCase(caseData);
            await apiHelper.associateCaseTemplateWithOneTaskTemplate(newCaseTemplate.displayId, manualTaskTemplate.displayId);
            let knowledgeArticleData = await apiHelper.createKnowledgeArticle(articleData);
            let knowledgeArticleGUID = knowledgeArticleData.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'Draft')).toBeTruthy('Status Not Set');
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'SMEReview', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(knowledgeArticleGUID, 'PublishApproval', 'qkatawazi', 'Compensation and Benefits', 'Petramco')).toBeTruthy('Status Not Set');
        });
        it('[DRDMV-796]: Creating case with template/Knowledge selection', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            await quickCasePo.selectCaseTemplate(caseTemplateData.templateName);
            await quickCasePo.clickArrowFirstRecommendedCaseTemplate();
            expect(await previewCaseTemplateCasesPo.getCaseSummary()).toBe(caseTemplateData.templateSummary);
            expect(await previewCaseTemplateCasesPo.getCaseStatus()).toBe("In Progress");
            expect(await previewCaseTemplateCasesPo.getCaseCompanyValue()).toBe("Petramco");
            expect(await previewCaseTemplateCasesPo.getCaseTemplateName()).toBe(caseTemplateData.templateName);
            expect(await previewCaseTemplateCasesPo.getCasePriority()).toBe("Low");
            await previewCaseTemplateCasesPo.clickOnBackButton();
        });
        it('[DRDMV-796]: [Quick Case] Resources preview', async () => {
            await browser.sleep(5000); //Hard wait for KA Indexing
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(caseTemplateData.templateName);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton('Apply');           
            await resourcesPo.clickArrowFirstRecommendedKnowledge('Recommended Knowledge');
            expect(await previewKnowledgePo.isStatusOfKADisplay()).toBeTruthy('Knowledge status not present');
            expect(await previewKnowledgePo.isBackButtonDisplay()).toBeTruthy('back button not present');
            await previewKnowledgePo.clickOnBackButton();
            await quickCasePo.createCaseButton();
            expect(await previewCasePo.isRequesterNameDisplayed('Adam Pavlik')).toBeTruthy();
            expect(await previewCasePo.isCaseSummaryDisplayed(caseTemplateData.templateSummary)).toBeTruthy();
            expect(await previewCasePo.isAssignedCompanyDisplayed('Petramco')).toBeTruthy();
            expect(await previewCasePo.isRequesterEmailIdDisplayed('apavlik@petramco.com')).toBeTruthy();
            expect(await previewCasePo.isDescriptionDisplayed('Adam Pavlik ' + `${caseTemplateData.templateName}`)).toBeTruthy();
            await previewCasePo.clickGoToCaseButton();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //ptidke 
    describe('[DRDMV-741]: [Quick Case] UI validation including Source field in Quick Case', async () => {
        let activeSourceUI, inActiveSource741, sourceDeprecated741, activeSourceNotUI;
        beforeAll(async () => {
            let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            await apiHelper.apiLogin('qkatawazi');

            //active yes on UI
            let sourceMenuItemData = cloneDeep(SOURCE_MENU_ITEM);
            activeSourceUI = sourceMenuItemData.menuItemName + randomStr;
            sourceMenuItemData.menuItemName = activeSourceUI;
            await apiHelper.createNewMenuItem(sourceMenuItemData);

            //Inactive 
            let sourceInActiveData = cloneDeep(SOURCE_INACTIVE);
            inActiveSource741 = sourceInActiveData.menuItemName + randomStr;
            sourceInActiveData.menuItemName = inActiveSource741;
            await apiHelper.createNewMenuItem(sourceInActiveData);

            //deprecated
            let sourceDeprecatedData = cloneDeep(SOURCE_DEPRECATED);
            sourceDeprecated741 = sourceDeprecatedData.menuItemName + randomStr;
            sourceDeprecatedData.menuItemName = sourceDeprecated741;
            await apiHelper.createNewMenuItem(sourceDeprecatedData);

            //Not on UI
            let sourceActiveNotOnUIData = cloneDeep(SOURCE_ACTIVE_NOT_ON_UI);
            activeSourceNotUI = sourceActiveNotOnUIData.menuItemName + randomStr;
            sourceActiveNotOnUIData.menuItemName = activeSourceNotUI;
            await apiHelper.createNewMenuItem(sourceActiveNotOnUIData);
        });
        it('[DRDMV-741]: Creating the case with source values', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.clickStartOverButton();
            expect(await quickCasePo.getDescriptionDetails()).toContain("Begin by entering person's name, email, login ID or employee ID after the @ symbol. Then enter a description of the case.");
            expect(await quickCasePo.getResourcesText()).toContain('Quick Case finds resources for you while you take notes');
            expect(await quickCasePo.getSelectedSourceValue()).toContain('Agent');
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary('new case creation');
            await quickCasePo.selectSourceValue(activeSourceUI);
            await quickCasePo.createCaseButton();
            await quickCasePo.gotoCaseButton();
            expect(await viewCasePo.getSourceValue()).toContain(activeSourceUI);
        });
        it('[DRDMV-741]: [Quick Case] UI validation including Source field in Quick Case', async () => {
            await navigationPo.gotoQuickCase();
            expect(await quickCasePo.isValuePresentInSourceDropDown(sourceDeprecated741)).toBeFalsy(sourceDeprecated741 + 'is present');
            expect(await quickCasePo.isValuePresentInSourceDropDown(inActiveSource741)).toBeFalsy(inActiveSource741 + 'is present');
            expect(await quickCasePo.isValuePresentInSourceDropDown(activeSourceNotUI)).toBeFalsy(activeSourceNotUI + 'is present');
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    it('[DRDMV-8387]: UI validation Email Option via Quick case', async () => {
        await navigationPo.gotoQuickCase();
        await quickCasePo.selectRequesterName('adam');
        await quickCasePo.setCaseSummary('new case');
        await quickCasePo.createCaseButton();
        await utilityCommon.closePopUpMessage();
        await quickCasePo.gotoCaseButton();
        let quickCaseId: string = await viewCasePo.getCaseID();
        await viewCasePo.clickOnEmailLink();
        expect(await composeMailPo.isComposeEmailTitlePresent('Compose Email')).toBeTruthy('Compose email title missing');
        expect(await composeMailPo.isToOrCCInputTetxboxPresent('To')).toBeTruthy('To title missing');
        expect(await composeMailPo.isToOrCCInputTetxboxPresent('Cc')).toBeTruthy('Cc title missing');
        expect(await composeMailPo.isSubjectPresent()).toBeTruthy('Subject title missing');
        expect(await composeMailPo.getSubject()).toBe(quickCaseId + ":");
        expect(await composeMailPo.isSelectEmailTemplateLinkPresent()).toBeTruthy('SelectEmailTemplateLink is missing');
        expect(await composeMailPo.isMessageBodyFontPannelBarPresent()).toBeTruthy('MessageBodyFontPannelBar is missing');
        expect(await composeMailPo.isAttachLinkPresent()).toBeTruthy('Attach Link is  missing');
        expect(await composeMailPo.isSendButtonPresent()).toBeTruthy('Send Button is missing');
        expect(await composeMailPo.isDiscardButtonPresent()).toBeTruthy('Discard Button is missing');
        await composeMailPo.clickOnDiscardButton();
        await utilityCommon.clickOnApplicationWarningYesNoButton("Yes");
    });

    // tgarud 
    describe('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {
        let articleData, unPublishedKA, publishedKA, publishKA_GUID;
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let unPublishedKA_Name = randomStr + ' UnPublished KA';
        let publishedKA_Name = randomStr + ' Published KA';
        beforeAll(async () => {
            articleData = {
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
            unPublishedKA = await apiHelper.createKnowledgeArticle(articleData);
            expect(await apiHelper.updateKnowledgeArticleStatus(unPublishedKA.id, "Draft")).toBeTruthy("Article with Draft status not updated.");
            // Published article
            articleData.title = publishedKA_Name;
            articleData.keyword = `${randomStr}_keyword`;
            articleData.articleDesc = `${randomStr}_description`;
            publishedKA = await apiHelper.createKnowledgeArticle(articleData);
            publishKA_GUID = publishedKA.id;
            expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "Draft")).toBeTruthy("Article with Draft status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "SMEReview", "KMills", 'GB Support 2', 'Petramco')).toBeTruthy("Article with SME Review status not updated.");
            expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "PublishApproval")).toBeTruthy("Article with Published status not updated.");
            await browser.sleep(5000); // hardwait to get KA indexed
        });
        it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {
            // search draft article, should not find
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(unPublishedKA_Name);
            expect(await resourcesPo.isRecommendedKnowledgePresent(unPublishedKA_Name)).toBeFalsy(`${unPublishedKA_Name} Draft KA not disaplyed in Recommended Knowledge`);
        });
        it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {    
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(publishedKA_Name);
            expect(await resourcesPo.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} not disaplyed in Recommended Knowledge`);
        });
        it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {     
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(articleData.keyword);
            expect(await resourcesPo.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} Keyword search not disaplyed in Recommended Knowledge`);
        });
        it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {
            // search published article by description, should find
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(articleData.articleDesc);
            expect(await resourcesPo.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} Description search Published KA not disaplyed in Recommended Knowledge`);
            // Change KA status to closed so that can be used in last step
            expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "RetireApproval")).toBeTruthy("Article with Closed status not updated.");
            await browser.sleep(5000); //API takes time to update and reflect the status
            expect(await apiHelper.updateKnowledgeArticleStatus(publishKA_GUID, "Closed")).toBeTruthy("Article with Closed status not updated.");
            await browser.sleep(3000); // hardwait to reflect KA status as closed
        });
        it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {
            expect(await apiHelper.updateKnowledgeArticleStatus(unPublishedKA.id, "In Progres")).toBeTruthy("Article with Draft status not updated.");
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(unPublishedKA_Name);
            expect(await resourcesPo.isRecommendedKnowledgePresent(unPublishedKA_Name)).toBeFalsy(`${unPublishedKA_Name} In Progress KA not disaplyed in Recommended Knowledge`);
            expect(await apiHelper.updateKnowledgeArticleStatus(unPublishedKA.id, "Canceled")).toBeTruthy("Article with Canceled status not updated.");
            await quickCasePo.clickStartOverButton();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(unPublishedKA_Name);
            expect(await resourcesPo.isRecommendedKnowledgePresent(unPublishedKA_Name)).toBeFalsy(`${unPublishedKA_Name} Canceled KA not disaplyed in Recommended Knowledge`);
        });
        it('[DRDMV-559]: [Quick Case] Knowledge article search in Resources', async () => {  
            await navigationPo.gotoCaseConsole();
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('fritz');
            await quickCasePo.setCaseSummary(publishedKA_Name);
            expect(await resourcesPo.isRecommendedKnowledgePresent(publishedKA_Name)).toBeFalsy(`${publishedKA_Name} Closed KA disaplyed in Recommended Knowledge`);
            await resourcesPo.clickOnAdvancedSearchOptions();
            await resourcesPo.enterAdvancedSearchText(publishedKA_Name);
            await resourcesPo.clickOnAdvancedSearchSettingsIconToOpen();
            await resourcesPo.clickOnAdvancedSearchFiltersButton("Apply");
            await resourcesPo.clickOnAdvancedSearchSettingsIconToClose();
            expect(await resourcesPo.isRecommendedKnowledgePresent(publishedKA_Name)).toBeTruthy(`${publishedKA_Name} Closed KA disaplyed in Recommended Knowledge`);
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });

    //radhiman
    it('[DRDMV-18972]: Populating fields in Quick Case if only Required parameter is specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18972';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=PET00000104&desc=&contact=');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester1);
        expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=&contact=');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy;
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=61288992922&desc=&contact=');
        expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy();
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=&contact=');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy;
    });

    //radhiman
    it('[DRDMV-18973]: Populating fields in Quick Case when all parameters are specified', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18973';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=PET00000104');
        await browser.sleep(1000);
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser@petramco.com');
        await browser.sleep(1000);
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=14085719604');
        await browser.sleep(1000);
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser');
        await browser.sleep(1000);
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
    });

    //radhiman
    it('[DRDMV-18980]: Populating fields in Quick Case with Required and one optional parameter', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18980';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=Change my Last Name&contact');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=&contact=14085719604');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy();
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qdu&desc=Change my Last Name&contact=');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester2);
        expect(await quickCasePo.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });

    //radhiman
    it('[DRDMV-18977]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=Change my Last Name&contact=PET000000000484');
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=Change my Last Name&contact=');
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=&contact=PET000000000484');
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=&desc=&contact=');
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case serch box is not empty');
    });

    //radhiman
    it('[DRDMV-18983]: [-ve] Populating fields in Quick Case if Required parameter is empty', async () => {
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18983';
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=Test1&desc=Change my Last Name&contact=qliu');
        expect(await quickCasePo.getTextOfSummaryTextBox()).toBe('', 'Quick case summary text box is not empty');
        expect(await quickCasePo.isCreateButtonDisabled()).toBeTruthy();
        await browser.get('/helix/index.html#/com.bmc.dsm.bwfa/view/com.bmc.dsm.case-lib:Case Create - Quick Case?customer=qliu&desc=Change my Last Name&contact=test1');
        expect(await quickCasePo.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        expect(await quickCasePo.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    });

    describe('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
        let randomStr = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let templateData1, templateData2;
        beforeAll(async () => {
            templateData1 = {
                "templateName": randomStr + "CaseTemplate1",
                "templateSummary": randomStr + "Summary1",
                "templateStatus": "Draft",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            templateData2 = {
                "templateName": randomStr + "CaseTemplate2",
                "templateSummary": randomStr + "Summary2",
                "templateStatus": "Draft",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData1);
            await apiHelper.createCaseTemplate(templateData2);
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData1.templateName);
            await viewCasetemplatePo.selectTab('Template Access');
            await templateAccessTabPo.clickOnAccessButton('Support Group Access');
            await templateAccessTabPo.selectCompany('Petramco', 'Select Company');
            await templateAccessTabPo.selectBusinessUnit('HR Support', 'Select Business Unit');
            await templateAccessTabPo.selectSupportGroup('Employee Relations', 'Select Support Group');
            await templateAccessTabPo.clickOnReadAccessAddButton('Add Support Group');
            expect(await templateAccessTabPo.isSupportGroupReadAccessDisplayed('Employee Relations')).toBeTruthy('Support Group does not have read access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have read access');
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await utilCommon.clickOnBackArrow();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData2.templateName);
            await viewCasetemplatePo.selectTab('Template Access');
            await templateAccessTabPo.clickOnAccessButton('Support Group Access');
            await templateAccessTabPo.selectCompany('Petramco', 'Select Company');
            await templateAccessTabPo.selectBusinessUnit('HR Support', 'Select Business Unit');
            await templateAccessTabPo.selectSupportGroup('Employee Relations', 'Select Support Group');
            await templateAccessTabPo.clickOnReadAccessAddButton('Add Support Group');
            expect(await templateAccessTabPo.isSupportGroupReadAccessDisplayed('Employee Relations')).toBeTruthy('Support Group does not have read access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have read access');
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.signOut();
            await loginPo.login('elizabeth');
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary("CaseSummary1" + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            expect(await createCasePo.isTemplateNamePresent(templateData1.templateName)).toBeTruthy('template is present1');
            await selectCasetemplateBladePo.clickOnCancelButton();
            await navigationPo.gotoCaseConsole();
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary("CaseSummary1" + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData1.templateName);
            await createCasePo.clickSaveCaseButton();
            expect(await casePreviewPo.isCaseTemplateDisplayed(templateData1.templateName)).toBeTruthy('Case Template is missing');
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName('adam');
            expect(await quickCasePo.selectCaseTemplate(templateData2.templateName)).toBeTruthy('template is present1');
            await navigationPo.gotoCreateCase();
            await createCasePo.selectRequester('adam');
            await createCasePo.setSummary("CaseSummary2" + randomStr);
            await createCasePo.clickSelectCaseTemplateButton();
            await selectCasetemplateBladePo.selectCaseTemplate(templateData2.templateName);
            await createCasePo.clickSaveCaseButton();
            expect(await casePreviewPo.isCaseTemplateDisplayed(templateData2.templateName)).toBeTruthy('Case Template is missing');
            await previewCasePo.clickGoToCaseButton();
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData1.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.selectTab('Template Access');
            await templateAccessTabPo.deleteTemplateAccess('Employee Relations');
            await utilCommon.clickOnBackArrow();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData2.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.selectTab('Template Access');
            await templateAccessTabPo.deleteTemplateAccess('Employee Relations');
            await utilCommon.clickOnBackArrow();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData1.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await utilCommon.clickOnBackArrow();
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData2.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Active');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.signOut();
            await loginPo.login('elizabeth');
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(templateData1.templateName)).toBeFalsy('template is present');
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {    
            await navigationPo.gotoQuickCase();
            await quickCasePo.selectRequesterName("adam");
            expect(await quickCasePo.selectCaseTemplate(templateData2.templateName)).toBeFalsy('template is present');
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData1.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.selectTab('Template Access');
            await templateAccessTabPo.clickOnAccessButton('Support Group Access');
            await templateAccessTabPo.selectCompany('Petramco', 'Select Company');
            await templateAccessTabPo.selectBusinessUnit('HR Support', 'Select Business Unit');
            await templateAccessTabPo.selectSupportGroup('Compensation and Benefits', 'Select Support Group');
            await templateAccessTabPo.clickOnWriteAccessAddButton('Add Support Group');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have read access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have write access');
            await navigationPo.signOut();
            await loginPo.login('elizabeth');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData1.templateName);
            await viewCasetemplatePo.selectTab('Template Access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have read access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have write access');
        });
        it('[DRDMV-22711,DRDMV-22703]: Verify Case Template access while Creating case for Global and Petramco Company', async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData2.templateName);
            await viewCasetemplatePo.clickEditTemplateMetaData();
            await editCaseTemplatePo.changeTemplateStatusDropdownValue('Draft');
            await editCaseTemplatePo.clickOnSaveCaseTemplateMetadata();
            await utilCommon.closePopUpMessage();
            await viewCasetemplatePo.selectTab('Template Access');
            await templateAccessTabPo.clickOnAccessButton('Support Group Access');
            await templateAccessTabPo.selectCompany('Petramco', 'Select Company');
            await templateAccessTabPo.selectBusinessUnit('HR Support', 'Select Business Unit');
            await templateAccessTabPo.selectSupportGroup('Compensation and Benefits', 'Select Support Group');
            await templateAccessTabPo.clickOnWriteAccessAddButton('Add Support Group');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have read access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have write access');
            await navigationPo.signOut();
            await loginPo.login('elizabeth');
            await navigationPo.gotoSettingsPage();
            await navigationPo.gotoSettingsMenuItem('Case Management--Templates', 'Case Templates - Business Workflows');
            await consoleCasetemplatePo.searchAndClickOnCaseTemplate(templateData2.templateName);
            await viewCasetemplatePo.selectTab('Template Access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('US Support 3')).toBeTruthy('Support Group does not have read access');
            expect(await templateAccessTabPo.isSupportGroupWriteAccessDisplayed('Compensation and Benefits')).toBeTruthy('Support Group does not have write access');
        });
        afterAll(async () => {
            await navigationPo.signOut();
            await loginPo.login('qkatawazi');
        });
    });
});
