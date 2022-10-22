import { useState } from 'react'
import cn from 'classnames'
import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next'
import { getLesson, getLessonIds, getLessons } from '@lib/lessons'
import Link from 'next/link'
import styles from '@styles/Lesson.module.css'

const Lesson: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({ lessons, lessonData }) => {
	const [selected, setSelected] = useState<0 | 1>(0)

	return (
		<>
			<section className="bg-primary text-secondary px-4 py-10">
				<div className="grid gap-6 sm:grid-cols-[1fr_220px] max-w-6xl mx-auto">
					<div>
						<h1 className="font-comic-cat mb-4">{lessonData.title}</h1>
						<iframe className="w-full aspect-video" src={lessonData.url} title="YouTube video player"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
					</div>
					<div className="overflow-y-auto relative max-h-full">
						<table className="border-secondary border absolute">
							<tbody>
								{lessons.map(e => (
									<tr key={e.id} className="border-2 border-secondary">
										<td className="px-2 py-1">
											<Link href={`/lessons/${e.id}`}>
												<a className="text-secondary">{e.title}</a>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<p className="max-w-prose sm:col-span-2">
						{lessonData.description}
					</p>
				</div>
			</section>
			<section className="py-10">
				<div className="container mx-auto text-primary max-w-6xl px-4">
					<div className="outline-primary outline-2 outline w-min flex font-comic-cat mb-8">
						<button className={cn('p-2 w-24 block', { 'bg-primary text-secondary': !selected })} onClick={() => setSelected(0)}>Lesson</button>
						<button className={cn('p-2 w-24 block', { 'bg-primary text-secondary': selected })} onClick={() => setSelected(1)}>Resources</button>
					</div>
					<article className={styles.lesson} dangerouslySetInnerHTML={{ __html: lessonData.contentHtml }} />
				</div>
			</section >
		</>
	)
}

export default Lesson

export const getStaticPaths: GetStaticPaths = async () => {
	const paths = getLessonIds()

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
	const lessons = getLessons()
	const lessonData = await getLesson(params?.id as string ?? '')

	return {
		props: {
			lessons,
			lessonData,
		}
	}
}
