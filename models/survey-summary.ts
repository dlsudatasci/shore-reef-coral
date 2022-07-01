export interface ISubsection {
	imgSrc: string
	title: string
	score: number
	grade: string
}

export interface ISection {
	title: string
	subsections: ISubsection[]
}

const sectionsTemplate: ISection[] = [
	{
		title: 'Reef Quality',
		subsections: [
			{
				title: 'Hard Coral Cover',
				imgSrc: '/coral-dark.png',
				score: 0.0,
				grade: 'D'
			},
			{
				title: 'Butterflyfish Abundance',
				imgSrc: '/butterfly-fish-dark.png',
				score: 0.0,
				grade: 'C'
			},
			{
				title: 'Butterflyfish Species Richness',
				imgSrc: '/butterfly-fish-dark.png',
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
				imgSrc: '/cots-dark.png',
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
				imgSrc: '/clam-dark.png',
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
				imgSrc: '/starfish-dark.png',
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
				imgSrc: '/starfish-dark.png',
				score: 0.0,
				grade: 'C'
			}
		]
	}
]

export default sectionsTemplate
