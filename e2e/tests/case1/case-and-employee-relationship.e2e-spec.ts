import { browser } from "protractor";
import apiHelper from '../../api/api.helper';
import addRelatedCasespopup from '../../pageobject/case/add-related-cases-pop.po';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import previewCasePo from '../../pageobject/case/case-preview.po';
import createCasePage from '../../pageobject/case/create-case.po';
import quickCase from '../../pageobject/case/quick-case.po';
import viewCasePo from '../../pageobject/case/view-case.po';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import personProfilePage from '../../pageobject/common/person-profile.po';
import { default as relatedCasePage, default as relatedCaseTabPo } from '../../pageobject/common/related-case-tab.po';
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import composeEmailPage from '../../pageobject/email/compose-mail.po';
import relationConfigPage from '../../pageobject/settings/relationship/relationships-configs.po';
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';

describe('Case And Employee Relationship', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qtao');
        await utilityGrid.clearFilter();
    });

    afterAll(async () => {
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    //asahitya
    it('[DRDMV-16241,DRDMV-16242,DRDMV-16240]: Add person with different relations', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16241");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Related to');
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Related to')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Lily Anthony', 'Target');
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Lily Anthony', 'Target')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Demi Moore', 'Victim');
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Demi Moore', 'Victim')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brain Adams', 'Witness');
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Brain Adams', 'Witness')).toBeTruthy();
    });

    //asahitya
    it('[DRDMV-16896]: Multiple people can be added by same Relationship', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16896");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Inspector');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Lily Anthony', 'Inspector');
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Inspector')).toBeTruthy();
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Lily Anthony', 'Inspector')).toBeTruthy();
    });

    //asahitya
    it('[DRDMV-16248]: Related Persons tab is available on Person Profile check UI', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16248");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brad Pitt', 'Inspector');
        await relatedTabPage.clickRelatedPersonName('Brad Pitt');
        try {
            await utilityCommon.switchToNewTab(1);
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Bobby Hill', 'Former Manager');
            await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
            expect(await relatedTabPage.getRelatedPersonCompanyName('Bobby Hill')).toBe('Petramco');
            expect(await relatedTabPage.getRelatedPersonEmail('Bobby Hill')).toBe('bhill@bwflabs.localdomain');
            expect(await relatedTabPage.getRelatedPersonPhoneNumber('Bobby Hill')).toBe('+556132296002');
            expect(await relatedTabPage.getRelatedPersonRelationship('Bobby Hill')).toBe('Former Manager');
            expect(await relatedTabPage.getRelatedPersonSite('Bobby Hill')).toBe('Brasília\nCorporate Financial Center\nSCN – Quadra 02- Bloco A 5º Andar Sala 53, Brasília, Distrito Federal, 70712-900, Brazil ');
            expect(await relatedTabPage.isEmailLinkNotPresent('Bobby Hill')).toBeTruthy('Email should not be a clickable link');
        }
        catch (ex) { throw ex }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //asahitya
    it('[DRDMV-17037]: Related Case tab is available on Person Profile', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17037");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId: string = await viewCasePo.getCaseID();
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brad Pitt', 'Inspector');
        try {
            await relatedTabPage.clickRelatedPersonName('Brad Pitt');
            await utilityCommon.switchToNewTab(1);
            await personProfilePage.clickOnTab('Related Cases');
            expect(await relatedCasePage.getRelatedCaseAssignee(caseId)).toBe('Qianru Tao');
            expect(await relatedCasePage.getRelatedCaseModDate(caseId)).toContain('Modified')
            expect(await relatedCasePage.getRelatedCasePriority(caseId)).toBe('Medium');
            expect(await relatedCasePage.getRelatedCaseStatus(caseId)).toBe('Assigned');
            expect(await relatedCasePage.getRelatedCaseRelation(caseId)).toBe('Inspector');
        }
        catch (ex) { throw ex }
        finally {
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        }
    });

    //asahitya
    it('[DRDMV-17035]: Remove Related Case from Case', async () => {
        await apiHelper.apiLogin('qtao');
        //create case 1
        let caseData1 = {
            "Requester": "qkatawazi",
            "Summary": "DRDMV-17035_1"
        }
        let caseResponse1 = await apiHelper.createCase(caseData1);
        let caseId1: string = await caseResponse1.displayId;

        //create case 2
        let caseData2 = {
            "Requester": "qkatawazi",
            "Summary": "DRDMV-17035_2"
        }
        let caseResponse2 = await apiHelper.createCase(caseData2);
        let caseId2: string = await caseResponse2.displayId;

        //create case 3
        let caseData3 = {
            "Requester": "qkatawazi",
            "Summary": "DRDMV-17035_3"
        }
        let caseResponse3 = await apiHelper.createCase(caseData3);
        let caseId3: string = await caseResponse3.displayId;

        await navigationPage.gotoCaseConsole();
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(caseId3);

        //Add case 1 and case 2 in related cases
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseId1, "Child");
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseId2, "Child");

        //Open Case 1 and Remove the case 1
        await relatedCasePage.openCaseFromRelatedCases(caseId1);
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.removeRelatedCase(caseId3);
        //await relatedCasePage.waitUntilNewRelatedCaseAdded(0);

        //Open case 3 and verify case1 is not present in Related cases
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseId3);
        await viewCasePo.clickOnTab('Related Cases');
        expect(await relatedCasePage.isCasePresent(caseId1)).toBeFalsy();
        expect(await relatedCasePage.isCasePresent(caseId2)).toBeTruthy();

        //Remove case 2 from case 1 and verify in case 2
        await relatedCasePage.removeRelatedCase(caseId2);
        await navigationPage.gotoCaseConsole()
        await utilityGrid.searchAndOpenHyperlink(caseId2);
        await viewCasePo.clickOnTab('Related Cases');
        expect(await relatedCasePage.isCasePresent(caseId3)).toBeFalsy();
    });

    //asahitya
    it('[DRDMV-16243]: Check details shown for Employees on Related People tab', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['caseData_DRDMV16243']);
        let caseDisplayId = response.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId);
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        expect(await relatedTabPage.getRelatedPersonCompanyName('Qianru Tao')).toBe("Petramco", "Related Person Company name does not match");
        expect(await relatedTabPage.getRelatedPersonPhoneNumber('Qianru Tao')).toBe("+15123431921", "Related Person Phone number does not match");
        expect(await relatedTabPage.getRelatedPersonEmail('Qianru Tao')).toBe("qtao@petramco.com", "Related Person Email ID does not match");
        expect(await relatedTabPage.getRelatedPersonRelationship('Qianru Tao')).toBe("Inspector", "Related Person Relationship does not match");
        expect(await relatedTabPage.getRelatedPersonSite('Qianru Tao')).toBe("Austin\n10431 Morado Circle\nAvalon Building 5, Austin, Texas, 78759, United States ", "Related Person Phone number does not match");
    });

    //asahitya
    it('[DRDMV-17036]: Check details shown for Employees on Related People tab', async () => {
        await apiHelper.apiLogin("qtao");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response1 = await apiHelper.createCase(caseData['caseData_DRDMV16243']);
        let response2 = await apiHelper.createCase(caseData['caseData_DRDMV16243']);
        let caseDisplayId1 = response1.displayId;
        let caseDisplayId2 = response2.displayId;
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseDisplayId1);
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseDisplayId2, "Child");
        expect(await relatedCasePage.getRelatedCaseAssignee(caseDisplayId2)).toBe("Elizabeth Peters");
        expect(await relatedCasePage.getRelatedCasePriority(caseDisplayId2)).toBe("Low");
        expect(await relatedCasePage.getRelatedCaseModDate(caseDisplayId2)).toContain("Modified");
        expect(await relatedCasePage.getRelatedCaseRelation(caseDisplayId2)).toBe("Child");
        expect(await relatedCasePage.getRelatedCaseStatus(caseDisplayId2)).toBe("Assigned");
        expect(await relatedCasePage.getRelatedCaseSummary(caseDisplayId2)).toBe("Testing Realated Persons");
    });

    //asahitya
    it('[DRDMV-16245]: Remove the Person from Case Related People tab and Person Profile Related People tab', async () => {
        await navigationPage.gotoPersonProfile();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brain Adams', 'Parent');
        await relatedTabPage.removeRelatedPerson("Brain Adams");

        await apiHelper.apiLogin("qyuan");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['simpleCase']);
        let caseId = await response.displayId;
        let caseGuid = await response.id;
        //Write access to qtao
        let caseAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'qtao'
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQtao);
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseId);
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Related to');
        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseId);
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.removeRelatedPerson("Harry Potter");
        expect(await relatedTabPage.isRelatedPersonPresent("Harry Potter")).toBeFalsy("Harry Potter is still related to Case: " + caseId);
        await navigationPage.gotoPersonProfile();
        expect(await relatedTabPage.isRelatedPersonPresent("Brain Adams")).toBeFalsy("Brain Adams is still related to Person Profile");
        expect(await relatedTabPage.isRemoveRelatedPersonIconEnabled("Qiang Du")).toBeFalsy("Cross icon is enabled");
    });

    //asahitya
    it('[DRDMV-17029]: Check Related Cases Tab on Case Bottom section', async () => {
        await navigationPage.gotoCaseConsole();
        //Create case 1 to pin with quick case
        let randomStr = [...Array(15)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let caseData2 =
        {
            "Requester": "qkatawazi",
            "Summary": randomStr
        }
        await apiHelper.apiLogin('qtao');
        let caseId2 = await (await apiHelper.createCase(caseData2)).displayId;

        //Create case 2
        await apiHelper.apiLogin("qyuan");
        let caseData = require('../../data/ui/case/case.ui.json');
        let response = await apiHelper.createCase(caseData['simpleCase']);
        let caseGuid = await response.id;

        //Write access to qtao
        let caseAccessDataQtao = {
            "operation": operation['addAccess'],
            "type": type['user'],
            "security": security['witeAccess'],
            "username": 'qtao'
        }
        await apiHelper.updateCaseAccess(caseGuid, caseAccessDataQtao);
        await browser.sleep(5000); // required for indexing, case will appear in recommended case section
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        await quickCase.setSummaryAndPinRecommandedCase(caseId2, randomStr);
        await quickCase.createCaseButton();
        await quickCase.gotoCaseButton();
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.isCasePresent(caseId2);
    });

    //asahitya
    it('[DRDMV-17039]: Check if Person is Related to other Case to which he has no access and Cases are not shown on Person Profile', async () => {
        let caseData = {
            "Description": "My Bulk Case Assignee",
            "Requester": "apavlik",
            "Summary": "Bulk Case Assignee",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Assignee": "qfeng",
        }

        await apiHelper.apiLogin('qfeng');
        let response1 = await apiHelper.createCase(caseData);
        caseData["Support Group"] = "US Support 3";
        let response2 = await apiHelper.createCase(caseData);

        try {
            await navigationPage.signOut();
            await loginPage.login('qfeng');
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(response1.displayId);
            await viewCasePo.clickOnTab('Related Persons');
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(response2.displayId);
            await viewCasePo.clickOnTab('Related Persons');
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        }
        catch (ex) { throw ex; }
        finally {
            await navigationPage.signOut();
            await loginPage.login('qtao');
        }

        await navigationPage.gotoPersonProfile();
        await personProfilePage.clickOnTab('Related Cases');
        expect(await personProfilePage.isCaseAvailableOnRelatedCases(response1.displayId)).toBeTruthy(response1.displayId + ' is not present');
        expect(await personProfilePage.isCaseAvailableOnRelatedCases(response2.displayId)).toBeFalsy(response2.displayId + ' is present');
    });

    //asahitya
    describe('[DRDMV-16247]: Send Email to Related Person from Related Persons tab', async () => {
        let caseInfo, randomStr = [...Array(15)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.createEmailConfiguration();
            let caseData = {
                "Requester": "apavlik",
                "Summary": "Email check " + randomStr,
            }
            await apiHelper.apiLogin('qtao');
            caseInfo = await apiHelper.createCase(caseData);
        });
        it('[DRDMV-16247]: Send Email to Related Person from Related Persons tab', async () => {
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseInfo.displayId);
            let subject = 'Email Subject ' + randomStr;
            await viewCasePo.clickOnTab('Related Persons');
            await relatedTabPage.addRelatedPerson();
            await addRelatedPopupPage.addPerson('Qadim Katawazi', 'Inspector');
            await relatedTabPage.clickRelatedPersonEmail('Qadim Katawazi');
            await composeEmailPage.setSubject(subject);
            //            CASE-0000000239:CASE-0000000239:Email Subject w7t05kmfmby2pi0
            await composeEmailPage.setEmailBody('DRDMV-16247 ' + randomStr);
            await composeEmailPage.clickOnSendButton();
            let subjectInArSys = `${caseInfo.displayId}:${subject}`;
            console.log(`Subject of the email = ${subjectInArSys}`);
            await browser.sleep(8000); // hardwait to appear email message in "AR System Email Messages"
            await apiHelper.apiLogin('tadmin');
            let body = await apiHelper.getHTMLBodyOfEmail(subjectInArSys);
            console.log('body:', body);
            expect(body.includes('<br>DRDMV-16247')).toBeTruthy('Email does not match');
        });
    });

    //asahitya
    describe('[DRDMV-17030]: Relate Cases using OOB Cases to Cases Relationship and check Child Relationship', () => {
        let caseId: string[] = [];
        beforeAll(async () => {
            await apiHelper.apiLogin('qfeng');
            let caseData = {
                "Description": "My Bulk Case Assignee",
                "Requester": "apavlik",
                "Summary": "Bulk Case Assignee",
                "Assigned Company": "Petramco",
                "Business Unit": "United States Support",
                "Support Group": "US Support 3",
                "Assignee": "qfeng",
            }
            for (let i = 0; i < 6; i++) {
                let response = await apiHelper.createCase(caseData);
                caseId[i] = response.displayId;
            }
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

        it('[DRDMV-17030]: Relate Cases using OOB Cases to Cases Relationship and check Child Relationship', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Relationships--Case to Case', 'Case to Case Relationship Console - Business Workflows');
            expect(await relationConfigPage.isRelationshipPresent('Parent')).toBeTruthy('Parent relationship is not present');
            expect(await relationConfigPage.getReverseRelationShipName('Parent')).toBe('Child', 'Reverse Relationship name for Parent does not match');
            expect(await relationConfigPage.isRelationshipPresent('Duplicates')).toBeTruthy('Duplicates relationship is not present');
            expect(await relationConfigPage.getReverseRelationShipName('Duplicates')).toBe('Duplicates', 'Reverse Relationship name for Duplicates does not match');
            expect(await relationConfigPage.isRelationshipPresent('Related to')).toBeTruthy('Related to relationship is not present');
            expect(await relationConfigPage.getReverseRelationShipName('Related to')).toBe('Related to', 'Reverse Relationship name for Related to does not match');
            await utilityCommon.switchToDefaultWindowClosingOtherTabs();
        });

        it('[DRDMV-17030]: Relate Cases using OOB Cases to Cases Relationship and check Child Relationship', async () => {
            await utilityGrid.clearFilter();
            await utilityGrid.searchAndOpenHyperlink(caseId[0]);
            await viewCasePo.clickOnTab('Related Cases');
            await relatedCaseTabPo.addRelatedCases();
            await addRelatedCasespopup.addRelatedCase(caseId[1], 'Child');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId[1]);
            await viewCasePo.clickOnTab('Related Cases');
            expect(await relatedCaseTabPo.getRelatedCaseRelation(caseId[0])).toBe('Parent');

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId[2]);
            await viewCasePo.clickOnTab('Related Cases');
            await relatedCaseTabPo.addRelatedCases();
            await addRelatedCasespopup.addRelatedCase(caseId[3], 'Duplicates');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId[3]);
            await viewCasePo.clickOnTab('Related Cases');
            expect(await relatedCaseTabPo.getRelatedCaseRelation(caseId[2])).toBe('Duplicates');

            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId[4]);
            await viewCasePo.clickOnTab('Related Cases');
            await relatedCaseTabPo.addRelatedCases();
            await addRelatedCasespopup.addRelatedCase(caseId[5], 'Related to');
            await navigationPage.gotoCaseConsole();
            await utilityGrid.searchAndOpenHyperlink(caseId[5]);
            await viewCasePo.clickOnTab('Related Cases');
            expect(await relatedCaseTabPo.getRelatedCaseRelation(caseId[4])).toBe('Related to');
        });
    });
})
