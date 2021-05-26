export const ADHOC_TASK_PAYLOAD = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.task-lib:Task",
    "fieldInstances": {
        "8": {
            "id": 8,
            "value": "abc1"
        },
        "450000156": {
            "id": 450000156,
            "value": "{\"ActivityId\":\"POST_TASK_ACTIVITY\",\"ExecutionStatus\":10 }"
        },
        "1000000217": {
            "id": 1000000217,
            "value": "fe6ac9e3407639a147cc153d2144e3bf1346fb2d0283f4f38358cbfb8b24fc8f1276043915cf7a02e2bd94c6b0e63cb16a4319ac2979696b39f3520be822cdba",
        },
        "450000152": {
            "id": 450000152,
            "value": ""
        },
        "450000157": { 	
            "id": 450000157,
            "value": "Petramco",
          },
        "1000000164": {
            "id": 1000000164,
            "value": "3000"
        },
        "450000021": {
            "id": 450000021,
            "value": "1000"
        },
        "536870913": {
            "id": 536870913,
            "value": "AGGADGG8ECDC0AQHE8DVQGG9YHCF4M"
        },
        "450000381": {
            "id": 450000381,
            "value": "418e2e2d2ed191a494d959573aaf74a03c77b0b6f1f2cdc95ab31d37a4d67e7c4a28a199aee20f1875c64c22476204480461bc34867b181b6da7e390ffc7db5b"
        },
        "450000411": {
            "id": 450000411,
            "value": "HumanResource"
        },
        "1000000001": {
            "id": 1000000001,
            "value": "Petramco"
        },

    }
};

export const UPDATE_TASK_STATUS = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "id": "AGGADGG8ECDC0AQHF1L2QGH35OFGC9",
    "recordDefinitionName": "com.bmc.dsm.task-lib:Task",
    "fieldInstances": {
        "450000021": {
            "id": 450000021,
            "value": "3000"
        }
    }
};

export const TASK_CREATION_FROM_TEMPLATE = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.case-lib:Case - Create Tasks from Template",
    "processInputValues": {
        "Case Company": "Petramco",
        "Requester ID": "0673cd5ddeddba6bdb610bd65d696e75337d9a364d2e61ca089f5d198d2702ec03cc00b46057b6b83db4df976bd6a8b35014b3e14ded75f6796c011b942d1436",
        "ActivityId": "POST_TASK_ACTIVITY",
        "Selected Templates": "[{\"379\":\"AGGD3E0FEBFT7AP4VHYZP3Y0PDTE8X\"}]",
        "Case ID": "AGGADGG8ECDC0AQHF17OQGH32AFFB8",
        "TaskStatus": 10
    }
};

export const UPDATE_TASK = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "id": "AGGADGG8ECDC0AQHF1L2QGH35OFGC9",
    "recordDefinitionName": "com.bmc.dsm.task-lib:Task",
    "fieldInstances": {
    }
};

export const REGISTER_ADHOC_TASK = {
    "processDefinitionName": "com.bmc.dsm.task-lib:Task - Register Adhoc Task",
    "processInputValues": {
        "Is Adhoc": "1",
        "Activity Id": "POST_TASK_ACTIVITY",
        "Task Execution Status": 10,
        "Task Id": "AGGADGG8ECDC0AQ327KDQ241IN585J"
    },
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand"
};