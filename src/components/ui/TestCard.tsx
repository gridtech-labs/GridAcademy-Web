import Link from 'next/link';
import { Star, Clock, FileText, Zap } from 'lucide-react';
import { TestSeries } from '@/types';
import { formatPrice, formatDuration, cn } from '@/lib/utils';

interface TestCardProps {
  series: TestSeries;
  className?: string;
}

export default function TestCard({ series, className }: TestCardProps) {
  return (
    <Link href={`/test/${series.slug}`}
      className={cn(
        'group block bg-white rounded-2xl border border-gray-200 overflow-hidden',
        'hover:shadow-lg hover:border-indigo-200 transition-all duration-200',
        className
      )}>

      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
        {series.thumbnailUrl ? (
          <img src={series.thumbnailUrl} alt={series.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Exam badge */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-indigo-700
          text-xs font-semibold px-2 py-0.5 rounded-full">
          {series.examType}
        </span>

        {/* Free preview badge */}
        {series.isFirstTestFree && (
          <span className="absolute top-2 right-2 bg-green-500 text-white
            text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> Free Test
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
          {series.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{series.providerName}</p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" /> {series.testCount} Tests
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatDuration(series.durationMinutes * 60)}
          </span>
        </div>

        {/* Rating */}
        {series.reviewCount > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-700">{series.avgRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({series.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          {series.priceInr === 0 ? (
            <span className="text-base font-bold text-green-600">FREE</span>
          ) : (
            <span className="text-base font-bold text-gray-900">{formatPrice(series.priceInr)}</span>
          )}
          <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium
            group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
}
