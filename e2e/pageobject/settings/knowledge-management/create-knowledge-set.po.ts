import utilityCommon from '../../../utils/utility.common';
import { $, $$, element, by } from "protractor";

class CreateKnowledgeSet {

    selectors = {
        createNewApplicationCancelBtn: '[rx-view-component-id="7a8f20d7-fa0e-43c5-a4f4-0591ebafe9fb"] button',
        knowledgeSetInput: '[rx-view-component-id="65d549eb-dfc5-4541-a97c-066a1a3d1ce1"] input',
        companyDropdownGuid: 'ab5d399f-07b1-4235-9978-3e7dfbde55e9',
        description: '[rx-view-component-id="253246ad-fc91-4117-8c19-d317ead1da15"] textarea',
        createNewButton: '[rx-view-component-id="71ee090f-57ec-4ec5-a4f9-6670092f268e"] button',
        applicationIdLabel: '[rx-view-component-id="0327a973-ee27-407e-aee6-27d5cf69672a"] adapt-rx-control-label span.form-control-label span',
        applicationBundleIdLabel: '[rx-view-component-id="5b84d9dd-feef-4436-a290-40f8ad22c836"] div.adapt-counter-label-wrapper span',
        createNewAppDescriptionLabel: '[rx-view-component-id="26170570-b9aa-4ec8-9d11-8aea2ec86b59"] div.adapt-counter-label-wrapper span',
        createNewAppDescriptionInput: '[rx-view-component-id="26170570-b9aa-4ec8-9d11-8aea2ec86b59"] input',
        createNewAppSaveBtn: '[rx-view-component-id="5d1c7de1-fab0-4af4-af7e-97ea44216bc3"] button',
        associateButton: '[rx-view-component-id="1170958f-d5ed-4755-aa1e-42930e69c41c"] button',
        applicationNames: '[rx-view-component-id="74ec0fc2-6775-48aa-af50-e5e50508bcdd"] td.at-data-cell',
        selectBtn: '[rx-view-component-id="c2ce9041-fee1-46f4-ba92-9808055976a9"] button',
        saveBtn: '[rx-view-component-id="ba009fba-499a-49c6-b5a5-0de6e6c8e402"] button',
        cancelBtn: '[rx-view-component-id="4bd4c11d-1c58-4674-8a11-4bafce192e1e"] button',
        lobValue: '[rx-view-component-id="ab4a334d-63a1-4791-9dcd-80c194250627"]'
    }

    async clickCreateNewApplicationCancelBtn(): Promise<void> {
        await $(this.selectors.createNewApplicationCancelBtn).click();
    }

    async setKnowledgeSetName(name: string): Promise<void> {
        await $(this.selectors.knowledgeSetInput).sendKeys(name);
    }

    async setCompanyValue(companyName: string): Promise<void> {
        await utilityCommon.selectDropDown(this.selectors.companyDropdownGuid, companyName);
    }

    async setDescriptionValue(description: string): Promise<void> {
        await $(this.selectors.description).sendKeys(description);
    }

    async isFieldRequired(fieldName: string): Promise<boolean> {
        let guid: string = undefined;
        switch (fieldName) {
            case "Knowledge Set": {
                guid = '65d549eb-dfc5-4541-a97c-066a1a3d1ce1';
                break;
            }
            case "Description": {
                guid = '253246ad-fc91-4117-8c19-d317ead1da15';
                break;
            }
            case "Company": {
                guid = 'ab5d399f-07b1-4235-9978-3e7dfbde55e9';
                break;
            }
            case "Application ID": {
                guid = 'ab5d399f-07b1-4235-9978-3e7dfbde55e9';
                break;
            }
            case "Application Bundle ID": {
                guid = 'ab5d399f-07b1-4235-9978-3e7dfbde55e9';
                break;
            }
            case "Application Description": {
                guid = 'ab5d399f-07b1-4235-9978-3e7dfbde55e9';
                break;
            }
            default: {
                console.log(fieldName, ' is not a valid parameter');
                break;
            }
        }
        return await utilityCommon.isRequiredTagToField(guid);
    }

    async getDescriptionLabel(): Promise<string> {
        return await $(this.selectors.createNewAppDescriptionLabel).getText();
    }

    async getApplicationIDLabel(): Promise<string> {
        return await $(this.selectors.applicationIdLabel).getText();
    }

    async getApplicationBundleLabel(): Promise<string> {
        return await $(this.selectors.applicationBundleIdLabel).getText();
    }

    async clickCreateNewButton(): Promise<void> {
        await $(this.selectors.createNewButton).click();
    }

    async addNewApplication(applicationId: string, description: string): Promise<void> {
        await this.clickCreateNewButton();
        await utilityCommon.selectDropDown('0327a973-ee27-407e-aee6-27d5cf69672a', applicationId);
        await $(this.selectors.createNewAppDescriptionInput).sendKeys(description);
        await $(this.selectors.createNewAppSaveBtn).click();
    }

    async isApplicationAvaialableForAssociation(applicationName: string): Promise<boolean> {
        return await element(by.cssContainingText(this.selectors.applicationNames, applicationName)).isPresent().then(async (result) => {
            if (result) return await element(by.cssContainingText(this.selectors.applicationNames, applicationName)).isDisplayed();
            else return false;
        });
    }

    async clickAssociateBtn(): Promise<void> {
        await $(this.selectors.associateButton).click();
    }

    async checkApplicationCheckboxes(applicationNames: string[]): Promise<void> {
        for(let i=0; i<applicationNames.length; i++) {
            await this.clickCheckBoxOfValueInGrid(applicationNames[i]);
        }
    }

    async clickSelectBtn(): Promise<void> {
        await $(this.selectors.selectBtn).click();
    }

    async clickSaveBtn(): Promise<void> {
        await $(this.selectors.saveBtn).click();
    }

    async clickCancelBtn(): Promise<void> {
        await $(this.selectors.cancelBtn).click();
    }

    async clickCheckBoxOfValueInGrid(value: string): Promise<void> {
        let size: number = await $$('[rx-view-component-id="74ec0fc2-6775-48aa-af50-e5e50508bcdd"] td.at-data-cell').count();
        let cnt: number = 0;
        for (let i: number = 0; i < size; i++) {
            cnt++;
            let locator: string = '[rx-view-component-id="74ec0fc2-6775-48aa-af50-e5e50508bcdd"] td.at-data-cell';
            if (await $$(locator).get(i).getText() == value) break;
        }
        cnt = (cnt+1)/2;
        let checkbox: string = '[rx-view-component-id="74ec0fc2-6775-48aa-af50-e5e50508bcdd"] div.ui-chkbox';
        await $$(checkbox).get(cnt-1).click();
    }

    async getLobValue(): Promise<string> {
        return await $(`${this.selectors.lobValue} button`).isPresent().then(async (buttonLob) => {
            if (buttonLob) return await $(`${this.selectors.lobValue} button`).getText();
            else return await $(`${this.selectors.lobValue} input`).getAttribute("placeholder");
        });
    }
}

export default new CreateKnowledgeSet();
