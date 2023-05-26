import React, { useEffect, useState } from 'react'
import { Carousel, Modal } from 'react-bootstrap';
import { obtenerProductos } from '../firebase/firebase.config';

const Productos = () => {
    const [filtro,setFiltro]=useState({precio:[],categoria:"",disponible:false});
    const [productos,setProductos]=useState([]);
    const [showProductosFiltro,setShowProductosFiltro]=useState(productos);
    const [showProductos,setShowProductos]=useState(showProductosFiltro);
    const [boton,setBoton]=useState("");
    const [show,setShow]=useState(false);
    const [productoSeleccionado,setProductoSeleccionado]=useState({
        disponible: false,
        descripcion: "",
        categoria: "",
        imagenes: [],
        nombre: "",
        precio: 0,
    });

    const obtenerPro=async()=>{
        const prod= await obtenerProductos();
        setProductos(prod);
        setShowProductosFiltro(prod);
        setShowProductos(prod);
    }
    useEffect(()=>{
        obtenerPro();
    },[])

    const handleOnFiltroCheck=(e)=>{
        let {value,checked,name} = e.target;
        if (name==="precio") {
            value = value.split(",");
        }
        setFiltro(old=>({...old, [name]:name==="disponible"?checked:value}))
    }
    
    const filtrarItems = ()=>{
        if (filtro.precio.length===0 && filtro.categoria==="" && filtro.disponible===false) {
            return setShowProductosFiltro(productos);
        };
        let newPro = productos;
        if (filtro.precio.length!==0) {
            if (filtro.precio.length===1) {
                newPro=newPro.filter(item=>item.precio>filtro.precio[0]);
            } else {
                newPro=newPro.filter(item=>item.precio<=filtro.precio[1] && item.precio>=filtro.precio[0]);
            }
            
        }
        if (filtro.categoria!=="") {
            newPro=newPro.filter(item=>item.categoria===filtro.categoria);
        }
        if (filtro.disponible!==false) {
            newPro=newPro.filter(item=>item.disponible===filtro.disponible);
        }  
        if (boton!=="") {
            newPro=newPro.filter(item=>item.nombre.toLowerCase().includes(boton));
        }           
        setShowProductosFiltro(newPro);
        setShowProductos(newPro);
    }

    const handleOnfiltro = (e) => {
        const {value}=e.target;
        setBoton(value);
        const newPro=showProductosFiltro.filter(item=>item.nombre.toLowerCase().includes(value));
        setShowProductos(newPro);
        
    }

    const selectProducto=(index)=>{
        setProductoSeleccionado(showProductos[index]);
        setShow(true);
    }


  return (
    <div>
        <div id='seccionBusqueda bg-info' className='bg-info d-flex flex-column'>
            <div className='d-flex flex-column flex-md-row justify-content-md-between'>
                <div id='filtro' className='my-1'>
                    <div className='my-md-2'>
                        <label htmlFor="precio" className='mx-1'>Precio:</label>
                        <select   className='rounded mx-1 bg-dark text-light' id="precio" name='precio' onChange={handleOnFiltroCheck}>
                            <option defaultValue={filtro.precio}></option>
                            <option value={[0,100]}>{"<"}$100</option>
                            <option value={[100,500]}>100-$500</option>
                            <option value={[500,1000]}>$500-$1000</option>
                            <option value={[1000]}>{">"}$1000</option>
                        </select>
                    </div>
                    <div className='my-md-2'>
                        <label htmlFor="categoria" className='mx-1'>Categoria:</label>
                        <input type="radio" name="categoria" value={"aseo"} onChange={handleOnFiltroCheck} />
                        <label htmlFor="categoria" className='mx-1'>Aseo</label>
                        <input type="radio" name="categoria" value={"bebida"} onChange={handleOnFiltroCheck} />
                        <label htmlFor="categoria" className='mx-1'>Bebidas</label>
                        <input type="radio" name="categoria" value={"paquete"} onChange={handleOnFiltroCheck} />
                        <label htmlFor="categoria" className='mx-1' >Paquetes</label>
                        <input type="radio" name="categoria" value={""} onChange={handleOnFiltroCheck} />
                        <label htmlFor="categoria" className='mx-1' >Todo</label>
                    </div>
                    <div className='my-md-2'>
                    <label htmlFor="categoria" className='mx-1'>Disponible:</label>
                        <input type="checkbox" name="disponible" onChange={handleOnFiltroCheck}/>
                    </div>
                </div>
                <div id='barraBusqueda'>
                    <button disabled className='btn border-0'>🔍</button>
                    <input type="search" className='rounded-3 me-1 mt-1 w-75' value={boton} placeholder='Search...' onChange={handleOnfiltro}/>
                </div>
            </div>
            <button className='btn btn-success mx-5 mb-2' onClick={filtrarItems}>Buscar</button>
        </div>


        <div className='bg-warning'>
            {showProductos?showProductos.map((item,index)=>{
                return(
                    <div onClick={()=>selectProducto(index)} key={index} className='border rounded border-danger row mx-2 py-2 align-items-center justify-content-center'>  
                        <img  className='rounded-5 col-md-2 col-3' src={item.imagenes[0]} alt="" />               
                        <div className="col-9">
                            <h4 className="text-capitalize">{item.nombre}</h4>
                            <h6 className="text-capitalize border w-75 rounded p-1 bg-dark text-light">{item.descripcion}</h6>
                            <h4 className="text-capitalize text-danger">${item.precio}</h4>
                        </div>
                    </div>
                )
                })
            :<h1>No se encontraron resultados</h1>}        
        </div>

        <Modal show={show} onHide={()=>setShow(!show)} animation={false}>
            <Modal.Header closeButton>
            <Modal.Title><h4 className="text-capitalize">{productoSeleccionado.nombre}</h4></Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark'>
                <Carousel slide={false}>
                    {productoSeleccionado.imagenes.map((item,index)=>{
                        return(
                            <Carousel.Item key={"imagenesProductos"+index}>
                                <img className='d-block w-100 rounded-5 col-md-2 col-3' src={item} alt="" />               
                            </Carousel.Item>

                        )
                    })}
                </Carousel>
            </Modal.Body>
            <Modal.Footer className='d-flex flex-column '>
                    <h4 className="text-capitalize text-danger">${productoSeleccionado.precio}</h4>
                    <h6 className="text-capitalize border w-75 rounded p-1 bg-dark text-light">{productoSeleccionado.descripcion}</h6>
                    {productoSeleccionado.disponible?
                    <h6 className="text-capitalize p-1 text-success">Producto Disponible</h6>:
                    <h6 className="text-capitalize p-1 text-danger">Producto No Disponible</h6>}
            </Modal.Footer>
        </Modal>

    </div>
  )
}

export default Productos
