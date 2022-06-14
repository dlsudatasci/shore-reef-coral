import { FC } from 'react'
import cn from 'classnames'

interface IStep {
	i: number
	title: string
	isSelected?: boolean
}

const Step: FC<IStep> = ({ i, title, isSelected }) => {
	const className = cn({
		'bg-primary text-white': isSelected
	}, 'flex justify-center items-center rounded-full aspect-square w-12 border-primary border-4')

	return (
		<div className="flex-1 flex flex-col items-center text-primary">
			<div className={className}>
				<p className="text-2xl font-comic-cat">{i}</p>
			</div>
			<p className="text-center leading-4 w-20 mt-1">{title}</p>
		</div>
	)
}

const Steps: FC<{ steps: readonly string[] }> = ({ steps }) => {
	return (
		<div className="flex relative">
			{steps.map((step, i) => <Step key={i} i={i + 1} title={step} isSelected={true} />)}
		</div>
	)
}

export default Steps
