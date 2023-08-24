"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTodos } from "../../lib/actions";
import { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import SingleTodo from "./SingleTodo";
import EditForm from "./EditForm";

interface OrganicTodoProps {
  id?: number;
  title: string;
  description: string;
  isComplete?: boolean;
  insertedat: any;
  tags: string[];
}

export default function ShowList() {
  const { data } = useQuery({
    queryKey: ["hydrate-todos"],
    queryFn: getTodos,
    refetchOnWindowFocus: false,
  });

  const queryClient = useQueryClient();

  const queryKey = ["hydrate-todos"];

  const emptyTodo = {
    id: -1,
    title: "",
    description: "",
    isComplete: false,
    insertedat: "",
    tags: [],
  };

  // const handledTodo = useRef(emptyTodo);

  const [showAddTodoFormFlag, setShowAddTodoFormFlag] = useState(false);

  const [allTodosSelectedFlag, setAllTodosSelectedFlag] = useState(false);

  const [additionalFlag, setAdditionalFlag] = useState(false);

  const [selectedFlagArray, setSelectedFlagArray] = useState(() => {
    const dataLength: any = data?.length;

    let initialArray: boolean[] = [];

    for (let i = 0; i < dataLength; i++) {
      initialArray[i] = false;
    }
    return initialArray;
  });

  const [handledTodo, setHandledTodo] = useState({ ...emptyTodo });

  useEffect(() => {
    setSelectedFlagArray(() => {
      const dataLength: any = data?.length;

      let initialArray: boolean[] = [];

      for (let i = 0; i < dataLength; i++) {
        initialArray[i] = false;
      }

      return initialArray;
    });
  }, [data]);

  const handleAdd = (
    e: any,
    newTodo: OrganicTodoProps,
    isComplete: boolean
  ) => {
    const todos: OrganicTodoProps[] | undefined =
      queryClient.getQueryData(queryKey);

    const { title, description, tags } = newTodo;

    const organicTodo: OrganicTodoProps = {
      title,
      description,
      id: -1,
      isComplete: false,
      tags: [],
      insertedat: "",
    };

    organicTodo.isComplete = isComplete;

    const date = new Date();

    organicTodo.insertedat = date.toLocaleDateString();

    organicTodo.id = todos?.length ? todos?.length + 1 : -1;

    organicTodo.tags = tags;

    const updatedTodos: any[] | undefined = todos
      ? [...todos, organicTodo]
      : [organicTodo];

    queryClient.setQueryData(queryKey, [...updatedTodos]);

    setShowAddTodoFormFlag(false);

    delete organicTodo.id;
  };

  const handleUpdate = (
    e: any,
    updatedTodo: OrganicTodoProps,
    isComplete: boolean
  ) => {
    const todos: any = queryClient.getQueryData(queryKey);

    const { id, title, description, tags } = updatedTodo;

    const newTodo = { id, title, description, tags, isComplete };

    console.log("updatedTodo", updatedTodo);

    const newTodos = todos.map((item: any) => {
      if (item.id === id) {
        return {
          ...item,
          title,
          description,
          isComplete,
          tags,
        };
      }

      return item;
    });

    queryClient.setQueryData(queryKey, newTodos);

    setHandledTodo({ ...emptyTodo });

    setShowAddTodoFormFlag(false);
  };

  const handleClose = (e: any) => {
    e.preventDefault();

    setShowAddTodoFormFlag(false);

    setHandledTodo({ ...emptyTodo });
  };

  const handleSelect = (index: number) => {
    setSelectedFlagArray((prev) => {
      const updatedArray = [...prev];

      updatedArray[index] = !updatedArray[index];

      return updatedArray;
    });
  };

  const selectAll = () => {
    let allFlag: boolean = true;

    setAllTodosSelectedFlag((prev) => {
      allFlag = !prev;

      return !prev;
    });

    setSelectedFlagArray(() => {
      const length: any = data?.length;

      let updatedArray: boolean[] = [];

      for (let i = 0; i < length; i++) {
        updatedArray[i] = allFlag;
      }

      return updatedArray;
    });
  };

  const handleRemove = () => {
    const todos: any = queryClient.getQueryData(queryKey);

    let updatedTodos = [...todos];

    const todosCount = updatedTodos.length;

    let splicedCount = 0;

    for (let i = 0; i < todosCount; i++) {
      if (selectedFlagArray[i]) {
        updatedTodos.splice(i - splicedCount, 1);

        splicedCount++;
      }
    }

    queryClient.setQueryData(queryKey, updatedTodos);
  };

  const handleComplete = () => {
    const todos: any = queryClient.getQueryData(queryKey);

    let updatedTodos = [...todos];

    const todosCount = updatedTodos.length;

    for (let i = 0; i < todosCount; i++) {
      if (selectedFlagArray[i]) {
        updatedTodos[i].isComplete = true;
      }
    }

    queryClient.setQueryData(queryKey, updatedTodos);

    setAdditionalFlag((prev) => !prev);
  };

  return (
    <div>
      <div className="w-full h-16 p-5 flex flex-row justify-between items-center bg-gray-200 opacity-80">
        <h1 className="text-lg lg:text-5xl font-bold">TodoApp</h1>
        <div className="flex flex-row gap-2">
          <button
            className="shadow-md text-xs px-1 py-1 lg:text-lg lg:px-4 lg:py-2 rounded-md bg-blue-500"
            onClick={() => setShowAddTodoFormFlag(true)}
          >
            Add Todo
          </button>
          <button
            className="shadow-md text-xs px-1 py-1 lg:text-lg lg:px-4 lg:py-2 rounded-md bg-blue-500"
            onClick={selectAll}
          >
            {allTodosSelectedFlag ? "Deselect All" : "Select All"}
          </button>
          <button
            className="shadow-md text-xs px-1 py-1 lg:text-lg lg:px-4 lg:py-2 rounded-md bg-red-500"
            onClick={handleRemove}
          >
            Remove
          </button>
          <button
            className="shadow-md text-xs px-1 py-1 lg:text-lg lg:px-4 lg:py-2 rounded-md bg-green-500"
            onClick={handleComplete}
          >
            Complete
          </button>
        </div>
      </div>
      <div className="px-10 mt-20 grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {data?.map((item: any, index: number) => (
          <SingleTodo
            {...item}
            key={index}
            selected={
              selectedFlagArray[index] !== undefined
                ? selectedFlagArray[index]
                : false
            }
            handleSelect={() => handleSelect(index)}
            launchEditForm={() => {
              setHandledTodo(item);

              setShowAddTodoFormFlag(true);
            }}
          />
        ))}
      </div>

      {showAddTodoFormFlag && (
        <div className=" w-screen h-screen fixed top-0 left-0 bg-gray-800 opacity-95">
          <div className="relative w-80 m-auto mt-40">
            <EditForm
              {...handledTodo}
              handleUpdate={handledTodo.id === -1 ? handleAdd : handleUpdate}
              handleClose={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
