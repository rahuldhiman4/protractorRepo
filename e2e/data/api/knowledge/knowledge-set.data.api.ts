export const KNOWLEDGE_SET = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.knowledge:Knowledge Set",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "KSSet"
        },
        "301820700": {
            "id": 301820700,
            "value": "KSSet"
        },
        "1000000001": {
            "id": 1000000001,
            "value": "Petramco"
        },
        "450000420": {
          "id": 450000420,
          "value": "HumanResource",
        },
    }
};

export const KNOWLEDEGESET_ASSOCIATION = 
[
    {
      "associationDefinitionName": "com.bmc.dsm.knowledge:AppName_KS",
      "recordInstanceIds": [
        "AGGAA5V0GENSZAOO2XNUON6Y2QU1MR",
        "AGGAA5V0HG6WJAOMDOTGOLHS6FGJTK"
      ],
      "nodeSide": "nodeB",
      "resourceType": "com.bmc.arsys.rx.services.association.domain.AssociateOperation",
      "useDefaultRoles": false,
      "nodeARole": null,
      "nodeBRole": null
    }
  ]

export const KNOWLEDGESET_PERMISSION = {
        "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
        "processDefinitionName": "com.bmc.dsm.knowledge:Knowledge Set - Set Access",
        "processInputValues": {
          "Record Instance ID": "AGGADGG8ECDC0AQGP93GQFRLM69GW0",
          "Operation": "DELETE",
          "Type": "GROUP",
          "Value": null,
          "Security Type": "READ"
        }
}