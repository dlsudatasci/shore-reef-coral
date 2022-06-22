import { FC } from 'react';

const DashboardLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-cover bg-no-repeat bg-primary" style={{ backgroundImage: 'url(beach-bg.jpg)'}}>
			{children}
		</div>
	)
}

export default DashboardLayout
