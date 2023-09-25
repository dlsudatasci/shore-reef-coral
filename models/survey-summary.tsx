import { ButterflyFish, Clam, Coral, Cots, Starfish } from "@components/icons"

export interface ISubsection {
	Img: typeof Clam
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
				Img: Coral,
				score: 0.0,
				grade: 'D'
			},
			{
				title: 'Butterflyfish Abundance',
				Img: ButterflyFish,
				score: 0.0,
				grade: 'C'
			},
			{
				title: 'Butterflyfish Species Richness',
				Img: ButterflyFish,
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
				Img: Cots,
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
				Img: Clam,
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
				Img: Starfish,
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
				Img: Starfish,
				score: 0.0,
				grade: 'C'
			}
		]
	}
]
