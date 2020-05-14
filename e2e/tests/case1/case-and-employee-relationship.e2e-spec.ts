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
import relatedCasePage from '../../pageobject/common/related-case-tab.po';
import relatedTabPage from '../../pageobject/common/related-person-tab.po';
import { BWF_BASE_URL, operation, security, type } from '../../utils/constants';
import utilityGrid from '../../utils/utility.grid';
import utilityCommon from '../../utils/utility.common';

describe('Case And Employee Relationship', () => {
    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qtao');
        await utilityGrid.clearFilter();
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    afterEach(async () => {
        await utilityCommon.refresh();
    });

    //asahitya
    it('[DRDMV-16241,DRDMV-16242,DRDMV-16240]: Add person with different relations', async () => {
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16241");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        // This validation is not required as tab click is happening based on Tab text
        // expect(await caseEditPage.getRelatedPersonTabText()).toBe("Related Persons");
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Qianru Tao', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Related to');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Related to')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Lily Anthony', 'Target');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(3);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Lily Anthony', 'Target')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Demi Moore', 'Victim');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(4);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Demi Moore', 'Victim')).toBeTruthy();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brain Adams', 'Witness');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(5);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Brain Adams', 'Witness')).toBeTruthy();
    }, 270 * 1000);//, 240 * 1000);

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
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Harry Potter', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Lily Anthony', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(3);
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Qianru Tao', 'Inspector')).toBeTruthy();
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Harry Potter', 'Inspector')).toBeTruthy();
        expect(await relatedTabPage.isPersonRelatedHasCorrectRelation('Lily Anthony', 'Inspector')).toBeTruthy();
    });//, 170 * 1000);

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
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        await relatedTabPage.clickRelatedPersonName('Brad Pitt');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Bobby Hill', 'Former Manager');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        expect(await relatedTabPage.getRelatedPersonCompanyName('Bobby Hill')).toBe('Petramco');
        expect(await relatedTabPage.getRelatedPersonEmail('Bobby Hill')).toBe('bhill@bwflabs.localdomain');
        expect(await relatedTabPage.getRelatedPersonPhoneNumber('Bobby Hill')).toBe('+556132296002');
        expect(await relatedTabPage.getRelatedPersonRelationship('Bobby Hill')).toBe('Former Manager');
        expect(await relatedTabPage.getRelatedPersonSite('Bobby Hill')).toBe('Brasília\nCorporate Financial Center\nSCN – Quadra 02- Bloco A 5º Andar Sala 53, Brasília, Distrito Federal, 70712-900, Brazil ');
        expect(await relatedTabPage.isEmailLinkNotPresent('Bobby Hill')).toBeTruthy('Email should not be a clickable link');
    });//, 150 * 1000);

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
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        await relatedTabPage.clickRelatedPersonName('Brad Pitt');
        await personProfilePage.clickOnTab('Related Cases');
        await relatedCasePage.waitUntilNewRelatedCaseAdded(1);
        expect(await relatedCasePage.getRelatedCaseAssignee(caseId)).toBe('Qianru Tao');
        expect(await relatedCasePage.getRelatedCaseModDate(caseId)).toContain('Modified')
        expect(await relatedCasePage.getRelatedCasePriority(caseId)).toBe('Medium');
        expect(await relatedCasePage.getRelatedCaseStatus(caseId)).toBe('Assigned');
        expect(await relatedCasePage.getRelatedCaseRelation(caseId)).toBe('Inspector');
    });//, 150 * 1000);

    //asahitya
    it('[DRDMV-17035]: Remove Related Case from Case', async () => {
        //create case 1
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17035_1");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId1: string = await viewCasePo.getCaseID();

        //create case 2
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17035_2");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId2: string = await viewCasePo.getCaseID();

        //create case 3
        await navigationPage.gotoCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17035_3");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await previewCasePo.clickGoToCaseButton();
        let caseId3: string = await viewCasePo.getCaseID();

        //Add case 1 and case 2 in related cases
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseId1, "Child");
        await relatedCasePage.waitUntilNewRelatedCaseAdded(1);
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseId2, "Child");
        await relatedCasePage.waitUntilNewRelatedCaseAdded(2);

        //Open Case 1 and Remove the case 1
        await relatedCasePage.openCaseFromRelatedCases(caseId1);
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.removeRelatedCase(caseId3);
        await relatedCasePage.waitUntilNewRelatedCaseAdded(0);

        //Open case 3 and verify case1 is not present in Related cases
        await navigationPage.gotoCaseConsole()
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(caseId3);
        await viewCasePo.clickOnTab('Related Cases');
        expect(await relatedCasePage.isCasePresent(caseId1)).toBeTruthy();

        //Remove case 2 from case 1 and verify in case 2
        await relatedCasePage.removeRelatedCase(caseId2);
        await navigationPage.gotoCaseConsole()
        await utilityGrid.clearFilter();
        await utilityGrid.searchAndOpenHyperlink(caseId2);
        await viewCasePo.clickOnTab('Related Cases');
        expect(await relatedCasePage.isCasePresent(caseId3)).toBeTruthy();
    }, 300*1000);

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
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        expect(await relatedTabPage.getRelatedPersonCompanyName('Qianru Tao')).toBe("Petramco", "Related Person Company name does not match");
        expect(await relatedTabPage.getRelatedPersonPhoneNumber('Qianru Tao')).toBe("+15123431921", "Related Person Phone number does not match");
        expect(await relatedTabPage.getRelatedPersonEmail('Qianru Tao')).toBe("qtao@petramco.com", "Related Person Email ID does not match");
        expect(await relatedTabPage.getRelatedPersonRelationship('Qianru Tao')).toBe("Inspector", "Related Person Relationship does not match");
        expect(await relatedTabPage.getRelatedPersonSite('Qianru Tao')).toBe("Houston\n2101 CityWest Blvd., Houston, Texas, 77042, United States ", "Related Person Phone number does not match");
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
        await relatedCasePage.waitUntilNewRelatedCaseAdded(1);
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
        await relatedTabPage.waitUntilNewRelatedPersonAdded(2);
        await relatedTabPage.removeRelatedPerson("Brain Adams");
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);

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
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);

        await navigationPage.gotoCaseConsole();
        await utilityGrid.searchAndOpenHyperlink(caseId);
        await viewCasePo.clickOnTab('Related Persons');
        await relatedTabPage.removeRelatedPerson("Harry Potter");
        // await utilityCommon.waitUntilSpinnerToHide();
        expect(await relatedTabPage.isRelatedPersonPresent("Harry Potter")).toBeFalsy("Harry Potter is still related to Case: " + caseId);

        await navigationPage.gotoPersonProfile();
        expect(await relatedTabPage.isRelatedPersonPresent("Brain Adams")).toBeFalsy("Brain Adams is still related to Person Profile");
        expect(await relatedTabPage.isRemoveRelatedPersonIconEnabled("Qiang Du")).toBeFalsy("Cross icon is enabled");
    });//, 180 * 1000);

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

        await utilityCommon.refresh();
        await browser.sleep(5000); // required for indexing, case will appear in recommended case section
        await utilityGrid.searchAndOpenHyperlink(caseId);
        // This validation is not required as tab click is happening based on Tab text
        //expect(await caseEditPage.getRelatedCasesTabText()).toBe("Related Cases");
        await navigationPage.gotoQuickCase();
        await quickCase.selectRequesterName('adam');
        await quickCase.setCaseSummary(randomStr);
        // await utilityCommon.waitUntilSpinnerToHide();
        await quickCase.pinFirstRecommendedCase();
        await quickCase.createCaseButton();
        await quickCase.gotoCaseButton();
        await viewCasePo.clickOnTab('Related Cases');
        await relatedCasePage.isCasePresent(caseId2);
    });

})
