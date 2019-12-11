import { protractor, ProtractorExpectedConditions } from "protractor";

class ServiceTargetViewConsole {
    EC: ProtractorExpectedConditions = protractor.ExpectedConditions;
    selectors = {
        serviceTargetHeader: '.datasource__heading .padleft13',
        serviceTargetSearchInput: 'searchText',
    }
}
