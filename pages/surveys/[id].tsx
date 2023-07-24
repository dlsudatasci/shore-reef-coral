import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import SurveySection from '@components/survey-section'
import { sectionsTemplate } from '@models/survey-summary'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import SurveyInfo from '@components/survey-info'

const Survey: NextPage = () => {
	const router = useRouter()

	return (
		<>
			<Head>
				<title>Reef Mo | Survey</title>
			</Head>
			<div className="max-w-3xl w-full text-primary mx-auto mt-8 mb-4">
				<ChevronLeftIcon className="cursor-pointer w-8 hover:text-t-highlight" onClick={router.back} />
			</div>
			<SurveyInfo date={new Date().toDateString()} latitude='0.00' longitude='0.00' stationName='Station Name'  />

			<section className="mb-20">
				<div className="grid max-w-3xl mx-auto gap-y-8">
					{sectionsTemplate.map(e => <SurveySection key={e.title} title={e.title} subsections={e.subsections} />)}
				</div>
			</section>
		</>
	)
}

export default Survey
