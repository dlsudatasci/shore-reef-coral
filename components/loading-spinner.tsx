import classNames from 'classnames'
import { FC } from 'react'

const LoadingSpinner: FC<{ className?: string, borderColor: string }> = ({ className, borderColor }) => {
	const cn = classNames("flex justify-center items-center", className)

	return (
		<div className={cn}>
			<div className={`w-20 h-20 border-t-transparent border-8 border-solid rounded-full animate-spin ${borderColor}`} role="status" />
		</div>
	)
}

export default LoadingSpinner
