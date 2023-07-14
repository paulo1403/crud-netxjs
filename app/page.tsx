"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface IUser {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<IUser[]>([]);

  const getUsers = async () => {
    const { data } = await axios.get("/api/users");
    setUsers(data);
  };

  const createUser = async (body: IUser) => {
    const { data } = await axios.post("/api/users", body);
    setUsers([...users, data]);
  };

  const updateUser = async (body: IUser) => {
    const { data } = await axios.put("/api/users", body);
    const newUsers = users.map((user) => {
      if (user.id === data.id) {
        return data;
      }
      return user;
    });
    setUsers(newUsers);
  };

  const deleteUser = async (id: number) => {
    const { data } = await axios.delete(`/api/users`, { data: { id } });
    const newUsers = users.filter((user) => user.id !== data.id);
    setUsers(newUsers);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <section className="p-10">
      <h1>CRUD User</h1>
      <form
        className="form mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          const { id, name, email } = e.target as typeof e.target & {
            id: { value: string };
            name: { value: string };
            email: { value: string };
          };
          const body = {
            id: Number(id.value),
            name: name.value,
            email:
              email.value === "" ? undefined : (email.value as string | null),
          };
          if (body.id === 0) {
            createUser(body);
          }
          if (body.id !== 0) {
            updateUser(body);
          }
        }}
      >
        <input type="hidden" name="id" defaultValue="0" />
        <input type="text" name="name" placeholder="name" />
        <input type="email" name="email" placeholder="email" />
        <button type="submit" className="btn btn-submit">
          Submit
        </button>
      </form>
      <hr />
      <table className="table-fixed border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600 p-4">id</th>
            <th className="border border-slate-600 p-4">name</th>
            <th className="border border-slate-600 p-4">email</th>
            <th className="border border-slate-600 p-4">edit</th>
            <th className="border border-slate-600 p-4">delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border border-slate-600 p-3">{user.id}</td>
              <td className="border border-slate-600 p-3">{user.name}</td>
              <td className="border border-slate-600 p-3">{user.email}</td>
              <td className="border border-slate-600 p-3">
                <button
                  onClick={() => {
                    const { id, name, email } = user;
                    const form = document.querySelector(
                      ".form"
                    ) as HTMLFormElement;
                    form.id.value = String(id);
                    form.name.value = name;
                    form.email.value = email || "";
                  }}
                >
                  Edit
                </button>
              </td>
              <td className="border border-slate-600 p-3">
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
