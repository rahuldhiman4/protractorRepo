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
      "450000152": {
        "id": 450000152,
        "value": "- Global -",
      }
    }
  }

