import { $, protractor, ProtractorExpectedConditions } from "protractor";
import utilityCommon from '../../../utils/utility.common';
class AddReadAccessConfigurationPage {
   EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

   selectors = {
      accessMappingName: '[rx-view-component-id="4a195afd-0aa7-415a-b46d-c6cf42352e88"] input',
      companyGuid: '151d7e7f-9800-4e7b-b5cd-454f358e94c4',
      flowsetGuid: 'dccf17b6-a35d-46cd-a655-b56d942ff49f',
      supportCompanyGuid: '21238f34-a5d5-4ec0-906e-1fe2243a057d',
      supportGroupGuid: '2662c512-973a-4427-8093-c454ee1956d1',
      saveButton: '[rx-view-component-id="61ac81f7-e04f-496b-b9ed-65b3163cae6d"] button',
      businessUnitGuid: 'd8f98b5b-06cc-46ae-acd9-87161bad50a9',
      departmentGuid: 'f6e934cf-8db4-40b8-aa87-571eb12ed025',
      categoryTier1Guid: '370bf82e-1a4f-4ad6-9bfb-dc005dee2bf4',
      priorityGuid: 'dc84e827-e82d-4663-858b-a131d58be352',
      accessMappingNameGuid: '4a195afd-0aa7-415a-b46d-c6cf42352e88',
      cancelButton: '[rx-view-component-id="e0a1c18c-b7bf-482c-a129-3b2fe4c1ed91"] button',
      flowset: '[rx-view-component-id="dccf17b6-a35d-46cd-a655-b56d942ff49f"] .d-textfield__item',
      businessUnit: '[rx-view-component-id="d8f98b5b-06cc-46ae-acd9-87161bad50a9"] .d-textfield__item',
      department: '[rx-view-component-id="f6e934cf-8db4-40b8-aa87-571eb12ed025"] .d-textfield__item',
      categoryTier1: '[rx-view-component-id="370bf82e-1a4f-4ad6-9bfb-dc005dee2bf4"] .d-textfield__item',
      priority: '[rx-view-component-id="dc84e827-e82d-4663-858b-a131d58be352"] .d-textfield__item',
      useAsDefault: '77424ee9-4d45-40b3-992f-82fc3a8162c3',
      categoryTier2Guid: '0bdb722f-3fcd-48d4-b10c-29712ed2cd86',
      categoryTier3Guid: '78f414cd-19df-4457-a2dc-cf226371eac3',
      categoryTier4Guid: '899d8ac7-85a0-4337-8435-da69fd1b81ac',
      labelGuid: '628735ec-4f31-4b7e-acac-07c920a7bec3',
      lobValue: '[rx-view-component-id="9d7f8351-9da7-471f-8f9c-ed37919fdbc9"] .pull-left'
   }

   async setReadAccessConfigurationName(accessmapping: string): Promise<void> {
      await $(this.selectors.accessMappingName).clear();
      await $(this.selectors.accessMappingName).sendKeys(accessmapping);
   }

   async clickOnSave(): Promise<void> {
      await $(this.selectors.saveButton).click();
   }

   async clickOnCancel(): Promise<void> {
      await $(this.selectors.cancelButton).click();
   }

   async selectCompany(company: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.companyGuid, company);
   }

   async selectFlowset(flowset: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.flowsetGuid, flowset);
   }

   async selectSupportCompany(supportCompany: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.supportCompanyGuid, supportCompany);
   }

   async selectSupportGroup(supportGroup: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.supportGroupGuid, supportGroup);
   }

   async selectBusinessUnit(bu: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.businessUnitGuid, bu);
   }

   async selectDepartment(bu: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.departmentGuid, bu);
   }

   async isAssignedCompanyReadOnly(): Promise<boolean> {
      return await $(this.selectors.companyGuid).isEnabled() == false ? true : false;
   }

   async selectPriority(priority: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.priorityGuid, priority);
   }

   async selectCategoryTier1(categValue: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.categoryTier1Guid, categValue);
   }

   async selectCategoryTier2(categValue: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.categoryTier2Guid, categValue);
   }

   async selectCategoryTier3(categValue: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.categoryTier3Guid, categValue);
   }

   async selectCategoryTier4(categValue: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.categoryTier4Guid, categValue);
   }

   async isSaveButtonDisplayed(): Promise<boolean> {
      return await $(this.selectors.saveButton).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.saveButton).isDisplayed();
         else return false;
      });
   }

   async isCancelButtonDisplayed(): Promise<boolean> {
      return await $(this.selectors.cancelButton).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.cancelButton).isDisplayed();
         else return false;
      });
   }

   async isPriorityDisplayed(): Promise<boolean> {
      return await $(this.selectors.priority).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.priority).isDisplayed();
         else return false;
      });
   }

   async isBusinessUnitDisplayed(): Promise<boolean> {
      return await $(this.selectors.businessUnit).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.businessUnit).isDisplayed();
         else return false;
      });
   }

   async isDepartmentDisplayed(): Promise<boolean> {
      return await $(this.selectors.department).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.department).isDisplayed();
         else return false;
      });
   }

   async isFlowsetDisplayed(): Promise<boolean> {
      return await $(this.selectors.flowset).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.flowset).isDisplayed();
         else return false;
      });
   }

   async isCategoryTier1Displayed(): Promise<boolean> {
      return await $(this.selectors.categoryTier1).isPresent().then(async (result) => {
         if (result) return await $(this.selectors.categoryTier1).isDisplayed();
         else return false;
      });
   }

   async isCompanyFieldMandatory(): Promise<boolean> {
      return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
   }

   async isSupportCompanyFieldMandatory(): Promise<boolean> {
      return await utilityCommon.isRequiredTagToField(this.selectors.supportCompanyGuid);
   }

   async isSupportGroupFieldMandatory(): Promise<boolean> {
      return await utilityCommon.isRequiredTagToField(this.selectors.supportGroupGuid);
   }

   async isAccessMappingNameFieldMandatory(): Promise<boolean> {
      return await utilityCommon.isRequiredTagToField(this.selectors.accessMappingNameGuid);
   }

   async isUseAsDefaultFieldMandatory(): Promise<boolean> {
      return await utilityCommon.isRequiredTagToField(this.selectors.companyGuid);
   }

   async selectLabel(label: string): Promise<void> {
      await utilityCommon.selectDropDown(this.selectors.labelGuid, label);
   }

   async isValuePresentInDropdown(DropDownName: string, value: string): Promise<boolean> {
      let guid;
      switch (DropDownName) {
         case "Label": {
            guid = this.selectors.labelGuid;
            break;
         }
         case "Priority": {
            guid = this.selectors.priority;
            break;
         }
         case "Category Tier 1": {
            guid = this.selectors.categoryTier1;
            break;
         }
         case "Category Tier 2": {
            guid = this.selectors.categoryTier2Guid;
            break;
         }
         case "Category Tier 3": {
            guid = this.selectors.categoryTier3Guid;
            break;
         }
         case "Category Tier 4": {
            guid = this.selectors.categoryTier4Guid;
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
export default new AddReadAccessConfigurationPage