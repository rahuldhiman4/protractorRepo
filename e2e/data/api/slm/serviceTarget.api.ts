export const SERVICE_TARGET_PAYLOAD = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "com.bmc.dsm.slm-lib:Service Target",
  "fieldInstances": {
    "300271400": {
      "id": 300271400,
      "value": "'1000000001'=\"04be8c4405fe327b812c4ebd1d7de81ab87166e59c9e50c29be65706115d2e4575aa17d92fa2d53c7abc1a85c62d514b62a70125ce13a2bcea17eab7b05e8158\""
    },
    "304412691": {
      "id": 304412691,
      "value": "'Company'=\"Phylum\""
    },
    "300272100": {
      "id": 300272100,
      "value": 1584100501
    },
    "300273000": {
      "id": 300273000,
      "value": "'450000021'=\"3000\""
    },
    "304411891": {
      "id": 304411891,
      "value": "'Status'=\"In Progress\""
    },
    "300273100": {
      "id": 300273100,
      "value": "'450000021'=\"5000\""
    },
    "304411911": {
      "id": 304411911,
      "value": "'Status'=\"Resolved\""
    },
    "300398100": {
      "id": 300398100,
      "value": "3"
    },
    "300523400": {
      "id": 300523400,
      "value": "AGGAA5V0GFCOUAOO0SG2ON4TGYA8N5"
    },
    "304412961": {
      "id": 304412961,
      "value": "04be8c4405fe327b812c4ebd1d7de81ab87166e59c9e50c29be65706115d2e4575aa17d92fa2d53c7abc1a85c62d514b62a70125ce13a2bcea17eab7b05e8158"
    },
    "450000420": {
      "id": 450000420,
      "value": "AGGADGG8ECDC0AQ7AIVFQ6BXRYS1ZA"
    },
    "490000400": {
      "id": 490000400,
      "value": "SVT In Progress to Resolved"
    }
  }
}

export const CASE_MILESTONE = {
  "svtID": "##SVTID##",
  "associations": [
    {
      "milestoneInstanceID": "",
      "title": "AutoCaseAlertMilestone1",
      "description": "",
      "executeQualification": "1=1",
      "executeCondition": "HoursFromStartTime",
      "executeAtPercentage": 0,
      "executeAtHours": 0,
      "executeAtMinutes": "1",
      "repeatInterval": "",
      "notifications": [
        {
          "instanceId": "",
          "name": "AutoCaseAlertAction1",
          "description": null,
          "companyID": null,
          "entityType": 1,
          "subType": null,
          "sourceRecordDefName": "com.bmc.dsm.case-lib:Case",
          "fieldList": null,
          "type": "Alert",
          "toList": "$4$;$1000000217$;",
          "ccList": "",
          "bccList": "",
          "templateName": "Case SLA Missed",
          "updated": false
        }
      ],
      "actions": [

      ],
      "template": false,
      "updated": false
    }
  ]
};

export const TASK_MILESTONE = {
  "svtID": "##SVTID##",
  "associations": [
    {
      "milestoneInstanceID": "",
      "title": "AutoTaskAlertMilestone",
      "description": "",
      "executeQualification": "1=1",
      "executeCondition": "HoursFromStartTime",
      "executeAtPercentage": 0,
      "executeAtHours": 0,
      "executeAtMinutes": "1",
      "repeatInterval": "",
      "notifications": [
        {
          "instanceId": "",
          "name": "AutoTaskAlertAction12",
          "description": null,
          "companyID": null,
          "entityType": 1,
          "subType": null,
          "sourceRecordDefName": "com.bmc.dsm.task-lib:Task",
          "fieldList": null,
          "type": "Alert",
          "toList": "$4$;$1000000217$;",
          "ccList": "",
          "bccList": "",
          "templateName": "Task SLA Missed",
          "updated": false
        }
      ],
      "actions": [

      ],
      "template": false,
      "updated": false
    }
  ]
};

export const SERVICE_TARGET_GROUP = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "com.bmc.dsm.slm-lib:Config SVT Group",
  "fieldInstances": {
    "8": {
      "id": 8,
      "value": "SVT Group Name"
    },
    "300523400": {
      "id": 300523400,
      "value": "AGGAA5V0GFCOUAOO0SG2ON4TGYA8N5"
    },
    "450000420": {​​​​
      "id": 450000420,
      "value": "AGGADGG8ECDC0AQ7AIVFQ6BXRYS1ZA"
    }​​​​,
    "1000000001": {
      "id": 1000000001,
      "value": "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    }
  }
};

export const BUSINESS_TIME_SHARED_ENTITY = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "Business Time Shared Entity",
  "fieldInstances": {
    "7": {
      "resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
      "id": 7,
      "value": 1
    },
    "8": {
      "resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
      "id": 8,
      "value": "abcd"
    },
    "2601": {
      "resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
      "id": 2601,
      "value": "SLM"
    },
    "2614": {
      "resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
      "id": 2614,
      "value": "SLM"
    }
  }
};

export const BUSINESS_TIME_SEGMENT = {
  "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
  "recordDefinitionName": "Business Time Segment",
  "fieldInstances": {
    "7": {
      "id": 7,
      "value": 1
    },
    "8": {
      "id": 8,
      "value": "Descrip3"
    },
    "2402": {
      "id": 2402,
      "value": 1
    },
    "2403": {
      "id": 2403,
      "value": 1
    },
    "2418": {
      "id": 2418,
      "value": "2020-04-02"
    },
    "2419": {
      "id": 2419,
      "value": "2022-12-01"
    },
    "2422": {
      "id": 2422,
      "value": "14:52:00"
    },
    "2423": {
      "id": 2423,
      "value": "14:52:00"
    },
    "2440": {
      "id": 2440,
      "value": 0
    }
  }
};