import { FC } from 'react';

const AdminLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-contain bg-top bg-repeat bg-secondary" style={{ backgroundImage: 'url(/bg2.png)' }}>
			<div className="container mx-auto mb-20 px-4 xl:px-16">{children}</div>
		</div>
	)
}

export default AdminLayout
