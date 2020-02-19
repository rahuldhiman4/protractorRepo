import axios, { AxiosResponse } from "axios";
import * as uuid from 'uuid';

const recordInstanceUri = "api/rx/application/record/recordinstance";
const templateUri = "api/rx/application/command";
const dynamicDataUri = "api/com.bmc.dsm.ticketing-lib/dynamicdata/definition";

class ApiCoreUtil {
    async createRecordInstance(jsonBody): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            recordInstanceUri,
            jsonBody
        );
        console.log('Create RecordInstance API Status =============>', newRecord.status);
        return newRecord;
    }

    async updateRecordInstance(recordName: string, recordGUID: string, jsonBody: string): Promise<AxiosResponse> {
        const newRecord = await axios.put(
            recordInstanceUri + "/" + recordName + "/" + recordGUID,
            jsonBody
        );
        console.log('Update RecordInstance API Status =============>', newRecord.status);
        return newRecord;
    }

    async deleteRecordInstance(recordName: string, recordGUID: string): Promise<boolean> {
        const deleteRecord = await axios.delete(
            recordInstanceUri + "/" + recordName + "/" + recordGUID
        );
        console.log('Delete RecordInstance API Status =============>', deleteRecord.status);
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
        console.log('Get GUID API Status =============>', allRecords.status);
        return allRecords;
    }

    async getEmailTemplateGuid(emailTemplateName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.notification-lib:NotificationTemplate");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[304412071] === emailTemplateName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getDynamicFieldGuid(dynamicFieldName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.ticketing-lib:AttributeDefinition");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] === dynamicFieldName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getDynamicGroupGuid(dynamicFieldName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.ticketing-lib:AttributeGroupDefinition");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] === dynamicFieldName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getDomainTagGuid(domainTagName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Domain Tag Registry");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[8] === domainTagName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getOrganizationGuid(orgName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Primary Organization");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === orgName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getSupportGroupGuid(supportGroupName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Support Group");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === supportGroupName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getFlowsetGuid(flowsetName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.flowsets-lib:Flowsets");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000002] === flowsetName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getLabelGuid(labelValue: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Lookup Items");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === labelValue;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }
    
    async getPersonGuid(personName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Person");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[4] === personName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getFunctionalRoleGuid(functionalRole: string): Promise<string> {
        let dataPageUri = "rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.functionalrole.datapage.FunctionalRoleDataPageQuery"
            + "&pageSize=50&startIndex=0"
        let allRecords = await axios.get(
            dataPageUri
        );
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            obj[0] === functionalRole;
        });
        console.log('Get Functional Role GUID API Status =============>', entityObj);
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }


    async getBusinessUnitGuid(orgName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Business Unit");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === orgName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getDepartmentGuid(depName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Department");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === depName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getCategoryGuid(category: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Operational Category");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[304405421] === category;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getRegionGuid(region: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Region");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[260000001] === region;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getSiteGuid(site: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Site");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[260000001] === site;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getStatusChangeReasonGuid(reason: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Status Reason");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[302307031] === reason;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getCaseTemplateGuid(caseTemplateId: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.case-lib:Case Template");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1] === caseTemplateId;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getTaskTemplateGuid(caseTemplateId: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.task-lib:Task Template");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1] === caseTemplateId;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async associateFoundationElements(associationName: string, entity1: string, entity2: string): Promise<void> {
        const associateEntities = await axios.post(
            "api/rx/application/command",
            {
                "resourceType": "com.bmc.arsys.rx.application.association.command.AssociateMultipleCommand",
                "associationDefinitionName": `com.bmc.arsys.rx.foundation:${associationName}`,
                "nodeARecordInstanceIds": [entity1],
                "nodeBRecordInstanceIds": [entity2]
            }
        );
        console.log('Associate Entities API Status =============>', associateEntities.status);
    }

    async createProcess(body: any): Promise<string> {
        var newGuid = uuid.v4();
        body.guid = newGuid;
        const newProcess = await axios.post(
            "api/rx/application/process/processdefinition",
            body
        );
        console.log('New Process API Status =============>', newProcess.status);
        return newGuid;
    }

    async createDyanmicData(jsonBody: string): Promise<AxiosResponse> {
        const newRecord = await axios.post(
            dynamicDataUri,
            jsonBody
        );
        console.log('Dyanmic data added API Status =============>', newRecord.status);
        return newRecord;
    }

    async getDomainConfigurationGuid(domainTagGuid: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.shared-services-lib:Domain Configuration");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[450000152] === domainTagGuid;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getServiceTargetGuid(sserviecTargetTitle: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.dsm.slm-lib:Service Target");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[490000400] === sserviecTargetTitle;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }


}

export default new ApiCoreUtil();