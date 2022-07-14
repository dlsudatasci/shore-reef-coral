import cn from 'classnames'
import Image from 'next/image'
import { FC } from 'react'
import styles from '../styles/survey-display.module.css'
import type { ISubsection, ISection } from '../models/survey-summary'

const SurveyRow: FC<ISubsection> = ({ imgSrc, title, score, grade }) => {
	const className = cn({
		'bg-[#C74C33]': grade == 'D', // red
		'bg-[#D8AC3C]': grade == 'C', // yellow
		'bg-[#34B5CB]': grade == 'B', // blue
		'bg-[#7EC142]': grade == 'A', // green
	}, 'rounded-full w-8 h-8 text-secondary grid place-items-center')

	return (
		<div className={styles['section-row']}>
			<div className="flex items-center">
				<Image src={imgSrc} alt="Icon" height={30} width={30} />
				<span className="ml-4">{title}</span>
			</div>
			<div className="grid place-items-center">
				<p>{score.toFixed(1)}</p>
			</div>
			<div className="grid place-items-center">
				<p className={className}>{grade}</p>
			</div>
		</div>
	)
}

const SurveySection: FC<ISection> = ({ title, subsections }) => {
	return (
		<div className="font-comic-cat grid grid-cols-[3fr_1fr_1fr] text-secondary">
			<div className={styles['section-header']}><p>{title}</p></div>
			<div className={cn(styles['section-header'], 'justify-center')}><p className="text-center">Score</p></div>
			<div className={cn(styles['section-header'], 'justify-center')}><p className="text-center">Letter Grade</p></div>
			{subsections.map(e => <SurveyRow key={e.title} title={e.title} imgSrc={e.imgSrc} score={e.score} grade={e.grade} />)}
		</div>
	)
}

export default SurveySection
