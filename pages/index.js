import React, { useState, useEffect } from "react";
import { getTodoList, addTodo, deleteTodo, updateTodo } from "./api/todo";

// TodoItem component to represent each individual todo item
const TodoItem = ({ todo, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(todo.name);

  const handleUpdate = () => {
    updateTodo(todo._id, { name: newName }).then(() => {
      onUpdate();
      setIsEditing(false);
    });
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
      ) : (
        <p>{todo.name}</p>
      )}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? "Cancel" : "Edit"}
      </button>
      {isEditing && (
        <button onClick={handleUpdate}>Update</button>
      )}
      <button onClick={() => onDelete(todo._id)}>Delete</button>
    </div>
  );
};

export default function MyPage({ initialTodoList }) {
  const [todoList, setTodoList] = useState(initialTodoList);
  const [newTodo, setNewTodo] = useState("");

 

  const fetchTodos = () => {
    getTodoList().then((res) => setTodoList(res));
  };

  const handleAddTodo = () => {
    addTodo({ name: newTodo }).then(() => {
      fetchTodos();
      setNewTodo("");
    });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id).then(() => {
      setTodoList((prevList) => prevList.filter((todo) => todo._id !== id));
    });
  };

  return (
    <>
      <input
        type="text"
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add new todo"
        value={newTodo}
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <button onClick={fetchTodos}>Fetch Todos</button>
      <div style={{ marginTop: "50px" }}>
        {todoList.map((todo, index) => (
          <TodoItem
            key={index}
            todo={todo}
            onDelete={handleDeleteTodo}
            onUpdate={fetchTodos}
          />
        ))}
      </div>
    </>
  );
}
export async function getServerSideProps() {
  const initialTodoList = await getTodoList();
  const data = initialTodoList.map(todo => ({ ...todo, _id: todo._id.toString() }));
  return {
    props: { initialTodoList: data },
  };
}