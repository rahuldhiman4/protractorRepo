export const ONE_TASKFLOW = {
  "name": "com.bmc.dsm.bwfa:OneTask",
  "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
  "description": "",
  "overlayGroupId": "1",
  "scope": "PUBLIC",
  "tags": [
    "Petramco"
  ],
  "flowElements": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
      "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "name": "New Task",
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
          "expression": "\"New Task\""
        },
        {
          "assignTarget": "taskTemplateId",
          "expression": "\"templateId\""
        },
        {
          "assignTarget": "activityId",
          "expression": "\"rx-a85fe84b-380e-4883-90f2-ac283f107d1a\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-a85fe84b-380e-4883-90f2-ac283f107d1a.DynamicData}"
        }
      ],
      "guid": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
      "guid": "rx-54c41834-617b-44f5-8539-55cada06a682",
      "targetNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
      "guid": "rx-bf2ce07c-51e4-466e-b515-84462905c554",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
    }
  ],
  "inputParams": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
      "lastChangedBy": "tadmin",
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
      "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
      "anyUserAllowedToSubmit": false
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
      "lastChangedBy": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:09:23.598+0000",
      "lastChangedBy": "tadmin",
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
  "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":715,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":10,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":300,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":12,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task\",\"expanded\":false,\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\",\"position\":{\"x\":475,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":11},{\"flowType\":\"normal\",\"id\":\"54c41834-617b-44f5-8539-55cada06a682\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"type\":\"rx.SequenceFlow\",\"z\":13},{\"flowType\":\"normal\",\"id\":\"bf2ce07c-51e4-466e-b515-84462905c554\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":14}]}",
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
  "name": "com.bmc.dsm.bwfa:TwoSequentialTasks",
  "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
  "description": "",
  "overlayGroupId": "1",
  "scope": "PUBLIC",
  "tags": [
    "Petramco"
  ],
  "flowElements": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
      "name": "New Task 1",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
      "multiInstanceLoopDefinition": null,
      "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
      "sampleProcessDefinitionName": null,
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
          "expression": "\"rx-a85fe84b-380e-4883-90f2-ac283f107d1a\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-a85fe84b-380e-4883-90f2-ac283f107d1a.DynamicData}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "name": "New Task 2",
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
          "expression": "\"rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e.DynamicData}"
        }
      ],
      "guid": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-54c41834-617b-44f5-8539-55cada06a682",
      "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
      "targetNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
      "guid": "rx-fc8e08c5-b3fb-4fc1-b8e2-322d5b2dcc0e",
      "targetNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e",
      "guid": "rx-6dc58c10-d67f-4cae-a3db-1da1dca6016c",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
    }
  ],
  "inputParams": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
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
      "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
      "anyUserAllowedToSubmit": false
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:10:39.107+0000",
      "lastChangedBy": "tadmin",
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
  "layout": "{\"cells\":[{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\",\"position\":{\"x\":380,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":23},{\"flowType\":\"normal\",\"id\":\"54c41834-617b-44f5-8539-55cada06a682\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"type\":\"rx.SequenceFlow\",\"z\":24},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":715,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":10,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":270,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":16,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\",\"position\":{\"x\":545,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":25},{\"flowType\":\"normal\",\"id\":\"fc8e08c5-b3fb-4fc1-b8e2-322d5b2dcc0e\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"target\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"type\":\"rx.SequenceFlow\",\"z\":26},{\"flowType\":\"normal\",\"id\":\"6dc58c10-d67f-4cae-a3db-1da1dca6016c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":26}]}",
  "artifacts": [

  ],
  "runAsUser": false,
  "synchronous": false,
  "overlayDescriptor": null,
  "allowOverlay": false,
  "localizableStrings": {

  }
};

