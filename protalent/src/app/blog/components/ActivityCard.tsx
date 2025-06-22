import { FiClock, FiMessageSquare, FiThumbsUp, FiUserPlus } from 'react-icons/fi';
import Image from 'next/image';

// Usar avatares de placeholder de un servicio en línea
const getAvatarUrl = (id: number) => `https://i.pravatar.cc/150?img=${id}`;

const activities = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'liked your post',
    target: '10 Tips for Better UI Design',
    time: '2 hours ago',
    avatar: getAvatarUrl(1),
    icon: <FiThumbsUp className="h-4 w-4 text-blue-500" />,
  },
  {
    id: 2,
    user: 'Mike Chen',
    action: 'commented on',
    target: 'The Future of Web Development',
    time: '5 hours ago',
    avatar: getAvatarUrl(2),
    icon: <FiMessageSquare className="h-4 w-4 text-green-500" />,
  },
  {
    id: 3,
    user: 'Emma Wilson',
    action: 'started following you',
    target: '',
    time: '1 day ago',
    avatar: getAvatarUrl(3),
    icon: <FiUserPlus className="h-4 w-4 text-purple-500" />,
  },
  {
    id: 4,
    user: 'Alex Turner',
    action: 'mentioned you in',
    target: 'Design System Discussion',
    time: '2 days ago',
    avatar: getAvatarUrl(4),
    icon: <FiMessageSquare className="h-4 w-4 text-yellow-500" />,
  },
];

export default function ActivityCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.map((activity) => (
          <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex">
              <div className="relative h-10 w-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden">
                <Image 
                  src={activity.avatar}
                  alt={activity.user}
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              </div>
              
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">{activity.user}</span>
                  <span className="mx-1 text-gray-500">{activity.action}</span>
                  {activity.target && (
                    <span className="text-sm font-medium text-blue-600">{activity.target}</span>
                  )}
                </div>
                <div className="flex items-center mt-1">
                  <FiClock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
              
              <div className="ml-2 flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                  {activity.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <button className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
          View All Activity
        </button>
      </div>
    </div>
  );
}
