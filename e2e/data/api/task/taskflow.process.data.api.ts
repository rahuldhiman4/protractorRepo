export const ONE_TASKFLOW = {
    "name": "com.bmc.dsm.bwfa:MyOneTaskProcess",
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": true,
    "guid": "IDGADGG8ECDC0AQ0AFDKQJCDEGR7LH",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2020-05-08T07:35:44.362+0000",
            "lastChangedBy": "Fritz",
            "owner": "Fritz",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2020-05-08T07:35:44.362+0000",
            "lastChangedBy": "Fritz",
            "owner": "Fritz",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "CreateTask",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"My One Task Process\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-35fd70f3-4ed3-4604-9749-58bd25ddc684\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-35fd70f3-4ed3-4604-9749-58bd25ddc684.DynamicData}"
                }
            ],
            "guid": "rx-35fd70f3-4ed3-4604-9749-58bd25ddc684"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-d3e8c7b9-52c3-47ab-817f-3aa2c7d90b7e",
            "targetNode": "rx-35fd70f3-4ed3-4604-9749-58bd25ddc684"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-35fd70f3-4ed3-4604-9749-58bd25ddc684",
            "guid": "rx-5a0ce0d7-f8d8-42b2-b44d-afbb11d45229",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2020-05-08T07:35:44.362+0000",
            "lastChangedBy": "Fritz",
            "owner": "dev_girish",
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
            "documentDefinitionName": "com.bmc.dsm.bwfa:asd",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2020-05-08T07:35:44.362+0000",
            "lastChangedBy": "Fritz",
            "owner": "dev_girish",
            "name": "CaseRecord",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
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
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "lastUpdateTime": "2020-05-08T07:35:44.362+0000",
            "lastChangedBy": "Fritz",
            "owner": "dev_girish",
            "name": "CaseId",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000153,
            "fieldOption": "REQUIRED",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.record.domain.DefaultFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "maxLength": 0,
            "defaultValue": null,
            "searchDefinition": null,
            "namedListDefinition": null,
            "shouldPersistEncrypted": false,
            "shouldPersistHashed": false,
            "associationGuid": null,
            "anyUserAllowedToSubmit": false
        }
    ],
    "outputParams": [

    ],
    "localVariables": [

    ],
    "contextKeyParam": "CaseId",
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -74004,
                "type": "ROLE",
                "name": "Case Application Access"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":900,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":2,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":550,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":6,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"MyOneTask\",\"expanded\":false,\"id\":\"35fd70f3-4ed3-4604-9749-58bd25ddc684\",\"position\":{\"x\":705,\"y\":355},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":7},{\"flowType\":\"normal\",\"id\":\"d3e8c7b9-52c3-47ab-817f-3aa2c7d90b7e\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"35fd70f3-4ed3-4604-9749-58bd25ddc684\"},\"type\":\"rx.SequenceFlow\",\"z\":8},{\"flowType\":\"normal\",\"id\":\"5a0ce0d7-f8d8-42b2-b44d-afbb11d45229\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"35fd70f3-4ed3-4604-9749-58bd25ddc684\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":9}]}",
    "artifacts": [

    ],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {

    }
};

