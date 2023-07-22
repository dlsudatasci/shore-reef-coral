import { ButterflyFish, Clam, Coral, Cots, Starfish } from "@components/icons"

export interface ISubsection {
	img: React.ReactNode
	title: string
	score: number
	grade: string
}

export interface ISection {
	title: string
	subsections: ISubsection[]
}

export const sectionsTemplate: ISection[] = [
	{
		title: 'Reef Quality',
		subsections: [
			{
				title: 'Hard Coral Cover',
				img: <Coral />,
				score: 0.0,
				grade: 'D'
			},
			{
				title: 'Butterflyfish Abundance',
				img: <ButterflyFish />,
				score: 0.0,
				grade: 'C'
			},
			{
				title: 'Butterflyfish Species Richness',
				img: <ButterflyFish />,
				score: 0.0,
				grade: 'B'
			}
		]
	},
	{
		title: 'Threats',
		subsections: [
			{
				title: 'Crown-of-thorns Starfish Abundance',
				img: <Cots />,
				score: 0.0,
				grade: 'A'
			},
		],
	},
	{
		title: 'Level of Compliance',
		subsections: [
			{
				title: 'Giant Clams Abundance',
				img: <Clam />,
				score: 0.0,
				grade: 'B'
			}
		]
	},
	{
		title: 'Currents and Water Quality',
		subsections: [
			{
				title: 'Feather Star Abundance',
				img: <Starfish />,
				score: 0.0,
				grade: 'A',
			}
		]
	},
	{
		title: 'Sustainability for Baby Corals',
		subsections: [
			{
				title: 'Blue Linckia Starfish Abundance',
				img: <Starfish />,
				score: 0.0,
				grade: 'C'
			}
		]
	}
]
