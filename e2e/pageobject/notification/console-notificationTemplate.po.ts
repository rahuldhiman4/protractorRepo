import { ProtractorExpectedConditions, protractor, browser, element, by, $, $$ } from "protractor"

class NotificationTemplateGridPage{
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    
    selectors = {
        copyTemplate: '.d-icon-left-pencil',
        searchButton: '.d-icon-search',
        selectTemplateCheckBox: '.ui-grid-icon-ok',
        copyTemplateWindow: '.modal-title',
        companyDropDownCopyTempWindow: ".modal-content [title='Company']",
        companyDropDownValueCopyTempWindow: ".modal-content .ui-select-choices-row-inner *",
        clearCompanyDropDownCopyTempWindow:  ".modal-content [class*=glyphicon-remove]",
        tempNameCopyTempWindow: ".modal-content [class*='d-textfield__input field']",
        saveButton: "[rx-view-component-id='50e25982-5452-4f20-ac79-5682de7cb467'] button",
        searchBox: "[rx-view-component-id='7d5c5beb-d652-4bf9-9fc7-ccc7100d3b77'] [rx-id='search-text-input']"
    }

    async isCopyTemplateButtonDisabled(): Promise<boolean>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.copyTemplate)));
        return await $(this.selectors.copyTemplate).getAttribute("disabled")=="true";
    }

    async searchTemplate(tempName: string){
        await browser.wait(this.EC.visibilityOf($(this.selectors.searchBox)));
        await $(this.selectors.searchBox).clear();
        await $(this.selectors.searchBox).sendKeys(tempName);
        await $(this.selectors.searchButton).click();
        await browser.sleep(1000);
    }

    async selectTemplate(){
        await browser.wait(this.EC.visibilityOf($$(this.selectors.selectTemplateCheckBox).first()));
        await $$(this.selectors.selectTemplateCheckBox).first().click();
    }

    async clickAndOpenTemplate(tempName:string){
        await browser.wait(this.EC.elementToBeClickable(element(by.cssContainingText("a[class='ui-grid__link']",tempName))));
        await element(by.cssContainingText("a[class='ui-grid__link']",tempName)).click();
    }

    async clickCopyTmplate(){
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.copyTemplate)));
        await $(this.selectors.copyTemplate).click();
    }

    async getTitleCopyNotificationTemplateWindow(): Promise<String>{
        await browser.wait(this.EC.visibilityOf($(this.selectors.copyTemplateWindow)));
        return $(this.selectors.copyTemplateWindow).getText();
    }

    async isCompanyDropDownPresentInCopyTempWindow():Promise<Boolean>{
        return await $(this.selectors.companyDropDownCopyTempWindow).isDisplayed();
    }

    async setCompanyDropDownValPresentInCopyTempWindow(company:string){
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.companyDropDownCopyTempWindow)));
        await $(this.selectors.companyDropDownCopyTempWindow).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.companyDropDownCopyTempWindow).$('input')));
        await $(this.selectors.companyDropDownCopyTempWindow).$('input').sendKeys(company);
        await browser.wait(this.EC.visibilityOf($$(this.selectors.companyDropDownValueCopyTempWindow).first()));
        await $$(this.selectors.companyDropDownValueCopyTempWindow).first().click();
    }

    async clearCompanyDropDownValPresentInCopyTempWindow(){
        await browser.wait(this.EC.visibilityOf($(this.selectors.clearCompanyDropDownCopyTempWindow)));
        await $(this.selectors.clearCompanyDropDownCopyTempWindow).click();
    }

    async isTemplateNameTxtBoxPresentInCopyTempWindow():Promise<Boolean>{
        return await $(this.selectors.tempNameCopyTempWindow).isDisplayed();
    }

    async setTemplateNamePresentInCopyTempWindow(tempName:string){
        await browser.wait(this.EC.visibilityOf($(this.selectors.tempNameCopyTempWindow)));
        await $(this.selectors.tempNameCopyTempWindow).clear();
        await $(this.selectors.tempNameCopyTempWindow).sendKeys(tempName);
    }

    async isCopyTemplateButtonDisabledInCopyTempWindow():Promise<Boolean>{
        return await element(by.buttonText('Create Copy')).getAttribute("disabled")=="true";
    }

    async clickCopyTemplateButtonInCopyTempWindow(){
        await browser.wait(this.EC.visibilityOf(element(by.buttonText('Create Copy'))));
        element(by.buttonText('Create Copy')).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

}

export default new NotificationTemplateGridPage();