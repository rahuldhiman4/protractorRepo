export const NOTIFICATION_TEMPLATE = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "com.bmc.dsm.notification-lib:NotificationTemplate",
  "fieldInstances": {
    "8": {
      "id": 8,
      "value": "desc"
    },
    "301233800": {
      "id": 301233800,
      "value": "Knowledge"
    },
    "450000420": {
      "id": 450000420,
      "value": "HumanResource"
  },
    "301718200": {
      "id": 301718200,
      "value": "AGGADGG8ECDC0AQ4PGWCQ3QYTE8CHA"
    },
    "304412071": {
      "id": 304412071,
      "value": "tname123"
    },
    "450000153": {
      "id": 450000153,
      "value": "- Global -"
    }
  }
}

export const EMAIL_ALERT_SUBJECT_BODY = {
  "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
  "processDefinitionName": "com.bmc.dsm.notification-lib:Template Message - Create",
  "processInputValues": {
    "EmailMessageSubject": "email subject",
    "SourceRecordDefinition": "com.bmc.dsm.case-lib:Case",
    "EmailMessageBody": "<p>email body</p>",
    "AlertMessageSubject": "<p>message alert</p>",
    "Locale": "en_US",
    "TemplateID": "AGGADGG8ECDC0AQ4P0B9Q3RBYL823J"
  }
}

export const NOTIFICATION_EVENT_ACTIVE = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "com.bmc.dsm.notification-lib:NotificationEvent",
  "fieldInstances": {
    "7": {
      "id": 7,
      "value": 1
    },
    "8": {
      "id": 8,
      "value": "Notification Event123"
    },
    "301718200": {
      "id": 301718200,
      "value": "name123"
    },
    "450000420": {
      "id": 450000420,
      "value": "HumanResource"
    },
    "450000152": {
      "id": 450000152,
      "value": "- Global -"
    }
  }
}

export const ARTCILE_DUE_DATE = {
  "owner": "com.bmc.dsm.knowledge",
  "name": "com.bmc.dsm.knowledge:Knowledge Article - Notify ReviewDate due",
  "tags": null,
  "description": "This rule calls notification process to handle both review due and overdue notifications",
  "overlayGroupId": "0",
  "developerId": "com.bmc.dsm",
  "scope": "BUNDLE",
  "internal": false,
  "guid": "IDGAA5V0H3XY6AOTL1FHOSPIJ27X0S",
  "triggerEvent": {
    "resourceType": "com.bmc.arsys.rx.services.rule.domain.TimerTriggerEvent",
    "timeCriteria": {
      "resourceType": "com.bmc.arsys.rx.services.rule.domain.IntervalTime",
      "days": 0,
      "hours": 0,
      "minutes": 1
    },
    "poolNumber": null
  },
  "isEnabled": true,
  "recordDefinitionNames": [
    "com.bmc.dsm.knowledge:Knowledge Article"
  ],
  "qualification": {
    "name": null,
    "expression": "(($\\TIMESTAMP$ + (((5 * 24) * 60) * 60)) > ${ruleContext.Next Review Date}) AND (${ruleContext.ArticleStatus} = \"5000\")"
  },
  "actions": [
    {
      "resourceType": "com.bmc.arsys.rx.services.rule.domain.StartProcessInstanceAction",
      "name": "Start Process",
      "processDefinitionName": "com.bmc.dsm.knowledge:Knowledge Article - Set Review Status",
      "sampleProcessDefinitionName": null,
      "inputMap": [
        {
          "assignTarget": "TR_ARTICLE",
          "expression": "$\\ENTRY$"
        }
      ],
      "outputMap": [
        {
          "assignTarget": "Is In Review",
          "expression": "${actionResult.REVIEW_STATUS}"
        }
      ]
    },
    {
      "resourceType": "com.bmc.arsys.rx.services.rule.domain.CustomRuleAction",
      "name": "Update Record",
      "actionTypeName": "updateRecord",
      "inputMap": [
        {
          "assignTarget": "record",
          "expression": "$\\ENTRY$"
        },
        {
          "assignTarget": "values[\"Temp Process Variable\"]",
          "expression": "\"RUN_BY_PROCESS\""
        }
      ],
      "outputMap": [

      ],
      "runAsUser": null
    }
  ],
  "overlayDescriptor": null,
  "allowOverlay": false,
  "localizableStrings": {

  },
  "saaSAdminOnly": false
}