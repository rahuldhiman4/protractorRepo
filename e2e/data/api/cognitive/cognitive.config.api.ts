export const COGNITIVE_LICENSE = [
    {
        "name": "HelixCognitiveAutomation",
        "description": "This service license includes access to the classification, tone analyzer, and summarization services.",
        "services": [
            "Summarization",
            "naturalLanguageClassifier",
            "toneAnalyzer"
        ],
        "licensed": true
    },
    {
        "name": "HelixCognitiveChatbotPerUser",
        "description": "This service license includes access to the chat service based on the number of active users or named users for a time period.",
        "services": [
            "conversation"
        ],
        "licensed": true
    },
    {
        "name": "HelixCognitiveChatbotPerConversation",
        "description": "This service includes access to the chat service based on the number of conversations for a time period.",
        "services": [
            "conversation"
        ],
        "licensed": true
    },
    {
        "name": "HelixCognitiveSearch",
        "description": "This service license includes access to the cognitive insight search service.",
        "services": [
            "search",
            "searchdiskusage",
            "searchdocumentusage"
        ],
        "licensed": true
    }
];

export const COGNITIVE_TEMPLATE_DATASET = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "Cognitive Service Data Set Descriptor",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "BMC Template Data Set"
        },
        "1730": {
            "id": 1730,
            "value": ""
        },
        "1731": {
            "id": 1731,
            "value": "TemplateDataSet"
        },
        "1732": {
            "id": 1732,
            "value": 0
        },
        "1737": {
            "id": 1737,
            "value": "en"
        },
        "1738": {
            "id": 1738,
            "value": "{\"layout\":\"{\\\"queryExpressionBasic\\\":\\\"\\\",\\\"textFields\\\":[{\\\"fieldId\\\":\\\"8\\\",\\\"title\\\":\\\"Summary\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:20157\\\"}],\\\"categoryFields\\\":[{\\\"fieldId\\\":\\\"300865500\\\",\\\"title\\\":\\\"Template Name\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:20360\\\"}]}\",\"resourceType\":\"com.bmc.arsys.rx.services.cognitive.domain.InnovationSuiteDataSource\",\"recordDefinitionName\":\"com.bmc.dsm.case-lib:Case\",\"queryExpression\":\"\",\"trainingDataMapper\":{\"resourceType\":\"com.bmc.arsys.rx.services.cognitive.domain.CategorizationTrainingDataMapper\",\"textFields\":[\"8\"],\"categoryFields\":[\"300865500\"]},\"timeCriteria\":null,\"isScheduleEnabled\":false}"
        },
        "1796": {
            "id": 1796,
            "value": 80
        },
        "1797": {
            "id": 1797,
            "value": 20
        },
        "1820": {
            "id": 1820,
            "value": 0
        },
        "61001": {
            "id": 61001,
            "value": "com.bmc.dsm.bwfa"
        }
    }
};

export const COGNITIVE_CATEGORY_DATASET = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "Cognitive Service Data Set Descriptor",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "BMC Category Data Set"
        },
        "1730": {
            "resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
            "id": 1730,
            "value": "",
            "permissionType": "CHANGE"
        },
        "1731": {
            "id": 1731,
            "value": "CategoryDataSet"
        },
        "1732": {
            "id": 1732,
            "value": 0
        },
        "1737": {
            "id": 1737,
            "value": "en"
        },
        "1738": {
            "id": 1738,
            "value": "{\"layout\":\"{\\\"queryExpressionBasic\\\":\\\"\\\",\\\"textFields\\\":[{\\\"fieldId\\\":\\\"8\\\",\\\"title\\\":\\\"Summary\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:4138\\\"}],\\\"categoryFields\\\":[{\\\"fieldId\\\":\\\"1000000063\\\",\\\"title\\\":\\\"Category Tier 1\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:4346\\\"},{\\\"fieldId\\\":\\\"1000000064\\\",\\\"title\\\":\\\"Category Tier 2\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:4347\\\"},{\\\"fieldId\\\":\\\"1000000065\\\",\\\"title\\\":\\\"Category Tier 3\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:4348\\\"},{\\\"fieldId\\\":\\\"450000167\\\",\\\"title\\\":\\\"Category Tier 4\\\",\\\"visible\\\":true,\\\"sortable\\\":true,\\\"filterable\\\":true,\\\"clickable\\\":false,\\\"alignment\\\":false,\\\"type\\\":\\\"Text\\\",\\\"isAssociatedRecordFieldColumn\\\":false,\\\"$$hashKey\\\":\\\"object:4349\\\"}]}\",\"resourceType\":\"com.bmc.arsys.rx.services.cognitive.domain.InnovationSuiteDataSource\",\"recordDefinitionName\":\"com.bmc.dsm.case-lib:Case\",\"queryExpression\":\"\",\"trainingDataMapper\":{\"resourceType\":\"com.bmc.arsys.rx.services.cognitive.domain.CategorizationTrainingDataMapper\",\"textFields\":[\"8\"],\"categoryFields\":[\"1000000063\",\"1000000064\",\"1000000065\",\"450000167\"]},\"timeCriteria\":null,\"isScheduleEnabled\":false}"
        },
        "1796": {
            "id": 1796,
            "value": 80
        },
        "1797": {
            "id": 1797,
            "value": 20
        },
        "1820": {
            "id": 1820,
            "value": 0
        },
        "61001": {
            "id": 61001,
            "value": "com.bmc.dsm.bwfa"
        }
    }
};

export const COGNITIVE_TEMPLATE_DATASET_MAPPING = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.cognitive-lib:Training Data Set Mapping",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "Template Registration"
        },
        "450000152": {
            "id": 450000152,
            "value": "Template DataSet Mapping"
        },
        "450000154": {
            "id": 450000154,
            "value": 90
        },
        "450000155": {
            "id": 450000155,
            "value": 80
        },
        "450000156": {
            "id": 450000156,
            "value": "1"
        },
        "450000157": {
            "id": 450000157,
            "value": "Petramco"
        },
        "450000158": {
            "id": 450000158,
            "value": "IDGADGG8ECDC0AQ5OJCTQ4PZR9B94H"
        },
        "450000159": {
            "id": 450000159,
            "value": "com.bmc.dsm.bwfa"
        }
    }
};

export const COGNITIVE_CATEGORY_DATASET_MAPPING = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.cognitive-lib:Training Data Set Mapping",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "Data Set mapping Categorization"
        },
        "450000152": {
            "id": 450000152,
            "value": "Category DataSet Mapping"
        },
        "450000153": {
            "id": 450000153,
            "value": 10
        },
        "450000154": {
            "id": 450000154,
            "value": 88
        },
        "450000155": {
            "id": 450000155,
            "value": 77
        },
        "450000156": {
            "id": 450000156,
            "value": "1"
        },
        "450000157": {
            "id": 450000157,
            "value": "Petramco"
        },
        "450000158": {
            "id": 450000158,
            "value": "IDGADGG8ECDC0AQ5OJCUQ4PZRKB941"
        },
        "450000159": {
            "id": 450000159,
            "value": "com.bmc.dsm.bwfa"
        }
    }
}
