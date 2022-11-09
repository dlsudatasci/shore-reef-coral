import { FC } from 'react';

const DashboardLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-contain bg-top bg-no-repeat bg-primary" style={{ backgroundImage: 'url(/beach-bg.jpg)' }}>
			<div className="container mx-auto px-4 xl:px-16">{children}</div>
		</div>
	)
}

export default DashboardLayout
