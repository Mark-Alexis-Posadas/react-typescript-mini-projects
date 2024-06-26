import React, { useState, useEffect, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TodoItem from "../../components/TodoItem";
import {
  faCheckCircle,
  faPlusCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

interface Todo {
  index: number | null;
  text: string;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<string[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputVal, setInputVal] = useState<string>("");
  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");
  const [exist, setExists] = useState<boolean>(false);
  const [deleteTodo, setDeleteTodo] = useState<{
    index: null | number;
    isShow: boolean;
    name: string;
  }>({
    index: null,
    isShow: false,
    name: "",
  });

  const [currentTodo, setCurrentTodo] = useState<Todo>({
    index: null,
    text: "",
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    todos.includes(e.target.value) ? setExists(true) : setExists(false);

    setInputVal(e.target.value);
  };

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputVal.trim() === "") {
      setAlertText("Please add todo...");
      setAlert(true);
      return;
    }

    if (exist) {
      return;
    }

    setTodos([...todos, inputVal]);
    setInputVal("");
  };

  const handleDelete = (index: number, todoName: string) => {
    setDeleteTodo({ index: index, isShow: true, name: todoName });
  };

  const handleConfirm = () => {
    if (deleteTodo.isShow) {
      const deleteTodos = todos.filter((_, idx) => idx !== deleteTodo.index);
      setTodos(deleteTodos);
      setInputVal("");

      setDeleteTodo((prevState) => ({
        ...prevState,
        isShow: false,
      }));
      setAlert(true);

      setAlertText(`${deleteTodo.name} has been Deleted`);
    }

    if (todos) {
      setExists(false);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentTodo({ index, text: todos[index] });
    setModalEdit(true);
  };

  const handleCancel = () => {
    setModalEdit(false);
    setCurrentTodo({ index: null, text: "" });
  };

  const handleUpdate = () => {
    if (currentTodo.text.trim() === "") {
      setAlertText("please enter a valid todo");
      setAlert(true);
      return;
    }

    const updatedTodos: string[] = todos.map((todo, idx) =>
      idx === currentTodo.index ? currentTodo.text : todo
    );
    setTodos(updatedTodos);

    setAlert(true);
    setAlertText("Success");

    setModalEdit(false);
    setCurrentTodo({ index: null, text: "" });
  };

  const handleClearAll = () => {
    setConfirm(true);
  };

  const handleYes = () => {
    setTodos([]);
    setConfirm(false);
    const res =
      todos.length > 1 ? "All todos has been deleted!" : "The todo is deleted!";
    setAlertText(res);
    setAlert(true);
  };

  return (
    <div className="p-5 md:p-0 md:max-w-[900px] m-auto relative">
      {alert && (
        <p
          className={`${
            inputVal !== "" || currentTodo.text !== ""
              ? "border-green-400 bg-green-200 text-green-500"
              : "text-red-500  border-red-400 bg-red-200"
          } p-2 border rounded`}
        >
          {alertText}
        </p>
      )}
      <h1 className="mb-5 font-bold text-4xl md:text-5xl">Todo List APP</h1>
      {exist && (
        <span className="text-xs text-red-700">Todo Already Exist</span>
      )}
      <form
        onSubmit={handleAddTodo}
        className="flex items-center justify-center gap-3 mb-5"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full">
          <input
            type="text"
            className="border border-slate rounded bg-slate-50 p-2 flex-1"
            placeholder="add todo"
            onChange={handleChange}
            value={inputVal}
          />

          <button
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 flex items-center justify-center gap-2"
            type="submit"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            Add Todo
          </button>
        </div>
      </form>

      {todos.length <= 0 ? (
        "No todos left"
      ) : (
        <>
          <ul>
            {todos.map((item, index) => (
              <TodoItem
                key={index}
                item={item}
                index={index}
                handleDelete={() => handleDelete(index, item)}
                handleEdit={handleEdit}
                isEditing={currentTodo.index === index}
              />
            ))}
          </ul>
          <button
            className="text-center text-white bg-blue-600 p-2 rounded mt-2"
            onClick={handleClearAll}
          >
            {todos.length > 1 ? "Clear All Todos" : "Clear Todo"}
          </button>
        </>
      )}
      {confirm && (
        <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center flex-col justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="bg-white rounded p-5 text-center">
            <h1 className="font-bold text-4xl mb-5">
              {todos.length > 1
                ? "Are you sure to delete all these todos"
                : "Are you sure to delete this todo ?"}
            </h1>
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                className="text-white p-2 rounded bg-blue-600"
                onClick={handleYes}
              >
                {todos.length > 1
                  ? "yes delete all these todos"
                  : "yes delete this Todo"}
              </button>
              <button
                className="text-white p-2 rounded bg-red-600"
                onClick={() => setConfirm(false)}
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTodo.isShow && (
        <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center flex-col justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="bg-white rounded p-5 text-center">
            <h1 className="font-bold text-4xl mb-5">
              Are you sure to delete this <span>"{deleteTodo.name}"</span> ?
            </h1>
            <div className="flex items-center gap-3 w-full justify-center">
              <button
                className="text-white p-2 rounded bg-blue-600"
                onClick={handleConfirm}
              >
                Yes delete
              </button>
              <button
                className="text-white p-2 rounded bg-red-600"
                // onClick={() => setDeleteTodo({ isShow: false })}
                onClick={() =>
                  setDeleteTodo((prevState) => ({
                    ...prevState,
                    isShow: false,
                  }))
                }
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEdit && (
        <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-center w-[500px]">
            <input
              type="text"
              className="bg-slate-100 rounded p-2 text-black w-full"
              placeholder="Edit Todo..."
              onChange={(e) =>
                setCurrentTodo({ ...currentTodo, text: e.target.value })
              }
              value={currentTodo.text}
            />
            <div className="flex items-center gap-1 ml-3">
              <button
                className="bg-gray-500 text-white p-2 rounded flex items-center justify-center gap-2"
                onClick={handleCancel}
              >
                <FontAwesomeIcon icon={faXmarkCircle} />
                Cancel
              </button>
              <button
                className="bg-blue-600 rounded p-2 text-white flex items-center justify-center gap-2"
                onClick={handleUpdate}
              >
                <FontAwesomeIcon icon={faCheckCircle} />
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Todo;
