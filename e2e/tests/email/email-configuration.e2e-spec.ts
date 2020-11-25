import { browser } from "protractor";
import apiCoreUtil from '../../api/api.core.util';
import apiHelper from '../../api/api.helper';
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import consoleAcknowledgmentTemplatePo from '../../pageobject/settings/email/console-acknowledgment-template.po';
import consoleEmailConfig from '../../pageobject/settings/email/console-email-configuration.po';
import createAcknowledgmentTemplatesPo from '../../pageobject/settings/email/create-acknowledgment-template.po';
import createEmailConfigPo from '../../pageobject/settings/email/create-email-config.po';
import editAcknowledgmentTemplatePo from '../../pageobject/settings/email/edit-acknowledgment-template.po';
import editEmailConfigPo from '../../pageobject/settings/email/edit-email-config.po';
import editExclusiveSubjectPo from '../../pageobject/settings/email/edit-exclusive-subject.po';
import newExclusiveSubjectPo from '../../pageobject/settings/email/new-exclusive-subject.po';
import { BWF_BASE_URL } from '../../utils/constants';
import utilCommon from '../../utils/util.common';
import utilGrid from '../../utils/util.grid';
import utilityCommon from '../../utils/utility.common';

describe('Email Configuration', () => {
    let offlineSupportGroup, emailID = "bmctemptestemail@gmail.com";
    const businessDataFile = require('../../data/ui/foundation/businessUnit.ui.json');
    const supportGrpDataFile = require('../../data/ui/foundation/supportGroup.ui.json');
    let incomingEmail = {
        'mailBoxName': 'testEmail@gmail.com'
    }

    let emailConfig = {
        email: emailID,
        incomingMailBoxName: incomingEmail.mailBoxName,
    }

    let emailConfigFacilities = {
        email: emailID,
        incomingMailBoxName: incomingEmail.mailBoxName,
        lineOfBusiness: "Facilities"
    }

    let differntEmailConfigFacilities = {
        email: "bwfqa2019@gmail.com",
        incomingMailBoxName: incomingEmail.mailBoxName,
        lineOfBusiness: "Facilities"
    }



    beforeAll(async () => {

        await browser.get(BWF_BASE_URL);
        await loginPage.login("qkatawazi");
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await apiHelper.createEmailBox('incoming',incomingEmail);
        await apiHelper.apiLogin('qkatawazi');
        await apiHelper.createEmailConfiguration(emailConfig);
        await foundationData("Petramco", "BusinessUnitData10410", "SuppGrpData10410");
        await foundationData("Psilon", "BusinessUnitDataPsilon", "SuppGrpDataPsilon");

        offlineSupportGroup = {
            "orgName": "OfflineSupportGroup",
            "relatedOrgId": null,
            "status": "Offline"
        };
        offlineSupportGroup.relatedOrgId = await apiCoreUtil.getBusinessUnitGuid("BusinessUnitData10410");
        await apiHelper.createSupportGroup(offlineSupportGroup);
    });

    afterAll(async () => {
        await apiHelper.apiLogin('tadmin');
        await apiHelper.deleteAllEmailConfiguration();
        await utilityCommon.closeAllBlades();
        await navigationPage.signOut();
    });

    async function foundationData(company: string, businessUnit: string, supportGroup: string) {
        await apiHelper.apiLogin('tadmin');
        let businessData = businessDataFile[businessUnit];
        let suppGrpData = supportGrpDataFile[supportGroup];
        let orgId = await apiCoreUtil.getOrganizationGuid(company);
        businessData.relatedOrgId = orgId;
        let businessUnitId = await apiHelper.createBusinessUnit(businessData);
        await browser.sleep(5000); //waiting fordata to be reflected on UI
        suppGrpData.relatedOrgId = businessUnitId;
        await apiHelper.createSupportGroup(suppGrpData);
        await browser.sleep(9000); //waiting fordata to be reflected on UI
    };

    //ankagraw
    describe('[DRDMV-8528,DRDMV-8527]: [Email Configuration] Verify Email configuration Grid view', async () => {
        it('[DRDMV-8528,DRDMV-8527]: Verify Email configuration header', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            let emailHeaders: string[] = ["Email IDs", "Company", "Status"];
            let add: string[] = ["Company ID", "Display ID", "ID"];
            let newEmailHeaders: string[] = ["Email IDs", "Company", "Company ID", "Status", "Display ID", "ID"];
            expect(await consoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
            await consoleEmailConfig.addHeader(add);
            expect(await consoleEmailConfig.coloumnHeaderMatches(newEmailHeaders)).toBeTruthy();
            await consoleEmailConfig.removeHeader(add);
            expect(await consoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
        });
        it('[DRDMV-8528,DRDMV-8527]: Verify Email configuration header', async () => {
            await consoleEmailConfig.searchAndSelectCheckbox(emailID);
            await consoleEmailConfig.deleteConfigurationEmail();
            await utilCommon.clickOnWarningOk();
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.clickSave();
            expect(await utilCommon.isPopUpMessagePresent("Saved successfully.")).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Verify Email configuration Grid view', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            expect(await newExclusiveSubjectPo.isSaveButtonEnabled()).toBeFalsy();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Verify Email configuration Grid view and add new exclusive', async () => {
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Delete" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("update" + randomStr);
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Set the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('update' + randomStr)).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('update' + randomStr);
            await editEmailConfigPo.editExclusiveSubjectsButton();
            await editExclusiveSubjectPo.setSubject('updated123' + randomStr);
            await editExclusiveSubjectPo.clickSaveButton();
        });
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Verify the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('Delete' + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeFalsy();
        });
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Delete the Email configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.clickCheckBoxOfValueInGrid(emailID);
            await consoleEmailConfig.deleteConfigurationEmail();
            await utilCommon.clickOnWarningOk();
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming',incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);

        });
        it('[DRDMV-8514,DRDMV-8515,DRDMV-8516,DRDMV-8517,DRDMV-8518,DRDMV-8519]: Verify Global Exclusion should be displayed', async () => {
            expect(await utilGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[DRDMV-10438,DRDMV-10437,DRDMV-10436,DRDMV-10552]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let acknowledgementTemplateHeaders: string[] = ["Type", "Operation Type", "Ticket Status", "Template Name"];
        it('[DRDMV-10438,DRDMV-10437,DRDMV-10436,DRDMV-10552]: Verify all templates', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            expect(await editEmailConfigPo.isColumnPresentInAcknowledgementTemplateGrid(acknowledgementTemplateHeaders)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Update"));
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Create"));
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
        });
        it('[DRDMV-10438,DRDMV-10437,DRDMV-10436,DRDMV-10552]: update the delete template', async () => {
            expect(await editEmailConfigPo.isTicketTypeAcknowledgementTemplateDisabled()).toBeTruthy("Ticket Type is enable");
            expect(await editEmailConfigPo.isOperationTypeAcknowledgementTemplateDisabled()).toBeTruthy("Operation Type is enable");
            expect(await editEmailConfigPo.isTicketStatusAcknowledgementTemplateDisabled()).toBeTruthy("Ticket status is enable");
            await editEmailConfigPo.selectAcknowledgementTemplate("Case Create Ack Template");
            await editEmailConfigPo.clickSaveAcknowledgementTemplate();
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid('Case Create Ack Template')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[DRDMV-10461,DRDMV-10763,DRDMV-10458]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        it('[DRDMV-10461,DRDMV-10763,DRDMV-10458]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid("Private" + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeFalsy();
        });
        it('[DRDMV-10461,DRDMV-10763,DRDMV-10458]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
            expect(await editEmailConfigPo.isNewAvailableGlobalSubjectsDisplayed()).toBeTruthy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Private" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Private" + randomStr)).toBeFalsy();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.clickAvailableExclusionSubjectsCheckbox();
            await editEmailConfigPo.clickAssociatedSupportGroupRightArrow();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[DRDMV-10764]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming',incomingEmail);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
            await apiHelper.createEmailConfiguration(differntEmailConfigFacilities);
        });
        it('[DRDMV-10764]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
        });
        it('[DRDMV-10764]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink("bwfqa2019@gmail.com");
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
        });
        it('[DRDMV-10764]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming',incomingEmail);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createEmailConfiguration({ "email": "psilon@gmail.com", "incomingMailBoxName": incomingEmail.mailBoxName, "company": "Psilon" });
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink("psilon@gmail.com");
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
        });
        it('[DRDMV-10764]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await utilGrid.searchRecord("Private" + randomStr);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeFalsy("Private comment is present");
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Private" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Private" + randomStr)).toBeFalsy();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades();
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[DRDMV-10762]: Exclusion Subject: Associate exclusion subject list verification for newly added exclusion subject', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming',incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
        });
        it('[DRDMV-10762]: Add exclusive subject', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        it('[DRDMV-10762]: Exclusion Subject: Associate exclusion subject list verification for newly added exclusion subject', async () => {
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Private" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Private" + randomStr)).toBeFalsy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
        });
    });

    //ankagraw
    describe('[DRDMV-10765,DRDMV-10766]: Exclusion Subject: Associate exclusion subject validation for newly added public subject with newly added email config', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming',incomingEmail);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
        });
        it('[DRDMV-10765,DRDMV-10766]: Add exclusive subject', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows'));
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        it('[DRDMV-10765,DRDMV-10766]: Exclusion Subject: Associate exclusion subject validation for newly added public subject with newly added email config', async () => {
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming',incomingEmail);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createEmailConfiguration({ "email": "psilon@gmail.com", "incomingMailBoxName": incomingEmail.mailBoxName, "company": "Psilon" });

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink("psilon@gmail.com");
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming');
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
        });
    });

    //ankagraw
    describe('[DRDMV-10930,DRDMV-10457,DRDMV-10802,DRDMV-10997,,DRDMV-9037]: Acknowledgment Template: Deletion & status update shouldnt allow when Acknowledgment Template associated with email id', async () => {
        let caseTemplateData, randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        beforeAll(async () => {
            caseTemplateData = {
                "templateName": randomStr + 'caseTemplateName',
                "templateSummary": 'CaseSummaryName' + randomStr,
                "caseStatus": "InProgress",
                "templateStatus": "Active",
                "assignee": "qkatawazi",
                "company": "Petramco",
                "businessUnit": "United States Support",
                "ownerBU": "United States Support",
                "supportGroup": "US Support 3",
                "ownerGroup": "US Support 3"
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateStatus = "Draft";
            caseTemplateData.templateName = randomStr + 'caseTemplateNameDraft'
            await apiHelper.createCaseTemplate(caseTemplateData);
            caseTemplateData.templateStatus = "Inactive";
            caseTemplateData.templateName = randomStr + 'caseTemplateNameInactive'
            await apiHelper.createCaseTemplate(caseTemplateData);
        });
        it('[DRDMV-10930,DRDMV-10457,DRDMV-10802,DRDMV-10997,DRDMV-9037]: Exclusion Subject : Default associated public exclusion subject list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isCreateEmailTemplpateLinkDisplayed()).toBeTruthy();
            expect(await editEmailConfigPo.isDefaultCaseTemplatetoUsePresent(randomStr + 'caseTemplateNameDraft')).toBeFalsy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(randomStr + 'caseTemplateNameInactive')).toBeFalsy();
            await editEmailConfigPo.clearDefaultCaseTemplateToUseField();
            expect(await editEmailConfigPo.isDefaultCaseTemplatePresentinDropDown(randomStr + 'caseTemplateName')).toBeTruthy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent()).toBeFalsy("AvailableExclusionsSubject");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent()).toBeTruthy("AssociatedExclusionsSubject");
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid('Case Closed Ack Template')).toBeTruthy("Coloumn");
        });
        it('[DRDMV-10930,DRDMV-10457,DRDMV-10802,DRDMV-10997,DRDMV-9037]: Acknowledgment Template: Deletion & status update shouldnt allow when Acknowledgment Template associated with email id', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord('Case Closed Ack Template');
            await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
            expect(await utilCommon.isPopUpMessagePresent("ERROR (10000): Template is already in use hence it can not be deleted.")).toBeTruthy("ERROR (10014)");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate('Case Closed Ack Template');
            await editAcknowledgmentTemplatePo.selectStatusDropDown('Inactive');
            await editAcknowledgmentTemplatePo.clickOnSaveButton();
            expect(await utilCommon.isPopUpMessagePresent("ERROR (10006): The Acknowledgement template is in use, so status cannot be changed")).toBeTruthy("ERROR (10006)");
            await editAcknowledgmentTemplatePo.clickOnCancelButton();
            await utilCommon.clickOnWarningOk();
        });
    });

    describe('[DRDMV-9403,DRDMV-9402]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        it('[DRDMV-9403,DRDMV-9402]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {

            let templateData = {
                "templateName": 'GlobalCaseTemplateName' + randomStr,
                "templateSummary": 'GlobalCaseTemplateSummary' + randomStr,
                "resolveCaseonLastTaskCompletion": "1",
                "templateStatus": "Active",
                "company": "- Global -",
                "businessUnit": "United States Support",
                "supportGroup": "US Support 3",
                "assignee": "qkatawazi",
                "ownerBU": 'United States Support',
                "ownerGroup": "US Support 3",
                "caseStatus": "Assigned",
                "description": 'description' + randomStr,
            }
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createCaseTemplate(templateData);
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('GlobaltemplateName' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });

        it('[DRDMV-9403,DRDMV-9402]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('templateName' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilCommon.closePopUpMessage();
        });

        it('[DRDMV-9403,DRDMV-9402]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isDefaultCaseTemplatetoUsePresent("GlobalCaseTemplateName" + randomStr)).toBeTruthy();
            await editEmailConfigPo.clickSaveButton();
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementDropDownPresent('templateName' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isAcknowledgementPresentnDropDown('GlobaltemplateName' + randomStr)).toBeTruthy();
        });
    });

    //ankagraw
    describe('[DRDMV-13584]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
        let trustedMail: string = "test@abc.com"
        it('[DRDMV-13584]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Email Box Console - Business Workflows');
            await utilGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Trusted Email");
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            expect(await editEmailConfigPo.isMappedRequesterRequiredTextPresent()).toBeTruthy();
            expect(await editEmailConfigPo.isNewTrustedEmailRequiredTextPresent()).toBeTruthy();
            await editEmailConfigPo.setNewTrustedEmail(trustedMail);
            expect(await editEmailConfigPo.isNewTrustedEmailSaveBtnDisabled()).toBeTruthy();
            expect(await editEmailConfigPo.isMappedRequesterDropDownPresent("Barney")).toBeFalsy();
            expect(await editEmailConfigPo.isValuePresentInDropDown("Thorn")).toBeFalsy();
            expect(await editEmailConfigPo.isValuePresentInDropDown("Ochoa")).toBeFalsy();
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilCommon.clickOnWarningCancel();
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilCommon.clickOnWarningOk();
        });
        it('[DRDMV-13584]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail(trustedMail);
            await editEmailConfigPo.selectMappedRequesterDropDown("Adam Pavlik");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();
            await editEmailConfigPo.selectAndClickCheckboxOnTrustedEmail(trustedMail);
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailCancelButtonOnTrustedEmail();
            await utilCommon.clickOnWarningCancel();
            await editEmailConfigPo.clickEditTrustedEmailCancelButtonOnTrustedEmail();
            await utilCommon.clickOnWarningOk();
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailSaveButtonOnTrustedEmail();
            expect(await editEmailConfigPo.isRecordPresentonTrustedEmail("Test@xyz.com")).toBeTruthy();
        });
    });
});
