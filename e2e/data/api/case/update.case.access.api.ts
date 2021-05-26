export const CASE_ACCESS_COMMAND = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.case-lib:Case - Set Case Access",
    "processInputValues": {
        "Record Instance ID": "AGGADGG8ECDC0AQCRI57QBT5TL5QZU",
        "Operation": "ADD",
        "Type": "USER",
        "Value": "qliu",
        "Security Type": "READ"
    }
};

export const CASE_ACCESS_CHILD_SECURITY = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.case-lib:Case - Call Update Child Security Permissions",
    "processInputValues": {
        "Record Instance ID": "AGGADGG8ECDC0AQCRI57QBT5TL5QZU"
    }
};