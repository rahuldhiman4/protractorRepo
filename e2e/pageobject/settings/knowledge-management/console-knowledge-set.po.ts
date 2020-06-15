import { $ } from "protractor";

class ConsoleKnowledgeSet {
    
    selectors = {
        addKnowledgeSetButton: 'button.d-icon-left-plus',
    }

    async clickOnAddKnowledgeSetBtn(): Promise<void>{
        await $(this.selectors.addKnowledgeSetButton).click();
    }

}

export default new ConsoleKnowledgeSet();