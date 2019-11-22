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
        const newCaseDetails = await axios.get(
            newCase.headers.location
        );
        console.log('New Case Details API Status =============>', newCaseDetails.status);
        
        return {
            id: newCaseDetails.data.id,
            displayId: newCaseDetails.data.displayId
        };
    }
}

export default new CaseApi();