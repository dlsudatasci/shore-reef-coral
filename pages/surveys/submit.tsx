import { NextPage } from 'next'
import SURVEY_STEPS from '@lib/survey-steps'
import Steps from '@components/steps'
import usePageStore from '@stores/page-store'
import { SurveyFormProps, SurveyInformation } from '@components/survey-form'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Mask } from '@components/icons'
import { objectToFormData, onUnauthenticated } from '@lib/utils'
import dynamic from 'next/dynamic'
import app from '@lib/axios-config'
import { useSurveyStore } from '@stores/survey-store'

const TeamInformation = dynamic<SurveyFormProps>(() => import('@components/survey-form').then(m => m.TeamInformation))
const Uploads = dynamic<SurveyFormProps>(() => import('@components/survey-form').then(m => m.Uploads))

const Contribute: NextPage = () => {
	const { page, nextPage, prevPage } = usePageStore()
	const router = useRouter()
	useSession({
		required: true,
		onUnauthenticated: onUnauthenticated(router)
	})

	function onSubmit() {
		if (page == SURVEY_STEPS.length - 1) {
			const { team, surveyInfo, uploads } = useSurveyStore.getState()
			app.post('/surveys', objectToFormData({ team, surveyInfo, uploads }))
		} else {
			nextPage()
		}
		window.scrollTo({ top: 200, behavior: 'smooth' })
	}

	function onBack() {
		prevPage()
		window.scrollTo({ top: 200, behavior: 'smooth' })
	}

	return (
		<>
			<div className="bg-cover pt-28 pb-14 grid gap-y-20 place-items-center" style={{ backgroundImage: 'url("/beach-bg.jpg")' }}>
				<div className="flex justify-center border-secondary border-2 items-center py-6 px-8">
					<h1 className="font-comic-cat text-secondary text-center mr-4">SUBMIT A SURVEY</h1>
					<Mask className="fill-secondary w-16" />
				</div>
				<div className="mb-10 w-[600px]">
					<Steps steps={SURVEY_STEPS} />
				</div>
			</div>
			<div className="grid justify-stretch md:justify-center px-4 md:px-0 bg-primary pb-16">
				<div className="md:w-[700px] w-full md:px-12 px-8 rounded-lg">
					<h3 className="font-comic-cat text-secondary text-center text-3xl mb-4">{SURVEY_STEPS[page]}</h3>
					{page == 0 && <SurveyInformation submitHandler={onSubmit} backHandler={onBack} />}
					{page == 1 && <TeamInformation submitHandler={onSubmit} backHandler={onBack} />}
					{page == 2 && <Uploads submitHandler={onSubmit} backHandler={onBack} />}
					<div className="flex space-x-4">
						{page != 0 && <input type="submit" form="survey-form" className="btn primary border-secondary border-2" value="BACK" />}
						<input className="btn secondary" form="survey-form" type="submit" value={page == SURVEY_STEPS.length - 1 ? 'SUBMIT' : 'NEXT'} />
					</div>
				</div>
			</div>
		</>
	)
}

export default Contribute
