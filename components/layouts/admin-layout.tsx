import { FC } from 'react';

const AdminLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-contain bg-top bg-no-repeat bg-secondary">
			<div className="container mx-auto px-4 xl:px-16">{children}</div>
		</div>
	)
}

export default AdminLayout
