import { ReactNode } from 'react';

export const AuthCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <main className="auth-page">
    <section className="auth-panel">
      <div>
        <p className="eyebrow">Task Manager</p>
        <h1>{title}</h1>
      </div>
      {children}
    </section>
  </main>
);
