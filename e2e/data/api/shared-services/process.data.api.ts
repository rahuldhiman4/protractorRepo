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