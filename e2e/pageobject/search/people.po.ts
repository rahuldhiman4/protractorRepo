import { $, by, element, ElementFinder } from "protractor";
import utilityCommon from '../../utils/utility.common';

class People {

    selectors = {
        fieldLabels: '.clearfix label',
        employeeName: '.ac-person-full-name',
        employeeCompany: '.person-organization .text-secondary',
        loginId: '[rx-view-component-id="00e01e18-c688-4c97-b103-0eeed0f71f83"] .read-only-content',
        emailId: '[rx-view-component-id="db6003d9-b50d-4c4a-be8b-9648afecce23"] .bwf-person-email button',
        tabName: '.nav-link-wrapper',
        gotoPersonButton: '[rx-view-component-id="7ca796f5-80ea-4fd4-9f52-4dd834c27e87"] button',
        backButton: '[rx-view-component-id="4fa52901-b785-4659-9607-7ddbcd1f9edb"] button',
    }

    async isElementDisplayed(element: ElementFinder): Promise<boolean> {
        return await element.isPresent().then(async (link) => {
            if (link) {
                return await element.isDisplayed();
            } else return false;
        });
    }

    async isFieldLabelDisplayed(labelName: string): Promise<boolean> {
        let guid: string = undefined;
        switch (labelName) {
            case "Employee": {
                guid = '173d2bf1-5758-45ed-ae16-fdbf6a62d981';
                break;
            }
            case "JobTitle": {
                guid = 'fb7bf28b-a603-433c-9e48-6f42bbb60cab';
                break;
            }
            case "CorporateID": {
                guid = 'e7274572-2e82-49fa-961f-d406853c452d';
                break;
            }
            case "Type": {
                guid = '6ae2d2ca-a0c7-48d4-9c03-9714081518bf';
                break;
            }
            case "LoginID": {
                guid = '00e01e18-c688-4c97-b103-0eeed0f71f83';
                break;
            }
            case "FunctionalRoles": {
                guid = '1e8964a0-27b2-40b2-a957-00c247d48346';
                break;
            }
            case "Site": {
                guid = 'db6003d9-b50d-4c4a-be8b-9648afecce23';
                break;
            }

            default: {
                console.log(labelName, ' is not a valid parameter');
                break;
            }
        }
        return await utilityCommon.isFieldLabelDisplayed(guid, labelName);
    }


    async isDataDisplayed(fieldName: string, dataName: string): Promise<boolean> {
        let getElements: string = undefined;
        switch (fieldName) {
            case "EmployeeName": {
                getElements = this.selectors.employeeName;
                break;
            }

            case "EmployeeCompany": {
                getElements = this.selectors.employeeCompany;
                break;
            }

            case "LoginId": {
                getElements = this.selectors.loginId;
                break;
            }

            case "EmailId": {
                getElements = this.selectors.emailId;
                break;
            }

            case "TabName": {
                getElements = this.selectors.tabName;
                break;
            }

            case "backButton": {
                getElements = this.selectors.backButton;
                break;
            }
            default: {
                console.log(dataName, ' is not a valid parameter');
                break;
            }
        }
        let dataElement = await element(by.cssContainingText(getElements, dataName));
        return await this.isElementDisplayed(dataElement);
    }

    async clickGotoPersonButton(): Promise<void> {
        await $(this.selectors.gotoPersonButton).click();
    }

    async clickbackButtonButton(): Promise<void> {
        await $(this.selectors.backButton).click();
    }
}
export default new People();