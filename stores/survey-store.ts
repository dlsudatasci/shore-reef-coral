import { create } from 'zustand'
import { ISurveyInformation, MANAGEMENT_TYPES } from '../models/survey'
import { ITeam } from '../models/team'

export type Survey = {
	surveyInfo: ISurveyInformation
	team: ITeam
	setSurveyInfo: (data: ISurveyInformation) => void
	setTeam: (data: ITeam) => void
}

const useSurveyStore = create<Survey>(set => ({
	surveyInfo: {
		datetime: new Date(),
		station: '',
		startCorner: '',
		endCorner: '',
		gps: 'WGS84',
		province: '',
		town: '',
		barangay: '',
		management: MANAGEMENT_TYPES[0],
		others: '',
	},
	team: {
		leader: '',
		scientist: '',
		member1: '',
		member2: '',
		member3: '',
		member4: '',
	},
	setSurveyInfo: (data: ISurveyInformation) => set({ surveyInfo: data }),
	setTeam: (data: ITeam) => set({ team: data })
}))

export default useSurveyStore
