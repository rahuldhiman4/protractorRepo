import { $, $$, by, element, browser, protractor, ProtractorExpectedConditions } from "protractor";
import resources from '../../pageobject/common/resources-tab.po';

class ViewKnowledgePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        statusChange: '[rx-view-component-id="dc403f44-1bde-406f-a3bf-00128644a011"] span',
        editLinkKnowledgeMetadata: '[rx-view-component-id="56cc9627-6ef9-46f8-9b76-728349193ed2"] .btn-link',
        editLinkOnKA: '[rx-view-component-id="ee521675-2407-4b2a-9470-013bfb328b30"] .edit-button button',
        unflagButton: '[rx-view-component-id="b54365bf-0ead-4c54-8c8b-42aced61690e"] button',
        falgButton: '[rx-view-component-id="89dd2264-1895-4a7b-a0a4-01a4834a403b"] button',
        assigneeName: '[rx-view-component-id="5365589a-13ad-41f0-8831-b20175beb761"] .read-only-content',
        kAUsefulYesButton: '[rx-view-component-id="9d4c48c9-fbd8-4e91-bc61-0e395f52bbe7"] button',
        kAUsefulNoButton: '[rx-view-component-id="21f93bfd-53e2-4983-9b15-162e7dd12a31"] button',
        percentageValue: '[rx-view-component-id="5cc2757f-7a22-4827-82c0-1e7dee2e12a2"] p',
        activityTab: '.nav-link[role="tab"]',
        statusChnageBlade: '.modal-content',
        reviewPending: '[rx-view-component-id="f0cf7f67-da22-4149-a54d-ec3b95fe05e6"] button',
        KnwoledgeArticleReviewMessage: '[rx-view-component-id="d2dbea0a-503e-47d8-b4ed-b6dcc9dcf555"] span',
        regionValue: '[rx-view-component-id="d5c6cfef-2d53-48df-a03a-1a3e8381eef5"] .read-only-content',
        siteValue: '[rx-view-component-id="aa218b2b-4fa3-4525-82f3-3e0f9bfc4193"] .read-only-content',
        siteValueAfterClear: '[rx-view-component-id="ff94cecf-1b32-46c2-a207-cd3e426d52f7"] .read-only-content',
        articleVersion: '[rx-view-component-id="c64b0ab4-1774-4687-a7d2-56a72eeb1c1b"] button',
        articleVersionDropDown: '[rx-view-component-id="c64b0ab4-1774-4687-a7d2-56a72eeb1c1b"] .dropdown-item',
        knowledgeSetValue: '[rx-view-component-id="091876ce-ba14-4461-82da-a929cff39fb5"] .read-only-content',
        knowledgeCompanyValue: '[rx-view-component-id="a034803f-aa70-4c4e-94ba-d847e4e50d2f"] .read-only-content',
        knowledgeAuthorValue: '[rx-view-component-id="e4e8e3e2-d792-452d-bbfe-4393d7650541"] .read-only-content',
        assigneeGroupValue: '[rx-view-component-id="51f0da81-fea9-4566-9eb0-0c706c60a445"] .read-only-content',
        categoryTier1Value: '[rx-view-component-id="2e629e99-f2fa-48a2-910b-0652a6bf032f"] .read-only-content',
        categoryTier2Value: '[rx-view-component-id="7e8a318c-2948-4b54-a8b6-049146bdf6c9"] .read-only-content',
        categoryTier3Value: '[rx-view-component-id="f2703b24-f357-46f7-83bc-e216f6d33cb0"] .read-only-content',
        categoryTier4Value: '[rx-view-component-id="863425e3-0e4e-4e83-a05d-86f57f919248"] .read-only-content',
        articleLocalValue: '[rx-view-component-id="ff9f0fe2-c714-4c6f-96ea-5c22ef78198d"] .read-only-content',
        articleAttachments: '.rx-attachment-view-name', // need to check
        articlePermissionGroups: '[rx-view-component-id="eeb63a7a-9687-4527-95ca-92af413dcc9d"] .bfw-badge',
        articlePermissionUsers: '[rx-view-component-id="eeb63a7a-9687-4527-95ca-92af413dcc9d"] [class="ng-tns-c48-196 ng-star-inserted"] .bfw-badge',
        articlePermissionWriteAccess: '[rx-view-component-id="eeb63a7a-9687-4527-95ca-92af413dcc9d"] .d-icon-pencil',
        articlePermissionReadAccess: '[rx-view-component-id="eeb63a7a-9687-4527-95ca-92af413dcc9d"] .d-icon-eye',
        articleViewCounter: '[rx-view-component-id="407ae5ae-c7a2-4a3c-87b3-f4e26837b2fb"] p',
        articleHelpfulCounter: '[rx-view-component-id="5cc2757f-7a22-4827-82c0-1e7dee2e12a2"] p',
        articleKeywords: '[rx-view-component-id="51e52d59-3acd-49b3-8291-e10558985fa1"] div.tagsReadMode p',
        articleReviewer: '[rx-view-component-id="387dfda7-4f77-4df0-9ac0-6f4fb83b6fe7"] .read-only-content',
        articleReviewerGroup: '[rx-view-component-id="0b622151-c917-4d1c-97e4-3a9b7f082e2d"] .read-only-content',
        articleLastReviewDate: '[rx-view-component-id="bccc3ffb-8be9-4332-8f7f-fef96b43c3b9"] .read-only-content',
        articleNextReviewDate: '[rx-view-component-id="7529ddbb-6ef2-46ab-9f66-c85639c3b490"] .read-only-content',
        articleTitle: '[rx-view-component-id="4a5abb06-d6fb-4aa3-81a8-2d5e80c78acf"] p',
        articleDescription: '[rx-view-component-id="52856b97-e17e-444d-a556-fa0ad35eb3c8"] .doc-editor__section-content p',
        articleIsExternal: '[rx-view-component-id="660f2cd8-9439-4954-9638-0064fbcb0e28"] .read-only-content',
        flaggedOption: '[rx-view-component-id="89dd2264-1895-4a7b-a0a4-01a4834a403b"]',
        unflagOption: '[rx-view-component-id="b54365bf-0ead-4c54-8c8b-42aced61690e"] span',
        editKnowledgeAccess: '[rx-view-component-id="cbdd812c-4899-4503-84ab-412020d820df"] button',
        tab: 'button[role="tab"] span.nav-link-wrapper',
        attachmentName: 'bwf-attachment-viewer .bwf-attachment-container__file-name',
        expandAllAttachment: '.bwf-attachment-viewer .d-icon-plus',
        approvalButtons: '.approval-buttons span',
        approveButton: '.d-icon-left-check_shield',
        rejectButton: '.d-icon-left-cross_circle',
    }

    async clickOnKAUsefulYesButton(): Promise<void> {
        await $(this.selectors.kAUsefulYesButton).click();
    }

    async getRegionValue(): Promise<string> {
        return await $(this.selectors.regionValue).getText();
    }

    async getSiteValue(): Promise<string> {
        return await $(this.selectors.siteValue).getText();
    }

    async getSiteValueAfterClear(): Promise<string> {
        return await $(this.selectors.siteValueAfterClear).getText();
    }
    
    async isKAUsefulYesButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.kAUsefulYesButton).isDisplayed();
    }

    async clickOnKAUsefulNoButton(): Promise<void> {
        await $(this.selectors.kAUsefulNoButton).click();
    }

    async isReviewMessageDisplayed(value: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.KnwoledgeArticleReviewMessage, value)).isPresent();
    }

    async getStatusValue(): Promise<string> {
        //        await utilCommon.closePopUpMessage();
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.statusChange)));
        return await $(this.selectors.statusChange).getText();
    }

    async clickEditKnowledgeMedataData(): Promise<void> {
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.editLinkKnowledgeMetadata)));
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkKnowledgeMetadata)));
        await $(this.selectors.editLinkKnowledgeMetadata).click();
    }

    async isStatusChangeBladePresent(): Promise<boolean> {
        await $(this.selectors.statusChange).click();
        return await $(this.selectors.statusChnageBlade).isPresent();
    }

    async getAssigneeValue(): Promise<string> {
        return await $(this.selectors.assigneeName).getText();
    }

    async clickOnEditLink(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.editLinkOnKA)));
        await $(this.selectors.editLinkOnKA).click();
    }

    async isEditLinkDisplayedOnKA(): Promise<boolean> {
        return await $(this.selectors.editLinkOnKA).isPresent().then(async (link) => {
            if (link) return await $(this.selectors.editLinkOnKA).isDisplayed();
            else return false;
        });
    }




    async clickOnUnFlagButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.unflagButton)));
        await $(this.selectors.unflagButton).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.flagBlade)));
    }

    async clickOnFlagButton(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.falgButton)));
        await $(this.selectors.falgButton).click();
        //        await browser.wait(this.EC.visibilityOf($(this.selectors.flagBlade)));
    }


    async isUnFlagButtonDisplayed(): Promise<boolean> {
        return await $(this.selectors.unflagButton).isDisplayed();
    }

    async clickOnActivityTab(): Promise<void> {
        //        await browser.wait(this.EC.elementToBeClickable($$(this.selectors.activityTab).last()));
        await $$(this.selectors.activityTab).last().click();
    }

    async clickOnInformationTab(): Promise<void> {
        await $$(this.selectors.activityTab).first().click();
    }

    async clickOnTab(tabName: string): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText(this.selectors.tab, tabName))), 7000);
        await element(by.cssContainingText(this.selectors.tab, tabName)).click();
    }

    async getPercentageValue(): Promise<string> {
        return await $(this.selectors.percentageValue).getText();
    }

    async clickReviewPendingLink(): Promise<void> {
        await $(this.selectors.reviewPending).click();
    }

    async isArticleVersionDisplayed(): Promise<boolean> {
        //    await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleVersion)));
        return await $(this.selectors.articleVersion).isPresent();
    }

    async getArticleVersion(): Promise<string> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleVersion)), 3000);
        return await $(this.selectors.articleVersion).getText();
    }

    async getAllArticleVersionsFromVersionDropDown(): Promise<string[]> {
        let articleVersionsArr: string[] = [];
        await $(this.selectors.articleVersion).click();
        let articleVersionValues: number = await $$(this.selectors.articleVersionDropDown).count();
        for (let i = 0; i < articleVersionValues; i++) {
            let articleVersion: string = await $$(this.selectors.articleVersionDropDown).get(i).getText();
            articleVersionsArr[i] = articleVersion;
            console.log("Knowledge Article Versions are :" + articleVersion);
        }
        return articleVersionsArr;
    }

    async selectArticleVersion(versionNum: string): Promise<void> {
        await $(this.selectors.articleVersion).click();
        let articleVersionValues: number = await $$(this.selectors.articleVersionDropDown).count();
        for (let i = 0; i < articleVersionValues; i++) {
            let articleVersion: string = await $$(this.selectors.articleVersionDropDown).get(i).getText();
            if (articleVersion.includes(versionNum)) {
                await $$(this.selectors.articleVersionDropDown).get(i).click();
                break;
            }
            console.log("Selected Knowledge Article Version is :" + articleVersion);
        }
    }

    async formatDate() {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let objDate: Date = new Date();
        let numYear: number = objDate.getFullYear();
        let year: string = new Number(numYear).toString();
        let numMonth: number = objDate.getMonth();
        let month: string = new Number(numMonth).toString();
        let numDate: number = objDate.getDate();
        let date: string = new Number(numDate).toString();
        if (numDate > 0 && numDate < 10) {
            date = "0" + date;
        }
        let formatted_date: string = months[month] + " " + date + ", " + year;
        return formatted_date;
    }

    async getKnowledgeSet(): Promise<string> {
        return await $(this.selectors.knowledgeSetValue).getText();
    }
    async getKnowledgeArticleCompany(): Promise<string> {
        return await $(this.selectors.knowledgeCompanyValue).getText();
    }
    async getKnowledgeArticleAuthor(): Promise<string> {
        return await $(this.selectors.knowledgeAuthorValue).getText();
    }
    async getCategoryTier1Value(): Promise<string> {
        return await $(this.selectors.categoryTier1Value).getText();
    }
    async getCategoryTier2Value(): Promise<string> {
        return await $(this.selectors.categoryTier2Value).getText();
    }
    async getCategoryTier3Value(): Promise<string> {
        return await $(this.selectors.categoryTier3Value).getText();
    }
    async getCategoryTier4Value(): Promise<string> {
        return await $(this.selectors.categoryTier4Value).getText();
    }
    async getKnowledgeArticleAssigneeGroupValue(): Promise<string> {
        return await $(this.selectors.assigneeGroupValue).getText();
    }
    async getKnowledgeArticleLocalValue(): Promise<string> {
        return await $(this.selectors.articleLocalValue).getText();
    }

    async getKnowledgeArticleAccessPermissionGroupDetails(): Promise<string[]> {
        let accessPermissionArr: string[] = [];
        let accessPermissionValues: number = await $$(this.selectors.articlePermissionGroups).count();
        for (let i = 0; i < accessPermissionValues; i++) {
            let accessPermission: string = await $$(this.selectors.articlePermissionGroups).get(i).getText();
            accessPermissionArr[i] = accessPermission;
            console.log("Knowledge Access Permission are :" + accessPermission);
        }
        return accessPermissionArr;
    }

    async getKnowledgeArticleReadAccessPermissionDetails(): Promise<string[]> {
        let accessPermissionArr: string[] = [];
        let accessPermissionValues: number = await $$(this.selectors.articlePermissionGroups).count();
        for (let i = 0; i < accessPermissionValues; i++) {
            let readAccessPermission: string = await $$(this.selectors.articlePermissionGroups).get(i).getText();
            accessPermissionArr[i] = readAccessPermission;
            console.log("Knowledge Read Access Permission are :" + readAccessPermission);
        }
        return accessPermissionArr;
    }

    async getKnowledgeArticleWriteAccessPermissionDetails(): Promise<string[]> {
        let accessPermissionArr: string[] = [];
        let accessPermissionValues: number = await $$(this.selectors.articlePermissionWriteAccess).count();
        for (let i = 0; i < accessPermissionValues; i++) {
            let writeAccessPermission: string = await $$(this.selectors.articlePermissionWriteAccess).get(i).getText();
            accessPermissionArr[i] = writeAccessPermission;
            console.log("Knowledge Write Access Permission are :" + writeAccessPermission);
        }
        return accessPermissionArr;
    }

    async getKnowledgeArticleAttachments(): Promise<string[]> {
        let articleAttachmentsArr: string[] = [];
        let articleAttachmentValues: number = await $$(this.selectors.articleAttachments).count();
        for (let i = 0; i < articleAttachmentValues; i++) {
            let articleAttachment: string = await $$(this.selectors.articleAttachments).get(i).getText();
            articleAttachmentsArr[i] = articleAttachment;
            console.log("Knowledge Article attachments are :" + articleAttachment);
        }
        return articleAttachmentsArr;
    }

    async getArticleViewCounter(): Promise<string> {
        return await $(this.selectors.articleViewCounter).getText();
    }

    async getArticleHelpfulCounter(): Promise<string> {
        return await $(this.selectors.articleHelpfulCounter).getText();
    }

    async getKnowledgeArticleKeywords(): Promise<string[]> {
        let articleKeywordsArr: string[] = [];
        let articleKeywordValues: number = await $$(this.selectors.articleKeywords).count();
        for (let i = 0; i < articleKeywordValues; i++) {
            let articleKeyword: string = await $$(this.selectors.articleKeywords).get(i).getText();
            articleKeywordsArr[i] = articleKeyword;
            console.log("Knowledge Article Keywords are :" + articleKeyword);
        }
        return articleKeywordsArr;
    }

    async getArticleReviewerUser(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleReviewer)));
        return await $(this.selectors.articleReviewer).getText();
    }
    async getArticleReviewerGroup(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleReviewerGroup)));
        return await $(this.selectors.articleReviewerGroup).getText();
    }
    async getArticleLastReviewDate(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleLastReviewDate)));
        return await $(this.selectors.articleLastReviewDate).getText();
    }
    async getArticleNextReviewDate(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleNextReviewDate)));
        return await $(this.selectors.articleNextReviewDate).getText();
    }

    async isArticleReviewerUserDisplayed(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleReviewer)));
        await $(this.selectors.articleReviewer).isDisplayed();
    }
    async isArticleReviewerGroupDisplayed(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleReviewerGroup)));
        await $(this.selectors.articleReviewerGroup).isDisplayed();
    }
    async isArticleLastReviewDateDisplayed(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleLastReviewDate)));
        await $(this.selectors.articleLastReviewDate).isDisplayed();
    }
    async isArticleNextReviewDateDisplayed(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleNextReviewDate)));
        await $(this.selectors.articleNextReviewDate).isDisplayed();
    }

    async getKnowledgeArticleTitle(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleTitle)));
        return await $(this.selectors.articleTitle).getText();
    }
    async getKnowledgeArticleDescription(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleDescription)));
        return await $(this.selectors.articleDescription).getText();
    }

    async getKnowledgeArticleAccessPermissionUsersDetails(): Promise<string[]> {
        let accessPermissionArr: string[] = [];
        let accessPermissionValues: number = await $$(this.selectors.articlePermissionUsers).count();
        for (let i = 0; i < accessPermissionValues; i++) {
            let accessPermission: string = await $$(this.selectors.articlePermissionUsers).get(i).getText();
            accessPermissionArr[i] = accessPermission;
            console.log("Knowledge Access Permission Users are :" + accessPermission);
        }
        return accessPermissionArr;
    }

    async getArticleIsExternalValue(): Promise<string> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleIsExternal)));
        return await $(this.selectors.articleIsExternal).getText();
    }

    async isArticleIsExternalValueDisplayed(): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleIsExternal)));
        return await $(this.selectors.articleIsExternal).isDisplayed();
    }

    async isFlagArticleOptionDisplayed(): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleIsExternal)));
        return await $(this.selectors.flaggedOption).isDisplayed();
    }

    async isUnFlagArticleOptionDisplayed(): Promise<boolean> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.articleIsExternal)));
        return await $(this.selectors.unflagOption).isDisplayed();
    }

    async clickEditKnowledgeAccess(): Promise<void> {
        // await browser.wait(this.EC.elementToBeClickable($(this.selectors.editKnowledgeAccess)));
        await $(this.selectors.editKnowledgeAccess).click();
    }

    async isAttachedFileNamePresent(fileName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.attachmentName, fileName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.attachmentName, fileName)).isDisplayed();
            else return false;
        });
    }

    async clickShowMoreButton(): Promise<void> {
        await $(this.selectors.expandAllAttachment).click();
    }

    async getAttachmentCountFromKA(): Promise<number> {
        return await $$(this.selectors.attachmentName).count();
    }

    async clickOnAttachment(attachmentName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentName, attachmentName)).click();
    }

    async isImageDisplayedOnDescription(value: string): Promise<boolean> {
        let locator = `.doc-editor__section-content img[src='${value}']`;
        let imageIsDisplayed: boolean = await $(locator).isDisplayed();
        return imageIsDisplayed;
    }

    async clickOnAttachments(attachmentName: string): Promise<void> {
        await element(by.cssContainingText(this.selectors.attachmentName, attachmentName)).click();
    }
    
    async isApprovalButtonsPresent(buttonText: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.approvalButtons, buttonText)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.approvalButtons, buttonText)).isDisplayed();
            else return false;
        });
    }

    async clickOnApproveLink(): Promise<void> {
        await $(this.selectors.approveButton).click();
    }

    async clickOnRejectLink(): Promise<void> {
        await $(this.selectors.rejectButton).click();
    }
}

export default new ViewKnowledgePage();
