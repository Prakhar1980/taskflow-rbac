import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TaskInput, taskApi } from '../api/tasks';
import { TaskForm } from '../components/TaskForm';

export const CreateTask = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (input: TaskInput) => {
    setSubmitting(true);
    try {
      await taskApi.create(input);
      toast.success('Task added');
      navigate('/');
    } catch {
      toast.error('Could not add the task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h1>Add Task</h1>
        </div>
      </div>
      <TaskForm submitting={submitting} submitLabel="Create task" onSubmit={handleSubmit} />
    </section>
  );
};