export const TWO_TASKFLOW_SEQUENTIAL = {
    "name": "com.bmc.dsm.bwfa:SequentialTasks",
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": true,
    "guid": "IDGADGG8ECDC0AQBZJ82QBB7W6GHRQ",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2019-12-04T07:44:36.386+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2019-12-04T07:44:36.386+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "Task 1",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 1\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId1\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-c9e588e2-ad6d-47af-9971-9ff87318d405\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-c9e588e2-ad6d-47af-9971-9ff87318d405.DynamicData}"
                }
            ],
            "guid": "rx-c9e588e2-ad6d-47af-9971-9ff87318d405"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "Task 2",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 2\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId2\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-c72b1778-7b21-45cb-8471-2a9191dce366\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-c72b1778-7b21-45cb-8471-2a9191dce366.DynamicData}"
                }
            ],
            "guid": "rx-c72b1778-7b21-45cb-8471-2a9191dce366"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-1594427f-e031-40f5-b635-98ca975c9de1",
            "targetNode": "rx-c9e588e2-ad6d-47af-9971-9ff87318d405"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-c9e588e2-ad6d-47af-9971-9ff87318d405",
            "guid": "rx-54417e0c-7c2f-43ca-a57b-cbee5185e2ec",
            "targetNode": "rx-c72b1778-7b21-45cb-8471-2a9191dce366"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-c72b1778-7b21-45cb-8471-2a9191dce366",
            "guid": "rx-7607148b-5771-4e36-8e11-682b863800b3",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2019-12-04T07:44:36.386+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
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
            "documentDefinitionName": "com.bmc.dsm.bwfa:Sequential Tasks",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2019-12-04T07:44:36.386+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseRecord",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
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
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "lastUpdateTime": "2019-12-04T07:44:36.386+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseId",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000153,
            "fieldOption": "REQUIRED",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.record.domain.DefaultFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "maxLength": 0,
            "defaultValue": null,
            "searchDefinition": null,
            "namedListDefinition": null,
            "shouldPersistEncrypted": false,
            "shouldPersistHashed": false,
            "associationGuid": null,
            "anyUserAllowedToSubmit": false
        }
    ],
    "outputParams": [],
    "localVariables": [],
    "contextKeyParam": "CaseId",
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -74004,
                "type": "ROLE",
                "name": "Case Application Access"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":50,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":1,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":900,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":2,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"Task 1\",\"expanded\":false,\"id\":\"c9e588e2-ad6d-47af-9971-9ff87318d405\",\"position\":{\"x\":265,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":9},{\"flowType\":\"normal\",\"id\":\"1594427f-e031-40f5-b635-98ca975c9de1\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"c9e588e2-ad6d-47af-9971-9ff87318d405\"},\"type\":\"rx.SequenceFlow\",\"z\":10},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"Task 2\",\"expanded\":false,\"id\":\"c72b1778-7b21-45cb-8471-2a9191dce366\",\"position\":{\"x\":580,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":12},{\"flowType\":\"normal\",\"id\":\"54417e0c-7c2f-43ca-a57b-cbee5185e2ec\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"c9e588e2-ad6d-47af-9971-9ff87318d405\"},\"target\":{\"id\":\"c72b1778-7b21-45cb-8471-2a9191dce366\"},\"type\":\"rx.SequenceFlow\",\"z\":13},{\"flowType\":\"normal\",\"id\":\"7607148b-5771-4e36-8e11-682b863800b3\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"c72b1778-7b21-45cb-8471-2a9191dce366\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":14}]}",
    "artifacts": [],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {}
};

