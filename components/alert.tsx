import { FC } from 'react';
import Image from 'next/image'
import cn from 'classnames'

const Alert: FC<{ isError?: boolean, message: string }> = ({ isError, message }) => {
	const style = cn({
		'bg-highlight text-t-highlight': !isError,
		'bg-error text-secondary': isError,
	}, 'px-6 py-4 flex items-center rounded-md mb-6')

	return (
		<div className={style}>
			<Image src={isError ? '/alert.png' : '/check.png'} alt="Check Icon" width={28} height={28} />
			<p className="leading-5 ml-4 text-lg">{message}</p>
		</div>
	)
}

export default Alert
