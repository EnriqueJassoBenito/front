import { useState, useEffect } from 'react'
import './App.css'
import {BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import axios from "axios"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import AboutUs from "./pages/AboutUs"
import NotFound from "./pages/404"
import NewUser from "./components/NewUser"

{/* Forma de navegar con animaciones */}
import { AnimatePresence } from 'framer-motion'
const AnimatedRoutes = () => {
  const location = useLocation();
  return(
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/about' element={<AboutUs/>}></Route>
        <Route path='/*' element={<NotFound/>}></Route>
        <Route path='/newUser' element={<NewUser/>}></Route>
      </Routes>
    </AnimatePresence>
  )
}

// Componente Home
function Home(){
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
    .get("http://127.0.0.1:8000/users/api/")
    .then((response) => {
      setData(response.data);
      setLoading(false);
    })
    .catch((error) => {
      setError("Error al obtener los datos: "+error)
      setLoading(false)
    })
  }, []);

  if (loading) {
    return <div>Cargando...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return(
    <div>
      <h1>Datos de la API de Django</h1>
      <p>{localStorage.getItem('accessToken')}</p>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{JSON.stringify(item)}</li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar>
        <div className='container mt-4'>
          <div className='row'>
            <div className='col'>
              <AnimatedRoutes/>
            </div>
          </div>
        </div>
      </Navbar>
    </Router>
  )
  
}

export default App
