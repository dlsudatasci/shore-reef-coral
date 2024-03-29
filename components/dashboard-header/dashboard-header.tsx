import { Laptop } from '@components/icons'

type DashboardHeaderProps = {
	text: string
}

export function DashboardHeader({ text }: DashboardHeaderProps) {
	return (
		<div className="grid place-items-center mt-20">
			<div className="flex items-center border-secondary border py-6 px-8">
				<h1 className="mr-4 font-comic-cat text-secondary">{text}</h1>
				<Laptop className="w-14 fill-secondary" />
			</div>
		</div>
	)
}
