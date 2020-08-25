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
