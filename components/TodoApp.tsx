'use client';

import { TodoProvider } from '@/lib/useTodos';
import Filters from './Filters';
import Footer from './Footer';
import Header from './Header';
import ProgressSection from './ProgressSection';
import SidebarIndicator from './SidebarIndicator';
import TaskList from './TaskList';
import TodoInput from './TodoInput';

function TodoScreen() {
  return (
    <>
      <SidebarIndicator />
      <main className="app">
        <Header />
        <TodoInput />
        <Filters />
        <TaskList />
        <ProgressSection />
        <Footer />
      </main>
    </>
  );
}

export default function TodoApp() {
  return (
    <TodoProvider>
      <TodoScreen />
    </TodoProvider>
  );
}
