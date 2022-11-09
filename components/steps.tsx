import { FC } from 'react'
import cn from 'classnames'
import usePageStore from '../stores/page-store'

interface IStep {
	i: number
	title: string
	isSelected?: boolean
}

const Step: FC<IStep> = ({ i, title }) => {
	const { page } = usePageStore()
	
	const className = cn({
		'bg-secondary text-primary': i <= page,
	}, 'flex justify-center items-center rounded-full aspect-square w-12 border-secondary border-2')

	return (
		<div className="flex-1 flex flex-col items-center text-secondary">
			<div className={className}>
				<p className="text-2xl font-comic-cat">{i + 1}</p>
			</div>
			<p className="text-center leading-4 w-20 mt-1">{title}</p>
		</div>
	)
}

const Steps: FC<{ steps: readonly string[] }> = ({ steps }) => {
	return (
		<div className="flex relative">
			{steps.map((step, i) => <Step key={i} i={i} title={step} />)}
		</div>
	)
}

export default Steps
