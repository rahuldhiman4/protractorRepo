import axios, { AxiosResponse } from "axios";
import { IBusinessUnit } from '../data/api/interface/business.unit.interface.api';
import { IDepartment } from '../data/api/interface/department.interface.api';
import { IKnowledgeArticles } from '../data/api/interface/knowledge.articles.interface.api';
import { IPerson } from '../data/api/interface/person.interface.api';
import { ISupportGroup } from '../data/api/interface/support.group.interface.api';
import { ITaskTemplate } from '../data/api/interface/task.template.interface.api';
import { browser } from 'protractor';
import { default as apiCoreUtil, default as coreApi } from "../api/api.core.util";
import { CasePriority, CaseStatus, CaseTemplate, Knowledge, MenuItemStatus, NotificationType, ProcessLibConf, TaskTemplate } from "../api/constant.api";
import { NEW_PROCESS_LIB } from '../data/api/flowset/create-process-lib';
import { ICaseAssignmentMapping } from "../data/api/interface/case.assignment.mapping.interface.api";
import { ICaseTemplate } from "../data/api/interface/case.template.interface.api";
import { IDomainTag } from '../data/api/interface/domain.tag.interface.api';
import { IEmailTemplate } from '../data/api/interface/email.template.interface.api';
import { IFlowset, IProcessLibConfig } from '../data/api/interface/flowset.interface.api';
import { IMenuItem } from '../data/api/interface/menu.Items.interface.api';
import { INotesTemplate } from '../data/api/interface/notes.template.interface.api';
import { FLAG_UNFLAG_KA } from '../data/api/knowledge/flag-unflag.data.api';
import { AUTOMATED_CASE_STATUS_TRANSITION } from '../data/api/shared-services/process.data.api';
import { ONE_TASKFLOW, TWO_TASKFLOW_PARALLEL, TWO_TASKFLOW_SEQUENTIAL } from '../data/api/task/taskflow.process.data.api';
import { DOC_LIB_DRAFT, DOC_LIB_PUBLISH, DOC_LIB_READ_ACCESS } from '../data/api/ticketing/document-library.data.api';
import { IDocumentLib } from '../data/api/interface/doc.lib.interface.api';
import { IKnowledgeSet } from '../data/api/interface/knowledge-set.interface.api';
import { KnowledegeSet_ASSOCIATION, KNOWLEDGE_SET, KNOWLEDGESET_PERMISSION } from '../data/api/knowledge/knowledge-set.data.api';
import { IknowledgeSetPermissions } from '../data/api/interface/knowledge-set.permissions.interface.api';
import { KNOWLEDGEARTICLE_TEMPLATE } from '../data/api/knowledge/knowledge-article.template.api';
import {INCOMINGMAIL,EMAILCONFIG,OUTGOINGEMAIL} from '../data/api/email/email.configuration.data.api';
import {EMAIL_WHITELIST} from '../data/api/email/email.whitelist.data.api';
import { CASE_TEMPLATE_PAYLOAD, CASE_TEMPLATE_STATUS_UPDATE_PAYLOAD } from '../data/api/case/case.template.data.api';
axios.defaults.baseURL = browser.baseUrl;
axios.defaults.headers.common['X-Requested-By'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
const commandUri = 'api/rx/application/command';
const articleTemplateUri = 'api/com.bmc.dsm.knowledge/rx/application/article/template';

export interface IIDs {
    id: string;
    displayId: string;
}

export interface EmailGUIDs {
    incomingMailGUID: string;
    outGoingMailGUID: string;
    emailConfigurationEmailGUID: String;
}

class ApiHelper {

    async apiLogin(user: string): Promise<void> {
        let loginJson = await require('../data/userdata.json');
        let username: string = await loginJson[user].userName;
        let password: string = await loginJson[user].userPassword;
        let response = await axios.post(
            "api/rx/authentication/loginrequest",
            { "userName": username, "password": password },
        )
        console.log('Login API Status =============>', response.status);
        axios.defaults.headers.common['Cookie'] = `AR-JWT=${response.data}`;
    }

    async apiLoginWithCredential(user: string, password: string): Promise<void> {
        let response = await axios.post(
            "api/rx/authentication/loginrequest",
            { "userName": user, "password": password },
        )
        console.log('Login API Status =============>', response.status);
        axios.defaults.headers.common['Cookie'] = `AR-JWT=${response.data}`;
    }

    async createCase(data: any): Promise<IIDs> {
        const newCase = await axios.post(
            "api/com.bmc.dsm.case-lib/cases",
            data
        );
        console.log('Create Case API Status =============>', newCase.status);
        const caseDetails = await axios.get(
            newCase.headers.location
        );
        console.log('New Case Details API Status =============>', caseDetails.status);

        return {
            id: caseDetails.data.id,
            displayId: caseDetails.data.displayId
        };
    }

    async createDomainTag(data: IDomainTag): Promise<string> {
        let domainTagGuid = await coreApi.getDomainTagGuid(data.domainTagName);
        if (domainTagGuid == null) {
            let domainTagFile = await require('../data/api/foundation/domainTag.api.json');
            let domainTagData = await domainTagFile.DomainTag;

            domainTagData.fieldInstances[8].value = data.domainTagName;
            let newDomainTag: AxiosResponse = await coreApi.createRecordInstance(domainTagData);

            console.log('Create Domain Tag Status =============>', newDomainTag.status);
            const domainTagDetails = await axios.get(
                await newDomainTag.headers.location
            );

            console.log('New Domain Tag API Status =============>', domainTagDetails.status);

            //Once Domain Tag is created, make it active
            let domainConfigFile = await require('../data/api/shared-services/domainConfiguration.api.json');
            let domainConfigData = await domainConfigFile.DomainConfiguration;

            domainConfigData.fieldInstances[450000152].value = domainTagDetails.data.id;
            let newDomainConfig: AxiosResponse = await coreApi.createRecordInstance(domainConfigData);

            console.log('Active Domain Configuration Status =============>', newDomainConfig.status);
            const domainConfigDetails = await axios.get(
                await newDomainConfig.headers.location
            );

            console.log('New Domain Config API Status =============>', domainConfigDetails.status);

            //Returning the new Domain Tag created
            return domainTagDetails.data.id;
        }
        else {
            console.log('Domain Tag already exists =============>', domainTagGuid);
            return domainTagGuid;
        }
    }

    async createDyanmicDataOnTemplate(templateGuid: string, payloadName: string): Promise<void> {
        let templateDynamicDataFile = await require('../data/api/ticketing/dynamic.data.api.json');
        let templateData = await templateDynamicDataFile[payloadName];
        templateData['templateId'] = templateGuid;
        let newCaseTemplate: AxiosResponse = await coreApi.createDyanmicData(templateData);
        console.log('Create Dynamic on Template API Status =============>', newCaseTemplate.status);
    }
    
    async createEmailConfiguration(): Promise<EmailGUIDs> {
        let incomingMailBox = INCOMINGMAIL;
        let emailMailBox = EMAILCONFIG;
        let outGoingMailBox = OUTGOINGEMAIL;
        let incomingMail: AxiosResponse = await coreApi.createRecordInstance(incomingMailBox);
        console.log('Configure Incoming Email API Status =============>', incomingMail.status);
        let outgoing: AxiosResponse = await coreApi.createRecordInstance(outGoingMailBox);
        console.log('Configure Outgoing Email API Status =============>', outgoing.status);
        let emailConfiguration: AxiosResponse = await coreApi.createRecordInstance(emailMailBox);
        console.log('Configure Email Configuration API Status =============>', emailConfiguration.status);
        const incomingEmailGUID = await axios.get(
            await incomingMail.headers.location
        );
        const outGoingGUID = await axios.get(
            await outgoing.headers.location
        );
        const emailConfigurationGUID = await axios.get(
            await emailConfiguration.headers.location
        );
        return {
            incomingMailGUID: incomingEmailGUID.data.id,
            outGoingMailGUID: outGoingGUID.data.id,
            emailConfigurationEmailGUID: emailConfigurationGUID.data.id
        };
    }

    async getHTMLBodyOfEmail(emailSubject: string): Promise<string> {
        return await coreApi.getEmailHTMLBody(emailSubject);
    }

    async deleteIncomingOrOutgoingEmailConfiguration(emailGUID: string): Promise<boolean> {
        return await coreApi.deleteRecordInstance('AR System Email Mailbox Configuration', emailGUID);
    }

    async deleteEmailConfiguration(emailConfigGUID: string) {
        return await coreApi.deleteRecordInstance('com.bmc.dsm.email-lib:Email Box Registration', emailConfigGUID);
    }

    async updateEmailWhiteList(emailTag: string, domainName: string): Promise<boolean> {
        let emailwhiteListData = EMAIL_WHITELIST;
        emailwhiteListData.fieldInstances[18301].value = emailTag;
        emailwhiteListData.fieldInstances[18303].value = domainName;
        let updateEmail = await coreApi.updateRecordInstance('com.bmc.arsys.rx.environment-configuration:EmailWhiteListConfiguration', 'AGGADG1AANVNMAPKRHEJP9UCTR5FHR', emailwhiteListData);
        return updateEmail.status == 204;
    }

    async createCaseTemplate(data: ICaseTemplate): Promise<IIDs> {
        let templateDataFile = CASE_TEMPLATE_PAYLOAD;
        let templateData = await templateDataFile.CaseTemplateData;
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[7].value = CaseTemplate[data.templateStatus];
        templateData.fieldInstances[301566300].value = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : templateData.fieldInstances[1000000001].value;
        if (data.ownerGroup) {
            let ownerSupportGroup = await coreApi.getSupportGroupGuid(data.ownerGroup);
            templateData.fieldInstances[300287900].value = ownerSupportGroup;
        }
        if (data.caseStatus) {
            let statusValue = CaseStatus[data.caseStatus];
            let caseTemplateStatus = {
                "id": "450000021",
                "value": `${statusValue}`
            }
            templateData.fieldInstances["450000021"] = caseTemplateStatus;

        }
        if (data.categoryTier1) {
            let category1Value = await coreApi.getCategoryGuid(data.categoryTier1);
            templateData.fieldInstances["1000000063"].value = category1Value;

        }
        if (data.categoryTier2) {
            let category2Value = await coreApi.getCategoryGuid(data.categoryTier2);
            templateData.fieldInstances["1000000064"].value = category2Value;

        }
        if (data.categoryTier3) {
            let category3Value = await coreApi.getCategoryGuid(data.categoryTier3);
            templateData.fieldInstances["1000000065"].value = category3Value;
        }
        if (data.casePriority) {
            let priorityValue = CasePriority[data.casePriority];
            let priorityObj = {
                "id": "1000000164",
                "value": `${priorityValue}`
            }
            templateData.fieldInstances["1000000164"] = priorityObj;
        }
        if (data.assignee) {
            let assignee = await coreApi.getPersonGuid(data.assignee);
            let caseTemplateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = caseTemplateDataAssignee;
        }
        if (data.supportGroup) {
            let companyGuid = await coreApi.getOrganizationGuid(data.company);
            let caseTemplateDataSupportCompany = {
                "id": 450000154,
                "value": `${companyGuid}`
            }
            templateData.fieldInstances["450000154"] = caseTemplateDataSupportCompany;
            let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.supportGroup);
            let caseTemplateDataSupportAssignee = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = caseTemplateDataSupportAssignee;
        }
        if (data.resolveCaseonLastTaskCompletion) {
            let caseTemplateDataresolveCaseonLastTaskCompletion = {
                "id": 450000166,
                "value": `${data.resolveCaseonLastTaskCompletion}`
            }
            templateData.fieldInstances["450000166"] = caseTemplateDataresolveCaseonLastTaskCompletion;
        }
        let newCaseTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);
        console.log('Create Case Template API Status =============>', newCaseTemplate.status);
        const caseTemplateDetails = await axios.get(
            await newCaseTemplate.headers.location
        );
        console.log('New Case Template Details API Status =============>', caseTemplateDetails.status);

        return {
            id: caseTemplateDetails.data.id,
            displayId: caseTemplateDetails.data.displayId
        };
    }

    async updateCaseTemplateStatus(caseTemplateGuid: string, status: string): Promise<number> {
        let updateStatusPayload = CASE_TEMPLATE_STATUS_UPDATE_PAYLOAD;
        updateStatusPayload.id = caseTemplateGuid;
        updateStatusPayload.fieldInstances[7].value = CaseTemplate[status];
        let updateCaseStatus = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, updateStatusPayload);
        return updateCaseStatus.status;
    }

    async createCaseAssignmentMapping(data: ICaseAssignmentMapping): Promise<IIDs> {
        let assignmentMappingDataFile = await require('../data/api/case/case.assignment.api.json');
        let assignmentMappingData = await assignmentMappingDataFile.CaseAssignmentMappingData;
        assignmentMappingData.fieldInstances[8].value = data.assignmentMappingName;
        assignmentMappingData.fieldInstances[1000001437].value = data.assignmentMappingName;
        assignmentMappingData.fieldInstances[1000000001].value = await apiCoreUtil.getOrganizationGuid(data.company);
        assignmentMappingData.fieldInstances[450000153].value = await apiCoreUtil.getOrganizationGuid(data.supportCompany);
        assignmentMappingData.fieldInstances[1000000217].value = await apiCoreUtil.getSupportGroupGuid(data.supportGroup);
        if (data.flowset) {
            let flowsetGuid = await coreApi.getFlowsetGuid(data.flowset);
            assignmentMappingData.fieldInstances.push = flowsetGuid;
        }
        if (data.categoryTier1) {
            let category1Guid = await coreApi.getCategoryGuid(data.categoryTier1);
            assignmentMappingData.fieldInstances[1000000063].value = category1Guid;
        }
        if (data.categoryTier2) {
            let category2Guid = await coreApi.getCategoryGuid(data.categoryTier2);
            assignmentMappingData.fieldInstances[1000000064].value = category2Guid;
        }
        if (data.categoryTier3) {
            let category3Guid = await coreApi.getCategoryGuid(data.categoryTier3);
            assignmentMappingData.fieldInstances[1000000065].value = category3Guid;
        }
        if (data.categoryTier4) {
            let category4Guid = await coreApi.getCategoryGuid(data.categoryTier4);
            assignmentMappingData.fieldInstances[450000158].value = category4Guid;
        }
        if (data.label) {
            let labelGuid = await coreApi.getLabelGuid(data.label);
            assignmentMappingData.fieldInstances[450000159].value = labelGuid;
        }
        if (data.region) {
            let regionGuid = await coreApi.getRegionGuid(data.region);
            assignmentMappingData.fieldInstances[450000157].value = regionGuid;
        }
        if (data.site) {
            let siteGuid = await coreApi.getSiteGuid(data.site);
            assignmentMappingData.fieldInstances[450000156].value = siteGuid;
        }
        if (data.businessUnit) {
            let businessUnitGuid = await coreApi.getBusinessUnitGuid(data.businessUnit);
            assignmentMappingData.fieldInstances[450000381].value = businessUnitGuid;
        }
        if (data.department) {
            let departmentGuid = await coreApi.getDepartmentGuid(data.department);
            assignmentMappingData.fieldInstances[450000371].value = departmentGuid;
        }
        if (data.assignee) {
            let assigneeGuid = await coreApi.getPersonGuid(data.assignee);
            assignmentMappingData.fieldInstances[450000152].value = assigneeGuid;
        }
        if (data.priority) {
            let priorityValue = CasePriority[data.priority];
            assignmentMappingData.fieldInstances["1000000164"].value = priorityValue;
        }
        if (data.useAsDefault) {
            let defaultValue = data.useAsDefault ? "1" : "0";
            assignmentMappingData.fieldInstances["450000001"].value = defaultValue;
        }

        let newCaseAssignmentMapping: AxiosResponse = await coreApi.createRecordInstance(assignmentMappingData);
        console.log('Create Case Assignment Mapping API Status =============>', newCaseAssignmentMapping.status);
        const caseAssignmentMappingDetails = await axios.get(
            await newCaseAssignmentMapping.headers.location
        );
        console.log('New Case Assignment Mapping Details API Status =============>', caseAssignmentMappingDetails.status);

        return {
            id: caseAssignmentMappingDetails.data.id,
            displayId: caseAssignmentMappingDetails.data.displayId
        };
    }

    async createManualTaskTemplate(data: ITaskTemplate): Promise<IIDs> {
        let templateDataFile = await require('../data/api/task/task.template.api.json');
        let templateData = await templateDataFile.ManualTaskTemplate;
        templateData.fieldInstances[7].value = TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[301566300].value = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : templateData.fieldInstances[1000000001].value;
        if (data.assignee) {
            let assignee = await coreApi.getPersonGuid(data.assignee);
            let caseTemplateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = caseTemplateDataAssignee;
        }
        if (data.supportGroup) {
            let companyGuid = await coreApi.getOrganizationGuid(data.company);
            let caseTemplateDataSupportCompany = {
                "id": 450000154,
                "value": `${companyGuid}`
            }
            templateData.fieldInstances["450000154"] = caseTemplateDataSupportCompany;
            let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.supportGroup);
            let caseTemplateDataSupportAssignee = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = caseTemplateDataSupportAssignee;
        }
        let newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);
        console.log('Create Manual Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New Manual Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createExternalTaskTemplate(data: ITaskTemplate): Promise<IIDs> {

        let templateDataFile = await require('../data/api/task/task.template.api.json');
        let templateData = await templateDataFile.ExternalTaskTemplate;

        templateData.fieldInstances[7].value = TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;

        let newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create External Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New External Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createAutomatedTaskTemplate(data: ITaskTemplate): Promise<IIDs> {

        let templateDataFile = await require('../data/api/task/task.template.api.json');
        let templateData = await templateDataFile.AutoTaskTemplateNewProcess;

        templateData.fieldInstances[7].value = TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[450000154].value = data.processBundle;
        templateData.fieldInstances[450000141].value = data.processName;
        //data.company ? templateData.fieldInstances[301566300].value = data.templateSummary;

        let newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create Automated Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );
        console.log('New Automated Task Template Details API Status =============>', taskTemplateDetails.status);

        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createBusinessUnit(data: IBusinessUnit): Promise<string> {
        let businessUnitGuid = await coreApi.getBusinessUnitGuid(data.orgName);
        if (businessUnitGuid == null) {
            let businessUnitDataFile = await require('../data/api/foundation/business.unit.api.json');
            let businessData = await businessUnitDataFile.NewBusinessUnit;
            businessData.fieldInstances[1000000010].value = data.orgName;
            if (data.relatedOrgId != null) {
                businessData.fieldInstances[304411161].value = data.relatedOrgId;
            }
            if (data.domainTag != null) {
                let domainGuid = await apiCoreUtil.getDomainTagGuid(data.domainTag);
                businessData.fieldInstances[304417331].value = domainGuid;
            }

            const newBusinessUnit = await coreApi.createRecordInstance(businessData);
            console.log('Create New Business Unit API Status =============>', newBusinessUnit.status);

            const businessUnitDetails = await axios.get(
                newBusinessUnit.headers.location);
            console.log('Get New Business Unit Details API Status =============>', businessUnitDetails.status);

            let recordName: string = businessUnitDetails.data.recordDefinitionName;
            let recordGUID: string = businessUnitDetails.data.id;
            let recordDisplayId: string = businessUnitDetails.data.displayId;

            return recordGUID;
        } else {
            console.log('New Business Unit API Status =============> Business Unit already exists =============> ', businessUnitGuid);
            return businessUnitGuid;
        }
    }

    async createDepartment(data: IDepartment): Promise<string> {
        let departmentGuid = await coreApi.getDepartmentGuid(data.orgName);
        if (departmentGuid == null) {
            let departmentDataFile = await require('../data/api/foundation/department.api.json');
            let departmentData = await departmentDataFile.NewDepartment;
            departmentData.fieldInstances[1000000010].value = data.orgName;
            if (data.relatedOrgId != null) {
                departmentData.fieldInstances[304411161].value = data.relatedOrgId;
            }

            if (data.domainTag != null) {
                let domainGuid = await apiCoreUtil.getDomainTagGuid(data.domainTag);
                departmentData.fieldInstances[304417331].value = domainGuid;
            }

            const newDepartment = await coreApi.createRecordInstance(departmentData);
            console.log('Create New Department API Status =============>', newDepartment.status);

            const departmentDetails = await axios.get(
                newDepartment.headers.location);
            console.log('Get New Department Details API Status =============>', departmentDetails.status);

            let recordGUID: string = departmentDetails.data.id;

            return recordGUID;
        } else {
            console.log('New Department API Status =============> Department already exists =============> ', departmentGuid);
            return departmentGuid;
        }
    }

    async createSupportGroup(data: ISupportGroup): Promise<string> {
        let supportGroupGuid = await coreApi.getSupportGroupGuid(data.orgName);
        if (supportGroupGuid == null) {
            let suppGrpDataFile = await require('../data/api/foundation/support.group.api.json');
            let suppGrpData = await suppGrpDataFile.NewSupportGroup;
            suppGrpData.fieldInstances[1000000010].value = data.orgName;
            if (data.relatedOrgId != null) {
                suppGrpData.fieldInstances[304411161].value = data.relatedOrgId;
            }

            if (data.domainTag != null) {
                let domainGuid = await apiCoreUtil.getDomainTagGuid(data.domainTag);
                suppGrpData.fieldInstances[304417331].value = domainGuid;
            }

            const newSuppGrp = await coreApi.createRecordInstance(suppGrpData);
            console.log('Create New Support Group API Status =============>', newSuppGrp.status);

            const suppGrpDetails = await axios.get(
                newSuppGrp.headers.location);
            console.log('Get New Support Group Details API Status =============>', suppGrpDetails.status);

            let recordGUID: string = suppGrpDetails.data.id;

            return recordGUID;
        } else {
            console.log('New Support Group API Status =============> Support group already exists =============> ', supportGroupGuid);
            return supportGroupGuid;
        }
    }

    async createNewUser(data: IPerson): Promise<string> {
        let personGuid = await coreApi.getPersonGuid(data.userId);
        if (personGuid == null) {
            let userDataFile = await require('../data/api/foundation/new.user.api.json');
            let userData = await userDataFile.NewUser;
            userData.fieldInstances[1000000019].value = data.firstName;
            userData.fieldInstances[1000000018].value = data.lastName;
            userData.fieldInstances[4].value = data.userId;
            userData.fieldInstances[430000002].value = data.userPermission ? data.userPermission : userData.fieldInstances[430000002].value;
            //data.emailId ? userData.fieldInstances[1000000048].value = data.emailId : null;
            const newUser = await coreApi.createRecordInstance(userData);
            console.log('Create New User Details API Status =============>', newUser.status);

            const userDetails = await axios.get(
                newUser.headers.location
            );

            console.log('Get New User Details API Status =============>', userDetails.status);
            let recordName: string = userDetails.data.recordDefinitionName;
            let recordGUID: string = userDetails.data.id;
            let recordDisplayId: string = userDetails.data.displayId;

            let updateUser = await userDataFile.EnableUser;
            updateUser.displayId = recordDisplayId;
            updateUser.id = recordGUID;

            const userUpdate = await coreApi.updateRecordInstance(recordName, recordGUID, updateUser);
            console.log('Enable User API Status =============>', userUpdate.status);
            return recordGUID;
        } else {
            console.log('New User API Status =============> User already exists =============> ', personGuid);
            return personGuid;
        }
    }

    async associatePersonToCompany(userId: string, company: string): Promise<void> {
        let userGuid = await coreApi.getPersonGuid(userId);
        let companyGuid = await coreApi.getOrganizationGuid(company);
        await coreApi.associateFoundationElements("Agent Supports Primary Organization", userGuid, companyGuid);
    }

    async associatePersonToSupportGroup(userId: string, supportGroup: string): Promise<void> {
        let userGuid = await coreApi.getPersonGuid(userId);
        let supportGroupGuid = await coreApi.getSupportGroupGuid(supportGroup);
        await coreApi.associateFoundationElements("Person to Support Secondary Organization", userGuid, supportGroupGuid);
    }

    async associateCategoryToOrganization(category: string, organization: string): Promise<void> {
        let organizationGuid = await coreApi.getOrganizationGuid(organization);
        let categoryGuid = await coreApi.getCategoryGuid(category);
        await coreApi.associateFoundationElements("Organization Uses Categorization", organizationGuid, categoryGuid);
    }

    async createOperationalCategory(category: string, isGlobal?: boolean): Promise<IIDs> {
        let recordDisplayId: string = null;
        let categoryGuid = await coreApi.getCategoryGuid(category);
        if (categoryGuid == null) {
            let categoryDataFile = await require('../data/api/foundation/category.api.json');
            let categoryData = null;
            if (isGlobal) {
                categoryData = await categoryDataFile.NewGlobalCateg;
            } else {
                categoryData = await categoryDataFile.NewOperationalCateg;
            }
            categoryData.fieldInstances[304405421].value = category;
            categoryData.fieldInstances[304405421].valueByLocale['en-US'] = category;

            const newCategory = await coreApi.createRecordInstance(categoryData);
            console.log('Create New Category API Status =============>', newCategory.status);

            const categoryDetails = await axios.get(
                newCategory.headers.location
            );

            console.log('Get New Category Details API Status =============>', categoryDetails.status);
            categoryGuid = categoryDetails.data.id;
            recordDisplayId = categoryDetails.data.displayId;
        } else {
            console.log('New User API Status =============> Category already exists =============> ', categoryGuid);
        }
        return {
            id: categoryGuid,
            displayId: recordDisplayId
        };
    }

    async associateCategoryToCategory(category1: string, category2: string): Promise<void> {
        let category1Guid = await coreApi.getCategoryGuid(category1);
        let category2Guid = await coreApi.getCategoryGuid(category2);
        await coreApi.associateFoundationElements("Categorization to Categorization", category1Guid, category2Guid);
    }

    async associateCategoryUnderDomainTag(categoryTier: string, domainTagGuid: string): Promise<boolean> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.associateDomainTagToCategory;
        //get category guid to associate under domain tag
        let categoryGuid = await coreApi.getCategoryGuid(categoryTier);
        domainTagData.id = categoryGuid;
        domainTagData.fieldInstances[304417331].value = domainTagGuid;
        let domainTagResponse: AxiosResponse = await coreApi.updateRecordInstance("com.bmc.arsys.rx.foundation:Operational Category", categoryGuid, domainTagData);
        return domainTagResponse.status == 204;
    }

    async associateCaseTemplateWithOneTaskTemplate(caseTemplateId: string, taskTemplateId: string): Promise<void> {
        let oneTaskFlowProcess = ONE_TASKFLOW;
        oneTaskFlowProcess = Object.assign({}, oneTaskFlowProcess);
        let taskTemplateGuid = await coreApi.getTaskTemplateGuid(taskTemplateId);
        let randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        oneTaskFlowProcess.name = oneTaskFlowProcess.name + "_" + randomString;
        let taskTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid);
        let taskSummary = taskTemplateJsonData.fieldInstances[8].value;

        oneTaskFlowProcess.flowElements[2].inputMap[0].expression = `"${taskSummary}"`;
        oneTaskFlowProcess.flowElements[2].inputMap[3].expression = `"${taskTemplateGuid}"`;

        let processGuid = await coreApi.createProcess(oneTaskFlowProcess);
        console.log('New Process Created =============>', oneTaskFlowProcess.name, "=====GUID:", processGuid);

        let caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = oneTaskFlowProcess.name;
        await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
    }

    async associateCaseTemplateWithTwoTaskTemplate(caseTemplateId: string, taskTemplateId1: string, taskTemplateId2: string, order: string): Promise<void> {
        let twoTaskFlowProcess: any;
        if (order.toLocaleLowerCase() === 'sequential')
            twoTaskFlowProcess = TWO_TASKFLOW_SEQUENTIAL;

        if (order.toLocaleLowerCase() === 'parallel')
            twoTaskFlowProcess = TWO_TASKFLOW_PARALLEL;

        twoTaskFlowProcess = Object.assign({}, twoTaskFlowProcess);
        let taskTemplateGuid1 = await coreApi.getTaskTemplateGuid(taskTemplateId1);
        let taskTemplateGuid2 = await coreApi.getTaskTemplateGuid(taskTemplateId2);
        let randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        twoTaskFlowProcess.name = await twoTaskFlowProcess.name + "_" + randomString;

        let taskTemplateJsonData1 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid1);
        let taskSummary1 = taskTemplateJsonData1.fieldInstances[8].value;
        let taskTemplateJsonData2 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid2);
        let taskSummary2 = taskTemplateJsonData2.fieldInstances[8].value;

        twoTaskFlowProcess.flowElements[2].inputMap[1].expression = `"${taskSummary1}"`;
        twoTaskFlowProcess.flowElements[3].inputMap[1].expression = `"${taskSummary2}"`;
        twoTaskFlowProcess.flowElements[2].inputMap[2].expression = `"${taskTemplateGuid1}"`;
        twoTaskFlowProcess.flowElements[3].inputMap[2].expression = `"${taskTemplateGuid2}"`;

        let processGuid = await coreApi.createProcess(twoTaskFlowProcess);
        console.log('New Process Created =============>', twoTaskFlowProcess.name, "=====GUID:", processGuid);
        let caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = twoTaskFlowProcess.name;
        await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
    }

    async createEmailTemplate(data: IEmailTemplate): Promise<boolean> {
        let emailTemplateFile = await require('../data/api/email/email.template.api.json');
        let templateData = await emailTemplateFile.EmailTemplateData;
        let companyGuid = await coreApi.getOrganizationGuid(data.Company);
        templateData.processInputValues["Company"] = companyGuid;
        templateData.processInputValues["TemplateName"] = data.TemplateName;
        templateData.processInputValues["Status"] = data.Status;
        templateData.processInputValues["Description"] = data.Description;
        templateData.processInputValues["EmailMessageSubject"] = data.EmailMessageSubject;
        templateData.processInputValues["EmailMessageBody"] = data.EmailMessageBody;
        templateData.processInputValues["Module"] = "Cases";
        templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.case-lib:Case";
        const emailTemplateResponse = await axios.post(
            commandUri,
            templateData
        );

        console.log('Create Email Template API Status =============>', emailTemplateResponse.status);
        return emailTemplateResponse.status == 201;
    }

    async createEmailAcknowledgementTemplate(data: IEmailTemplate): Promise<boolean> {
        let emailTemplateFile = await require('../data/api/email/email.template.api.json');
        let templateData = await emailTemplateFile.EmailAcknowledgementTemplateData;
        let companyGuid = await coreApi.getOrganizationGuid(data.Company);
        templateData.processInputValues["Company"] = companyGuid;
        templateData.processInputValues["TemplateName"] = data.TemplateName;
        templateData.processInputValues["Status"] = data.Status;
        templateData.processInputValues["Description"] = data.Description;
        templateData.processInputValues["EmailMessageSubject"] = data.EmailMessageSubject;
        templateData.processInputValues["EmailMessageBody"] = data.EmailMessageBody;
        templateData.processInputValues["Module"] = "Cases";
        templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.case-lib:Case";
        const emailTemplateResponse = await axios.post(
            commandUri,
            templateData
        );

        console.log('Create Email Template API Status =============>', emailTemplateResponse.status);
        return emailTemplateResponse.status == 201;
    }

    async createNotesTemplate(module: string, data: INotesTemplate): Promise<boolean> {
        let notesTemplateFile = await require('../data/api/social/notes.template.api.json');
        let templateData = await notesTemplateFile.NotesTemplateData;
        let companyGuid = await coreApi.getOrganizationGuid(data.company);
        templateData.processInputValues["Company"] = companyGuid;
        templateData.processInputValues["Template Name"] = data.templateName;
        templateData.processInputValues["Status"] = data.templateStatus;
        templateData.processInputValues["MessageBody"] = data.body;

        switch (module) {
            case "Case": {
                templateData.processInputValues["Module"] = "Cases";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.case-lib:Case";
                templateData.processInputValues["Description"] = "CasesActivity Notes Template";
                break;
            }
            case "Task": {
                templateData.processInputValues["Module"] = "Tasks";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.task-lib:Task";
                templateData.processInputValues["Description"] = "TasksActivity Notes Template";
                break;
            }
            case "People": {
                templateData.processInputValues["Module"] = "Person";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.arsys.rx.foundation:Person";
                templateData.processInputValues["Description"] = "PersonActivity Notes Template";
                break;
            }
            case "Knowledge": {
                templateData.processInputValues["Module"] = "Knowledge";
                templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.knowledge:Knowledge Article";
                templateData.processInputValues["Description"] = "KnowledgeActivity Notes Template";
                break;
            }
            default: {
                console.log("Invalid module name");
                break;
            }
        }
        const notesTemplateResponse = await axios.post(
            commandUri,
            templateData
        );

        console.log('Create Email Template API Status =============>', notesTemplateResponse.status);
        return notesTemplateResponse.status == 201;
    }

    async createKnowledgeArticle(data: IKnowledgeArticles): Promise<IIDs> {
        let knowledgeArticleFile = await require('../data/api/knowledge/knowledge.article.api.json');
        let knowledgeArticleData = await knowledgeArticleFile.KnowledgeArticleData;
        knowledgeArticleData.fieldInstances[301820700].value = data.knowledgeSet;
        knowledgeArticleData.fieldInstances[302300502].value = data.title;
        knowledgeArticleData.fieldInstances[302312187].value = data.templateId;
        knowledgeArticleData.fieldInstances[1000000063].value = data.categoryTier1 ? await apiCoreUtil.getCategoryGuid(data.categoryTier1) : knowledgeArticleData.fieldInstances[1000000063].value;
        knowledgeArticleData.fieldInstances[1000000064].value = data.categoryTier2 ? await apiCoreUtil.getCategoryGuid(data.categoryTier2) : knowledgeArticleData.fieldInstances[1000000064].value;
        knowledgeArticleData.fieldInstances[1000000065].value = data.categoryTier3 ? await apiCoreUtil.getCategoryGuid(data.categoryTier3) : knowledgeArticleData.fieldInstances[1000000065].value;
        knowledgeArticleData.fieldInstances[200000007].value = data.region ? await apiCoreUtil.getRegionGuid(data.region) : knowledgeArticleData.fieldInstances[200000007].value;
        knowledgeArticleData.fieldInstances[260000001].value = data.site ? await apiCoreUtil.getSiteGuid(data.site) : knowledgeArticleData.fieldInstances[260000001].value;
        knowledgeArticleData.fieldInstances[302300513].value = data.assignee ? await apiCoreUtil.getPersonGuid(data.assignee) : knowledgeArticleData.fieldInstances[302300513].value;
        knowledgeArticleData.fieldInstances[450000157].value = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : knowledgeArticleData.fieldInstances[450000157].value;
        if (data.assigneeSupportGroup) {
            let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.assigneeSupportGroup);
            let assineeSupportGroupData = {
                "id": 302300512,
                "value": `${assigneeSupportGroup}`
            }
            knowledgeArticleData.fieldInstances["302300512"] = assineeSupportGroupData;
        }
        let knowledgeArticleResponse: AxiosResponse = await coreApi.createRecordInstance(knowledgeArticleData);
        console.log('Create Knowledge Article API Status =============>', knowledgeArticleResponse.status);
        if (knowledgeArticleResponse.status == 201) {
            const knowledgeArticleDetails = await axios.get(await knowledgeArticleResponse.headers.location);
            return {
                id: knowledgeArticleDetails.data.id,
                displayId: knowledgeArticleDetails.data.displayId.replace(knowledgeArticleDetails.data.displayId.substring(0, 3), "KA-"),
            };
        }
    }

    async updateKnowledgeArticleStatus(articleGuid: string, articleStatus: string, reviewer?: string, reviewerGroup?: string, reviewerOrg?: string): Promise<boolean> {
        let knowledgeArticleFile = await require('../data/api/knowledge/knowledge.article.api.json');
        let knowledgeArticleData = await knowledgeArticleFile.UpdateKnowledgeArticleData;
        knowledgeArticleData.id = articleGuid;
        knowledgeArticleData.fieldInstances[302300500].value = Knowledge[articleStatus];
        if (reviewer) {
            let reviewerSGGuid = await apiCoreUtil.getSupportGroupGuid(reviewerGroup);
            let reviewerSGPayload = {
                "id": 301122400,
                "value": `${reviewerSGGuid}`
            }
            let reviewerGuid = await apiCoreUtil.getPersonGuid(reviewer);
            let reviewerPayload = {
                "id": 302309801,
                "value": `${reviewerGuid}`
            }
            let reviewerCompanyGuid = await apiCoreUtil.getOrganizationGuid(reviewerOrg);
            let reviewerCompanyPayload = {
                "id": 450000300,
                "value": `${reviewerCompanyGuid}`
            }
            knowledgeArticleData.fieldInstances[301122400] = reviewerSGPayload;
            knowledgeArticleData.fieldInstances[302309801] = reviewerPayload;
            knowledgeArticleData.fieldInstances[450000300] = reviewerCompanyPayload;
        }
        let knowledgeArticleResponse: AxiosResponse = await coreApi.updateRecordInstance("com.bmc.dsm.knowledge:Knowledge Article Template", articleGuid, knowledgeArticleData);
        console.log("Status", knowledgeArticleResponse.status);
        return knowledgeArticleResponse.status == 204;
    }

    async flagAndUnflagKnowledgeArticle(knowledgeGuid: string, feedbackCommnent, flagUnflag: number): Promise<boolean> {
        let flagAndUnflagData = FLAG_UNFLAG_KA;
        flagAndUnflagData.processInputValues.ParentID = `${knowledgeGuid}`;
        flagAndUnflagData.processInputValues.Feedback = `${feedbackCommnent}`;
        flagAndUnflagData.processInputValues.GUID = `${knowledgeGuid}`;
        flagAndUnflagData.processInputValues.Flag = `${flagUnflag}`;
        const flagAndUnflagResponse = await axios.post(
            commandUri,
            flagAndUnflagData
        );
        console.log('Flag Unflag Status========>', flagAndUnflagResponse.status);
        return flagAndUnflagResponse.status == 204;
    }

    async deleteEmailOrNotificationTemplate(emailTemplateName: string,company?:string): Promise<boolean> {
        let emailTemplateGuid = await coreApi.getEmailTemplateGuid(emailTemplateName);
        return await coreApi.deleteRecordInstance('com.bmc.dsm.notification-lib:NotificationTemplate', emailTemplateGuid);
    }

    async createNewFlowset(data: IFlowset): Promise<IIDs> {
        let flowsetFile = await require('../data/api/case/flowset.api.json');
        let flowsetData = await flowsetFile.FlowsetData;
        let companyGuid = await coreApi.getOrganizationGuid(data.company);
        flowsetData.fieldInstances[1000000001].value = companyGuid;
        flowsetData.fieldInstances[450000002].value = data.flowsetName;
        flowsetData.fieldInstances[8].value = data.description;
        flowsetData.fieldInstances[7].value = data.flowsetStatus;
        const flowset = await coreApi.createRecordInstance(flowsetData);
        const flowsetDetails = await axios.get(
            flowset.headers.location
        );
        console.log('New Case Details API Status =============>', flowsetDetails.status);

        return {
            id: flowsetDetails.data.id,
            displayId: flowsetDetails.data.displayId
        };
    }

    async createNewDomainTag(domainTag: string): Promise<IIDs> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.createDomainTag;
        domainTagData.fieldInstances[8].value = domainTag;
        let domainTagResponse: AxiosResponse = await coreApi.createRecordInstance(domainTagData);
        console.log('Create Domain Tag API Status =============>', domainTagResponse.status);
        const domainTagDetails = await axios.get(
            await domainTagResponse.headers.location
        );
        return {
            id: domainTagDetails.data.id,
            displayId: domainTagDetails.data.displayId
        };
    }

    async enableDomainTag(category: string): Promise<boolean> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.enableDomainTag;
        let categoryGuid = await apiCoreUtil.getCategoryGuid(category);
        domainTagData.id = categoryGuid;
        domainTagData.fieldInstances[8].value = 'BWF Domain';
        domainTagData.fieldInstances[450000152].value = categoryGuid;
        let domainTagResponse: AxiosResponse = await coreApi.updateRecordInstance('com.bmc.dsm.shared-services-lib:Domain Configuration', categoryGuid, domainTagData);
        console.log('Enable Domain Tag API Status =============>', domainTagResponse.status);
        return domainTagResponse.status == 201;
    }

    async disableDomainTag(domainTagGuid: string): Promise<boolean> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.disableDomainTag;
        let domainConfigGuid = await apiCoreUtil.getDomainConfigurationGuid(domainTagGuid);
        domainTagData.id = domainConfigGuid;
        domainTagData.fieldInstances[450000152].value = domainTagGuid;
        let domainTagResponse: AxiosResponse = await coreApi.updateRecordInstance('com.bmc.dsm.shared-services-lib:Domain Configuration', domainConfigGuid, domainTagData);
        console.log('Disable Domain Tag API Status =============>', domainTagResponse.status);
        return domainTagResponse.status == 204;
    }

    async createNewMenuItem(data: IMenuItem): Promise<IIDs> {
        let randomStr = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        console.log(data);
        let menuItemFile = await require('../data/api/shared-services/menuItemConfiguration.api.json');
        console.log('New Menu Item API Status =============>');
        let menuItemData = await menuItemFile.MenuItemConfiguration;
        menuItemData.fieldInstances[450000153].value = data.menuType;
        menuItemData.fieldInstances[450000152].value = data.menuItemName;
        menuItemData.fieldInstances[7].value = MenuItemStatus[data.menuItemStatus];
        menuItemData.fieldInstances[450000154].value = randomStr;
        const menuItem = await coreApi.createRecordInstance(menuItemData);
        const menuItemDetails = await axios.get(
            menuItem.headers.location
        );
        console.log('New Menu Item API Status =============>', menuItemDetails.status);

        return {
            id: menuItemDetails.data.id,
            displayId: menuItemDetails.data.displayId
        };
    }

    async createComplexSurvey(data: any): Promise<void> {
        const complexSurvey = await axios.post(
            "api/com.bmc.dsm.catalog-lib/surveys",
            data
        );
        console.log("Complex Survey status ==>>> " + complexSurvey.status);
    }

    async setDefaultNotificationForUser(user: string, notificationType: string): Promise<void> {
        let personGuid: string = await coreApi.getPersonGuid(user);
        let notificationTypeFile = await require('../data/api/foundation/default.notification.user.api.json');
        let defaultNotificationData = await notificationTypeFile.NotificationSet;
        defaultNotificationData.id = personGuid;
        defaultNotificationData.fieldInstances[430000003].value = NotificationType[notificationType];
        let uri: string = "api/rx/application/record/recordinstance/com.bmc.arsys.rx.foundation%3APerson/" + personGuid;
        const notificationSetting = await axios.put(
            uri,
            defaultNotificationData
        );
        console.log("Alert status ==>>> " + notificationSetting.status);
    }

    async deleteDynamicFieldAndGroup(dynamicAttributeName?: string): Promise<boolean> {
        if (dynamicAttributeName) {
            let dynamicFieldGuid = await coreApi.getDynamicFieldGuid(dynamicAttributeName);
            let dynamicGroupGuid = await coreApi.getDynamicGroupGuid(dynamicAttributeName);
            if (dynamicFieldGuid) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeDefinition', dynamicFieldGuid);
            } else if (dynamicGroupGuid) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeGroupDefinition', dynamicGroupGuid);
            }
        }
        else {
            let allDynamicFieldRecords = await coreApi.getGuid('com.bmc.dsm.ticketing-lib:AttributeDefinition');
            let dynamicFieldArrayMap = allDynamicFieldRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeDefinition', obj[179]);
            });
            let isAllDynamicFieldDeleted: boolean = await Promise.all(dynamicFieldArrayMap).then(async (result) => {
                return !result.includes(false);
            });

            let allDynamicGroupRecords = await coreApi.getGuid('com.bmc.dsm.ticketing-lib:AttributeGroupDefinition');
            let dynamicGroupArrayMap = allDynamicGroupRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeGroupDefinition', obj[179]);
            });
            let isAllDynamicGroupDeleted: boolean = await Promise.all(dynamicGroupArrayMap).then(async (result) => {
                return !result.includes(false);
            });

            return isAllDynamicFieldDeleted === isAllDynamicGroupDeleted === true;
        }
    }

    async deleteFlowsetProcessLibConfig(processName: string) {
        let allProcessLibConfig = await coreApi.getGuid('com.bmc.dsm.flowsets-lib:Process Library');
        allProcessLibConfig.data.data.map(async (obj) => {
            if (obj[450000002] == processName) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.flowsets-lib:Process Library', obj[179]);
            }
        });
    }

    async updateCompanyDetails(organizationName: string, abbreviation: string, operationalType: string): Promise<boolean> {
        let orgGuid: string = await coreApi.getOrganizationGuid(organizationName);
        let organizationDetailsFile = await require('../data/api/foundation/organization.api.json');
        let OrgData = await organizationDetailsFile.updateOrganizationDetails;
        OrgData.id = orgGuid;
        OrgData.fieldInstances[304417291].value = operationalType;
        OrgData.fieldInstances[1000000071].value = abbreviation;
        let uri: string = "api/rx/application/record/recordinstance/com.bmc.arsys.rx.foundation%3APrimary%20Organization/" + orgGuid;
        const updatedOrgData = await axios.put(
            uri,
            OrgData
        );
        console.log("Updated Organization status ==>>> " + updatedOrgData.status);
        return updatedOrgData.status == 204;
    }

    async updateNotificationEmailListForSupportGroup(supportGroup: string, notificationList: string): Promise<void> {
        let supportGroupGuid: string = await coreApi.getSupportGroupGuid(supportGroup);
        let notificationEmailFile = await require('../data/api/foundation/notifications.email.list.update.api.json');
        let notificationEmailList = await notificationEmailFile.NotificationEmailList;
        notificationEmailList["id"] = supportGroupGuid;
        notificationEmailList.fieldInstances[303500800]["value"] = notificationList;
        let uri: string = "api/rx/application/record/recordinstance/com.bmc.arsys.rx.foundation%3ASupport%20Group/" + supportGroupGuid;
        const notificationSetting = await axios.put(
            uri,
            notificationEmailList
        );
        console.log("Set Notification Email List status ==>>> " + notificationSetting.status);
    }


    async updateCaseAccess(caseGuid: string, data: any): Promise<number> {
        let accessFile = await require('../data/api/case/case.access.api.json');
        let caseAccessData = await accessFile.CaseAccess;
        caseAccessData.processInputValues['Record Instance ID'] = caseGuid;
        caseAccessData.processInputValues['Type'] = data.type;
        caseAccessData.processInputValues['Operation'] = data.operation;
        caseAccessData.processInputValues['Security Type'] = data.security;
        caseAccessData.processInputValues['Value'] = data.username;
        const updateCaseAccess = await axios.post(
            commandUri,
            caseAccessData
        );

        console.log('Update Case Access API Status =============>', updateCaseAccess.status);
        return updateCaseAccess.status;
    }

    async updateCaseStatus(caseGuid: string, status: string, statusReason?: string): Promise<number> {
        let updateStatusFile = await require('../data/api/case/update.case.status.api.json');
        let statusData = await updateStatusFile.CaseStatusChange;
        statusData["id"] = caseGuid;
        statusData.fieldInstances[450000021]["value"] = CaseStatus[status];
        if (statusReason) {
            statusData.fieldInstances[1000000881]["value"] = await apiCoreUtil.getStatusChangeReasonGuid(statusReason);
        }

        let updateCaseStatus = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case", caseGuid, statusData);
        return updateCaseStatus.status;
    }

    async createProcessLibConfig(data: IProcessLibConfig): Promise<IIDs> {
        let newProcessConfig = NEW_PROCESS_LIB;
        newProcessConfig.fieldInstances[61001]["value"] = data.applicationServicesLib;
        newProcessConfig.fieldInstances[450000002]["value"] = data.processName;
        newProcessConfig.fieldInstances[450000003]["value"] = data.processAliasName;
        newProcessConfig.fieldInstances[7]["value"] = data.status ? ProcessLibConf[data.status] : newProcessConfig.fieldInstances[7].value;
        newProcessConfig.fieldInstances[8]["value"] = data.description ? data.description : newProcessConfig.fieldInstances[8].value;
        newProcessConfig.fieldInstances[1000000001]["value"] = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : newProcessConfig.fieldInstances[1000000001].value;

        let newProcessLibConfRecord: AxiosResponse = await coreApi.createRecordInstance(newProcessConfig);

        console.log('Create New Process Lib Config API Status =============>', newProcessLibConfRecord.status);

        const processLibConfRecord = await axios.get(
            newProcessLibConfRecord.headers.location
        );
        console.log('New Process API Status =============>', processLibConfRecord.status);

        return {
            id: processLibConfRecord.data.id,
            displayId: processLibConfRecord.data.displayId
        };
    }

    async deleteServiceTargets(serviceTargetTitle?: string): Promise<boolean> {
        if (serviceTargetTitle) {
            let serviceTargetGuid = await coreApi.getServiceTargetGuid(serviceTargetTitle);
            if (serviceTargetGuid) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.slm-lib:Service Target', serviceTargetGuid);
            }
        }
        else {
            let allSVTRecords = await coreApi.getGuid('com.bmc.dsm.slm-lib:Service Target');
            let svtArrayMap = allSVTRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.slm-lib:Service Target', obj[179]);
            });
            let isAllSVTDeleted: boolean = await Promise.all(svtArrayMap).then(async (result) => {
                return !result.includes(false);
            });
            return isAllSVTDeleted === true;
        }
    }

    async deleteApprovalMapping(approvalMappingName?: string): Promise<boolean> {
        if (approvalMappingName) {
            let allRecords = await coreApi.getGuid("com.bmc.dsm.case-lib:Case Approval Mapping");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[1000001437] === approvalMappingName;
            });
            let approvalMapGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
            if (approvalMapGuid) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.case-lib:Case Approval Mapping', approvalMapGuid);
            }
        } else {
            let allApprovalMapRecords = await coreApi.getGuid("com.bmc.dsm.case-lib:Case Approval Mapping");
            let allApprovalMapArrayMap = allApprovalMapRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.case-lib:Case Approval Mapping', obj[379]);
            });
            return await Promise.all(allApprovalMapArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async updateCase(caseGuid: string, jsonBody: any): Promise<boolean> {
        jsonBody.id = caseGuid;
        let updateCase = await coreApi.updateRecordInstance('com.bmc.dsm.case-lib:Case', caseGuid, jsonBody);
        return updateCase.status == 204;
    }

    async runAutomatedCaseTransitionProcess(): Promise<number> {
        let response = await axios.post(
            commandUri,
            AUTOMATED_CASE_STATUS_TRANSITION
        )
        return response.status;
    }

    async createDocumentLibrary(docLibDetails: IDocumentLib, filePath: string): Promise<IIDs> {
        let documentLibRecordInstanceJson = DOC_LIB_DRAFT;
        documentLibRecordInstanceJson.fieldInstances[302300502].value = docLibDetails.docLibTitle;
        documentLibRecordInstanceJson.fieldInstances[1000000001].value = await apiCoreUtil.getOrganizationGuid(docLibDetails.company);
        documentLibRecordInstanceJson.fieldInstances[302300512].value = await apiCoreUtil.getSupportGroupGuid(docLibDetails.ownerGroup);
        documentLibRecordInstanceJson.fieldInstances[450000441].value = docLibDetails.shareExternally ? '1' : '0';
        documentLibRecordInstanceJson.fieldInstances[200000007].value = docLibDetails.region ? await apiCoreUtil.getRegionGuid(docLibDetails.region) : documentLibRecordInstanceJson.fieldInstances[200000007].value;
        documentLibRecordInstanceJson.fieldInstances[260000001].value = docLibDetails.site ? await apiCoreUtil.getSiteGuid(docLibDetails.site) : documentLibRecordInstanceJson.fieldInstances[260000001].value;
        documentLibRecordInstanceJson.fieldInstances[302301262].value = docLibDetails.keywordTag ? docLibDetails.keywordTag : documentLibRecordInstanceJson.fieldInstances[302301262].value;
        documentLibRecordInstanceJson.fieldInstances[450000153].value = docLibDetails.description ? docLibDetails.description : documentLibRecordInstanceJson.fieldInstances[450000153].value;
        documentLibRecordInstanceJson.fieldInstances[450000371].value = docLibDetails.department ? await apiCoreUtil.getDepartmentGuid(docLibDetails.department) : documentLibRecordInstanceJson.fieldInstances[450000371].value;
        documentLibRecordInstanceJson.fieldInstances[450000381].value = docLibDetails.businessUnit ? await apiCoreUtil.getBusinessUnitGuid(docLibDetails.businessUnit) : documentLibRecordInstanceJson.fieldInstances[450000381].value;
        documentLibRecordInstanceJson.fieldInstances[1000000063].value = docLibDetails.category1 ? await apiCoreUtil.getCategoryGuid(docLibDetails.category1) : documentLibRecordInstanceJson.fieldInstances[1000000063].value;
        documentLibRecordInstanceJson.fieldInstances[1000000064].value = docLibDetails.category2 ? await apiCoreUtil.getCategoryGuid(docLibDetails.category2) : documentLibRecordInstanceJson.fieldInstances[1000000064].value;
        documentLibRecordInstanceJson.fieldInstances[1000000065].value = docLibDetails.category3 ? await apiCoreUtil.getCategoryGuid(docLibDetails.category3) : documentLibRecordInstanceJson.fieldInstances[1000000065].value;
        documentLibRecordInstanceJson.fieldInstances[450000167].value = docLibDetails.category4 ? await apiCoreUtil.getCategoryGuid(docLibDetails.category4) : documentLibRecordInstanceJson.fieldInstances[450000167].value;

        let data = {
            recordInstance: documentLibRecordInstanceJson,
            1000000351: filePath
        };

        let newDocumentLib: AxiosResponse = await coreApi.multiFormPostWithAttachment(data);
        console.log('Create Doc Lib API Status =============>', newDocumentLib.status);
        const newDocumentLibDetails = await axios.get(
            await newDocumentLib.headers.location
        );
        console.log('New Doc Lib Details API Status =============>', newDocumentLibDetails.status);

        return {
            id: newDocumentLibDetails.data.id,
            displayId: newDocumentLibDetails.data.displayId
        };
    }

    async publishDocumentLibrary(docLibInfo: IIDs): Promise<boolean> {
        let publishDocLibPayload = DOC_LIB_PUBLISH;
        publishDocLibPayload.id = docLibInfo.id;
        publishDocLibPayload.displayId = docLibInfo.displayId;

        let publishDocLibResponse: AxiosResponse = await coreApi.updateRecordInstance('com.bmc.dsm.knowledge:Knowledge Article', docLibInfo.id, publishDocLibPayload);
        console.log('Publish Doc Lib API Status =============>', publishDocLibResponse.status);
        return publishDocLibResponse.status == 204;
    }

    async giveReadAccessToDocLib(docLibInfo: IIDs, orgName: string): Promise<boolean> {
        let readAccessDocLibPayload = DOC_LIB_READ_ACCESS;
        readAccessDocLibPayload['processInputValues']['Record Instance ID'] = docLibInfo.id;
        let orgId = await coreApi.getOrganizationGuid(orgName);
        if (orgId == null) { orgId = await coreApi.getBusinessUnitGuid(orgName); }
        if (orgId == null) { orgId = await coreApi.getDepartmentGuid(orgName); }
        if (orgId == null) { orgId = await coreApi.getSupportGroupGuid(orgName); }
        readAccessDocLibPayload['processInputValues']['Value'] = orgId;
        console.log(readAccessDocLibPayload);
        const readAccessDocLibResponse = await axios.post(commandUri, readAccessDocLibPayload);
        console.log('Read Access Doc Lib API Status =============>', readAccessDocLibResponse.status);
        return readAccessDocLibResponse.status == 201;
    }

    async deleteDocumentLibrary(documentLibTitle: string): Promise<boolean> {
        let docLibGuid = await coreApi.getDocLibGuid(documentLibTitle);
        if (docLibGuid) {
            return await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Article', docLibGuid);
        } else console.log('Doc Lib GUID not found =============>', documentLibTitle);
    }

    async createKnowledgeSet(knowledgeSetDetails: IKnowledgeSet): Promise<IIDs> {
        let knowledgeSetData = KNOWLEDGE_SET;
        knowledgeSetData.fieldInstances[8].value = knowledgeSetDetails.knowledgeSetDesc;
        knowledgeSetData.fieldInstances[301820700].value = knowledgeSetDetails.knowledgeSetTitle;
        knowledgeSetData.fieldInstances[1000000001].value = await apiCoreUtil.getOrganizationGuid(knowledgeSetDetails.company);

        let recordInstanceKSetAssociationJson = KnowledegeSet_ASSOCIATION;
        let data = {
            recordInstance: knowledgeSetData,
            associationOperations: recordInstanceKSetAssociationJson
        };
        
        let newKnowledgeSet: AxiosResponse = await coreApi.multiFormPostWithAttachment(data);
        console.log('Create Knowledge set API Status =============>', newKnowledgeSet.status);
        const newKnowledgeSetDetails = await axios.get(
            await newKnowledgeSet.headers.location
        );
        return {
            id: newKnowledgeSetDetails.data.id,
            displayId: newKnowledgeSetDetails.data.displayId
        };
    }

    async updateKnowledgeSetPermissions(knowledgeSetId: string, isSupportGroup: string, knowledgeSetPermissionDetails: IknowledgeSetPermissions): Promise<boolean> {
        let knowledgeSetAccess = KNOWLEDGESET_PERMISSION;
        knowledgeSetAccess.processInputValues["Record Instance ID"] = knowledgeSetId;
        knowledgeSetAccess.processInputValues.Operation = knowledgeSetPermissionDetails.operation;
        knowledgeSetAccess.processInputValues.Type = knowledgeSetPermissionDetails.type;
        if (isSupportGroup == 'Support Group') {
            knowledgeSetAccess.processInputValues.Value = await apiCoreUtil.getSupportGroupGuid(knowledgeSetPermissionDetails.value);
        }
        else {
            knowledgeSetAccess.processInputValues.Value = await apiCoreUtil.getOrganizationGuid(knowledgeSetPermissionDetails.value);
        }
        knowledgeSetAccess.processInputValues["Security Type"] = knowledgeSetPermissionDetails.securityType;

        const updateKnowledgeSetAccess = await axios.post(
            commandUri,
            knowledgeSetAccess
        );

        console.log('Update Knowledge Set Access API Status =============>', updateKnowledgeSetAccess.status);
        return updateKnowledgeSetAccess.status === 201;
    }

    async createKnowledgeArticleTemplate(knowledgeSetTitle:string,knowledgeSetId: string, data:any):Promise<IIDs>{
        let knowledgeSetTemplateData = KNOWLEDGEARTICLE_TEMPLATE;
        knowledgeSetTemplateData.sections[0].title = data.title;     
        knowledgeSetTemplateData.templateName = data.templateName;
        knowledgeSetTemplateData.knowledgeSet = knowledgeSetTitle;
        knowledgeSetTemplateData.company = await apiCoreUtil.getOrganizationGuid(data.company);
        knowledgeSetTemplateData.knowledgeSetId = knowledgeSetId;
        
        const articleTemplateResponse = await axios.post(
            articleTemplateUri,
            knowledgeSetTemplateData
        );

        console.log('Create Knowledge Article Template API Status =============>', articleTemplateResponse.status);
        return {
            id: articleTemplateResponse.data.id,
            displayId: articleTemplateResponse.data.displayId
        };
    }
}

export default new ApiHelper();
