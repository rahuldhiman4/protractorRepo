import { $, $$, protractor, ProtractorExpectedConditions, element, by } from "protractor";

class ServiceTargetEditConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusFields: '[rx-view-component-id="a6f3c85c-ecd6-49e6-a08b-98697b9811d5"] button',
        description: '[rx-view-component-id="a587e4b8-f37d-4cf7-b231-1565c88086eb"] textarea',
        buildExpressionButton: '[rx-view-component-id="7ec71317-df5c-4586-b450-a4a8a2cf2e7f"] button',
        goalDays: `(//*[@rx-view-component-id="23ae493d-cf14-445d-b7c4-44d26a1ae117"]//*[contains(@class,'form-group')])[2]//*[contains(@class,'adapt-counter__content')]//input`,
        goalHours: `(//*[@rx-view-component-id="23ae493d-cf14-445d-b7c4-44d26a1ae117"]//*[contains(@class,'form-group')])[4]//*[contains(@class,'adapt-counter__content')]//input`,
        goallMinutes: `(//*[@rx-view-component-id="23ae493d-cf14-445d-b7c4-44d26a1ae117"]//*[contains(@class,'form-group')])[6]//*[contains(@class,'adapt-counter__content')]//input`,
        expandSection: '.adapt-accordion .card .text-direction span',
        setWarningStatus: 'input#warning-status',
        addMiletoneButton: '.adapt-accordion .card button.bwf-button-link span.d-icon-left-plus_circle',
        deleteMilestoneButton: '.adapt-accordion .card button.bwf-button-link span.d-icon-left-trash_adapt',
        editMilestoneButton: '.adapt-accordion .card button.bwf-button-link span.d-icon-left-pencil',
        saveButton: '[rx-view-component-id="8f246ecd-acab-4693-a9be-597edc901291"] button'
    }

    async isStatusFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.statusFields).getAttribute('disabled') == 'true';
    }

    async isDescriptionFieldDisabled(): Promise<boolean> {
        return await $(this.selectors.description).getAttribute('readonly') == 'true';
    }

    async isBuildExpressionButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.buildExpressionButton).getAttribute('disabled') == 'true';
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