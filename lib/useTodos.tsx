import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { generateId } from './id';
import { loadTasks, saveTasks } from './repository';
import * as taskReducer from './reducer';
import { activeCount, completedCount, getFilteredTasks } from './selectors';
import type { Filter, Priority, Task, TodoState } from './types';
import { isValidPriority, isValidTaskText } from './validation';

type TodoAction =
  | { type: 'add'; text: string; priority: Priority }
  | { type: 'remove'; id: string }
  | { type: 'toggle'; id: string }
  | { type: 'clearCompleted' }
  | { type: 'update'; id: string; text: string; priority: Priority }
  | { type: 'startEdit'; id: string }
  | { type: 'cancelEdit' }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'setSelectedPriority'; priority: Priority };

type TodoContextValue = TodoState & {
  filteredTasks: Task[];
  activeCount: number;
  completedCount: number;
  totalCount: number;
  filterSections: boolean;
  addTask: (text: string) => boolean;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  clearCompleted: () => void;
  startEdit: (id: string) => void;
  cancelEdit: () => void;
  commitEdit: (id: string, text: string, priority: Priority) => void;
  setFilter: (filter: Filter) => void;
  setSelectedPriority: (priority: Priority) => void;
};

const initialState: TodoState = {
  tasks: [],
  currentFilter: 'all',
  editingId: null,
  selectedPriority: 'medium',
};

const TodoContext = createContext<TodoContextValue | null>(null);

function initState(): TodoState {
  return { ...initialState, tasks: loadTasks() };
}

function reducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'add':
      return {
        ...state,
        tasks: taskReducer.addTask(state.tasks, {
          id: generateId(),
          text: action.text,
          priority: action.priority,
        }),
      };
    case 'remove':
      return {
        ...state,
        tasks: taskReducer.deleteTask(state.tasks, action.id),
        editingId: null,
      };
    case 'toggle':
      return { ...state, tasks: taskReducer.toggleTask(state.tasks, action.id) };
    case 'clearCompleted':
      return { ...state, tasks: taskReducer.clearCompleted(state.tasks) };
    case 'update':
      return {
        ...state,
        tasks: taskReducer.updateTask(
          state.tasks,
          action.id,
          action.text.trim(),
          action.priority
        ),
        editingId: null,
      };
    case 'startEdit':
      return { ...state, editingId: action.id };
    case 'cancelEdit':
      return { ...state, editingId: null };
    case 'setFilter':
      return { ...state, currentFilter: action.filter };
    case 'setSelectedPriority':
      return { ...state, selectedPriority: action.priority };
    default:
      return state;
  }
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initState);

  useEffect(() => {
    saveTasks(state.tasks);
  }, [state.tasks]);

  const addTask = useCallback(
    (text: string) => {
      if (!isValidTaskText(text)) return false;

      const priority = isValidPriority(state.selectedPriority)
        ? state.selectedPriority
        : 'medium';
      dispatch({ type: 'add', text, priority });
      return true;
    },
    [state.selectedPriority]
  );

  const removeTask = useCallback((id: string) => {
    dispatch({ type: 'remove', id });
  }, []);

  const toggleTask = useCallback((id: string) => {
    dispatch({ type: 'toggle', id });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: 'clearCompleted' });
  }, []);

  const startEdit = useCallback((id: string) => {
    dispatch({ type: 'startEdit', id });
  }, []);

  const cancelEdit = useCallback(() => {
    dispatch({ type: 'cancelEdit' });
  }, []);

  const commitEdit = useCallback((id: string, text: string, priority: Priority) => {
    if (!isValidTaskText(text)) {
      dispatch({ type: 'remove', id });
      return;
    }

    const nextPriority = isValidPriority(priority) ? priority : 'medium';
    dispatch({ type: 'update', id, text, priority: nextPriority });
  }, []);

  const setFilter = useCallback((filter: Filter) => {
    dispatch({ type: 'setFilter', filter });
  }, []);

  const setSelectedPriority = useCallback((priority: Priority) => {
    dispatch({ type: 'setSelectedPriority', priority });
  }, []);

  const value = useMemo<TodoContextValue>(() => {
    const done = completedCount(state.tasks);
    const active = activeCount(state.tasks);

    return {
      ...state,
      filteredTasks: getFilteredTasks(state.tasks, state.currentFilter),
      activeCount: active,
      completedCount: done,
      totalCount: state.tasks.length,
      filterSections: state.currentFilter === 'all' || state.currentFilter === 'active',
      addTask,
      removeTask,
      toggleTask,
      clearCompleted,
      startEdit,
      cancelEdit,
      commitEdit,
      setFilter,
      setSelectedPriority,
    };
  }, [
    state,
    addTask,
    removeTask,
    toggleTask,
    clearCompleted,
    startEdit,
    cancelEdit,
    commitEdit,
    setFilter,
    setSelectedPriority,
  ]);

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos(): TodoContextValue {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}
