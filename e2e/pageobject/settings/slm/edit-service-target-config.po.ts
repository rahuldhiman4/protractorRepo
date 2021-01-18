import { $, $$, protractor, ProtractorExpectedConditions, element, by } from "protractor";

class ServiceTargetEditConfigPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        statusFields: '[rx-view-component-id="88b4a2e0-8646-4cff-b337-e99eb00c9745"] button div',
        description: '[rx-view-component-id="361c10e5-f7b8-4ce9-bb96-7ebd1420ca67"] input',
        buildExpressionButton: '[rx-view-component-id="5f99b4c8-0fd5-446e-aa32-9643fbf083cb"] button',
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