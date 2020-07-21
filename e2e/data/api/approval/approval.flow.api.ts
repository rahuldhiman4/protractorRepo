export const CASE_APPROVAL_FLOW = {
  "flowGroup": "BWFA Group",
  "approvalFlowConfigurationList": [
    {
      "flowName": "New General Flow Anant",
      "precedence": 4,
      "approvers": "U:qkatawazi",
      "signingCriteria": 0,
      "qualification": "'Category Tier 1' = ${recordInstanceContext._recordinstance.com.bmc.arsys.rx.foundation:Operational Category.a19e9475e2739fbd1df32ff2bbdc0286dff8eb77a7e0ee025949b9f5cf3286fb1c5bb18e58ce9b3b27b2cd414eda0a4b436e84b6e31ee504eba1d126a0b74526.304405421}",
      "approvalFlowOutcomeMappingList": [
      ]
    }
  ]
};

export const INVALID_CASE_APPROVAL_FLOW = {
  "flowGroup": "BWFA Group",
  "approvalFlowConfigurationList": [
    {
      "guid": "AGGA49C8ECIOIAPVD4I2PUFXIOK5TO",
      "approvalProcessId": "AGGA49C8ECIOIAPVD4I2PUFXIOK5T7",
      "flowName": "Invalid Approve Flow",
      "processType": "0",
      "qualification": "1 = 2",
      "formattedQualification": "1 = 2",
      "precedence": 0,
      "signingCriteria": 1,
      "approvalOverridePercentage": 0,
      "isLevelUp": false,
      "levels": null,
      "approvers": "FR:AGGAA5V0GE9Z4AOR0BXUOQ3ZT04EJA:com.bmc.dsm.case-lib:Case Agent",
      "approverQualification": null,
      "approvalFlowOutcomeMappingList": [

      ]
    }
  ]
};

export const INVALID_KM_APPROVAL_FLOW = {
  "flowGroup": "Default Article Approval Flow Group",
  "approvalFlowConfigurationList": [
    {
      "guid": "AGGADGG8ECDC0AQG3SUZQF5WYAHTZJ",
      "approvalProcessId": "AGGADGG8ECDC0AQG3SUZQF5WYAHTZC",
      "flowName": "Invalid Approval Flow",
      "processType": "0",
      "qualification": "1 = 2",
      "formattedQualification": "1 = 2",
      "precedence": 0,
      "signingCriteria": 0,
      "approvalOverridePercentage": 0,
      "isLevelUp": false,
      "levels": null,
      "approvers": "FR:AGGAA5V0H3XY6AOTLL9ROSP8NW7YD9:com.bmc.dsm.knowledge:Knowledge Publisher;",
      "approverQualification": null,
      "approvalFlowOutcomeMappingList": [

      ]
    }
  ]
}