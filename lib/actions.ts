import { supabaseClient } from "./client";

export const getTodos = async () => {
  const data = await supabaseClient
    .from("todos")
    .select("*")
    .order("id", { ascending: true })
    .then(({ data, error }) => {
      if (!error) {
        return data;
      }
    });

  return data;
};
