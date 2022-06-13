import { NextPage } from 'next'

const Register: NextPage = () => {
	return (
		<div className="grid place-items-center h-full px-4 sm:px-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 px-8 py-8 rounded-lg">
				<h2 className="font-comic-cat text-secondary mb-4">REGISTER</h2>
				<form action="">
					<div className="control">
						<label htmlFor="email" className="text-secondary">email</label>
						<input type="email" name="email" id="email" />
					</div>
					<div className="control">
						<label htmlFor="password" className="text-secondary">password</label>
						<input type="password" name="password" id="password" />
					</div>
					<div className="control">
						<label htmlFor="first-name" className="text-secondary">first name</label>
						<input type="text" name="firstName" id="first-name" />
					</div>
					<div className="control">
						<label htmlFor="last-name" className="text-secondary">last name</label>
						<input type="text" name="lastName" id="last-name" />
					</div>
					<div className="control">
						<label htmlFor="affiliation" className="text-secondary">affiliation</label>
						<input type="text" name="affiliation" id="affiliation" />
					</div>
					<input className="btn secondary mt-6" type="submit" value="Register" />
				</form>
				<p className="mt-6 text-secondary">Already have an account? <a href="/login">Log in here {'>'}</a></p>
			</div>
		</div>
	)
}

export default Register
