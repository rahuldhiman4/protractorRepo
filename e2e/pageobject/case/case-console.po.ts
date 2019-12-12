import { protractor, ProtractorExpectedConditions } from "protractor";
import gridUtil from '../../utils/util.grid';
import utilCommon from '../../utils/util.common';

class CaseConsolePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        guid: "d628a20f-e852-4a84-87e6-f5191f77ddf6",
    }

    async searchCase(caseId: string): Promise<void> {
        await gridUtil.clearFilter();
        await gridUtil.searchRecord(caseId);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async searchAndOpenCase(caseId: string): Promise<void> {
        await gridUtil.clearFilter();
        await gridUtil.searchAndOpenHyperlink(caseId);
        await utilCommon.waitUntilSpinnerToHide();
    }

    async isCaseIdPresent(caseId: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Case ID');
        return caseId === priorityValue;
    }

    async isCasePriorityPresent(priority: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Priority');
        return priority === priorityValue;
    }

    async isCaseStatusPresent(status: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Status');
        return status === priorityValue;
    }

    async isCaseSummaryPresent(summary: string): Promise<boolean> {
        let priorityValue = await gridUtil.getSelectedGridRecordValue(this.selectors.guid, 'Summary');
        return summary === priorityValue;
    }

}

export default new CaseConsolePage();