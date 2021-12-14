import React, {useEffect, useState} from 'react';
import css from './styles/Menu.module.css';
import Axios from "axios";

const Menu = () => {

    const [open,setOpen] = useState(false);
    const [conditionalLinks,setConditionalLinks] = useState(<></>);

    const toggleMenu = ()=> {
        setOpen(!open);
    }

    useEffect(()=>{
        Axios.get('http://localhost:3001/login').then((response)=>{
            if(response.data.ok) {
               setConditionalLinks(<>
                   <div><a href={"./profile"}>Mi Perfil</a></div>
               </>);
            }
        });
    },[]);

    return (
        <>
            <div className={open?css.open:''} onClick={toggleMenu} id={css.menuToggler}/>
            <div className={open?css.open:''} id={css.menu}>
                <div><a href={"./"}>Inicio</a></div>
                {conditionalLinks}
                <div><a href={"./users"}>Ver usuarios</a></div>
            </div>
        </>

    );
}

export default Menu;
