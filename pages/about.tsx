import WaveBG from '@components/wave-bg'
import { NextPage } from 'next'
import styles from '@styles/Home.module.css'
import Mask from '@components/icons/mask'
import Image from 'next/image'
import ButterflyFish from '@components/icons/butterfly-fish'
import cn from 'classnames'
import { ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";
import Waves from '@components/icons/waves'
import Starfish from '@components/icons/starfish'
import Cots from '@components/icons/cots'
import Featherstar from '@components/icons/featherstar'
import Clam from '@components/icons/clam'
import Coral from '@components/icons/coral'


const About: NextPage = () => {
	return (
		<div className={styles.home}>
			<section className='relative !px-0 !py-0'>
				<ParallaxBanner className="main-height w-full !mx-0 !max-w-full">
					<ParallaxBannerLayer speed={-40}>
						<Image src="/about_banner.jpg" alt="Diver taking pictures" layout="fill" objectFit="cover" objectPosition="top" />
					</ParallaxBannerLayer>
				</ParallaxBanner>
				<WaveBG className="absolute -bottom-5 md:-bottom-8 lg:-bottom-10 xl:-bottom-16" />
			</section>
			<section className='relative !py-32'>
				<div className="grid md:grid-cols-2 gap-8 !max-w-6xl items-center">
					<Image src="/about-1.jpg" alt="Diver" layout="responsive" width={3} height={2} />
					<div>
						<h1>What is</h1>
						<div className="flex items-center -mt-2 space-x-4 mb-4">
							<h1 className="text-6xl">Reef mo?</h1>
							<Mask className="fill-secondary w-14 inline" />
						</div>
						<p className="max-w-prose">
							Globally, coral reefs are under threat due to human-induced climate change and direct
							human impacts. The Philippines in particular has lost a third of its coral cover in the past
							decade1. The continued threat to our reefs necessitates the establishment of a nationwide
							monitoring system to determine how reefs are changing and what management efforts are
							appropriate. However, there are not enough Filipino coral scientists to monitor the country&apos;s
							estimated 27,000 sq. km. of reef area.
						</p>
					</div>
				</div>
				<div className="border-2 bg-secondary p-8 mt-16 !max-w-4xl">
					<p className="max-w-prose mx-auto text-center text-primary">
						ReefMo is a movement aimed at addressing this gap
						through citizen science. It provides a means for ordinary
						people to become citizen scientists, facilitates collaboration
						between researchers and citizen scientists, and acts as a hub
						for reef data generated by citizen science efforts.
					</p>
				</div>
			</section>
			<ParallaxBanner className="min-h-[60vh] relative grid place-items-center">
				<ParallaxBannerLayer speed={-35}>
					<Image src="/about-2.jpg" alt="A picture of the Reef Mo Team" layout="fill" objectFit="cover" className="z-0" />
				</ParallaxBannerLayer>
				<div className="!max-w-3xl relative z-10 text-xl text-secondary">
					<h1 className="mb-8">
						Our <span className="flex items-center text-6xl -mt-2">Vision <Waves className='fill-secondary w-14 ' /> </span>
					</h1>
					<p>
						ReefMo aims to empower citizen scientists from all walks of life, especially
						members of coastal communities, to monitor their reefs as part of a
						nationwide reef monitoring network that will inform management decisions
						and communicate the importance of reefs to every Filipino.
					</p>
				</div>
			</ParallaxBanner>
			<ParallaxBanner className="relative py-24">
				<ParallaxBannerLayer speed={30}>
					<Image
						src="/bg4.png"
						alt="Checkered background"
						layout="fill"
						objectFit="cover"
						className="z-0"
						quality={100}
					/>
				</ParallaxBannerLayer>
				<div className="relative grid md:grid-cols-[1fr_2fr] gap-y-4 z-10 mx-auto text-secondary !max-w-5xl">
					<div className="sm:w-56">
						<h1>The Alwan Methods</h1>
						<div className='flex gap-3'>
							<ButterflyFish className='fill-primary' />
							<Starfish className='fill-primary' />
							<Cots className='fill-primary' />
							<Featherstar className='fill-primary' />
							<Clam className='fill-primary' />
							<Coral className='fill-primary' />
						</div>
					</div>
					<div className="space-y-4">
						<p>
							&ldquo;Alwan&rdquo; is a Batangueño term that means to
							ease or be in a more comfortable or improved
							situation. It reflects our vision to make coral
							reef monitoring more accessible and easier
							for citizen scientists to carry out.
						</p>
						<p>
							The Alwan methods quantify three core
							groups of organisms which serve as reef
							indicators: corals, butterflyfishes, and target
							marine invertebrates. These methods were
							designed to be simple and affordable enough
							for anyone to implement with minimal
							training, while still producing high-quality
							data.
						</p>
					</div>
				</div>
			</ParallaxBanner>
			<section>
				<div className="grid md:grid-cols-2 gap-x-16 gap-y-4 items-center !max-w-3xl">
					<div>
						<div className="bg-secondary flex w-fit space-x-2 px-2 items-center mb-6">
							<ButterflyFish className="w-4 aspect-square fill-accent-1" />
							<h6 className="text-primary font-comic-cat inline">Alwan • the process</h6>
						</div>
						<p>
							Citizen scientists are taught how to recognize the reef indicators and conduct
							reef surveys using only minimal equipment fabricated from materials which are
							commonly available in coastal communities. After the surveys have been conducted, the
							whole community can participate in processing the images taken from the reef
							and get immediate feedback on how their reef is doing. These results can then inform
							management decisions.
						</p>
					</div>
					<div className="w-full grid gap-y-2">
						<Image src="/about-3.jpg" alt="Reef Mo Team Meeting" layout="responsive" width={1500} height={1000} />
						<Image src="/about-4.jpg" alt="Diver taking notes" layout="responsive" width={256} height={171} />
					</div>
				</div>
			</section>
			<section className={cn(styles.secondary, "relative")}>
				<Image
					src="/bg2.png"
					alt="Checkered background"
					layout="fill"
					objectFit="cover"
					className="z-0"
					quality={100}
				/>
				<div className="grid !max-w-3xl relative z-10">
					<div className="bg-primary flex w-fit space-x-2 px-2 items-center mb-6">
						<ButterflyFish className="w-4 aspect-square fill-secondary" />
						<h6 className="text-secondary font-comic-cat inline">Alwan • Development</h6>
					</div>
					<p className="mb-4">
						The development of the Alwan methods was spearheaded by Dr. Wilfredo
						Licuanan of the De La Salle University - Br. Alfred Shields FSC Ocean
						Research Center, along with Dr. Terry Gosliner and Dr. Meg Burke of the
						California Academy of Sciences, Dr. Kent Carpenter of Old Dominion
						University, and Dr. Jeff Williams of the Smithsonian Institution. Other coral
						researchers, non-government organizations, freediving experts, and three
						different communities in Batangas province assisted in their development,
						testing, and initial implementation.
					</p>
					<p>
						In order to facilitate the rollout of the Alwan methods at a wider scale, the
						“Capacity-Building on Reef Assessment and Coral Taxonomy Phase 2
						(C-BRACT 2)” Project was initiated by DLSU-SHORE with funding from
						DOST-PCAARRD. CBRACT 2 seeks to train researchers from higher
						educational institutions, government agencies, and their community
						partners in the Alwan methods, create training and educational materials,
						and establish a database for the management of citizen science data.
					</p>
				</div>
			</section>
		</div>
	)
}

export default About
