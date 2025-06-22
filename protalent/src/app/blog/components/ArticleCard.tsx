import { FiBookmark, FiShare2, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

export default function ArticleCard({
  title,
  excerpt,
  author,
  date,
  readTime,
  category,
  imageUrl,
  likes,
  comments,
}: ArticleCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image 
          src={imageUrl} 
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <button className="p-2 rounded-full bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100 transition-all">
            <FiBookmark className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
            {category}
          </span>
          <span className="mx-2">•</span>
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readTime} read</span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
              {author.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">{author}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center text-gray-500 hover:text-blue-600">
              <FiMessageSquare className="h-4 w-4 mr-1" />
              <span className="text-sm">{comments}</span>
            </button>
            <button className="flex items-center text-gray-500 hover:text-red-500">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm">{likes}</span>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <FiShare2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
