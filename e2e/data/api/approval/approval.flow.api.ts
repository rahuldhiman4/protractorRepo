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

export const MULTI_APPROVAL_FLOW = {
  "flowGroup": "BWFA Group",
  "approvalFlowConfigurationList": [

  ]
};

export const TASK_APPROVAL_FLOW = {
  "flowGroup": "Task Group",
  "approvalFlowConfigurationList": [
      {
          "flowName": "Task AUTO General Flow All Must ABC",
          "isLevelUp": false,
          "precedence": 0,
          "approvers": "U:qdu;qyuan;vhooda",
          "signingCriteria": 0,
          "approvalOverridePercentage": 0,
          "qualification": "1=2",
          "approvalFlowOutcomeMappingList": [

          ]
      }
  ]
};