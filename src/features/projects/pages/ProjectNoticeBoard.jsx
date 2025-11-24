import { motion } from 'framer-motion';
import { Bell, Search, Filter, Pin, Trash2, Calendar, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import FilterPillTabs from '../../../shared/components/FilterPillTabs';
import { Button } from '../../../shared/components/ui/button';
import UrlBreadcrumbs from '../../../shared/components/UrlBasedBreadcrumb';

function ProjectNoticeBoard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAckModal, setShowAckModal] = useState(null);

  const currentUser = 'Shefali Gajbhiye';

  const [notices, setNotices] = useState([
    {
      id: 1,
      title: 'UNLOCK ALL YOUR PROJECTS TODAY BY SUBSCRIBING TO EAARTH',
      message: 'Get premium access to all features including unlimited projects, cloud storage, and priority support.',
      date: '15/11/2024',
      priority: 'high',
      isPinned: true,
      category: 'Subscription',
      requiresAcknowledgment: true,
      acknowledgedBy: [],
    },
    {
      id: 2,
      title: 'SHEFALI WAS ADDED AS ANIMATION ARTIST IN MOVIE "AVATAR"',
      message: 'You have been assigned a new role in the project. Please review the project details and timeline.',
      date: '14/11/2024',
      priority: 'medium',
      isPinned: true,
      category: 'Project Assignment',
      requiresAcknowledgment: true,
      acknowledgedBy: [],
    },
    {
      id: 3,
      title: 'SYSTEM MAINTENANCE SCHEDULED',
      message: 'The platform will undergo scheduled maintenance on 20/11/2024 from 02:00 to 04:00 AM GMT.',
      date: '13/11/2024',
      priority: 'medium',
      isPinned: false,
      category: 'System',
      requiresAcknowledgment: false,
      acknowledgedBy: [],
    },
    {
      id: 4,
      title: 'NEW FEATURE: CLOUD STORAGE INTEGRATION',
      message: 'We have integrated cloud storage for seamless file sharing across your projects.',
      date: '12/11/2024',
      priority: 'low',
      isPinned: false,
      category: 'Feature Update',
      requiresAcknowledgment: false,
      acknowledgedBy: [],
    },
  ]);

    const filters = [
    { value: 'all', label: 'ALL' },
    { value: 'high', label: 'HIGH PRIORITY' },
    { value: 'medium', label: 'MEDIUM PRIORITY' },
    { value: 'low', label: 'LOW PRIORITY' },
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const handleAcknowledge = (noticeId) => {
    setNotices(notices.map(notice => {
      if (notice.id === noticeId) {
        const newAck = {
          name: currentUser,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
        };
        return {
          ...notice,
          acknowledgedBy: [...(notice.acknowledgedBy || []), newAck],
        };
      }
      return notice;
    }));
    toast.success('Notice acknowledged');
    setShowAckModal(null);
  };

  const handlePin = (noticeId) => {
    setNotices(notices.map(notice =>
      notice.id === noticeId ? { ...notice, isPinned: !notice.isPinned } : notice
    ));
  };

  const handleDelete = (noticeId) => {
    setNotices(notices.filter(notice => notice.id !== noticeId));
    toast.success('Notice deleted');
  };

  const filteredNotices = notices
    .filter(notice =>
      (filterPriority === 'all' || notice.priority === filterPriority) &&
      (notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notice.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));


  return (
    <div className="w-full space-y-4">
      {/* TITLE WRAPPER — Replace Later */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#faf5ff] dark:bg-[#9333ea] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#7c3aed] dark:text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">NOTICE BOARD</h1>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="ml-[52px]">
          <UrlBreadcrumbs />
        </div>
      </div>

      {/* SEARCH CARD */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH NOTICES..."
          className="w-full pl-10 p-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none"
        />
      </div>

      {/* FILTER PILLS — Replace Later */}
      <FilterPillTabs
        options={filters}
        value={filterPriority}
        onChange={setFilterPriority}
      />

      {/* NOTICES */}
      <div className="space-y-4">
        {filteredNotices.map((notice, index) => {
          const hasUserAcknowledged = notice.acknowledgedBy?.some(
            ack => ack.name === currentUser
          );

          return (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-background border rounded-2xl p-5"
            >
              <div className="space-y-4">
                {/* HEADER */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {notice.isPinned && (
                      <Pin className="w-5 h-5 text-[#9333ea] fill-[#9333ea] flex-shrink-0 mt-1" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityColors[notice.priority]}`}>
                          {notice.priority.toUpperCase()}
                        </span>

                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {notice.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                        {notice.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {notice.message}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePin(notice.id)}
                      className={`p-2 rounded-lg transition ${notice.isPinned
                        ? 'bg-[#faf5ff] text-[#9333ea]'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      <Pin className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(notice.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{notice.date}</span>
                  </div>

                  {notice.requiresAcknowledgment && (
                    <div className="flex items-center gap-3">
                      {hasUserAcknowledged ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-bold">ACKNOWLEDGED</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAcknowledge(notice.id)}
                        >
                          ACKNOWLEDGE
                        </Button>
                      )}

                      <button
                        onClick={() => setShowAckModal(notice.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* ACKNOWLEDGED LIST */}
                {showAckModal === notice.id &&
                  notice.acknowledgedBy.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    >
                      <h4 className="font-bold mb-3 text-gray-900 dark:text-white">
                        ACKNOWLEDGED BY:
                      </h4>

                      <div className="space-y-2">
                        {notice.acknowledgedBy.map((ack, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span className="font-medium">{ack.name}</span>
                            <span>{ack.date} at {ack.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredNotices.length === 0 && (
        <div className=" p-24 text-center mt-4">
          <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
            No Notices Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            No notices match your current filters
          </p>
        </div>
      )}
    </div>
  );
}

export default ProjectNoticeBoard;







