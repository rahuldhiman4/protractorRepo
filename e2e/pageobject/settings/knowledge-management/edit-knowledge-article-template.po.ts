import { $, browser, protractor, ProtractorExpectedConditions } from "protractor";
import utilCommon from '../../../utils/util.common';

class EditKnowledgeArticleTemplate {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;

    selectors = {
        sectionTitle: '.rx-template-editor-text-fields [ng-model="item.title"]',
        cancelButton:'.template-editor-action-buttons button[type="button"] ',
        modelContent:'.modal-content'
    }

    async getSectionTitleValue(sectionTitle:string): Promise<boolean> {
       return await $(this.selectors.sectionTitle).getAttribute('value')==sectionTitle? true: false;
    }

    async clickOnCancelButton():Promise<void>{
        await $(this.selectors.cancelButton).click();
    }
}
export default new EditKnowledgeArticleTemplate();