export const TWO_TASKFLOW_PARALLEL = {
  "name": "com.bmc.dsm.bwfa:TwoParallelTasks",
  "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
  "description": "",
  "overlayGroupId": "1",
  "scope": "PUBLIC",
  "tags": [
    "Petramco"
  ],
  "flowElements": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
      "name": "New Task 1",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
      "multiInstanceLoopDefinition": null,
      "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
      "sampleProcessDefinitionName": null,
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
          "expression": "\"rx-a85fe84b-380e-4883-90f2-ac283f107d1a\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-a85fe84b-380e-4883-90f2-ac283f107d1a.DynamicData}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
      "name": "New Task 2",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e",
      "multiInstanceLoopDefinition": null,
      "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
      "sampleProcessDefinitionName": null,
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
          "expression": "\"rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e.DynamicData}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-54c41834-617b-44f5-8539-55cada06a682",
      "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
      "targetNode": "rx-75e35988-71f9-4698-ab1d-52ed8418f351"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-6dc58c10-d67f-4cae-a3db-1da1dca6016c",
      "sourceNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a",
      "guid": "rx-832c0a3a-858d-49d7-90a3-15c93ef0b1c8",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
      "name": "Parallel Gateway",
      "description": "",
      "guid": "rx-75e35988-71f9-4698-ab1d-52ed8418f351"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-75e35988-71f9-4698-ab1d-52ed8418f351",
      "guid": "rx-c75e5181-e054-4188-878f-2104b5fe5cc8",
      "targetNode": "rx-a85fe84b-380e-4883-90f2-ac283f107d1a"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-75e35988-71f9-4698-ab1d-52ed8418f351",
      "guid": "rx-ec836774-04e4-4c95-8bea-94415f99355d",
      "targetNode": "rx-ded95e7d-9580-4cfa-b46a-9ee51e1a279e"
    }
  ],
  "inputParams": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
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
      "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
      "anyUserAllowedToSubmit": false
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:15:23.819+0000",
      "lastChangedBy": "tadmin",
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
  "layout": "{\"cells\":[{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\",\"position\":{\"x\":480,\"y\":460},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":45},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":640,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":49,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\",\"position\":{\"x\":480,\"y\":305},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":51},{\"flowType\":\"normal\",\"id\":\"54c41834-617b-44f5-8539-55cada06a682\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\"},\"type\":\"rx.SequenceFlow\",\"z\":44},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":255,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":43,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"6dc58c10-d67f-4cae-a3db-1da1dca6016c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":50},{\"flowType\":\"normal\",\"id\":\"832c0a3a-858d-49d7-90a3-15c93ef0b1c8\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":52},{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\",\"position\":{\"x\":360,\"y\":390},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":40,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"c75e5181-e054-4188-878f-2104b5fe5cc8\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\"},\"target\":{\"id\":\"a85fe84b-380e-4883-90f2-ac283f107d1a\"},\"type\":\"rx.SequenceFlow\",\"z\":52},{\"flowType\":\"normal\",\"id\":\"ec836774-04e4-4c95-8bea-94415f99355d\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"75e35988-71f9-4698-ab1d-52ed8418f351\"},\"target\":{\"id\":\"ded95e7d-9580-4cfa-b46a-9ee51e1a279e\"},\"type\":\"rx.SequenceFlow\",\"vertices\":[{\"x\":380,\"y\":490}],\"z\":46}]}",
  "artifacts": [

  ],
  "runAsUser": false,
  "synchronous": false,
  "overlayDescriptor": null,
  "allowOverlay": false,
  "localizableStrings": {

  }
};

