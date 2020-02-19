import { $, $$, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class AssignmentConfigCreatePage {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        viewTitle: '.modal-title',
        addAssignmentMappingFields: '[rx-view-component-id="891fcb4d-84f9-4980-a5eb-0bd69c6d8a00"] .d-textfield__item',
        assignmentMappingName: '[rx-view-component-id="eed6ca5c-8167-4af1-9cdd-6d3d64fcc71e"] .d-textfield__input',
        companyDrpDwn: '471bbeb3-3965-46b6-b74d-4f2a10fe3cce',
        flowsetDrpDwn: 'beda4ca9-322d-4f25-9bba-5da984836656',
        catTier1DrpDwn: 'caeb2d28-0f57-4dd9-b1c9-e201b14ca604',
        catTier2DrpDwn: '9a658851-6b56-493e-8336-e7634643bdcd',
        catTier3DrpDwn: 'f644d025-c5a8-46a7-baa5-4f09994d9859',
        catTier4DrpDwn: 'e357ee21-d59e-4d89-9864-5e481a116a04',
        priorityDrpDwn: '790dfab1-2353-4b06-909d-741ebbc896d5',
        labelDrpDwn: '0274367e-248b-40cc-9f6b-7fed430e9829',
        regionDrpDwn: '917ab504-369d-49e9-8e4f-e3e9d87e6897',
        siteDrpDwn: 'f9561103-49ac-4ad8-abb6-5972aca9e595',
        defaultToggle: '[rx-view-component-id="d52b16e7-3cd4-4ef1-a31b-922eac1007c1"] .d-icon-circle_slash_o',
        supportCompanyDrpDwn: 'e20294a1-3a95-4fbd-9640-15a325db82ab',
        businessUnitDrpDwn: '4906783f-e70a-4471-811b-eeb8e73d46e1',
        departmentDrpDwn: 'e85a3405-af4d-494a-843b-24c797e7aa52',
        supportGrpDrpDwn: '7a1dfae3-366a-41de-94ca-f38852675c2f',
        assigneeGrpDrpDwn: 'c855a4ae-1283-4369-bbae-8daf38371c16',
        saveButton: '[rx-view-component-id="d7f16b2d-fe68-481b-a0f6-2144bb6403f1"] button',
        cancelButton: '[rx-view-component-id="8956a9fb-4fbd-4e11-96e8-13dc7bb81abe"] button'
    }

    async setAssignmentMapName(mappingName:string){
        await $(this.selectors.assignmentMappingName).clear();
        await $(this.selectors.assignmentMappingName).sendKeys(mappingName);
    }

    async setCompany(company:string){
        await utilCommon.selectDropDown(this.selectors.companyDrpDwn, company);
    }

    async setFlowset(flowset:string){
        await utilCommon.selectDropDown(this.selectors.flowsetDrpDwn, flowset);
    }

    async setCategoryTier1(category1:string){
        await utilCommon.selectDropDown(this.selectors.catTier1DrpDwn, category1);
    }

    async setCategoryTier2(category2:string){
        await utilCommon.selectDropDown(this.selectors.catTier2DrpDwn, category2);
    }

    async setCategoryTier3(category3:string){
        await utilCommon.selectDropDown(this.selectors.catTier3DrpDwn, category3);
    }

    async setPriority(company:string){
        await utilCommon.selectDropDown(this.selectors.priorityDrpDwn, company);
    }

    async setSupportCompany(suppCompany:string){
        await utilCommon.selectDropDown(this.selectors.supportCompanyDrpDwn, suppCompany);
    }

    async setSupportGroup(supportGrp:string){
        await utilCommon.selectDropDown(this.selectors.supportGrpDrpDwn, supportGrp);
    }

    async clickonSaveButton(): Promise<void> {
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelButton(): Promise<void> {
        await $(this.selectors.cancelButton).click();
    }

    async areAllFieldsPresentOnUI(data: string[]): Promise<boolean> {
            let arr: string[] = [];
            let fieldsCount: number  = await $$(this.selectors.addAssignmentMappingFields).count();
            for (let i = 0; i < fieldsCount; i++) {
                var labelTxt: string = await $$(this.selectors.addAssignmentMappingFields).get(i).getText();
                arr[i] = labelTxt;
            }
            arr = arr.sort();
            arr = arr.filter(v=>v!='');
            data = data.sort();
            return arr.length === data.length && arr.every(
                (value, index) => (value === data[index])
            );
    }
}

export default new AssignmentConfigCreatePage();