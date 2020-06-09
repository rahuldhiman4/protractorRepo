import { $, $$, browser, by, element, Key, protractor, ProtractorExpectedConditions, ElementFinder } from "protractor";

class ChangeAssignmentOldBlade {
	EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
	selectors = {
		changeAssignmentButton: '[rx-view-component-id="6041cce1-05bd-458d-b097-eb310507cae3"] button',
		assignButton: '.rx-assignment-modal-footer button.d-button_primary',
		assignmentDropDownList: '.rx-assignment_modal_filters .rx-assignment-select',
		selectOptions: '.options-box .options li',
		cancelButton: '.rx-assignment-modal-footer button.d-button_secondary',
		multipleSuppGrpMsg: '.manual-select-sg-msg',
		assignToMeCheckBox: '.rx-assignment_assignToMe span',
		searchAsignee: '.d-icon-search input',
		assignee: '.rx-assignment-person-fullName',
		company: 'selectedOrganizationId',
		businessUnit: 'selectedBusinessUnitId',
		supportGroupName: '.rx-assignment-person-info',
		department: 'selectedDepartmentId',
		supportGroup: 'selectedSupportGroupId',
		search: '.d-icon-search input'
	}

	async isAssignToMeCheckBoxSelected(): Promise<boolean> {
		//        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
		return await $(this.selectors.assignToMeCheckBox).isSelected();
	}

	async getCompanyDefaultValue(): Promise<string> {
		//        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
		return await element(by.model(this.selectors.company)).getText();
	}

	async getSupportGroupDefaultValue(): Promise<string> {
		//        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
		return await element(by.model(this.selectors.supportGroup)).getText();
	}

	async isSearchInputBoxPresent(): Promise<boolean> {
		//        await browser.wait(this.EC.visibilityOf($(this.selectors.assignToMeCheckBox)));
		return await $(this.selectors.search).isDisplayed();
	}

	async isCompanyDrpDwnDisplayed(): Promise<boolean> {
		//        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.company))));
		return await element(by.model(this.selectors.company)).isDisplayed();
	}

	async isBuisnessUnitDrpDwnDisplayed(): Promise<boolean> {
		//       await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.businessUnit))));
		return await element(by.model(this.selectors.businessUnit)).isDisplayed();
	}

	async isDepartmentDrpDwnDisplayed(): Promise<boolean> {
		//        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.department))));
		return await element(by.model(this.selectors.department)).isDisplayed();
	}

	async isSupportGroupDrpDwnDisplayed(): Promise<boolean> {
		//        await browser.wait(this.EC.visibilityOf(element(by.model(this.selectors.supportGroup))));
		return await element(by.model(this.selectors.supportGroup)).isDisplayed();
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
		await this.selectDropdownWithName('Business Unit', businessUnit);
	}

	async selectDepartment(department: string): Promise<void> {
		await this.selectDropdownWithName('Department', department);
	}

	async selectSupportGroup(supportGroup: string): Promise<void> {
		await this.selectDropdownWithName('Support Group', supportGroup);
	}

	async selectAssignee(name: string): Promise<void> {
		//        await browser.wait(this.EC.visibilityOf($(this.selectors.searchAsignee)));
		await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
		//        await browser.wait(this.EC.or(async () => {
		//            let count = await $$(this.selectors.assignee).count();
		//            return count >= 2;
		//        }));
		await element(by.cssContainingText(this.selectors.assignee, name)).click();
		//        await browser.wait(this.EC.elementToBeClickable(option)).then(async function () {
		//        });
	}

	async setAssignee(company: string, bu: string, group: string, assignee: string): Promise<void> {
		await this.selectCompany(company);
		await this.selectBusinessUnit(bu)
		await this.selectSupportGroup(group);
		await this.selectAssignee(assignee);
		await this.clickOnAssignButton();
	}

	async selectDropdownWithName(dropDownName: string, option: string): Promise<void> {
		await browser.wait(this.EC.or(async () => {
			let count = await $$('.rx-assignment-select').count();
			return count >= 1;
		}), 3000);
		const dropDown: ElementFinder[] = await $$('.rx-assignment-select');
		for (let i: number = 0; i < dropDown.length; i++) {
			await dropDown[i].$('.rx-assignment-select-label').isPresent().then(async (result) => {
				if (result) {
					let dropDownLabelText: string = await dropDown[i].$('.rx-assignment-select-label').getText();
					if (dropDownLabelText === dropDownName) {
						await dropDown[i].$('.d-icon-angle_down').click();
						await dropDown[i].$('input').sendKeys(option);
						await element(by.cssContainingText("li[ng-repeat*='option']", option)).isPresent().then(async () => {
							await browser.sleep(1000);
							await element(by.cssContainingText(".is-open li[ng-repeat*='option']", option)).click();
						});
					}
				}
			});
		}
	}
}

export default new ChangeAssignmentOldBlade();