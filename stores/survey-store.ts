import { create } from 'zustand'
import { ISurveyInformation } from '../models/survey'
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
		startCorner: 0,
		endCorner: 0,
		gps: 'WGS84',
		province: 'Manila',
		town: 'Manila',
		barangay: 'Manila',
		management: 'Manila',
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
