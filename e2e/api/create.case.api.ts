import axios, { AxiosResponse } from "axios";

export interface ICase {
    id: string;
    displayId: string;
}

class CaseApi {
    async createCase(requester: string, summary: string): Promise<ICase> {
        const newCase = await axios.post(
            "/api/com.bmc.dsm.case-lib/cases",
            {
                "Requester": requester,
                "Summary": summary
            }
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
}

export default new CaseApi();