import { useState } from "react";
import { registroUsuario } from "../firebase/firebase.config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import validator from 'validator';

const Signup = () => {
  const navigate = useNavigate();
  const reg={email:"",password:"",repassword:""};
  const [registro,setRegistro]=useState(reg);
  const [loading,setLoading]=useState(false);

  const handleOnReg= (e)=>{
    const {name,value}=e.target;
    setRegistro(old=>({...old,[name]:value}));
  }

  const enviarDatos= async ()=>{
    if (registro.email==="" || registro.password==="" || registro.repassword==="") return toast.error("Porfavor rellene todos los campos");
    //setLoading(true);
    if (registro.password!==registro.repassword) {
      setLoading(false);
      return toast.error("el password debe coincidir, porfavor verifique");
    }
    if(!validator.isEmail(registro.email)){
      setLoading(false);
      return toast.error("Formato de email no valido");
    }
    if(!validator.isLength(registro.password,{min:8,max:20})){
      setLoading(false);
      return toast.error("El password debe tener entre 8 a 20 caracteres");
    }
    if(!validator.isStrongPassword(registro.password, {minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })){
      setLoading(false);
      return toast.error("El password debe contener minimo letras mayusculas, minusculas, un numero y un simbolo");
    }
    const res = await registroUsuario(registro);
    if (typeof(res)==="string") {
      setLoading(false);
      return toast.error(res);
    }
    toast.success("Se ha registrado con exito");
    setLoading(false);
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  }
  return (
    <div>
      <div className="my-5 py-4 bg-primary rounded text-light d-flex flex-column justify-content-center align-items-center">
        <h1>Registro</h1>
        <div>
          <label htmlFor="" className='mt-3 me-2'>Email </label>
          <input type="text" className='rounded' name='email' onChange={handleOnReg} value={registro.email} placeholder='Ingrese su email...'/>
        </div>
        <div>
          <label htmlFor="" className='mt-3 me-2'>Password </label>
          <input type="text" className='rounded' name='password' onChange={handleOnReg} value={registro.password} placeholder='Ingrese su password...'/>
        </div>
        <div>
          <label htmlFor="" className='mt-3 me-2'>Verifique password </label>
          <input type="text" className='rounded' name='repassword' onChange={handleOnReg} value={registro.repassword} placeholder='Verifique su password...'/>
        </div>
        <button disabled={loading} className='btn btn-success mt-3' onClick={enviarDatos}>Registrar</button>
      </div>
    </div>
  )
}

export default Signup
