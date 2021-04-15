import { $, $$, browser, by, element, ElementFinder, Key, protractor, ProtractorExpectedConditions } from "protractor";

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
		return await $(this.selectors.assignToMeCheckBox).isSelected();
	}

	async getCompanyDefaultValue(): Promise<string> {
		return await element(by.model(this.selectors.company)).getText();
	}

	async getSupportGroupDefaultValue(): Promise<string> {
		return await element(by.model(this.selectors.supportGroup)).getText();
	}

	async isSearchInputBoxPresent(): Promise<boolean> {
		return await $(this.selectors.search).isDisplayed();
	}

	async isCompanyDrpDwnDisplayed(): Promise<boolean> {
		return await element(by.model(this.selectors.company)).isDisplayed();
	}

	async isBuisnessUnitDrpDwnDisplayed(): Promise<boolean> {
		return await element(by.model(this.selectors.businessUnit)).isDisplayed();
	}

	async isDepartmentDrpDwnDisplayed(): Promise<boolean> {
		return await element(by.model(this.selectors.department)).isDisplayed();
	}

	async isSupportGroupDrpDwnDisplayed(): Promise<boolean> {
		return await element(by.model(this.selectors.supportGroup)).isDisplayed();
	}

	async isAssigneeListPresent(): Promise<boolean> {
		return await $(this.selectors.assignee).isDisplayed();
	}

	async getAssigneeName(): Promise<string> {
		return await $(this.selectors.assignee).getText();
	}

	async clickOnAssignButton(): Promise<void> {
		await $(this.selectors.assignButton).click();
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
		return await $(this.selectors.assignButton).getAttribute("disabled") == "true";
	}

	async clickOnAssignToMeCheckBox(): Promise<void> {
		await $(this.selectors.assignToMeCheckBox).click();
	}

	async clickOnCancelButton(): Promise<void> {
		await $(this.selectors.cancelButton).click();
	}

	async selectCompany(companyValue: string): Promise<void> {
		const companyDropDown = await $$(this.selectors.assignmentDropDownList).get(0);
		await companyDropDown.$('button').click();
		await companyDropDown.$('input').sendKeys(companyValue);
		let option = await element(by.cssContainingText(this.selectors.selectOptions, companyValue));
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
		await $(this.selectors.searchAsignee).sendKeys(name + Key.ENTER);
		await element(by.cssContainingText(this.selectors.assignee, name)).click();
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
							await browser.sleep(1000); // Wait For Drop Down Values Are Loaded And Ready To Select Value.
							await element(by.cssContainingText(".is-open li[ng-repeat*='option']", option)).click();
						});
					}
				}
			});
		}
	}

	async isAllDropDownValuesMatches(dropDownName: string, data: string[]): Promise<void> {
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

						let arr: string[] = [];
						let drpDwnvalue: number = await $$("li[ng-repeat*='option']").count();
						for (let i = 0; i < drpDwnvalue; i++) {
							let ab: string = await $$("li[ng-repeat*='option']").get(i).getText();
							arr[i] = ab;
						}
						arr = arr.sort();
						data = data.sort();
						return arr.length === data.length && arr.every(
							(value, index) => (value === data[index])
						);

					}
				}
			});
		}
	}
}

export default new ChangeAssignmentOldBlade();