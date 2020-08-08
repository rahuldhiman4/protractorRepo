import { protractor, ProtractorExpectedConditions, $ } from "protractor";
import utilCommon from '../../../utils/util.common';
import utilGrid from '../../../utils/util.grid';

class ServiceTargetViewConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetHeader: '.datasource__heading .padleft13',
        serviceTargetSearchInput: 'searchText',
        createServiceTargetButton: 'button.d-icon-left-plus',
    }

    async searchServiceTarget(searchSVT:string):Promise<void>{
        await utilGrid.searchAndOpenHyperlink(searchSVT);
    }

    async isAddSVTButtonEnabled(): Promise<boolean> {
        return await $(this.selectors.createServiceTargetButton).isEnabled();
    }

}

export default new ServiceTargetViewConsole();