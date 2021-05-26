export const NOTIFICATION_CREATE_DOCUMENT = {
    "name": "com.bmc.dsm.task-lib:Actionable Notification Test", "allowOverlay": false, "scope": "BUNDLE", "documentSchema": "{}"
};

export const NOTIFICATION_DELETE_DOCUMENT = {
    "resourceType": "com.bmc.arsys.rx.application.document.command.DeleteDocumentDefinitionsCommand", "definitionNames": ["com.bmc.dsm.task-lib:Actionable Notification Test"]
};

export const NOTIFICATION_DELETE_PROCESS = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.DeleteProcessDefinitionsCommand", "definitionNames": ["com.bmc.dsm.task-lib:Actionable Notification Process"]
};

export const NOTIIFCATION_CREATE_PROCESS = {
    "lastChangedBy": "qkatawazi",
    "owner": "dev_npar",
    "name": "com.bmc.dsm.task-lib:Actionable Notification Process",
    "guid": "rx-11efce50-0x00-4be5-9dae-7s504f387188",
    "tags": [
        "- Global -"
    ],
    "description": "Task - Sample Automated Task Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": true,
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-62d3b19f-eca8-4f53-9e60-ea36bd5bf7ac",
            "sourceNode": "rx-fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e",
            "targetNode": "rx-1f896271-74c6-4a47-9d04-0b134cc49c6c",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Send Notification Using Event",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-1f896271-74c6-4a47-9d04-0b134cc49c6c",
            "multiInstanceLoopDefinition": null,
            "actionTypeName": "com.bmc.dsm.notification-lib:sendNotificationUsingEvent",
            "inputMap": [
                {
                    "assignTarget": "eventName",
                    "expression": "\"Actionable Notification Event\""
                },
                {
                    "assignTarget": "moduleName",
                    "expression": "\"Cases\""
                },
                {
                    "assignTarget": "sourceRecordInstanceId",
                    "expression": "${processContext.Record Instance.PARENT_ID}"
                }
            ],
            "outputMap": [

            ],
            "runAsUser": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6e39c4e8-a18a-4774-a510-6be901fe66ce",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6bf1ccfb-6466-408c-80d1-bb9d01264a32",
            "sourceNode": "rx-1f896271-74c6-4a47-9d04-0b134cc49c6c",
            "targetNode": "rx-6e39c4e8-a18a-4774-a510-6be901fe66ce",
            "condition": ""
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_npar",
            "name": "DynamicData",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000151,
            "fieldOption": "OPTIONAL",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2019-07-15T07:45:10.981+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_npar",
            "name": "Record Instance",
            "tags": null,
            "description": "Current task record",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 57000,
            "fieldOption": "OPTIONAL",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.task-lib:Task",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false
        }
    ],
    "outputParams": [

    ],
    "localVariables": [

    ],
    "contextKeyParam": null,
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -20302,
                "type": "ROLE",
                "name": "Task User"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -20300,
                "type": "ROLE",
                "name": "Task Administrator"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -20303,
                "type": "ROLE",
                "name": "Task Viewer"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -20301,
                "type": "ROLE",
                "name": "Task Manager"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"6e39c4e8-a18a-4774-a510-6be901fe66ce\",\"position\":{\"x\":900,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":2,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e\",\"position\":{\"x\":50,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":4,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"content\":\"Send Notification Using Event\",\"id\":\"1f896271-74c6-4a47-9d04-0b134cc49c6c\",\"position\":{\"x\":490,\"y\":365},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessAction\",\"z\":7},{\"flowType\":\"normal\",\"id\":\"62d3b19f-eca8-4f53-9e60-ea36bd5bf7ac\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e\"},\"target\":{\"id\":\"1f896271-74c6-4a47-9d04-0b134cc49c6c\"},\"type\":\"rx.SequenceFlow\",\"z\":8},{\"flowType\":\"normal\",\"id\":\"6bf1ccfb-6466-408c-80d1-bb9d01264a32\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"1f896271-74c6-4a47-9d04-0b134cc49c6c\"},\"target\":{\"id\":\"6e39c4e8-a18a-4774-a510-6be901fe66ce\"},\"type\":\"rx.SequenceFlow\",\"z\":9}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const NOTIFICATION_UPDATE_PROCESS = {
    "lastChangedBy": "tadmin",
    "owner": "dev_npar",
    "name": "com.bmc.dsm.task-lib:Actionable Notification Process",
    "tags": [
        "- Global -"
    ],
    "description": "Task - Sample Automated Task Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": true,
    "guid": "rx-11efce50-0x00-4be5-9dae-7s504f387188",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-62d3b19f-eca8-4f53-9e60-ea36bd5bf7ac",
            "sourceNode": "rx-fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e",
            "targetNode": "rx-1f896271-74c6-4a47-9d04-0b134cc49c6c",
            "condition": ""
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ServiceTaskDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Send Notification Using Event",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-1f896271-74c6-4a47-9d04-0b134cc49c6c",
            "multiInstanceLoopDefinition": null,
            "actionTypeName": "com.bmc.dsm.notification-lib:sendNotificationUsingEvent",
            "inputMap": [
                {
                    "assignTarget": "eventName",
                    "expression": "\"Actionable Notification Event\""
                },
                {
                    "assignTarget": "moduleName",
                    "expression": "\"Cases\""
                },
                {
                    "assignTarget": "sourceRecordInstanceId",
                    "expression": "${processContext.Record Instance.PARENT_ID}"
                }
            ],
            "outputMap": [

            ],
            "runAsUser": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6e39c4e8-a18a-4774-a510-6be901fe66ce",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "tadmin",
            "name": "Sequence Flow",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-6bf1ccfb-6466-408c-80d1-bb9d01264a32",
            "sourceNode": "rx-1f896271-74c6-4a47-9d04-0b134cc49c6c",
            "targetNode": "rx-6e39c4e8-a18a-4774-a510-6be901fe66ce",
            "condition": ""
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "dev_npar",
            "name": "DynamicData",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000151,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "documentDefinitionName": "com.bmc.dsm.task-lib:Actionable Notification Test",
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2019-07-15T08:18:39.319+0000",
            "lastChangedBy": "tadmin",
            "owner": "dev_npar",
            "name": "Record Instance",
            "tags": null,
            "description": "Current task record",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 57000,
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "recordDefinitionName": "com.bmc.dsm.task-lib:Task",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false,
            "fieldOption": "OPTIONAL"
        }
    ],
    "outputParams": [

    ],
    "localVariables": [

    ],
    "contextKeyParam": null,
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -20302,
                "type": "ROLE",
                "name": "Task User"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -20300,
                "type": "ROLE",
                "name": "Task Administrator"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -20303,
                "type": "ROLE",
                "name": "Task Viewer"
            },
            "type": "READ"
        },
        {
            "ownerId": {
                "value": -20301,
                "type": "ROLE",
                "name": "Task Manager"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"6e39c4e8-a18a-4774-a510-6be901fe66ce\",\"position\":{\"x\":900,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":2,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e\",\"position\":{\"x\":50,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":4,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"content\":\"Send Notification Using Event\",\"id\":\"1f896271-74c6-4a47-9d04-0b134cc49c6c\",\"position\":{\"x\":490,\"y\":365},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.ProcessAction\",\"z\":7},{\"flowType\":\"normal\",\"id\":\"62d3b19f-eca8-4f53-9e60-ea36bd5bf7ac\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e\"},\"target\":{\"id\":\"1f896271-74c6-4a47-9d04-0b134cc49c6c\"},\"type\":\"rx.SequenceFlow\",\"z\":8},{\"flowType\":\"normal\",\"id\":\"6bf1ccfb-6466-408c-80d1-bb9d01264a32\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"1f896271-74c6-4a47-9d04-0b134cc49c6c\"},\"target\":{\"id\":\"6e39c4e8-a18a-4774-a510-6be901fe66ce\"},\"type\":\"rx.SequenceFlow\",\"z\":9}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
}