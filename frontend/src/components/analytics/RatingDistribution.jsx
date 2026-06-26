import React from 'react';
import { Star } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../ui/Card';

export const RatingDistribution = ({ distribution = [], total = 0 }) => {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader title="AI Script Rating Distribution" icon={Star} />
      <CardBody className="space-y-4">
        {ratings.map((score) => {
          const item = distribution.find(d => parseInt(d.rating, 10) === score);
          const count = item ? parseInt(item.count, 10) : 0;
          const percentage = total > 0 ? (count / total) * 100 : 0;

          return (
            <div key={score} className="flex items-center gap-4">
              {/* Star Rating Label */}
              <div className="flex items-center gap-1 w-10 shrink-0 select-none">
                <span className="text-sm font-bold text-slate-600">{score}</span>
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              </div>

              {/* Progress Bar Container */}
              <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Percentage & Count Labels */}
              <div className="text-right w-14 shrink-0 whitespace-nowrap text-xs font-semibold text-slate-500">
                <span>{count}</span>
                <span className="text-[10px] text-slate-400 ml-1">({Math.round(percentage)}%)</span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
};
