export const DOC_LIB_DRAFT = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "recordDefinitionName": "com.bmc.dsm.knowledge:Knowledge Article",
    "fieldInstances": {
        "399": {
            "id": 399,
            "value": null
        },
        "200000007": {
            "id": 200000007,
            "value": null
        },
        "260000001": {
            "id": 260000001,
            "value": null
        },
        "301820700": {
            "id": 301820700,
            "value": "Document"
        },
        "302300502": {
            "id": 302300502,
            "value": "AllFieldsDocLib"
        },
        "302300512": {
            "id": 302300512,
            "value": "a0cb543323842bf1613ed4e9e3ae902295f8efafc8f07458e4f1821a2a50b5646295f64264d27fcd60bdaf36edbe2131af3c0f8a99c6a743a1e0dd36a3efec75"
        },
        "302301262": {
            "id": 302301262,
            "value": "KeywordTag"
        },
        "302312187": {
            "id": 302312187,
            "value": "AGGADG1AAO0VGAP8S4I3P7V1QQBDV5"
        },
        "450000153": {
            "id": 450000153,
            "value": "DemoDesc"
        },
        "450000371": {
            "id": 450000371,
            "value": null
        },
        "450000381": {
            "id": 450000381,
            "value": null
        },
        "450000441": {
            "id": 450000441,
            "value": "0"
        },
        "1000000001": {
            "id": 1000000001,
            "value": "5a30545b15c828bf11139ffa453419200d69684e9d423ab2f3e869e6bb386507ee9ee24b1252f990cf587177918283e34694939025cd17154380ba49ce43f330"
        },
        "1000000063": {
            "id": 1000000063,
            "value": null
        },
        "1000000064": {
            "id": 1000000064,
            "value": null
        },
        "1000000065": {
            "id": 1000000065,
            "value": null
        },
        "450000167": {
            "id": 450000167,
            "value": null
        },
        "450000411":{
           "id":450000411,
           "value":"AGGADGG8ECDC0AQ7AIVFQ6BXRYS1ZA"
        }
    }
};

export const DOC_LIB_PUBLISH = {
    "resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
    "id": "AGGADGG8ECDC0AQGJ6YNQF19V6PSXI",
    "displayId": "000000000000319",
    "recordDefinitionName": "com.bmc.dsm.knowledge:Knowledge Article",
    "fieldInstances": {
        "302300500": {
            "id": 302300500,
            "value": "5000"
        },
        "536870913": {
            "id": 536870913,
            "value": "AGGAA5V0HGYAQAOKPE5CO9TJXRFF61"
        }
    }
}

export const DOC_LIB_READ_ACCESS = {
    "resourceType": "com.bmc.arsys.rx.application.process.command.StartProcessInstanceCommand",
    "processDefinitionName": "com.bmc.dsm.knowledge:Knowledge Article - Set Support Group Permissions",
    "processInputValues": {
      "Record Instance ID": "AGGADGG8ECDC0AQG3CI7QF5FEVV6AS",
      "Operation": "ADD",
      "Type": "GROUP",
      "Value": "cf1d1b1fdfd540f0a30f753031781241e73195127ed88a8770e902e9d973e80a590eb57eb0f00e50fe9a32f55f6a4eccd97be2bb94c1baa90fcabef696dbf3fd",
      "Security Type": "READ"
    }
}