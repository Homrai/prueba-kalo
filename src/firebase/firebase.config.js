import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { collection, doc, getDoc, getDocs, getFirestore, query, setDoc } from "firebase/firestore";
import bcry from "bcryptjs";


const firebaseConfig = {
  apiKey: "AIzaSyDqxKHg3MKqKRAyzyUwWQ-ruo-fI0sNXQI",
  authDomain: "kalo-prueba.firebaseapp.com",
  projectId: "kalo-prueba",
  storageBucket: "kalo-prueba.appspot.com",
  messagingSenderId: "775956232326",
  appId: "1:775956232326:web:19d212cd7fa3be6fff7907",
  measurementId: "G-KEQ92NX0B9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export const  obtenerProductos= async ()=>{
  try {
    const productos=[];
    const q = query(collection(db,"productos"));
    const obtenerDatos= await getDocs(q);
    obtenerDatos.forEach((item) => {
      const producto = {...item.data()};
      productos.push(producto);
    });
    logEvent(analytics,"view_item_list");
    return productos;  
  } catch (error) {
    return "Error del servidor"
  }
};

export const registroUsuario= async(datos)=>{
  try {
    const docRef = doc(db,"usuarios",datos.email);
    const verificarRegistro = await getDoc(docRef);
    if (verificarRegistro.exists()) {
      return "email ya en uso"
    }
    const salt = await bcry.genSalt(10);
    let password = await bcry.hash(datos.password, salt);
    const dato ={email:datos.email,password:password}
    const crearDoc= collection(db,"usuarios");
    const res = await setDoc(doc(crearDoc,dato.email),dato);
    logEvent(analytics,"sign_up");
    return res;
  } catch (error) {
    return "Error del servidor"
  }
};

export const loginUsuario= async(datos)=>{
  try {
    const docRef = doc(db,"usuarios",datos.email);
    const verificarRegistro = await getDoc(docRef);
    if (!verificarRegistro.exists()) return `${datos.email} no esta registrado en nuestra base de datos`;
    const verificarPass = verificarRegistro.data();
    const verificarCript= await bcry.compare(datos.password, verificarPass.password);
    if(!verificarCript) return `Email o password incorrectos, porfavor verifique`;
    logEvent(analytics,"login");
    return verificarRegistro.data();
  } catch (error) {
    return "Error del servidor"
  }
};