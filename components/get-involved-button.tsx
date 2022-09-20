import Link from 'next/link'

type GetInvolvedButtonProps = {
	icon: React.ReactNode
	text: string
	href: string
}

export default function GetInvolvedButton({ icon, text, href }: GetInvolvedButtonProps) {
	return (
		<Link href={href}>
			<a className="grid max-w-[150px] hover:scale-105 hover:bg-secondary transition-all
			fill-secondary hover:fill-primary text-secondary hover:text-primary group"
			>
				<div className="w-full  group-hover: border-2 border-secondary group-hover:border-b-primary p-6">
					{icon}
				</div>
				<div className="border-2 border-t-0 border-secondary grid place-items-center h-16 px-4">
					<p>{text}</p>
				</div>
			</a>
		</Link>
	)
}
