import { $ } from "protractor";

class ConsoleKnowledgeSet {
    
    selectors = {
        addKnowledgeSetButton: 'button.d-icon-left-plus',
    }

    async clickOnAddKnowledgeSetBtn(): Promise<void>{
        await $(this.selectors.addKnowledgeSetButton).click();
    }

    async isAddKnowledgeSetBtnEnabled(): Promise<boolean>{
       return await $(this.selectors.addKnowledgeSetButton).isEnabled();
    }

}

export default new ConsoleKnowledgeSet();