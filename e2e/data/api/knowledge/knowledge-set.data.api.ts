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
            "value": "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
        }
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
          "Value": "63f30d7fdd662b1bc8312d2314334292b6a023b4bbedcd47db3b2f9c8a8a0e7f6aa7ebf3036e11e141c325730a9c3bf407c79264f4e6788b04c6bef1bd241a81",
          "Security Type": "READ"
        }
}