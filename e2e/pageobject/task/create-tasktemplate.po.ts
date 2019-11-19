import { element, by, ProtractorExpectedConditions, protractor, browser, $, $$ } from "protractor"
import util from "../../utils/util.common";

class CreateTaskTemplatePage{

    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        templateName: '[rx-view-component-id="2e4ef0dc-9b73-4c8f-afe6-221ddf0594c7"] input',
        taskSummary: '[rx-view-component-id="c19d336e-7339-4970-b69a-100108d672fd"] input',
        taskCompny: 'f62bd26b-c464-4dff-ab7b-e4446d1cbf99',
        taskPriority: '1b9c265f-e618-4f0a-9b21-55dbb78e0cd1',
        label: '3fc875fc-5677-497f-bf30-5e3e3068b826',
        taskCategoryDrpDown1: 'b4b55a43-81bc-43aa-877b-32e71babf229',
        taskCategoryDrpDown2: '1fa4a29b-2234-4b17-8f2e-0649d1df860e',
        taskCategoryDrpDown3: '09e9fc7b-03ab-45ec-83b2-7dbb42e64f23',
        taskCategoryDrpDown4: '44f1eacf-54a4-473d-b764-4735948ed204',
        changeAssignmentButton: '[rx-view-component-id="0bd0a580-775d-491f-be52-87c14a8b6e2d"] button',
        taskDescription: '[rx-view-component-id="8dab5855-547b-449d-a010-3f1bd09fd7f5"] textarea',
        templateStatus: '09db292a-212a-433e-8c20-a92f8c4e5168',
        ownerCompany: '87ec3995-3350-4e3f-ab19-0f1e7846fbd7',
        buisnessUnit: 'a81cc2df-7b89-4367-81f7-f0ad5e786ca2',
        department: '5ae20516-9fd9-47f1-9f16-93726cd33de4',
        ownerGroup: '61278673-8106-419c-83e4-a9e00f12f835',
        saveButton: '[rx-view-component-id="5001f6ea-4438-4485-bdd2-c952a12a1a34"] button',
        cancelButton: '[rx-view-component-id="3f760e5f-70e9-4fbf-8b05-cd7d460f8818"] button',
        processBundleIdDrpDownForNewProcess: 'e8a2406c-6991-4ea1-bfdf-bde29abe2ef7',
        processBundleIdDrpDownForExistingProcess: '[rx-view-component-id="71e09acc-0077-4e55-9c24-7f6bdc90ce5d"] .d-icon-right-angle_down',
        toggleBox: '0ef8534e-a8bf-40c3-bdc1-a91edde177c4',
        newProcessName: '[rx-view-component-id="eefdf45b-47af-48cb-8c8b-a82c73f7d5a4"] input',
        searchProcess:'.d-icon-search',
        setInputdataInProcess:'[rx-view-component-id="71e09acc-0077-4e55-9c24-7f6bdc90ce5d"] input',
        selectNameInProcess: '.rx-definition-picker__instance-name',
    }

    async setTemplateName(inputValue:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.templateName)));
        await $(this.selectors.templateName).clear();
        await $(this.selectors.templateName).sendKeys(inputValue);
    }

    async setTaskSummary(inputValue:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskSummary)));
        await $(this.selectors.taskSummary).clear();
        await $(this.selectors.taskSummary).sendKeys(inputValue);
    }

    async setTaskDescription(inputValue:string): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.taskDescription)));
        await $(this.selectors.taskDescription).clear();
        await $(this.selectors.taskDescription).sendKeys(inputValue);
    }

    async clickOnAssignment(): Promise<void> {
        await browser.wait(this.EC.visibilityOf($(this.selectors.changeAssignmentButton)));
        await $(this.selectors.changeAssignmentButton).click();
    }

    async clickOnSaveTask(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.saveButton)));
        await $(this.selectors.saveButton).click();
    }

    async clickOnCancelTask(): Promise<void> {
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.cancelButton)));
        await $(this.selectors.cancelButton).click();
    }
   
    async selectCompanyByName(companyName:string): Promise<void> {
        await util.selectDropDown(this.selectors.taskCompny,companyName);
    }

    async selectTaskPriority(priority:string): Promise<void> {
        await util.selectDropDown(this.selectors.taskPriority,priority);
    }

    async selectLabel(label:string): Promise<void> {
        await util.selectDropDown(this.selectors.label,label);
    }

    async selectTaskCategoryTier1(category1:string): Promise<void> {
        await util.selectDropDown(this.selectors.taskCategoryDrpDown1,category1);
    }

    async selectTaskCategoryTier2(category2:string): Promise<void> {
        await util.selectDropDown(this.selectors.taskCategoryDrpDown2,category2);
    }

    async selectTaskCategoryTier3(category3:string): Promise<void> {
        await util.selectDropDown(this.selectors.taskCategoryDrpDown3,category3);
    }

    async selectTaskCategoryTier4(category4:string): Promise<void> {
        await util.selectDropDown(this.selectors.taskCategoryDrpDown4,category4);
    }
    
    async selectTemplateStatus(status:string): Promise<void> {
        await util.selectDropDown(this.selectors.templateStatus,status);
    }

    async selectOwnerCompany(company:string): Promise<void> {
        await util.selectDropDown(this.selectors.ownerCompany,company);
    }

    async selectBuisnessUnit(buisnessunit:string): Promise<void> {
        await util.selectDropDown(this.selectors.buisnessUnit,buisnessunit);
    }

    async selectDepartment(departmentname:string): Promise<void> {
        await util.selectDropDown(this.selectors.department,departmentname);
    }

    async selectOwnerGroup(ownergroup:string): Promise<void> {
        await util.selectDropDown(this.selectors.ownerGroup,ownergroup);
    }

    async setNewProcessName(bundle:string, inputValue:string): Promise<void> {
        await util.selectToggleButton(this.selectors.toggleBox,true);
        await util.selectDropDown(this.selectors.processBundleIdDrpDownForNewProcess,bundle);
        await browser.wait(this.EC.visibilityOf($(this.selectors.newProcessName)));
        await $(this.selectors.newProcessName).clear();
        await $(this.selectors.newProcessName).sendKeys(inputValue); 

    }

    async setExistingProcessName(bundle:string): Promise<void> {
        await util.selectToggleButton(this.selectors.toggleBox,false);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.processBundleIdDrpDownForExistingProcess)));
        await $(this.selectors.processBundleIdDrpDownForExistingProcess).click();
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.searchProcess)));
        await $(this.selectors.searchProcess).click();
        await browser.wait(this.EC.visibilityOf($(this.selectors.setInputdataInProcess)));
        await $(this.selectors.setInputdataInProcess).sendKeys(bundle);
        browser.sleep(5000);
        await browser.wait(this.EC.elementToBeClickable($(this.selectors.selectNameInProcess)));
        await $(this.selectors.selectNameInProcess).click();
       
    }

}
export default new CreateTaskTemplatePage();