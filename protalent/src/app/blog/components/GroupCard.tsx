export default function GroupCard() {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Tus grupos</h3>
        <button className="text-blue-500 text-sm">Ver todos</button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
            R
          </div>
          <div>
            <p className="text-sm font-medium">React Developers</p>
            <p className="text-xs text-gray-500">1.2k miembros</p>
          </div>
        </div>
        <div className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold mr-3">
            N
          </div>
          <div>
            <p className="text-sm font-medium">Next.js Community</p>
            <p className="text-xs text-gray-500">856 miembros</p>
          </div>
        </div>
      </div>
    </div>
  );
}
