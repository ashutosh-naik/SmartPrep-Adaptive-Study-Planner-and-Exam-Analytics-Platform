import { useEffect, useState } from 'react';
import { RotateCcw, CalendarDays, AlertCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import { plannerService } from '../../services/plannerService';
import { formatShortDate } from '../../utils/dateUtils';
import toast from 'react-hot-toast';

const BacklogView = () => {
    const [backlog, setBacklog] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchBacklog(); }, []);

    const fetchBacklog = async () => {
        try {
            const res = await plannerService.getBacklog();
            setBacklog(res.data || []);
        } catch { setBacklog([]); }
        finally { setLoading(false); }
    };

    const handleRedistribute = async () => {
        try {
            const res = await plannerService.redistribute();
            toast.success(`${res.data?.redistributed || 0} tasks redistributed`);
            fetchBacklog();
        } catch { toast.error('Redistribution failed'); }
    };

    return (
        <div>
            <Navbar title="Backlog" subtitle="Skipped & redistributed tasks" />
            <div className="p-8 animate-fade-in">
                {loading ? (
                    <Loader />
                ) : backlog.length > 0 ? (
                    <div className="space-y-6">
                        {/* Dark Gradient Banner */}
                        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl shadow-gray-900/10">
                            {/* Background accents */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                            
                            <div className="relative z-10">
                                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-amber-400 mb-3">
                                            <AlertCircle size={20} />
                                            <span className="font-bold tracking-wide text-sm">BACKLOG REDISTRIBUTION</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold font-heading mb-2">Schedule Adustment Required</h2>
                                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                                            You have missed <span className="text-white font-bold">{backlog.length} sessions</span> recently. To ensure you finish all topics before your exam, your daily study load needs to increase slightly.
                                        </p>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 w-full sm:w-auto shrink-0 text-center flex flex-col items-center justify-center">
                                        <div className="flex items-center gap-1 text-red-300 mb-1">
                                            <ArrowUpRight size={18} />
                                            <span className="font-bold text-lg">+12%</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">Daily Load Increase</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-400">
                                        Tasks will be distributed evenly over the next 14 days.
                                    </div>
                                    <button 
                                        onClick={handleRedistribute} 
                                        className="w-full sm:w-auto bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-600/30"
                                    >
                                        <CheckCircle2 size={18} /> Confirm New Schedule
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Backlog List */}
                        <div>
                            <h3 className="text-lg font-bold text-text-primary mb-4 ml-1">Pending Topics</h3>
                            <div className="space-y-3">
                                {backlog.map((task) => (
                                    <div key={task.id} className="bg-white border border-gray-100 p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center shrink-0">
                                            <RotateCcw size={18} className="text-amber-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-text-primary mb-0.5">{task.topicName}</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-primary-600 font-semibold">{task.subjectName}</span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-text-muted">Missed on {formatShortDate(task.originalDate)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-text-muted mb-1">Rescheduled to</p>
                                            <span className="bg-gray-100 text-gray-700 font-semibold px-3 py-1 rounded-full text-xs">
                                                {formatShortDate(task.scheduledDate)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <CalendarDays size={48} className="text-gray-300 mx-auto mb-4" />
                        <p className="text-text-muted">No backlog tasks — great job staying on track! 🎉</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BacklogView;
