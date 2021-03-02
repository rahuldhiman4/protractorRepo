export const COMMON_CONFIG_PAYLOAD = [
    {
        "componentName": "Configuration Values",
        "ownerKeyValue2": "",
        "parentComponentName": "Configurations",
        "settingName": "Configuration Order",
        "settingValue": "950"
    },
    {
        "componentName": "Configuration Values",
        "ownerKeyValue2": "",
        "parentComponentName": "Configurations",
        "settingName": "Configuration Value",
        "settingValue": ""
    },
    {
        "componentName": "Configuration Values",
        "ownerKeyValue2": "",
        "parentComponentName": "Configurations",
        "settingName": "Expression",
        "settingValue": ""
    }
]

export const CREATE_COMMON_CONFIG = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.shared-services-lib:Application Configuration",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "cxc",
        },
        "450000152": {
            "id": 450000152,
            "value": "RESOLUTION_DESCRIPTION_MANDATORY",
        },
        "450000153": {
            "id": 450000153,
            "value": "1",
        },
        "450000155": {
            "id": 450000155,
            "value": 0,
        },
        "450000156": {
            "id": 450000156,
            "value": 1,
        },
        "450000160": {
            "id": 450000160,
            "value": 0,
        },
        "450000165": {
            "id": 450000165,
            "value": 1,
        },
        "450000166": {
            "id": 450000166,
            "value": "1",
        },
        "1000000001": {
            "id": 1000000001,
            "value": "Petramco",
        }
    }
}

export let DELETE_COMMON_CONFIG = {
    "processDefinitionName": "com.bmc.dsm.shared-services-lib:Application Configuration - Validate Delete",
    "processInputValues": {
        "ID": "AGGADGJ7CLNALAQP032VQP032V4MVC"
    },
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand"
}