export const THREE_TASKFLOW_SEQUENTIAL = {
  "name": "com.bmc.dsm.bwfa:TwoParallelTasks",
  "guid": "rx-2f8669a4-1ca0-419b-91d8-e0bf9720d7hf",
  "description": "",
  "overlayGroupId": "1",
  "scope": "PUBLIC",
  "tags": [
    "Petramco"
  ],
  "flowElements": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
      "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
      "lastChangedBy": "tadmin",
      "owner": "tadmin",
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
      "name": "New Task 1",
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
          "expression": "\"rx-30773364-abcd-497c-9614-58317ac953cd\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-30773364-abcd-497c-9614-58317ac953cd.DynamicData}"
        }
      ],
      "guid": "rx-30773364-abcd-497c-9614-58317ac953cd"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "name": "New Task 2",
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
          "expression": "\"rx-4f6416e2-5603-4c31-b00b-43b6131d1b70\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-4f6416e2-5603-4c31-b00b-43b6131d1b70.DynamicData}"
        }
      ],
      "guid": "rx-4f6416e2-5603-4c31-b00b-43b6131d1b70"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "name": "New Task 3",
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
          "expression": "\"New Task 3\""
        },
        {
          "assignTarget": "taskTemplateId",
          "expression": "\"templateId3\""
        },
        {
          "assignTarget": "activityId",
          "expression": "\"rx-3f299725-c10d-4b6c-9d07-56109399b465\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-3f299725-c10d-4b6c-9d07-56109399b465.DynamicData}"
        }
      ],
      "guid": "rx-3f299725-c10d-4b6c-9d07-56109399b465"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
      "guid": "rx-0f520b05-f00f-4b3d-b731-3904e9bb4f65",
      "targetNode": "rx-30773364-abcd-497c-9614-58317ac953cd"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-30773364-abcd-497c-9614-58317ac953cd",
      "guid": "rx-19908127-720f-4cce-a275-acea0bff1160",
      "targetNode": "rx-4f6416e2-5603-4c31-b00b-43b6131d1b70"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-4f6416e2-5603-4c31-b00b-43b6131d1b70",
      "guid": "rx-3da5e264-268d-4167-a5af-13de0b5fe412",
      "targetNode": "rx-3f299725-c10d-4b6c-9d07-56109399b465"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-3f299725-c10d-4b6c-9d07-56109399b465",
      "guid": "rx-f24cb1b5-b217-4521-8a62-d122fa2ab19c",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
    }
  ],
  "inputParams": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
      "lastChangedBy": "tadmin",
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
      "documentDefinitionName": "com.bmc.dsm.ticketing-lib:Sample JSON Document",
      "anyUserAllowedToSubmit": false
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
      "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
      "lastChangedBy": "tadmin",
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
      "lastUpdateTime": "2020-06-15T18:22:23.329+0000",
      "lastChangedBy": "tadmin",
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
  "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":800,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":55,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":200,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":51,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"30773364-abcd-497c-9614-58317ac953cd\",\"position\":{\"x\":300,\"y\":380},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":64},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"4f6416e2-5603-4c31-b00b-43b6131d1b70\",\"position\":{\"x\":475,\"y\":380},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":59},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 3\",\"expanded\":false,\"id\":\"3f299725-c10d-4b6c-9d07-56109399b465\",\"position\":{\"x\":635,\"y\":380},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":56},{\"flowType\":\"normal\",\"id\":\"0f520b05-f00f-4b3d-b731-3904e9bb4f65\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"30773364-abcd-497c-9614-58317ac953cd\"},\"type\":\"rx.SequenceFlow\",\"z\":65},{\"flowType\":\"normal\",\"id\":\"19908127-720f-4cce-a275-acea0bff1160\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"30773364-abcd-497c-9614-58317ac953cd\"},\"target\":{\"id\":\"4f6416e2-5603-4c31-b00b-43b6131d1b70\"},\"type\":\"rx.SequenceFlow\",\"z\":65},{\"flowType\":\"normal\",\"id\":\"3da5e264-268d-4167-a5af-13de0b5fe412\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"4f6416e2-5603-4c31-b00b-43b6131d1b70\"},\"target\":{\"id\":\"3f299725-c10d-4b6c-9d07-56109399b465\"},\"type\":\"rx.SequenceFlow\",\"z\":62},{\"flowType\":\"normal\",\"id\":\"f24cb1b5-b217-4521-8a62-d122fa2ab19c\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"3f299725-c10d-4b6c-9d07-56109399b465\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":63}]}",
  "artifacts": [

  ],
  "runAsUser": false,
  "synchronous": false,
  "overlayDescriptor": null,
  "allowOverlay": false,
  "localizableStrings": {

  }
};

