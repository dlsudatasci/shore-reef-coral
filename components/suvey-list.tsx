import Image from 'next/image'
import { FC } from 'react'
import cn from 'classnames'

const style = "border-secondary border-4 flex items-center py-1.5 px-4 col-span-7 sm:col-span-8"

const SurveyItem: FC = () => {
	return (
		<div className="grid grid-cols-9 text-secondary font-comic-cat text-xl">
			<div className={cn(style, 'border-b-2')}><p>Station Name</p></div>
			<div className="border-secondary border-4 border-l-0 row-span-2 col-span-2 sm:col-span-1 grid place-items-center">
				<Image src="/mask-light.png" width={60} height={60} alt="mask icon" />
			</div>
			<div className={cn(style, 'border-t-2')}><p>00 / 00 / 0000</p></div>
		</div>
	)
}

const SurveyList: FC<{ className?: string }> = ({ className }) => {
	return (
		<div className={cn('grid gap-y-6 max-w-3xl mx-auto', className)}>
			<SurveyItem />
			<SurveyItem />
		</div>
	)
}

export default SurveyList
