import Image from 'next/image'
import { FC } from 'react'
import cn from 'classnames'
import Link from 'next/link'

const style = "border-secondary group-hover:border-primary group-hover:bg-secondary border-4 flex items-center py-1.5 px-4 col-span-7 sm:col-span-8"

const SurveyItem: FC = () => {
	return (
		<Link href="/surveys/1">
			<div className="grid grid-cols-9 text-secondary hover:text-primary font-comic-cat text-xl cursor-pointer group hover:scale-105 transition-all">
				<div className={cn(style, 'border-b-2')}><p>Station Name</p></div>
				<div className="border-secondary p-2 group-hover:border-primary group-hover:bg-secondary border-4 border-l-0 row-span-2 col-span-2 sm:col-span-1 grid place-items-center">
					<div className="relative w-full h-full">
						<Image className="!hidden group-hover:!block" src="/mask-dark.png" alt="mask icon" layout="fill" />
						<Image className="!block group-hover:!hidden" src="/mask-light.png" alt="mask icon" layout="fill" />
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