export const PROCESS_DOCUMENT = {
  "allowOverlay": false,
  "name": "com.bmc.dsm.bwfa:DocName",
  "scope": "PUBLIC",
  "documentSchema": "{}"
};

export const DYNAMIC_DATA_DEFINITION = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "com.bmc.dsm.ticketing-lib:DynamicDataDefinition",
  "fieldInstances": {
      "450000153": {
          "id": 450000153,
          "value": "ProvideDocumentGuid"
      },
      "450000154": {
          "id": 450000154,
          "value": "ProvideCaseTemplateGuid"
      },
      "450000156": {
          "id": 450000156,
          "value": "[]"
      },
      "450000159": {
          "id": 450000159,
          "value": "com.bmc.dsm.bwfa:DocName"
      }
  }
}

export const DRDMV_15000 = {
  "name": "com.bmc.dsm.bwfa:ConditionalTemplate",
  "tags": [
    "Petramco"
  ],
  "description": "",
  "overlayGroupId": "1",
  "scope": "PUBLIC",
  "guid": "IDGADGG8ECDC0AQ5KP1TQ4M6DZ2VFR",
  "flowElements": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-ba5d6283-c2d6-430c-83ca-8ba2811ed4a1",
      "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
      "targetNode": "rx-62e85040-244f-4256-bad1-51e54456912d",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-df537e84-50cb-447a-a9b7-753ed7e412b2",
      "sourceNode": "rx-62e85040-244f-4256-bad1-51e54456912d",
      "targetNode": "rx-1e30939f-4916-4393-99a1-15b7de467283",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "New Task 1",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-1e30939f-4916-4393-99a1-15b7de467283",
      "multiInstanceLoopDefinition": null,
      "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
      "sampleProcessDefinitionName": null,
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
          "expression": "\"rx-1e30939f-4916-4393-99a1-15b7de467283\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-1e30939f-4916-4393-99a1-15b7de467283.DynamicData}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "New Task 2",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-4576ab15-85b4-4f6b-aa6c-079ff417c16f",
      "multiInstanceLoopDefinition": null,
      "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
      "sampleProcessDefinitionName": null,
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
          "expression": "\"rx-4576ab15-85b4-4f6b-aa6c-079ff417c16f\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-4576ab15-85b4-4f6b-aa6c-079ff417c16f.DynamicData}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "New Task 3",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-aad7c5c4-7af9-47da-b07a-9c749a7ceca7",
      "multiInstanceLoopDefinition": null,
      "calledProcessDefinitionName": "com.bmc.dsm.task-lib:Create Task",
      "sampleProcessDefinitionName": null,
      "inputMap": [
        {
          "assignTarget": "caseId",
          "expression": "${processContext.CaseId}"
        },
        {
          "assignTarget": "taskSummary",
          "expression": "\"New Task 3\""
        },
        {
          "assignTarget": "taskTemplateId",
          "expression": "\"templateId3\""
        },
        {
          "assignTarget": "activityId",
          "expression": "\"rx-aad7c5c4-7af9-47da-b07a-9c749a7ceca7\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-aad7c5c4-7af9-47da-b07a-9c749a7ceca7.DynamicData}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-034f9628-9542-443d-b7ce-e15daaca230d",
      "sourceNode": "rx-1e30939f-4916-4393-99a1-15b7de467283",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
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
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-6b4fe18e-3e0c-4070-a9e5-468eaeee0494",
      "sourceNode": "rx-4576ab15-85b4-4f6b-aa6c-079ff417c16f",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-e0d3bf94-5037-49d4-aca9-a4a902bf9e93",
      "sourceNode": "rx-62e85040-244f-4256-bad1-51e54456912d",
      "targetNode": "rx-d8c39679-9401-426c-bd48-ba8aa4b7ebfb",
      "condition": "${processContext.CaseRecord.Priority} = \"Critical\""
    },

    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-546df3f9-f561-4d80-bacf-5bea6cd803ef",
      "sourceNode": "rx-aad7c5c4-7af9-47da-b07a-9c749a7ceca7",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-51ad9035-79a9-4608-afe7-6530e3a319e5",
      "sourceNode": "rx-d8c39679-9401-426c-bd48-ba8aa4b7ebfb",
      "targetNode": "rx-aad7c5c4-7af9-47da-b07a-9c749a7ceca7",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.ExclusiveGatewayDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Exclusive Gateway",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-62e85040-244f-4256-bad1-51e54456912d"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Parallel Gateway",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-d8c39679-9401-426c-bd48-ba8aa4b7ebfb"
    },


    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Sequence Flow",
      "tags": null,
      "description": "",
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-fa74c81b-a295-4dad-9258-70415668b2ce",
      "sourceNode": "rx-d8c39679-9401-426c-bd48-ba8aa4b7ebfb",
      "targetNode": "rx-4576ab15-85b4-4f6b-aa6c-079ff417c16f",
      "condition": ""
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
      "lastChangedBy": "Fritz",
      "owner": "Fritz",
      "name": "Start",
      "tags": null,
      "description": null,
      "overlayGroupId": null,
      "developerId": null,
      "internal": false,
      "guid": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644"
    }
  ],
  "inputParams": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
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
      "documentDefinitionName": "com.bmc.dsm.bwfa:Conditional Template",
      "anyUserAllowedToSubmit": false
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
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
      "lastUpdateTime": "2020-08-24T14:52:41.391+0000",
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
  "layout": "{\"cells\":[{\"flowType\":\"normal\",\"id\":\"ba5d6283-c2d6-430c-83ca-8ba2811ed4a1\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"62e85040-244f-4256-bad1-51e54456912d\"},\"type\":\"rx.SequenceFlow\",\"z\":58},{\"flowType\":\"default\",\"id\":\"df537e84-50cb-447a-a9b7-753ed7e412b2\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"62e85040-244f-4256-bad1-51e54456912d\"},\"target\":{\"id\":\"1e30939f-4916-4393-99a1-15b7de467283\"},\"type\":\"rx.SequenceFlow\",\"z\":56},{\"flowType\":\"normal\",\"id\":\"034f9628-9542-443d-b7ce-e15daaca230d\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"1e30939f-4916-4393-99a1-15b7de467283\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":56},{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":570,\"y\":350},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":52,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"6b4fe18e-3e0c-4070-a9e5-468eaeee0494\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"4576ab15-85b4-4f6b-aa6c-079ff417c16f\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":53},{\"flowType\":\"conditional\",\"id\":\"e0d3bf94-5037-49d4-aca9-a4a902bf9e93\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"62e85040-244f-4256-bad1-51e54456912d\"},\"target\":{\"id\":\"d8c39679-9401-426c-bd48-ba8aa4b7ebfb\"},\"type\":\"rx.SequenceFlow\",\"z\":54},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 3\",\"expanded\":false,\"id\":\"aad7c5c4-7af9-47da-b07a-9c749a7ceca7\",\"position\":{\"x\":365,\"y\":430},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":50},{\"flowType\":\"normal\",\"id\":\"546df3f9-f561-4d80-bacf-5bea6cd803ef\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"aad7c5c4-7af9-47da-b07a-9c749a7ceca7\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":53},{\"flowType\":\"normal\",\"id\":\"51ad9035-79a9-4608-afe7-6530e3a319e5\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"d8c39679-9401-426c-bd48-ba8aa4b7ebfb\"},\"target\":{\"id\":\"aad7c5c4-7af9-47da-b07a-9c749a7ceca7\"},\"type\":\"rx.SequenceFlow\",\"z\":51},{\"id\":\"62e85040-244f-4256-bad1-51e54456912d\",\"position\":{\"x\":205,\"y\":390},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ExclusiveGateway\",\"z\":23,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"d8c39679-9401-426c-bd48-ba8aa4b7ebfb\",\"position\":{\"x\":310,\"y\":390},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":27,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2 Memory\",\"expanded\":false,\"id\":\"4576ab15-85b4-4f6b-aa6c-079ff417c16f\",\"position\":{\"x\":365,\"y\":335},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":46},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"1e30939f-4916-4393-99a1-15b7de467283\",\"position\":{\"x\":365,\"y\":245},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":55},{\"flowType\":\"normal\",\"id\":\"fa74c81b-a295-4dad-9258-70415668b2ce\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"d8c39679-9401-426c-bd48-ba8aa4b7ebfb\"},\"target\":{\"id\":\"4576ab15-85b4-4f6b-aa6c-079ff417c16f\"},\"type\":\"rx.SequenceFlow\",\"z\":47},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":105,\"y\":395},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":57,\"attrs\":{\".label\":{\"text\":\"\"}}}]}",
  "artifacts": [

  ],
  "runAsUser": false,
  "synchronous": false,
  "overlayDescriptor": null,
  "allowOverlay": false,
  "localizableStrings": {

  }
};

