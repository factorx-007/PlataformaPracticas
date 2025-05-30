"use client";
import { useParams } from "next/navigation";
import PostulacionForm from "../../PostulacionForm";
import Sidebar from "../../../../components/views/Sidebar";
import DashboardNavbar from "../../../../components/views/DashboardNavbar";

export default function CrearPostulacionPage() {
  const { ofertaId } = useParams();

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <div className="flex min-h-screen flex-1">
        <Sidebar />
        <main className="flex-1 p-10 bg-gray-50 flex justify-center items-start">
          <div className="max-w-xl w-full bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Postular a la Oferta</h2>
            <PostulacionForm ofertaId={ofertaId} />
          </div>
        </main>
      </div>
    </div>
  );
} 