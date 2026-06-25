import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { setTasks, removeTask } from '../store/slices/taskSlice';
import type { RootState } from '../store';
import useAxios from '../hooks/useAxios';
import api from '../services/api';
import TaskModal from '../components/TaskModal';
import CircularProgress from '../components/CircularProgress';
import { FiPlus, FiLogOut, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  
  const { execute: fetchTasks, error: fetchError } = useAxios<any>();
  const { execute: deleteTask } = useAxios();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await fetchTasks({ method: 'GET', url: '/tasks' });
    if (data) {
      dispatch(setTasks(data.tasks || data));
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch(e) {}
    dispatch(logout());
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: any) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ method: 'DELETE', url: `/tasks/${id}` });
      dispatch(removeTask(id));
    }
  };

  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const otherTasks = tasks.filter(t => t.status !== 'in-progress');

  const getPercentage = (status: string) => {
    if (status === 'completed') return 100;
    if (status === 'in-progress') return 55;
    return 17;
  };

  return (
    <div className="w-full min-h-screen pb-20 bg-trek-gray font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <header className="flex justify-between items-center py-8">
          <div>
            <h1 className="text-gray-400 text-sm font-medium mb-1">Hello, {user?.name || 'User'}</h1>
            <h2 className="text-3xl font-bold text-trek-text">Your Dashboard</h2>
          </div>
          <div className="flex gap-3">
            <button onClick={openCreateModal} className="btn btn-circle bg-trek-blue text-white shadow-trek border-none hover:bg-blue-700">
              <FiPlus size={24} />
            </button>
            <button onClick={handleLogout} className="btn btn-circle bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 shadow-sm">
              <FiLogOut size={20} />
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column (Hero & Active Tasks) */}
          <div className="lg:col-span-8 space-y-8">
            
            {fetchError && (
              <div className="bg-red-100 text-red-600 p-4 rounded-3xl text-sm font-medium">
                Failed to load tasks: {fetchError}
              </div>
            )}

            {/* Hero Card */}
            <div className="bg-trek-blue text-white rounded-[2.5rem] p-8 shadow-trek-blue relative overflow-hidden h-48 lg:h-56 flex flex-col justify-center">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-3xl lg:text-4xl font-bold mb-2">App Design</h3>
                  <p className="text-blue-100 text-sm lg:text-base font-medium">Task manager ui kit</p>
                </div>
                <div>
                  <button className="bg-white text-trek-blue px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-sm w-fit hover:bg-blue-50 transition-colors">
                    <FiChevronRight size={18} className="bg-trek-blue text-white rounded-full p-0.5" /> Details
                  </button>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -right-12 top-0 bottom-0 w-48 bg-white/10 skew-x-[20deg] rounded-3xl hidden sm:block"></div>
              <div className="absolute -right-24 -top-16 w-64 h-64 bg-white/5 rounded-full hidden sm:block"></div>
            </div>

            {/* All Tasks (Horizontal Scroll / Grid on PC) */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-trek-text">All Tasks</h3>
                <span className="text-sm text-trek-blue font-bold cursor-pointer hover:underline">See all</span>
              </div>
              
              <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x px-1">
                {inProgressTasks.length === 0 ? (
                  <div className="min-w-[200px] bg-white rounded-3xl p-6 shadow-sm border border-gray-50 flex items-center justify-center h-[180px]">
                    <p className="text-sm text-gray-400 font-medium text-center">No active tasks</p>
                  </div>
                ) : inProgressTasks.map(task => (
                  <div key={task._id} className="min-w-[220px] w-[220px] lg:min-w-[260px] lg:w-[260px] bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50 snap-start flex flex-col justify-between h-[200px] lg:h-[220px] relative transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer" onClick={() => openEditModal(task)}>
                    <div>
                      <h4 className="font-bold text-lg lg:text-xl text-trek-text line-clamp-2 leading-tight mb-2">{task.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-2">{task.description || 'No description'}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-end w-full">
                      <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[#FFD166] border-4 border-white relative z-20"></div>
                        <div className="w-10 h-10 rounded-full bg-[#06D6A0] border-4 border-white relative z-10"></div>
                        <div className="w-10 h-10 rounded-full bg-trek-blue border-4 border-white relative z-0 text-xs text-white flex items-center justify-center font-bold">+</div>
                      </div>
                      <div className="scale-110 lg:scale-125 transform origin-bottom-right">
                        <CircularProgress percentage={getPercentage(task.status)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (Today Update) */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <section className="bg-white lg:bg-transparent rounded-[2.5rem] p-6 lg:p-0">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-trek-text">Today Update</h3>
              </div>
              <div className="space-y-4">
                {otherTasks.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No pending or completed tasks.</p>
                ) : otherTasks.map(task => (
                  <div key={task._id} className="bg-white rounded-[2rem] p-5 flex items-center justify-between shadow-sm border border-gray-100 transition-colors hover:border-blue-100 group">
                    <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => openEditModal(task)}>
                      <div className={`w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-colors ${task.status === 'completed' ? 'border-trek-blue' : 'border-gray-200 group-hover:border-blue-300'}`}>
                        {task.status === 'completed' && <div className="w-3 h-3 rounded-full bg-trek-blue"></div>}
                      </div>
                      <div>
                        <h4 className="font-semibold text-base text-trek-text line-clamp-1">{task.title}</h4>
                        <span className="text-xs font-bold tracking-wide uppercase" style={{ color: task.status==='completed' ? '#2B66FF' : '#FFB23F'}}>{task.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button className="btn btn-ghost btn-sm btn-circle text-gray-400 hover:text-trek-blue" onClick={(e) => { e.stopPropagation(); openEditModal(task); }}>
                        <FiMoreHorizontal size={20}/>
                      </button>
                      <button className="btn btn-ghost btn-sm btn-circle text-red-300 hover:text-red-500 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </main>

        <TaskModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          taskToEdit={taskToEdit} 
        />
        
        {/* Hide scrollbar styles */}
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dashboard;
