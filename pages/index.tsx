import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "@styles/Home.module.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import app from "@lib/axios-config";
import { toast } from "react-toastify";
import { toastErrorConfig, toastSuccessConfig } from "@lib/toast-defaults";
import WaveBG from "@components/wave-bg";
import GetInvolvedButton from "@components/get-involved-button";
import { Laptop, Mask, Coral, Camera } from "@components/icons";
import cn from "classnames";
import { ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";

const contactSchema = yup.object({
	name: yup.string().required("Name is required!"),
	email: yup.string().email().required("Email is required!"),
	message: yup.string().required("Message is required!"),
});

export type ContactSchema = yup.InferType<typeof contactSchema>;

async function onSubmit(data: ContactSchema) {
	try {
		await app.post("/contact-us", data);
		toast.success("Email was sent!", toastSuccessConfig);
	} catch {
		toast.error("An error has occurred", toastErrorConfig);
	}
}

const Home: NextPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ContactSchema>({
		resolver: yupResolver(contactSchema),
	});

	const videoUrl = "https://www.youtube.com/embed/qC4-8AZrGkM";

	return (
		<div className={styles.home}>
			<section className="relative !px-0 !py-0">
				<ParallaxBanner className="main-height w-full !mx-0 !max-w-full">
					<ParallaxBannerLayer speed={-60}  >
						<Image
							src="/landing.jpg"
							alt="Diver taking pictures"
							fill
							className="object-cover object-bottom md:object-contain md:object-center"
						/>
					</ParallaxBannerLayer>
				</ParallaxBanner>
				<WaveBG className="absolute -bottom-5 md:-bottom-8 lg:-bottom-10 xl:-bottom-16" />
			</section>
			<section className="relative">
				{/* <WaveBG className="absolute top-0 left-0" /> */}
				{/* <WaveBG className="absolute -top-12 md:-top-16 lg:-top-20 xl:-top-44 left-0 z-10" /> */}
				<div className="grid md:grid-cols-2 gap-x-8 gap-y-12">
					<div className="place-self-center">
						<div className={styles.header}>
							<h1>Reef Mo,</h1>
							<Mask className="fill-secondary w-16" />
						</div>
						<h1 className="-mt-4 mb-4">I-monitor mo!</h1>
						<p>
							Reef Mo is every citizen scientist&apos;s one-stop shop for reef
							monitoring in the Philippines. Here, we bring experts and citizen
							scientists together to study reefs, collaborate, and share reef
							survey data and learning materials.
						</p>
						<Link className="btn secondary w-72" href="/surveys/submit">Dive In</Link>
					</div>
					<div className="relative">
						<Image
							src="/landing-1.jpg"
							width="1920"
							height="1283"
							alt="A research team"
							className="object-contain"
						/>
					</div>
				</div>
				<div className="flex justify-center space-x-6 mx-auto mt-12">
					<Image src="/logos/DLSU.png" width={75} height={75} alt="DLSU Logo" />
					<Image src="/logos/DSI.png" width={75} height={75} alt="DSI Logo" />
					<Image
						src="/logos/SHORE.png"
						width={75}
						height={75}
						alt="SHORE Logo"
					/>
					<Image src="/logos/DOST.png" width={75} height={75} alt="DOST Logo" />
				</div>
			</section>
			<section className="relative min-h-[50vh]">
				<Image
					src="/bg2.png"
					alt="Checkered background"
					fill
					className="z-0 object-cover"
					quality={100}
				/>
				<div className="!max-w-2xl mx-auto z-10 relative">
					<iframe
						className="w-full col-span-full aspect-video mb-8"
						src={videoUrl}
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
					<div className="grid sm:grid-cols-[3fr_7fr] items-start text-primary">
						<div className={cn(styles.header)}>
							<h1>
								About
								<br />
								Us
							</h1>
						</div>
						<div>
							<p>
								ReefMo aims to empower ordinary citizens to monitor their reefs
								using the Alwan methods and see results in real time. These
								methods were developed in cooperation between the academe,
								citizen scientists, and DOST-PCAARRD.
							</p>
							<Link className="btn primary w-56" href="/about">Dive Deeper</Link>
						</div>
					</div>
				</div>
			</section>
			<ParallaxBanner className="relative min-h-[70vh] text-secondary">
				<ParallaxBannerLayer speed={-60}>
					<Image
						src="/landing-2.jpg"
						alt="Diver"
						fill
						className="z-0 object-cover"
						quality={100}
					/>
				</ParallaxBannerLayer>
				<ParallaxBannerLayer className="grid place-items-center h-full relative z-10">
					<div className="max-w-md text-center grid justify-items-center gap-y-4">
						<h1>
							Become a<br />
							citizen scientist
						</h1>
						<p className="max-w-xs">
							Want to become a citizen scientist? Take our online course and
							learn how you can help survey our reefs.
						</p>
						<Link className="btn secondary" href="/lessons">Take the course</Link>
					</div>
				</ParallaxBannerLayer>
			</ParallaxBanner>
			<section className="relative min-h-[70vh] text-center">
				<Image
					src="/bg4.png"
					alt="Paper background"
					fill
					className="z-0 object-cover"
				/>
				<div className="grid place-items-center gap-y-16 relative z-10">
					<h1 className="text-5xl sm:text-7xl">Get Involved!</h1>
					<div className="grid grid-cols-2 sm:grid-cols-4 gap-8 font-comic-cat text-xl leading-6">
						<GetInvolvedButton
							icon={<Laptop />}
							href="/register"
							text="Sign up"
						/>
						<GetInvolvedButton
							icon={<Mask />}
							href="/teams"
							text="Join a team"
						/>
						<GetInvolvedButton
							icon={<Coral />}
							href="/lessons"
							text="Take the course"
						/>
						<GetInvolvedButton
							icon={<Camera />}
							href="/surveys/submit"
							text="Conduct a survey"
						/>
					</div>
				</div>
			</section>
			<section className={styles.secondary}>
				<div className="!max-w-2xl grid md:grid-cols-[200px_1fr] gap-x-6">
					<div className="hidden sm:flex items-center">
						<div className="h-3/4 relative aspect-[600/775] -left-28 lg:-left-40 -rotate-12">
							<Image src="/landing-3.png" alt="Diver" fill />
						</div>
					</div>
					<div>
						<h1 className="mb-4">Contact Us</h1>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="control">
								<label htmlFor="name">Name</label>
								<input type="text" {...register("name")} />
								<p className="error">{errors.name?.message}</p>
							</div>
							<div className="control">
								<label htmlFor="email">Email</label>
								<input type="email" {...register("email")} />
								<p className="error">{errors.email?.message}</p>
							</div>
							<div className="control">
								<label htmlFor="message">Message</label>
								<textarea id="message" rows={10} {...register("message")} />
								<p className="error">{errors.message?.message}</p>
							</div>
							<input
								type="submit"
								value="Submit"
								className="btn primary mt-8"
							/>
						</form>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
