import { $, $$, by, element, protractor, ProtractorExpectedConditions } from "protractor";
import utilityGrid from '../../utils/utility.grid';

class SelectCaseTemplateBlade {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        recommendedTemplate: 'Recommended Templates',
        allTemplates: '.nav-link-wrapper',
        searchTextbox: '[rx-view-component-id="c61478d4-1d46-4d0d-9450-c90885aab77e"] .adapt-search-field-ellipsis',
        refreshbutton: '[rx-id="refresh-button"]',
        applyButton: '[rx-view-component-id="f348e681-ac02-452c-b37f-009ac4434053"] button',
        caseTemplateCheckBox: '.ui-grid-icon-ok',
        caseTemplateLink: '[rx-view-component-id="c61478d4-1d46-4d0d-9450-c90885aab77e"] td button.btn-link',
        cancelButton: '[rx-view-component-id="161ed2e2-ea43-4db5-9f9c-149f82a74db2"] button',
        paginationNextButton: '.content-outlet .page-next',
        paginationPreviousButton: '.content-outlet .page-prev',
        pagination: '.content-outlet .justify-content-center nav[aria-label="Page navigation"]',
        pagesNo: '[rx-view-component-id="5015968d-5d4f-4630-8b31-a69e9fedb82a"] .page-link',
        recommendedTitle: '.bwf-search-result .bwf-search-fields__title-text span',
        searchResult: '[rx-view-component-id="5015968d-5d4f-4630-8b31-a69e9fedb82a"] [role="listitem"]',
        recommendedApplyBtn: '[rx-view-component-id="39321025-7d92-4284-8498-a0c6fc44f6cd"] button',
        recommendedCancelBtn: '[rx-view-component-id="befd164d-2508-4b8e-9445-3ace011022b7"] button',
        gridGuid: 'c61478d4-1d46-4d0d-9450-c90885aab77e'
    }

    async clickOnRecommendedTemplateTab(): Promise<void> {
        await element.all(by.cssContainingText(this.selectors.allTemplates, 'Recommended Templates')).first().click();
    }

    async clickOnCaseTemplateCheckbox(): Promise<void> {
        await $(this.selectors.caseTemplateCheckBox).click();
    }

    async clickOnCaseTemplateLink(): Promise<void> {
        await $(this.selectors.caseTemplateLink).click();
    }

    async clickOnAllTemplateTab(): Promise<void> {
        await element.all(by.cssContainingText(this.selectors.allTemplates, 'All Templates')).isPresent().then(async (present) => {
            await element.all(by.cssContainingText(this.selectors.allTemplates, 'All Templates')).first().click();
        });
    }

    async searchAndOpenCaseTemplate(input: string): Promise<void> {
        await this.clickOnAllTemplateTab();
        await utilityGrid.searchAndOpenHyperlink(input);
    }

    async clickOnRefreshButton(): Promise<void> {
        await $(this.selectors.refreshbutton).click();
    }

    async selectCaseTemplate(templateName: string): Promise<void> {
        await this.clickOnAllTemplateTab();
        await utilityGrid.searchAndSelectGridRecord(templateName);
        await this.clickOnApplyButton();
    }

    async clickOnApplyButton(): Promise<void> {
        await $(this.selectors.applyButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async clickOnCaseTemplate(templateName: string): Promise<void> {
        await $(`div[title=${templateName}]`).isPresent().then(async (present) => {
            if (present) await $(`div[title=${templateName}]`).isDisplayed().then(async (displayed) => {
                if (displayed) await $(`div[title=${templateName}]`).click();
            });
        });
    }

    async clickPaginationNext(): Promise<void> {
        await $(this.selectors.paginationNextButton).click();
    }

    async isPaginationPresent(): Promise<boolean> {
        return await $(this.selectors.pagination).isPresent().then(async (present) => {
            if (present) return await $(this.selectors.pagination).isDisplayed();
            else return false;
        });
    }

    async selectFirstRecommendedTemplate(): Promise<void> {
        await $$('div[role="checkbox"]').get(0).click();
    }
    async selectFirstFromAllTemplate(): Promise<void> {
        await $$('input[type="radio"]').get(0).click();
    }

    async isApplyButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.recommendedApplyBtn).isEnabled();
    }

    async getCountOfTemplates(): Promise<number> {
        return await $$('div[role="checkbox"]').count();
    }

    async clickOnFirstRecommendedArrow(): Promise<void> {
        await $$('adapt-icon.list__item__preview-icon').get(0).click();
    }

    async clickRecommendedCancelBtn(): Promise<void> {
        await $(this.selectors.recommendedCancelBtn).click();
    }

    async clickRecommendedApplyBtn(): Promise<void> {
        await $(this.selectors.recommendedApplyBtn).click();
    }

    async isCaseSummaryPresentInRecommendedTemplates(caseSummary: string): Promise<boolean> {
        return await $(`div[role="listitem"] [title~="${caseSummary}"]`).isPresent().then(async (present) => {
            if (present) return await $(`div[role="listitem"] [title~="${caseSummary}"]`).isDisplayed();
        });
    }

    async isRecordPresent(record: string): Promise<boolean> {
        return await utilityGrid.isGridRecordPresent(record, this.selectors.gridGuid);
    }
}

export default new SelectCaseTemplateBlade();