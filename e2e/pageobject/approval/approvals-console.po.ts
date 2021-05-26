import { browser, $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';
import utilityCommon from '../../utils/utility.common';



class ApprovalsConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        approveBtn: 'button.approve-btn',
        rejectBtn: 'button.reject-btn',
        holdBtn: 'button.hold-btn',
        confirmButton: '[rx-id="confirm-button"]'
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

    async clickConfirmButton() {
        await $(this.selectors.confirmButton).click();
    }

    async searchCaseOnApprovalConsole(caseSummary: string, approve: string): Promise<void> {
        // await utilityGrid.searchAndSelectGridRecord(caseSummary);
        await this.searchAndSelectGridRecord(caseSummary);
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
        // await utilityCommon.clickOnApplicationWarningYesNoButton('Yes'); // commented because old warning popup present
        await this.clickConfirmButton();
    }

    // methods of 20.08.01 for approval record grid
    async searchAndSelectGridRecord(recordName: string, guid?: string): Promise<void> {
        let selectCheckbox = '.clickable .ui-grid-selection-row-header-buttons';
        let selectRadioButton = '.radio__label input';
        if (guid) {
            await this.searchRecordWithoutFilter(recordName, guid);
            selectCheckbox = `[rx-view-component-id="${guid}"] ` + selectCheckbox;
            selectRadioButton = `[rx-view-component-id="${guid}"] ` + selectRadioButton;
        }
        else await this.searchRecordWithoutFilter(recordName);
        let checkboxLocator = await $(selectCheckbox);
        let radioButtonLocator = await $(selectRadioButton);
        if (await checkboxLocator.isPresent()) await $$(selectCheckbox).first().click();
        else await radioButtonLocator.click();
    }

    // methods of 20.08.01 for approval record grid
    async searchRecordWithoutFilter(searchValue: string, guid?: string): Promise<void> {
        let searchTextBoxLocator: string = '.d-textfield__label input';
        let gridRecordsLocator: string = '.at-data-row';
        if (guid) {
            searchTextBoxLocator = `[rx-view-component-id="${guid}"] ` + searchTextBoxLocator;
            gridRecordsLocator = `[rx-view-component-id='${guid}'] ` + gridRecordsLocator;
        }
        for (let i: number = 0; i < 2; i++) {
            console.log(searchValue, "search angular grid count: ", i);
            await $(searchTextBoxLocator).clear();
            await $(searchTextBoxLocator).sendKeys(searchValue + protractor.Key.ENTER);
            let gridRecordCount: number = await $$(gridRecordsLocator).count();
            if (gridRecordCount == 0) {
                await browser.sleep(5000); // workaround for performance issue, this can be removed when issue fixed
            } else break;
        }
    }
}

export default new ApprovalsConsole();