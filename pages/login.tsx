import { NextPage } from 'next'

const Login: NextPage = () => {
	return (
		<div className="grid place-items-center h-full px-4 sm:px-0">
			<div className="bg-primary sm:w-[600px] w-full sm:px-12 px-8 py-8 rounded-lg">
				<h2 className="font-comic-cat text-secondary mb-4">LOG IN</h2>
				<form action="">
					<div className="control">
						<label htmlFor="email" className="text-secondary">email</label>
						<input type="email" name="email" id="email" />
					</div>
					<div className="control">
						<label htmlFor="password" className="text-secondary">password</label>
						<input type="password" name="password" id="password" />
					</div>
					<input className="btn secondary mt-6" type="submit" value="Login" />
				</form>
				<p className="mt-6 text-secondary">Don't have an account? <a href="/register">Sign up here {'>'}</a></p>
				<p><a href="/forgot">Forgot your password?</a></p>
			</div>
		</div>
	)
}

export default Login