export const TWO_TASKFLOW_PARALLEL = {
    "name": "com.bmc.dsm.bwfa:ParallelTasks",
    "description": "Case - TaskFlow Sample Process",
    "overlayGroupId": "Petramco",
    "developerId": "com.bmc.dsm",
    "scope": "PUBLIC",
    "internal": true,
    "guid": "IDGADGG8ECDC0AQBZ1BIQBB953G99A",
    "flowElements": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
            "lastUpdateTime": "2019-12-04T08:17:33.213+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "End",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
            "event": null
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
            "lastUpdateTime": "2019-12-04T08:17:33.213+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "qkatawazi",
            "name": "Start",
            "tags": null,
            "description": null,
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "Task 2",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 2\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId2\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-21050d4f-bb2d-4790-b511-f19b1bb9d4f3\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-21050d4f-bb2d-4790-b511-f19b1bb9d4f3.DynamicData}"
                }
            ],
            "guid": "rx-21050d4f-bb2d-4790-b511-f19b1bb9d4f3"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
            "name": "Task 1",
            "description": null,
            "multiInstanceLoopDefinition": null,
            "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
            "inputMap": [
                {
                    "assignTarget": "caseId",
                    "expression": "${processContext.CaseId}"
                },
                {
                    "assignTarget": "taskSummary",
                    "expression": "\"New Task 1\""
                },
                {
                    "assignTarget": "taskTemplateId",
                    "expression": "\"templateId1\""
                },
                {
                    "assignTarget": "activityId",
                    "expression": "\"rx-fa8dd65e-4114-448c-b7af-4d74e40ad427\""
                }
            ],
            "outputMap": [
                {
                    "assignTarget": "DynamicData",
                    "expression": "${activityResults.rx-fa8dd65e-4114-448c-b7af-4d74e40ad427.DynamicData}"
                }
            ],
            "guid": "rx-fa8dd65e-4114-448c-b7af-4d74e40ad427"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
            "name": "Parallel Gateway",
            "description": "",
            "guid": "rx-38e194bc-b53d-4d70-998a-82b7a4652720"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-38e194bc-b53d-4d70-998a-82b7a4652720",
            "guid": "rx-a30e6e95-dc7e-4c01-97c4-97812f539e14",
            "targetNode": "rx-fa8dd65e-4114-448c-b7af-4d74e40ad427"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
            "guid": "rx-8d8d46b9-d9c0-4477-a1bc-21d17be61e2a",
            "targetNode": "rx-38e194bc-b53d-4d70-998a-82b7a4652720"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-fa8dd65e-4114-448c-b7af-4d74e40ad427",
            "guid": "rx-ea914e39-9698-4ac3-b5e2-02d76fc02741",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-21050d4f-bb2d-4790-b511-f19b1bb9d4f3",
            "guid": "rx-c564a9a5-4223-4313-a476-95c958e7e2b5",
            "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
            "name": "Sequence Flow",
            "description": "",
            "sourceNode": "rx-38e194bc-b53d-4d70-998a-82b7a4652720",
            "guid": "rx-b9db4b04-8c54-4140-9e47-299a8929b5fe",
            "targetNode": "rx-21050d4f-bb2d-4790-b511-f19b1bb9d4f3"
        }
    ],
    "inputParams": [
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
            "lastUpdateTime": "2019-12-04T08:17:33.213+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
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
            "documentDefinitionName": "com.bmc.dsm.bwfa:Parallel Tasks",
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
            "lastUpdateTime": "2019-12-04T08:17:33.213+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseRecord",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000152,
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
            "recordDefinitionName": "com.bmc.dsm.case-lib:Case",
            "useSampleData": false,
            "anyUserAllowedToSubmit": false
        },
        {
            "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
            "lastUpdateTime": "2019-12-04T08:17:33.213+0000",
            "lastChangedBy": "qkatawazi",
            "owner": "dev_girish",
            "name": "CaseId",
            "tags": null,
            "description": "",
            "overlayGroupId": null,
            "developerId": null,
            "internal": false,
            "id": 450000153,
            "fieldOption": "REQUIRED",
            "permissions": null,
            "fieldTypeName": "com.bmc.arsys.rx.services.record.domain.DefaultFieldType",
            "isInherited": false,
            "explicitPermissions": null,
            "overlayDescriptor": null,
            "fieldMapping": null,
            "allowPermissionsOverlay": true,
            "allowOtherPropertiesOverlay": true,
            "auditOption": null,
            "maxLength": 0,
            "defaultValue": null,
            "searchDefinition": null,
            "namedListDefinition": null,
            "shouldPersistEncrypted": false,
            "shouldPersistHashed": false,
            "associationGuid": null,
            "anyUserAllowedToSubmit": false
        }
    ],
    "outputParams": [],
    "localVariables": [],
    "contextKeyParam": "CaseId",
    "isEnabled": true,
    "permissions": [
        {
            "ownerId": {
                "value": -74004,
                "type": "ROLE",
                "name": "Case Application Access"
            },
            "type": "READ"
        }
    ],
    "layout": "{\"cells\":[{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"Task 2\",\"expanded\":false,\"id\":\"21050d4f-bb2d-4790-b511-f19b1bb9d4f3\",\"position\":{\"x\":385,\"y\":345},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":30},{\"id\":\"38e194bc-b53d-4d70-998a-82b7a4652720\",\"position\":{\"x\":235,\"y\":355},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":32,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"b9db4b04-8c54-4140-9e47-299a8929b5fe\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"38e194bc-b53d-4d70-998a-82b7a4652720\"},\"target\":{\"id\":\"21050d4f-bb2d-4790-b511-f19b1bb9d4f3\"},\"type\":\"rx.SequenceFlow\",\"z\":33},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":595,\"y\":360},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":34,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"c564a9a5-4223-4313-a476-95c958e7e2b5\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"21050d4f-bb2d-4790-b511-f19b1bb9d4f3\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":35},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":115,\"y\":360},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":36,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"8d8d46b9-d9c0-4477-a1bc-21d17be61e2a\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"38e194bc-b53d-4d70-998a-82b7a4652720\"},\"type\":\"rx.SequenceFlow\",\"z\":37},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"Task 1\",\"expanded\":false,\"id\":\"fa8dd65e-4114-448c-b7af-4d74e40ad427\",\"position\":{\"x\":385,\"y\":245},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":38},{\"flowType\":\"normal\",\"id\":\"a30e6e95-dc7e-4c01-97c4-97812f539e14\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"38e194bc-b53d-4d70-998a-82b7a4652720\"},\"target\":{\"id\":\"fa8dd65e-4114-448c-b7af-4d74e40ad427\"},\"type\":\"rx.SequenceFlow\",\"z\":39},{\"flowType\":\"normal\",\"id\":\"ea914e39-9698-4ac3-b5e2-02d76fc02741\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"fa8dd65e-4114-448c-b7af-4d74e40ad427\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":39}]}",
    "artifacts": [],
    "runAsUser": false,
    "synchronous": true,
    "overlayDescriptor": null,
    "allowOverlay": false,
    "localizableStrings": {}
};