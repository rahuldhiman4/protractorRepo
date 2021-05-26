import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";

class ProcessLibraryConfigEditPage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        editDescription: '[rx-view-component-id="f89ac9af-1e00-4bf3-9acc-79886e541b4d"] textarea',
        status: '[rx-view-component-id="82350ab4-c2fb-4c35-9481-b5db8e85aa6f"] button',
        cancelButton: '[rx-view-component-id="65530a7e-0b78-471c-b355-4196f98a3baa"] button',
        saveButton: '[rx-view-component-id="03d04373-17d2-4b19-af55-1a26e04ee7f1"] button'
    }

    async isDescriptionDisabled(): Promise<boolean> {
        return await $(this.selectors.editDescription).getAttribute("readonly") == "true";
    }

    async isStatusDisabled(): Promise<boolean> {
        return await $(this.selectors.status).getAttribute("aria-disabled") == "true";
    }

    async isSaveButtonDisabled(): Promise<boolean> {
        return await $(this.selectors.saveButton).getAttribute("disabled") == "true";
    }

}

export default new ProcessLibraryConfigEditPage();