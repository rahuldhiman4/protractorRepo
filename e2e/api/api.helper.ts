import axios, { AxiosResponse } from "axios";
import { cloneDeep } from 'lodash';
import { browser } from 'protractor';
import * as uuid from 'uuid';
import { default as apiCoreUtil, default as coreApi } from "../api/api.core.util";
import * as constants from "../api/constant.api";
import { APPROVAL_ACTION, MORE_INFO_RETURN_ACTION } from "../data/api/approval/approval.action.api";
import { CASE_APPROVAL_FLOW, INVALID_CASE_APPROVAL_FLOW, INVALID_KM_APPROVAL_FLOW } from '../data/api/approval/approval.flow.api';
import { CASE_APPROVAL_MAPPING } from '../data/api/approval/approval.mapping.api';
import { CASE_READ_ACCESS } from '../data/api/case/case.read.access.api';
import { CASE_REOPEN } from '../data/api/case/case.reopen.api';
import { CASE_TEMPLATE_PAYLOAD, CASE_TEMPLATE_STATUS_UPDATE_PAYLOAD } from '../data/api/case/case.template.data.api';
import { ADD_TO_WATCHLIST } from '../data/api/case/case.watchlist.api';
import { CASE_STATUS_CHANGE, UPDATE_CASE, UPDATE_CASE_ASSIGNMENT } from '../data/api/case/update.case.api';
import { EMAILCONFIG_DEFAULT, INCOMINGMAIL_DEFAULT, OUTGOINGEMAIL_DEFAULT } from '../data/api/email/email.configuration.data.api';
import { EMAIL_WHITELIST } from '../data/api/email/email.whitelist.data.api';
import { NEW_PROCESS_LIB } from '../data/api/flowset/create-process-lib';
import { ADD_FUNCTIONAL_ROLE, UPDATE_PERSON_AS_VIP } from '../data/api/foundation/update.person.data.api';
import { IBusinessUnit } from '../data/api/interface/business.unit.interface.api';
import { ICaseApprovalMapping } from '../data/api/interface/case.approval.mapping.interface.api';
import { ICaseAssignmentMapping } from "../data/api/interface/case.assignment.mapping.interface.api";
import { ICaseTemplate } from "../data/api/interface/case.template.interface.api";
import { IDepartment } from '../data/api/interface/department.interface.api';
import { IDocumentLib } from '../data/api/interface/doc.lib.interface.api';
import { IDomainTag } from '../data/api/interface/domain.tag.interface.api';
import { IEmailTemplate } from '../data/api/interface/email.template.interface.api';
import { IFlowset, IProcessLibConfig } from '../data/api/interface/flowset.interface.api';
import { IKnowledgeSet } from '../data/api/interface/knowledge-set.interface.api';
import { IknowledgeSetPermissions } from '../data/api/interface/knowledge-set.permissions.interface.api';
import { IKnowledgeArticles } from '../data/api/interface/knowledge.articles.interface.api';
import { IMenuItem } from '../data/api/interface/menu.Items.interface.api';
import { INotesTemplate } from '../data/api/interface/notes.template.interface.api';
import { IPerson } from '../data/api/interface/person.interface.api';
import { ICase, ITask } from '../data/api/interface/record-update.interface.api';
import { ISupportGroup } from '../data/api/interface/support.group.interface.api';
import { IAdhocTask, ITaskTemplate } from '../data/api/interface/task.template.interface.api';
import { FLAG_UNFLAG_KA } from '../data/api/knowledge/flag-unflag.data.api';
import { KNOWLEDGE_APPROVAL_CONFIG, KNOWLEDGE_APPROVAL_FLOW_CONFIG } from '../data/api/knowledge/knowledge-approvals-config.api';
import { KNOWLEDGE_ARTICLE_EXTERNAL_FLAG } from "../data/api/knowledge/knowledge-article-external.api";
import { KNOWLEDGEARTICLE_HELPFULCOUNTER, KNOWLEDGEARTICLE_TEMPLATE } from '../data/api/knowledge/knowledge-article.template.api';
import { KNOWLEDEGESET_ASSOCIATION, KNOWLEDGESET_PERMISSION, KNOWLEDGE_SET } from '../data/api/knowledge/knowledge-set.data.api';
import { KNOWLEDGE_ARTICLE_PAYLOAD, UPDATE_KNOWLEDGE_ARTICLE_PAYLOAD } from '../data/api/knowledge/knowledge.article.api';
import { ACTIONABLE_NOTIFICATIONS_ENABLEMENT_SETTING } from '../data/api/shared-services/enabling.actionable.notifications.api';
import { AUTOMATED_CASE_STATUS_TRANSITION } from '../data/api/shared-services/process.data.api';
import { BUSINESS_TIME_SEGMENT } from '../data/api/slm/business.time.segment.api';
import { BUSINESS_TIME_SHARED_ENTITY } from '../data/api/slm/business.time.shared.entity.api';
import { SERVICE_TARGET_PAYLOAD } from '../data/api/slm/serviceTarget.api';
import { POST_ACTIVITY, POST_ACTIVITY_WITH_ATTACHMENT } from '../data/api/social/post.activity.api';
import { ADHOC_TASK_PAYLOAD, TASK_CREATION_FROM_TEMPLATE, UPDATE_TASK, UPDATE_TASK_STATUS, REGISTER_ADHOC_TASK } from '../data/api/task/task.creation.api';
import { AUTO_TASK_TEMPLATE_PAYLOAD, DOC_FOR_AUTO_TASK_TEMPLATE, EXTERNAL_TASK_TEMPLATE_PAYLOAD, MANUAL_TASK_TEMPLATE_PAYLOAD, PROCESS_FOR_AUTO_TASK_TEMPLATE } from '../data/api/task/task.template.api';
import { ONE_TASKFLOW, PROCESS_DOCUMENT, THREE_TASKFLOW_SEQUENTIAL, TWO_TASKFLOW_PARALLEL, TWO_TASKFLOW_SEQUENTIAL } from '../data/api/task/taskflow.process.data.api';
import { DOC_LIB_DRAFT, DOC_LIB_PUBLISH, DOC_LIB_READ_ACCESS } from '../data/api/ticketing/document-library.data.api';
import * as DYNAMIC from '../data/api/ticketing/dynamic.data.api';

