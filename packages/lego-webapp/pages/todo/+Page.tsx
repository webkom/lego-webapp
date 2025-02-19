import { useData } from 'vike-react/useData';
import { TodoList } from './TodoList';
import type { Data } from './+data';

export default function Page() {
  const data = useData<Data>();
  return (
    <>
      <h1>To-do List</h1>
      <TodoList initialTodoItems={data.todo} />
    </>
  );
}
