
export const CreateLOB = {
	"resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
	"recordDefinitionName": "com.bmc.dsm.shared-services-lib:Line of Business",
	"fieldInstances": {
		"8": {
			"id": 8,
			"value": "Description",
		},
		"450000152": {
			"id": 450000152,
			"value": "Test",
		}
	}
}

export const UpdateLOB = {
	"resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
	"id": "",
	"displayId": "",
	"recordDefinitionName": "com.bmc.dsm.shared-services-lib:Line of Business",
	"permittedGroupsBySecurityLabels": {
		"Write Permission": [
			"1001813"
		]
	},
	"7": {
		"resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
		"id": 7,
		"value": 1,
		"permissionType": "CHANGE"
	}
}

export const UpdateLOBWithInActive = {
	"resourceType": "com.bmc.arsys.rx.services.record.domain.RecordInstance",
	"id": "",
	"displayId": "",
	"recordDefinitionName": "com.bmc.dsm.shared-services-lib:Line of Business",
	"permittedGroupsBySecurityLabels": {
		"Write Permission": [
			"1001813"
		]
	},
	"7": {
		"resourceType": "com.bmc.arsys.rx.services.record.domain.FieldInstance",
		"id": 7,
		"value": 2,
		"permissionType": "CHANGE"
	}
}

