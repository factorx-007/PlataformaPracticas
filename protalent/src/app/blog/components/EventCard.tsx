export default function EventCard() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Eventos</h3>
      <div className="space-y-3">
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Conferencia de React</p>
            <p className="text-xs text-gray-500">15 de junio, 2023</p>
          </div>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="bg-purple-100 text-purple-600 rounded-lg p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium">Webinar: TypeScript Avanzado</p>
            <p className="text-xs text-gray-500">22 de junio, 2023</p>
          </div>
        </div>
      </div>
      <button className="w-full mt-3 text-blue-500 text-sm font-medium text-center py-2 hover:bg-blue-50 rounded-lg">
        Ver todos los eventos
      </button>
    </div>
  );
}
