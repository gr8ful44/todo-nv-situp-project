import { useRef } from "react";
import { useEffect, useState } from "react";
import Todolist from "../components/Todolist";
import Update from "../components/Update";

function Todo() {
   const [todo, setTodo] = useState([]);
   const [task, setTask] = useState("");
   const [form, setForm] = useState(false);
   const [isEditing, setEditing] = useState(false);

   const token = localStorage.getItem("bearer");
   const ref = useRef();

   const getData = async () => {
      let headersList = {
         Authorization: `Bearer ${token}`,
      };

      let response = await fetch(
         "https://candidate.neversitup.com/todo/todos/",
         {
            method: "GET",
            headers: headersList,
         }
      );

      let data = await response.json();
      setTodo(data);
   };

   const del = async (id) => {
      let headersList = {
         Authorization: `Bearer ${token}`,
      };

      let response = await fetch(
         `https://candidate.neversitup.com/todo/todos/${id}`,
         {
            method: "DELETE",
            headers: headersList,
         }
      );
      getData();
   };

   const add = async (e) => {
      e.preventDefault();
      let headersList = {
         Authorization: `Bearer ${token}`,
         "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
         title: task,
      });

      let response = await fetch(
         "https://candidate.neversitup.com/todo/todos",
         {
            method: "POST",
            body: bodyContent,
            headers: headersList,
         }
      );
      setForm(true);
      if (form) ref.current?.reset();
      setTask("");
      getData();
   };

   const edh = (id) => {
      setEditing(true);
   };

   useEffect(() => {
      getData();
   }, []);

   return (
      <div className="main">
         <h1 className="fire">🔥</h1>
         <form className="todo" ref={ref} onSubmit={add}>
            <div className="ipw todow">
               <input
                  type="text"
                  className="input"
                  required
                  onChange={(e) => setTask(e.target.value)}
               />
               <label htmlFor="task" className="label">
                  tell me your secret..
               </label>
            </div>
            <button className="addbtn">+</button>
         </form>
         {todo &&
            todo.map((item) => (
               <Todolist
                  key={item._id}
                  id={item._id}
                  title={item.title}
                  del={del}
                  edh={edh}
               />
            ))}
         {isEditing &&
            todo.map((item) => (
               <Update
                  key={item._id}
                  id={item._id}
                  token={token}
                  setEditing={setEditing}
                  getData={getData}
               />
            ))}
      </div>
   );
}

export default Todo;
