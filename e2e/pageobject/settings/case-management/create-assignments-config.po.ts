import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';

class AssignmentConfigCreatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        viewTitle: '.dp-title',
        addAssignmentMappingFields: '[rx-view-component-id="891fcb4d-84f9-4980-a5eb-0bd69c6d8a00"] .form-control-label span',
        assignmentMappingName: '[rx-view-component-id="eed6ca5c-8167-4af1-9cdd-6d3d64fcc71e"] .form-control',
        companyDrpDwn: '471bbeb3-3965-46b6-b74d-4f2a10fe3cce',
        flowsetDrpDwn: '70c2a2c9-d0ed-4759-8717-0ff514a76e0e',
        catTier1DrpDwn: '1763b0d3-e319-4429-86df-641ad1e54714',
        catTier2DrpDwn: '1f5cd24b-7160-4fc5-aa6e-28e4ab066a61',
        catTier3DrpDwn: 'af5359b5-97bd-4621-a3fb-22b4d80f2c17',
        catTier4DrpDwn: 'a8d52e5f-d8fd-4554-a805-23a60bf8bb26',
        priorityDrpDwn: '790dfab1-2353-4b06-909d-741ebbc896d5',
        labelDrpDwn: 'e96e5a26-840f-483e-b62a-797f13fb386c',
        regionDrpDwn: 'f2083fbb-ee65-4c20-8958-dfb2979f3b56',
        siteDrpDwn: '13c01687-f249-418b-84a5-4421005312ed',
        siteGrpDrpDwn: '2aef036b-c61b-4612-9937-512d642df8ef',
        defaultToggle: '[rx-view-component-id="d52b16e7-3cd4-4ef1-a31b-922eac1007c1"] .d-icon-circle_slash_o',
        supportCompanyDrpDwn: 'e20294a1-3a95-4fbd-9640-15a325db82ab',
        businessUnitDrpDwn: '110ab90c-0907-413d-8b13-a6aa2ee2c566',
        departmentDrpDwn: 'e85a3405-af4d-494a-843b-24c797e7aa52',
        supportGrpDrpDwn: '28b8045f-6347-4277-b252-5cb5cf12eff7',
        assigneeGrpDrpDwn: 'a335c72f-964d-4c55-86c3-44b48ca79433',
        saveButton: '[rx-view-component-id="d7f16b2d-fe68-481b-a0f6-2144bb6403f1"] button',
        cancelButton: '[rx-view-component-id="8956a9fb-4fbd-4e11-96e8-13dc7bb81abe"] button',
        lobValue: '[rx-view-component-id="1409518f-f026-490d-bb1e-9c3c098bce89"] .rx-select__search-button-title'
    }

    async setAssignmentMapName(mappingName: string) {
        await $(this.selectors.assignmentMappingName).clear();
        await $(this.selectors.assignmentMappingName).sendKeys(mappingName);
    }

    async setCompany(company: string) {
        await utilityCommon.selectDropDown(this.selectors.companyDrpDwn, company);
    }

    async setSupportOrg(bu: string) {
        await utilityCommon.selectDropDown(this.selectors.businessUnitDrpDwn, bu);
    }

    async setDepartement(department: string) {
        await utilityCommon.selectDropDown(this.selectors.departmentDrpDwn, department);
    }

    async setFlowset(flowset: string) {
        await utilityCommon.selectDropDown(this.selectors.flowsetDrpDwn, flowset);
    }

    async setCategoryTier1(category1: string) {
        await utilityCommon.selectDropDown(this.selectors.catTier1DrpDwn, category1);
    }

    async setCategoryTier2(category2: string) {
        await utilityCommon.selectDropDown(this.selectors.catTier2DrpDwn, category2);
    }

    async setCategoryTier3(category3: string) {
        await utilityCommon.selectDropDown(this.selectors.catTier3DrpDwn, category3);
    }

    async setCategoryTier4(category4: string) {
        await utilityCommon.selectDropDown(this.selectors.catTier4DrpDwn, category4);
    }

    async setPriority(company: string) {
        await utilityCommon.selectDropDown(this.selectors.priorityDrpDwn, company);
    }

    async setSupportCompany(suppCompany: string) {
        await utilityCommon.selectDropDown(this.selectors.supportCompanyDrpDwn, suppCompany);
    }

    async setSupportGroup(supportGrp: string) {
        await utilityCommon.selectDropDown(this.selectors.supportGrpDrpDwn, supportGrp);
    }

    async clickonSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async areAllFieldsPresentOnUI(data: string[]): Promise<boolean> {
        let arr: string[] = [];
        let fieldsCount: number = await $$(this.selectors.addAssignmentMappingFields).count();
        for (let i = 0; i < fieldsCount; i++) {
            let labelTxt: string = await $$(this.selectors.addAssignmentMappingFields).get(i).getText();
            if(labelTxt != '(required)') {
                arr[i] = labelTxt;
            }
        }
        arr = arr.sort();
        arr = arr.filter(v => v != '');
        data = data.sort();
        return arr.length === data.length && arr.every(
            (value, index) => (value === data[index])
        );
    }

    async isCompanyDropdownValueMatches(values: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches('471bbeb3-3965-46b6-b74d-4f2a10fe3cce', values);
    }

    async setAssignee(assigneeName: string) {
        await utilityCommon.selectDropDown(this.selectors.assigneeGrpDrpDwn, assigneeName);
    }

    async setRegion(Region: string) {
        await utilityCommon.selectDropDown(this.selectors.regionDrpDwn, Region);
    }

    async setSiteGroup(siteGroup: string) {
        await utilityCommon.selectDropDown(this.selectors.siteGrpDrpDwn, siteGroup);
    }

    async setSite(Site: string) {
        await utilityCommon.selectDropDown(this.selectors.siteDrpDwn, Site);
    }

    async isRegionAllDropDownValuesMatches(data: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.regionDrpDwn, data);
    }

    async isSiteAllDropDownValuesMatches(data: string[]): Promise<boolean> {
        return await utilityCommon.isAllDropDownValuesMatches(this.selectors.siteDrpDwn, data);
    }

    async setLabel(label: string) {
        await utilityCommon.selectDropDown(this.selectors.labelDrpDwn, label);
    }

    async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
        let guid;
        switch (DropDownName) {
            case "Label": {
                guid = this.selectors.labelDrpDwn;
                break;
            }
            case "Priority": {
                guid = this.selectors.priorityDrpDwn;
                break;
            }
            case "Category Tier 1": {
                guid = this.selectors.catTier1DrpDwn;
                break;
            }
            case "Category Tier 2": {
                guid = this.selectors.catTier2DrpDwn;
                break;
            }
            case "Category Tier 3": {
                guid = this.selectors.catTier3DrpDwn;
                break;
            }
            case "Category Tier 4": {
                guid = this.selectors.catTier4DrpDwn;
                break;
            }
            default: {
                console.log('Drop Down name does not match');
                break;
            }
        }
        return await utilityCommon.isValuePresentInDropDown(guid, value);
    }

    async getLobValue(): Promise<string> {
        return await $(this.selectors.lobValue).getText();
    }
}

export default new AssignmentConfigCreatePage();