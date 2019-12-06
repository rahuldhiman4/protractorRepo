import axios, { AxiosResponse } from "axios";
import * as uuid from 'uuid';

const recordInstanceUri = "api/rx/application/record/recordinstance";
const notesTemplateUri = "api/rx/application/command";

class ApiCoreUtil {
    async createRecordInstance(jsonBody: string): Promise<AxiosResponse> {
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

    async getPersonGuid(personName: string): Promise<string> {
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Person");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[4] === personName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getBusinessUnitGuid(orgName: string): Promise<string>{
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Business Unit");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === orgName;
        });
        return entityObj.length >= 1 ? entityObj[0]['179'] || null : null;
    }

    async getDepartmentGuid(depName: string): Promise<string>{
        let allRecords = await this.getGuid("com.bmc.arsys.rx.foundation:Department");
        let entityObj: any = allRecords.data.data.filter(function (obj: string[]) {
            return obj[1000000010] === depName;
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

    async createNotesTemplate(jsonBody: string): Promise<AxiosResponse> {
        const notesTemplate = await axios.post(
            notesTemplateUri,
            jsonBody
        );
        console.log('Create Notes Template API Status =============>', notesTemplate.status);
        return notesTemplate;
    }
}

export default new ApiCoreUtil();