import DashboardNavbar from '../../../app/components/views/DashboardNavbar';
import Sidebar from '../../../app/components/views/Sidebar';

export default function BlogLayout({ children }) {
  return (
    <div className=" bg-gray-50">
      <DashboardNavbar />
      <div className="flex ">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