let fs = require('fs');

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
        console.log('Login API Status of ' + user + ' =============>', response.status);
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

    async createDynamicDataOnTemplate(templateGuid: string, payloadName: string): Promise<void> {
        let templateData = DYNAMIC[payloadName];
        templateData['templateId'] = templateGuid;
        let newCaseTemplate: AxiosResponse = await
            coreApi.createDyanmicData(templateData);
        console.log('Create Dynamic on Template API Status =============>', newCaseTemplate.status);
    }

    async createEmailConfiguration(incomingMailBox?: any, outGoingMailBox?: any, emailMailBox?: any): Promise<EmailGUIDs> {
        if (!incomingMailBox) incomingMailBox = cloneDeep(INCOMINGMAIL_DEFAULT);
        if (!emailMailBox) emailMailBox = cloneDeep(EMAILCONFIG_DEFAULT);
        if (!outGoingMailBox) outGoingMailBox = cloneDeep(OUTGOINGEMAIL_DEFAULT);
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

    async deleteAllEmailConfiguration(): Promise<boolean> {
        let emailConfigDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=7,1,recordContext._associations.IDGADG1AANVNMAPHAJWGPGDM6B8LR5.nodeA%5B0%5D.1000000010,1000000001,450000156,450000153,379&recorddefinition=com.bmc.dsm.email-lib:Email+Box+Registration&shouldIncludeTotalSize=false&sortBy=450000156&startIndex=0";
        let allEmailConfig = await axios.get(
            emailConfigDataPageUri
        );
        let deleteAllEmailConfigMap = allEmailConfig.data.data.map(async (obj: string) => {
            return await coreApi.deleteRecordInstance('com.bmc.dsm.email-lib:Email Box Registration', obj[379]);
        });
        let deleteAllEmailConfig: boolean = await Promise.all(deleteAllEmailConfigMap).then(async (result) => {
            return !result.includes(false);
        });

        let incomingMailDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=179,1,18037,18217,7,379&queryExpression=((%2718049%27%3D%220%22))&recorddefinition=AR+System+Email+Mailbox+Configuration&shouldIncludeTotalSize=false&sortBy=7&startIndex=0";
        let allIncomingMail = await axios.get(
            incomingMailDataPageUri
        );
        let deleteAllIncomingMailMap = allIncomingMail.data.data.map(async (obj: string) => {
            return await coreApi.deleteRecordInstance('AR System Email Mailbox Configuration', obj[379]);
        });
        let deleteAllIncomingMail: boolean = await Promise.all(deleteAllIncomingMailMap).then(async (result) => {
            return !result.includes(false);
        });

        let outgoingMailDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=7,179,1,18217,18037,18147,379&queryExpression=((%2718049%27%3D%221%22))&recorddefinition=AR+System+Email+Mailbox+Configuration&shouldIncludeTotalSize=false&startIndex=0";
        let allOutgoingMail = await axios.get(
            outgoingMailDataPageUri
        );
        let deleteAllOutgoingMailMap = allOutgoingMail.data.data.map(async (obj: string) => {
            return await coreApi.deleteRecordInstance('AR System Email Mailbox Configuration', obj[379]);
        });
        let deleteAllOutgoingMail: boolean = await Promise.all(deleteAllOutgoingMailMap).then(async (result) => {
            return !result.includes(false);
        });

        console.log('AllEmailConfiguration deleted =============>', deleteAllEmailConfig == deleteAllIncomingMail == deleteAllOutgoingMail);
        return deleteAllEmailConfig == deleteAllIncomingMail == deleteAllOutgoingMail;
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

    async updateTask(taskGuid: string, data: ITask): Promise<number> {
        let taskData = cloneDeep(UPDATE_TASK);
        taskData.id = taskGuid;

        if (data.summary) {
            let taskSummary = {
                "id": "8",
                "value": `${data.summary}`
            }
            taskData.fieldInstances["8"] = taskSummary;
        }

        if (data.description) {
            let taskDescription = {
                "id": "1000000000",
                "value": `${data.description}`
            }
            taskData.fieldInstances["1000000000"] = taskDescription;
        }

        if (data.priority) {
            let priorityValue = constants.CasePriority[data.priority];
            let priorityObj = {
                "id": "1000000164",
                "value": `${priorityValue}`
            }
            taskData.fieldInstances["1000000164"] = priorityObj;
        }

        let updateTaskStatus = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.task-lib:Task", taskGuid, taskData);
        return updateTaskStatus.status;
    }

    async updateCase(caseGuid: string, data: ICase): Promise<boolean> {
        let caseData = cloneDeep(UPDATE_CASE);
        caseData.id = caseGuid;

        if (data.summary) {
            let caseSummary = {
                "id": "8",
                "value": `${data.summary}`
            }
            caseData.fieldInstances["8"] = caseSummary;
        }

        if (data.description) {
            let caseDescription = {
                "id": "1000000000",
                "value": `${data.description}`
            }
            caseData.fieldInstances["1000000000"] = caseDescription;
        }

        if (data.casePriority) {
            let priorityValue = constants.CasePriority[data.casePriority];
            let priorityObj = {
                "id": "1000000164",
                "value": `${priorityValue}`
            }
            caseData.fieldInstances["1000000164"] = priorityObj;
        }

        if (data.statusChangedDate) {
            let caseDescription = {
                "id": 450000172,
                "value": `${data.statusChangedDate}`
            }
            caseData.fieldInstances["450000172"] = caseDescription;
        }

        let updateCase = await coreApi.updateRecordInstance('com.bmc.dsm.case-lib:Case', caseGuid, caseData);
        return updateCase.status == 204;
    }

    async createCaseTemplate(data: ICaseTemplate): Promise<IIDs> {
        let templateData = cloneDeep(CASE_TEMPLATE_PAYLOAD);

        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[7].value = constants.CaseTemplate[data.templateStatus];
        templateData.fieldInstances[301566300].value = data.ownerCompany ? await apiCoreUtil.getOrganizationGuid(data.ownerCompany) : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.company ? await apiCoreUtil.getOrganizationGuid(data.company) : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[450000401].value = data.ownerBU ? await apiCoreUtil.getBusinessUnitGuid(data.ownerBU) : templateData.fieldInstances[450000401].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? await coreApi.getSupportGroupGuid(data.ownerGroup) : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[1000000063].value = data.categoryTier1 ? await coreApi.getCategoryGuid(data.categoryTier1) : templateData.fieldInstances[1000000063].value;
        templateData.fieldInstances[1000000064].value = data.categoryTier2 ? await coreApi.getCategoryGuid(data.categoryTier2) : templateData.fieldInstances[1000000064].value;
        templateData.fieldInstances[1000000065].value = data.categoryTier3 ? await coreApi.getCategoryGuid(data.categoryTier3) : templateData.fieldInstances[1000000065].value;
        templateData.fieldInstances[450000061].value = data.description ? data.description : templateData.fieldInstances[450000061].value;

        if (data.caseStatus) {
            let statusValue = constants.CaseStatus[data.caseStatus];
            let caseTemplateStatus = {
                "id": "450000021",
                "value": `${statusValue}`
            }
            templateData.fieldInstances["450000021"] = caseTemplateStatus;
        }

        if (data.caseStatus) {
            let statusGuid = await coreApi.getStatusGuid('com.bmc.dsm.case-lib', constants.CaseStatus[data.caseStatus]);
            let caseTemplateStatusGuid = {
                "id": "450000010",
                "value": `${statusGuid}`
            }
            templateData.fieldInstances["450000010"] = caseTemplateStatusGuid;
        }

        if (data.statusReason) {
            let statusReasonGuid = await coreApi.getStatusChangeReasonGuid(data.statusReason);
            let statusReasonObj = {
                "id": "1000000881",
                "value": `${statusReasonGuid}`
            }
            templateData.fieldInstances["1000000881"] = statusReasonObj;
        }

        if (data.allowCaseReopen == false) {
            let allowCaseReopenObj = {
                "id": "450000159",
                "value": 0
            }
            templateData.fieldInstances["450000159"] = allowCaseReopenObj;
        }

        if (data.casePriority) {
            let priorityValue = constants.CasePriority[data.casePriority];
            let priorityObj = {
                "id": "1000000164",
                "value": `${priorityValue}`
            }
            templateData.fieldInstances["1000000164"] = priorityObj;
        }

        if (data.resolutionCode) {
            let resolutionCodeObj = {
                "id": "450000162",
                "value": `${data.resolutionCode}`
            }
            templateData.fieldInstances["450000162"] = resolutionCodeObj;
        }


        if (data.resolutionDescription) {
            let resolutionDescriptionObj = {
                "id": "450000164",
                "value": `${data.resolutionDescription}`
            }
            templateData.fieldInstances["450000164"] = resolutionDescriptionObj;
        }

        if (data.assignee) {
            let assignee = await coreApi.getPersonGuid(data.assignee);
            let caseTemplateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = caseTemplateDataAssignee;
        }

        if (data.label) {
            let labelGuid = await coreApi.getLabelGuid(data.label);
            let caseTemplateDataLabel = {
                "id": 450000160,
                "value": `${labelGuid}`
            }
            templateData.fieldInstances["450000160"] = caseTemplateDataLabel;
        }

        if (data.supportGroup) {
            let assignedCompanyGuid = await coreApi.getOrganizationGuid(data.company);
            let taskTemplateDataassignedCompany = {
                "id": 450000154,
                "value": `${assignedCompanyGuid}`
            }
            templateData.fieldInstances["450000154"] = taskTemplateDataassignedCompany;

            let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.supportGroup);
            let caseTemplateDataSupportAssignee = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = caseTemplateDataSupportAssignee;
        }
        if (data.businessUnit) {
            let assigneeBusinessUnit = await coreApi.getBusinessUnitGuid(data.businessUnit);
            let caseTemplateDataBusinessUnit = {
                "id": 450000381,
                "value": `${assigneeBusinessUnit}`
            }
            templateData.fieldInstances["450000381"] = caseTemplateDataBusinessUnit;
        }

        if (data.categoryTier4) {
            let categoryTier4 = await coreApi.getCategoryGuid(data.categoryTier4);
            let caseTemplateDataCategoryTier4 = {
                "id": 450000158,
                "value": `${categoryTier4}`
            }
            templateData.fieldInstances["450000158"] = caseTemplateDataCategoryTier4;
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
        let updateStatusPayload = cloneDeep(CASE_TEMPLATE_STATUS_UPDATE_PAYLOAD);
        updateStatusPayload.id = caseTemplateGuid;
        updateStatusPayload.fieldInstances[7].value = constants.CaseTemplate[status];
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
            let priorityValue = constants.CasePriority[data.priority];
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
        let templateData = cloneDeep(MANUAL_TASK_TEMPLATE_PAYLOAD);
        templateData.fieldInstances[7].value = constants.TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[301566300].value = data.ownerCompany ? await apiCoreUtil.getOrganizationGuid(data.ownerCompany) : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.taskCompany ? await apiCoreUtil.getOrganizationGuid(data.taskCompany) : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? await apiCoreUtil.getSupportGroupGuid(data.ownerGroup) : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[450000401].value = data.ownerBusinessUnit ? await apiCoreUtil.getBusinessUnitGuid(data.ownerBusinessUnit) : templateData.fieldInstances[450000401].value;
        if (data.assignee) {
            let assignee = await coreApi.getPersonGuid(data.assignee);
            let templateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = templateDataAssignee;
        }
        if (data.supportGroup) {
            let assignedCompanyGuid = await coreApi.getOrganizationGuid(data.ownerCompany);
            let taskTemplateDataassignedCompany = {
                "id": 450000153,
                "value": `${assignedCompanyGuid}`
            }
            templateData.fieldInstances["450000153"] = taskTemplateDataassignedCompany;

            let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.supportGroup);
            let templateDataSupportGroup = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = templateDataSupportGroup;
        }
        if (data.businessUnit) {
            let assigneeBusinessUnit = await coreApi.getBusinessUnitGuid(data.businessUnit);
            let templateDataBusinessUnit = {
                "id": 450000381,
                "value": `${assigneeBusinessUnit}`
            }
            templateData.fieldInstances["450000381"] = templateDataBusinessUnit;
        }
        if (data.category1) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category1);
            let templateCategory1 = {
                "id": 1000000063,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000063"] = templateCategory1;
        }
        if (data.category2) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category2);
            let templateCategory2 = {
                "id": 1000000064,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000064"] = templateCategory2;
        }
        if (data.category3) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category3);
            let templateCategory3 = {
                "id": 1000000065,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000065"] = templateCategory3;
        }
        if (data.category4) {
            let categoryTier4 = await coreApi.getCategoryGuid(data.category4);
            let caseTemplateDataCategoryTier4 = {
                "id": 450000157,
                "value": `${categoryTier4}`
            }
            templateData.fieldInstances["450000157"] = caseTemplateDataCategoryTier4;
        }
        if (data.label) {
            let labelGuid = await coreApi.getLabelGuid(data.label);
            let taskTemplateDataLabel = {
                "id": 450000160,
                "value": `${labelGuid}`
            }
            templateData.fieldInstances["450000160"] = taskTemplateDataLabel;
        }
        if (data.description) {
            let descriptionData = {
                "id": 450000061,
                "value": data.description
            }
            templateData.fieldInstances["450000061"] = descriptionData;
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
        let templateData = cloneDeep(EXTERNAL_TASK_TEMPLATE_PAYLOAD);
        templateData.fieldInstances[7].value = constants.TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[301566300].value = data.ownerCompany ? await apiCoreUtil.getOrganizationGuid(data.ownerCompany) : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.taskCompany ? await apiCoreUtil.getOrganizationGuid(data.taskCompany) : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? await apiCoreUtil.getSupportGroupGuid(data.ownerGroup) : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[450000401].value = data.ownerBusinessUnit ? await apiCoreUtil.getBusinessUnitGuid(data.ownerBusinessUnit) : templateData.fieldInstances[450000401].value;

        if (data.assignee) {
            let assignee = await coreApi.getPersonGuid(data.assignee);
            let templateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = templateDataAssignee;
        }

        if (data.supportGroup) {
            let assignedCompanyGuid = await coreApi.getOrganizationGuid(data.ownerCompany);
            let taskTemplateDataassignedCompany = {
                "id": 450000153,
                "value": `${assignedCompanyGuid}`
            }
            templateData.fieldInstances["450000153"] = taskTemplateDataassignedCompany;

            let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.supportGroup);
            let templateDataSupportGroup = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = templateDataSupportGroup;
        }

        if (data.businessUnit) {
            let assigneeBusinessUnit = await coreApi.getBusinessUnitGuid(data.businessUnit);
            let templateDataBusinessUnit = {
                "id": 450000381,
                "value": `${assigneeBusinessUnit}`
            }
            templateData.fieldInstances["450000381"] = templateDataBusinessUnit;
        }
        if (data.category1) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category1);
            let templateCategory1 = {
                "id": 1000000063,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000063"] = templateCategory1;
        }
        if (data.category2) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category2);
            let templateCategory2 = {
                "id": 1000000064,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000064"] = templateCategory2;
        }
        if (data.category3) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category3);
            let templateCategory3 = {
                "id": 1000000065,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000065"] = templateCategory3;
        }
        if (data.description) {
            let descriptionData = {
                "id": 450000061,
                "value": data.description
            }
            templateData.fieldInstances["450000061"] = descriptionData;
        }
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
        let templateData = cloneDeep(AUTO_TASK_TEMPLATE_PAYLOAD);
        templateData.fieldInstances[7].value = constants.TaskTemplate[data.templateStatus];
        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[450000154].value = data.processBundle;
        templateData.fieldInstances[450000141].value = data.processName;
        templateData.fieldInstances[301566300].value = data.ownerCompany ? await apiCoreUtil.getOrganizationGuid(data.ownerCompany) : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.taskCompany ? await apiCoreUtil.getOrganizationGuid(data.taskCompany) : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? await apiCoreUtil.getSupportGroupGuid(data.ownerGroup) : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[450000401].value = data.ownerBusinessUnit ? await apiCoreUtil.getBusinessUnitGuid(data.ownerBusinessUnit) : templateData.fieldInstances[450000401].value;
        if (data.priority) {
            let priority = constants.CasePriority[data.priority];
            let taskTemplateDataPriority = {
                "id": 1000000164,
                "value": `${priority}`
            }
            templateData.fieldInstances["1000000164"] = taskTemplateDataPriority;
        }
        if (data.category1) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category1);
            let templateCategory1 = {
                "id": 1000000063,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000063"] = templateCategory1;
        }
        if (data.category2) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category2);
            let templateCategory2 = {
                "id": 1000000064,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000064"] = templateCategory2;
        }
        if (data.category3) {
            let categoryGuid = await coreApi.getCategoryGuid(data.category3);
            let templateCategory3 = {
                "id": 1000000065,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000065"] = templateCategory3;
        }
        if (data.description) {
            let descriptionData = {
                "id": 450000061,
                "value": data.description
            }
            templateData.fieldInstances["450000061"] = descriptionData;
        }
        let newTaskTemplate: AxiosResponse = await coreApi.createRecordInstance(templateData);

        console.log('Create Automated Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );

        let docData = cloneDeep(DOC_FOR_AUTO_TASK_TEMPLATE);
        docData.targetTemplateId = taskTemplateDetails.data.id;
        docData.targetTemplateName = data.templateName;
        let newAutoTemplateDoc: AxiosResponse = await coreApi.createDocumentForAutoTaskTemplate(docData);
        console.log('Create Document for Automated Task Template API Status =============>', newAutoTemplateDoc.status);

        let processData = cloneDeep(PROCESS_FOR_AUTO_TASK_TEMPLATE);
        processData.targetTemplateId = taskTemplateDetails.data.id;
        processData.targetTemplateName = data.templateName;
        processData.targetProcess = data.processBundle + ":" + data.processName;
        data.ownerCompany ? processData.targetProcessTag = await apiCoreUtil.getOrganizationGuid(data.ownerCompany) : processData.targetProcessTag;
        let newAutoTemplateProcess: AxiosResponse = await coreApi.createProcessForAutoTaskTemplate(processData);
        console.log('Create Process for Automated Task Template API Status =============>', newAutoTemplateProcess.status);

        console.log('New Automated Task Template Details API Status =============>', taskTemplateDetails.status, newAutoTemplateDoc.status, newAutoTemplateProcess.status);
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

            if (data.status != null) {
                let statusValue = constants.SupportGroup[data.status];
                let statusObj = {
                    "id": "7",
                    "value": `${statusValue}`
                }
                suppGrpData.fieldInstances["7"] = statusObj;
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
            userData.fieldInstances[1000000048].value = data.emailId ? data.emailId : userData.fieldInstances[1000000048].value;
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
            data.company ? updateUser.fieldInstances[536870913].value = await coreApi.getOrganizationGuid(data.company) : updateUser.fieldInstances[536870913].value;
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

    async associatePersonToCompany(userId: string, company: string): Promise<boolean> {
        let userGuid = await coreApi.getPersonGuid(userId);
        let companyGuid = await coreApi.getOrganizationGuid(company);
        let response = await coreApi.associateFoundationElements("Agent Supports Primary Organization", userGuid, companyGuid);
        return response.status == 204;
    }

    async associatePersonToSupportGroup(userId: string, supportGroup: string): Promise<boolean> {
        let userGuid = await coreApi.getPersonGuid(userId);
        let supportGroupGuid = await coreApi.getSupportGroupGuid(supportGroup);
        let response = await coreApi.associateFoundationElements("Person to Support Secondary Organization", userGuid, supportGroupGuid);
        return response.status == 204;
    }

    async associateCategoryToOrganization(category: string, organization: string): Promise<boolean> {
        let organizationGuid = await coreApi.getOrganizationGuid(organization);
        let categoryGuid = await coreApi.getCategoryGuid(category);
        let response = await coreApi.associateFoundationElements("Organization Uses Categorization", organizationGuid, categoryGuid);
        return response.status == 204;
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

    async associateCategoryToCategory(category1: string, category2: string): Promise<boolean> {
        let category1Guid = await coreApi.getCategoryGuid(category1);
        let category2Guid = await coreApi.getCategoryGuid(category2);
        let response = await coreApi.associateFoundationElements("Categorization to Categorization", category1Guid, category2Guid);
        return response.status == 204;
    }

    async associateCategoryUnderDomainTag(categoryTier: string, domainTagGuid: string): Promise<boolean> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.associateDomainTagToCategory;
        //get category guid to associate under domain tag
        let categoryGuid = await coreApi.getCategoryGuid(categoryTier);
        domainTagData.id = categoryGuid;
        domainTagData.fieldInstances[304417331].value = domainTagGuid;
        let domainTagResponse: AxiosResponse = await coreApi.updateRecordInstance("com.bmc.arsys.rx.foundation:Operational Category", categoryGuid, domainTagData);
        console.log("category associated under domain tag: " + domainTagResponse.status);
        return domainTagResponse.status == 204;
    }

    async associateCaseTemplateWithOneTaskTemplate(caseTemplateId: string, taskTemplateId: string): Promise<boolean> {
        let oneTaskFlowProcess = cloneDeep(ONE_TASKFLOW);
        let taskTemplateGuid = await coreApi.getTaskTemplateGuid(taskTemplateId);
        let randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        // give new name to process
        oneTaskFlowProcess.name = oneTaskFlowProcess.name + "_" + randomString;
        // get case company and update in payload
        oneTaskFlowProcess.tags[0] = await apiCoreUtil.getCaseTemplateCompanyGuid(caseTemplateId);
        // update task template data in payload
        let taskTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid);
        let taskSummary = taskTemplateJsonData.fieldInstances[8].value;
        let taskName = taskTemplateJsonData.fieldInstances[1000001437].value;
        oneTaskFlowProcess.flowElements[2].inputMap[1].expression = `"${taskSummary}"`;
        oneTaskFlowProcess.flowElements[2].inputMap[2].expression = `"${taskTemplateGuid}"`;
        oneTaskFlowProcess.layout = (oneTaskFlowProcess.layout).replace("New Task", taskName);
        // create new doc and update in payload
        let docData = cloneDeep(PROCESS_DOCUMENT);
        docData.name = docData.name + "_" + randomString;
        let newDocForProcess: AxiosResponse = await coreApi.createDocumentForProcess(docData);
        console.log('Create Document for TaskFlow Process =============>', newDocForProcess.status);
        oneTaskFlowProcess.inputParams[0].documentDefinitionName = docData.name;
        // create process
        let processGuid = await coreApi.createProcess(oneTaskFlowProcess);
        console.log('New Process Created =============>', oneTaskFlowProcess.name, "=====GUID:", processGuid);
        // link task flow process to case template
        let caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = oneTaskFlowProcess.name;
        let associateCaseTemplateWithOneTaskTemplateResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
        console.log('AssociateCaseTemplateWithOneTaskTemplateResponse API Status =============>', associateCaseTemplateWithOneTaskTemplateResponse.status);
        return associateCaseTemplateWithOneTaskTemplateResponse.status == 204;
    }

    async associateCaseTemplateWithTwoTaskTemplate(caseTemplateId: string, taskTemplateId1: string, taskTemplateId2: string, order: string): Promise<boolean> {
        let twoTaskFlowProcess: any;
        if (order.toLocaleLowerCase() === 'sequential')
            twoTaskFlowProcess = cloneDeep(TWO_TASKFLOW_SEQUENTIAL);

        if (order.toLocaleLowerCase() === 'parallel')
            twoTaskFlowProcess = cloneDeep(TWO_TASKFLOW_PARALLEL);

        let taskTemplateGuid1 = await coreApi.getTaskTemplateGuid(taskTemplateId1);
        let taskTemplateGuid2 = await coreApi.getTaskTemplateGuid(taskTemplateId2);
        // give new name to process
        let randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        twoTaskFlowProcess.name = await twoTaskFlowProcess.name + "_" + randomString;
        // get case company and update in payload
        twoTaskFlowProcess.tags[0] = await apiCoreUtil.getCaseTemplateCompanyGuid(caseTemplateId);
        // update task template data in payload
        let taskTemplateJsonData1 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid1);
        let taskSummary1 = taskTemplateJsonData1.fieldInstances[8].value;
        let taskName1 = taskTemplateJsonData1.fieldInstances[1000001437].value;
        let taskTemplateJsonData2 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid2);
        let taskSummary2 = taskTemplateJsonData2.fieldInstances[8].value;
        let taskName2 = taskTemplateJsonData2.fieldInstances[1000001437].value;
        twoTaskFlowProcess.flowElements[2].inputMap[1].expression = `"${taskSummary1}"`;
        twoTaskFlowProcess.flowElements[3].inputMap[1].expression = `"${taskSummary2}"`;
        twoTaskFlowProcess.flowElements[2].inputMap[2].expression = `"${taskTemplateGuid1}"`;
        twoTaskFlowProcess.flowElements[3].inputMap[2].expression = `"${taskTemplateGuid2}"`;
        twoTaskFlowProcess.layout = (twoTaskFlowProcess.layout).replace("New Task 1", taskName1);
        twoTaskFlowProcess.layout = (twoTaskFlowProcess.layout).replace("New Task 2", taskName2);
        // create new doc and update in payload
        let docData = cloneDeep(PROCESS_DOCUMENT);
        docData.name = docData.name + "_" + randomString;
        let newDocForProcess: AxiosResponse = await coreApi.createDocumentForProcess(docData);
        console.log('Create Document for TaskFlow Process =============>', newDocForProcess.status);
        twoTaskFlowProcess.inputParams[0].documentDefinitionName = docData.name;
        // create process
        let processGuid = await coreApi.createProcess(twoTaskFlowProcess);
        console.log('New Process Created =============>', twoTaskFlowProcess.name, "=====GUID:", processGuid);
        // link task flow process to case template
        let caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = twoTaskFlowProcess.name;
        let associateCaseTemplateWithTwoTaskTemplateResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
        console.log('AssociateCaseTemplateWithOneTaskTemplateResponse API Status =============>', associateCaseTemplateWithTwoTaskTemplateResponse.status);
        return associateCaseTemplateWithTwoTaskTemplateResponse.status == 204;
    }

    async associateCaseTemplateWithThreeTaskTemplate(caseTemplateId: string, taskTemplateId1: string, taskTemplateId2: string, taskTemplateId3: string, structure?: any): Promise<boolean> {
        let threeTaskFlowProcess: any = cloneDeep(THREE_TASKFLOW_SEQUENTIAL);
        if (structure) threeTaskFlowProcess = threeTaskFlowProcess;

        let taskTemplateGuid1 = await coreApi.getTaskTemplateGuid(taskTemplateId1);
        let taskTemplateGuid2 = await coreApi.getTaskTemplateGuid(taskTemplateId2);
        let taskTemplateGuid3 = await coreApi.getTaskTemplateGuid(taskTemplateId3);
        // give new name to process        
        let randomString: string = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        threeTaskFlowProcess.name = await threeTaskFlowProcess.name + "_" + randomString;
        // get case company and update in payload
        threeTaskFlowProcess.tags[0] = await apiCoreUtil.getCaseTemplateCompanyGuid(caseTemplateId);
        // update task template data in payload
        let taskTemplateJsonData1 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid1);
        let taskSummary1 = taskTemplateJsonData1.fieldInstances[8].value;
        let taskName1 = taskTemplateJsonData1.fieldInstances[1000001437].value;
        let taskTemplateJsonData2 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid2);
        let taskSummary2 = taskTemplateJsonData2.fieldInstances[8].value;
        let taskName2 = taskTemplateJsonData2.fieldInstances[1000001437].value;
        let taskTemplateJsonData3 = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.task-lib:Task Template", taskTemplateGuid3);
        let taskSummary3 = taskTemplateJsonData3.fieldInstances[8].value;
        let taskName3 = taskTemplateJsonData3.fieldInstances[1000001437].value;
        threeTaskFlowProcess.flowElements[2].inputMap[1].expression = `"${taskSummary1}"`;
        threeTaskFlowProcess.flowElements[3].inputMap[1].expression = `"${taskSummary2}"`;
        threeTaskFlowProcess.flowElements[4].inputMap[1].expression = `"${taskSummary3}"`;
        threeTaskFlowProcess.flowElements[2].inputMap[2].expression = `"${taskTemplateGuid1}"`;
        threeTaskFlowProcess.flowElements[3].inputMap[2].expression = `"${taskTemplateGuid2}"`;
        threeTaskFlowProcess.flowElements[4].inputMap[2].expression = `"${taskTemplateGuid3}"`;
        threeTaskFlowProcess.layout = (threeTaskFlowProcess.layout).replace("New Task 1", taskName1);
        threeTaskFlowProcess.layout = (threeTaskFlowProcess.layout).replace("New Task 2", taskName2);
        threeTaskFlowProcess.layout = (threeTaskFlowProcess.layout).replace("New Task 3", taskName3);
        // create new doc and update in payload
        let docData = cloneDeep(PROCESS_DOCUMENT);
        docData.name = docData.name + "_" + randomString;
        let newDocForProcess: AxiosResponse = await coreApi.createDocumentForProcess(docData);
        console.log('Create Document for TaskFlow Process =============>', newDocForProcess.status);
        threeTaskFlowProcess.inputParams[0].documentDefinitionName = docData.name;
        // create process
        let processGuid = await coreApi.createProcess(threeTaskFlowProcess);
        console.log('New Process Created =============>', threeTaskFlowProcess.name, "=====GUID:", processGuid);
        // link task flow process to case template
        let caseTemplateGuid = await coreApi.getCaseTemplateGuid(caseTemplateId);
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = threeTaskFlowProcess.name;
        let associateCaseTemplateWithThreeTaskTemplateResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
        console.log('AssociateCaseTemplateWithOneTaskTemplateResponse API Status =============>', associateCaseTemplateWithThreeTaskTemplateResponse.status);
        return associateCaseTemplateWithThreeTaskTemplateResponse.status == 204;
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

    async createKnowledgeArticle(data: IKnowledgeArticles, attachment?: string): Promise<IIDs> {
        let knowledgeArticleResponse: AxiosResponse;
        let knowledgeArticleData = cloneDeep(KNOWLEDGE_ARTICLE_PAYLOAD);

        if (attachment) {
            knowledgeArticleData.fieldInstances[301820700].value = data.knowledgeSet;
            knowledgeArticleData.fieldInstances[302300502].value = data.title;
            knowledgeArticleData.fieldInstances[302312187].value = data.templateId;
            knowledgeArticleData.fieldInstances[1000000001].value = data.company ? await coreApi.getOrganizationGuid(data.company) : knowledgeArticleData.fieldInstances[1000000001].value;
            knowledgeArticleData.fieldInstances[302301262].value = data.keyword ? data.keyword : knowledgeArticleData.fieldInstances[302301262].value;
            knowledgeArticleData.fieldInstances[302311201].value = data.articleDesc ? data.articleDesc : knowledgeArticleData.fieldInstances[302311201].value;

            if (data.assignedCompany) {
                let companyGuid = await coreApi.getOrganizationGuid(data.assignedCompany);
                let assignedCompanyData = {
                    "id": 450000157,
                    "value": `${companyGuid}`
                }
                knowledgeArticleData.fieldInstances["450000157"] = assignedCompanyData;
            }

            if (data.site) {
                let siteGuid = await coreApi.getSiteGuid(data.site);
                let siteData = {
                    "id": 260000001,
                    "value": `${siteGuid}`
                }
                knowledgeArticleData.fieldInstances["260000001"] = siteData;
            }

            if (data.region) {
                let regionGuid = await coreApi.getRegionGuid(data.region);
                let regionData = {
                    "id": 200000007,
                    "value": `${regionGuid}`
                }
                knowledgeArticleData.fieldInstances["200000007"] = regionData;
            }

            if (data.categoryTier1) {
                let categGuid = await coreApi.getCategoryGuid(data.categoryTier1);
                let categData = {
                    "id": 1000000063,
                    "value": `${categGuid}`
                }
                knowledgeArticleData.fieldInstances["1000000063"] = categData;
            }

            if (data.categoryTier2) {
                let categGuid = await coreApi.getCategoryGuid(data.categoryTier2);
                let categData = {
                    "id": 1000000064,
                    "value": `${categGuid}`
                }
                knowledgeArticleData.fieldInstances["1000000064"] = categData;
            }

            if (data.categoryTier3) {
                let categGuid = await coreApi.getCategoryGuid(data.categoryTier3);
                let categData = {
                    "id": 1000000065,
                    "value": `${categGuid}`
                }
                knowledgeArticleData.fieldInstances["1000000065"] = categData;
            }

            if (data.assigneeBusinessUnit) {
                let businessUnitGuid = await coreApi.getBusinessUnitGuid(data.assigneeBusinessUnit);
                let businessUnitData = {
                    "id": 450000381,
                    "value": `${businessUnitGuid}`
                }
                knowledgeArticleData.fieldInstances["450000381"] = businessUnitData;
            }

            if (data.assigneeSupportGroup) {
                let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.assigneeSupportGroup);
                let assineeSupportGroupData = {
                    "id": 302300512,
                    "value": `${assigneeSupportGroup}`
                }
                knowledgeArticleData.fieldInstances["302300512"] = assineeSupportGroupData;
            }

            if (data.assignee) {
                let assigneeGuid = await coreApi.getPersonGuid(data.assignee);
                let assigneeData = {
                    "id": 302300513,
                    "value": `${assigneeGuid}`
                }
                knowledgeArticleData.fieldInstances["302300513"] = assigneeData;
            }

            let articleData = {
                recordInstance: knowledgeArticleData,
                302302781: attachment
            };
            knowledgeArticleResponse = await coreApi.multiFormPostWithAttachment(articleData);
            console.log('Create Knowledge Article API Status =============>', knowledgeArticleResponse.status);
        } else {
            knowledgeArticleData.fieldInstances[301820700].value = data.knowledgeSet;
            knowledgeArticleData.fieldInstances[302300502].value = data.title;
            knowledgeArticleData.fieldInstances[302312187].value = data.templateId;
            knowledgeArticleData.fieldInstances[1000000001].value = data.company ? await coreApi.getOrganizationGuid(data.company) : knowledgeArticleData.fieldInstances[1000000001].value;
            knowledgeArticleData.fieldInstances[302301262].value = data.keyword ? data.keyword : knowledgeArticleData.fieldInstances[302301262].value;
            knowledgeArticleData.fieldInstances[302311201].value = data.articleDesc ? data.articleDesc : knowledgeArticleData.fieldInstances[302311201].value;

            if (data.assignedCompany) {
                let companyGuid = await coreApi.getOrganizationGuid(data.assignedCompany);
                let assignedCompanyData = {
                    "id": 450000157,
                    "value": `${companyGuid}`
                }
                knowledgeArticleData.fieldInstances["450000157"] = assignedCompanyData;
            }

            if (data.site) {
                let siteGuid = await coreApi.getSiteGuid(data.site);
                let siteData = {
                    "id": 260000001,
                    "value": `${siteGuid}`
                }
                knowledgeArticleData.fieldInstances["260000001"] = siteData;
            }

            if (data.region) {
                let regionGuid = await coreApi.getRegionGuid(data.region);
                let regionData = {
                    "id": 200000007,
                    "value": `${regionGuid}`
                }
                knowledgeArticleData.fieldInstances["200000007"] = regionData;
            }

            if (data.categoryTier1) {
                let categGuid = await coreApi.getCategoryGuid(data.categoryTier1);
                let categData = {
                    "id": 1000000063,
                    "value": `${categGuid}`
                }
                knowledgeArticleData.fieldInstances["1000000063"] = categData;
            }

            if (data.categoryTier2) {
                let categGuid = await coreApi.getCategoryGuid(data.categoryTier2);
                let categData = {
                    "id": 1000000064,
                    "value": `${categGuid}`
                }
                knowledgeArticleData.fieldInstances["1000000064"] = categData;
            }

            if (data.categoryTier3) {
                let categGuid = await coreApi.getCategoryGuid(data.categoryTier3);
                let categData = {
                    "id": 1000000065,
                    "value": `${categGuid}`
                }
                knowledgeArticleData.fieldInstances["1000000065"] = categData;
            }

            if (data.assigneeBusinessUnit) {
                let businessUnitGuid = await coreApi.getBusinessUnitGuid(data.assigneeBusinessUnit);
                let businessUnitData = {
                    "id": 450000381,
                    "value": `${businessUnitGuid}`
                }
                knowledgeArticleData.fieldInstances["450000381"] = businessUnitData;
            }

            if (data.assigneeSupportGroup) {
                let assigneeSupportGroup = await coreApi.getSupportGroupGuid(data.assigneeSupportGroup);
                let assineeSupportGroupData = {
                    "id": 302300512,
                    "value": `${assigneeSupportGroup}`
                }
                knowledgeArticleData.fieldInstances["302300512"] = assineeSupportGroupData;
            }

            if (data.assignee) {
                let assigneeGuid = await coreApi.getPersonGuid(data.assignee);
                let assigneeData = {
                    "id": 302300513,
                    "value": `${assigneeGuid}`
                }
                knowledgeArticleData.fieldInstances["302300513"] = assigneeData;
            }

            knowledgeArticleResponse = await coreApi.createRecordInstance(knowledgeArticleData);
            console.log('Create Knowledge Article API Status =============>', knowledgeArticleResponse.status);
        }
        if (knowledgeArticleResponse.status == 201) {
            const knowledgeArticleDetails = await axios.get(await knowledgeArticleResponse.headers.location);
            return {
                id: knowledgeArticleDetails.data.id,
                displayId: knowledgeArticleDetails.data.displayId.replace(knowledgeArticleDetails.data.displayId.substring(0, 3), "KA-"),
            };
        }
    }

    async updateKnowledgeArticleStatus(articleGuid: string, articleStatus: string, reviewer?: string, reviewerGroup?: string, reviewerOrg?: string): Promise<boolean> {
        let knowledgeArticleData = cloneDeep(UPDATE_KNOWLEDGE_ARTICLE_PAYLOAD);
        knowledgeArticleData.id = articleGuid;
        knowledgeArticleData.fieldInstances[302300500].value = constants.Knowledge[articleStatus];
        knowledgeArticleData.fieldInstances[536870913].value = await coreApi.getStatusGuid('com.bmc.dsm.knowledge', constants.Knowledge[articleStatus], articleStatus);

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
        await browser.sleep(1000); // hardwait to reflect updated status
        console.log("Update Knowledge Article Status ========>", knowledgeArticleResponse.status);
        return knowledgeArticleResponse.status == 204;
    }

    async flagAndUnflagKnowledgeArticle(knowledgeGuid: string, feedbackCommnent, flagUnflag: number): Promise<boolean> {
        let flagAndUnflagData = cloneDeep(FLAG_UNFLAG_KA);
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

    async deleteEmailOrNotificationTemplate(emailTemplateName: string, company?: string): Promise<boolean> {
        let emailTemplateGuid;
        if (company) {
            emailTemplateGuid = await coreApi.getEmailTemplateGuid(emailTemplateName, company);
        }
        else { emailTemplateGuid = await coreApi.getEmailTemplateGuid(emailTemplateName); }
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
        console.log('New Flowset Details API Status =============>', flowsetDetails.status);

        return {
            id: flowsetDetails.data.id,
            displayId: flowsetDetails.data.displayId
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
        let menuItemFile = await require('../data/api/shared-services/menuItemConfiguration.api.json');
        console.log('New Menu Item API Status =============>');
        let menuItemData = await menuItemFile.MenuItemConfiguration;
        menuItemData.fieldInstances[450000153].value = data.menuType;
        menuItemData.fieldInstances[450000152].value = data.menuItemName;
        menuItemData.fieldInstances[7].value = constants.MenuItemStatus[data.menuItemStatus];
        menuItemData.fieldInstances[450000154].value = randomStr;
        if (data.uiVisiable) {
            let valueOfVisiable = data.uiVisiable;
            let uiVisiablePayload = {
                "id": "450000471",
                "value": `${valueOfVisiable}`
            }
            menuItemData.fieldInstances[450000471] = uiVisiablePayload;
        }
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
        defaultNotificationData.fieldInstances[430000003].value = constants.NotificationType[notificationType];
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
        let caseStatusChange = cloneDeep(CASE_STATUS_CHANGE);
        caseStatusChange.id = caseGuid;
        caseStatusChange.fieldInstances[450000021]["value"] = constants.CaseStatus[status];
        if (statusReason) {
            let statusReasonGuid = await apiCoreUtil.getStatusChangeReasonGuid(statusReason);
            let caseStatusReasonPayload = {
                "id": "1000000881",
                "value": `${statusReasonGuid}`
            }
            caseStatusChange.fieldInstances[1000000881] = caseStatusReasonPayload;
        }

        let updateCaseStatus = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case", caseGuid, caseStatusChange);
        await browser.sleep(1000); // hardwait to reflect updated status
        console.log(`Changing the case to ${status} API status is =============>`, updateCaseStatus.status);
        return updateCaseStatus.status;
    }

    async createProcessLibConfig(data: IProcessLibConfig): Promise<IIDs> {
        let newProcessConfig = cloneDeep(NEW_PROCESS_LIB);
        newProcessConfig.fieldInstances[61001]["value"] = data.applicationServicesLib;
        newProcessConfig.fieldInstances[450000002]["value"] = data.processName;
        newProcessConfig.fieldInstances[450000003]["value"] = data.processAliasName;
        newProcessConfig.fieldInstances[7]["value"] = data.status ? constants.ProcessLibConf[data.status] : newProcessConfig.fieldInstances[7].value;
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

    async deleteAllApprovalFlow(recordDefinition: string, flowGroupName?: string): Promise<boolean> {
        let uri: string;
        let remoteApprovalFlow: any;
        switch (recordDefinition) {
            case "Case": {
                remoteApprovalFlow = cloneDeep(INVALID_CASE_APPROVAL_FLOW);
                if (flowGroupName) {
                    uri = "api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/com.bmc.dsm.case-lib:Case/flowGroupName/" + flowGroupName;
                    remoteApprovalFlow.flowGroup = flowGroupName;
                }
                else uri = "api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/com.bmc.dsm.case-lib:Case/flowGroupName/BWFA Group";
                break;
            }
            case "Knowledge": {
                remoteApprovalFlow = cloneDeep(INVALID_KM_APPROVAL_FLOW);
                if (flowGroupName) {
                    uri = "api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/com.bmc.dsm.knowledge:Knowledge Article Template/flowGroupName/" + flowGroupName;
                    remoteApprovalFlow.flowGroup = flowGroupName;
                }
                else uri = "api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/com.bmc.dsm.knowledge:Knowledge Article Template/flowGroupName/Default Article Approval Flow Group";
                break;
            }
            default: {
                console.log('Put valid Record Definition for approval flow deletion');
                break;
            }
        }

        if (!flowGroupName) {

        } else {


        }

        const putOnlyRemoteApprovalFlow = await axios.put(
            uri,
            remoteApprovalFlow
        );
        console.log("Delete Approval Flow Status ===== " + putOnlyRemoteApprovalFlow.status);
        return putOnlyRemoteApprovalFlow.status == 204;
    }

    async runAutomatedCaseTransitionProcess(): Promise<number> {
        let automatedCaseTransition = cloneDeep(AUTOMATED_CASE_STATUS_TRANSITION);
        let response = await axios.post(
            commandUri,
            automatedCaseTransition
        )
        return response.status;
    }

    async createDocumentLibrary(docLibDetails: IDocumentLib, filePath: string): Promise<IIDs> {
        let documentLibRecordInstanceJson = cloneDeep(DOC_LIB_DRAFT);
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
        let publishDocLibPayload = cloneDeep(DOC_LIB_PUBLISH);
        publishDocLibPayload.id = docLibInfo.id;
        publishDocLibPayload.displayId = docLibInfo.displayId;

        let publishDocLibResponse: AxiosResponse = await coreApi.updateRecordInstance('com.bmc.dsm.knowledge:Knowledge Article', docLibInfo.id, publishDocLibPayload);
        console.log('Publish Doc Lib API Status =============>', publishDocLibResponse.status);
        return publishDocLibResponse.status == 204;
    }

    async giveReadAccessToDocLib(docLibInfo: IIDs, orgName: string): Promise<boolean> {
        let readAccessDocLibPayload = cloneDeep(DOC_LIB_READ_ACCESS);
        readAccessDocLibPayload['processInputValues']['Record Instance ID'] = docLibInfo.id;
        let orgId = await coreApi.getOrganizationGuid(orgName);
        if (orgId == null) { orgId = await coreApi.getBusinessUnitGuid(orgName); }
        if (orgId == null) { orgId = await coreApi.getDepartmentGuid(orgName); }
        if (orgId == null) { orgId = await coreApi.getSupportGroupGuid(orgName); }
        readAccessDocLibPayload['processInputValues']['Value'] = orgId;
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
        let knowledgeSetData = cloneDeep(KNOWLEDGE_SET);
        knowledgeSetData.fieldInstances[8].value = knowledgeSetDetails.knowledgeSetDesc;
        knowledgeSetData.fieldInstances[301820700].value = knowledgeSetDetails.knowledgeSetTitle;
        knowledgeSetData.fieldInstances[1000000001].value = await apiCoreUtil.getOrganizationGuid(knowledgeSetDetails.company);

        let recordInstanceKSetAssociationJson = cloneDeep(KNOWLEDEGESET_ASSOCIATION);
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
        let knowledgeSetAccess = cloneDeep(KNOWLEDGESET_PERMISSION);
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

    async createKnowledgeArticleTemplate(knowledgeSetTitle: string, knowledgeSetId: string, data: any): Promise<boolean> {
        let knowledgeSetTemplateData = cloneDeep(KNOWLEDGEARTICLE_TEMPLATE);
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
        return articleTemplateResponse.status === 200;
    }

    async updateKnowledgeArticleViewAndHelpFulCounter(knowledgeArticleGuid: string, data: any): Promise<boolean> {
        let knowledgeArticleHelpfulCounterData = cloneDeep(KNOWLEDGEARTICLE_HELPFULCOUNTER);
        knowledgeArticleHelpfulCounterData.id = knowledgeArticleGuid;
        knowledgeArticleHelpfulCounterData.fieldInstances[302299521].value = data.linkedCounter;
        knowledgeArticleHelpfulCounterData.fieldInstances[302309761].value = data.helpfulPercentage;
        knowledgeArticleHelpfulCounterData.fieldInstances[302311190].value = data.helpfulCounter;
        knowledgeArticleHelpfulCounterData.fieldInstances[302311191].value = data.viewCounter;
        knowledgeArticleHelpfulCounterData.fieldInstances[302299491].value = data.notHelpfulCounter;

        let uri: string = "api/rx/application/record/recordinstance/com.bmc.dsm.knowledge:Knowledge Article Template/" + knowledgeArticleGuid;
        const updateArticleHelpfulCounterResponse = await axios.put(
            uri,
            knowledgeArticleHelpfulCounterData
        );
        console.log("Alert status ===== " + updateArticleHelpfulCounterResponse.status);
        return updateArticleHelpfulCounterResponse.status == 204;
    }

    async updatePersonAsVIP(personName: string, vipStatus: string): Promise<boolean> {
        let updatePersonAsVip = cloneDeep(UPDATE_PERSON_AS_VIP);
        let personGuid = await coreApi.getPersonGuid(personName);
        updatePersonAsVip.id = personGuid;
        vipStatus == 'Yes' ? updatePersonAsVip.fieldInstances[1000000026].value = 100 : 200;
        let updatePersonAsVIPResponse = await coreApi.updateRecordInstance('com.bmc.arsys.rx.foundation:Person', personGuid, updatePersonAsVip);
        return updatePersonAsVIPResponse.status == 204;
    }

    async createSVT(svtData: any): Promise<IIDs> {
        let serviceTargetPayload = cloneDeep(SERVICE_TARGET_PAYLOAD);
        serviceTargetPayload.fieldInstances[300271400].value = svtData.terms;
        serviceTargetPayload.fieldInstances[304412691].value = svtData.readableTerms;
        serviceTargetPayload.fieldInstances[300273000].value = svtData.startWhen;
        serviceTargetPayload.fieldInstances[304411891].value = svtData.readableStartWhen;
        serviceTargetPayload.fieldInstances[300273100].value = svtData.stopWhen;
        serviceTargetPayload.fieldInstances[304411911].value = svtData.readableStopWhen;
        serviceTargetPayload.fieldInstances[300398100].value = svtData.goalTimeMinutes;
        serviceTargetPayload.fieldInstances[490000400].value = svtData.svtName;
        serviceTargetPayload.fieldInstances[300523400].value = await coreApi.getDataSourceGuid(svtData.dataSource);
        serviceTargetPayload.fieldInstances[304412961].value = await coreApi.getOrganizationGuid(svtData.company);
        //SERVICE_TARGET.fieldInstances[300272100].value = -1

        let slmResponse: AxiosResponse = await coreApi.createRecordInstance(serviceTargetPayload);
        console.log('Create Service Target API Status =============>', slmResponse.status);
        const slmDetails = await axios.get(
            await slmResponse.headers.location
        );
        console.log('New SVT Details API Status =============>', slmDetails.status);

        return {
            id: slmDetails.data.id,
            displayId: slmDetails.data.displayId
        };
    }

    async createAdhocTask(caseGuid: string, taskData: IAdhocTask): Promise<IIDs> {
        let adhocTaskPayload = cloneDeep(ADHOC_TASK_PAYLOAD);
        adhocTaskPayload.fieldInstances[8].value = taskData.taskName;
        adhocTaskPayload.fieldInstances[536870913].value = caseGuid;
        adhocTaskPayload.fieldInstances[1000000001].value = await coreApi.getOrganizationGuid(taskData.company);
        adhocTaskPayload.fieldInstances[450000152].value = await coreApi.getPersonGuid(taskData.assignee);
        adhocTaskPayload.fieldInstances[450000381].value = await coreApi.getBusinessUnitGuid(taskData.businessUnit);
        adhocTaskPayload.fieldInstances[1000000217].value = await coreApi.getSupportGroupGuid(taskData.supportGroup);
        taskData.priority ? adhocTaskPayload.fieldInstances[1000000164].value = constants.CasePriority[taskData.priority] : adhocTaskPayload.fieldInstances[1000000164].value;

        let createTaskResponse = await coreApi.createRecordInstance(adhocTaskPayload);
        console.log('Create Task API Status =============>', createTaskResponse.status);
        const taskDetails = await axios.get(
            await createTaskResponse.headers.location
        );
        console.log('New Task Details API Status =============>', taskDetails.status);

        let registerAdhocTask = cloneDeep(REGISTER_ADHOC_TASK);
        registerAdhocTask.processInputValues["Task Id"] = taskDetails.data.id;
        const registerAdhocTaskResponse = await axios.post(
            commandUri,
            registerAdhocTask
        );
        console.log('Register Adhoc Task API Status =============>', registerAdhocTaskResponse.status);

        return {
            id: taskDetails.data.id,
            displayId: taskDetails.data.displayId
        };
    }

    async updateTaskStatus(taskGuid: string, status: string, statusReason?: string): Promise<number> {
        let updateTaskStatusPayload = cloneDeep(UPDATE_TASK_STATUS);
        updateTaskStatusPayload.id = taskGuid;
        updateTaskStatusPayload.fieldInstances[450000021]["value"] = constants.TaskStatus[status];
        if (statusReason) {
            let statusValue = await apiCoreUtil.getStatusChangeReasonGuid(statusReason);
            let taskStatusReason = {
                "id": "1000000881",
                "value": `${statusValue}`
            }
            updateTaskStatusPayload.fieldInstances["1000000881"] = taskStatusReason;
        }

        let updateTaskStatus = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.task-lib:Task", taskGuid, updateTaskStatusPayload);
        await browser.sleep(1000); // hardwait to reflect updated status
        console.log(`Update task status to ${status} API status is ${updateTaskStatus.status}`);
        return updateTaskStatus.status;
    }

    async addTaskToCase(taskData: any, caseGuid: string): Promise<AxiosResponse> {
        let taskCreationFromTemplate = cloneDeep(TASK_CREATION_FROM_TEMPLATE);
        let templateName = await coreApi.getTaskTemplateGuid(taskData.templateName);
        taskCreationFromTemplate.processInputValues["Case Company"] = await coreApi.getOrganizationGuid(taskData.company);
        taskCreationFromTemplate.processInputValues["Case ID"] = caseGuid;
        taskCreationFromTemplate.processInputValues["Requester ID"] = await coreApi.getPersonGuid(taskData.requesterId);
        taskCreationFromTemplate.processInputValues["Selected Templates"] = "[{\"379\":\"" + templateName + "\"}]";

        const createTaskResponse = await axios.post(
            commandUri,
            taskCreationFromTemplate
        );
        console.log('Add Task to Case from Task Template API Status =============>', createTaskResponse.status);
        return createTaskResponse;
    }

    async getCreatedTaskIds(createTaskResponse: AxiosResponse): Promise<IIDs> {
        let taskId = undefined;
        let taskDisplayId: string = undefined;
        const taskDetails = await axios.get(
            await createTaskResponse.headers.location
        );
        console.log('New Task Details API Status =============>', taskDetails.status);

        let jsonString: string = taskDetails.data.processVariables["Process Instance Activity Results"];
        let splitString = jsonString.split('\"');

        for (let i = 0; i < splitString.length; i++) {
            if (splitString[i] == "displayId" && splitString[i + 2].includes('TASK')) {
                taskDisplayId = splitString[i + 2];
                break;
            }
        }
        for (let i = 0; i < splitString.length; i++) {
            if (splitString[i] == "id") {
                taskId = splitString[i + 2];
                break;
            }
        }

        return {
            id: taskId,
            displayId: taskDisplayId
        };
    }

    async createKnowledgeApprovalMapping(data: any): Promise<boolean> {
        let knowledgeApprovalConfig = cloneDeep(KNOWLEDGE_APPROVAL_CONFIG);
        knowledgeApprovalConfig.fieldInstances[1000000001].value = await apiCoreUtil.getOrganizationGuid(data.company);
        knowledgeApprovalConfig.fieldInstances[1000001437].value = data.configName;
        knowledgeApprovalConfig.fieldInstances[302300500].value = constants.Knowledge[data.status1];
        if (data.status2) {
            knowledgeApprovalConfig.fieldInstances[302300500].value = knowledgeApprovalConfig.fieldInstances[302300500].value + ';' + constants.Knowledge[data.status2];
        }
        if (data.status3) {
            knowledgeApprovalConfig.fieldInstances[302300500].value = knowledgeApprovalConfig.fieldInstances[302300500].value + ';' + constants.Knowledge[data.status3];
        }

        let knowledgeApproval: AxiosResponse = await coreApi.createRecordInstance(knowledgeApprovalConfig);
        console.log('Knowledge Approvals Status =============>', knowledgeApproval.status);
        return knowledgeApproval.status == 201;
    }

    async createKnowledgeApprovalFlow(data: any): Promise<boolean> {
        let knowledgeApprovalFlowConfig = cloneDeep(KNOWLEDGE_APPROVAL_FLOW_CONFIG);
        knowledgeApprovalFlowConfig.approvalFlowConfigurationList[0].flowName = data.flowName;
        knowledgeApprovalFlowConfig.approvalFlowConfigurationList[0].approvers = 'U:' + data.approver;
        knowledgeApprovalFlowConfig.approvalFlowConfigurationList[0].qualification = data.qualification;

        let response = await axios.put(
            "api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/com.bmc.dsm.knowledge:Knowledge Article Template/flowGroupName/Default Article Approval Flow Group",
            knowledgeApprovalFlowConfig,
        )
        console.log('Knowledge Approval Flow Status =============>', response.status);
        return response.status == 204;
    }

    async deleteKnowledgeApprovalMapping(approvalMappingName?: string): Promise<boolean> {
        if (approvalMappingName) {
            let allRecords = await coreApi.getGuid("com.bmc.dsm.knowledge:Knowledge Approval Mapping");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[1000001437] === approvalMappingName;
            });
            let approvalMapGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
            if (approvalMapGuid) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Approval Mapping', approvalMapGuid);
            }
        } else {
            let allApprovalMapRecords = await coreApi.getGuid("com.bmc.dsm.knowledge:Knowledge Approval Mapping");
            let allApprovalMapArrayMap = allApprovalMapRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Approval Mapping', obj[379]);
            });
            return await Promise.all(allApprovalMapArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async approverAction(recordGuid: string, action: string, assignee?: string): Promise<boolean> {
        let approvalAction = cloneDeep(APPROVAL_ACTION);
        approvalAction.commands[0].command = action;
        approvalAction.commands[0].requestID = await coreApi.getSignatureInstanceId(recordGuid);
        if (assignee) {
            approvalAction.commands[0]["assignToApprovers"] = assignee;
        }

        await browser.sleep(20000);
        let response = await axios.post(
            commandUri,
            approvalAction
        );
        console.log('Approver Action API Status =============>', response.status);
        return response.status == 200;
    }

    async updateKnowledgeArticleExternalFlag(articleGuid: string, isExternal: boolean): Promise<boolean> {
        let knowledgeArticleExtFlag = cloneDeep(KNOWLEDGE_ARTICLE_EXTERNAL_FLAG);
        knowledgeArticleExtFlag.id = articleGuid;
        isExternal ? knowledgeArticleExtFlag.fieldInstances[302312186].value = 0 : knowledgeArticleExtFlag.fieldInstances[302312186].value = 1;
        let response = await coreApi.updateRecordInstance('com.bmc.dsm.knowledge:Knowledge Article Template', articleGuid, knowledgeArticleExtFlag);

        console.log('Update Knowledge Article External Flag API Status =============>', response.status);
        return response.status == 204;
    }

    async changeCaseAssignment(caseGuid: string, businessUnit: string, supportGroup: string, assignee?: string): Promise<boolean> {
        let updateCaseAssignment = cloneDeep(UPDATE_CASE_ASSIGNMENT);
        updateCaseAssignment.id = caseGuid;
        updateCaseAssignment.fieldInstances[450000381].value = await coreApi.getBusinessUnitGuid(businessUnit);
        updateCaseAssignment.fieldInstances[1000000217].value = await coreApi.getSupportGroupGuid(supportGroup);
        if (assignee) updateCaseAssignment.fieldInstances[450000152].value = await coreApi.getPersonGuid(assignee);
        let updateAssignmentResponse = await coreApi.updateRecordInstance('com.bmc.dsm.case-lib:Case', caseGuid, updateCaseAssignment);
        console.log('Update Case Assignment API Status =============>', updateAssignmentResponse.status);
        return updateAssignmentResponse.status == 204;
    }

    async enableActionableNotificationSetting(): Promise<boolean> {
        let actionableNotificationEnableSettings = cloneDeep(ACTIONABLE_NOTIFICATIONS_ENABLEMENT_SETTING);
        let config = {
            headers: { 'request-overlay-group': 'Petramco' }
        };

        actionableNotificationEnableSettings.fieldInstances[3205].value = browser.baseUrl;
        let response = await axios.post(
            'api/rx/application/record/recordinstance',
            actionableNotificationEnableSettings,
            config
        );
        console.log('Enabling Actionable Notifications API status =============>', response.status);
        return response.status == 204;
    }

    async addCaseToWatchlistAllEvents(caseGuid: string): Promise<boolean> {
        let addToWatchlist = cloneDeep(ADD_TO_WATCHLIST);
        addToWatchlist.processInputValues.Cases[0][379] = caseGuid;
        let response = await axios.post(
            commandUri,
            addToWatchlist
        );
        console.log('Add Case to Watchlist API status =============>', response.status);
        return response.status == 200;
    }

    async createCaseApprovalFlow(data: any): Promise<boolean> {
        let caseApprovalFlow = cloneDeep(CASE_APPROVAL_FLOW);
        caseApprovalFlow.approvalFlowConfigurationList[0].flowName = data.flowName;
        caseApprovalFlow.approvalFlowConfigurationList[0].approvers = 'U:' + data.approver;
        caseApprovalFlow.approvalFlowConfigurationList[0].qualification = data.qualification;
        let response = await axios.put(
            "api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/com.bmc.dsm.case-lib:Case/flowGroupName/BWFA Group",
            caseApprovalFlow,
        )
        console.log('Case Approval Flow API Status =============>', response.status);
        return response.status == 204;
    }

    async createCaseApprovalMapping(data: ICaseApprovalMapping): Promise<IIDs> {
        let caseApprovalMapping = cloneDeep(CASE_APPROVAL_MAPPING);
        caseApprovalMapping.fieldInstances[303715900].value = await coreApi.getStatusGuid('com.bmc.dsm.case-lib', constants.CaseStatus[data.triggerStatus]);
        caseApprovalMapping.fieldInstances[450000152].value = constants.CaseStatus[data.triggerStatus];
        caseApprovalMapping.fieldInstances[450000153].value = constants.CaseStatus[data.approvedStatus];
        caseApprovalMapping.fieldInstances[450000154].value = constants.CaseStatus[data.rejectStatus];
        caseApprovalMapping.fieldInstances[450000155].value = constants.CaseStatus[data.errorStatus];
        caseApprovalMapping.fieldInstances[450000158].value = constants.CaseStatus[data.noApprovalFoundStatus];
        caseApprovalMapping.fieldInstances[1000001437].value = data.mappingName;
        if (data.company) caseApprovalMapping.fieldInstances[1000000001].value = await coreApi.getOrganizationGuid(data.company);
        let response = await coreApi.createRecordInstance(caseApprovalMapping);
        console.log('Case Approval Mapping API Status =============>', response.status);

        const approvalMapping = await axios.get(
            response.headers.location
        );
        return {
            id: approvalMapping.data.id,
            displayId: approvalMapping.data.displayId
        };
    }

    async createBusinessTimeSharedEntity(name: string, status?: number): Promise<boolean> {
        let businessTimeSharedEntity = cloneDeep(BUSINESS_TIME_SHARED_ENTITY);
        if (status) businessTimeSharedEntity.fieldInstances[7].value = status;
        businessTimeSharedEntity.fieldInstances[8].value = name;
        let response = await coreApi.createRecordInstance(businessTimeSharedEntity);
        console.log('Create Business Shared Entity API Status =============>', response.status);
        return response.status == 204;
    }

    async createBusinessTimeSegment(name: string): Promise<IIDs> {
        let businessTimeSegmentPayload = cloneDeep(BUSINESS_TIME_SEGMENT);
        businessTimeSegmentPayload.fieldInstances[8].value = name;
        let response = await coreApi.createRecordInstance(businessTimeSegmentPayload);
        console.log('Create Business Time Segment API Status =============>', response.status);
        const businessTimeSegment = await axios.get(
            response.headers.location
        );
        return {
            id: businessTimeSegment.data.id,
            displayId: businessTimeSegment.data.displayId
        };
    }

    async deleteArticleTemplate(articleTemplateName?: string): Promise<boolean> {
        if (articleTemplateName) {
            let allRecords = await coreApi.getGuid("com.bmc.dsm.knowledge:Template Configuration");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[301820705] === articleTemplateName;
            });
            for (let i = 0; i < entityObj.length; i++) {
                let guid = entityObj.length >= 1 ? entityObj[i]['379'] || null : null;
                await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Template Configuration', guid);
            }
            return true;
        }
        else {
            let allArticleTemplateRecords = await coreApi.getGuid("com.bmc.dsm.knowledge:Template Configuration");
            let allArticleTemplateArrayMap = allArticleTemplateRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Template Configuration', obj[379]);
            });
            return await Promise.all(allArticleTemplateArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async deleteKnowledgeSet(knowledgeSetName?: string): Promise<boolean> {
        if (knowledgeSetName) {
            let allRecords = await coreApi.getGuid("com.bmc.dsm.knowledge:Knowledge Set");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[301820700].includes(knowledgeSetName);
            });
            for (let i = 0; i < entityObj.length; i++) {
                let guid = entityObj.length >= 1 ? entityObj[i]['379'] || null : null;
                await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Set', guid);
            }
            return true;
        }
        else {
            let allArticleTemplateRecords = await coreApi.getGuid("com.bmc.dsm.knowledge:Knowledge Set");
            let allArticleTemplateArrayMap = allArticleTemplateRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Set', obj[379]);
            });
            return await Promise.all(allArticleTemplateArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async addFunctionalRole(person: string, functionalRoleGuid: string): Promise<boolean> {
        let addFunctionalRolePayload = cloneDeep(ADD_FUNCTIONAL_ROLE);
        let userRoles = await coreApi.getPersonFunctionalRoles(person);
        let personGuid = await coreApi.getPersonGuid(person)
        addFunctionalRolePayload.fieldInstances[430000002].value = userRoles + ';' + functionalRoleGuid;
        let response = await coreApi.updateRecordInstance('com.bmc.arsys.rx.foundation:Person', personGuid, addFunctionalRolePayload);
        console.log(`Functional role of ${person} is successfully updated  =============>`, response.status);
        return response.status == 204;
    }

    async associateCaseTemplateWithApprovalMapping(templatedId: string, approvalMapping: string): Promise<boolean> {
        let url = "api/com.bmc.dsm.shared-services-lib/rx/application/association/com.bmc.dsm.case-lib:Case Approval Mapping to Case Template/" + approvalMapping + "/" + templatedId + "?allowDuplicates=true";
        let response = await axios.post(
            url,
            {}
        )
        console.log('Association API Status =============>', response.status);
        return response.status == 204;
    }

    async disassociateCaseTemplateFromApprovalMapping(templatedId: string, approvalMappingId: string): Promise<boolean> {
        let response = await coreApi.disassociateFoundationElements("com.bmc.dsm.case-lib:Case Approval Mapping to Case Template", approvalMappingId, templatedId);
        return response.status == 204;
    }

    async reopenCase(caseGuid: string): Promise<boolean> {
        let caseReopen = cloneDeep(CASE_REOPEN);
        caseReopen.processInputValues["Case ID"] = caseGuid;
        let response = await axios.post(
            commandUri,
            caseReopen
        )
        console.log('Reopen API Status  =============>', response.status);
        return response.status == 201;
    }

    async postActivityCommentsWithoutAttachments(comment: string, module: string, moduleGuid: string): Promise<boolean> {
        let postActivity = cloneDeep(POST_ACTIVITY);
        postActivity.dataSource = module;
        postActivity.text = comment;
        let uri = `/api/com.bmc.dsm.social-lib/rx/application/activity/${module}/${moduleGuid}`;
        let response = await axios.post(
            uri,
            postActivity
        )
        console.log('Comments posting API Status  =============>', response.status);
        return response.status == 200;
    }

    async sendApprovalQuestions(recordGuid: string, user: string, questions: string, caseId: string): Promise<boolean> {
        let signatureId = await coreApi.getSignatureId(recordGuid);
        let formData = {
            to: user,
            question: questions,
            application: 'com.bmc.dsm.case-lib:Case',
            applicationRequestId: caseId,
            signatureID: signatureId
        }

        let response = await coreApi.multiFormPostWithAttachment(formData, 'api/com.bmc.arsys.rx.approval/rx/application/approval/moreinformation/question');
        console.log('More Info API Status =============>', response.status);
        return response.status == 204;
    }

    async createReadAccessMapping(data: any): Promise<boolean> {
        let caseReadAccess = cloneDeep(CASE_READ_ACCESS);
        caseReadAccess.fieldInstances[450000381].value = await apiCoreUtil.getBusinessUnitGuid(data.businessUnit);
        caseReadAccess.fieldInstances[1000000217].value = await apiCoreUtil.getSupportGroupGuid(data.supportGroup);
        caseReadAccess.fieldInstances[450000153].value = await apiCoreUtil.getOrganizationGuid(data.assignedCompany);
        caseReadAccess.fieldInstances[1000001437].value = data.configName;
        caseReadAccess.fieldInstances[1000000001].value = await apiCoreUtil.getOrganizationGuid(data.company);

        if (data.category1) {
            let categoryTier1 = await coreApi.getCategoryGuid(data.category1);
            let category1Data = {
                "id": 1000000063,
                "value": `${categoryTier1}`
            }
            caseReadAccess.fieldInstances["1000000063"] = category1Data;
        }
        if (data.category2) {
            let categoryTier2 = await coreApi.getCategoryGuid(data.category2);
            let category2Data = {
                "id": 1000000064,
                "value": `${categoryTier2}`
            }
            caseReadAccess.fieldInstances["1000000064"] = category2Data;
        }
        if (data.category3) {
            let categoryTier3 = await coreApi.getCategoryGuid(data.category3);
            let category3Data = {
                "id": 1000000065,
                "value": `${categoryTier3}`
            }
            caseReadAccess.fieldInstances["1000000065"] = category3Data;
        }
        if (data.category4) {
            let categoryTier4 = await coreApi.getCategoryGuid(data.category4);
            let category4Data = {
                "id": 450000158,
                "value": `${categoryTier4}`
            }
            caseReadAccess.fieldInstances["450000158"] = category4Data;
        }

        if (data.label) {
            let label = await coreApi.getLabelGuid(data.label);
            let labelData = {
                "id": 450000159,
                "value": `${label}`
            }
            caseReadAccess.fieldInstances["450000159"] = labelData;
        }

        let readAccessMapping: AxiosResponse = await coreApi.createRecordInstance(caseReadAccess);
        console.log('Read Access Mapping Status =============>', readAccessMapping.status);
        return readAccessMapping.status == 201;
    }

    async postActivityCommentsWithAttachments(comment: string, module: string, moduleGuid: string, attachment: string): Promise<boolean> {
        // Creating the attachment
        let guid = uuid.v4();
        let mdata = `{"attachmentGroupId":"${moduleGuid + guid}","relatedRD":"com.bmc.dsm.case-lib:Case","relatedRI":"${moduleGuid}","publicPermissions":false,"dataSource":"Social","draft":false}`;
        let filename = fs.createReadStream(attachment.toString());
        let formData = {
            attachmentGroupId: moduleGuid + guid,
            file_0: filename,
            metadata: mdata
        }
        let response1: AxiosResponse;
        response1 = await coreApi.multiFormPostWithAttachment(formData, 'api/com.bmc.dsm.attachment-service-lib/rx/application/v1/attachment/group');
        console.log('Create Attachment API Status  =============>', response1.status);

        // Posting on Social Activity
        let postActivityWithAttachment = cloneDeep(POST_ACTIVITY_WITH_ATTACHMENT);
        postActivityWithAttachment.dataSource = module;
        postActivityWithAttachment.text = comment;
        postActivityWithAttachment.attachmentsGroupId = moduleGuid + guid;

        let uri = `/api/com.bmc.dsm.social-lib/rx/application/activity/${module}/${moduleGuid}`;
        let response = await axios.post(
            uri,
            postActivityWithAttachment
        )
        console.log('Comments posting API Status  =============>', response.status);
        return response.status == 200;
    }

    async moreInfoResponseOnApprovalAction(caseId: string, reply: string): Promise<boolean> {
        let moreInfoReturnAction = cloneDeep(MORE_INFO_RETURN_ACTION);
        moreInfoReturnAction.id = await coreApi.getMoreInfoGuid(caseId);
        moreInfoReturnAction.fieldInstances[13301].value = reply;
        let response = await coreApi.updateRecordInstance('AP:More Information', moreInfoReturnAction.id, moreInfoReturnAction);
        console.log('More Info Return API Status =============>', response.status);
        return response.status == 204;
    }

    async deleteAutomatedCaseStatusTransition(configName?: string): Promise<boolean> {
        if (configName) {
            let allRecords = await coreApi.getGuid("com.bmc.dsm.shared-services-lib:Automated Status Transition Rules");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[1000001437] === configName;
            });
            let configGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
            if (configGuid) {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.shared-services-lib:Automated Status Transition Rules', configGuid);
            }
        } else {
            let allConfigsMapRecords = await coreApi.getGuid("com.bmc.dsm.shared-services-lib:Automated Status Transition Rules");
            let allConfigsArrayMap = allConfigsMapRecords.data.data.map(async (obj: string) => {
                return await coreApi.deleteRecordInstance('com.bmc.dsm.shared-services-lib:Automated Status Transition Rules', obj[379]);
            });
            return await Promise.all(allConfigsArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

}

export default new ApiHelper();
