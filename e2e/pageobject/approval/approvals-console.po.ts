import { browser, $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';
import utilityCommon from '../../utils/utility.common';



class ApprovalsConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        approveBtn: 'button.approve-btn',
        rejectBtn: 'button.reject-btn',
        holdBtn: 'button.hold-btn',
    }


    async clickApproverButton(): Promise<void> {
        await $(this.selectors.approveBtn).click();
    }

    async clickRejectButton(): Promise<void> {
        await $(this.selectors.rejectBtn).click();
    }

    async clickHoldButton(): Promise<void> {
        await $(this.selectors.holdBtn).click();
    }

    async searchCaseOnApprovalConsole(caseSummary: string, approve: string): Promise<void> {
        await utilityGrid.searchAndSelectGridRecord(caseSummary);
        switch (approve) {
            case "Approve": {
                await this.clickApproverButton();
                break;
            }
            case "Reject": {
                await this.clickRejectButton();
                break;
            }
            case "On Hold": {
                await this.clickHoldButton();
                break;
            }
            default: {
                console.log('Searched case not found on approval console');
                break;
            }
        }
        await utilityCommon.clickOnApplicationWarningYesNoButton('Yes');
    }
}

export default new ApprovalsConsole();