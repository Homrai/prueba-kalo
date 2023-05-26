import { useState } from 'react'
import { toast } from 'react-toastify';
import { loginUsuario } from '../firebase/firebase.config';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../features/usuarioSlice';

const Login = () => {
  const dispatch= useDispatch();
  const navigate=useNavigate();
  const login={email:"",password:""};
  const [log,setLog]=useState(login);
  const [loading,setLoading]=useState(false);

  const handleOnLog= (e)=>{
    const {name,value}=e.target;
    setLog(old=>({...old,[name]:value}));
  }

  const enviarDatos=async ()=>{
    if (log.email==="" || log.password==="") return toast.error("Porfavor rellene todos los campos");
    setLoading(true);
    const res = await loginUsuario(log);
    if (typeof(res)==="string") {
      setLoading(false);
      return toast.error(res);
    }
    toast.success("Logueado con exito");
    setLoading(false);
    dispatch(addUser(log.email));
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <div>
      <div className="my-5 py-4 bg-secondary rounded text-light d-flex flex-column justify-content-center align-items-center">
        <h1>Inicio de sesion</h1>
        <label htmlFor="" className='mt-3'>Email</label>
        <input type="text" className='rounded' name='email' onChange={handleOnLog} value={log.email} placeholder='Ingrese su email...'/>
        <label htmlFor="">Password</label>
        <input type="password" className='rounded' name='password' onChange={handleOnLog} value={log.password} placeholder='Ingrese su password...'/>
        <button disabled={loading} className='btn btn-success mt-3' onClick={enviarDatos}>Iniciar</button>
      </div>
    </div>
  )
}

export default Login
