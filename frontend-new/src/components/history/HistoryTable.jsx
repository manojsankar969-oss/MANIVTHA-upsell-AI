import React from 'react';
import { History, Eye, Calendar, User, MessageSquare } from 'lucide-react';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';

export const HistoryTable = ({ history, loading, onViewRecord }) => {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size="lg" />
        <p className="text-slate-400 text-sm font-medium">Loading generation logs...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</span>
              </th>
              <th className="px-6 py-4">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Staff</span>
              </th>
              <th className="px-6 py-4">Customer Details</th>
              <th className="px-6 py-4">
                <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Script Preview</span>
              </th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {history.length > 0 ? (
              history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700 whitespace-nowrap">
                    {item.staff_name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-[150px] truncate">
                    {item.customer_details}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 max-w-[240px] truncate">
                    {item.ai_response}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <Button
                      variant="secondary"
                      onClick={() => onViewRecord(item)}
                      icon={Eye}
                      className="py-1.5 px-3 text-xs bg-slate-50 border border-slate-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 hover:border-indigo-100 font-semibold"
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2.5">
                    <div className="p-3 bg-slate-50 rounded-full">
                      <History className="w-8 h-8 opacity-30 text-slate-400" />
                    </div>
                    <p className="font-semibold text-slate-500">No logs generated yet</p>
                    <p className="text-xs text-slate-400 max-w-[240px]">
                      Created upsell scripts will appear here for audit and template cloning.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
