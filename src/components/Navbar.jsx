import React, { useEffect, useState } from 'react'
import { Button, Collapse } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { addUser, cerrar } from '../features/usuarioSlice';

const Navbar = () => {
  const user = useSelector(state=>state.user);
  const dispatch=useDispatch();
  const [usuario,setUsuario]=useState("");
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    setUsuario(user);
  },[user]);

  const cerrarSesion = ()=>{
    dispatch(cerrar());
    setOpen(false);
  }
  return (
    <div>
        <nav className="navbar bg-dark text-light">
            <Link className="text-decoration-none ms-3 text-light" to={"/"}>Tienda</Link>
            {usuario.length===0?
            <div className="text-light d-flex align-items-baseline">
                <Link className='btn btn-success py-0 mx-1' to={"login"}>Login</Link>
                <Link className='mx-2' to={"signup"}>Sign up</Link>
            </div>
         :<div className='d-flex flex-column align-items-end me-2 '>
              <Button
                onClick={() => setOpen(!open)}
                aria-controls="menu"
                aria-expanded={open}
                className='border bg-dark border-0 text-decoration-underline'
              >
                {usuario}
              </Button>
              <Collapse in={open}>
                <div id="menu">
                  <button className="border border-0 text-decoration-underline bg-dark text-primary" onClick={cerrarSesion}>cerrar sesion</button>
                </div>
              </Collapse>
         </div>
        }
        </nav>
    </div>
  )
}

export default Navbar
