import { gql } from "@apollo/client";

// 🔹 Get All Tasks
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      completed
    }
  }
`;

// 🔹 Add Task
export const ADD_TASK = gql`
  mutation AddTask($title: String!, $completed: Boolean!) {
    insert_tasks_one(object: { title: $title, completed: $completed }) {
      id
      title
      completed
    }
  }
`;

// 🔹 Update Task (Completion + Title)
export const UPDATE_TASK = gql`
  mutation UpdateTask($id: uuid!, $completed: Boolean!) {
    update_tasks_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
      id
      completed
    }
  }
`;


// 🔹 Delete Task
export const DELETE_TASK = gql`
  mutation DeleteTask($id: uuid!) {
    delete_tasks_by_pk(id: $id) {
      id
    }
  }
`;
