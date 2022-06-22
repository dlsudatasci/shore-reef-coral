import { FC } from 'react';

const Card: FC<{ number: number, noun: string, verb: string }> = ({ number, noun, verb }) => {
	return (
		<div className="bg-highlight text-t-highlight flex flex-1 justify-center items-center px-6 py-8 rounded-lg font-comic-cat">
			<p className="text-6xl mr-4">{number}</p>
			<div className="text-lg">
				<p>{noun}</p>
				<p>{verb}</p>
			</div>
		</div>
	)
}

export default Card
