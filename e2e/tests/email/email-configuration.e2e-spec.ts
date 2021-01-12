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

import utilityCommon from '../../utils/utility.common';
import utilityGrid from '../../utils/utility.grid';
let userData1, userData2 = undefined;

describe('Email Configuration', () => {
    let offlineSupportGroup, emailID = "bmctemptestemail@gmail.com";
    let facilitiesEmailID = "bwfqa2019@gmail.com"
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
        await apiHelper.createEmailBox('incoming', incomingEmail);
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

        userData1 = {
            "firstName": "caseBA",
            "lastName": "MultiLOB",
            "userId": "caseBAMultiLOB",
            "userPermission": ["Case Business Analyst", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
        }
        await apiHelper.createNewUser(userData1);
        await apiHelper.associatePersonToCompany(userData1.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData1.userId, "US Support 3");

        userData2 = {
            "firstName": "caseMngr",
            "lastName": "MultiLOB",
            "userId": "caseMngrMultiLOB",
            "userPermission": ["Case Manager", "Foundation Read", "Knowledge Coach", "Knowledge Publisher", "Knowledge Contributor", "Knowledge Candidate", "Case Catalog Administrator", "Person Activity Read", "Human Resource", "Facilities"]
        }
        await apiHelper.createNewUser(userData2);
        await apiHelper.associatePersonToCompany(userData2.userId, "Petramco");
        await apiHelper.associatePersonToSupportGroup(userData2.userId, "US Support 3");

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
    describe('[5463,5464]: [Email Configuration] Verify Email configuration Grid view', async () => {
        it('[5463,5464]: Verify Email configuration header', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            let emailHeaders: string[] = ["Email IDs", "Company", "Status"];
            let add: string[] = ["Company ID", "Display ID", "ID"];
            let newEmailHeaders: string[] = ["Email IDs", "Company", "Company ID", "Status", "Display ID", "ID"];
            expect(await consoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
            await consoleEmailConfig.addHeader(add);
            expect(await consoleEmailConfig.coloumnHeaderMatches(newEmailHeaders)).toBeTruthy();
            await consoleEmailConfig.removeHeader(add);
            expect(await consoleEmailConfig.coloumnHeaderMatches(emailHeaders)).toBeTruthy();
        });
        it('[5463,5464]: Verify Email configuration header', async () => {
            await consoleEmailConfig.searchAndSelectCheckbox(emailID);
            await consoleEmailConfig.deleteConfigurationEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setDescription("test ");
            await createEmailConfigPo.selectStatus("Active");
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.clickSave();
            expect(await utilityCommon.isPopUpMessagePresent("Saved successfully.")).toBeTruthy();
        });
        it('[5463,5464]: Verify email configuration is accessible to Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email Configuration for Human resource LOB are not displayed to the Case Manager of same LOB');
        });
        it('[5463,5464]: Verify email configuration is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB are not displayed to the Case Manager of Facilities LOB');
        });
        it('[5463,5464]: Verify email configuration is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB are not displayed to the Case Manager of Facilities LOB');

        });
        it('[5463,5464]: Verify email configuration are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB is not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email Configuration for Human resource LOB is not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');

        });
        it('[5463,5464]: Verify email configuration are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email Configuration for Human resource LOB are not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');

            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy('Email Configuration for Human resource LOB is not displayed to the Case Manager havign access to multiple LOBs (Human Resource, Facilities)');
        });
        it('[5463,5464]: create same name record in same LOB', async () => {
            //create same name record in same LOB
            await navigationPage.signOut();
            await loginPage.login('jbarnes');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setEmailID(emailID);
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.setDescription("test");
            await createEmailConfigPo.clickSave();
            expect(await utilityCommon.isPopUpMessagePresent('ERROR (10000): The alternate email IDs are already used. Specify different alternate email IDs.')).toBeTruthy("Error message absent");
            await createEmailConfigPo.clickCancel();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[5463,5464]: create same name record in different LOB', async () => {
            //create same name record in different LOB
            let facilitiesEmail = "facilitymail@gmail.com"
            await utilityGrid.selectLineOfBusiness('Facilities');
            await consoleEmailConfig.clickNewEmailConfiguration();
            await createEmailConfigPo.selectCompany("Petramco");
            await createEmailConfigPo.setEmailID(facilitiesEmail);
            await createEmailConfigPo.selectIncomingMailBoxName(incomingEmail.mailBoxName);
            await createEmailConfigPo.setDescription("test");
            // verify LOB is there
            expect(await createEmailConfigPo.getLobValue()).toBe("Facilities");
            await createEmailConfigPo.clickSave();
            // expect(await utilityCommon.isPopUpMessagePresent('Saved successfully.')).toBeTruthy("Success message absent"); SUCCESS MESSAGE IS NOT PRESENT ON UI
            // open the record and verify LOB is on edit screen
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmail);
            expect(await editEmailConfigPo.getLobValue()).toBe("Facilities");
            await editEmailConfigPo.cancelEditEmailConfig();
            await utilityGrid.selectLineOfBusiness('Human Resource');
        });
        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5474,5473,5472,5471,5470,5469]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let randomStr = [...Array(4)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        it('[5474,5473,5472,5471,5470,5469]: Verify Email configuration Grid view', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            expect(await newExclusiveSubjectPo.isSaveButtonEnabled()).toBeFalsy();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify Email configuration Grid view and add new exclusive', async () => {
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Delete" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("update" + randomStr);
            await newExclusiveSubjectPo.clickSaveButton();
        });
        it('[5474,5473,5472,5471,5470,5469]: Set the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('update' + randomStr)).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid('update' + randomStr);
            await editEmailConfigPo.editExclusiveSubjectsButton();
            await editExclusiveSubjectPo.setSubject('updated123' + randomStr);
            await editExclusiveSubjectPo.clickSaveButton();
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify the exclusion details ', async () => {
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid('Delete' + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Delete' + randomStr)).toBeFalsy();
        });
        it('[5474,5473,5472,5471,5470,5469]: Delete the Email configuration', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.clickCheckBoxOfValueInGrid(emailID);
            await consoleEmailConfig.deleteConfigurationEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(differntEmailConfigFacilities);
        });
        it('[5474,5473,5472,5471,5470,5469]: Verify Global Exclusion should be displayed', async () => {
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
        });


        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to same LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy('Exclusion subject is not displayed on Human Resource email configuration to Case manager user');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy('Exclusion subject is not displayed on Human Resource email configuration to Case manager user');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to different LOB Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email configuration for Human Resource LOB is displayed to Facilities LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(facilitiesEmailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeFalsy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');

        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to different LOB Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy('Email configuration for Human Resource LOB is displayed to Facilities LOB case BA');
            expect(await utilityGrid.isGridRecordPresent(facilitiesEmailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeFalsy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy('Exclusion subjects from Human Resource email configuration are displayed to Facilities email configuration');
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to Case BA belonging to different company with same LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            expect(await utilityGrid.isGridRecordPresent(facilitiesEmailID)).toBeFalsy();
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to Case Manager user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeFalsy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
        });

        it('[5474,5473,5472,5471,5470,5469]: Verify if exclusion subjects on email config are accessible to Case BA user having access to multiple LOB', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeTruthy();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeTruthy();
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(emailID)).toBeFalsy();
            await utilityGrid.searchAndOpenHyperlink(facilitiesEmailID);
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Global' + randomStr)).toBeFalsy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('updated123' + randomStr)).toBeFalsy();
        });

        afterAll(async () => {
            await utilityCommon.closeAllBlades(); // escape is working on these settings pages
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });
    });

    //ankagraw
    describe('[5257,5258,5259,5232]: [Email Configuration] Verify Email configuration Grid view', async () => {
        let acknowledgementTemplateHeaders: string[] = ["Type", "Operation Type", "Ticket Status", "Template Name"];
        it('[5257,5258,5259,5232]: Verify all templates', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            expect(await editEmailConfigPo.isColumnPresentInAcknowledgementTemplateGrid(acknowledgementTemplateHeaders)).toBeTruthy();
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Update"));
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid("Create"));
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
        });
        it('[5257,5258,5259,5232]: update the delete template', async () => {
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
    describe('[5249,5182,5250]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        it('[5249,5182,5250]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid("Private" + randomStr);
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid("Private" + randomStr)).toBeFalsy();
        });
        it('[5249,5182,5250]: Exclusion Subject: Re-add Deleted public exclusion subject', async () => {
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
    describe('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
            await apiHelper.createEmailConfiguration(differntEmailConfigFacilities);
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Private" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.clickSaveButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink("bwfqa2019@gmail.com");
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Out Of Office");
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeFalsy();
            await editEmailConfigPo.searchAvailableEntitiesToBeAssociated("Out Of Office");
            expect(await editEmailConfigPo.isValueAvailableExclusionsSubjectInAssociatePublicExclusionSubjectsPresent('Out Of Office')).toBeTruthy();
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createEmailConfiguration({ "email": "psilon@gmail.com", "incomingMailBoxName": incomingEmail.mailBoxName, "company": "Psilon" });
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink("psilon@gmail.com");
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeTruthy();
            await utilityGrid.clickCheckBoxOfValueInGrid('Out Of Office');
            await editEmailConfigPo.removeExclusiveSubjectsButton();
            expect(await editEmailConfigPo.isRecordPresentInExclusiveGrid('Out Of Office')).toBeFalsy();
        });
        it('[5181]: Exclusion Subject: Available exclusion subject list for multiple email configurations of same & different companies', async () => {
            await utilityGrid.searchRecord("Private" + randomStr);
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
    describe('[5183]: Exclusion Subject: Associate exclusion subject list verification for newly added exclusion subject', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('qkatawazi');
            await apiHelper.createEmailConfiguration(emailConfig);
        });
        it('[5183]: Add exclusive subject', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        it('[5183]: Exclusion Subject: Associate exclusion subject list verification for newly added exclusion subject', async () => {
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
    describe('[5180,5179]: Exclusion Subject: Associate exclusion subject validation for newly added public subject with newly added email config', async () => {
        let randomStr = Math.floor(Math.random() * 1000000);
        beforeAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('fritz');
            await apiHelper.createEmailConfiguration(emailConfigFacilities);
        });
        it('[5180,5179]: Add exclusive subject', async () => {
            await navigationPage.gotoSettingsPage();
            expect(await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows'));
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.clickNewExclusiveSubjectsButton();
            await newExclusiveSubjectPo.setSubject("Global" + randomStr);
            await newExclusiveSubjectPo.setSortOrder('20');
            await newExclusiveSubjectPo.selectGlobal("True");
            await newExclusiveSubjectPo.clickSaveButton();
            await editEmailConfigPo.clickNewAvailableGlobalSubjects();
            await editEmailConfigPo.searchAssociatedEntitiesToBeRemoveAssociation("Global" + randomStr);
            expect(await editEmailConfigPo.isValueAssociatedExclusionsSubjectInAssociatePublicExclusionSubjectsPresent("Global" + randomStr)).toBeTruthy();
        });
        it('[5180,5179]: Exclusion Subject: Associate exclusion subject validation for newly added public subject with newly added email config', async () => {
            await editEmailConfigPo.closedAssociatePublicExclusionSubjects();
            await navigationPage.signOut();
            await loginPage.login('gwixillian');
            await apiHelper.apiLogin('tadmin');
            await apiHelper.deleteAllEmailConfiguration();
            await apiHelper.createEmailBox('incoming', incomingEmail);
            await apiHelper.apiLogin('gwixillian');
            await apiHelper.createEmailConfiguration({ "email": "psilon@gmail.com", "incomingMailBoxName": incomingEmail.mailBoxName, "company": "Psilon" });

            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink("psilon@gmail.com");
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
    describe('[5114,5251,5168,5104,5382]: Acknowledgment Template: Deletion & status update shouldnt allow when Acknowledgment Template associated with email id', async () => {
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
        it('[5114,5251,5168,5104,5382]: Exclusion Subject : Default associated public exclusion subject list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
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
            expect(await editEmailConfigPo.isRecordPresentInAcknowledgementTemplateGrid('Case Closed Ack Template')).toBeTruthy("'Case Closed Ack Template' record not present");
        });
        it('[5114,5251,5168,5104,5382]: Acknowledgment Template: Deletion & status update shouldnt allow when Acknowledgment Template associated with email id', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.searchAndSelectGridRecord('Case Closed Ack Template');
            await consoleAcknowledgmentTemplatePo.clickOnDeleteButton();
            expect(await utilityCommon.isPopUpMessagePresent("ERROR (10000): Template is already in use hence it can not be deleted.")).toBeTruthy("ERROR (10014)");
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.searchAndOpenAcknowledgmentTemplate('Case Closed Ack Template');
            await editAcknowledgmentTemplatePo.selectStatusDropDown('Inactive');
            await editAcknowledgmentTemplatePo.clickOnSaveButton();
            expect(await utilityCommon.isPopUpMessagePresent("ERROR (10006): The Acknowledgement template is in use, so status cannot be changed")).toBeTruthy("ERROR (10006)");
            await editAcknowledgmentTemplatePo.clickOnCancelButton();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
    });

    describe('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
        let templateData, randomStr = Math.floor(Math.random() * 1000000);
        it('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {

            templateData = {
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
            await createAcknowledgmentTemplatesPo.setTemplateName(templateData.templateName);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('companytemplateName' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });
        it('[5336,5337]: Add new acknowledgment template & Verify its getting pulled in email configuration acknowledgement template list', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectDefaultCaseTemplate(templateData.templateName);
            await editEmailConfigPo.clickSaveButton();
            await utilityCommon.closeAllBlades();
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementDropDownPresent('companytemplateName' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown(templateData.templateName)).toBeTruthy();
        });

        it('[5336,5337]: Verify acknowledgment template is accessible to Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('qdu');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy('Global Email Acknowledgement template for Human resource LOB are not displayed to the Case Manager of same LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Human resource LOB are not displayed to the Case Manager of same LOB');
        });

        it('[5336,5337]: Verify acknowledgment template is accessible to other Line of business Case BA', async () => {
            await navigationPage.signOut();
            await loginPage.login('fritz');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');

            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('FacilitiesGlobalAckTemplate' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('- Global -');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();

            await consoleAcknowledgmentTemplatePo.clickOnAddAcknowlegeTemplateButton();
            await createAcknowledgmentTemplatesPo.setTemplateName('FacilitiesAckTemplate' + randomStr);
            await createAcknowledgmentTemplatesPo.selectCompanyDropDown('Petramco');
            await createAcknowledgmentTemplatesPo.selectStatusDropDown('Active');
            await createAcknowledgmentTemplatesPo.setDescription('description');
            await createAcknowledgmentTemplatesPo.setSubject('subject');
            await createAcknowledgmentTemplatesPo.clickOnSaveButton();
            await utilityCommon.closePopUpMessage();
        });

        it('[5336,5337]: Verify acknowledgment template is accessible to other Line of business Case Manager', async () => {
            await navigationPage.signOut();
            await loginPage.login('frieda');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case manager of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case manager of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeTruthy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case manager of same LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case manager of same LOB');
        });

        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseBAMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeTruthy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');
        });
        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy('Global Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeFalsy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');

        });
        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementDropDownPresent('companytemplateName' + randomStr)).toBeTruthy();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown(templateData.templateName)).toBeTruthy();
        });

        it('[5336,5337]: Verify acknowledgment template are accessible to Case BA user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
            await editEmailConfigPo.selectTab("Acknowledgment Templates");
            await editEmailConfigPo.searchAndClickCheckboxOnAcknowledgementTemplateGrid("Closed");
            await editEmailConfigPo.clickAcknowledgementTemplateEditButton();
            expect(await editEmailConfigPo.isAcknowledgementDropDownPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeFalsy();
            expect(await editEmailConfigPo.isAcknowledgementPresentInDropDown('FacilitiesAckTemplate'+ randomStr)).toBeFalsy();
        });

        it('[5336,5337]: Verify acknowledgment template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await navigationPage.signOut();
            await loginPage.login('caseMngrMultiLOB@petramco.com', 'Password_1234');
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Acknowledgment Templates', 'Email Ack Template Console - Business Workflows');
            await utilityGrid.selectLineOfBusiness('Facilities');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeFalsy('Global Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Human Resource LOB are displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeTruthy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human Resource LOB');

        });
        it('[5336,5337]: Verify acknowledgment template are accessible to Case Manager user who has access to multiple (HR,Facilities) LOBs', async () => {
            await utilityGrid.selectLineOfBusiness('Human Resource');
            expect(await utilityGrid.isGridRecordPresent(templateData.templateName)).toBeTruthy('Global Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('companytemplateName' + randomStr)).toBeTruthy('Company specific Email Acknowledgement template for Human resource LOB are not displayed to the Case BA of Facilities LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesGlobalAckTemplate' + randomStr)).toBeFalsy('Global Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');
            expect(await utilityGrid.isGridRecordPresent('FacilitiesAckTemplate' + randomStr)).toBeFalsy('Company specific Email Acknowledgement template for Facilities LOB are displayed to the Case BA of Human resource LOB');
        });

        afterAll(async () => {
            await navigationPage.signOut();
            await loginPage.login('qkatawazi');
        });

    });

    //ankagraw
    describe('[4707]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
        let trustedMail: string = "test@abc.com"
        it('[4707]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
            await navigationPage.gotoSettingsPage();
            await navigationPage.gotoSettingsMenuItem('Email--Configuration', 'Configuration - Settings - Business Workflows');
            await utilityGrid.searchAndOpenHyperlink(emailID);
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
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            await editEmailConfigPo.clickNewTrustedEmailCancelBtn();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
        });
        it('[4707]: Email - UI validation of Add/Edit Email Sender Mapping views', async () => {
            await editEmailConfigPo.clickAddTrustedEmailBtn();
            await editEmailConfigPo.setNewTrustedEmail(trustedMail);
            await editEmailConfigPo.selectMappedRequesterDropDown("Adam Pavlik");
            await editEmailConfigPo.clickNewTrustedEmailSaveBtn();
            await editEmailConfigPo.selectAndClickCheckboxOnTrustedEmail(trustedMail);
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailCancelButtonOnTrustedEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('No');
            await editEmailConfigPo.clickEditTrustedEmailCancelButtonOnTrustedEmail();
            await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
            await editEmailConfigPo.clickEditTrustedEmailButtonOnTrustedEmail();
            await editEmailConfigPo.setEmailOnEditTrustedEmail("Test@xyz.com");
            await editEmailConfigPo.clickEditTrustedEmailSaveButtonOnTrustedEmail();
            expect(await editEmailConfigPo.isRecordPresentonTrustedEmail("Test@xyz.com")).toBeTruthy();
        });
    });
});
