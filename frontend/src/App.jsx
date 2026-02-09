import React, { createContext, useState } from 'react'
import "./App.css";
import AuthPage from './Components/AuthPage';
import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Protected from './Components/Auth/Protected';
import Forget from './Components/Forget';
import { ToastContainer } from "react-toastify";

export let DataContext = createContext();
function App() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  return (
    <div>
      <DataContext.Provider value={{ formData, setFormData }}>
        <Routes>
          <Route path='/' element={<Protected Component={Home} />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/forget-password' element={<Forget />} />
        </Routes>
      </DataContext.Provider>
      <ToastContainer />
    </div>
  )
}

export default App;
