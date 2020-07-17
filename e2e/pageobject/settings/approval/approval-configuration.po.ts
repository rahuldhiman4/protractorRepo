import { $, protractor, ProtractorExpectedConditions, element, by, $$, browser } from "protractor";
import utilGrid from '../../../utils/util.grid';
import utilCommon from '../../../utils/util.common';

class ApprovalsConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        approvalConfigTab: '.d-steps__link',
        approvalGroup: '.button-open-action span',
        addNewFlowBtn: '.d-collapse-panel[aria-expanded="true"] button.d-icon-right-angle_down',
        selectNewApprovalFlowOption: 'button.d-icon-right-angle_down[aria-expanded="true"] + ul a',
        approvalFlowBrick: '.d-collapse-panel[aria-expanded="true"] div.button-open-action',
        expandApprovalFlowBrickArea: '.d-collapse-panel[aria-expanded="true"] div.button-open-action + div[aria-expanded="true"]',
        approvalFlowBrickTitle: 'span',
        approvalFlowBrickEditLink: '.d-icon-right-pencil',
        approvalFlowTitleInput: 'input[rx-id="flowName"]',
        noOfLevelsInput: '.d-textfield__input[rx-id="levels"]',
        expressionQualitificationLink: 'a[rx-id="general-expression"]',
        createNewApprovalFlowPopUp: '.modal-header h4',
        searchExpressionField: '.modal-content .d-textfield__input',
        selectRecordOption: '.rx-data-dictionary-item div',
        selectExpressionOption: '.rx-data-dictionary-item-value',
        expressionOptionPlusIcon: '.d-icon-plus_circle',
        selectExpressionOperator: 'button.d-button_secondary',
        expressionOperatorLink: 'button.d-icon-connection',
        expressionValueOptions: 'button.d-dropdown__trigger',
        expressionValueOptionSelector: 'button.d-dropdown__trigger[aria-expanded="true"] + ul a[role="menuitem"]',
        selectLink: '.select-title-btn',
        foundataDataSaveButton: 'button[rx-id="foundation-data-save-btn"]',
        newApprovalFlowSaveButton: 'button.rx-editor-header__button_save',
        approvalFlowSaveButton: 'button.save-button',
        editApprovalFlowCloseButton: '.modal-footer button.d-button_large',
        newSelfApprovalFlowLinkButton: '.d-icon-left-plus_circle',
        ckEditorTextInput: '.cke_editable_inline',
        selfApprovalNextButton: 'button.d-icon-right-angle_right',
        auditInformationTextField: 'textarea[rx-id="audit-information"]',
        sampleSelfApprovalCheckbox: '.ui-grid-icon-ok',
        multipleApproverFlowDropDown: 'select[ng-model="approvalFlowList.signingCriteria"]',
        multipleApproverFlowDropDownOption: 'option',
        selectApproversLink: '.d-icon-right-connection',
        selectApproverSectionForGeneralApprovalFlow: '.role-list section a',
        businessUnitForApprovalFlow: 'rx-record-grid[rx-configuration="businessUnitGridConfiguration"]',
        primaryOrganizationForApprovalFlow: 'rx-record-grid[rx-configuration="primaryOrgsGridConfiguration"]',
        departmentForApprovalFlow: 'rx-record-grid[rx-configuration="departmentsGridConfiguration"]',
        supportGroupForApprovalFlow: 'rx-record-grid[rx-configuration="supportGroupGridConfiguration"]',
        personForApprovalFlow: 'rx-record-grid[rx-configuration="personGridConfiguration"]',
        functionalRolesForApprovalFlow: 'div[heading="Functional Roles"]',
        functionalRolesSearchInput: 'searchFunctionalRolesText',
        selectFunctionalRolesCheckbox: 'div[heading="Functional Roles"] .d-checkbox__item',
        fieldsIdentifyingApprovalForApprovalFlow: 'div[heading="Field Identifying Approval"]',
        fieldsIdentifyingApprovalOptionsForApprovalFlow: 'div[heading="Field Identifying Approval"] li',
        selectApprovalFlow: 'a.leftRightButton .d-icon-angle_right',
        approvalFlowSearchIcon: '.d-icon-search',
        selectSelfApprovals: '.ui-grid-selection-row-header-buttons',
        selfApprovalDeleteIcon: '.d-icon-left-trash',
        GeneralApprovalDeleteIcon: '.d-collapse-panel[aria-expanded="true"] div.button-open-action .d-icon-right-trash',
    }

    async searchAndOpenApprovalConfiguration(apporvalConfiguration: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(apporvalConfiguration);
    }

    async clickApprovalConfigurationTab(approvalConfigTab: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.approvalConfigTab, approvalConfigTab)).click();
    }

    async clickApprovalGroup(approvalConfigGroup: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.approvalGroup, approvalConfigGroup)).click();
    }

    async clickAddNewFlowLinkButton(): Promise<void> {
        await $(this.selectors.addNewFlowBtn).click();
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
        await $$(this.selectors.approvalFlowBrick).last().$$(this.selectors.approvalFlowBrickEditLink).click();
        await $$(this.selectors.approvalFlowBrick).last().$$(this.selectors.approvalFlowTitleInput).click();
        await $$(this.selectors.approvalFlowBrick).last().$$(this.selectors.approvalFlowTitleInput).sendKeys(approvalFlowTitle);
    }

    async setNoOfLevels(noOfLevels: string): Promise<void> {
        await $$(this.selectors.expandApprovalFlowBrickArea).last().$$(this.selectors.noOfLevelsInput).click();
        await $$(this.selectors.expandApprovalFlowBrickArea).last().$$(this.selectors.noOfLevelsInput).sendKeys(noOfLevels);
    }

    async clickExpressionLink(): Promise<void> {
        await $$(this.selectors.expandApprovalFlowBrickArea).last().$$(this.selectors.expressionQualitificationLink).click();
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

    async selectExpressionFieldOption(): Promise<void> {
        await $(this.selectors.expressionOptionPlusIcon).click();
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
        await utilGrid.searchRecord(foundationDataOption);
    }

    async selectFoundationDataToApprovalExpression(foundationDataOption: string): Promise<void> {
        await utilGrid.searchAndOpenHyperlink(foundationDataOption);
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

    async clickApprovalFlowSaveButton(): Promise<void> {
        await $$(this.selectors.approvalFlowSaveButton).last().click();
    }

    async closeEditApprovalFlowPopUpWindow(buttonLabel: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.editApprovalFlowCloseButton, buttonLabel)).click();
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

    async selectSelfApprovalProcess(): Promise<void> {
        await $(this.selectors.sampleSelfApprovalCheckbox).click();
    }

    async selectMultipleApproversDropDownOption(multipleApproverFlow: string): Promise<void> {
        await $$(this.selectors.expandApprovalFlowBrickArea).last().$(this.selectors.multipleApproverFlowDropDown).click();
        await $$(this.selectors.expandApprovalFlowBrickArea).last().$(this.selectors.multipleApproverFlowDropDown).element(by.cssContainingText(this.selectors.multipleApproverFlowDropDownOption, multipleApproverFlow)).click();
    }

    async clickSelectApproversLink(): Promise<void> {
        await $$(this.selectors.expandApprovalFlowBrickArea).last().$(this.selectors.selectApproversLink).click();
    }

    async selectApproverSectionForGeneralApprovalFlow(approvalSection: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.selectApproverSectionForGeneralApprovalFlow, approvalSection)).click();
    }

    async selectApproversForApproverFlow(approverType: string, approver: string): Promise<void> {
        switch (approverType) {
            case "Functional Roles": {
                // await $(this.selectors.functionalRolesForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.functionalRolesSearchInput).sendKeys(approver);
                await $(this.selectors.selectFunctionalRolesCheckbox).click();
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Primary Organization": {
                // await $(this.selectors.primaryOrganizationForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Business Unit": {
                // await $(this.selectors.businessUnitForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Department": {
                // await $(this.selectors.departmentForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Support Group": {
                // await $(this.selectors.supportGroupForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
                break;
            }
            case "Person": {
                // await $(this.selectors.personForApprovalFlow).click();
                await this.selectApproverSectionForGeneralApprovalFlow(approverType);
                await $(this.selectors.approvalFlowSearchIcon).click();
                await utilGrid.searchAndSelectGridRecord(approver);
                await $(this.selectors.selectApprovalFlow).click();
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

    async deleteApprovalConfiguration(approvalConfigTab: string): Promise<void> {
        if (approvalConfigTab == 'Self Approval') {
            await $(this.selectors.selectSelfApprovals).click();
            await $(this.selectors.selfApprovalDeleteIcon).click();
            await utilCommon.clickOnWarningOk();
        } else {
            let approvalsNum = await $$(this.selectors.GeneralApprovalDeleteIcon);
            for (let i = 0; i < approvalsNum.length - 1; i++) {
                await $(this.selectors.GeneralApprovalDeleteIcon).get(i).click();
            }
            await this.clickApprovalFlowSaveButton();
        }
    }


}

export default new ApprovalsConsole();