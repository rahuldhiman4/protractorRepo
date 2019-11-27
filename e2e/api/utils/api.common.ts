import axios, { AxiosResponse } from "axios";

export interface ITemplate {
    id: string;
    displayId: string;
}

class ApiUtils {
    async getOrganizationGuid(orgName: string): Promise<string> {

        const dataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery"
            + "&pageSize=-1&recorddefinition="
            + "com.bmc.arsys.rx.foundation:Primary Organization"
            + "&startIndex=0";

        const allRecords = await axios.get(
            dataPageUri
        );
        console.log('Organization GUID API Status =============>', allRecords.status);

        let entityObj: any = allRecords.data.data.filter(function (obj) {
            return obj[1000000010] === orgName;

        });
        return entityObj[0]['379'];
    }

    async getPersonGuid(personName: string): Promise<string> {

        const dataPageUri = "api/rx/application/datapage?dataPageType=com.bmc.arsys.rx.application.record.datapage.RecordInstanceDataPageQuery"
            + "&pageSize=-1&recorddefinition="
            + "com.bmc.arsys.rx.foundation:Person"
            + "&startIndex=0";

        const allRecords = await axios.get(
            dataPageUri
        );
        console.log('Person GUID API Status =============>', allRecords.status);

        let entityObj: any = allRecords.data.data.filter(function (obj) {
            return obj[4] === personName;
        });
        return entityObj[0]['379'];
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
        console.log('Associate Entities API Status =============>', associateEntities.data);
    }
}

export default new ApiUtils();