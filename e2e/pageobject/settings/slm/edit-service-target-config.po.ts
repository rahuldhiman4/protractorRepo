import { $, $$, protractor, ProtractorExpectedConditions, element, by } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class ServiceTargetEditConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusFields: '[rx-view-component-id="a6f3c85c-ecd6-49e6-a08b-98697b9811d5"] button',
        termsAndConditionsFieldGuid:'3b92bdaa-6538-47e5-b2e0-aea0d3384ea8',
        description: '[rx-view-component-id="a587e4b8-f37d-4cf7-b231-1565c88086eb"] textarea',
        buildExpressionButton: '[rx-view-component-id="7ec71317-df5c-4586-b450-a4a8a2cf2e7f"] button',
        goalSection: '[rx-view-component-id="dfe00444-bde8-438c-ae80-0cb4c747bbc6"] bwf-slm-goal-tab input.adapt-counter-input',
        expandSection: '.adapt-accordion .card .text-direction',
        setWarningStatus: 'input#warning-status',
        svtDescriptionField: '[rx-view-component-id="a587e4b8-f37d-4cf7-b231-1565c88086eb"] textarea',
        addMiletoneButton: '.adapt-accordion .bwf-button-link-wrapper button[aria-label="New"]',
        deleteMilestoneButton: '.adapt-accordion .bwf-button-link-wrapper button[aria-label="Delete"]',
        editMilestoneButton: '.adapt-accordion .bwf-button-link-wrapper button[aria-label="Edit"]',
        saveButton: '[rx-view-component-id="baaac71b-d33c-4a09-a2e1-1a8e564d1e9a"] button',
        serviceTargetBlade: '[rx-view-definition-guid="f1e761bb-23d6-4e13-b4c0-ea500f3bcf1f"]',
        closeSVTButton: '[rx-view-component-id="6615b898-d9cc-478c-97c7-c47f6947d525"] button',
    }

    async isServiceTargetBladeDisplayed(): Promise<boolean> {
        return await $(this.selectors.serviceTargetBlade).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.serviceTargetBlade).isDisplayed();
            } else {
                return false;
            }
        });
    }

    async isCloseButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.closeSVTButton).isEnabled();
    }

    async enterSVTDescription(svtDesc: string): Promise<void> {
        await $(this.selectors.svtDescriptionField).clear();
        await $(this.selectors.svtDescriptionField).sendKeys(svtDesc);
    }

    async clearSVTDescription(): Promise<void> {
        await $(this.selectors.svtDescriptionField).clear();
    }

    async isTermsAndConditionsFieldMandatory(): Promise<boolean> {
        return await utilityCommon.isRequiredTagToField(this.selectors.termsAndConditionsFieldGuid)
        }

    async clickCloseButton(): Promise<void> {
     await $(this.selectors.closeSVTButton).click();
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.statusFields).getAttribute('aria-disabled') == 'true';
    }

    async isDescriptionFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.description).getAttribute('readonly') == 'true';
    }

    async isBuildExpressionButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.buildExpressionButton).getAttribute('disabled') == 'true';
    }

    async isGoalDaysFieldEnabled(): Promise<boolean> {
        return await $$(this.selectors.goalSection).get(0).isEnabled();
    }

    async isGoalHoursFieldEnabled(): Promise<boolean> {
        return await $$(this.selectors.goalSection).get(1).isEnabled();
    }

    async isGoalMinutesFieldEnabled(): Promise<boolean> {
        return await $$(this.selectors.goalSection).get(2).isEnabled();
    }

    async expandSection(sectionName: string): Promise<void> {
        let tempLocator = await element(by.cssContainingText(this.selectors.expandSection, sectionName));
        await tempLocator.$('span').click();
    }

    async isSetWarningstatusFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.setWarningStatus).isEnabled();
    }

    async isStartWhenBuildExpressionButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.buildExpressionButton).isEnabled();
    }

    async isAddMilestoneButtonDisabled(): Promise<string> {
        return await $(this.selectors.addMiletoneButton).getAttribute('disabled');
    }

    async isEditMilestoneButtonDisabled(): Promise<string> {
        return await $(this.selectors.editMilestoneButton).getAttribute('disabled');
    }

    async isDeleteMilestoneButtonDisabled(): Promise<string> {
        return await $(this.selectors.deleteMilestoneButton).getAttribute('disabled');
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

    async clickSaveButton(): Promise<void> {
         await $(this.selectors.saveButton).click();
    }

}

export default new ServiceTargetEditConfigPage();