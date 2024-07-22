import { create } from 'zustand'
import { ISurveyInformation } from '../models/survey'
import { ITeam } from '../models/team'
import { SubmissionType } from '@prisma/client'
import { IFileUploads } from '@components/survey-form/file-upload-schema'

export type Survey = {
	surveyInfo: ISurveyInformation
	team: ITeam
	uploads: IFileUploads
	setSurveyInfo: (data: ISurveyInformation) => void
	setTeam: (data: ITeam) => void
	setUploads: (data: IFileUploads) => void
	resetSurvey: () => void
}

export const useSurveyStore = create<Survey>(set => ({
	surveyInfo: {
		date: new Date(),
		stationName: 'Testing',
		startCorner: '12.455, 7.8292',
		endCorner: '12.455, 7.8292',
		gpsDatum: 'WGS84',
		province: 'Zambales',
		town: 'Botolan',
		barangay: 'Bangan',
		managementTypeId: 1,
		dataType: 'PRIVATE',
		additionalInfo: '',
	},
	team: {
		leaderId: 29,
		leaderNum: '',
		teamId: 16,
		// scientist: 'Jared',
		volunteer1: 'Jared',
		volunteer2: 'Jared',
		volunteer3: 'Jared',
		volunteer4: '',
		volunteer5: '',
		volunteer6: '',
	},
	uploads: {
		submissionType: SubmissionType.CPCE,
		uploadOption: 'zip',
		zip: undefined,
		imageUpload: undefined,
		alwanDataForm: undefined,
		coralDataSheet: undefined,
		surveyGuides: undefined
	},
	setSurveyInfo: (data: ISurveyInformation) => set({ surveyInfo: data }),
	setTeam: (data: ITeam) => set({ team: data }),
	setUploads: (data: IFileUploads) => set({ uploads: data }),
	resetSurvey: () => set({
		surveyInfo: {
			date: new Date(),
			stationName: '',
			startCorner: '',
			endCorner: '',
			gpsDatum: 'WGS84',
			province: '',
			town: '',
			barangay: '',
			managementTypeId: 0,
			dataType: '',
			additionalInfo: '',
		},
		team: {
			leaderId: 0,
			leaderNum: '',
			teamId: 0,
			// scientist: '',
			volunteer1: '',
			volunteer2: '',
			volunteer3: '',
			volunteer4: '',
			volunteer5: '',
			volunteer6: '',
		},
			uploads: {
			submissionType: SubmissionType.CPCE,
			uploadOption: 'zip',
			zip: undefined,
			imageUpload: undefined,
			alwanDataForm: undefined,
			coralDataSheet: undefined,
			surveyGuides: undefined
		}
	})
}))
