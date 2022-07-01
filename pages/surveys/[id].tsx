import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import SurveySection from '../../components/survey-section'
import sectionsTemplate from '../../models/survey-summary'
import styles from '../../styles/survey-display.module.css'

const Survey: NextPage = () => {
	return (
		<>
			<Head>
				<title>Reef Mo | Survey</title>
			</Head>
			<section className={styles['survey-header'] + " text-primary font-comic-cat mt-8 px-2 mb-8"}>
				<div className="grid md:grid-cols-[4fr_3fr_60px] max-w-3xl mx-auto gap-y-8">
					<div className="grid border-4 md:border-r-2">
						<div className="border-b-2">
							<p>Survey Date &amp; Time</p>
						</div>
						<div className="border-t-2">
							<p>Station Name</p>
						</div>
					</div>
					<div className="grid grid-cols-[1fr_4fr] grid-rows-3 border-4 md:border-x-2">
						<div className="col-span-full border-b-2">
							<p className="text-center">Starting Corner Coordinates</p>
						</div>
						<div className="row-span-2 border-t-2 border-r-2 grid place-items-center">
							<Image src="/buoy-dark.png" alt="Buoy Icon" height={30} width={30} />
						</div>
						<div className="flex justify-between border-y-2 border-l-2 px-2">
							<p>Longtitude</p>
							<p>00.00</p>
						</div>
						<div className="flex justify-between border-l-2 border-t-2 px-2">
							<p>Latitude</p>
							<p>00.00</p>
						</div>
					</div>
					<div className="border-l-2 border-4 place-items-center hidden md:grid">
						<Image src="/mask-dark.png" alt="Mask Icon" height={50} width={50} />
					</div>
				</div>
			</section>

			<section>
				<div className="grid max-w-3xl mx-auto gap-y-8">
					{sectionsTemplate.map(e => <SurveySection key={e.title} title={e.title} subsections={e.subsections} />)}
				</div>
			</section>
		</>
	)
}

export default Survey
