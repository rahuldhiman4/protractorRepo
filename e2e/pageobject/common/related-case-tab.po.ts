import { $, $$, browser, protractor, ProtractorExpectedConditions } from "protractor";
import util from '../../utils/util.common';

class RelatedCasePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        caseId: ' .case-summary__meta-data__display-id',
        priority: ' .case-summary__meta-data__priority',
        modifiedDate: ' .case-summary__meta-data__modified-date',
        relationship: ' .case-relationship .field__value',
        status: ' .status .field__value',
        summary: ' .case-summary__name-adhoc__name',
        assignee: ' .assignee__field a',
        caseSummary: ' .case-summary__name-adhoc a',
        removeCaseButton: ' .close.close-button',
        allRelatedCases: '.case-list',
        addRelatedCasesButton: '[rx-view-component-id="98f12394-dfb7-4018-82db-0f607011950e"] button'
    }

    async getRelatedCasePriority(caseId: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allPersonNum: number = await $$(this.selectors.allRelatedCases).count();
        let priority: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await person.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                priority = await person.$(this.selectors.priority).getText();
                break;
            }
        }
        return priority;
    }

    async getRelatedCaseModDate(caseId: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allPersonNum: number = await $$(this.selectors.allRelatedCases).count();
        let modDate: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await person.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                modDate = await person.$(this.selectors.modifiedDate).getText();
                break;
            }
        }
        return modDate;
    }

    async getRelatedCaseRelation(caseId: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allCaseNum: number = await $$(this.selectors.allRelatedCases).count();
        let relation: string;
        for (let i = 0; i < allCaseNum; i++) {
            let cases = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await cases.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                await browser.wait(this.EC.or(async () => {
                    await cases.$(this.selectors.relationship).getAttribute('title');
                }), 3000);
                relation = await cases.$(this.selectors.relationship).getAttribute('title');
                break;
            }
        }
        return relation;
    }

    async getRelatedCaseStatus(caseId: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allPersonNum: number = await $$(this.selectors.allRelatedCases).count();
        let caseStatus: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await person.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                caseStatus = await person.$(this.selectors.status).getText();
                break;
            }
        }
        return caseStatus;
    }

    async getRelatedCaseSummary(caseId: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allCasesNum: number = await $$(this.selectors.allRelatedCases).count();
        let caseSummary: string;
        for (let i = 0; i < allCasesNum; i++) {
            let cases = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await cases.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                caseSummary = await cases.$(this.selectors.summary).getText();
                break;
            }
        }
        return caseSummary;
    }

    async getRelatedCaseAssignee(caseId: string): Promise<string> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allPersonNum: number = await $$(this.selectors.allRelatedCases).count();
        let caseAssignee: string;
        for (let i = 0; i < allPersonNum; i++) {
            let person = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await person.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                caseAssignee = await person.$(this.selectors.assignee).getText();
                break;
            }
        }
        return caseAssignee;
    }

    async addRelatedCases(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.addRelatedCasesButton)))
        await $(this.selectors.addRelatedCasesButton).click();
    }

    async openCaseFromRelatedCases(caseId: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allCasesNum: number = await $$(this.selectors.allRelatedCases).count();
        for (let i = 0; i < allCasesNum; i++) {
            let cases = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await cases.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                await cases.$(this.selectors.caseSummary).click();
                break;
            }
        }
    }

    async removeRelatedCase(caseId: string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.allRelatedCases)));
        let allCasesNum: number = await $$(this.selectors.allRelatedCases).count();
        for (let i = 0; i < allCasesNum; i++) {
            let cases = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await cases.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                await cases.$(this.selectors.removeCaseButton).click();
                break;
            }
        }
        await util.clickOnWarningOk();
    }

    async isCasePresent(caseId: string): Promise<boolean> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.addRelatedCasesButton)));
        let allCasesNum: number = await $$(this.selectors.allRelatedCases).count();
        let status: boolean = true;;
        for (let i = 0; i < allCasesNum; i++) {
            let cases = await $$(this.selectors.allRelatedCases).get(i);
            let nm: string = await cases.$(this.selectors.caseId).getText();
            if (nm == caseId) {
                await cases.$(this.selectors.removeCaseButton).click();
                status = false;
                break;
            }
        }
        return status;
    }

    async waitUntilNewRelatedCaseAdded(expectedCount: number): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.allRelatedCases).count();
            return count >= expectedCount;
        }));
    }
}

export default new RelatedCasePage();