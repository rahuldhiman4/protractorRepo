import { browser } from "protractor";
import apiHelper from "../../api/api.helper";
import loginPage from "../../pageobject/common/login.po";
import navigationPage from "../../pageobject/common/navigation.po";
import { BWF_BASE_URL } from '../../utils/constants';
import utilityGrid from "../../utils/utility.grid";

describe('Case Console', () => {

    beforeAll(async () => {
        await browser.get(BWF_BASE_URL);
        await loginPage.login('qfeng');
    });

    afterAll(async () => {
        await navigationPage.signOut();
    });

    it('[DRDMV-9181]: [Case Console] - Sorting based on Source of case', async () => {
        let caseData = {
            "Description": "DRDMV-9181 Desc",
            "Requester": "qtao",
            "Summary": "DRDMV-9181-Summary",
            "Assigned Company": "Petramco",
            "Business Unit": "United States Support",
            "Support Group": "US Support 1",
            "Origin": "External"
          }

          await apiHelper.apiLogin('qfeng');
          for(let i=0; i<3; i++) {
              await apiHelper.createCase(caseData);
          }
          caseData.Origin = "Email";
          for(let i=0; i<3; i++) {
            await apiHelper.createCase(caseData);
        }
        caseData.Origin = "Agent";
        for(let i=0; i<3; i++) {
            await apiHelper.createCase(caseData);
        }

          await utilityGrid.clearFilter();
          await utilityGrid.addFilter('Summary', 'DRDMV-9181-Summary', 'text');
          await utilityGrid.addGridColumn(['Source']);
          expect(await utilityGrid.isGridColumnSorted('Source', 'asc')).toBeTruthy('Column is not sorted in ascending order');
          expect(await utilityGrid.isGridColumnSorted('Source', 'desc')).toBeTruthy('Column is not sorted in descending order');
          await utilityGrid.removeGridColumn(['Source']);
    });
});