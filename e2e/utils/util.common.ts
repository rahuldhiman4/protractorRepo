        import { browser, until, ExpectedConditions, element, by, $,$$, ProtractorExpectedConditions, protractor } from 'protractor';
        
        export class Util{
            EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
            selectors= {
                dropdownBox: '.ui-select-match',
                valueSearch: ' input[type="search"]',
                dropDownOption: '.ui-select__rx-choice',
                popUpMsgLocator: '.rx-growl-item__message',
                warningOk: '.d-modal__footer button[class*="d-button d-button_primary d-button_small"]',
                warningCancel: '.d-modal__footer button[class*="d-button d-button_secondary d-button_small"]',       
            }
            
            async selectDropDown(guid:string, value:string){        
                const dropDown =await $(`[rx-view-component-id="${guid}"]`);
                await browser.wait(this.EC.elementToBeClickable(dropDown.$(this.selectors.dropdownBox)));
                await dropDown.$(this.selectors.dropdownBox).click();
                await browser.wait(this.EC.elementToBeClickable(dropDown.$(this.selectors.valueSearch)));
                await dropDown.$(this.selectors.valueSearch).sendKeys(value);
                await browser.wait(this.EC.or(async ()=>{
                    let count = await $$(this.selectors.dropDownOption).count();
                    return count >= 1;
                }));
                 var option = element(by.cssContainingText(this.selectors.dropDownOption, value));
                 await browser.wait(this.EC.elementToBeClickable(option));
                 await option.click(); 
            }
            
            async waitUntilPopUpDisappear() {
                await browser.wait(this.EC.invisibilityOf($(this.selectors.popUpMsgLocator)));
            }

            async clickOnWarningOk(): Promise<void> {
                await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningOk)));
                await $(this.selectors.warningOk).click();
            }
           
            async clickOnWarningCancel(): Promise<void> {
                await browser.wait(this.EC.elementToBeClickable($(this.selectors.warningCancel)));
                await $(this.selectors.warningCancel).click();
            }
            async selectToggleButton(guid:string,value:boolean): Promise<void> {
                const togglebutton = $(`[rx-view-component-id="${guid}"]`);
                if(value){
                    let element=togglebutton.$('.d-icon-check')
                    let isclicked=await element.getAttribute('aria-pressed');
                    if(isclicked=='false'){
                        await element.click();
                    }
                }
                else{
                    let element=togglebutton.$('.d-icon-circle_slash_o')
                    let isclicked=await element.getAttribute('aria-pressed');
                    if(isclicked=='false'){
                        await element.click();
                    }
                }
             }
        
        }
        
        export default new Util();