export const THREE_TASKFLOW_SEQUENTIAL_PARALLEL = {
  "name": "com.bmc.dsm.bwfa:SequentialParallel",
  "tags": [
    "Petramco"
  ],
  "description": "Case - TaskFlow Sample Process",
  "overlayGroupId": "1",
  "scope": "PUBLIC",
  "guid": "IDGADGG8ECDC0AQ5PY9DQ4RPEGFYZO",
  "flowElements": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
      "lastUpdateTime": "2020-08-27T10:59:28.002+0000",
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
      "lastUpdateTime": "2020-08-27T10:59:28.002+0000",
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
      "name": "New Task 3",
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
          "expression": "\"New Task 3\""
        },
        {
          "assignTarget": "taskTemplateId",
          "expression": "\"templateId3\""
        },
        {
          "assignTarget": "activityId",
          "expression": "\"rx-ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43.DynamicData}"
        }
      ],
      "guid": "rx-ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "name": "New Task 2",
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
          "expression": "\"rx-41de126c-4129-4f33-a534-7379df28d419\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-41de126c-4129-4f33-a534-7379df28d419.DynamicData}"
        }
      ],
      "guid": "rx-41de126c-4129-4f33-a534-7379df28d419"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.CallActivityDefinition",
      "name": "New Task 1",
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
          "expression": "\"templatedId1\""
        },
        {
          "assignTarget": "activityId",
          "expression": "\"rx-f1bd6b4b-39b6-4b4a-9220-859efe15f4f0\""
        }
      ],
      "outputMap": [
        {
          "assignTarget": "DynamicData",
          "expression": "${activityResults.rx-f1bd6b4b-39b6-4b4a-9220-859efe15f4f0.DynamicData}"
        }
      ],
      "guid": "rx-f1bd6b4b-39b6-4b4a-9220-859efe15f4f0"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.ParallelGatewayDefinition",
      "name": "Parallel Gateway",
      "description": "",
      "guid": "rx-1004ab20-5968-4482-9859-23f0cc10ad68"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-0a8debc5-6f52-4dd0-92f6-9f0596628644",
      "guid": "rx-90caf7ac-ae68-446d-b2ce-8835ce76c8e9",
      "targetNode": "rx-ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43",
      "guid": "rx-2eb00cb8-10f6-4628-ab82-356aa6bb144f",
      "targetNode": "rx-1004ab20-5968-4482-9859-23f0cc10ad68"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-1004ab20-5968-4482-9859-23f0cc10ad68",
      "guid": "rx-0d72436c-453f-43c6-9981-8eade659d95b",
      "targetNode": "rx-41de126c-4129-4f33-a534-7379df28d419"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-1004ab20-5968-4482-9859-23f0cc10ad68",
      "guid": "rx-fc9302a7-3cee-4c18-b3ad-93547558cfac",
      "targetNode": "rx-f1bd6b4b-39b6-4b4a-9220-859efe15f4f0"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-41de126c-4129-4f33-a534-7379df28d419",
      "guid": "rx-abfe83ce-68c5-4421-8ccd-e3325391d6dd",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
      "name": "Sequence Flow",
      "description": "",
      "sourceNode": "rx-f1bd6b4b-39b6-4b4a-9220-859efe15f4f0",
      "guid": "rx-0d70fddf-57ff-42a7-9e17-9bd519e56110",
      "targetNode": "rx-2d0772ed-34f8-4d6d-85d0-1716c1173a54"
    }
  ],
  "inputParams": [
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.ObjectFieldDefinition",
      "lastUpdateTime": "2020-08-27T10:59:28.002+0000",
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
      "documentDefinitionName": "com.bmc.dsm.bwfa:Parallel Sequential API",
      "anyUserAllowedToSubmit": false
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
      "lastUpdateTime": "2020-08-27T10:59:28.002+0000",
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
      "lastUpdateTime": "2020-08-27T10:59:28.002+0000",
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
  "layout": "{\"cells\":[{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\",\"position\":{\"x\":900,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":2,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\",\"position\":{\"x\":50,\"y\":375},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":1,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 1\",\"expanded\":false,\"id\":\"ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43\",\"position\":{\"x\":205,\"y\":360},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":6},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 2\",\"expanded\":false,\"id\":\"41de126c-4129-4f33-a534-7379df28d419\",\"position\":{\"x\":595,\"y\":225},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":11},{\"collapsedSize\":{\"width\":90,\"height\":60},\"content\":\"New Task 3\",\"expanded\":false,\"id\":\"f1bd6b4b-39b6-4b4a-9220-859efe15f4f0\",\"position\":{\"x\":610,\"y\":500},\"size\":{\"width\":90,\"height\":60},\"type\":\"rx.CallActivity.com.bmc.dsm.task-lib.Create Task\",\"z\":24},{\"id\":\"1004ab20-5968-4482-9859-23f0cc10ad68\",\"position\":{\"x\":430,\"y\":370},\"size\":{\"width\":40,\"height\":40},\"type\":\"rx.ParallelGateway\",\"z\":13,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"90caf7ac-ae68-446d-b2ce-8835ce76c8e9\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"0a8debc5-6f52-4dd0-92f6-9f0596628644\"},\"target\":{\"id\":\"ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43\"},\"type\":\"rx.SequenceFlow\",\"z\":14},{\"flowType\":\"normal\",\"id\":\"2eb00cb8-10f6-4628-ab82-356aa6bb144f\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"ea4f80ad-2c3a-4d50-ae76-b69c26f5bb43\"},\"target\":{\"id\":\"1004ab20-5968-4482-9859-23f0cc10ad68\"},\"type\":\"rx.SequenceFlow\",\"z\":15},{\"flowType\":\"normal\",\"id\":\"0d72436c-453f-43c6-9981-8eade659d95b\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"1004ab20-5968-4482-9859-23f0cc10ad68\"},\"target\":{\"id\":\"41de126c-4129-4f33-a534-7379df28d419\"},\"type\":\"rx.SequenceFlow\",\"z\":16},{\"flowType\":\"normal\",\"id\":\"fc9302a7-3cee-4c18-b3ad-93547558cfac\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"1004ab20-5968-4482-9859-23f0cc10ad68\"},\"target\":{\"id\":\"f1bd6b4b-39b6-4b4a-9220-859efe15f4f0\"},\"type\":\"rx.SequenceFlow\",\"vertices\":[{\"x\":450,\"y\":530}],\"z\":25},{\"flowType\":\"normal\",\"id\":\"abfe83ce-68c5-4421-8ccd-e3325391d6dd\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"41de126c-4129-4f33-a534-7379df28d419\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":22},{\"flowType\":\"normal\",\"id\":\"0d70fddf-57ff-42a7-9e17-9bd519e56110\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"f1bd6b4b-39b6-4b4a-9220-859efe15f4f0\"},\"target\":{\"id\":\"2d0772ed-34f8-4d6d-85d0-1716c1173a54\"},\"type\":\"rx.SequenceFlow\",\"z\":25}]}",
  "artifacts": [

  ],
  "runAsUser": false,
  "synchronous": true,
  "overlayDescriptor": null,
  "allowOverlay": false,
  "localizableStrings": {

  }
};
