import { useQueryClient, useMutation } from "@tanstack/react-query";
import moment from "moment";
import { motion } from "framer-motion";
import { Chip } from "@material-tailwind/react";

interface SingleTodoComponentProps {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  insertedat: string;
  tags: string[];
  selected: boolean;
  handleSelect: () => void;
  launchEditForm: () => void;
}

const SingleTodo = (props: SingleTodoComponentProps) => {
  const { id, title, description, isComplete, insertedat, tags } = props;

  const queryClient = useQueryClient();

  const queryKey = ["hydrate-todos"];

  const deleteTodo = (id: number) => {
    const todos: any = queryClient.getQueryData(queryKey);

    const updatedTodos = todos.filter((item: any) => item.id !== id);

    queryClient.setQueriesData(queryKey, updatedTodos);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full drop-shadow-md bg-white flex flex-col gap-3 px-6 py-3 rounded-lg"
    >
      <div className="flex flex-row justify-between">
        <input
          className="w-4 h-4 opacity-100"
          type="checkbox"
          checked={props.selected}
          onChange={props.handleSelect}
        />
        {isComplete ? (
          <Chip value="Complete" className=" bg-green-500" />
        ) : (
          <Chip value="Incomplete" className="rounded-full bg-red-500" />
        )}
      </div>
      <div className="flex flex-col grow justify-start gap-2">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
          <span>&nbsp;(</span>

          {tags?.map((item, index, array) => (
            <span className="text-sm font-normal" key={index}>
              {item}
              {index !== array.length - 1 && ","}
            </span>
          ))}

          <span>)</span>
        </h2>
        <div className="">{description}</div>
        <div className="italic text-gray-700">
          Created at: {moment(insertedat).format("MMM Do YYYY")}
        </div>
      </div>
      <div className="flex flex-row justify-center gap-4">
        <motion.button
          className="w-32 bg-yellow-500 shadow-lg rounded-lg py-3"
          onClick={props.launchEditForm}
          initial={{ opacity: 0.6 }}
          whileHover={{
            scale: 1.2,
            transition: { duration: 0.1 },
          }}
          whileTap={{ scale: 0.9 }}
          whileInView={{ opacity: 1 }}
        >
          Update
        </motion.button>
        <motion.button
          className="w-32 bg-red-500 shadow-lg rounded-lg py-3"
          onClick={() => deleteTodo(id)}
          initial={{ opacity: 0.6 }}
          whileHover={{
            scale: 1.2,
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.9 }}
          whileInView={{ opacity: 1 }}
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SingleTodo;
