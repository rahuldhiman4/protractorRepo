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
export const COMMON_CONFIG_PAYLOAD = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.shared-services-lib:Application Configuration - Create Copy and Update",
    "processInputValues": {
        "New Line of Business": "HumanResource",
        "Boolean Value": 1,
        "INDIVIDUAL_ASSIGNMENT_METHOD Value": "10",
        "PropagateLOBChanges": 0,
        "AUTOMATED_TASK_FAILURE_NEXT_ACTION Value": "Do Not Proceed",
        "Review Period": 0,
        "Review Period selection": 0,
        "Value": "false",
        "IDENTITY_VALIDATION Value": "2",
        "Integer Value": "0",
        "NEXT_REVIEW_PERIOD Value": "2629743",
        "ID": null,
        "Description": "Enable the automatic resolution of cases after the completion of the last task in the case"
    }
};

export const COMMON_CONFIG_GET = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.shared-services-lib:Application Configuration - Get",
    "processInputValues": {
        "ID": "AGGADGJYIH7F6AQO1KAYQO1KAYHK32"
    }
}