export const AUTOMATED_CASE_STATUS_TRANSITION = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.case-lib:Case - Perform Automated Status Transition",
    "processInputValues": {

    }
}

export const REOPEN_CASE = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.case-lib:Case - Check for Reopen",
    "processInputValues": {
        "Case ID": "AGGADGG8ECDC0AQE4SXUQD6YHUI39K"
    }

}

export const CASE_WATCHLIST_ALL_EVENTS = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.case-lib:Cases - Bulk Add to Watchlist",
    "processInputValues": {
        "Selected Events": [
            "AGGADG1AAO0VGAPRV92DPQYEWRR8KY",
            "AGGADG1AAO0VGAPSQLNJPRTG2I1H7Y",
            "AGGADG1AAO0VGAPRV9JIPQYETVR8HI"
        ],
        "Cases": [
            {
                "379": "AGGADGG8ECDC0AQE4KXSQD6QG2NVDH"
            }
        ],
        "Selected Case Count": 1
    }
}

export const ENABLE_DISABLE_PROCESS = {
    "name": "com.bmc.dsm.case-lib:Auto Procescy4x6",
    "tags": [
      "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
    ],
    "guid": "IDGADGG8ECDC0AQ5ROH4Q4T4R1IXBM",
    "flowElements": [
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.SequenceFlowDefinition",
        "name": "Sequence",
        "tags": null,
        "guid": "rx-96c54e01-daa2-414c-a825-6270ee2b942b",
        "sourceNode": "rx-fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e",
        "targetNode": "rx-6e39c4e8-a18a-4774-a510-6be901fe66ce"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.StartEventDefinition",
        "name": "Start",
        "tags": null,
        "guid": "rx-fd75f0c7-eddb-447b-9bc3-9a4d2e10c68e"
      },
      {
        "resourceType": "com.bmc.arsys.rx.services.process.domain.EndEventDefinition",
        "name": "End",
        "guid": "rx-6e39c4e8-a18a-4774-a510-6be901fe66ce",
        "event": null
      }
    ],
    "isEnabled": false
  };