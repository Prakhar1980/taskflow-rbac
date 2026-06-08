import { Save } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Task } from '../api/client';
import { TaskInput } from '../api/tasks';

type Props = {
  initialTask?: Partial<Task>;
  submitting: boolean;
  submitLabel: string;
  onSubmit(input: TaskInput): Promise<void>;
};

export const TaskForm = ({ initialTask, submitting, submitLabel, onSubmit }: Props) => {
  const [values, setValues] = useState<TaskInput>({
    title: initialTask?.title ?? '',
    description: initialTask?.description ?? '',
    status: initialTask?.status ?? 'todo',
    priority: initialTask?.priority ?? 'medium'
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input
          value={values.title}
          onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
          minLength={2}
          maxLength={120}
          required
        />
      </label>
      <label>
        Description
        <textarea
          value={values.description}
          onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))}
          maxLength={1000}
          rows={6}
        />
      </label>
      <div className="form-grid">
        <label>
          Status
          <select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as TaskInput['status'] }))}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label>
          Priority
          <select value={values.priority} onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value as TaskInput['priority'] }))}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      <button className="button button-primary" disabled={submitting}>
        <Save size={18} />
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};
