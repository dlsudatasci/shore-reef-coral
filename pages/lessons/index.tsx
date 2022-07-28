import LoadingSpinner from '@components/loading-spinner'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

const Lesson: NextPage = () => {
	const { replace } = useRouter()

	replace('/lessons/bakit-kailangan-imonitor-ang-bahura')

	return (
		<LoadingSpinner borderColor="border-primary" />
	)
}

export default Lesson