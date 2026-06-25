import React, { useState, useEffect } from 'react';
import useAxios from '../hooks/useAxios';
import { useDispatch } from 'react-redux';
import { addTask, updateTaskSuccess } from '../store/slices/taskSlice';

interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });

  const { execute, loading, error } = useAxios<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        _id: taskToEdit._id,
        title: taskToEdit.title || '',
        description: taskToEdit.description || '',
        status: taskToEdit.status || 'pending',
        // Extract YYYY-MM-DD from ISO string if it exists
        dueDate: taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const isEditing = !!taskToEdit;
      
      // Clean up payload for Zod
      const payload: any = { ...formData };
      if (!payload.dueDate) {
        delete payload.dueDate;
      } else {
        payload.dueDate = new Date(payload.dueDate).toISOString();
      }

      const data = await execute({
        method: isEditing ? 'PATCH' : 'POST',
        url: isEditing ? `/tasks/${taskToEdit._id}` : '/tasks',
        data: payload,
      });

      if (data) {
        const taskPayload = data.task || data;
        if (isEditing) {
          dispatch(updateTaskSuccess(taskPayload));
        } else {
          dispatch(addTask(taskPayload));
        }
        onClose();
      }
    } catch (err) {
      // Error is handled by useAxios
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white rounded-[2.5rem] shadow-trek-blue border border-gray-100 p-8">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-gray-400 hover:text-trek-text" onClick={onClose} disabled={loading}>✕</button>
        </form>
        <h3 className="font-bold text-2xl mb-6 text-trek-text">{taskToEdit ? 'Edit Task' : 'Create Task'}</h3>
        
        {error && (
          <div className="alert alert-error shadow-sm mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium text-gray-500">Title</span></label>
            <input 
              type="text" 
              className="input input-bordered w-full rounded-2xl bg-trek-gray border-none" 
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text font-medium text-gray-500">Description</span></label>
            <textarea 
              className="textarea textarea-bordered h-24 rounded-3xl bg-trek-gray border-none resize-none" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-4">
            <div className="form-control w-1/2">
              <label className="label"><span className="label-text font-medium text-gray-500">Status</span></label>
              <select 
                className="select select-bordered w-full rounded-2xl bg-trek-gray border-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-control w-1/2">
              <label className="label"><span className="label-text font-medium text-gray-500">Due Date</span></label>
              <input 
                type="date" 
                className="input input-bordered w-full rounded-2xl bg-trek-gray border-none" 
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn w-full mt-6 bg-trek-blue hover:bg-blue-700 text-white rounded-full border-none shadow-trek h-14" disabled={loading}>
            {loading ? <span className="loading loading-spinner text-white"></span> : (taskToEdit ? 'Save Changes' : 'Create Task')}
          </button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose} disabled={loading}>close</button>
      </form>
    </dialog>
  );
};

export default TaskModal;
