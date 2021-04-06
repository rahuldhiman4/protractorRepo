import axios, { AxiosResponse } from "axios";
import { cloneDeep } from 'lodash';
import { browser } from 'protractor';
import * as uuid from 'uuid';
import apiCoreUtil from "../api/api.core.util";
import * as constants from "../api/constant.api";
import { APPROVAL_ACTION, MORE_INFO_RETURN_ACTION } from "../data/api/approval/approval.action.api";
import { CASE_APPROVAL_FLOW, MULTI_APPROVAL_FLOW, TASK_APPROVAL_FLOW } from '../data/api/approval/approval.flow.api';
import { CASE_APPROVAL_MAPPING, TASK_APPROVAL_MAPPING } from '../data/api/approval/approval.mapping.api';
import { CASE_ASSIGNMENT_PAYLOAD, CASE_FROM_DWP } from '../data/api/case/case.config.api';
import { CASE_READ_ACCESS } from '../data/api/case/case.read.access.api';
import { CASE_REOPEN } from '../data/api/case/case.reopen.api';
import { CASE_TEMPLATE_IDENTITY_UPDATE_PAYLOAD, CASE_TEMPLATE_PAYLOAD, CASE_TEMPLATE_STATUS_UPDATE_PAYLOAD } from '../data/api/case/case.template.data.api';
import { ADD_TO_WATCHLIST } from '../data/api/case/case.watchlist.api';
import * as COMPLEX_SURVEY from '../data/api/case/complex-survey.api';
import { FLOWSET_TEMPLATE } from '../data/api/case/flowset.api';
import { CASE_ACCESS_CHILD_SECURITY, CASE_ACCESS_COMMAND } from '../data/api/case/update.case.access.api';
import { CASE_STATUS_CHANGE, UPDATE_CASE, UPDATE_CASE_ASSIGNMENT } from '../data/api/case/update.case.api';
import { COGNITIVE_CATEGORY_DATASET, COGNITIVE_CATEGORY_DATASET_MAPPING, COGNITIVE_LICENSE, COGNITIVE_TEMPLATE_DATASET, COGNITIVE_TEMPLATE_DATASET_MAPPING } from '../data/api/cognitive/cognitive.config.api';
import { EMAIL_OUTGOING, EMAIL_PROFILE, INCOMINGMAIL_DEFAULT, MAILBOX_CONFIG, UPDATE_EMAIL_PROFILE_ON_LOB } from '../data/api/email/email.configuration.data.api';
import { NEW_PROCESS_LIB, PROCESS_FLOWSET_MAPPING } from '../data/api/flowset/create-process-lib';
import { CREATE_BUSINESS_UNIT, UPDATE_BUSINESS_UNIT } from '../data/api/foundation/business.unit.api';
import { ENABLE_USER, NEW_USER } from '../data/api/foundation/create-foundation-entity.api';
import { CreateLOB, UpdateLOB } from '../data/api/foundation/lob.api';
import { REGION, REGION_TIER } from '../data/api/foundation/region.api';
import { DELETE_PERSON, UPDATE_ORGANIZATION, UPDATE_PERSON, UPDATE_SUPPORT_GROUP } from '../data/api/foundation/update-foundation-entity.data.api';
import { FLAG_UNFLAG_KA } from '../data/api/knowledge/flag-unflag.data.api';
import { KNOWLEDGE_APPROVAL_CONFIG, KNOWLEDGE_APPROVAL_FLOW_CONFIG } from '../data/api/knowledge/knowledge-approvals-config.api';
import { KNOWLEDGE_ARTICLE_EXTERNAL_FLAG } from "../data/api/knowledge/knowledge-article-external.api";
import { KNOWLEDGEARTICLE_HELPFULCOUNTER, KNOWLEDGEARTICLE_TEMPLATE } from '../data/api/knowledge/knowledge-article.template.api';
import { KNOWLEDEGESET_ASSOCIATION, KNOWLEDGE_SET } from '../data/api/knowledge/knowledge-set.data.api';
import { KNOWLEDGE_ARTICLE_PAYLOAD, UPDATE_KNOWLEDGE_ARTICLE_PAYLOAD } from '../data/api/knowledge/knowledge.article.api';
import * as actionableNotificationPayloads from '../data/api/notification/actionable.notification.supporting.api';
import { ARTCILE_DUE_DATE, EMAIL_ALERT_SUBJECT_BODY, NOTIFICATION_EVENT_ACTIVE, NOTIFICATION_TEMPLATE } from '../data/api/notification/notification-config.api';
import { COMMON_CONFIG_GET, COMMON_CONFIG_PAYLOAD, CREATE_COMMON_CONFIG } from '../data/api/shared-services/common.configurations.api';
import * as processes from '../data/api/shared-services/create-new-process.api';
import { ACTIONABLE_NOTIFICATIONS_ENABLEMENT_SETTING, NOTIFICATIONS_EVENT_STATUS_CHANGE } from '../data/api/shared-services/enabling.actionable.notifications.api';
import { MENU_ITEM } from '../data/api/shared-services/menu.item.api';
import { AUTOMATED_CASE_STATUS_TRANSITION, ENABLE_DISABLE_PROCESS } from '../data/api/shared-services/process.data.api';
import { RELATIONSHIPS } from '../data/api/shared-services/relationship.api';
import { BUSINESS_TIME_SEGMENT, BUSINESS_TIME_SHARED_ENTITY, CASE_MILESTONE, SERVICE_TARGET_GOALTYPE_PAYLOAD, SERVICE_TARGET_GROUP, SERVICE_TARGET_PAYLOAD, TASK_MILESTONE } from '../data/api/slm/serviceTarget.api';
import { NOTES_TEMPLATE } from '../data/api/social/notes.template.api';
import { POST_ACTIVITY, POST_ACTIVITY_WITH_ATTACHMENT } from '../data/api/social/post.activity.api';
import { ADHOC_TASK_PAYLOAD, REGISTER_ADHOC_TASK, TASK_CREATION_FROM_TEMPLATE, UPDATE_TASK, UPDATE_TASK_STATUS } from '../data/api/task/task.creation.api';
import { AUTO_TASK_TEMPLATE_PAYLOAD, DOC_FOR_AUTO_TASK_TEMPLATE, EXTERNAL_TASK_TEMPLATE_PAYLOAD, MANUAL_TASK_TEMPLATE_PAYLOAD, PROCESS_FOR_AUTO_TASK_TEMPLATE } from '../data/api/task/task.template.api';
import { DRDMV_15000, DYNAMIC_DATA_DEFINITION, ONE_TASKFLOW, PROCESS_DOCUMENT, THREE_TASKFLOW_SEQUENTIAL, THREE_TASKFLOW_SEQUENTIAL_PARALLEL, TWO_TASKFLOW_PARALLEL, TWO_TASKFLOW_SEQUENTIAL } from '../data/api/task/taskflow.process.data.api';
import { DOC_LIB_DRAFT, DOC_LIB_PUBLISH, DOC_LIB_READ_ACCESS } from '../data/api/ticketing/document-library.data.api';
import { DOCUMENT_TEMPLATE } from '../data/api/ticketing/document-template.data.api';
import * as DYNAMIC from '../data/api/ticketing/dynamic.data.api';
import { ICaseApprovalMapping, IKnowledgeApprovalMapping, ITaskApprovalMapping } from "../data/interface/approval.interface";
import { ICaseAssignmentMapping, ICaseUpdate, ICreateCase, ICreateCaseDWP, IReadAccess, IUpdateCaseAccess } from '../data/interface/case.interface';
import { ICognitiveDataSet, ICognitiveDataSetMapping } from '../data/interface/cognitive.interface';
import { IFlowset, IFlowsetProcess, IFlowsetProcessMapping } from '../data/interface/flowset.interface';
import { IBusinessUnit, IDepartment, IDomainTag, IFoundationEntity, ILOB, IMenuItem, IPerson, ISupportGroup } from '../data/interface/foundation.interface';
import { IDocumentLib, IDocumentTemplate, IKnowledgeArticles, IKnowledgeArticleTemplate, IKnowledgeSet, IUpdateKnowledgeArticle } from '../data/interface/knowledge.interface';
import { IEmailConfig, IEmailMailboxConfig, INotificationEvent, INotificationTemplate } from '../data/interface/notification.interface';
import { ICreateSVT, ICreateSVTGoalType, ICreateSVTGroup } from '../data/interface/svt.interface';
import { IAdhocTask, ITaskUpdate } from '../data/interface/task.interface';
import { ICaseTemplate, IEmailTemplate, INotesTemplate, ITaskTemplate } from '../data/interface/template.interface';
import loginPage from "../pageobject/common/login.po";

let fs = require('fs');

axios.defaults.baseURL = browser.baseUrl;
axios.defaults.headers.common['X-Requested-By'] = 'XMLHttpRequest';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['request-overlay-group'] = '1';
const commandUri = 'api/rx/application/command';
const articleTemplateUri = 'api/com.bmc.dsm.knowledge/rx/application/article/template';
const appConfigUri = 'api/rx/application/admin-settings/local/component-settings/Configuration Values/';

export interface IIDs {
    id: string;
    displayId: string;
}

class ApiHelper {

    async apiLogin(userName: string, password?: string): Promise<void> {
        let credentials = await loginPage.getCredentials(userName, password);
        let response = await axios.post(
            "api/rx/authentication/loginrequest",
            { "userName": credentials.user, "password": credentials.pass },
        )
        console.log('Login API Status of ' + credentials.user + ' =============>', response.status);
        axios.defaults.headers.common['Cookie'] = `AR-JWT=${response.data}`;
    }

