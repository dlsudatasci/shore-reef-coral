import LoadingSpinner from '@components/loading-spinner'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Lesson: NextPage = () => {
	const { replace } = useRouter()

	useEffect(() => {
		if (replace) {
			replace('/lessons/bakit-kailangan-imonitor-ang-bahura')
		}
	}, [replace])

	return (
		<LoadingSpinner borderColor="border-primary" />
	)
}

export default Lesson