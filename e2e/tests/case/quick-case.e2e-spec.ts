import { browser, $, protractor, ProtractorExpectedConditions } from "protractor";
import navigationPage from "../../pageobject/navigation.po";
import quickCase from "../../pageobject/case/quick-case.po";
import loginPage from "../../pageobject/login.po"

import { async } from 'q';
import { Alert } from 'selenium-webdriver';

describe("Quick Case",()=>{
    const EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    const requester="Requester";
    const contact = "Contact";

    beforeAll(async () => {
        browser.waitForAngularEnabled(false);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa');
        await loginPage.login("qkatawazi");
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('DRDMV-18972: Populating fields in Quick Case if only Required parameter is specified',async()=>{
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18972';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=PET000000000484&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester1);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy;
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=+61288992922&desc=&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toEqual(caseData[expectedJsonName].requester2);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy();
    })

    it('DRDMV-18973: Populating fields in Quick Case when all parameters are specified',async()=>{
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18973';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=PET000000000484');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser@petramco.com');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=+14085719604');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu@petramco.com&desc=Change my Last Name&contact=tesser');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
    })

    it('DRDMV-18980: Populating fields in Quick Case with Required and one optional parameter',async()=>{
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18980';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=Change my Last Name&contact');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=&contact=+14085719604');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.validatePersonAndHisRelation(contact)).toBe(caseData[expectedJsonName].contact);
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qdu&desc=Change my Last Name&contact=');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester2);
        await expect(quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    })

    it('DRDMV-18977: [-ve] Populating fields in Quick Case if Required parameter is empty',async()=>{
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=Change my Last Name&contact=PET000000000484');
        await quickCase.verifyQuickCasePageAsEmpty();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=Change my Last Name&contact=');
        await quickCase.verifyQuickCasePageAsEmpty();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=&contact=PET000000000484');
        await quickCase.verifyQuickCasePageAsEmpty();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=&desc=&contact=');
        await quickCase.verifyQuickCasePageAsEmpty();
    })

    it('DRDMV-18983: [-ve] Populating fields in Quick Case if Required parameter is empty',async()=>{
        let caseData = require('../../data/ui/case/case.ui.json');
        let expectedJsonName = 'caseData_DRDMV18983';
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=Test1&desc=Change my Last Name&contact=qliu');
        await browser.sleep(2000);
        await expect(quickCase.getPopUpMessage()).toContain(caseData[expectedJsonName].warningMsg);
        await quickCase.verifyQuickCasePageAsEmpty();
        await expect(quickCase.isCreateButtonDisabled).toBeTruthy();
        await browser.get('/innovationsuite/index.html#/com.bmc.dsm.bwfa/quickcase?customer=qliu&desc=Change my Last Name&contact=test1');
        await expect(quickCase.validatePersonAndHisRelation(requester)).toBe(caseData[expectedJsonName].requester);
        await expect(quickCase.isSummOrDescPopulatedAtSmartTextArea(caseData[expectedJsonName].description)).not.toBe(-1);
    })

})