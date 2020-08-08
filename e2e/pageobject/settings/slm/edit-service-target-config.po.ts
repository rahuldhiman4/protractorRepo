import { $, $$, protractor, ProtractorExpectedConditions, element, by } from "protractor";

class ServiceTargetEditConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusFields: 'span[aria-label="Status activate"]',
        description: 'input[aria-label="Description"]',
        buildExpressionButton: 'button[ng-click*="createNewExpression"]',
        goalDays: 'input[ng-model*="recordData[field.days.id]"]',
        goalHours: 'input[ng-model*="recordData[field.hours.id]"]',
        goallMinutes: 'input[ng-model*="recordData[field.minutes.id]"]',
        expandSection: 'a.accordion-toggle span',
        setWarningStatus: 'input[ng-model*="warningLevelPercentatge"]',
        addMiletoneButton: 'button[aria-label="Add a milestone"]',
        deleteMilestoneButton: 'button[aria-label="Delete the selected milestone"]',
        editMilestoneButton: 'button[aria-label="Edit the selected milestone"]',
        saveButton: 'button[ng-click*="submitForm"]'
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.statusFields).getAttribute('disabled') == 'true';
    }

    async isDescriptionFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.description).isEnabled();
    }

    async isBuildExpressionButtonEnabled(): Promise<boolean> {
        return await $$(this.selectors.buildExpressionButton).first().isEnabled();
    }

    async isGoalDaysFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.goalDays).isEnabled();
    }

    async isGoalHoursFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.goalHours).isEnabled();
    }

    async isGoalMinutesFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.goallMinutes).isEnabled();
    }

    async expandSection(sectionName: string): Promise<void> {
        let tempLocator = await element(by.cssContainingText(this.selectors.expandSection, sectionName));
        await tempLocator.$('i').click();
    }

    async isSetWarningstatusFieldEnabled(): Promise<boolean> {
        return await $(this.selectors.goallMinutes).isEnabled();
    }

    async isStartWhenBuildExpressionButtonEnabled(): Promise<boolean> {
        return await $$(this.selectors.buildExpressionButton).get(1).isEnabled();
    }

    async isAddMilestoneButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.addMiletoneButton).isEnabled();
    }

    async isEditMilestoneButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.editMilestoneButton).isEnabled();
    }

    async isDeleteMilestoneButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.deleteMilestoneButton).isEnabled();
    }

    async isSaveButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).isEnabled();
    }

}

export default new ServiceTargetEditConfigPage();