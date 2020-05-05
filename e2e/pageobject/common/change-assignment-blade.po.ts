import { $, $$, by, element, Key, protractor, ProtractorExpectedConditions, browser } from "protractor";

class ChangeAssignmentBlade {
        EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
        selectors = {
                changeAssignmentButton: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
                assignButton: '.modal-footer .btn-primary',
                assignmentDropDownList: '.flex-wrap bwf-select-with-pagination',
                selectOptions: '.dropdown-item span',
                cancelButton: '.modal-footer .btn-secondary',
                multipleSuppGrpMsg: '.manual-select-sg-msg',
                assignToMeCheckBox: '.checkbox__input',
                searchAsignee: '[class="search-input"] .adapt-search-field-wrapper input',
                assignee: '.person__info .name',
                filterDropdowns: '.flex-wrap button.dropdown-toggle',
                businessUnit: 'selectedBusinessUnitId',
                supportGroupName: '.person__info',
                department: 'selectedDepartmentId',
                supportGroup: 'selectedSupportGroupId',
        }

        async isAssignToMeCheckBoxSelected(): Promise<boolean> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
                return await $(this.selectors.assignToMeCheckBox).isSelected();
        }

        async getCompanyDefaultValue(): Promise<string> {
                //        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
                return await $$(this.selectors.filterDropdowns).get(0).getText();
        }

        async getSupportGroupDefaultValue(): Promise<string> {
                //        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
                return await $$(this.selectors.filterDropdowns).get(3).getText();
        }

        async isSearchInputBoxPresent(): Promise<boolean> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
                return await $(this.selectors.searchAsignee).isDisplayed();
        }

        async isCompanyDrpDwnDisplayed(): Promise<boolean> {
                //        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
                return await $$(this.selectors.filterDropdowns).get(0).isDisplayed();
        }

        async isBuisnessUnitDrpDwnDisplayed(): Promise<boolean> {
                //       await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.businessUnit))));
                return await $$(this.selectors.filterDropdowns).get(1).isDisplayed();
        }

        async isDepartmentDrpDwnDisplayed(): Promise<boolean> {
                //        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.department))));
                return await $$(this.selectors.filterDropdowns).get(2).isDisplayed();
        }

        async isSupportGroupDrpDwnDisplayed(): Promise<boolean> {
                //        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.supportGroup))));
                return await $$(this.selectors.filterDropdowns).get(3).isDisplayed();
        }

        async isAssigneeListPresent(): Promise<boolean> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignee)));
                return await $(this.selectors.assignee).isDisplayed();
        }

        async getAssigneeName(): Promise<string> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignee)));
                return await $(this.selectors.assignee).getText();
        }

        async clickOnAssignButton(): Promise<void> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignButton)));
                //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignButton)));
                await $(this.selectors.assignButton).click();
                //        await browser.wait(this.EC.invisibilityOf($(this.selectors.assignToMeCheckBox)));
        }

        async getCountOfSupportGroup(): Promise<number> {
                return await $$(this.selectors.supportGroupName).count();
        }

        async clickOnSupportGroup(name: string): Promise<void> {
                await element(by.cssContainingText(this.selectors.supportGroupName, name)).click();
        }

        async getTextOfSupportGroup(name: string): Promise<string> {
                return await element(by.cssContainingText(this.selectors.supportGroupName, name)).getText();
        }

        async isAssignButtonDisabled(): Promise<Boolean> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.assignButton)));
                return await $(this.selectors.assignButton).getAttribute("disabled") == "true";
        }

        async clickOnAssignToMeCheckBox(): Promise<void> {
                //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.assignToMeCheckBox)));
                await $(this.selectors.assignToMeCheckBox).click();
        }

        async clickOnCancelButton(): Promise<void> {
                //        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
                await $(this.selectors.cancelButton).click();
        }

        async selectCompany(companyValue: string): Promise<void> {
                const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(0);
                //        await browser.wait(this.EC.elementToBeClickable(companyDropDown.$('button')));
                await companyDropDown.$('button').click();
                //        await browser.wait(this.EC.visibilityOf(companyDropDown.$('input')));
                await companyDropDown.$('input').sendKeys(companyValue);
                //        await browser.wait(this.EC.or(async () => {
                //            let count = await companyDropDown.$$(this.selectors.selectOptions).count();
                //            return count >= 1;
                //        }));
                let option = await element(by.cssContainingText(this.selectors.selectOptions, companyValue));
                //        await browser.wait(this.EC.elementToBeClickable(option));
                await option.click();
        }

        async selectBusinessUnit(businessUnit: string): Promise<void> {
                const businessUnitDropDown = await $$(this.selectors.assignmentDropDownList).get(1);
                //        await browser.wait(this.EC.elementToBeClickable(businessUnitDropDown.$('button')));
                await businessUnitDropDown.$('button').click();
                //        await browser.wait(this.EC.visibilityOf(businessUnitDropDown.$('input')));
                await businessUnitDropDown.$('input').sendKeys(businessUnit);
                //        await browser.wait(this.EC.or(async () => {
                //            let count = await businessUnitDropDown.$$(this.selectors.selectOptions).count();
                //            return count >= 1;
                //        }));
                let option = await element(by.cssContainingText(this.selectors.selectOptions, businessUnit));
                //        await browser.wait(this.EC.elementToBeClickable(option));
                await option.click();
        }

        async selectDepartment(department: string): Promise<void> {
                const departmentDropdown = await $$(this.selectors.assignmentDropDownList).get(2);
                //        await browser.wait(this.EC.elementToBeClickable(departmentDropdown.$('button')));
                await departmentDropdown.$('button').click();
                //        await browser.wait(this.EC.visibilityOf(departmentDropdown.$('input')));
                await departmentDropdown.$('input').sendKeys(department);
                //        await browser.wait(this.EC.or(async () => {
                //            let count = await departmentDropdown.$$(this.selectors.selectOptions).count();
                //            return count >= 1;
                //        }));
                let option = await element(by.cssContainingText(this.selectors.selectOptions, department));
                //        await browser.wait(this.EC.elementToBeClickable(option));
                await option.click();
        }

        async selectSupportGroup(supportGroup: string): Promise<void> {
                const supportGroupDropDown = await $$(this.selectors.assignmentDropDownList).get(3);
                //        await browser.wait(this.EC.elementToBeClickable(supportGroupDropDown.$('button')));
                await supportGroupDropDown.$('button').click();
                //        await browser.wait(this.EC.visibilityOf(supportGroupDropDown.$('input')));
                await supportGroupDropDown.$('input').sendKeys(supportGroup);
                //        await browser.wait(this.EC.or(async () => {
                //            let count = await supportGroupDropDown.$$(this.selectors.selectOptions).count();
                //            return count >= 1;
                //        }));
                let option = await element(by.cssContainingText(this.selectors.selectOptions, supportGroup));
                //        await browser.wait(this.EC.elementToBeClickable(option));
                await option.click();
        }

        async selectAssignee(name: string): Promise<void> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
                await $(this.selectors.searchAsignee).click();

                await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
                //        await browser.wait(this.EC.or(async () => {
                //            let count = await $$(this.selectors.assignee).count();
                //            return count >= 2;
                //        }));
                await element(by.cssContainingText(this.selectors.assignee, name)).click();
                //        await browser.wait(this.EC.elementToBeClickable(option)).then(async function () {
                //        });
        }

        async setAssignee(company: string, group: string, assignee: string): Promise<void> {
                await this.selectCompany(company);
                await this.selectSupportGroup(group);
                await this.selectAssignee(assignee);
                await this.clickOnAssignButton();
        }

        async setAssigneeGroup(group: string): Promise<void> {
                await this.selectSupportGroup(group);
                await $$(this.selectors.assignee).first().click();
                await this.clickOnAssignButton();
        }

        async selectAssigneeAsSupportGroup(name: string): Promise<void> {
                //        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
                //        await $(this.selectors.searchAsignee).sendKeys(name);
                browser.sleep(1000);
                await element(by.cssContainingText(this.selectors.assignee, "Assign to support group")).click();
                //        await browser.wait(this.EC.visibilityOf(option));
                //        await browser.wait(this.EC.elementToBeClickable(option));
        }
}

export default new ChangeAssignmentBlade();
