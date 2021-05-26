import utilityCommon from "../../../utils/utility.common";
import { $, protractor, ProtractorExpectedConditions, element, by, $$, browser, ElementFinder } from "protractor";
import utilityGrid from '../../../utils/utility.grid';
import { DropDownType } from '../../../utils/constants';

class ApprovalsConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        approvalConfigTab: '.nav-item button span',
        approvalGroup: '.button-open-action span',
        addNewGeneralFlowBtn: '[rx-id="new-general-flow-button"]',
        addNewLevelUpFlowBtn: '[rx-id="new-level-flow-button"]',
        selectNewApprovalFlowOption: 'button.d-icon-right-angle_down[aria-expanded="true"] + ul a',
        approvalFlowBrick: '.card-title .text-direction span',
        expandApprovalFlowBrickArea: '.d-collapse-panel[aria-expanded="true"] div.button-open-action + div[aria-expanded="true"]',
        approvalFlowBrickTitle: 'span',
        approvalFlowBrickEditLink: '.d-icon-right-pencil',
        approvalFlowTitleInput: '[rx-id="flow-name"] input',
        noOfLevelsInput: '.adapt-rx-counter input',
        expressionQualitificationLink: '[property-label="Qualification"] button',
        createNewApprovalFlowPopUp: '.modal-header h5',
        searchExpressionField: '.modal-content input',
        selectRecordOption: '[class="expression-node-label"]',
        selectExpressionOption: '.rx-data-dictionary-item-value',
        expressionOptionPlusIcon: '.d-icon-plus_circle',
        selectExpressionOperator: 'button[btn-type="secondary"]',
        expressionOperatorLink: 'button.d-icon-connection',
        expressionValueOptions: 'button.d-dropdown__trigger',
        expressionValueOptionSelector: 'button.d-dropdown__trigger[aria-expanded="true"] + ul a[role="menuitem"]',
        selectLink: '.select-title-btn',
        foundataDataSaveButton: 'button[rx-id="foundation-data-save-btn"]',
        approversSaveButton: '[aria-label*="Select approvers: "] button[rx-id="save-button"]',
        newApprovalFlowSaveButton: '[aria-label="Approval configurations"] button[rx-id="save-button"]',
        approvalFlowSaveButton: 'button.save-button',
        approvalFlowCloseButton: 'button[rx-id="close-button"]',
        editApprovalFlowCloseButton: '.modal-footer button.d-button_large',
        newSelfApprovalFlowLinkButton: '.d-icon-left-plus_circle',
        ckEditorTextInput: '.cke_editable_inline',
        selfApprovalNextButton: 'button.d-icon-right-angle_right',
        auditInformationTextField: '[rx-id="audit-information"] textarea',
        sampleSelfApprovalCheckbox: '.ui-grid-icon-ok',
        multipleApproverFlowDropDown: '[rx-id="signing-criteria"] button',
        multipleApproverFlowDropDownOption: '[rx-id="signing-criteria"] button .rx-select__option-content div',
        selectApproversLink: '[rx-id="flow-approvers"] button[rx-id="edit-button"]',
        selectApproverSectionForGeneralApprovalFlow: '.a-dropdown-window--menu .rx-select__option-content div',
        businessUnitForApprovalFlow: 'rx-record-grid[rx-configuration="businessUnitGridConfiguration"]',
        primaryOrganizationForApprovalFlow: 'rx-record-grid[rx-configuration="primaryOrgsGridConfiguration"]',
        departmentForApprovalFlow: 'rx-record-grid[rx-configuration="departmentsGridConfiguration"]',
        supportGroupForApprovalFlow: 'rx-record-grid[rx-configuration="supportGroupGridConfiguration"]',
        personForApprovalFlow: 'rx-record-grid[rx-configuration="personGridConfiguration"]',
        functionalRolesForApprovalFlow: 'div[heading="Functional Roles"]',
        functionalRolesSearchInput: 'div.user-list div.d-icon-search',
        selectFunctionalRolesCheckbox: '.user-list input.checkbox__input',
        fieldsIdentifyingApprovalForApprovalFlow: 'div[heading="Field Identifying Approval"]',
        fieldsIdentifyingApprovalOptionsForApprovalFlow: 'div[heading="Field Identifying Approval"] li',
        selectApprovalFlow: 'a.leftRightButton .d-icon-angle_right',
        approvalFlowSearchIcon: '.d-icon-search',
        selectSelfApprovals: '.ui-grid-selection-row-header-buttons',
        selfApprovalDeleteIcon: '.d-icon-left-trash',
        GeneralApprovalDeleteIcon: '.d-collapse-panel[aria-expanded="true"] div.button-open-action .d-icon-right-trash',
        saveModalButton: '[aria-label="Edit expression"] .modal-footer [rx-id="save-button"]',
        cancelModalButton: '.modal-footer [rx-id="cancel-button"]',
        moveApprovalButton: 'button.move-button',
        approvalTypeDropdown: '[rx-id="approver-type"] button',
        approvalModalSaveButton: '.modal-footer button[rx-id="save-button"]',
        selfApprovalQualificationLink: '[property-label="Self approval qualification"] button',
        selfApprovalPrecendence: '[rx-id="precedence"] input',
        selfApprovalAddButton: 'button[rx-id="add-button"]',
        selfApprovalProcess: '[rx-id="process"]'
    }

    async searchAndOpenApprovalConfiguration(apporvalConfiguration: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(apporvalConfiguration);
    }

    async clickApprovalConfigurationTab(approvalConfigTab: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.approvalConfigTab, approvalConfigTab)).click();
    }

    async clickApprovalGroup(approvalConfigGroup: string): Promise<void> {
        let locator = `input[value='${approvalConfigGroup}']`
        await $(locator).click();
    }

    async clickAddGeneralFlowButton(): Promise<void> {
        await $(this.selectors.addNewGeneralFlowBtn).click();
    }

    async clickAddLevelUpFlowButton(): Promise<void> {
        await $(this.selectors.addNewLevelUpFlowBtn).click();
    }

    async selectApprovalFlowOption(approvalFlow: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.selectNewApprovalFlowOption, approvalFlow)).click();
    }

    async expandNewApprovalFlowBrick(): Promise<void> {
        await $$(this.selectors.approvalFlowBrick).last().click();
    }

    async getNewApprovalFlowDefaultTitle(): Promise<string> {
        return await $$(this.selectors.approvalFlowBrick).last().getText();
    }

    async editNewApprovalFlowDefaultTitle(approvalFlowTitle: string): Promise<void> {
        await $$(this.selectors.approvalFlowTitleInput).last().sendKeys(approvalFlowTitle);
    }

    async setNoOfLevels(noOfLevels: string): Promise<void> {
        await $$(this.selectors.noOfLevelsInput).last().sendKeys(noOfLevels);
    }

    async clickExpressionLink(): Promise<void> {
        await $$(this.selectors.expressionQualitificationLink).last().click();
    }

    async isCreateNewApprovalFlowPopUpDisplayed(): Promise<boolean> {
        return await $(this.selectors.createNewApprovalFlowPopUp).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.createNewApprovalFlowPopUp).isDisplayed();
            else return false;
        });
    }

    async getCreateNewApprovalFlowPopUpTitle(): Promise<string> {
        return await $$(this.selectors.createNewApprovalFlowPopUp).getText();
    }

    async searchExpressionFieldOption(expressionField: string): Promise<void> {
        await $(this.selectors.searchExpressionField).clear();
        await $(this.selectors.searchExpressionField).sendKeys(expressionField);
    }

    async clickRecordOption(recordOption: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.selectRecordOption, recordOption)).click();
    }

    async getSearchedExpressionFieldOption(expressionFieldOption: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.selectExpressionOption, expressionFieldOption)).getText();
    }

    async selectExpressionFieldOption(fieldOption: string): Promise<void> {
        let countChild = await $$('.modal-body .ui-tree-selectable .expression-node-label').count();
        for (let i = 0; i < countChild; i++) {
            let getTextofChild = await $$('.modal-body .ui-tree-selectable .expression-node-label').get(i).getAttribute('title');
            if (getTextofChild == fieldOption) {
                await $$('.modal-body .ui-tree-selectable .expression-node-button').get(i).click();
                break;
            }
        }
    }

    async selectExpressionOperator(expressionOperator: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.selectExpressionOperator, expressionOperator)).click();
    }

    async clickExpressionOperatorLinkToSelectExpressionValue(): Promise<void> {
        await $(this.selectors.expressionOperatorLink).click();
    }

    async selectExpressionValuesOptions(expressionOption: string, expressionValueOption: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.expressionValueOptions, expressionOption)).click();
        await browser.sleep(1000); // sometimes expression option is not expanded
        await element(by.cssContainingText(this.selectors.expressionValueOptions, expressionOption)).getAttribute('aria-expanded').then(async (result) => {
            if (result) await element(by.cssContainingText(this.selectors.expressionValueOptionSelector, expressionValueOption)).click();
        });
    }

    async searchFoundationDataToApprovalExpression(foundationDataOption: string): Promise<void> {
        await utilityGrid.searchRecord(foundationDataOption);
    }

    async selectFoundationDataToApprovalExpression(foundationDataOption: string): Promise<void> {
        await utilityGrid.searchAndOpenHyperlink(foundationDataOption);
    }

    async clickSelectLink(): Promise<void> {
        await $(this.selectors.selectLink).click();
    }

    async clickFoundationDataSaveButton(): Promise<void> {
        await $(this.selectors.foundataDataSaveButton).click();
    }

    async clickNewApprovalFlowSaveButton(): Promise<void> {
        await $(this.selectors.newApprovalFlowSaveButton).click();
    }

    async clickApproversSaveButton(): Promise<void> {
        await $(this.selectors.approversSaveButton).click();
    } 

    async clickApprovalFlowCloseButton(): Promise<void> {
        await $(this.selectors.approvalFlowCloseButton).click();
    }

    async clickNewSelfApprovalFlowButton(): Promise<void> {
        await $(this.selectors.newSelfApprovalFlowLinkButton).click();
    }

    async setExpressionValueForParameter(expressionValue: string): Promise<void> {
        await $(this.selectors.ckEditorTextInput).sendKeys(expressionValue);
    }

    async clickNextbuttonOnSelfApproval(): Promise<void> {
        await $(this.selectors.selfApprovalNextButton).click();
    }

    async setAuditInformationValue(auditInfo: string): Promise<void> {
        await $(this.selectors.auditInformationTextField).sendKeys(auditInfo);
    }

    async selectSelfApprovalProcess(dropDownValue:string): Promise<void> {
        let dropDownElement: ElementFinder;
        dropDownElement = await $(`[formcontrolname="process"] button`);
        await utilityCommon.selectDropDown(dropDownElement, dropDownValue, DropDownType.WebElement);
    }

    async selectMultipleApproversDropDownOption(multipleApproverFlow: string): Promise<void> {
        await $$(this.selectors.multipleApproverFlowDropDown).last().click();
        await element(by.cssContainingText(this.selectors.multipleApproverFlowDropDownOption, multipleApproverFlow)).click();
    }

    async clickSelectApproversLink(): Promise<void> {
        await $$(this.selectors.selectApproversLink).last().click();
    }

    async selectApproverSectionForGeneralApprovalFlow(approvalSection: string): Promise<void> {
        await $(this.selectors.approvalTypeDropdown).click()
        await element(by.cssContainingText(this.selectors.selectApproverSectionForGeneralApprovalFlow, approvalSection)).click();
    }

    async selectApproversForApproverFlow(approverType: string, approver: string): Promise<void> {
        switch (approverType) {
            case "Functional Roles": {
                // await $(this.selectors.functionalRolesForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.functionalRolesSearchInput).sendKeys(approver);
                await $(this.selectors.selectFunctionalRolesCheckbox).click();
                await $(this.selectors.moveApprovalButton).click();
                break;
            }
            case "Primary Organization": {
                // await $(this.selectors.primaryOrganizationForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilityGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Business Unit": {
                // await $(this.selectors.businessUnitForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilityGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Department": {
                // await $(this.selectors.departmentForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilityGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Support Group": {
                // await $(this.selectors.supportGroupForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilityGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "People": {
                // await $(this.selectors.personForApprovalFlow).click();
                await $(this.selectors.functionalRolesSearchInput).click();
                await $('div.user-list .adapt-rx-search__input').sendKeys(approver);
                await $$(this.selectors.selectFunctionalRolesCheckbox).last().click();
                await $(this.selectors.moveApprovalButton).click();
                await this.clickApproversSaveButton();
                break;
            }
            case "Fields Identifying Approval": {
                // await $(this.selectors.fieldsIdentifyingApprovalForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await element(by.cssContainingText(this.selectors.fieldsIdentifyingApprovalOptionsForApprovalFlow, approver)).click();
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            default: {
                console.log('Approval Flow option does not match');
                break;
            }
        }
    }

    async clickModelOkButton(): Promise<void> {
        await $(this.selectors.saveModalButton).click();
    }

    async clickModelCancelButton(): Promise<void> {
        await $(this.selectors.cancelModalButton).click();
    }

    async clickOnMenuItem(menuName: string): Promise<void> {
        let countParent = await $$('.modal-body .a-tree__label').count();
        for (let i = 0; i < countParent; i++) {
            let getTextofparent = await $$('.modal-body .a-tree__label adapt-highlight').get(i).getText();
            console.log('getTextofparent>>>>>', getTextofparent);
            if (getTextofparent == menuName) {
                await $$('.modal-body .a-tree__toggle').get(i).click();
                await browser.sleep(3000);//Added becoz of slownees open the parent tree
                break;
            }
        }
    }

    async clickMoveButton() {
        await $(this.selectors.moveApprovalButton).click();
    }

    async clickApproverModalSaveButton() {
        await $(this.selectors.approvalModalSaveButton).click();
    }

    async clickSelfApprovalQualificationLink() {
        await $(this.selectors.selfApprovalQualificationLink).click();
    }

    async setSelfApprovalPrecendenceValue(value: string) {
        await $(this.selectors.selfApprovalPrecendence).sendKeys(value);
    }

    async clickSelfApprovalAddButton() {
        await $(this.selectors.selfApprovalAddButton).click();
    }

}

export default new ApprovalsConsole();