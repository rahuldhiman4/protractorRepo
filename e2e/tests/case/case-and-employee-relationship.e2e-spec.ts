import { browser } from "protractor";
import loginPage from "../../pageobject/login.po";
import createCasePage from '../../pageobject/case/create-case.po';
import navigationPage from "../../pageobject/navigation.po";
import caseEditPage from '../../pageobject/case/edit-case.po';
import caseViewPage from '../../pageobject/case/view-case.po';
import relatedTabPage from '../../pageobject/case/related-person-tab.po';
import addRelatedPopupPage from '../../pageobject/case/add-relation-pop.po';
import relatedCasePage from '../../pageobject/case/related-case-tab.po';
import personProfilePage from '../../pageobject/case/person-profile.po';
import gridUtil from '../../utils/ui/util.grid';
import addRelatedCasespopup from '../../pageobject/case/add-related-cases-pop.po';
import utilCommon from '../../utils/ui/util.common';

describe('Case And Employee Relationship', () => {
    beforeAll(async () => {
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login('qtao');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-16241,DRDMV-16242: Add person with different relations', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16241");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.navigateToRelatedPersonsTab();
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
    }, 90 * 1000)

    it('DRDMV-16896: Multiple people can be added by same Relationship', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16896");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.navigateToRelatedPersonsTab();
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
    });

    it('DRDMV-16248: Related Persons tab is available on Person Profile check UI', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-16248");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await caseEditPage.navigateToRelatedPersonsTab();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brad Pitt', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        await relatedTabPage.clickRelatedPersonName('Brad Pitt');
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Bobby Hill', 'Manager');
        expect(await relatedTabPage.getRelatedPersonCompanyName('Bobby Hill')).toBe('Petramco');
        expect(await relatedTabPage.getRelatedPersonEmail('Bobby Hill')).toBe('bhill@petramco.com');
        expect(await relatedTabPage.getRelatedPersonPhoneNumber('Bobby Hill')).toBe('+556132296002');
        expect(await relatedTabPage.getRelatedPersonRelationship('Bobby Hill')).toBe('Former Manager');
        expect(await relatedTabPage.getRelatedPersonSite('Bobby Hill')).toBe('Houston\n2101 CityWest Blvd., Houston, Texas, 77042, United States');
        expect(await relatedTabPage.isEmailLinkNotPresent('Bobby Hill')).toBeTruthy();
    });

    it('DRDMV-17037: Related Case tab is available on Person Profile', async () => {
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17037");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        var caseId: string = await caseViewPage.getCaseID();
        await caseEditPage.navigateToRelatedPersonsTab();
        await relatedTabPage.addRelatedPerson();
        await addRelatedPopupPage.addPerson('Brad Pitt', 'Inspector');
        await relatedTabPage.waitUntilNewRelatedPersonAdded(1);
        await relatedTabPage.clickRelatedPersonName('Brad Pitt');
        await personProfilePage.navigateToRelatedCase();
        expect(await relatedCasePage.getRelatedCaseAssignee(caseId)).toBe('Qianru Tao');
        expect(await relatedCasePage.getRelatedCaseModDate(caseId)).toContain('Modified')
        expect(await relatedCasePage.getRelatedCasePriority(caseId)).toBe('Medium');
        expect(await relatedCasePage.getRelatedCaseRelation(caseId)).toBe('Inspector');
        expect(await relatedCasePage.getRelatedCaseStatus(caseId)).toBe('Assigned');
    });

    it('DRDMV-17035: Remove Related Case from Case', async () => {
        //create case 1
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17035_1");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await utilCommon.closePopUpMessage();
        let caseId1: string = await caseViewPage.getCaseID();

        //create case 2
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17035_2");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await utilCommon.closePopUpMessage();
        let caseId2: string = await caseViewPage.getCaseID();

        //create case 3
        await navigationPage.gotCreateCase();
        await createCasePage.selectRequester("Allen");
        await createCasePage.setSummary("DRDMV-17035_3");
        await createCasePage.clickAssignToMeButton();
        await createCasePage.clickSaveCaseButton();
        await createCasePage.clickGoToCaseButton();
        await utilCommon.closePopUpMessage();
        let caseId3: string = await caseViewPage.getCaseID();

        //Add case 1 and case 2 in related cases
        await caseEditPage.navigateToRelatedCasesTab();
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseId1, "Child");
        await relatedCasePage.waitUntilNewRelatedCaseAdded(1);
        await relatedCasePage.addRelatedCases();
        await addRelatedCasespopup.addRelatedCase(caseId2, "Child");
        await relatedCasePage.waitUntilNewRelatedCaseAdded(2);

        //Open Case 1 and Remove the case 1
        await relatedCasePage.openCaseFromRelatedCases(caseId1);
        await caseEditPage.navigateToRelatedCasesTab();
        await relatedCasePage.removeRelatedCase(caseId3);
        await relatedCasePage.waitUntilNewRelatedCaseAdded(0);

        //Open case 3 and verify case1 is not present in Related cases
        await navigationPage.gotoCaseConsole()
        await gridUtil.clearFilter();
        await gridUtil.searchAndOpenHyperlink(caseId3);
        await caseEditPage.navigateToRelatedCasesTab();
        expect(await relatedCasePage.isCasePresent(caseId1)).toBeTruthy();

        //Remove case 2 from case 1 and verify in case 2
        await relatedCasePage.removeRelatedCase(caseId2);
        await navigationPage.gotoCaseConsole()
        await gridUtil.clearFilter();
        await gridUtil.searchAndOpenHyperlink(caseId2);
        await caseEditPage.navigateToRelatedCasesTab();
        expect(await relatedCasePage.isCasePresent(caseId3)).toBeTruthy();
    }, 120 * 1000);
})
