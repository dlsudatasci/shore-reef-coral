import { create } from 'zustand'
import { ISurveyInformation, MANAGEMENT_TYPES } from '../models/survey'
import { ITeam } from '../models/team'
import { IFileUploads } from '@components/survey-form/file-upload-schema'
import { UPLOAD_MODES } from '@lib/upload-modes'

export type Survey = {
	surveyInfo: ISurveyInformation
	team: ITeam
	uploads: IFileUploads
	setSurveyInfo: (data: ISurveyInformation) => void
	setTeam: (data: ITeam) => void
	setUploads: (data: IFileUploads) => void
}

export const useSurveyStore = create<Survey>(set => ({
	surveyInfo: {
		datetime: new Date(),
		station: 'Testing',
		startCorner: '12.455, 7.8292',
		endCorner: '12.455, 7.8292',
		gps: 'WGS84',
		province: 'Zambales',
		town: 'Botolan',
		barangay: 'Bangan',
		management: MANAGEMENT_TYPES[0],
		others: '',
	},
	team: {
		leader: 'Jared Blase Sy',
		scientist: 'Jared',
		member1: 'Jared',
		member2: 'Jared',
		member3: 'Jared',
		member4: '',
	},
	uploads: {
		mode: UPLOAD_MODES[0],
		zip: undefined,
		alwanDataForm: '',
		coralDataSheet: '',
		surveyGuides: ''
	},
	setSurveyInfo: (data: ISurveyInformation) => set({ surveyInfo: data }),
	setTeam: (data: ITeam) => set({ team: data }),
	setUploads: (data: IFileUploads) => set({ uploads: data })
}))
