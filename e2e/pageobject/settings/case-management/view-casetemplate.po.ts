import { $, $$, browser, by, element, protractor, ProtractorExpectedConditions } from 'protractor';
import utilityCommon from '../../../utils/utility.common';

export interface sizeAttribute {
    height: string;
    width: string;
}

class ViewCaseTemplate {

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        identityValidationValue: '[rx-view-component-id="dead2a5c-4753-40c6-9709-4b8ea9c454fd"] .read-only-content',
        templateName: '[rx-view-component-id="08a1650a-ac21-405a-8362-ddd780425a75"] span',
        caseTemplateId: '.text-field',
        CaseCompanyvalue: '[rx-view-component-id="39db6cc5-79ae-4934-a4bc-74765278fcda"] .read-only-content',
        flowsetValue: '[rx-view-component-id="da30d0cb-0adb-4145-8954-7a43cebe415c"] .read-only-content',
        editButton: '[rx-view-component-id="672c4706-9ce0-46be-9a3a-a639ded79b23"] .justify-content-end button',
        ownerGroup: '[rx-view-component-id="80799a06-c36d-4638-819a-2633a42a89e1"] .read-only-content',
        ownerCompany: '[rx-view-component-id="5c445c06-0bdc-4995-a226-05da344dcf30"] .read-only-content',
        templateStatus: '[rx-view-component-id="e5e9bf3e-8135-4d53-b03f-484545a64a5a"] .read-only-content',
        resolveCaseOnLastTaskCompletion: '[rx-view-component-id="e4956197-0230-4272-8fc4-87358bd084bf"] .read-only-content',
        categoryTier4: '[rx-view-component-id="8a790c6a-3401-44f6-afc3-eb43a67a55b1"] .read-only-content',
        priority: '.selection-field',
        labelvalue: '[rx-view-component-id="33e2d3dd-d813-4d35-8d1a-c8307b23d3e3"] .read-only-content',
        buisnessUnitvalue: '[rx-view-component-id="40817c2b-387f-4859-82e9-0a3251cdc7dc"] .read-only-content',
        departmentValue: '[rx-view-component-id="d5d0c773-b825-4be7-b357-4ed4eb73ee8d"] .read-only-content',
        manageDynamicField: '[rx-view-component-id="3cd9b535-36f6-4718-bede-9154ca02ae22"] button',
        dynamicFieldsName: '[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] span',
        editTemplateMetaData: '[rx-view-component-id="c9f48c1b-75e2-411c-929c-76bdce069a3d"] button',
        assigneeNameValue: '[rx-view-component-id="e916c10e-a726-425c-9d7f-a39e1f43f1e4"] .person-link',
        assigneeBusinessUnitValue: '[rx-view-component-id="e916c10e-a726-425c-9d7f-a39e1f43f1e4"] .read-only-content',
        assigneeDepartmentValue: '[rx-view-component-id="1a3d3085-da94-4981-986c-18be12795e3d"] .read-only-content',
        categoryTier1: '[rx-view-component-id="ad1a72f6-a588-428f-a99e-6a2e8baf12ff"] .read-only-content',
        categoryTier2: '[rx-view-component-id="c80b1e58-3854-45bd-9553-5c6e0bb334d8"] .read-only-content',
        categoryTier3: '[rx-view-component-id="a0243fb4-35cd-457b-a517-210a5e3e330d"] .read-only-content',
        oneTask: '[rx-view-component-id="36ca22f7-98f8-423a-bf39-28361ef29eeb"] .rotatable path',
        taskBoxname: 'div.content',
        showMoreDescriptionLink: '.bwf-expand button.btn',
        taskFlowButton: '[rx-view-component-id="3b142f9f-078c-4a9f-9215-0cc3ec054244"] button',
        backArrowButton: '[rx-view-component-id="8abb8018-cca7-49a2-b610-023c2bae63cc"] button',
        taskBoxLocator: '.rotatable',
        zoomInBtn: '.btn-zoom-in',
        zoomOutBtn: '.btn-zoom-out',
        taskFlowSectionSizeLocator: '.paper-scroller-background',
        tab: 'button[role="tab"]',
        copyCaseTemplate: '[rx-view-component-id="0bb1dd3b-639f-4019-adbd-96faae6920ef"] button',
        lobValue: '[rx-view-component-id="5f849d62-a10d-4637-9d10-f4d33364d22b"] div.read-only-content',
        caseStatusValue: '[rx-view-component-id="5289a531-7138-4e4f-afdc-ee3f67a2aa64"] .read-only-content',
    }

    async selectTab(tabValue: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.tab, tabValue)).click()
    }

    async clickCopycaseTemplate(): Promise<void> {
        await $(this.selectors.copyCaseTemplate).click();
    }

    async clickShowMoreDescriptionLink(): Promise<void> {
        await $(this.selectors.showMoreDescriptionLink).click();
    }

    async clickEditTemplateMetaData(): Promise<void> {
        await $(this.selectors.editTemplateMetaData).click();
    }

    async getCaseStatusValue(): Promise<string> {
        return await $(this.selectors.caseStatusValue).getText();
    }

    async getIdentityValdationValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.identityValidationValue)));
        return await $(this.selectors.identityValidationValue).getText();
    }

    async getOwnerGroupValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerGroup)));
        return await $(this.selectors.ownerGroup).getText();
    }

    async getOwnerCompanyValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.ownerCompany).getText();
    }

    async getBuisnessUnitValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.buisnessUnitvalue).getText();
    }

    async getLabelValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.labelvalue).getText();
    }

    async getDepartmentValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.departmentValue).getText();
    }

    async getPriorityValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.ownerCompany)));
        return await $(this.selectors.priority).getText();
    }

    async getTemplateStatusValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateStatus)));
        return await $(this.selectors.templateStatus).getText();
    }

    async getCaseTemplateId(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.caseTemplateId)));
        return await $(this.selectors.caseTemplateId).getText();
    }

    async getCaseTemplateNameValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.templateName)));
        return await $(this.selectors.templateName).getText();
    }

    async getResolveCaseOnLastTaskCompletionValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.resolveCaseOnLastTaskCompletion)));
        return await $(this.selectors.resolveCaseOnLastTaskCompletion).getText();
    }

    async getCaseCompanyValue(): Promise<string> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.CaseCompanyvalue)));
        return await $(this.selectors.CaseCompanyvalue).getText();
    }

    async getFlowsetValue(): Promise<string> {
        return await $(this.selectors.flowsetValue).getText();
    }

    async clickOnEditCaseTemplateButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editButton)));
        return await $(this.selectors.editButton).click();
    }

    async getCategoryTier4(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.categoryTier4)));
        return await $(this.selectors.categoryTier4).getText();
    }

    async clickOnMangeDynamicFieldLink(): Promise<void> {
        await $(this.selectors.manageDynamicField).click();
    }

    async isDynamicFieldDisplayed(value: string): Promise<boolean> {
       return await $(`[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] span[title="${value}"]`).isPresent().then(async (result) => {
            if (result) {
                await utilityCommon.scrollToElement(await $(`[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] span[title="${value}"]`));
                return await $(`[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] span[title="${value}"]`).isDisplayed();
            } else {
                console.log("Managelink not present");
                return false;
            }
        });
    }

    async isGroupDisplayed(groupName: string): Promise<boolean> {
        return await $(`[rx-view-component-id="ba0546ff-0bf1-4678-8312-630242b43e3c"] .group-container__name div[title=${groupName}]`).isDisplayed();
    }

    async getAssigneeText(): Promise<string> {
        return await $(this.selectors.assigneeNameValue).getText();
    }

    async getAssigneeBusinessUnitValue(): Promise<string> {
        return await $(this.selectors.assigneeBusinessUnitValue).getText();
    }

    async getAssigneeDepartmentValue(): Promise<string> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.ownerCompanyValue)));
        return await $(this.selectors.assigneeDepartmentValue).getText();
    }

    async getCategoryTier1(): Promise<string> {
        return await $(this.selectors.categoryTier1).getText();
    }

    async getCategoryTier2(): Promise<string> {
        return await $(this.selectors.categoryTier2).getText();
    }

    async getCategoryTier3(): Promise<string> {
        return await $(this.selectors.categoryTier3).getText();
    }

    async isManageDynamicFieldLinkDisplayed(): Promise<boolean> {
        return await $(this.selectors.manageDynamicField).isPresent().then(async (result) => {
            if (result) {
                return await $(this.selectors.manageDynamicField).isDisplayed();
            } else {
                console.log("Managelink not present");
                return false;
            }
        });
    }

    async clickOnTaskBox(taskName: string): Promise<void> {
        await browser.wait(this.EC.or(async () => {
            let count = await $$(this.selectors.taskBoxLocator).count();
            return count >= 1;
        }), 5000);
        const taskBoxesCount = await $$(this.selectors.taskBoxLocator).count();
        for (let i: number = 0; i < taskBoxesCount; i++) {
            let taskBoxText: string = await $$(this.selectors.taskBoxLocator).get(i).$(this.selectors.taskBoxname).isPresent().then(async (present) => {
                if (present) return await $$(this.selectors.taskBoxLocator).get(i).$(this.selectors.taskBoxname).getText();
            });
            if (taskBoxText == taskName) {
                await $$(this.selectors.taskBoxLocator).get(i).$('path').click();
                break;
            }
        }
    }

    async clickTaskFlowBtn(): Promise<void> {
        await $(this.selectors.taskFlowButton).click();
        await browser.wait(this.EC.visibilityOf(await $('rx-runtime-view-modal')), 10000);
    }

    async clickBackArrowBtn(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(await $(this.selectors.backArrowButton)),5000);
        let backArrow = await $$(this.selectors.backArrowButton).count();
        for (let i = 0; i < backArrow; i++) {
            await $$(this.selectors.backArrowButton).last().click();
        }
    }

    async isTaskFlowBtnEnabled(): Promise<boolean> {
        return await $(this.selectors.taskFlowButton).getAttribute("disabled") ? false : true;
    }

    async isTaskFlowPresentInTaskSection(): Promise<boolean> {
        return await $(this.selectors.taskBoxLocator).isPresent().then(async (result) => {
            if (result) return await $(this.selectors.taskBoxLocator).isDisplayed();
            else return false;
        })
    }

    async getTotalTaskBlocks(): Promise<number> {
        return (await $$(this.selectors.taskBoxLocator)).length;
    }

    async zoomInTaskFlowSection(totalHits: number): Promise<void> {
        for (let i: number = 0; i < totalHits; i++) {
            await $(this.selectors.zoomInBtn).click();
        }
    }

    async zoomOutTaskFlowSection(totalHits: number): Promise<void> {
        for (let i: number = 0; i < totalHits; i++) {
            await $(this.selectors.zoomOutBtn).click();
        }
    }

    async getHeightAndWidth(): Promise<sizeAttribute> {
        let styleAttributeValue = await $(this.selectors.taskFlowSectionSizeLocator).getAttribute('style');
        let heightAtt = ((styleAttributeValue.split(':'))[2].split('px'))[0].trim();
        let widthAtt = ((styleAttributeValue.split(':'))[1].split('px'))[0].trim();
        return {
            height: heightAtt,
            width: widthAtt
        };
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new ViewCaseTemplate();