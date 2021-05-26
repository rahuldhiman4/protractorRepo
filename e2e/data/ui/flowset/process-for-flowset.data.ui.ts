export const CASE_MANAGEMENT_LIB_PROCESS = {
    "name": "com.bmc.dsm.case-lib:DemoProcess",
    "guid": "rx-25119b6e-bde1-42b3-bc11-c7b9eb880c26",
    "description": null,
    "runAsUser": false,
    "isEnabled": true,
    "inputParams": [
      {
        "resourceType": "com.bmc.arsys.rx.standardlib.record.CharacterFieldDefinition",
        "name": "Operation",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 450000151,
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
        "anyUserAllowedToSubmit": false,
        "fieldOption": "OPTIONAL"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
        "name": "Previous Case Record",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 450000152,
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
        "anyUserAllowedToSubmit": false,
        "fieldOption": "OPTIONAL"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
        "name": "Case Record",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 57370,
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
        "anyUserAllowedToSubmit": false,
        "fieldOption": "REQUIRED"
      }
    ],
    "outputParams": [
      
    ],
    "flowElements": [
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
        "name": "Start",
        "tags": null,
        "description": null,
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-b45c68c0-3ff1-45c7-9d2f-c69ef5597c10"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
        "name": "End",
        "tags": null,
        "description": null,
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-79f172d9-0dcb-4cf8-888b-1101b3e507e5",
        "event": null
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence Flow",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-9039ebd5-6a91-4baf-90ab-aa6efd35e941",
        "sourceNode": "rx-b45c68c0-3ff1-45c7-9d2f-c69ef5597c10",
        "targetNode": "rx-79f172d9-0dcb-4cf8-888b-1101b3e507e5",
        "condition": ""
      }
    ],
    "artifacts": [
      
    ],
    "localVariables": [
      
    ],
    "localizableStrings": {
      
    },
    "layout": "{\"cells\":[{\"id\":\"79f172d9-0dcb-4cf8-888b-1101b3e507e5\",\"position\":{\"x\":660,\"y\":275},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":880,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"b45c68c0-3ff1-45c7-9d2f-c69ef5597c10\",\"position\":{\"x\":285,\"y\":275},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":882,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"9039ebd5-6a91-4baf-90ab-aa6efd35e941\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"b45c68c0-3ff1-45c7-9d2f-c69ef5597c10\"},\"target\":{\"id\":\"79f172d9-0dcb-4cf8-888b-1101b3e507e5\"},\"type\":\"rx.SequenceFlow\",\"z\":883}]}",
    "allowOverlay": false,
    "scope": "BUNDLE",
    "permissions": [
      {
        "ownerId": {
          "value": -74003,
          "type": "ROLE",
          "name": "Case Business Analyst"
        },
        "type": "READ"
      },
      {
        "ownerId": {
          "value": -74002,
          "type": "ROLE",
          "name": "Case Manager"
        },
        "type": "READ"
      },
      {
        "ownerId": {
          "value": -74001,
          "type": "ROLE",
          "name": "Case Agent"
        },
        "type": "READ"
      }
    ],
    "tags": null,
    "contextKeyParam": "Case Record"
}

export const SOCIAL_SERVICE_PROCESS = {
    "name": "com.bmc.dsm.social-lib:SocialProcess",
    "guid": "rx-6d444abc-6eb5-4c50-b627-85e393bbd9e5",
    "description": null,
    "runAsUser": false,
    "isEnabled": true,
    "inputParams": [
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldDefinition",
        "name": "socialRecordInstance",
        "tags": null,
        "description": "",
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "id": 450000151,
        "permissions": null,
        "fieldTypeName": "com.bmc.arsys.rx.services.process.domain.record.RecordInstanceFieldType",
        "isInherited": false,
        "explicitPermissions": null,
        "overlayDescriptor": null,
        "fieldMapping": null,
        "allowPermissionsOverlay": true,
        "allowOtherPropertiesOverlay": true,
        "auditOption": null,
        "recordDefinitionName": "com.bmc.dsm.social-lib:SCL_Posts",
        "useSampleData": false,
        "anyUserAllowedToSubmit": false,
        "fieldOption": "OPTIONAL"
      }
    ],
    "outputParams": [
      
    ],
    "flowElements": [
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
        "name": "End",
        "tags": null,
        "description": null,
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-d9fc867e-f80c-4020-a42c-74fc324f3fbd",
        "event": null
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
        "name": "Start",
        "tags": null,
        "description": null,
        "overlayGroupId": null,
        "developerId": null,
        "internal": false,
        "guid": "rx-53dd568f-bd4e-492f-b18a-12f32c906cf1"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence Flow",
        "description": "",
        "sourceNode": "rx-53dd568f-bd4e-492f-b18a-12f32c906cf1",
        "guid": "rx-a96663b9-4a6a-466a-89b2-ad496ea34c3f",
        "targetNode": "rx-d9fc867e-f80c-4020-a42c-74fc324f3fbd"
      }
    ],
    "artifacts": [
      
    ],
    "localVariables": [
      
    ],
    "localizableStrings": {
      
    },
    "layout": "{\"cells\":[{\"id\":\"53dd568f-bd4e-492f-b18a-12f32c906cf1\",\"position\":{\"x\":245,\"y\":355},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.StartEvent\",\"z\":274,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"id\":\"d9fc867e-f80c-4020-a42c-74fc324f3fbd\",\"position\":{\"x\":725,\"y\":355},\"size\":{\"width\":30,\"height\":30},\"type\":\"rx.EndEvent\",\"z\":275,\"attrs\":{\".label\":{\"text\":\"\"}}},{\"flowType\":\"normal\",\"id\":\"a96663b9-4a6a-466a-89b2-ad496ea34c3f\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"\"}},\"position\":\"0.5\"}],\"source\":{\"id\":\"53dd568f-bd4e-492f-b18a-12f32c906cf1\"},\"target\":{\"id\":\"d9fc867e-f80c-4020-a42c-74fc324f3fbd\"},\"type\":\"rx.SequenceFlow\",\"z\":276}]}",
    "allowOverlay": false,
    "scope": "BUNDLE",
    "permissions": [
      {
        "ownerId": {
          "value": 0,
          "type": "GROUP",
          "name": "Public"
        },
        "type": "READ"
      }
    ],
    "tags": null,
    "contextKeyParam": null
}
