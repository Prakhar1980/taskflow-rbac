import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Task } from '../api/client';
import { TaskInput, taskApi } from '../api/tasks';
import { TaskForm } from '../components/TaskForm';

export const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      try {
        setTask(await taskApi.get(id));
      } catch {
        toast.error('Could not open this task');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id, navigate]);

  const handleSubmit = async (input: TaskInput) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await taskApi.update(id, input);
      toast.success('Task updated');
      navigate('/');
    } catch {
      toast.error('Could not save the task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !task) {
    return <div className="empty-state">Opening task...</div>;
  }

  return (
    <section className="form-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Tasks</p>
          <h1>Edit Task</h1>
        </div>
      </div>
      <TaskForm initialTask={task} submitting={submitting} submitLabel="Save changes" onSubmit={handleSubmit} />
    </section>
  );
};
