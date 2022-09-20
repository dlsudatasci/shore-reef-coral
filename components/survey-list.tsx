import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'
import Mask from './icons/mask'

const style = "border-secondary group-hover:border-primary border-r-4 group-hover:bg-secondary flex items-center py-1.5 px-4 col-span-7 sm:col-span-8"

const SurveyItem: FC = () => {
	return (
		<Link href="/surveys/1">
			<div className="outline-secondary hover:outline-primary outline grid grid-cols-9
			 text-secondary hover:text-primary font-comic-cat text-xl cursor-pointer group hover:scale-105 transition-all">
				<div className={cn(style, 'border-b-2')}><p>Station Name</p></div>
				<div className="p-2 group-hover:bg-secondary row-span-2 col-span-2 sm:col-span-1 grid place-items-center">
					<div className="relative w-full h-full">
						<Mask className="fill-secondary group-hover:fill-primary" />
					</div>
				</div>
				<div className={cn(style, 'border-t-2')}><p>00 / 00 / 0000</p></div>
			</div>
		</Link>
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