    async createCase(data: ICreateCase): Promise<IIDs> {
        let caseData = cloneDeep(data);
        const newCase = await axios.post(
            "api/com.bmc.dsm.case-lib/cases",
            caseData
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

    async createCaseFromDwp(data: ICreateCaseDWP): Promise<IIDs> {
        let caseData = cloneDeep(CASE_FROM_DWP);
        caseData.processInputValues.Requester = data.requester;
        caseData.processInputValues.Summary = data.summary;
        if (data["Service Request Display ID"]) caseData.processInputValues["Service Request Display ID"] = data["Service Request Display ID"];
        const newCase = await axios.post(
            commandUri,
            caseData
        );
        console.log('Create Case API Status =============>', newCase.status);
        const caseDetails = await axios.get(
            newCase.headers.location
        );
        console.log('New Case Details API Status =============>', caseDetails.status);

        return {
            id: caseDetails.data.processVariables['Case ID'],
            displayId: caseDetails.data.processVariables["Case Display ID"]
        };
    }

    // async updateNotificationEventStatus(eventName: string, status: string, company?: string): Promise<boolean> {
    //     let notificationEventGuid;
    //     if (company)
    //         notificationEventGuid = await apiCoreUtil.getNotificationEventGuid(eventName, company);
    //     else notificationEventGuid = await apiCoreUtil.getNotificationEventGuid(eventName);
    //     let updateStatusPayload = cloneDeep(NOTIFICATIONS_EVENT_STATUS_CHANGE);
    //     updateStatusPayload.id = notificationEventGuid;
    //     updateStatusPayload.fieldInstances[7].value = constants.NotificationEventStatus[status];
    //     let updateEventStatus = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.notification-lib%3ANotificationEvent', notificationEventGuid, updateStatusPayload);
    //     return updateEventStatus.status == 204;
    // }

    async updateNotificationEventStatus(eventName: string, lob: string, status: string, company?: string): Promise<boolean> {
        let notificationEventGuid;
        let lobGuid: string = constants.LOB[lob];
        if (company)
            notificationEventGuid = await apiCoreUtil.getNotificationEventGuid(eventName, lobGuid, company);
        else notificationEventGuid = await apiCoreUtil.getNotificationEventGuid(eventName, lobGuid);
        let updateStatusPayload = cloneDeep(NOTIFICATIONS_EVENT_STATUS_CHANGE);
        updateStatusPayload.id = notificationEventGuid;
        updateStatusPayload.fieldInstances[7].value = constants.NotificationEventStatus[status];
        let updateEventStatus = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.notification-lib%3ANotificationEvent', notificationEventGuid, updateStatusPayload);
        return updateEventStatus.status == 204;
    }

    async createDomainTag(data: IDomainTag): Promise<string> {
        let domainTagGuid = await apiCoreUtil.getDomainTagGuid(data.domainTagName);
        if (domainTagGuid == null) {
            let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
            let domainTagData = await domainTagFile.CreateDomainTag;

            domainTagData.fieldInstances[8].value = data.domainTagName;
            let newDomainTag: AxiosResponse = await apiCoreUtil.createRecordInstance(domainTagData);

            console.log('Create Domain Tag Status =============>', newDomainTag.status);
            const domainTagDetails = await axios.get(
                await newDomainTag.headers.location
            );

            console.log('New Domain Tag API Status =============>', domainTagDetails.status);

            //Once Domain Tag is created, make it active
            let domainConfigFile = await require('../data/api/shared-services/domainConfiguration.api.json');
            let domainConfigData = await domainConfigFile.DomainConfiguration;

            domainConfigData.fieldInstances[450000152].value = domainTagDetails.data.id;
            let newDomainConfig: AxiosResponse = await apiCoreUtil.createRecordInstance(domainConfigData);

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
        let newCaseTemplate: AxiosResponse = await apiCoreUtil.createDyanmicData(templateData);
        console.log('Create Dynamic on Template API Status =============>', newCaseTemplate.status);
    }

    async createEmailBox(mailboxType: string, mailBoxConfigData?: IEmailMailboxConfig): Promise<IIDs> {
        let mailBoxData = undefined;
        if (mailboxType == 'incoming')
            mailBoxData = cloneDeep(INCOMINGMAIL_DEFAULT);
        else if (mailboxType = 'outgoing')
            mailBoxData = cloneDeep(EMAIL_OUTGOING)
        if (mailBoxConfigData) {
            mailBoxData.fieldInstances[18037].value = mailBoxConfigData.mailBoxName;
        }
        let mailBoxResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(mailBoxData);
        console.log('Configure Mailbox setup API Status =============>', mailBoxResponse.status);
        const mailboxConfigDetails = await axios.get(
            await mailBoxResponse.headers.location
        );
        return {
            id: mailboxConfigDetails.data.id,
            displayId: mailboxConfigDetails.data.displayId
        };
    }

    async createEmailProfile(outgoingEmailConfigGuid: string): Promise<boolean> {
        let emailProfileData = cloneDeep(EMAIL_PROFILE);
        emailProfileData.fieldInstances[56154].value = outgoingEmailConfigGuid
        let emailProfileResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(emailProfileData);
        console.log('Configure Email Profile API Status =============>', emailProfileResponse.status);
        return emailProfileResponse.status == 204;
    }

    async updateLOBWithEmailProfile(lobName: string, emailProfileName: string): Promise<boolean> {
        let updateLOBData = cloneDeep(UPDATE_EMAIL_PROFILE_ON_LOB);
        let lobGuid: string = await apiCoreUtil.getLineOfBusinessGuid(lobName);
        updateLOBData.id = lobGuid;
        updateLOBData.fieldInstances[450000157].value = emailProfileName;
        let updateLOBDataResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.shared-services-lib:Line of Business", lobGuid, updateLOBData);
        return updateLOBDataResponse.status == 204;
    }

    async createEmailConfiguration(emailConfigData?: IEmailConfig): Promise<IIDs> {
        let mailBoxConfig = cloneDeep(MAILBOX_CONFIG);
        if (emailConfigData) {
            mailBoxConfig.fieldInstances[450000155].value = emailConfigData.email;
            mailBoxConfig.fieldInstances[450000420].value = emailConfigData.lineOfBusiness ? await constants.LOB[emailConfigData.lineOfBusiness] : mailBoxConfig.fieldInstances[450000420].value;
            mailBoxConfig.fieldInstances[1000000001].value = emailConfigData.company ? emailConfigData.company : mailBoxConfig.fieldInstances[1000000001].value;
            mailBoxConfig.fieldInstances[8].value = emailConfigData.description ? emailConfigData.description : mailBoxConfig.fieldInstances[8].value;
            mailBoxConfig.fieldInstances[450000152].value = emailConfigData.incomingMailBoxName ? emailConfigData.incomingMailBoxName : mailBoxConfig.fieldInstances[450000152].value;
        }
        let emailConfigCreateResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(mailBoxConfig);
        console.log('Configure Email API Status =============>', emailConfigCreateResponse.status);
        const emailConfigDetails = await axios.get(
            await emailConfigCreateResponse.headers.location
        );
        return {
            id: emailConfigDetails.data.id,
            displayId: emailConfigDetails.data.displayId
        };
    }

    async deleteAllEmailConfiguration(): Promise<boolean> {
        let emailConfigDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=450000153,379,450000156,7,1000000001,1&recorddefinition=com.bmc.dsm.email-lib:Email+Box+Registration&shouldIncludeTotalSize=false&sortBy=450000156&startIndex=0";
        let allEmailConfig = await axios.get(
            emailConfigDataPageUri
        );
        let deleteAllEmailConfigMap = allEmailConfig.data.data.map(async (obj: string) => {
            return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.email-lib:Email Box Registration', obj[379]);
        });
        let deleteAllEmailConfig: boolean = await Promise.all(deleteAllEmailConfigMap).then(async (result) => {
            return !result.includes(false);
        });

        let incomingMailDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=179,1,18037,18217,7,379&queryExpression=((%2718049%27%3D%220%22))&recorddefinition=AR+System+Email+Mailbox+Configuration&shouldIncludeTotalSize=false&sortBy=7&startIndex=0";
        let allIncomingMail = await axios.get(
            incomingMailDataPageUri
        );
        let deleteAllIncomingMailMap = allIncomingMail.data.data.map(async (obj: string) => {
            return await apiCoreUtil.deleteRecordInstance('AR System Email Mailbox Configuration', obj[379]);
        });
        let deleteAllIncomingMail: boolean = await Promise.all(deleteAllIncomingMailMap).then(async (result) => {
            return !result.includes(false);
        });

        let outgoingMailDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=7,179,1,18217,18037,18147,379&queryExpression=((%2718049%27%3D%221%22))&recorddefinition=AR+System+Email+Mailbox+Configuration&shouldIncludeTotalSize=false&startIndex=0";
        let allOutgoingMail = await axios.get(
            outgoingMailDataPageUri
        );
        let deleteAllOutgoingMailMap = allOutgoingMail.data.data.map(async (obj: string) => {
            return await apiCoreUtil.deleteRecordInstance('AR System Email Mailbox Configuration', obj[379]);
        });
        let deleteAllOutgoingMail: boolean = await Promise.all(deleteAllOutgoingMailMap).then(async (result) => {
            return !result.includes(false);
        });

        //Deleting Email Profiles
        let emailProfileDataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery&pageSize=50&propertySelection=379,56153,8,4,56154,56152&queryExpression=%2756150%27+%3D+%22email%22&recorddefinition=Alias+Mapping&startIndex=0";
        let allEmailProfile = await axios.get(
            emailProfileDataPageUri
        );
        let deleteAllEmailProfileMap = allEmailProfile.data.data.map(async (obj: string) => {
            return await apiCoreUtil.deleteRecordInstance('Alias Mapping', obj[379]);
        });
        let deleteAllEmailProfile: boolean = await Promise.all(deleteAllEmailProfileMap).then(async (result) => {
            return !result.includes(false);
        });

        console.log('AllEmailConfiguration deleted =============>', deleteAllEmailConfig == deleteAllIncomingMail == deleteAllOutgoingMail == deleteAllEmailProfile);
        return deleteAllEmailConfig == deleteAllIncomingMail == deleteAllOutgoingMail;
    }

    async getHTMLBodyOfEmail(emailSubject: string, sentTo: string): Promise<string> {
        return await apiCoreUtil.getEmailHTMLBody(emailSubject, sentTo);
    }

    async updateTask(taskGuid: string, data: ITaskUpdate): Promise<number> {
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

    async updateCase(caseGuid: string, data: ICaseUpdate): Promise<boolean> {
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

        let updateCase = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.case-lib:Case', caseGuid, caseData);
        return updateCase.status == 204;
    }

    async createCaseTemplate(data: ICaseTemplate): Promise<IIDs> {
        let templateData = cloneDeep(CASE_TEMPLATE_PAYLOAD);

        templateData.fieldInstances[8].value = data.templateSummary;
        templateData.fieldInstances[1000001437].value = data.templateName;
        templateData.fieldInstances[7].value = constants.CaseTemplate[data.templateStatus];
        templateData.fieldInstances[301566300].value = data.ownerCompany ? data.ownerCompany : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.company ? data.company : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[450000401].value = data.ownerBU ? data.ownerBU : templateData.fieldInstances[450000401].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? data.ownerGroup : templateData.fieldInstances[300287900].value;
        //templateData.fieldInstances[1000000063].value = data.categoryTier1 ? await apiCoreUtil.getCategoryGuid(data.categoryTier1) : templateData.fieldInstances[1000000063].value;
        templateData.fieldInstances[1000000063].value = data.categoryTier1 ? data.categoryTier1 : templateData.fieldInstances[1000000063].value;
        //templateData.fieldInstances[1000000064].value = data.categoryTier2 ? await apiCoreUtil.getCategoryGuid(data.categoryTier2) : templateData.fieldInstances[1000000064].value;
        templateData.fieldInstances[1000000064].value = data.categoryTier2 ? data.categoryTier2 : templateData.fieldInstances[1000000064].value;
        //templateData.fieldInstances[1000000065].value = data.categoryTier3 ? await apiCoreUtil.getCategoryGuid(data.categoryTier3) : templateData.fieldInstances[1000000065].value;
        templateData.fieldInstances[1000000065].value = data.categoryTier3 ? data.categoryTier3 : templateData.fieldInstances[1000000065].value;
        templateData.fieldInstances[450000061].value = data.description ? data.description : templateData.fieldInstances[450000061].value;
        templateData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.fieldInstances[450000420].value;
        if (data.caseStatus) {
            let statusValue = constants.CaseStatus[data.caseStatus];
            let caseTemplateStatus = {
                "id": "450000021",
                "value": `${statusValue}`
            }
            templateData.fieldInstances["450000021"] = caseTemplateStatus;
        }

        if (data.caseStatus) {
            let statusGuid = await apiCoreUtil.getStatusGuid('com.bmc.dsm.case-lib', constants.CaseStatus[data.caseStatus]);
            let caseTemplateStatusGuid = {
                "id": "450000010",
                "value": `${statusGuid}`
            }
            templateData.fieldInstances["450000010"] = caseTemplateStatusGuid;
        }

        if (data.statusReason) {
            let statusReasonGuid = await apiCoreUtil.getStatusChangeReasonGuid(data.statusReason);
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

        if (data.flowset) {
            let flowset = {
                "id": "450000121",
                "value": `${data.flowset}`
            }
            templateData.fieldInstances["450000121"] = flowset;
        }

        if (data.resolutionDescription) {
            let resolutionDescriptionObj = {
                "id": "450000164",
                "value": `${data.resolutionDescription}`
            }
            templateData.fieldInstances["450000164"] = resolutionDescriptionObj;
        }

        if (data.assignee) {
            let assignee = await apiCoreUtil.getPersonGuid(data.assignee);
            let caseTemplateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = caseTemplateDataAssignee;
        }

        if (data.label) {
            let labelGuid = await apiCoreUtil.getLabelGuid(data.label);
            let caseTemplateDataLabel = {
                "id": 450000160,
                "value": `${labelGuid}`
            }
            templateData.fieldInstances["450000160"] = caseTemplateDataLabel;
        }

        if (data.supportGroup) {
            let taskTemplateDataassignedCompany = {
                "id": 450000154,
                "value": data.company
            }
            templateData.fieldInstances["450000154"] = taskTemplateDataassignedCompany;

            let caseTemplateDataSupportAssignee = {
                "id": 1000000217,
                "value": data.supportGroup
            }
            templateData.fieldInstances["1000000217"] = caseTemplateDataSupportAssignee;
        }
        if (data.businessUnit) {
            let caseTemplateDataBusinessUnit = {
                "id": 450000381,
                "value": data.businessUnit
            }
            templateData.fieldInstances["450000381"] = caseTemplateDataBusinessUnit;
        }
        if (data.department) {
            let assigneeDepartment = await apiCoreUtil.getDepartmentGuid(data.department);
            let caseTemplateDataDepartment = {
                "id": 450000381,
                "value": `${assigneeDepartment}`
            }
            templateData.fieldInstances["450000371"] = caseTemplateDataDepartment;
        }
        if (data.categoryTier4) {
            //let categoryTier4 = await apiCoreUtil.getCategoryGuid(data.categoryTier4);
            let categoryTier4 = data.categoryTier4;
            let caseTemplateDataCategoryTier4 = {
                "id": 450000158,
                "value": `${data.categoryTier4}`
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

        if (data.taskFailureConfiguration) {
            let taskFailureConfigurationValue = await constants.TaskFailConfiguration[data.taskFailureConfiguration];
            let caseTaskStatusConfiguration = {
                "id": 450000291,
                "value": taskFailureConfigurationValue
            }
            templateData.fieldInstances["450000291"] = caseTaskStatusConfiguration;
        }

        let newCaseTemplate: AxiosResponse = await apiCoreUtil.createRecordInstance(templateData);
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
        console.log("Updated Case Template Status =============>", updateCaseStatus.status);
        return updateCaseStatus.status;
    }

    async createCaseAssignmentMapping(data: ICaseAssignmentMapping): Promise<IIDs> {
        let assignmentMappingData = cloneDeep(CASE_ASSIGNMENT_PAYLOAD);
        assignmentMappingData.fieldInstances[8].value = data.assignmentMappingName;
        assignmentMappingData.fieldInstances[1000001437].value = data.assignmentMappingName;
        assignmentMappingData.fieldInstances[1000000001].value = data.company;
        assignmentMappingData.fieldInstances[450000153].value = data.supportCompany;
        assignmentMappingData.fieldInstances[1000000217].value = data.supportGroup;
        assignmentMappingData.fieldInstances[450000121].value = data.flowset ? await apiCoreUtil.getFlowsetGuid(data.flowset) : assignmentMappingData.fieldInstances[450000121].value;
        assignmentMappingData.fieldInstances[1000000063].value = data.categoryTier1;
        assignmentMappingData.fieldInstances[1000000064].value = data.categoryTier2;
        assignmentMappingData.fieldInstances[1000000065].value = data.categoryTier3;
        assignmentMappingData.fieldInstances[450000158].value = data.categoryTier4;
        assignmentMappingData.fieldInstances[450000159].value = data.label ? await apiCoreUtil.getLabelGuid(data.label) : assignmentMappingData.fieldInstances[450000159].value;
        assignmentMappingData.fieldInstances[450000157].value = data.region;
        assignmentMappingData.fieldInstances[200000007].value = data.siteGroup;
        assignmentMappingData.fieldInstances[450000156].value = data.site;
        assignmentMappingData.fieldInstances[450000381].value = data.businessUnit;
        assignmentMappingData.fieldInstances[450000152].value = data.assignee ? await apiCoreUtil.getPersonGuid(data.assignee) : assignmentMappingData.fieldInstances[450000152].value;
        assignmentMappingData.fieldInstances[1000000164].value = data.priority ? constants.CasePriority[data.priority] : assignmentMappingData.fieldInstances[1000000164].value;
        assignmentMappingData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : assignmentMappingData.fieldInstances[450000420].value;
        if (data.useAsDefault) assignmentMappingData.fieldInstances[450000001].value = data.useAsDefault ? "1" : "0";

        let newCaseAssignmentMapping: AxiosResponse = await apiCoreUtil.createRecordInstance(assignmentMappingData);
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
        templateData.fieldInstances[301566300].value = data.ownerCompany ? data.ownerCompany : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.taskCompany ? data.taskCompany : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? data.ownerGroup : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[450000401].value = data.ownerBusinessUnit ? data.ownerBusinessUnit : templateData.fieldInstances[450000401].value;
        templateData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.fieldInstances[450000420].value;
        if (data.assignee) {
            let assignee = await apiCoreUtil.getPersonGuid(data.assignee);
            let templateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = templateDataAssignee;
        }
        if (data.supportGroup) {
            let assignedCompanyGuid = data.ownerCompany;
            let taskTemplateDataassignedCompany = {
                "id": 450000153,
                "value": `${assignedCompanyGuid}`
            }
            templateData.fieldInstances["450000153"] = taskTemplateDataassignedCompany;

            let assigneeSupportGroup = data.supportGroup;
            let templateDataSupportGroup = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = templateDataSupportGroup;
        }
        if (data.businessUnit) {
            let assigneeBusinessUnit = data.businessUnit;
            let templateDataBusinessUnit = {
                "id": 450000381,
                "value": `${assigneeBusinessUnit}`
            }
            templateData.fieldInstances["450000381"] = templateDataBusinessUnit;
        }
        if (data.category1) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category1);
            let categoryGuid = data.category1;
            let templateCategory1 = {
                "id": 1000000063,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000063"] = templateCategory1;
        }
        if (data.category2) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category2);
            let categoryGuid = data.category2;
            let templateCategory2 = {
                "id": 1000000064,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000064"] = templateCategory2;
        }
        if (data.category3) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category3);
            let categoryGuid = data.category3;
            let templateCategory3 = {
                "id": 1000000065,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000065"] = templateCategory3;
        }
        if (data.category4) {
            //let categoryTier4 = await apiCoreUtil.getCategoryGuid(data.category4);
            let categoryTier4 = data.category4;
            let caseTemplateDataCategoryTier4 = {
                "id": 450000157,
                "value": `${categoryTier4}`
            }
            templateData.fieldInstances["450000157"] = caseTemplateDataCategoryTier4;
        }
        if (data.label) {
            let labelGuid = await apiCoreUtil.getLabelGuid(data.label);
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
        if (data.priority) {
            let priorityValue = constants.CasePriority[data.priority];
            let priorityObj = {
                "id": "1000000164",
                "value": `${priorityValue}`
            }
            templateData.fieldInstances["1000000164"] = priorityObj;
        }
        let newTaskTemplate: AxiosResponse = await apiCoreUtil.createRecordInstance(templateData);
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
        templateData.fieldInstances[301566300].value = data.ownerCompany ? data.ownerCompany : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.taskCompany ? data.taskCompany : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? data.ownerGroup : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[450000401].value = data.ownerBusinessUnit ? data.ownerBusinessUnit : templateData.fieldInstances[450000401].value;
        templateData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.fieldInstances[450000420].value;
        if (data.assignee) {
            let assignee = await apiCoreUtil.getPersonGuid(data.assignee);
            let templateDataAssignee = {
                "id": 450000152,
                "value": `${assignee}`
            }
            templateData.fieldInstances["450000152"] = templateDataAssignee;
        }

        if (data.supportGroup) {
            let assignedCompanyGuid = data.ownerCompany;
            let taskTemplateDataassignedCompany = {
                "id": 450000153,
                "value": `${assignedCompanyGuid}`
            }
            templateData.fieldInstances["450000153"] = taskTemplateDataassignedCompany;

            let assigneeSupportGroup = data.supportGroup;
            let templateDataSupportGroup = {
                "id": 1000000217,
                "value": `${assigneeSupportGroup}`
            }
            templateData.fieldInstances["1000000217"] = templateDataSupportGroup;
        }

        if (data.businessUnit) {
            let assigneeBusinessUnit = data.businessUnit;
            let templateDataBusinessUnit = {
                "id": 450000381,
                "value": `${assigneeBusinessUnit}`
            }
            templateData.fieldInstances["450000381"] = templateDataBusinessUnit;
        }
        if (data.category1) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category1);
            let categoryGuid = data.category1;
            let templateCategory1 = {
                "id": 1000000063,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000063"] = templateCategory1;
        }
        if (data.category2) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category2);
            let categoryGuid = data.category2;
            let templateCategory2 = {
                "id": 1000000064,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000064"] = templateCategory2;
        }
        if (data.category3) {
            let categoryGuid = data.category3;
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
        let newTaskTemplate: AxiosResponse = await apiCoreUtil.createRecordInstance(templateData);

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
        templateData.fieldInstances[450000154].value = data.processBundle ? data.processBundle : templateData.fieldInstances[450000154].value;
        templateData.fieldInstances[450000141].value = data.processName;
        templateData.fieldInstances[301566300].value = data.ownerCompany ? data.ownerCompany : templateData.fieldInstances[301566300].value;
        templateData.fieldInstances[1000000001].value = data.taskCompany ? data.taskCompany : templateData.fieldInstances[1000000001].value;
        templateData.fieldInstances[300287900].value = data.ownerGroup ? data.ownerGroup : templateData.fieldInstances[300287900].value;
        templateData.fieldInstances[450000401].value = data.ownerBusinessUnit ? data.ownerBusinessUnit : templateData.fieldInstances[450000401].value;
        templateData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.fieldInstances[450000420].value;
        if (data.priority) {
            let priority = constants.CasePriority[data.priority];
            let taskTemplateDataPriority = {
                "id": 1000000164,
                "value": `${priority}`
            }
            templateData.fieldInstances["1000000164"] = taskTemplateDataPriority;
        }
        if (data.category1) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category1);
            let categoryGuid = data.category1;
            let templateCategory1 = {
                "id": 1000000063,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000063"] = templateCategory1;
        }
        if (data.category2) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category2);
            let categoryGuid = data.category2;
            let templateCategory2 = {
                "id": 1000000064,
                "value": `${categoryGuid}`
            }
            templateData.fieldInstances["1000000064"] = templateCategory2;
        }
        if (data.category3) {
            //let categoryGuid = await apiCoreUtil.getCategoryGuid(data.category3);
            let categoryGuid = data.category3;
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
        let newTaskTemplate: AxiosResponse = await apiCoreUtil.createRecordInstance(templateData);

        console.log('Create Automated Task Template API Status =============>', newTaskTemplate.status);
        const taskTemplateDetails = await axios.get(
            await newTaskTemplate.headers.location
        );

        let docData = cloneDeep(DOC_FOR_AUTO_TASK_TEMPLATE);
        docData.targetTemplateId = taskTemplateDetails.data.id;
        docData.targetTemplateName = data.templateName;
        let newAutoTemplateDoc: AxiosResponse = await apiCoreUtil.createDocumentForAutoTaskTemplate(docData);
        console.log('Create Document for Automated Task Template API Status =============>', newAutoTemplateDoc.status);

        let processData = cloneDeep(PROCESS_FOR_AUTO_TASK_TEMPLATE);
        processData.targetTemplateId = taskTemplateDetails.data.id;
        processData.targetTemplateName = data.templateName;
        processData.targetProcess = data.processBundle + ":" + data.processName;
        data.ownerCompany ? processData.targetProcessTag = data.ownerCompany : processData.targetProcessTag;
        let newAutoTemplateProcess: AxiosResponse = await apiCoreUtil.createProcessForAutoTaskTemplate(processData);
        console.log('Create Process for Automated Task Template API Status =============>', newAutoTemplateProcess.status);

        console.log('New Automated Task Template Details API Status =============>', taskTemplateDetails.status, newAutoTemplateDoc.status, newAutoTemplateProcess.status);
        return {
            id: taskTemplateDetails.data.id,
            displayId: taskTemplateDetails.data.displayId
        };
    }

    async createBusinessUnit(data: IBusinessUnit): Promise<string> {
        let businessUnitGuid = await apiCoreUtil.getBusinessUnitGuid(data.orgName);
        if (businessUnitGuid == null) {
            let businessUnitDataFile = cloneDeep(CREATE_BUSINESS_UNIT);
            let businessData = await businessUnitDataFile.NewBusinessUnit;
            businessData.fieldInstances[1000000010].value = data.orgName;
            businessData.fieldInstances[304411161].value = data.relatedOrgId ? data.relatedOrgId : businessData.fieldInstances[304411161].value;
            businessData.fieldInstances[304417331].value = data.domainTag ? await apiCoreUtil.getDomainTagGuid(data.domainTag) : businessData.fieldInstances[304417331].value;

            const newBusinessUnit = await apiCoreUtil.createRecordInstance(businessData);
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
        let departmentGuid = await apiCoreUtil.getDepartmentGuid(data.orgName);
        if (departmentGuid == null) {
            let departmentDataFile = await require('../data/api/foundation/department.api.json');
            let departmentData = await departmentDataFile.NewDepartment;
            departmentData.fieldInstances[1000000010].value = data.orgName;
            departmentData.fieldInstances[304411161].value = data.relatedOrgId ? data.relatedOrgId : departmentData.fieldInstances[304411161].value;
            departmentData.fieldInstances[304417331].value = data.domainTag ? await apiCoreUtil.getDomainTagGuid(data.domainTag) : departmentData.fieldInstances[304417331].value;

            const newDepartment = await apiCoreUtil.createRecordInstance(departmentData);
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
        let supportGroupGuid = await apiCoreUtil.getSupportGroupGuid(data.orgName);
        if (supportGroupGuid == null) {
            let suppGrpDataFile = await require('../data/api/foundation/support.group.api.json');
            let suppGrpData = await suppGrpDataFile.NewSupportGroup;
            suppGrpData.fieldInstances[1000000010].value = data.orgName;
            suppGrpData.fieldInstances[304411161].value = data.relatedOrgId ? data.relatedOrgId : suppGrpData.fieldInstances[304411161].value;
            suppGrpData.fieldInstances[304417331].value = data.domainTag ? await apiCoreUtil.getDomainTagGuid(data.domainTag) : suppGrpData.fieldInstances[304417331].value;

            if (data.status != null) {
                let statusValue = constants.SupportGroup[data.status];
                let statusObj = {
                    "id": "7",
                    "value": `${statusValue}`
                }
                suppGrpData.fieldInstances["7"] = statusObj;
            }

            const newSuppGrp = await apiCoreUtil.createRecordInstance(suppGrpData);
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

    async createLineOfBuisness(data: ILOB): Promise<string> {
        let lobData = CreateLOB;
        lobData.fieldInstances[450000152].value = data.lobName;
        lobData.fieldInstances[8].value = data.description
        const newLOB = await apiCoreUtil.createRecordInstance(lobData);
        console.log('Create New LOB API Status =============>', newLOB.status);

        const lobDetails = await axios.get(
            newLOB.headers.location);
        console.log('Get New Support Group Details API Status =============>', lobDetails.status);
        let recordGUID: string = lobDetails.data.id;
        await browser.sleep(30000); // lob creation takes time to reflect on UI

        await this.updateLineOfBuisness(data);
        return recordGUID;
    }

    async updateLineOfBuisness(data: ILOB): Promise<boolean> {
        let lobGuid = await apiCoreUtil.getLineOfBusinessGuid(data.lobName);
        let updateLobPayload = cloneDeep(UpdateLOB);
        updateLobPayload[7].value = constants.LOBStatus[data.status];
        const updateLOB: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.shared-services-lib%3ALine%20of%20Business", lobGuid, updateLobPayload)
        return updateLOB.status == 204;;
    }

    async createNewUser(data: IPerson, userStatus?: string): Promise<string> {
        let personGuid = await apiCoreUtil.getPersonGuid(data.userId);
        if (personGuid == null) {
            let userData = cloneDeep(NEW_USER);
            userData.fieldInstances[1000000019].value = data.firstName;
            userData.fieldInstances[1000000018].value = data.lastName;
            userData.fieldInstances[4].value = data.userId;
            let functionalRolesGuidArray: string[] = [];
            let functionalRolesGuid: string;
            if (data.userPermission) {
                for (let i = 0; i < data.userPermission.length; i++) {
                    // functionalRolesGuidArray[i] = constants.FunctionalRoleGuid[data.userPermission[i]];
                    functionalRolesGuidArray[i] = await apiCoreUtil.getFunctionalRoleGuid(data.userPermission[i]);
                }
                functionalRolesGuid = functionalRolesGuidArray.join(';');
            }

            userData.fieldInstances[430000002].value = data.userPermission ? functionalRolesGuid : userData.fieldInstances[430000002].value;
            userData.fieldInstances[1000000048].value = data.emailId ? data.emailId : userData.fieldInstances[1000000048].value;

            const newUser = await apiCoreUtil.createRecordInstance(userData);
            console.log('Create New User Details API Status =============>', newUser.status);

            const userDetails = await axios.get(
                newUser.headers.location
            );

            console.log('Get New User Details API Status =============>', userDetails.status);
            let recordName: string = userDetails.data.recordDefinitionName;
            let recordGUID: string = userDetails.data.id;
            let recordDisplayId: string = userDetails.data.displayId;

            let updateUser = cloneDeep(ENABLE_USER);
            data.company ? updateUser.fieldInstances[536870913].value = data.company : updateUser.fieldInstances[536870913].value;
            updateUser.displayId = recordDisplayId;
            updateUser.id = recordGUID;
            if (userStatus == 'Inactive') {
                console.log('New user created with Inactive status');
            } else {
                const userUpdate = await apiCoreUtil.updateRecordInstance(recordName, recordGUID, updateUser);
                console.log('Enable User API Status =============>', userUpdate.status);
            }
            return recordGUID;
        } else {
            console.log('New User API Status =============> User already exists =============> ', personGuid);
            return personGuid;
        }
    }

    async associatePersonToCompany(userId: string, company: string): Promise<boolean> {
        let userGuid = await apiCoreUtil.getPersonGuid(userId);
        let response = await apiCoreUtil.associateFoundationElements("Agent Supports Primary Organization", userGuid, company);
        return response.status == 204;
    }

    async disassociatePersonFromCompany(userId: string, company: string): Promise<boolean> {
        let userGuid = await apiCoreUtil.getPersonGuid(userId);
        let response = await apiCoreUtil.disassociateFoundationElements("com.bmc.arsys.rx.foundation:Agent Supports Primary Organization", userGuid, company);
        return response.status == 204;
    }

    async associatePersonToSupportGroup(userId: string, supportGroup: string): Promise<boolean> {
        let userGuid = await apiCoreUtil.getPersonGuid(userId);
        let supportGroupGuid = await apiCoreUtil.getSupportGroupGuid(supportGroup);
        let response = await apiCoreUtil.associateFoundationElements("Person to Support Secondary Organization", userGuid, supportGroupGuid);
        return response.status == 204;
    }

    async associatePersonToDepartmentOrBU(userId: string, departmentOrBUName: string): Promise<boolean> {
        let userGuid = await apiCoreUtil.getPersonGuid(userId);
        let id = await apiCoreUtil.getBusinessUnitGuid(departmentOrBUName).then(async (result) => {
            if (result == null) return await apiCoreUtil.getDepartmentGuid(departmentOrBUName);
            else return result
        });
        let response = await apiCoreUtil.associateFoundationElements("Person to Secondary Organization", userGuid, id);
        return response.status == 204;
    }

    async associateCategoryToOrganization(category: string, organization: string): Promise<boolean> {
        let categoryGuid = await apiCoreUtil.getCategoryGuid(category);
        let response = await apiCoreUtil.associateFoundationElements("Organization Uses Categorization", organization, categoryGuid);
        return response.status == 204;
    }

    async createOperationalCategory(category: string, isGlobal?: boolean): Promise<IIDs> {
        let recordDisplayId: string = null;
        let categoryGuid = await apiCoreUtil.getCategoryGuid(category);
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

            const newCategory = await apiCoreUtil.createRecordInstance(categoryData);
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
        let category1Guid = await apiCoreUtil.getCategoryGuid(category1);
        let category2Guid = await apiCoreUtil.getCategoryGuid(category2);
        let response = await apiCoreUtil.associateFoundationElements("Categorization to Categorization", category1Guid, category2Guid);
        return response.status == 204;
    }

    async associateCategoryUnderDomainTag(categoryTier: string, domainTagGuid: string): Promise<boolean> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.associateDomainTagToCategory;
        //get category guid to associate under domain tag
        let categoryGuid = await apiCoreUtil.getCategoryGuid(categoryTier);
        domainTagData.id = categoryGuid;
        domainTagData.fieldInstances[304417331].value = domainTagGuid;
        let domainTagResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.arsys.rx.foundation:Operational Category", categoryGuid, domainTagData);
        console.log("category associated under domain tag: " + domainTagResponse.status);
        return domainTagResponse.status == 204;
    }

    async associateCaseTemplateWithOneTaskTemplate(caseTemplateId: string, taskTemplateId: string): Promise<boolean> {
        let oneTaskFlowProcess = cloneDeep(ONE_TASKFLOW);
        let caseTemplateGuid = await apiCoreUtil.getCaseTemplateGuid(caseTemplateId);
        let taskTemplateGuid = await apiCoreUtil.getTaskTemplateGuid(taskTemplateId);
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
        let newDocForProcess: AxiosResponse = await apiCoreUtil.createDocumentForProcess(docData);
        console.log('Create Document for TaskFlow Process =============>', newDocForProcess.status);
        oneTaskFlowProcess.inputParams[0].documentDefinitionName = docData.name;
        // create process
        let processGuid = await apiCoreUtil.createProcess(oneTaskFlowProcess);
        console.log('New Process Created =============>', oneTaskFlowProcess.name, "=====GUID:", processGuid);

        // get new document details
        let newDocDetails: AxiosResponse = await apiCoreUtil.getDocumentForProcessDetails(docData.name);

        // create DynamicDataDefinition
        let dynamicDataDefinitionPayload = cloneDeep(DYNAMIC_DATA_DEFINITION);
        dynamicDataDefinitionPayload.fieldInstances[450000153].value = newDocDetails.data.guid;
        dynamicDataDefinitionPayload.fieldInstances[450000154].value = caseTemplateGuid;
        dynamicDataDefinitionPayload.fieldInstances[450000159].value = docData.name;
        let dynamicDataDefinition = await apiCoreUtil.createRecordInstance(dynamicDataDefinitionPayload);
        console.log('Create DynamicDataDefinition =============>', dynamicDataDefinition.status);

        // link task flow process to case template
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

        let caseTemplateGuid = await apiCoreUtil.getCaseTemplateGuid(caseTemplateId);
        let taskTemplateGuid1 = await apiCoreUtil.getTaskTemplateGuid(taskTemplateId1);
        let taskTemplateGuid2 = await apiCoreUtil.getTaskTemplateGuid(taskTemplateId2);
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
        let newDocForProcess: AxiosResponse = await apiCoreUtil.createDocumentForProcess(docData);
        console.log('Create Document for TaskFlow Process =============>', newDocForProcess.status);
        twoTaskFlowProcess.inputParams[0].documentDefinitionName = docData.name;
        // create process
        let processGuid = await apiCoreUtil.createProcess(twoTaskFlowProcess);
        console.log('New Process Created =============>', twoTaskFlowProcess.name, "=====GUID:", processGuid);

        // get new document details
        let newDocDetails: AxiosResponse = await apiCoreUtil.getDocumentForProcessDetails(docData.name);

        // create DynamicDataDefinition
        let dynamicDataDefinitionPayload = cloneDeep(DYNAMIC_DATA_DEFINITION);
        dynamicDataDefinitionPayload.fieldInstances[450000153].value = newDocDetails.data.guid;
        dynamicDataDefinitionPayload.fieldInstances[450000154].value = caseTemplateGuid;
        dynamicDataDefinitionPayload.fieldInstances[450000159].value = docData.name;
        let dynamicDataDefinition = await apiCoreUtil.createRecordInstance(dynamicDataDefinitionPayload);
        console.log('Create DynamicDataDefinition =============>', dynamicDataDefinition.status);

        // link task flow process to case template
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = twoTaskFlowProcess.name;
        let associateCaseTemplateWithTwoTaskTemplateResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
        console.log('AssociateCaseTemplateWithOneTaskTemplateResponse API Status =============>', associateCaseTemplateWithTwoTaskTemplateResponse.status);
        return associateCaseTemplateWithTwoTaskTemplateResponse.status == 204;
    }

    async associateCaseTemplateWithThreeTaskTemplate(caseTemplateId: string, taskTemplateId1: string, taskTemplateId2: string, taskTemplateId3: string, structure?: string): Promise<boolean> {
        let threeTaskFlowProcess: any = cloneDeep(THREE_TASKFLOW_SEQUENTIAL);
        if (structure == 'DRDMV_15000') {
            threeTaskFlowProcess = cloneDeep(DRDMV_15000);
        }
        else if (structure == 'THREE_TASKFLOW_SEQUENTIAL_PARALLEL') {
            threeTaskFlowProcess = cloneDeep(THREE_TASKFLOW_SEQUENTIAL_PARALLEL);
        }
        let caseTemplateGuid = await apiCoreUtil.getCaseTemplateGuid(caseTemplateId);
        let taskTemplateGuid1 = await apiCoreUtil.getTaskTemplateGuid(taskTemplateId1);
        let taskTemplateGuid2 = await apiCoreUtil.getTaskTemplateGuid(taskTemplateId2);
        let taskTemplateGuid3 = await apiCoreUtil.getTaskTemplateGuid(taskTemplateId3);
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
        let newDocForProcess: AxiosResponse = await apiCoreUtil.createDocumentForProcess(docData);
        console.log('Create Document for TaskFlow Process =============>', newDocForProcess.status);
        threeTaskFlowProcess.inputParams[0].documentDefinitionName = docData.name;
        // create process
        let processGuid = await apiCoreUtil.createProcess(threeTaskFlowProcess);
        console.log('New Process Created =============>', threeTaskFlowProcess.name, "=====GUID:", processGuid);

        // get new document details
        let newDocDetails: AxiosResponse = await apiCoreUtil.getDocumentForProcessDetails(docData.name);

        // create DynamicDataDefinition
        let dynamicDataDefinitionPayload = cloneDeep(DYNAMIC_DATA_DEFINITION);
        dynamicDataDefinitionPayload.fieldInstances[450000153].value = newDocDetails.data.guid;
        dynamicDataDefinitionPayload.fieldInstances[450000154].value = caseTemplateGuid;
        dynamicDataDefinitionPayload.fieldInstances[450000159].value = docData.name;
        let dynamicDataDefinition = await apiCoreUtil.createRecordInstance(dynamicDataDefinitionPayload);
        console.log('Create DynamicDataDefinition =============>', dynamicDataDefinition.status);

        // link task flow process to case template
        let caseTemplateJsonData = await apiCoreUtil.getRecordInstanceDetails("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid);
        caseTemplateJsonData.fieldInstances[450000165].value = threeTaskFlowProcess.name;
        let associateCaseTemplateWithThreeTaskTemplateResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, caseTemplateJsonData);
        console.log('AssociateCaseTemplateWithThreeTaskTemplateResponse API Status =============>', associateCaseTemplateWithThreeTaskTemplateResponse.status);
        return associateCaseTemplateWithThreeTaskTemplateResponse.status == 204;
    }

    async createEmailTemplate(data: IEmailTemplate): Promise<boolean> {
        let emailTemplateFile = await require('../data/api/email/email.template.api.json');
        let templateData = await emailTemplateFile.EmailTemplateData;
        templateData.processInputValues["Company"] = data.Company;
        templateData.processInputValues["TemplateName"] = data.TemplateName;
        templateData.processInputValues["Line of Business"] = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.processInputValues["Line of Business"];
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
        templateData.processInputValues["Company"] = data.Company;
        templateData.processInputValues["TemplateName"] = data.TemplateName;
        templateData.processInputValues["Status"] = data.Status;
        templateData.processInputValues["Description"] = data.Description;
        templateData.processInputValues["EmailMessageSubject"] = data.EmailMessageSubject;
        templateData.processInputValues["EmailMessageBody"] = data.EmailMessageBody;
        templateData.processInputValues["Module"] = "Cases";
        templateData.processInputValues["Source Definition Name"] = "com.bmc.dsm.case-lib:Case";
        templateData.processInputValues["Line of Business"] = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.processInputValues["Line of Business"];
        const emailTemplateResponse = await axios.post(
            commandUri,
            templateData
        );

        console.log('Create Email Template API Status =============>', emailTemplateResponse.status);
        return emailTemplateResponse.status == 201;
    }

    async createNotesTemplate(module: string, data: INotesTemplate): Promise<boolean> {
        let templateData = NOTES_TEMPLATE;
        templateData.processInputValues["Company"] = data.company;
        templateData.processInputValues["Template Name"] = data.templateName;
        templateData.processInputValues["Status"] = data.templateStatus;
        templateData.processInputValues["MessageBody"] = data.body;
        templateData.processInputValues["Label"] = data.label ? await apiCoreUtil.getLabelGuid(data.label) : templateData.processInputValues["Label"];
        templateData.processInputValues["Line of Business"] = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : templateData.processInputValues["Line of Business"];
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
                templateData.processInputValues["Source Definition Name"] = "CTM:People";
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
                console.log("ERROR: Invalid module name");
                break;
            }
        }
        const notesTemplateResponse = await axios.post(
            commandUri,
            templateData
        );

        console.log('Create Notes Template API Status =============>', notesTemplateResponse.status);
        return notesTemplateResponse.status == 201;
    }

    async createKnowledgeArticle(data: IKnowledgeArticles, attachment?: string): Promise<IIDs> {
        let knowledgeArticleResponse: AxiosResponse;
        let knowledgeArticleData = cloneDeep(KNOWLEDGE_ARTICLE_PAYLOAD);

        if (attachment) {
            knowledgeArticleData.fieldInstances[301820700].value = data.knowledgeSet;
            knowledgeArticleData.fieldInstances[302300502].value = data.title;
            knowledgeArticleData.fieldInstances[302312187].value = data.templateId;
            knowledgeArticleData.fieldInstances[1000000001].value = data.company ? data.company : knowledgeArticleData.fieldInstances[1000000001].value;
            knowledgeArticleData.fieldInstances[302301262].value = data.keyword ? data.keyword : knowledgeArticleData.fieldInstances[302301262].value;
            knowledgeArticleData.fieldInstances[302311201].value = data.articleDesc ? data.articleDesc : knowledgeArticleData.fieldInstances[302311201].value;
            knowledgeArticleData.fieldInstances[450000411].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : knowledgeArticleData.fieldInstances[450000411].value;
            if (data.assignedCompany) {
                let assignedCompanyData = {
                    "id": 450000157,
                    "value": data.assignedCompany
                }
                knowledgeArticleData.fieldInstances["450000157"] = assignedCompanyData;
            }

            if (data.region) {
                let regionData = {
                    "id": 200000012,
                    "value": data.region
                }
                knowledgeArticleData.fieldInstances["200000012"] = regionData;
            }

            if (data.siteGroup) {
                let siteGroupData = {
                    "id": 200000007,
                    "value": data.siteGroup
                }
                knowledgeArticleData.fieldInstances["200000007"] = siteGroupData;
            }

            if (data.site) {
                let siteData = {
                    "id": 260000001,
                    "value": data.site
                }
                knowledgeArticleData.fieldInstances["260000001"] = siteData;
            }


            if (data.categoryTier1) {
                let categData = {
                    "id": 1000000063,
                    "value": data.categoryTier1
                }
                knowledgeArticleData.fieldInstances["1000000063"] = categData;
            }

            if (data.categoryTier2) {
                let categData = {
                    "id": 1000000064,
                    "value": data.categoryTier2
                }
                knowledgeArticleData.fieldInstances["1000000064"] = categData;
            }

            if (data.categoryTier3) {
                let categData = {
                    "id": 1000000065,
                    "value": data.categoryTier3
                }
                knowledgeArticleData.fieldInstances["1000000065"] = categData;
            }

            if (data.assigneeBusinessUnit) {
                let businessUnitData = {
                    "id": 450000381,
                    "value": data.assigneeBusinessUnit
                }
                knowledgeArticleData.fieldInstances["450000381"] = businessUnitData;
            }

            if (data.assigneeSupportGroup) {
                let assineeSupportGroupData = {
                    "id": 302300512,
                    "value": data.assigneeSupportGroup
                }
                knowledgeArticleData.fieldInstances["302300512"] = assineeSupportGroupData;
            }

            if (data.assignee) {
                let assigneeGuid = await apiCoreUtil.getPersonGuid(data.assignee);
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
            knowledgeArticleResponse = await apiCoreUtil.multiFormPostWithAttachment(articleData);
            console.log('Create Knowledge Article API Status =============>', knowledgeArticleResponse.status);
        } else {
            knowledgeArticleData.fieldInstances[301820700].value = data.knowledgeSet;
            knowledgeArticleData.fieldInstances[302300502].value = data.title;
            knowledgeArticleData.fieldInstances[302312187].value = data.templateId;
            knowledgeArticleData.fieldInstances[1000000001].value = data.company ? data.company : knowledgeArticleData.fieldInstances[1000000001].value;
            knowledgeArticleData.fieldInstances[302301262].value = data.keyword ? data.keyword : knowledgeArticleData.fieldInstances[302301262].value;
            knowledgeArticleData.fieldInstances[302311201].value = data.articleDesc ? data.articleDesc : knowledgeArticleData.fieldInstances[302311201].value;
            knowledgeArticleData.fieldInstances[450000411].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : knowledgeArticleData.fieldInstances[450000411].value;

            if (data.assignedCompany) {
                let assignedCompanyData = {
                    "id": 450000157,
                    "value": data.assignedCompany
                }
                knowledgeArticleData.fieldInstances["450000157"] = assignedCompanyData;
            }
            if (data.region) {
                let regionData = {
                    "id": 200000012,
                    "value": data.region
                }
                knowledgeArticleData.fieldInstances["200000012"] = regionData;
            }

            if (data.siteGroup) {
                let siteGroupData = {
                    "id": 200000007,
                    "value": data.siteGroup
                }
                knowledgeArticleData.fieldInstances["200000007"] = siteGroupData;
            }

            if (data.site) {
                let siteData = {
                    "id": 260000001,
                    "value": data.site
                }
                knowledgeArticleData.fieldInstances["260000001"] = siteData;
            }

            if (data.categoryTier1) {
                let categData = {
                    "id": 1000000063,
                    "value": data.categoryTier1
                }
                knowledgeArticleData.fieldInstances["1000000063"] = categData;
            }

            if (data.categoryTier2) {
                let categData = {
                    "id": 1000000064,
                    "value": data.categoryTier2
                }
                knowledgeArticleData.fieldInstances["1000000064"] = categData;
            }

            if (data.categoryTier3) {
                let categData = {
                    "id": 1000000065,
                    "value": data.categoryTier3
                }
                knowledgeArticleData.fieldInstances["1000000065"] = categData;
            }

            if (data.assigneeBusinessUnit) {
                let businessUnitData = {
                    "id": 450000381,
                    "value": data.assigneeBusinessUnit
                }
                knowledgeArticleData.fieldInstances["450000381"] = businessUnitData;
            }

            if (data.assigneeSupportGroup) {
                let assineeSupportGroupData = {
                    "id": 302300512,
                    "value": data.assigneeSupportGroup
                }
                knowledgeArticleData.fieldInstances["302300512"] = assineeSupportGroupData;
            }

            if (data.assignee) {
                let assigneeGuid = await apiCoreUtil.getPersonGuid(data.assignee);
                let assigneeData = {
                    "id": 302300513,
                    "value": `${assigneeGuid}`
                }
                knowledgeArticleData.fieldInstances["302300513"] = assigneeData;
            }
            knowledgeArticleResponse = await apiCoreUtil.createRecordInstance(knowledgeArticleData);
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
        knowledgeArticleData.fieldInstances[536870913].value = await apiCoreUtil.getStatusGuid('com.bmc.dsm.knowledge', constants.Knowledge[articleStatus], articleStatus);

        if (reviewer) {
            let reviewerSGPayload = {
                "id": 301122400,
                "value": reviewerGroup
            }
            let reviewerGuid = await apiCoreUtil.getPersonGuid(reviewer);
            let reviewerPayload = {
                "id": 302309801,
                "value": `${reviewerGuid}`
            }
            let reviewerCompanyPayload = {
                "id": 450000300,
                "value": reviewerOrg
            }
            knowledgeArticleData.fieldInstances[301122400] = reviewerSGPayload;
            knowledgeArticleData.fieldInstances[302309801] = reviewerPayload;
            knowledgeArticleData.fieldInstances[450000300] = reviewerCompanyPayload;
        }

        let knowledgeArticleResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.knowledge:Knowledge Article Template", articleGuid, knowledgeArticleData);
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
            emailTemplateGuid = await apiCoreUtil.getEmailTemplateGuid(emailTemplateName, company);
        }
        else { emailTemplateGuid = await apiCoreUtil.getEmailTemplateGuid(emailTemplateName); }
        return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.notification-lib:NotificationTemplate', emailTemplateGuid);
    }

    async createNewFlowset(data: IFlowset): Promise<IIDs> {
        let flowsetData = cloneDeep(FLOWSET_TEMPLATE);
        flowsetData.fieldInstances[1000000001].value = data.company;
        flowsetData.fieldInstances[450000002].value = data.flowsetName;
        flowsetData.fieldInstances[8].value = data.description;
        flowsetData.fieldInstances[7].value = data.flowsetStatus;
        flowsetData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : flowsetData.fieldInstances[450000420].value;
        const flowset = await apiCoreUtil.createRecordInstance(flowsetData);
        const flowsetDetails = await axios.get(
            flowset.headers.location
        );
        console.log('New Flowset Details API Status =============>', flowsetDetails.status);
        return {
            id: flowsetDetails.data.id,
            displayId: flowsetDetails.data.displayId
        };
    }

    async disableDomainTag(domainTagGuid: string): Promise<boolean> {
        let domainTagFile = await require('../data/api/foundation/domain.tag.api.json');
        let domainTagData = await domainTagFile.disableDomainTag;
        let domainConfigGuid = await apiCoreUtil.getDomainConfigurationGuid(domainTagGuid);
        domainTagData.id = domainConfigGuid;
        domainTagData.fieldInstances[450000152].value = domainTagGuid;
        let domainTagResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.shared-services-lib:Domain Configuration', domainConfigGuid, domainTagData);
        console.log('Disable Domain Tag API Status =============>', domainTagResponse.status);
        return domainTagResponse.status == 204;
    }

    async createNewMenuItem(data: IMenuItem): Promise<IIDs> {
        let randomStr = [...Array(6)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
        let menuItemData = cloneDeep(MENU_ITEM);
        menuItemData.fieldInstances[450000153].value = data.menuType;
        menuItemData.fieldInstances[450000152].value = data.menuItemName;
        menuItemData.fieldInstances[7].value = constants.MenuItemStatus[data.menuItemStatus];
        menuItemData.fieldInstances[450000154].value = randomStr;
        menuItemData.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : menuItemData.fieldInstances[450000420].value;
        if (data.uiVisible) {
            let valueOfVisiable = data.uiVisible;
            let uiVisiablePayload = {
                "id": "450000471",
                "value": `${valueOfVisiable}`
            }
            menuItemData.fieldInstances[450000471] = uiVisiablePayload;
        }
        const menuItem = await apiCoreUtil.createRecordInstance(menuItemData);
        const menuItemDetails = await axios.get(
            menuItem.headers.location
        );
        console.log('New Menu Item API Status =============>', menuItemDetails.status);

        return {
            id: menuItemDetails.data.id,
            displayId: menuItemDetails.data.displayId
        };
    }

    async createComplexSurvey(serviceReqId: string, payloadName: string): Promise<boolean> {
        let complexSurveyData = cloneDeep(COMPLEX_SURVEY[payloadName]);
        complexSurveyData['serviceRequestId'] = serviceReqId;

        const complexSurvey = await axios.post(
            "api/com.bmc.dsm.catalog-lib/surveys",
            complexSurveyData
        );
        console.log('Complex Survey API Status =============>', complexSurvey.status);
        return complexSurvey.status == 200;
    }

    async setDefaultNotificationForUser(user: string, notificationType: string): Promise<void> {
        let personGuid: string = await apiCoreUtil.getPersonGuid(user);
        console.log(personGuid);

        let notificationTypeFile = await require('../data/api/foundation/default.notification.user.api.json');
        let defaultNotificationData = await notificationTypeFile.NotificationSet;
        defaultNotificationData.id = personGuid;
        defaultNotificationData.fieldInstances[430000003].value = constants.NotificationType[notificationType];
        let uri: string = "api/rx/application/record/recordinstance/com.bmc.arsys.rx.foundation%3APerson/" + personGuid;
        const notificationSetting = await axios.put(
            uri,
            defaultNotificationData
        );
        console.log("Alert status =============>", notificationSetting.status);
    }

    async deleteDynamicFieldAndGroup(dynamicAttributeName?: string): Promise<boolean> {
        if (dynamicAttributeName) {
            let dynamicFieldGuid = await apiCoreUtil.getDynamicFieldGuid(dynamicAttributeName);
            let dynamicGroupGuid = await apiCoreUtil.getDynamicGroupGuid(dynamicAttributeName);
            if (dynamicFieldGuid) {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeDefinition', dynamicFieldGuid);
            } else if (dynamicGroupGuid) {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeGroupDefinition', dynamicGroupGuid);
            }
        }
        else {
            let allDynamicFieldRecords = await apiCoreUtil.getGuid('com.bmc.dsm.ticketing-lib:AttributeDefinition');
            let dynamicFieldArrayMap = allDynamicFieldRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeDefinition', obj[179]);
            });
            let isAllDynamicFieldDeleted: boolean = await Promise.all(dynamicFieldArrayMap).then(async (result) => {
                return !result.includes(false);
            });

            let allDynamicGroupRecords = await apiCoreUtil.getGuid('com.bmc.dsm.ticketing-lib:AttributeGroupDefinition');
            let dynamicGroupArrayMap = allDynamicGroupRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.ticketing-lib:AttributeGroupDefinition', obj[179]);
            });
            let isAllDynamicGroupDeleted: boolean = await Promise.all(dynamicGroupArrayMap).then(async (result) => {
                return !result.includes(false);
            });

            return isAllDynamicFieldDeleted === isAllDynamicGroupDeleted === true;
        }
    }

    async deleteFlowsetProcessLibConfig(processName: string) {
        let allProcessLibConfig = await apiCoreUtil.getGuid('com.bmc.dsm.flowsets-lib:Process Library');
        allProcessLibConfig.data.data.map(async (obj) => {
            if (obj[450000002] == processName) {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.flowsets-lib:Process Library', obj[179]);
            }
        });
    }

    async updateCaseAccess(caseGuid: string, data: IUpdateCaseAccess): Promise<number> {
        let caseAccessData = cloneDeep(CASE_ACCESS_COMMAND);
        caseAccessData.processInputValues.Type = data.type;
        caseAccessData.processInputValues['Operation'] = data.operation;
        caseAccessData.processInputValues['Security Type'] = data.security;
        caseAccessData.processInputValues['Value'] = data.username;
        caseAccessData.processInputValues["Record Instance ID"] = caseGuid;
        const updateCaseAccess = await axios.post(
            commandUri,
            caseAccessData
        );
        console.log('Update Case Access API Status =============>', updateCaseAccess.status);

        let caseAccessChildSecurityData = cloneDeep(CASE_ACCESS_CHILD_SECURITY);
        caseAccessChildSecurityData.processInputValues["Record Instance ID"] = caseGuid;
        const updateCaseAccessChildSecurity = await axios.post(
            commandUri,
            caseAccessChildSecurityData
        );
        console.log('Update Case Access Child Security API Status =============>', updateCaseAccessChildSecurity.status);
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
        console.log(`Update case status to ${status} API status =============>`, updateCaseStatus.status);
        return updateCaseStatus.status;
    }

    async createProcessLibConfig(data: IFlowsetProcess): Promise<IIDs> {
        let newProcessConfig = cloneDeep(NEW_PROCESS_LIB);
        newProcessConfig.fieldInstances[61001]["value"] = data.applicationServicesLib;
        newProcessConfig.fieldInstances[450000002]["value"] = data.processName;
        newProcessConfig.fieldInstances[450000003]["value"] = data.processAliasName;
        newProcessConfig.fieldInstances[7]["value"] = data.status ? constants.ProcessLibConf[data.status] : newProcessConfig.fieldInstances[7].value;
        newProcessConfig.fieldInstances[8]["value"] = data.description ? data.description : newProcessConfig.fieldInstances[8].value;
        newProcessConfig.fieldInstances[1000000001]["value"] = data.company ? data.company : newProcessConfig.fieldInstances[1000000001].value;
        newProcessConfig.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : newProcessConfig.fieldInstances[450000420].value;

        let newProcessLibConfRecord: AxiosResponse = await apiCoreUtil.createRecordInstance(newProcessConfig);
        console.log('Create New Process Lib Config API Status =============>', newProcessLibConfRecord.status);

        const processLibConfRecord = await axios.get(
            newProcessLibConfRecord.headers.location
        );
        console.log(`New Process API Status ${data.processName} =============>`, processLibConfRecord.status);

        return {
            id: processLibConfRecord.data.id,
            displayId: processLibConfRecord.data.displayId
        };
    }

    async deleteServiceTargets(serviceTargetTitle?: string): Promise<boolean> {
        if (serviceTargetTitle) {
            let serviceTargetGuid = await apiCoreUtil.getServiceTargetGuid(serviceTargetTitle);
            if (serviceTargetGuid) {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.slm-lib:Service Target', serviceTargetGuid);
            }
        }
        else {
            let allSVTRecords = await apiCoreUtil.getGuid('com.bmc.dsm.slm-lib:Service Target');
            let svtArrayMap = allSVTRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.slm-lib:Service Target', obj[179]);
            });
            let isAllSVTDeleted: boolean = await Promise.all(svtArrayMap).then(async (result) => {
                return !result.includes(false);
            });
            return isAllSVTDeleted === true;
        }
    }

    async deleteApprovalMapping(approvalModule: string, approvalMappingName?: string): Promise<boolean> {
        let approvalMappingRecordDefinition: string;
        switch (approvalModule) {
            case "Case": {
                approvalMappingRecordDefinition = "com.bmc.dsm.case-lib:Case Approval Mapping";
                if (approvalMappingName) {
                    let allRecords = await apiCoreUtil.getGuid(approvalMappingRecordDefinition);
                    let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                        return obj[1000001437] === approvalMappingName;
                    });
                    let approvalMapGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
                    if (approvalMapGuid) {
                        return await apiCoreUtil.deleteRecordInstance(approvalMappingRecordDefinition, approvalMapGuid);
                    }
                } else {
                    let allApprovalMapRecords = await apiCoreUtil.getGuid(approvalMappingRecordDefinition);
                    let allApprovalMapArrayMap = allApprovalMapRecords.data.data.map(async (obj: string) => {
                        return await apiCoreUtil.deleteRecordInstance(approvalMappingRecordDefinition, obj[379]);
                    });
                    return await Promise.all(allApprovalMapArrayMap).then(async (result) => {
                        return !result.includes(false);
                    });
                }
                break;
            }
            case "Knowledge": {
                approvalMappingRecordDefinition = "com.bmc.dsm.knowledge:Knowledge Approval Mapping";
                if (approvalMappingName) {
                    let allRecords = await apiCoreUtil.getGuid(approvalMappingRecordDefinition);
                    let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                        return obj[1000001437] === approvalMappingName;
                    });
                    let approvalMapGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
                    if (approvalMapGuid) {
                        return await apiCoreUtil.deleteRecordInstance(approvalMappingRecordDefinition, approvalMapGuid);
                    }
                } else {
                    let allApprovalMapRecords = await apiCoreUtil.getGuid(approvalMappingRecordDefinition);
                    let allApprovalMapArrayMap = allApprovalMapRecords.data.data.map(async (obj: string) => {
                        return await apiCoreUtil.deleteRecordInstance(approvalMappingRecordDefinition, obj[379]);
                    });
                    return await Promise.all(allApprovalMapArrayMap).then(async (result) => {
                        return !result.includes(false);
                    });
                }

                break;
            }
            case "Task": {
                approvalMappingRecordDefinition = "com.bmc.dsm.task-lib:Task Approval Mapping";
                if (approvalMappingName) {
                    let allRecords = await apiCoreUtil.getGuid(approvalMappingRecordDefinition);
                    let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                        return obj[450000152] === approvalMappingName;
                    });
                    let approvalMapGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
                    if (approvalMapGuid) {
                        return await apiCoreUtil.deleteRecordInstance(approvalMappingRecordDefinition, approvalMapGuid);
                    }
                } else {
                    let allApprovalMapRecords = await apiCoreUtil.getGuid(approvalMappingRecordDefinition);
                    let allApprovalMapArrayMap = allApprovalMapRecords.data.data.map(async (obj: string) => {
                        return await apiCoreUtil.deleteRecordInstance(approvalMappingRecordDefinition, obj[379]);
                    });
                    return await Promise.all(allApprovalMapArrayMap).then(async (result) => {
                        return !result.includes(false);
                    });
                }

                break;
            }
            default: {
                console.log('ERROR: Put valid Record Definition for approval flow deletion');
                break;
            }
        }
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
        documentLibRecordInstanceJson.fieldInstances[1000000001].value = docLibDetails.company;
        documentLibRecordInstanceJson.fieldInstances[302300512].value = docLibDetails.ownerGroup;
        documentLibRecordInstanceJson.fieldInstances[450000441].value = docLibDetails.shareExternally ? '1' : '0';
        documentLibRecordInstanceJson.fieldInstances[200000007].value = docLibDetails.region ? docLibDetails.region : documentLibRecordInstanceJson.fieldInstances[200000007].value;
        documentLibRecordInstanceJson.fieldInstances[260000001].value = docLibDetails.site ? docLibDetails.site : documentLibRecordInstanceJson.fieldInstances[260000001].value;
        documentLibRecordInstanceJson.fieldInstances[302301262].value = docLibDetails.keywordTag ? docLibDetails.keywordTag : documentLibRecordInstanceJson.fieldInstances[302301262].value;
        documentLibRecordInstanceJson.fieldInstances[450000153].value = docLibDetails.description ? docLibDetails.description : documentLibRecordInstanceJson.fieldInstances[450000153].value;
        documentLibRecordInstanceJson.fieldInstances[450000381].value = docLibDetails.businessUnit ? docLibDetails.businessUnit : documentLibRecordInstanceJson.fieldInstances[450000381].value;
        documentLibRecordInstanceJson.fieldInstances[1000000063].value = docLibDetails.category1 ? docLibDetails.category1 : documentLibRecordInstanceJson.fieldInstances[1000000063].value;
        documentLibRecordInstanceJson.fieldInstances[1000000064].value = docLibDetails.category2 ? docLibDetails.category2 : documentLibRecordInstanceJson.fieldInstances[1000000064].value;
        documentLibRecordInstanceJson.fieldInstances[1000000065].value = docLibDetails.category3 ? docLibDetails.category3 : documentLibRecordInstanceJson.fieldInstances[1000000065].value;
        documentLibRecordInstanceJson.fieldInstances[450000167].value = docLibDetails.category4 ? docLibDetails.category4 : documentLibRecordInstanceJson.fieldInstances[450000167].value;
        documentLibRecordInstanceJson.fieldInstances[450000411].value = docLibDetails.lineOfBusiness ? await constants.LOB[docLibDetails.lineOfBusiness] : documentLibRecordInstanceJson.fieldInstances[450000411].value;
        let data = {
            recordInstance: documentLibRecordInstanceJson,
            1000000351: filePath
        };

        let newDocumentLib: AxiosResponse = await apiCoreUtil.multiFormPostWithAttachment(data);
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

        let publishDocLibResponse: AxiosResponse = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.knowledge:Knowledge Article', docLibInfo.id, publishDocLibPayload);
        console.log('Publish Doc Lib API Status =============>', publishDocLibResponse.status);
        return publishDocLibResponse.status == 204;
    }

    async giveReadAccessToDocLib(docLibInfo: IIDs, orgName: string): Promise<boolean> {
        let readAccessDocLibPayload = cloneDeep(DOC_LIB_READ_ACCESS);
        readAccessDocLibPayload['processInputValues']['Record Instance ID'] = docLibInfo.id;
        let orgId = orgName;
        if (orgId == null) { orgId = orgName; }
        if (orgId == null) { orgId = orgName; }
        readAccessDocLibPayload['processInputValues']['Value'] = orgId;
        const readAccessDocLibResponse = await axios.post(commandUri, readAccessDocLibPayload);
        console.log('Read Access Doc Lib API Status =============>', readAccessDocLibResponse.status);
        return readAccessDocLibResponse.status == 201;
    }

    async deleteDocumentLibrary(documentLibTitle: string): Promise<boolean> {
        let docLibGuid = await apiCoreUtil.getDocLibGuid(documentLibTitle);
        if (docLibGuid) {
            return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Article', docLibGuid);
        } else console.log('Doc Lib GUID not found =============>', documentLibTitle);
    }

    async deleteReadAccessOrAssignmentMapping(recordName: string): Promise<boolean> {
        let recordGuid = await apiCoreUtil.getReadAccessOrAssignmentMappingGuid(recordName);
        if (recordGuid) {
            return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.case-lib:Case Assignment Mapping', recordGuid);
        } else console.log('Read Access not found =============>', recordName);
    }

    async createKnowledgeSet(knowledgeSetDetails: IKnowledgeSet): Promise<IIDs> {
        let knowledgeSetData = cloneDeep(KNOWLEDGE_SET);
        knowledgeSetData.fieldInstances[8].value = knowledgeSetDetails.knowledgeSetDesc;
        knowledgeSetData.fieldInstances[301820700].value = knowledgeSetDetails.knowledgeSetTitle;
        knowledgeSetData.fieldInstances[1000000001].value = knowledgeSetDetails.company
        knowledgeSetData.fieldInstances[450000420].value = knowledgeSetDetails.lineOfBusiness ? await constants.LOB[knowledgeSetDetails.lineOfBusiness] : knowledgeSetData.fieldInstances[450000420].value;

        let recordInstanceKSetAssociationJson = cloneDeep(KNOWLEDEGESET_ASSOCIATION);
        let data = {
            recordInstance: knowledgeSetData,
            associationOperations: recordInstanceKSetAssociationJson
        };

        let newKnowledgeSet: AxiosResponse = await apiCoreUtil.multiFormPostWithAttachment(data);
        console.log('Create Knowledge set API Status =============>', newKnowledgeSet.status);
        const newKnowledgeSetDetails = await axios.get(
            await newKnowledgeSet.headers.location
        );
        return {
            id: newKnowledgeSetDetails.data.id,
            displayId: newKnowledgeSetDetails.data.displayId
        };
    }

    async giveReadAccessToKnowledgeSet(knowledgeSetInfo: IIDs): Promise<boolean> {
        let KnowledgeSetAccessPayload = {
            "processDefinitionName": "com.bmc.dsm.knowledge:Knowledge Set - Set Access",
            "processInputValues": {
                "Operation": "ADD",
                "Type": "GROUP",
                "Value": 2000000004,
                "Security Type": "READ",
                "Record Instance ID": "AGGADGGYC3VHQAQQVMYWQQVMYW8CK2"
            },
            "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand"
        };
        KnowledgeSetAccessPayload['processInputValues']['Record Instance ID'] = knowledgeSetInfo.id;
        const knowledgeSetAccessResponse = await axios.post(commandUri, KnowledgeSetAccessPayload);
        console.log('Read Access Doc Lib API Status =============>', knowledgeSetAccessResponse.status);
        return knowledgeSetAccessResponse.status == 201;
    }

    async createKnowledgeArticleTemplate(data: IKnowledgeArticleTemplate): Promise<boolean> {
        let knowledgeSetTemplateData = cloneDeep(KNOWLEDGEARTICLE_TEMPLATE);
        knowledgeSetTemplateData.templateName = data.templateName;
        knowledgeSetTemplateData.sections[0].title = data.sectionTitle;
        knowledgeSetTemplateData.templateDescription = data.templateDescription ? data.templateDescription : knowledgeSetTemplateData.templateDescription;
        knowledgeSetTemplateData.knowledgeSet = data.knowledgeSetTitle ? data.knowledgeSetTitle : knowledgeSetTemplateData.templateDescription;
        knowledgeSetTemplateData.status = data.status ? await constants.ArticleTemplateStatus[data.status] : knowledgeSetTemplateData.status;
        knowledgeSetTemplateData.knowledgeSetId = await apiCoreUtil.getKnowledgeSetGuid(data.knowledgeSetTitle);
        knowledgeSetTemplateData.lobId = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : knowledgeSetTemplateData.lobId;
        const articleTemplateResponse = await axios.post(
            articleTemplateUri,
            knowledgeSetTemplateData
        );

        console.log('Create Knowledge Article Template API Status =============>', articleTemplateResponse.status);
        return articleTemplateResponse.status === 200;
    }

    async updateKnowledgeArticleViewAndHelpFulCounter(knowledgeArticleGuid: string, data: IUpdateKnowledgeArticle): Promise<boolean> {
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
        console.log('Alert API Status =============>', updateArticleHelpfulCounterResponse.status);
        return updateArticleHelpfulCounterResponse.status == 204;
    }

    async deleteFoundationEntity(entityName: string, data: IFoundationEntity): Promise<boolean> {
        let recordName: string, recordGUID: string, jsonBody: any;
        recordName = 'com.bmc.arsys.rx.foundation:Person';
        recordGUID = await apiCoreUtil.getPersonGuid(entityName);
        if (data.functionalRole) {
            jsonBody = cloneDeep(DELETE_PERSON);
            jsonBody.id = recordGUID;
            let newUserRoles: string = constants.FunctionalRoleGuid[data.functionalRole]
            let updateFunctionalRolePayload = {
                "id": "430000002",
                "value": newUserRoles
            }
            jsonBody.fieldInstances[430000002] = updateFunctionalRolePayload;
        }
        let updateFoundationEntityResponse = await apiCoreUtil.updateRecordInstance(recordName, recordGUID, jsonBody);
        console.log('Update Foundation Entity API Status =============>', updateFoundationEntityResponse.status);
        return updateFoundationEntityResponse.status == 204;
    }

    async updateFoundationEntity(entityType: string, entityName: string, data: IFoundationEntity): Promise<boolean> {
        let recordName: string, recordGUID: string, jsonBody: any;
        switch (entityType) {
            case "Person": {
                recordName = 'com.bmc.arsys.rx.foundation:Person';
                recordGUID = await apiCoreUtil.getPersonGuid(entityName);
                if (data.vipStatus) {
                    jsonBody = cloneDeep(UPDATE_PERSON);
                    jsonBody.id = recordGUID;
                    let vipStatusValue: number;
                    data.vipStatus == 'Yes' ? vipStatusValue = 100 : vipStatusValue = 200;
                    let updateVIPPayload = {
                        "id": "1000000026",
                        "value": vipStatusValue
                    }
                    jsonBody.fieldInstances[1000000026] = updateVIPPayload;
                }
                if (data.functionalRole) {
                    jsonBody = cloneDeep(UPDATE_PERSON);
                    jsonBody.id = recordGUID;
                    let currentUserRoles: string = await apiCoreUtil.getPersonFunctionalRoles(entityName);
                    let newUserRoles: string = currentUserRoles + ';' + constants.FunctionalRoleGuid[data.functionalRole]
                    let updateFunctionalRolePayload = {
                        "id": "430000002",
                        "value": newUserRoles
                    }
                    jsonBody.fieldInstances[430000002] = updateFunctionalRolePayload;
                }
                break;
            }
            case "SupportGroup": {
                recordName = 'com.bmc.arsys.rx.foundation:Support Group';
                recordGUID = await apiCoreUtil.getSupportGroupGuid(entityName);
                if (data.confidential) {
                    jsonBody = cloneDeep(UPDATE_SUPPORT_GROUP);
                    jsonBody.id = recordGUID;
                    let confidentialFlag: string;
                    data.confidential == 'true' ? confidentialFlag = '1' : confidentialFlag = '0';
                    let updateConfidentialPayload = {
                        "id": "300000000",
                        "value": confidentialFlag
                    }
                    jsonBody.fieldInstances[300000000] = updateConfidentialPayload;
                }
                break;
            }
            case "Organization": {
                recordName = 'com.bmc.arsys.rx.foundation:Primary Organization';
                if (data.abbreviation) {
                    jsonBody = cloneDeep(UPDATE_ORGANIZATION);
                    jsonBody.id = entityName;
                    let updateOrganizationPayload = {
                        "id": "1000000071",
                        "value": data.abbreviation
                    }
                    jsonBody.fieldInstances[1000000071] = updateOrganizationPayload;
                }
                break;
            }
            default: {
                console.log('ERROR: Invalid Entity Type.');
                break;
            }
        }
        let updateFoundationEntityResponse = await apiCoreUtil.updateRecordInstance(recordName, recordGUID, jsonBody);
        console.log('Update Foundation Entity API Status =============>', updateFoundationEntityResponse.status);
        return updateFoundationEntityResponse.status == 204;
    }

    async createSVT(svtData: ICreateSVT): Promise<IIDs> {
        let serviceTargetPayload = cloneDeep(SERVICE_TARGET_PAYLOAD);
        serviceTargetPayload.fieldInstances[300271400].value = svtData.terms;
        serviceTargetPayload.fieldInstances[304412691].value = svtData.readableTerms;
        serviceTargetPayload.fieldInstances[300273000].value = svtData.startWhen;
        serviceTargetPayload.fieldInstances[304411891].value = svtData.readableStartWhen;
        serviceTargetPayload.fieldInstances[300273100].value = svtData.stopWhen;
        serviceTargetPayload.fieldInstances[304411911].value = svtData.readableStopWhen;
        serviceTargetPayload.fieldInstances[300398100].value = svtData.goalTimeMinutes;
        serviceTargetPayload.fieldInstances[490000400].value = svtData.svtName;
        serviceTargetPayload.fieldInstances[300523400].value = await apiCoreUtil.getDataSourceGuid(svtData.dataSource);
        serviceTargetPayload.fieldInstances[304412961].value = svtData.company;
        serviceTargetPayload.fieldInstances[450000420].value = svtData.lineOfBusiness ? await constants.LOB[svtData.lineOfBusiness] : serviceTargetPayload.fieldInstances[450000420].value;
        let slmResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(serviceTargetPayload);
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
        adhocTaskPayload.fieldInstances[1000000001].value = taskData.company;
        adhocTaskPayload.fieldInstances[450000157].value = taskData.company;
        adhocTaskPayload.fieldInstances[450000152].value = await apiCoreUtil.getPersonGuid(taskData.assignee);
        adhocTaskPayload.fieldInstances[450000381].value = taskData.businessUnit;
        adhocTaskPayload.fieldInstances[1000000217].value = taskData.supportGroup;
        adhocTaskPayload.fieldInstances[536870913].value = caseGuid;
        taskData.priority ? adhocTaskPayload.fieldInstances[1000000164].value = constants.CasePriority[taskData.priority] : adhocTaskPayload.fieldInstances[1000000164].value;
        adhocTaskPayload.fieldInstances[450000411].value = taskData.lineOfBusiness ? taskData.lineOfBusiness : adhocTaskPayload.fieldInstances[450000411].value;
        if (taskData.description) {
            let taskDescription = {
                "id": "1000000000",
                "value": taskData.description
            }
            adhocTaskPayload.fieldInstances["1000000000"] = taskDescription;
        }
        if (taskData.category1) {
            //let category1Guid = await apiCoreUtil.getCategoryGuid(taskData.category1);
            let category1Guid = taskData.category1;
            let taskCategory1 = {
                "id": "1000000063",
                "value": category1Guid
            }
            adhocTaskPayload.fieldInstances["1000000063"] = taskCategory1;
        }
        if (taskData.category2) {
            //let category2Guid = await apiCoreUtil.getCategoryGuid(taskData.category2);
            let category2Guid = taskData.category2;
            let taskCategory2 = {
                "id": "1000000064",
                "value": category2Guid
            }
            adhocTaskPayload.fieldInstances["1000000064"] = taskCategory2;
        }
        if (taskData.category3) {
            //let category3Guid = await apiCoreUtil.getCategoryGuid(taskData.category3);
            let category3Guid = taskData.category3;
            let taskCategory3 = {
                "id": "1000000065",
                "value": category3Guid
            }
            adhocTaskPayload.fieldInstances["1000000065"] = taskCategory3;
        }
        if (taskData.targetDate) {
            let tasktargetDate = {
                "id": "1000005261",
                "value": taskData.targetDate
            }
            adhocTaskPayload.fieldInstances["1000005261"] = tasktargetDate;
        }
        if (taskData.label) {
            let labelGuid = await apiCoreUtil.getLabelGuid(taskData.label);
            let taskLabel = {
                "id": "450000173",
                "value": labelGuid
            }
            adhocTaskPayload.fieldInstances["450000173"] = taskLabel;
        }
        if (taskData.requester) {
            let requesterGuid = await apiCoreUtil.getPersonGuid(taskData.requester);
            let taskRequester = {
                "id": "1000000337",
                "value": requesterGuid
            }
            adhocTaskPayload.fieldInstances["1000000337"] = taskRequester;
        }

        let createTaskResponse = await apiCoreUtil.createRecordInstance(adhocTaskPayload);
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
        console.log(`Update task status to ${status} API status =============>`, updateTaskStatus.status);
        return updateTaskStatus.status;
    }

    async addTaskToCase(taskData: any, caseGuid: string): Promise<AxiosResponse> {
        let taskCreationFromTemplate = cloneDeep(TASK_CREATION_FROM_TEMPLATE);
        let templateName = await apiCoreUtil.getTaskTemplateGuid(taskData.templateName);
        taskCreationFromTemplate.processInputValues["Case Company"] = taskData.company;
        taskCreationFromTemplate.processInputValues["Case ID"] = caseGuid;
        taskCreationFromTemplate.processInputValues["Requester ID"] = await apiCoreUtil.getPersonGuid(taskData.requesterId);
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

    async approverAction(recordGuid: string, action: string, assignee?: string): Promise<boolean> {
        let approvalAction = cloneDeep(APPROVAL_ACTION);
        approvalAction.commands[0].command = action;
        approvalAction.commands[0].requestID = await apiCoreUtil.getSignatureInstanceId(recordGuid);
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
        let response = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.knowledge:Knowledge Article Template', articleGuid, knowledgeArticleExtFlag);

        console.log('Update Knowledge Article External Flag API Status =============>', response.status);
        return response.status == 204;
    }

    async changeCaseAssignment(caseGuid: string, businessUnit: string, supportGroup: string, assignee?: string): Promise<boolean> {
        let updateCaseAssignment = cloneDeep(UPDATE_CASE_ASSIGNMENT);
        updateCaseAssignment.id = caseGuid;
        updateCaseAssignment.fieldInstances[450000381].value = businessUnit;
        updateCaseAssignment.fieldInstances[1000000217].value = supportGroup;
        if (assignee) updateCaseAssignment.fieldInstances[450000152].value = await apiCoreUtil.getPersonGuid(assignee);
        let updateAssignmentResponse = await apiCoreUtil.updateRecordInstance('com.bmc.dsm.case-lib:Case', caseGuid, updateCaseAssignment);
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

    async createApprovalFlow(data: any, approvalFlowModule: string, multipleApproval?: boolean, approvalFlowGroup?: string): Promise<boolean> {
        let approvalFlow: any, approvalFlowRecordDefinition: string;
        if (!multipleApproval) {
            switch (approvalFlowModule) {
                case "Case": {
                    if (!approvalFlowGroup) approvalFlowGroup = "BWFA Group";
                    approvalFlowRecordDefinition = "com.bmc.dsm.case-lib:Case";
                    approvalFlow = cloneDeep(CASE_APPROVAL_FLOW);
                    approvalFlow.approvalFlowConfigurationList[0].flowName = data.flowName;
                    approvalFlow.approvalFlowConfigurationList[0].approvers = 'U[:]' + data.approver;
                    approvalFlow.approvalFlowConfigurationList[0].qualification = data.qualification;
                    break;
                }
                case "Knowledge": {
                    if (!approvalFlowGroup) approvalFlowGroup = "Default Article Approval Flow Group";
                    approvalFlowRecordDefinition = "com.bmc.dsm.knowledge:Knowledge Article Template";
                    approvalFlow = cloneDeep(KNOWLEDGE_APPROVAL_FLOW_CONFIG);
                    approvalFlow.approvalFlowConfigurationList[0].flowName = data.flowName;
                    approvalFlow.approvalFlowConfigurationList[0].approvers = 'U[:]' + data.approver;
                    approvalFlow.approvalFlowConfigurationList[0].qualification = data.qualification;
                    break;
                }
                case "Task": {
                    if (!approvalFlowGroup) approvalFlowGroup = "Task Group";
                    approvalFlowRecordDefinition = "com.bmc.dsm.task-lib:Task";
                    approvalFlow = cloneDeep(TASK_APPROVAL_FLOW);
                    approvalFlow.approvalFlowConfigurationList[0].flowName = data.flowName;
                    approvalFlow.approvalFlowConfigurationList[0].approvers = data.approver;
                    approvalFlow.approvalFlowConfigurationList[0].qualification = data.qualification;
                    if (data.approver) {
                        approvalFlow.approvalFlowConfigurationList[0].approvers = data.approver;
                    }

                    if (data.isLevelUp) {
                        approvalFlow.approvalFlowConfigurationList[0].isLevelUp = data.isLevelUp;
                        if (data.isLevelUp == true) {
                            approvalFlow.approvalFlowConfigurationList[0].levels = data.levels;
                        }
                    }

                    if (data.signingCriteria) {
                        approvalFlow.approvalFlowConfigurationList[0].signingCriteria = data.signingCriteria;
                    }

                    break;
                }
                default: {
                    console.log('ERROR: Put valid Record Definition for approval flow creation');
                    break;
                }
            }
        } else {
            switch (approvalFlowModule) {
                case "Case": {
                    if (!approvalFlowGroup) approvalFlowGroup = "BWFA Group";
                    approvalFlowRecordDefinition = "com.bmc.dsm.case-lib:Case";
                    approvalFlow = cloneDeep(MULTI_APPROVAL_FLOW);
                    approvalFlow.approvalFlowConfigurationList = data;
                    break;
                }
                default: {
                    console.log('ERROR: Put valid Record Definition for approval flow creation');
                    break;
                }
            }
        }

        let response = await axios.put(
            `api/com.bmc.arsys.rx.approval/rx/application/approval/flowconfiguration/${approvalFlowRecordDefinition}/flowGroupName/${approvalFlowGroup}`,
            approvalFlow,
        );

        console.log('Approval Flow API Status =============>', response.status);
        return response.status == 204;
    }

    async createBusinessTimeSharedEntity(name: string, status?: number): Promise<boolean> {
        let businessTimeSharedEntity = cloneDeep(BUSINESS_TIME_SHARED_ENTITY);
        if (status) businessTimeSharedEntity.fieldInstances[7].value = status;
        businessTimeSharedEntity.fieldInstances[8].value = name;
        let response = await apiCoreUtil.createRecordInstance(businessTimeSharedEntity);
        console.log('Create Business Shared Entity API Status =============>', response.status);
        return response.status == 204;
    }

    async createBusinessTimeSegment(name: string): Promise<IIDs> {
        let businessTimeSegmentPayload = cloneDeep(BUSINESS_TIME_SEGMENT);
        businessTimeSegmentPayload.fieldInstances[8].value = name;
        let response = await apiCoreUtil.createRecordInstance(businessTimeSegmentPayload);
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
            let allRecords = await apiCoreUtil.getGuid("com.bmc.dsm.knowledge:Template Configuration");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[301820705] === articleTemplateName;
            });
            for (let i = 0; i < entityObj.length; i++) {
                let guid = entityObj.length >= 1 ? entityObj[i]['379'] || null : null;
                await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.knowledge:Template Configuration', guid);
            }
            return true;
        }
        else {
            let allArticleTemplateRecords = await apiCoreUtil.getGuid("com.bmc.dsm.knowledge:Template Configuration");
            let allArticleTemplateArrayMap = allArticleTemplateRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.knowledge:Template Configuration', obj[379]);
            });
            return await Promise.all(allArticleTemplateArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async deleteKnowledgeSet(knowledgeSetName?: string): Promise<boolean> {
        if (knowledgeSetName) {
            let allRecords = await apiCoreUtil.getGuid("com.bmc.dsm.knowledge:Knowledge Set");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[301820700].includes(knowledgeSetName);
            });
            for (let i = 0; i < entityObj.length; i++) {
                let guid = entityObj.length >= 1 ? entityObj[i]['379'] || null : null;
                await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Set', guid);
            }
            return true;
        }
        else {
            let allArticleTemplateRecords = await apiCoreUtil.getGuid("com.bmc.dsm.knowledge:Knowledge Set");
            let allArticleTemplateArrayMap = allArticleTemplateRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.knowledge:Knowledge Set', obj[379]);
            });
            return await Promise.all(allArticleTemplateArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async associateTemplateWithApprovalMapping(approvalModule: string, templatedId: string, approvalMapping: string): Promise<boolean> {
        let url;
        switch (approvalModule) {
            case "Case": {
                url = "api/com.bmc.dsm.shared-services-lib/rx/application/association/com.bmc.dsm.case-lib:Case Approval Mapping to Case Template/" + approvalMapping + "/" + templatedId + "?allowDuplicates=true";
                break;
            }
            case "Task": {
                url = "api/com.bmc.dsm.shared-services-lib/rx/application/association/com.bmc.dsm.task-lib:Task Approval Mapping to Task Templates/" + approvalMapping + "/" + templatedId + "?allowDuplicates=true";
                break;
            }
            default: {
                console.log("ERROR: Invalid url - " + url);
                break;
            }
        }
        let response = await axios.post(
            url,
            {}
        )
        console.log('Association API Status =============>', response.status);
        return response.status == 204;
    }

    async disassociateCaseTemplateFromApprovalMapping(templatedId: string, approvalMappingId: string): Promise<boolean> {
        let response = await apiCoreUtil.disassociateFoundationElements("com.bmc.dsm.case-lib:Case Approval Mapping to Case Template", approvalMappingId, templatedId);
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
        let signatureId = await apiCoreUtil.getSignatureId(recordGuid);
        let formData = {
            to: user,
            question: questions,
            application: 'com.bmc.dsm.case-lib:Case',
            applicationRequestId: caseId,
            signatureID: signatureId
        }

        let response = await apiCoreUtil.multiFormPostWithAttachment(formData, 'api/com.bmc.arsys.rx.approval/rx/application/approval/moreinformation/question');
        console.log('More Info API Status =============>', response.status);
        return response.status == 204;
    }

    async createReadAccessMapping(data: IReadAccess): Promise<boolean> {
        let caseReadAccess = cloneDeep(CASE_READ_ACCESS);
        caseReadAccess.fieldInstances[450000381].value = data.businessUnit;
        caseReadAccess.fieldInstances[1000000217].value = data.supportGroup;
        caseReadAccess.fieldInstances[450000153].value = data.assignedCompany;
        caseReadAccess.fieldInstances[1000001437].value = data.configName;
        caseReadAccess.fieldInstances[1000000001].value = data.company;
        caseReadAccess.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : caseReadAccess.fieldInstances[450000420].value;
        if (data.category1) {
            // let categoryTier1 = await apiCoreUtil.getCategoryGuid(data.category1);
            let category1Data = {
                "id": 1000000063,
                "value": `${data.category1}`
            }
            caseReadAccess.fieldInstances["1000000063"] = category1Data;
        }
        if (data.category2) {
            // let categoryTier2 = await apiCoreUtil.getCategoryGuid(data.category2);
            let category2Data = {
                "id": 1000000064,
                "value": `${data.category2}`
            }
            caseReadAccess.fieldInstances["1000000064"] = category2Data;
        }
        if (data.category3) {
            // let categoryTier3 = await apiCoreUtil.getCategoryGuid(data.category3);
            let category3Data = {
                "id": 1000000065,
                "value": `${data.category3}`
            }
            caseReadAccess.fieldInstances["1000000065"] = category3Data;
        }
        if (data.category4) {
            // let categoryTier4 = await apiCoreUtil.getCategoryGuid(data.category4);
            let category4Data = {
                "id": 450000158,
                "value": `${data.category4}`
            }
            caseReadAccess.fieldInstances["450000158"] = category4Data;
        }

        if (data.label) {
            let label = await apiCoreUtil.getLabelGuid(data.label);
            let labelData = {
                "id": 450000159,
                "value": `${label}`
            }
            caseReadAccess.fieldInstances["450000159"] = labelData;
        }

        if (data.priority) {
            let priorityValue = constants.CasePriority[data.priority];
            let priorityData = {
                "id": 1000000164,
                "value": `${priorityValue}`
            }
            caseReadAccess.fieldInstances["1000000164"] = priorityData;
        }
        let readAccessMapping: AxiosResponse = await apiCoreUtil.createRecordInstance(caseReadAccess);
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
        response1 = await apiCoreUtil.multiFormPostWithAttachment(formData, 'api/com.bmc.dsm.attachment-service-lib/rx/application/v1/attachment/group');
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
        moreInfoReturnAction.id = await apiCoreUtil.getMoreInfoGuid(caseId);
        moreInfoReturnAction.fieldInstances[13301].value = reply;
        let response = await apiCoreUtil.updateRecordInstance('AP:More Information', moreInfoReturnAction.id, moreInfoReturnAction);
        console.log('More Info Return API Status =============>', response.status);
        return response.status == 204;
    }

    async deleteAutomatedCaseStatusTransition(configName?: string): Promise<boolean> {
        if (configName) {
            let allRecords = await apiCoreUtil.getGuid("com.bmc.dsm.shared-services-lib:Automated Status Transition Rules");
            let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
                return obj[1000001437] === configName;
            });
            let configGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
            if (configGuid) {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.shared-services-lib:Automated Status Transition Rules', configGuid);
            }
        } else {
            let allConfigsMapRecords = await apiCoreUtil.getGuid("com.bmc.dsm.shared-services-lib:Automated Status Transition Rules");
            let allConfigsArrayMap = allConfigsMapRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.shared-services-lib:Automated Status Transition Rules', obj[379]);
            });
            return await Promise.all(allConfigsArrayMap).then(async (result) => {
                return !result.includes(false);
            });
        }
    }

    async createServiceTargetGroup(svtGroupData: ICreateSVTGroup): Promise<boolean> {
        let svtGroup = cloneDeep(SERVICE_TARGET_GROUP);
        svtGroup.fieldInstances[8].value = svtGroupData.svtGroupName;
        svtGroup.fieldInstances[300523400].value = await apiCoreUtil.getDataSourceGuid(svtGroupData.dataSource);
        svtGroup.fieldInstances[1000000001].value = svtGroupData.company ? svtGroupData.company : svtGroup.fieldInstances[1000000001].value;
        svtGroup.fieldInstances[450000420].value = svtGroupData.lineOfBusiness ? await constants.LOB[svtGroupData.lineOfBusiness] : svtGroup.fieldInstances[450000420].value;
        let svtGroupCreateResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(svtGroup);
        console.log('Create SVT Group Status =============>', svtGroupCreateResponse.status);
        return svtGroupCreateResponse.status == 201;
    }

    async createDocumentTemplate(data: IDocumentTemplate): Promise<boolean> {
        DOCUMENT_TEMPLATE.processInputValues.Company = data.company ? data.company : DOCUMENT_TEMPLATE.processInputValues.Company;
        DOCUMENT_TEMPLATE.processInputValues["Template Name"] = data.templateName;
        DOCUMENT_TEMPLATE.processInputValues.Description = data.description;
        DOCUMENT_TEMPLATE.processInputValues["Document Message Body"] = data.messageBody;
        DOCUMENT_TEMPLATE.processInputValues["Line of Business"] = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : DOCUMENT_TEMPLATE.processInputValues["Line of Business"];
        let response = await axios.post(
            commandUri,
            DOCUMENT_TEMPLATE
        )
        console.log('Document Template Create API Status  =============>', response.status);
        return response.status == 200;
    }

    async deleteCommonConfig(configName: string, company: string, guidParamName?: string): Promise<boolean> {
        const appConfigDataUri = "api/rx/application/admin-settings/local/component-griddata/Configuration Values/";
        let headerConfig = {
            headers: {
                'default-bundle-scope': 'com.bmc.dsm.shared-services-lib'
            }
        };
        let allAppConfig = await axios.get(
            appConfigDataUri + constants.ApplicationConfigurationsGuid[configName],
            headerConfig
        );
        console.log('Get ApplicationConfig API Details  =============>', allAppConfig.status);
        let entityObj: any = allAppConfig.data.rows.filter(function (obj: string[]) {
            return obj["Expression"] === company;
        });
        if (!guidParamName) guidParamName = 'ownerKeyValue1';
        let appConfigRecordGuid = entityObj.length >= 1 ? entityObj[0][guidParamName] || null : null;
        if (appConfigRecordGuid) {
            const deleteCommonConfig = await axios.delete(
                appConfigUri + appConfigRecordGuid,
                headerConfig
            );
            console.log('Delete Common Config API Status  =============>', deleteCommonConfig.status);
            return deleteCommonConfig.status == 200;
        } else return true;
    }

    //LOB specific
    async addCommonConfig(configName: string, configValue: string, lob?: string): Promise<boolean> {
        let commonConfigGuid = await apiCoreUtil.getCommonConfigurationId(configName);
        let commonConfigGetPayload = cloneDeep(COMMON_CONFIG_GET);
        commonConfigGetPayload.processInputValues.ID = commonConfigGuid;
        const getResponse = await axios.post(
            commandUri,
            commonConfigGetPayload
        );
        console.log('Add Common Config API Status  =============>', getResponse.status);

        let commonConfigPayload;
        commonConfigPayload = cloneDeep(COMMON_CONFIG_PAYLOAD);
        if (lob) commonConfigPayload.processInputValues["New Line of Business"] = `;${lob}`;
        commonConfigPayload.processInputValues["ID"] = commonConfigGuid;
        switch (configName) {
            case "NEXT_REVIEW_PERIOD": {
                commonConfigPayload.processInputValues["Boolean Value"] = constants.ApplicationConfigurationsValue[configValue];
                commonConfigPayload.processInputValues["Value"] = constants.ApplicationConfigurationsValue[configValue];
                commonConfigPayload.processInputValues["NEXT_REVIEW_PERIOD Value"] = constants.ApplicationConfigurationsValue[configValue];
            }
            default: {
                commonConfigPayload.processInputValues["Boolean Value"] = configValue;
                if (configValue == '1') commonConfigPayload.processInputValues["Value"] = "false";
                else commonConfigPayload.processInputValues["Value"] = "true";
                break;
            }
        }
        let addCommonConfigResponse = await axios.post(
            commandUri,
            commonConfigPayload
        );
        console.log('Add Common Config API Status  =============>', addCommonConfigResponse.status);
        return addCommonConfigResponse.status == 201;
    }

    async createNotificationEvent(data: INotificationEvent): Promise<IIDs> {
        let notificationEventPayload = cloneDeep(NOTIFICATION_EVENT_ACTIVE);
        notificationEventPayload.fieldInstances[450000152].value = data.company ? data.company : notificationEventPayload.fieldInstances[450000152].value;
        notificationEventPayload.fieldInstances[301718200].value = data.eventName;
        notificationEventPayload.fieldInstances[7].value = data.status ? data.status : notificationEventPayload.fieldInstances[7].value;
        notificationEventPayload.fieldInstances[8].value = data.eventDescription ? data.eventDescription : notificationEventPayload.fieldInstances[8].value;
        notificationEventPayload.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : notificationEventPayload.fieldInstances[450000420].value;
        let notificationEventCreateResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(notificationEventPayload);
        console.log('Create Notification event Status =============>', notificationEventCreateResponse.status);
        const notificationEvent = await axios.get(
            notificationEventCreateResponse.headers.location
        );
        return {
            id: notificationEvent.data.id,
            displayId: notificationEvent.data.displayId
        };
    }

    async createNotificationTemplate(data: INotificationTemplate): Promise<boolean> {
        let notificationTemplatePayload = cloneDeep(NOTIFICATION_TEMPLATE);
        let subjectBodyPayload = cloneDeep(EMAIL_ALERT_SUBJECT_BODY);
        notificationTemplatePayload.fieldInstances[8].value = data.description;
        notificationTemplatePayload.fieldInstances[301233800].value = data.module;
        if (data.lineOfBusiness)
            notificationTemplatePayload.fieldInstances[301718200].value = await apiCoreUtil.getNotificationEventGuid(data.eventName, await constants.LOB[data.lineOfBusiness]);
        else
            notificationTemplatePayload.fieldInstances[301718200].value = await apiCoreUtil.getNotificationEventGuid(data.eventName, await constants.LOB['Human Resource']);
        notificationTemplatePayload.fieldInstances[304412071].value = data.templateName;
        notificationTemplatePayload.fieldInstances[450000153].value = data.company ? data.company : notificationTemplatePayload.fieldInstances[450000153].value;
        notificationTemplatePayload.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : notificationTemplatePayload.fieldInstances[450000420].value;
        let notificationTemplateResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(notificationTemplatePayload);
        console.log('Create Notification Template Status =============>', notificationTemplateResponse.status);
        const notificationTemplate = await axios.get(
            notificationTemplateResponse.headers.location
        );
        let id = notificationTemplate.data.id;

        subjectBodyPayload.processInputValues.AlertMessageSubject = data.alertMessage;
        subjectBodyPayload.processInputValues.EmailMessageBody = data.emailBody;
        subjectBodyPayload.processInputValues.EmailMessageSubject = data.emailSubject;
        subjectBodyPayload.processInputValues.TemplateID = id;
        let response = await axios.post(
            commandUri,
            subjectBodyPayload
        )
        console.log('Set Message and Body API Status  =============>', response.status);
        return response.status == 200;
    }

    async createApprovalMapping(approvalModule: string, data: any): Promise<IIDs> {
        let approvalMapping;
        switch (approvalModule) {
            case "Case": {
                let approvalData: ICaseApprovalMapping = cloneDeep(data);
                let caseApprovalMapping = cloneDeep(CASE_APPROVAL_MAPPING);
                caseApprovalMapping.fieldInstances[303715900].value = await apiCoreUtil.getStatusGuid('com.bmc.dsm.case-lib', constants.CaseStatus[approvalData.triggerStatus]);
                caseApprovalMapping.fieldInstances[450000152].value = constants.CaseStatus[approvalData.triggerStatus];
                caseApprovalMapping.fieldInstances[450000153].value = constants.CaseStatus[approvalData.approvedStatus];
                caseApprovalMapping.fieldInstances[450000154].value = constants.CaseStatus[approvalData.rejectStatus];
                caseApprovalMapping.fieldInstances[450000155].value = constants.CaseStatus[approvalData.errorStatus];
                caseApprovalMapping.fieldInstances[450000158].value = constants.CaseStatus[approvalData.noApprovalFoundStatus];
                caseApprovalMapping.fieldInstances[1000001437].value = approvalData.mappingName;
                caseApprovalMapping.fieldInstances[450000121].value = data.flowset ? await apiCoreUtil.getFlowsetGuid(data.flowset) : caseApprovalMapping.fieldInstances[450000121].value;
                if (approvalData.company) caseApprovalMapping.fieldInstances[1000000001].value = approvalData.company;
                let response = await apiCoreUtil.createRecordInstance(caseApprovalMapping);
                console.log('Case Approval Mapping API Status =============>', response.status);
                approvalMapping = await axios.get(
                    response.headers.location
                );
                break;
            };
            case "Knowledge": {
                let approvalData: IKnowledgeApprovalMapping = cloneDeep(data);
                let knowledgeApprovalConfig = cloneDeep(KNOWLEDGE_APPROVAL_CONFIG);
                knowledgeApprovalConfig.fieldInstances[1000000001].value = approvalData.company;
                knowledgeApprovalConfig.fieldInstances[1000001437].value = approvalData.mappingName;
                knowledgeApprovalConfig.fieldInstances[302300500].value = constants.Knowledge[approvalData.publishApproval];
                knowledgeApprovalConfig.fieldInstances[450000420].value = data.lineOfBusiness ? await constants.LOB[data.lineOfBusiness] : knowledgeApprovalConfig.fieldInstances[450000420].value;
                if (approvalData.requestCancelation) {
                    knowledgeApprovalConfig.fieldInstances[302300500].value = knowledgeApprovalConfig.fieldInstances[302300500].value + ';' + constants.Knowledge[approvalData.requestCancelation];
                }
                if (approvalData.retireApproval) {
                    knowledgeApprovalConfig.fieldInstances[302300500].value = knowledgeApprovalConfig.fieldInstances[302300500].value + ';' + constants.Knowledge[approvalData.retireApproval];
                }

                let knowledgeApproval: AxiosResponse = await apiCoreUtil.createRecordInstance(knowledgeApprovalConfig);
                console.log('Knowledge Approvals Status =============>', knowledgeApproval.status);
                approvalMapping = await axios.get(
                    knowledgeApproval.headers.location
                );

                break;

            };
            case "Task": {
                let approvalData: ITaskApprovalMapping = cloneDeep(data);
                let taskApprovalMapping = cloneDeep(TASK_APPROVAL_MAPPING);
                taskApprovalMapping.fieldInstances[450000154].value = constants.TaskStatus[approvalData.triggerStatus];
                taskApprovalMapping.fieldInstances[450000156].value = constants.TaskStatus[approvalData.approvedStatus];
                taskApprovalMapping.fieldInstances[450000158].value = constants.TaskStatus[approvalData.rejectStatus];
                taskApprovalMapping.fieldInstances[450000162].value = constants.TaskStatus[approvalData.errorStatus];
                taskApprovalMapping.fieldInstances[450000160].value = constants.TaskStatus[approvalData.noApprovalFoundStatus];
                taskApprovalMapping.fieldInstances[450000152].value = approvalData.mappingName;
                if (approvalData.company) taskApprovalMapping.fieldInstances[450000153].value = approvalData.company;
                let response = await apiCoreUtil.createRecordInstance(taskApprovalMapping);
                console.log('Task Approval Mapping API Status =============>', response.status);

                approvalMapping = await axios.get(
                    response.headers.location
                );
                break;

            };
            default: {
                console.log("ERROR: Approval Mapping Module Not Found.");
                break;

            }
        }
        return {
            id: approvalMapping.data.id,
            displayId: approvalMapping.data.displayId
        };

    }

    async addWatsonAccount(apiKey: string): Promise<boolean> {
        // Pre-requisite: Enable Cognitive Licenses
        await this.apiLogin('tadmin');
        let enableCognitiveLicPayload = cloneDeep(COGNITIVE_LICENSE);
        const enableCognitiveLicResponse = await axios.put(
            "api/rx/application/licensemanagement/Petramco/servicelicenses",
            enableCognitiveLicPayload
        );
        console.log("Enable Cognitive License API Status =============>", enableCognitiveLicResponse.status);

        // Pre-requisite: Add Cognitive Service Region
        let cognitiveServiceRegionResponse = await axios.post(
            "api/rx/application/systemconfiguration/cognitiveServiceRegionTenantConfiguration",
            {
                "name": "cognitiveServiceRegionTenantConfiguration",
                "value": "{\"WATSON\":{\"naturalLanguageClassifier\":\"US_SOUTH\",\"conversation\":\"\",\"search\":\"\",\"toneAnalyzer\":\"\"}}"
            }
        );
        console.log("Add Cognitive Service Region API Status =============>", cognitiveServiceRegionResponse.status);

        // Add Watson Account
        let addWatsonAccountResponse = await axios.post(
            "api/rx/application/systemconfiguration/cognitiveServiceCredential",
            {
                "name": "cognitiveServiceCredential",
                "value": `{\"WATSON\":{\"naturalLanguageClassifierAPIKey\":\"${apiKey}\"}}`
            }
        );
        console.log("Add Watson Account API Status =============>", addWatsonAccountResponse.status);
        // verify watson account is valid.. that part is missing in this API
        return enableCognitiveLicResponse.status == 200 && cognitiveServiceRegionResponse.status == 204 && addWatsonAccountResponse.status == 204;
    }

    async createCognitiveDataSet(type: string, cognitiveDataSet?: ICognitiveDataSet): Promise<boolean> {
        let dataSetPayload: any;
        switch (type) {
            case "template": {
                dataSetPayload = cloneDeep(COGNITIVE_TEMPLATE_DATASET);
                break;
            };
            case "category": {
                dataSetPayload = cloneDeep(COGNITIVE_CATEGORY_DATASET);
                break;
            };
            default: {
                console.log("ERROR: Invalid cognitive type");
                break;
            }
        }
        if (cognitiveDataSet) {
            dataSetPayload.fieldInstances[1731].value = cognitiveDataSet.name ? cognitiveDataSet.name : dataSetPayload.fieldInstances[1731].value;
            dataSetPayload.fieldInstances[8].value = cognitiveDataSet.description ? cognitiveDataSet.description : dataSetPayload.fieldInstances[8].value;
        }

        const createCognitiveDataSetResponse = await apiCoreUtil.createRecordInstance(dataSetPayload);
        console.log('Create Cognitive Data Set API Status =============>', createCognitiveDataSetResponse.status);
        return createCognitiveDataSetResponse.status == 201;
    }

    async deleteCognitiveDataSet(dataSetName?: string): Promise<boolean> {
        if (dataSetName) {
            let dataSetGuid = await apiCoreUtil.getCognitiveDataSetGuid(dataSetName);
            if (dataSetGuid) {
                return await apiCoreUtil.deleteRecordInstance('Cognitive Service Data Set Descriptor', dataSetGuid);
            }
        }
        else {
            let allDataSetRecords = await apiCoreUtil.getGuid('Cognitive Service Data Set Descriptor');
            let dataSetArrayMap = allDataSetRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('Cognitive Service Data Set Descriptor', obj[179]);
            });
            let isAllDataSetDeleted: boolean = await Promise.all(dataSetArrayMap).then(async (result) => {
                return !result.includes(false);
            });
            return isAllDataSetDeleted === true;
        }
    }

    async trainCognitiveDataSet(dataSetName: string): Promise<boolean> {
        // start data set training
        let startDataSetTrainingResponse = await axios.post(
            commandUri,
            { "resourceType": "com.bmc.arsys.rx.application.cognitive.command.TrainCognitiveServiceCommand", "trainingDataSetName": `com.bmc.dsm.bwfa:${dataSetName}` }
        );
        console.log('Start Data Set Training API Status =============>', startDataSetTrainingResponse.status);

        // verify data set is trained
        let allDataSetRecords = await apiCoreUtil.getGuid('Cognitive Service Data Set Descriptor');
        let entityObj: any = allDataSetRecords.data.data.filter(function (obj: string[]) {
            return obj[1731] === dataSetName;
        });
        let dataSetTrainingStatus = entityObj.length >= 1 ? entityObj[0]['7'] || null : null;
        let sleeptime: number = 0; // maxminum time while loop will run
        while (dataSetTrainingStatus != 2) {
            await browser.sleep(5000);
            allDataSetRecords = await apiCoreUtil.getGuid('Cognitive Service Data Set Descriptor');
            entityObj = allDataSetRecords.data.data.filter(function (obj: string[]) {
                return obj[1731] === dataSetName;
            });
            dataSetTrainingStatus = entityObj.length >= 1 ? entityObj[0]['7'] || null : null;
            sleeptime += 5000;
            if (sleeptime > 500000) {
                break;
            }
        }
        return dataSetTrainingStatus == 2;
    }

    async createCognitiveDataSetMapping(type: string, cognitiveDataSetMapping: ICognitiveDataSetMapping): Promise<boolean> {
        let dataSetMappingPayload: any;
        switch (type) {
            case "template": {
                dataSetMappingPayload = cloneDeep(COGNITIVE_TEMPLATE_DATASET_MAPPING);
                break;
            };
            case "category": {
                dataSetMappingPayload = cloneDeep(COGNITIVE_CATEGORY_DATASET_MAPPING);
                break;
            };
            default: {
                console.log("ERROR: Invalid cognitive type");
                break;
            }
        }
        dataSetMappingPayload.fieldInstances[450000152].value = cognitiveDataSetMapping.name;
        dataSetMappingPayload.fieldInstances[450000154].value = cognitiveDataSetMapping.confidenceLevelAgent;
        dataSetMappingPayload.fieldInstances[450000155].value = cognitiveDataSetMapping.confidenceLevelAutomatic;
        dataSetMappingPayload.fieldInstances[450000156].value = cognitiveDataSetMapping.enable ? "1" : "0";
        dataSetMappingPayload.fieldInstances[450000157].value = cognitiveDataSetMapping.company;
        dataSetMappingPayload.fieldInstances[450000158].value = await apiCoreUtil.getCognitiveDataSetGuid(cognitiveDataSetMapping.dataset);

        const createCognitiveDataSetMappingResponse = await apiCoreUtil.createRecordInstance(dataSetMappingPayload);
        console.log('Create Cognitive Data Set Mapping API Status =============>', createCognitiveDataSetMappingResponse.status);
        return createCognitiveDataSetMappingResponse.status == 201;
    }

    async deleteCognitiveDataSetMapping(dataSetMappingName?: string): Promise<boolean> {
        if (dataSetMappingName) {
            let dataSetMappingGuid = await apiCoreUtil.getCognitiveDataSetMappingGuid(dataSetMappingName);
            if (dataSetMappingGuid) {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.cognitive-lib:Training Data Set Mapping', dataSetMappingGuid);
            }
        }
        else {
            let allDataSetMappingRecords = await apiCoreUtil.getGuid('com.bmc.dsm.cognitive-lib:Training Data Set Mapping');
            let dataSetMappingArrayMap = allDataSetMappingRecords.data.data.map(async (obj: string) => {
                return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.cognitive-lib:Training Data Set Mapping', obj[179]);
            });
            let isAllDataSetMappingDeleted: boolean = await Promise.all(dataSetMappingArrayMap).then(async (result) => {
                return !result.includes(false);
            });
            return isAllDataSetMappingDeleted === true;
        }
    }

    async enableDisableProcess(processName: string, enable: boolean): Promise<boolean> {
        let url = `api/rx/application/process/processdefinition/${processName}`;
        let processEnablingPayload = cloneDeep(ENABLE_DISABLE_PROCESS);
        processEnablingPayload.guid = await apiCoreUtil.getProcessGuid(processName);
        processEnablingPayload.name = processName;
        processEnablingPayload.isEnabled = enable;
        const processEnablementResponse = await axios.put(
            url,
            processEnablingPayload
        );
        console.log("Enable/Disable Process API Status =============>", processEnablementResponse.status);
        return processEnablementResponse.status == 204;
    }

    async updateReviewDueDateRule(): Promise<boolean> {
        let url = 'api/rx/application/rule/ruledefinition/com.bmc.dsm.knowledge:Knowledge Article - Notify ReviewDate due';
        let axiosConfig = {
            headers: {
                'request-overlay-group': '0'
            }
        };
        const reviewOverdueNotifyUpdateResponse = await axios.put(
            url,
            ARTCILE_DUE_DATE,
            axiosConfig
        );
        console.log("Update Review Date Overdue =============>", reviewOverdueNotifyUpdateResponse.status);
        return reviewOverdueNotifyUpdateResponse.status == 204;
    }

    async attachMilestone(recordGuid: string, recordType: string): Promise<boolean> {
        let attachMilestonePayload = undefined;
        if (recordType == 'CASE') attachMilestonePayload = cloneDeep(CASE_MILESTONE);
        else if (recordType == 'TASK') attachMilestonePayload = cloneDeep(TASK_MILESTONE);
        attachMilestonePayload.svtID = recordGuid;
        let attachMileStoneResponse = await axios.post(
            'api/com.bmc.dsm.slm-lib/rx/application/SLM/Milestone/saveMilestoneAssociation/',
            attachMilestonePayload
        );
        console.log("Add SLM milestone =============>", attachMileStoneResponse.status);
        return attachMileStoneResponse.status == 200;
    }

    async createDocumentAndProcessForActionableNotifications(): Promise<void> {
        let createProcessResponse = await axios.post(
            'api/rx/application/process/processdefinition/',
            actionableNotificationPayloads.NOTIIFCATION_CREATE_PROCESS
        );
        console.log("Create Process Response =============>", createProcessResponse.status);

        let createDcoumentResponse = await axios.post(
            'api/rx/application/document/documentdefinition',
            actionableNotificationPayloads.NOTIFICATION_CREATE_DOCUMENT
        );
        console.log("Create Document Response =============>", createDcoumentResponse.status);

        let updateProcessUri = `api/rx/application/process/processdefinition/${actionableNotificationPayloads.NOTIIFCATION_CREATE_PROCESS.name}`;
        console.log('updateProcessUri', updateProcessUri);
        let updateProcessResponse = await axios.put(
            updateProcessUri,
            actionableNotificationPayloads.NOTIFICATION_UPDATE_PROCESS
        );
        console.log("Update Process Response =============>", updateProcessResponse.status);
    }

    async deleteDocumentAndProcessForActionableNotifications(): Promise<void> {
        let deleteProcessResponse = await axios.post(
            commandUri,
            actionableNotificationPayloads.NOTIFICATION_DELETE_PROCESS
        );
        console.log("Delete Process Response =============>", deleteProcessResponse.status);

        let deleteDocumentResponse = await axios.post(
            commandUri,
            actionableNotificationPayloads.NOTIFICATION_DELETE_DOCUMENT
        );
        console.log("Delete Document Response =============>", deleteDocumentResponse.status);
    }

    async deleteNotificationEvent(notificationEventName: string, lob: string, company?: string): Promise<boolean> {
        let notificationEventGuid: string = undefined;
        if (company) notificationEventGuid = await apiCoreUtil.getNotificationEventGuid(notificationEventName, company);
        else notificationEventGuid = await apiCoreUtil.getNotificationEventGuid(notificationEventName, await constants.LOB[lob]);
        if (notificationEventGuid) {
            let status = await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.notification-lib%3ANotificationEvent', notificationEventGuid);
            console.log(`Notification Event: ${notificationEventName} deletion status ==> ${status}`);
            return status;
        } else console.log('Notification Event GUID not found =============>', notificationEventName);
    }

    async deleteTaskTemplate(taskTemplateName: string): Promise<boolean> {
        let taskTemplateGuid = await apiCoreUtil.getTaskTemplateGuid(taskTemplateName);
        if (taskTemplateGuid) {
            let status = await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.task-lib:Task Template', taskTemplateGuid);
            console.log(`Task Template: ${taskTemplateName} deletion status ==> ${status}`);
            return status;
        } else console.log('Task Template GUID not found =============>', taskTemplateName);
    }

    async createProcess(processName: string, processStructure: string): Promise<boolean> {
        let processPayload = undefined;
        switch (processStructure) {
            case "AGENT_ORIGIN": {
                processPayload = cloneDeep(processes.AGENT_ORIGIN);
                break;
            }
            case "EMAIL_ORIGIN": {
                processPayload = cloneDeep(processes.EMAIL_ORIGIN);
                break;
            }
            case "SOCIAL_ACTIVITY_FEED": {
                processPayload = cloneDeep(processes.SOCIAL_ACTIVITY_FEED);
                break;
            }
            default: {
                console.log("ERROR: Invalid Process Structure");
                break;
            }
        }
        processPayload.name = processPayload.name + processName;
        let processGuid = await apiCoreUtil.createProcess(processPayload);
        console.log('Create Process API status =============> ', processGuid.length > 0);
        return processGuid.length > 0;
    }

    async mapProcessToFlowset(mappingData: IFlowsetProcessMapping): Promise<boolean> {
        let mappingPayload = cloneDeep(PROCESS_FLOWSET_MAPPING);
        mappingPayload.fieldInstances[7].value = mappingData.status ? constants.ProcessFlowsetMappingStatus[mappingData.status] : mappingPayload.fieldInstances[7].value;
        mappingPayload.fieldInstances[8].value = mappingData.processNameFull;
        mappingPayload.fieldInstances[450000152].value = mappingData.processName;
        mappingPayload.fieldInstances[450000002].value = mappingData.flowsetId;
        mappingPayload.fieldInstances[450000003].value = mappingData.function ? constants.FlowsetFunctions[mappingData.function] : mappingPayload.fieldInstances[450000003].value;
        mappingPayload.fieldInstances[450000420].value = mappingData.lineOfBusiness ? mappingData.lineOfBusiness : mappingPayload.fieldInstances[450000420].value;
        mappingPayload.fieldInstances[1000000001].value = mappingData.company ? mappingData.company : mappingPayload.fieldInstances[1000000001].value;

        let mappingResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(mappingPayload);
        console.log('Process Flowset Mapping status =============> ', mappingResponse.status);
        return mappingResponse.status == 201;
    }

    async updateCaseTemplateIdentitiyValidation(caseTemplateGuid: string, optionValue: string): Promise<number> {
        let updatePayload = cloneDeep(CASE_TEMPLATE_IDENTITY_UPDATE_PAYLOAD);
        updatePayload.id = caseTemplateGuid;
        updatePayload.fieldInstances[450000153].value = constants.ApplicationConfigurationsValue[optionValue];
        let updateIdentitiy = await apiCoreUtil.updateRecordInstance("com.bmc.dsm.case-lib:Case Template", caseTemplateGuid, updatePayload);
        console.log("Updated Identity =============>", updateIdentitiy.status);
        return updateIdentitiy.status;
    }

    async addRelationShip(relationshipName: string, reverseRelationshipName: string, relationshipType: string): Promise<boolean> {
        let relationship = cloneDeep(RELATIONSHIPS);
        relationship.fieldInstances[450000152].valueByLocale["en-US"] = relationshipName;
        relationship.fieldInstances[450000152].value = relationshipName;
        relationship.fieldInstances[450000154].value = relationshipName;
        relationship.fieldInstances[450000155].value = reverseRelationshipName;
        relationship.fieldInstances[450000156].value = reverseRelationshipName;
        relationship.fieldInstances[450000156].valueByLocale["en-US"] = reverseRelationshipName;
        relationship.fieldInstances[450000153].value = relationship.fieldInstances[450000153].value + relationshipType;
        if (await apiCoreUtil.isRelationshipPresent(relationshipName, relationship.fieldInstances[450000153].value)) {
            console.log("Relationship already present");
            return true;
        }
        else {
            let relationshipResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(relationship);
            console.log('Relationship status =============> ', relationshipResponse.status);
            return relationshipResponse.status == 201;
        }
    }

    async createSVTGoalType(svtData: ICreateSVTGoalType): Promise<boolean> {
        let serviceTargetPayload = cloneDeep(SERVICE_TARGET_GOALTYPE_PAYLOAD);
        serviceTargetPayload.fieldInstances[301263100].value = svtData.svtGoalTypeName;
        serviceTargetPayload.fieldInstances[300473700].value = svtData.status;
        serviceTargetPayload.fieldInstances[450000420].value = svtData.lineOfBusiness ? await constants.LOB[svtData.lineOfBusiness] : serviceTargetPayload.fieldInstances[450000420].value;
        let slmResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(serviceTargetPayload);
        console.log('Create Service Target Goal Type API Status =============>', slmResponse.status);

        return slmResponse.status == 201;
    }

    async createRegion(regionName: string, regionTierName: string, lob?: string): Promise<boolean> {
        let regionPayload = cloneDeep(REGION);
        regionPayload.fieldInstances[260000001].value = regionName;
        regionPayload.fieldInstances[304417331].value = lob ? lob : regionPayload.fieldInstances[304417331].value;
        let regionResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(regionPayload);
        console.log('Create Region API Status =============>', regionResponse.status);
        let response = await axios.get(
            regionResponse.headers.location
        );
        let responseData = {
            id: response.data.id,
            displayId: response.data.displayId
        };

        let regionTierPayload = cloneDeep(REGION_TIER);
        regionTierPayload.fieldInstances[260000001].value = regionTierName;
        regionTierPayload.fieldInstances[304410971].value = responseData.id;
        regionTierPayload.fieldInstances[304417331].value = lob ? lob : regionTierPayload.fieldInstances[304417331].value;
        let regionTierResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(regionTierPayload);
        console.log('Create Region Tier API Status =============>', regionTierResponse.status);
        await apiCoreUtil.associateFoundationElements('Region to Site', responseData.id, '723de966290232b2da35cb2d9d0562acfc1b1b93983bf518c2edda8f6eea9ae7246362254728de6b4aebea56dc6acaa5f9ca1d552e3ebb4afc1354ff01c53c4c');
        return regionResponse.status == 201 && regionTierResponse.status == 201;
    }

    async disassociateDomainTagFromBU(buName: string, domainTagName): Promise<boolean> {
        let businessUnitGuid = await apiCoreUtil.getBusinessUnitGuid(buName);
        let updateBUPayLoad = cloneDeep(UPDATE_BUSINESS_UNIT);
        console.log(updateBUPayLoad);
        const updateBU: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.arsys.rx.foundation:Business Unit", businessUnitGuid, updateBUPayLoad)
        return updateBU.status == 204;
    }

    async associateDomainTagFromBU(buName: string, domainTagName): Promise<boolean> {
        let businessUnitGuid = await apiCoreUtil.getBusinessUnitGuid(buName);
        let updateBUPayLoad = cloneDeep(UPDATE_BUSINESS_UNIT);
        let domainTag = await apiCoreUtil.getDomainTagGuid(domainTagName);
        console.log(domainTag);

        updateBUPayLoad.fieldInstances[304417331].value = domainTag;
        const updateBU: AxiosResponse = await apiCoreUtil.updateRecordInstance("com.bmc.arsys.rx.foundation:Business Unit", businessUnitGuid, updateBUPayLoad)
        return updateBU.status == 204;
    }

    //Delete at Company Level
    async deleteCommonConfiguration(configName: string, company: string): Promise<boolean> {
        let allRecords = await apiCoreUtil.getGuid("com.bmc.dsm.shared-services-lib:Application Configuration");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === configName && obj[1000000001] === company;
        });
        let configGuid = entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
        if (configGuid) {
            return await apiCoreUtil.deleteRecordInstance('com.bmc.dsm.shared-services-lib:Application Configuration', configGuid);
        }
    }

    //Company specific
    async createCommonConfig(configName: string, configValue: string, company: string): Promise<IIDs> {
        let commonConfig = cloneDeep(CREATE_COMMON_CONFIG);
        commonConfig.fieldInstances[8].value = configName;
        commonConfig.fieldInstances[450000152].value = configName;
        commonConfig.fieldInstances[1000000001].value = company ? company : commonConfig.fieldInstances[1000000001].value;
        commonConfig.fieldInstances[450000166].value = configValue;
        commonConfig.fieldInstances[450000153].value = configValue;
        let commonConfigResponse: AxiosResponse = await apiCoreUtil.createRecordInstance(commonConfig);
        console.log('Common Configuration =============> ', commonConfigResponse.status);
        const commonConfigDetails = await axios.get(
            await commonConfigResponse.headers.location
        );
        return {
            id: commonConfigDetails.data.id,
            displayId: commonConfigDetails.data.displayId
        };
    }
}

export default new ApiHelper();
