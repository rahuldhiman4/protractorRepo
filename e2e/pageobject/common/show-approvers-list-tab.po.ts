import { $, $$, by, element, Key, protractor, ProtractorExpectedConditions, browser } from "protractor";

class ShowApproversBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        showApproversBlade: 'fieldset.dp-size-rx-sm',
        showApproversBladeTitle: '.dp-header span',
        showApproversTab: 'fieldset.dp-size-rx-sm button.nav-link span.nav-link-wrapper',
        approvalsHelpText: 'fieldset.dp-size-rx-sm .alert-info',
        approvers: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item',
        approverName: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item .bwf-approver-list-group-list-item-description',
        approverPersonIcon: '.bwf-approver-list-group-list-item .bwf-approver-list-group-list-item-info',
        approverCompany: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item [class="pt-1"]',
        awaitingApproverIcon: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item-icon-container .d-icon-clock_o',
        awaitingApproverLabel: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item-icon-container .d-icon-clock_o + span',
        approvedApproverIcon: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item-icon-container .d-icon-check_circle_o',
        approvedApproverLabel: 'fieldset.dp-size-rx-sm .active .bwf-approver-list-group-list-item-icon-container .d-icon-check_circle_o + span',
        onHoldIcon: '.d-icon-sandglass',
        onHoldLabel: '.d-icon-sandglass + span',

        showApproversBladeActivity: 'fieldset.dp-size-rx-md',
        showApproversBladeTitleActivity: '.dp-header span',
        showApproversTabActivity: 'fieldset.dp-size-rx-md button.nav-link span.nav-link-wrapper',
        approvalsHelpTextActivity: 'fieldset.dp-size-rx-md .alert-info',
        approversActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item',
        approverNameActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item .bwf-approver-list-group-list-item-description',
        approverPersonIconActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item .d-icon-user_circle',
        approverCompanyActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item [class="pt-1"]',
        awaitingApproverIconActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-clock_o',
        awaitingApproverLabelActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-clock_o + span',
        closedApproverIconActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-cross_circle_o',
        closedApproverLabelActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-cross_circle_o + span',
        approvedApproverIconActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-check_circle_o',
        approvedApproverLabelActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-check_circle_o + span',
        rejectedApproverLabelActivity: 'fieldset.dp-size-rx-md .active .bwf-approver-list-group-list-item-icon-container .d-icon-cross_circle_o + span',
        backButton: '[rx-view-component-id="56ae39ee-49a3-42b5-94b1-55da3abe4b81"] button',
    }

    async isShowApproversBladeDisplayed(): Promise<boolean> {
        return await $(this.selectors.showApproversBlade).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.showApproversBlade).isDisplayed();
            else return false;
        });
    }

    async getShowApproversBladeLabel(): Promise<string> {
        return await $(this.selectors.showApproversBladeTitle).getText();
    }

    async getApproversTabLabel(approverTabTitle: string): Promise<string> {
        return await element(by.cssContainingText((this.selectors.showApproversTab), approverTabTitle)).getText();
    }

    async getApprovalsHelpTextOnShowApproversBlade(): Promise<string> {
        return await $(this.selectors.approvalsHelpText).getText();
    }

    async clickApproversTab(approverTabTitle: string): Promise<void> {
        await element(by.cssContainingText((this.selectors.showApproversTab), approverTabTitle)).click();
    }

    async getApproversCount(): Promise<number> {
        return await $$(this.selectors.approvers).count();
    }

    async getApproversName(approversName: string): Promise<boolean> {
        return await element(by.cssContainingText((this.selectors.approverName), approversName)).isDisplayed();
    }

    async getApproversCompany(approversCompany: string): Promise<boolean> {
        return await element(by.cssContainingText((this.selectors.approverCompany), approversCompany)).isDisplayed();
    }

    async getApprovalStatusLabel(): Promise<string> {
        return await $(this.selectors.awaitingApproverLabel).getText();
    }

    async isApproverPersonIconDisplayed(approverName: string): Promise<boolean> {
        let approverList = await $$('.bwf-approver-list-group-list-item-description');
        for (let i: number = 0; i < approverList.length; i++) {
            let name = await $$('.bwf-approver-list-group-list-item-description').get(i).getText();
            if (approverName == name) {
                return await $$('.bwf-approver-list-group-list-item-info').get(i).isDisplayed();
            }
        }
        return await $(this.selectors.approverPersonIcon).isDisplayed();
    }

    async isAwaitingApproverIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.awaitingApproverIcon).isDisplayed();
    }

    async isBackButtonOnApprovalBladeDisplayed(): Promise<boolean> {
        return await $(this.selectors.backButton).isDisplayed();
    }

    async clickBackButtonOnApprovalBlade(): Promise<void> {
        await $(this.selectors.backButton).click();
    }

    async getApprovedApprovalStatusLabel(): Promise<string> {
        return await $(this.selectors.approvedApproverLabel).getText();
    }

    async isApprovedApproverIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.approvedApproverIcon).isDisplayed();
    }

    async isOnHoldIconDisplayed(): Promise<boolean> {
        return await $(this.selectors.onHoldIcon).isDisplayed();
    }

    async getOnHoldApprovalStatusLabel(): Promise<string> {
        return await $(this.selectors.onHoldLabel).getText();
    }

    async isShowApproversBladeOnActivityDisplayed(): Promise<boolean> {
        return await $(this.selectors.showApproversBladeActivity).isDisplayed();
    }

    async getShowApproversBladeLabelFromActivity(): Promise<string> {
        return await $(this.selectors.showApproversBladeTitleActivity).getText();
    }

    async getApproversTabLabelFromActivity(approverTabTitle: string): Promise<string> {
        return await element(by.cssContainingText((this.selectors.showApproversTabActivity), approverTabTitle)).getText();
    }

    async getApprovalsHelpTextOnShowApproversBladeFromActivity(): Promise<string> {
        return await $(this.selectors.approvalsHelpTextActivity).getText();
    }

    async clickApproversTabFromActivity(approverTabTitle: string): Promise<void> {
        await element(by.cssContainingText((this.selectors.showApproversTabActivity), approverTabTitle)).click();
    }

    async getApproversCountFromActivity(): Promise<number> {
        return await $$(this.selectors.approversActivity).count();
    }

    async getApproversNameFromActivity(approversName: string): Promise<boolean> {
        return await element(by.cssContainingText((this.selectors.approverNameActivity), approversName)).isDisplayed();
    }

    async getApproversCompanyFromActivity(approversCompany: string): Promise<boolean> {
        return await element(by.cssContainingText((this.selectors.approverCompanyActivity), approversCompany)).isDisplayed();
    }

    async isApproverPersonIconDisplayedFromActivity(): Promise<boolean> {
        return await $(this.selectors.approverPersonIconActivity).isDisplayed();
    }

    async getApprovalStatusLabelFromActivity(): Promise<string> {
        return await $(this.selectors.awaitingApproverLabelActivity).getText();
    }

    async isAwaitingApproverIconDisplayedFromActivity(): Promise<boolean> {
        return await $(this.selectors.awaitingApproverIconActivity).isDisplayed();
    }

    async getClosedApprovalStatusLabelFromActivity(approvalStatus: string): Promise<string> {
        return await element(by.cssContainingText(this.selectors.closedApproverLabelActivity, approvalStatus)).getText();
    }

    async isClosedApproverIconDisplayedFromActivity(): Promise<boolean> {
        return await $(this.selectors.closedApproverIconActivity).isDisplayed();
    }

    async getApprovedApprovalStatusLabelFromActivity(): Promise<string> {
        return await $(this.selectors.approvedApproverLabelActivity).getText();
    }

    async getRejectedApprovalStatusLabelFromActivity(): Promise<string> {
        return await $(this.selectors.rejectedApproverLabelActivity).getText();
    }


    async isApprovedApproverIconDisplayedFromActivity(): Promise<boolean> {
        return await $(this.selectors.approvedApproverIconActivity).isDisplayed();
    }

}

export default new ShowApproversBlade();
