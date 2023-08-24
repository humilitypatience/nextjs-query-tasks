import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { GiCancel } from "react-icons/gi";
import { AiOutlineFileAdd } from "react-icons/ai";
import { FiDelete } from "react-icons/fi";

interface SingleTodoComponentProps {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  insertedat: string;
  tags: string[];
  handleUpdate: (e: any, updatedTodo: any, inComplete: boolean) => void;
  handleClose: (e: any) => void;
}

const validationSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z
    .string()
    .min(10, { message: "Description must be more than 10 characters" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const EditForm = (props: SingleTodoComponentProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const [inputValues, setInputValues] = useState({
    title: props.title,
    description: props.description,
    tags: props.tags,
  });

  useEffect(() => {
    setInputValues({
      title: props.title,
      description: props.description,
      tags: props.tags,
    });
  }, [props]);

  const handleInputChange = (e: any) => {
    setInputValues({
      ...inputValues,
      [e.target.name]: e.target.value,
    });
  };

  const [completedFlag, setCompletedFlag] = useState(props.isComplete);

  const addTag = (e: any) => {
    e.preventDefault();

    setInputValues((prev: any) => {
      const updatedTags = [...prev.tags];
      updatedTags.push("");
      return { ...prev, tags: updatedTags };
    });
  };

  const deleteTag = (e: any, index: number) => {
    e.preventDefault();

    setInputValues((prev: any) => {
      const updatedTags = [...prev.tags];
      updatedTags.splice(index, 1);
      return { ...prev, tags: updatedTags };
    });
  };

  return (
    <motion.div
      onClick={(e) => props.handleClose(e)}
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <form
          onSubmit={handleSubmit((e) =>
            props.handleUpdate(
              e,
              { ...inputValues, id: props.id },
              completedFlag
            )
          )}
          className="flex flex-col px-7 py-3 gap-4 bg-white rounded-lg"
        >
          <div className="relative">
            <button
              className="absolute top-0 right-0"
              onClick={(e) => props.handleClose(e)}
            >
              <GiCancel />
            </button>
            <label className="text-blue-900">
              Title
              <span className="text-red-500"> *</span>
            </label>
            <input
              type="text"
              value={inputValues.title}
              {...register("title")}
              onChange={(e) => handleInputChange(e)}
              className="block border border-black bg-gray-50 px-2 py-1 outline-none rounded-md focus:outline-0"
            />
            {errors.title && (
              <p className="text-xs italic text-red-500 mt-2">
                {" "}
                {errors.title?.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-blue-900">
              Description
              <span className="text-red-500"> *</span>
            </label>
            <textarea
              value={inputValues.description}
              {...register("description")}
              onChange={(e) => handleInputChange(e)}
              className="block w-60 px-2 py-1 border border-black rounded-md focus:outline-0"
            />
            {errors.description && (
              <p className="text-xs italic text-red-500 mt-2">
                {" "}
                {errors.description?.message}
              </p>
            )}
          </div>
          <div className=" flex flex-row items-center">
            <button
              className={`w-10 bg-gray-300 rounded-full p-1 ${
                completedFlag ? "bg-green-500" : "bg-gray-400"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setCompletedFlag((prev) => !prev);
              }}
            >
              <span
                className={`w-4 h-4 rounded-full block ${
                  completedFlag ? "translate-x-4" : "translate-x-0"
                } bg-white shadow transform transition-transform duration-300 ease-in-out`}
              ></span>
            </button>
            <span className=" text-center mx-2 text-slate-500">isComplete</span>
          </div>
          <div className="flex flex-row items-center">
            <span className="text-blue-900 mr-5">Tags</span>
            <button onClick={(e) => addTag(e)} className="">
              <AiOutlineFileAdd size={25} />
            </button>
          </div>
          {inputValues.tags &&
            inputValues.tags.map((item, index) => (
              <div className="flex flex-row gap-2 my-1" key={index}>
                <input
                  type="text"
                  name={`tag${index}`}
                  value={inputValues.tags[index]}
                  onChange={(e) => {
                    const { name, value } = e.currentTarget;

                    const tagIndex = Number(name.slice(3));

                    setInputValues((prev: any) => {
                      let newTags = prev.tags;

                      newTags[tagIndex] = value;

                      return {
                        ...prev,
                        tags: newTags,
                      };
                    });

                    handleInputChange(e);
                  }}
                  className="block border border-black px-2 py-1 rounded-md focus:outline"
                />
                <button onClick={(e) => deleteTag(e, index)}>
                  <FiDelete size={25} />
                </button>
              </div>
            ))}
          <div>
            <button
              className="m-2 w-20 py-2 bg-green-500 shadow-lg rounded-sm"
              type="submit"
            >
              save
            </button>
            <button
              className=" m-2 w-20 py-2 bg-red-500 shadow-lg rounded-sm"
              onClick={(e) => {
                props.handleClose(e);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditForm;
