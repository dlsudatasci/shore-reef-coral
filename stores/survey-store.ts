import create from 'zustand'
import { ISurveyInformation } from '../models/survey'
import { ITeam } from '../models/team'

export type Survey = {
	surveyInfo: ISurveyInformation
	team: ITeam
}

const useSurveyStore = create<Survey>(set => ({
	surveyInfo: {
		datetime: new Date(),
		station: '',
		startCorner: '',
		endCorner: '',
		gps: '',
		province: '',
		town: '',
		barangay: '',
		management: '',
		others: '',
	},
	team: {
		leader: '',
		scientist: '',
		member1: '',
		member2: '',
		member3: '',
		member4: '',
	}
}))

export default useSurveyStore
