export const KNOWLEDGE_APPROVAL_CONFIG = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.knowledge:Knowledge Approval Mapping",
    "fieldInstances": {
        "302300500": {
            "id": 302300500,
            "value": "4000"
        },
        "1000000001": {
            "id": 1000000001,
            "value": "04be8c4405fe327b812c4ebd1d7de81ab87166e59c9e50c29be65706115d2e4575aa17d92fa2d53c7abc1a85c62d514b62a70125ce13a2bcea17eab7b05e8158"
        },
        "1000001437": {
            "id": 1000001437,
            "value": "Knowledge Approval mapping"
        },
        "450000420": {
            "id": 450000420,
            "value": "HumanResource"
        }
    }
}

export const KNOWLEDGE_APPROVAL_FLOW_CONFIG = {
    "flowGroup": "Default Article Approval Flow Group",
    "approvalFlowConfigurationList": [
        {
            "flowName": "New General Flow",
            "precedence": 3,
            "approvers": "U:qkatawazi",
            "signingCriteria": 0,
            "qualification": "'Operational Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.cddc9f6098ac421a1aa40ec9be503abb0fda61530bc9dbb22e7049cba9c5839018ba7205a392cd9f37141091bbe33e28405caff795929e4d805fa787dfea2c0c.304405421}",
            "approvalFlowOutcomeMappingList": [

            ]
        }
    ]
};