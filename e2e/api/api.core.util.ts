import axios, { AxiosResponse } from "axios";
import { browser } from 'protractor';
import * as uuid from 'uuid';

const recordInstanceUri = "api/rx/application/record/recordinstance";
const dynamicDataUri = "api/com.bmc.dsm.ticketing-lib/dynamicdata/definition";
const documentUri = "api/com.bmc.dsm.ticketing-lib/definition/document";
const newDocumentUri = "api/rx/application/document/documentdefinition";
const processDefUri = "api/com.bmc.dsm.ticketing-lib/definition/process";
let FormData = require('form-data');
let fs = require('fs');

class ApiCoreUtil {
    async createRecordInstance(jsonBody): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            recordInstanceUri,
            jsonBody
        );
        return newRecord;
    }

    async updateRecordInstance(recordName: string, recordGUID: string, jsonBody): Promise<AxiosResponse> {
        const newRecord = await axios.put(
            recordInstanceUri + "/" + recordName + "/" + recordGUID,
            jsonBody
        );
        return newRecord;
    }

    async deleteRecordInstance(recordName: string, recordGUID: string): Promise<boolean> {
        const deleteRecord = await axios.delete(
            recordInstanceUri + "/" + recordName + "/" + recordGUID
        );
        return deleteRecord.status == 204;
    }

    async getRecordInstanceDetails(recordName: string, recordGUID: string): Promise<any> {
        let uri = `api/rx/application/record/recordinstance/${recordName}/${recordGUID}`;
        const recorInstanceDetails = await axios.get(
            uri
        );
        return await recorInstanceDetails.data;
    }

    async getGuid(recordName: string): Promise<AxiosResponse> {
        let dataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery"
            + "&pageSize=-1&recorddefinition="
            + recordName
            + "&startIndex=0";

        let allRecords = await axios.get(
            dataPageUri
        );
        console.log(`Get GUID Status ${recordName} =============>`, allRecords.status);
        return allRecords;
    }

    async getSignatureInstanceId(guid: string): Promise<string> {
        let dataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.approval.application.datapage.SignatureDetailDataPageQuery&pageSize=-1&startIndex=0&status=Pending&requestGUID="
            + guid;
        await browser.sleep(10000);
        let allRecords = await axios.get(
            dataPageUri
        );
        return allRecords.data.data.length >= 1 ? allRecords.data.data[0]['signatureInstanceID'] || null : null;
    }

    // async getNotificationEventGuid(eventName: string, company?: string): Promise<string> {
    //     let allRecords = await this.getGuid("com.bmc.dsm.notification-lib:NotificationEvent");
    //     let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
    //         if (company) return obj[301718200] === eventName && obj[301566300] === company;
    //         else return obj[301718200] === eventName;
    //     });
    //     return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    // }

    async getNotificationEventGuid(eventName: string, lob: string, company?: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.notification-lib:NotificationEvent");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            if (company) return obj[301718200] === eventName && obj[301566300] === company && obj[450000420] === lob;
            else return obj[301718200] === eventName && obj[450000420] === lob;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getSignatureId(guid: string): Promise<string> {
        let dataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.approval.application.datapage.SignatureDetailDataPageQuery&pageSize=-1&startIndex=0&status=Pending&requestGUID="
            + guid;
        await browser.sleep(10000);
        let allRecords = await axios.get(
            dataPageUri
        );
        return allRecords.data.data.length >= 1 ? allRecords.data.data[0]['signatureID'] || null : null;
    }

    async getEmailTemplateGuid(emailTemplateName: string, company?: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.notification-lib:NotificationTemplate");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            if (company) return obj[304412071] === emailTemplateName && obj[301566300] === company;
            else return obj[304412071] === emailTemplateName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getEmailHTMLBody(emailSubject: string, sentTo: string): Promise<string> {
        let allRecords = await this.getGuid("AR System Email Messages");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return (obj[18090].replace(/\s/g, "") === emailSubject.replace(/\s/g, "") && obj[18085] === sentTo);
        });
        return entityObj.length >= 1 ? entityObj[0]['18290'] || null : null;
    }

    async getDynamicFieldGuid(dynamicFieldName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.ticketing-lib:AttributeDefinition");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] === dynamicFieldName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getDynamicGroupGuid(dynamicFieldName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.ticketing-lib:AttributeGroupDefinition");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] === dynamicFieldName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getDomainTagGuid(domainTagName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Domain Tag Registry");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] === domainTagName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }
    async getLineOfBusinessGuid(lobName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Line of Business");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === lobName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getSupportGroupGuid(supportGroupName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Support Group");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === supportGroupName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getSupportGroupPermissionID(supportGroupName: string): Promise<number> {
        let allRecords = await this.getGuid("CTM:Support Group Permission DomainTag");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000015] === supportGroupName;
        });
        return entityObj.length >= 1 ? entityObj[0]['1000001579'] || null : null;
    }

    async getFlowsetGuid(flowsetName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.flowsets-lib:Flowsets");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000002] === flowsetName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getLabelGuid(labelValue: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Lookup Items");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === labelValue;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getPersonGuid(personName: string): Promise<string> {
        let allRecords = await this.getGuid("CTM:People");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[4] === personName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getPersonFunctionalRoles(personName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Person");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[4] === personName;
        });
        return entityObj.length >= 1 ? entityObj[0]['430000002'] || null : null;
    }

    async getFunctionalRoleGuid(functionalRole: string): Promise<string> {
        let dataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.functionalrole.datapage.FunctionalRoleDataPageQuery"
            + "&pageSize=50&startIndex=0"
        let allRecords = await axios.get(
            dataPageUri
        );
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj['name'] === functionalRole;
        });
        return entityObj.length >= 1 ? entityObj[0]['id'] || null : null;
    }

    async getBusinessUnitGuid(orgName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Business Unit");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === orgName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getDepartmentGuid(depName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Department");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === depName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getCategoryGuid(category: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Operational Category");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[304405421] === category;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getRegionGuid(region: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Region");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[260000001] === region;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getSiteGuid(site: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Site");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[260000001] === site;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getStatusChangeReasonGuid(reason: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Status Reason");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[302307031] === reason;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getCaseTemplateGuid(caseTemplateId: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.case-lib:Case Template");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1] === caseTemplateId;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getCaseTemplateCompanyGuid(caseTemplateId: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.case-lib:Case Template");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1] === caseTemplateId;
        });
        return entityObj.length >= 1 ? entityObj[0]['1000000001'] || null : null;
    }

    async getTaskTemplateGuid(taskTemplateIdOrName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.task-lib:Task Template");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1] === taskTemplateIdOrName || obj[1000001437] === taskTemplateIdOrName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getTaskGuid(summaryName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.task-lib:Task");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] == summaryName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getDataSourceGuid(dataSourceName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.slm-lib:Config%20Data%20Source");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[300520600] === dataSourceName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getStatusGuid(applicationBundleId: string, statusValue: string, statusName?: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Status");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[61001] === applicationBundleId && obj[302259063] == statusValue;
        });
        if (entityObj.length >= 1) { return entityObj[0]['379']; }
        else {
            let entityObj1: any = allRecords.data.data.filter(function (obj1: string[]) {
                return obj1[302307031] === statusName && obj1[302259063] == statusValue;
            });
            return entityObj1.length >= 1 ? entityObj1[0]['379'] || null : null;
        }
    }

    async getMoreInfoGuid(caseId: string): Promise<string> {
        let allRecords = await this.getGuid("AP:More+Information");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[10051] === caseId;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async associateFoundationElements(associationName: string, entity1: string, entity2: string): Promise<AxiosResponse> {
        return await axios.post(
            "api/rx/application/command",
            {
                "resourceType": "com.bmc.arsys.rx.application.association.command.AssociateMultipleCommand",
                "associationDefinitionName": `com.bmc.arsys.rx.foundation:${associationName}`,
                "nodeARecordInstanceIds": [entity1],
                "nodeBRecordInstanceIds": [entity2]
            }
        );
    }

    async disassociateFoundationElements(disassociationName: string, entity1: string, entity2: string): Promise<AxiosResponse> {
        return await axios.post(
            "api/rx/application/command",
            {
                "resourceType": "com.bmc.arsys.rx.application.association.command.DisassociateMultipleCommand",
                "associationDefinitionName": disassociationName,
                "nodeARecordInstanceIds": [entity1],
                "nodeBRecordInstanceIds": [entity2]
            }
        );
    }

    async createProcess(body: any): Promise<string> {
        let newGuid = uuid.v4();
        body.guid = newGuid;
        const newProcess = await axios.post(
            "api/rx/application/process/processdefinition",
            body
        );
        console.log("New Process Core API Status =============>", newProcess.status);
        return newGuid;
    }

    async createDyanmicData(jsonBody: string): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            dynamicDataUri,
            jsonBody
        );
        return newRecord;
    }

    async getDomainConfigurationGuid(domainTagGuid: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Domain Configuration");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === domainTagGuid;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getServiceTargetGuid(serviceTargetTitle: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.slm-lib:Service Target");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[490000400] === serviceTargetTitle;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getDocLibGuid(docLibName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.knowledge:Knowledge Article");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[302300502] === docLibName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getReadAccessOrAssignmentMappingGuid(recordName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.case-lib:Case Assignment Mapping");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000001437] === recordName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async multiFormPostWithAttachment(parameters: object, url?: string): Promise<AxiosResponse> {
        let bodyFormData = new FormData();
        let uri: string = recordInstanceUri;
        for (let i: number = 0; i < Object.keys(parameters).length; i++) {
            let key: string = Object.keys(parameters)[i].toString();
            let value: any = Object.values(parameters)[i];
            if (key == 'recordInstance' || key == 'associationOperations') {
                bodyFormData.append(key, JSON.stringify(value));
            } else if (key == '1000000351' || key == '302302781') {
                bodyFormData.append(key, fs.createReadStream(value.toString()));
            } else bodyFormData.append(key, value);
        }

        const headers = {
            ...bodyFormData.getHeaders(),
        };
        if (url) uri = url;
        let newRecord = await axios.post(uri, bodyFormData, { headers });
        return newRecord;
    }

    async getKnowledgeTemplateGuid(knowledgeTemplateTitle: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.knowledge:Template Configuration");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[301820705] === knowledgeTemplateTitle;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getKnowledgeSetGuid(knowledgeSetTitle: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.knowledge:Knowledge Set");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[301820705] === knowledgeSetTitle;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getCognitiveDataSetGuid(dataSetName: string): Promise<string> {
        let allRecords = await this.getGuid("Cognitive Service Data Set Descriptor");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1731] === dataSetName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async getCognitiveDataSetMappingGuid(dataSetMappingName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.cognitive-lib:Training Data Set Mapping");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1731] === dataSetMappingName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async createDocumentForAutoTaskTemplate(jsonBody): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            documentUri,
            jsonBody
        );
        return newRecord;
    }

    async createDocumentForProcess(jsonBody): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            newDocumentUri,
            jsonBody
        );
        return newRecord;
    }

    async getDocumentForProcessDetails(docName: string): Promise<AxiosResponse> {
        const documentDetails = await axios.get(
            newDocumentUri + "/" + docName
        );
        return documentDetails;
    }

    async createProcessForAutoTaskTemplate(jsonBody): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            processDefUri,
            jsonBody
        );
        return newRecord;
    }

    async getProcessGuid(processName: string): Promise<string> {
        let url = `api/rx/application/process/processdefinition/${processName}?_v=AGGADGG8ECDC0AQ1L2YDQ0NIVGZV001598589534000en`;
        let processDetails = await axios.get(
            url
        );
        return processDetails.data['guid'];
    }

    async getProcessRunCount(bundleName: string, processName: string): Promise<number> {
        let uri = `api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.process.datapage.ProcessInstanceDataPageQuery&pageSize=50&processDefinitionName=${bundleName}:${processName}&propertySelection=contextKey,instanceId,processDefinitionName,owner,startTime,endTime,status,isStartInstanceError&startIndex=0`;
        const processRunDetails = await axios.get(
            uri
        );
        return await processRunDetails.data.totalSize;
    }

    async getCommonConfigurationId(configName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Application Configuration");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === configName;
        });
        return entityObj.length >= 1 ? entityObj[0]['379'] || null : null;
    }

    async isRelationshipPresent(relationshipName: string, relationshipType: string): Promise<boolean> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Relationship Type");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === relationshipName && obj[450000153] === relationshipType;
        });
        return entityObj.length >= 1;
    }
}

export default new ApiCoreUtil();