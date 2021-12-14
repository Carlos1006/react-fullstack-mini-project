import React, {useEffect, useState} from 'react';
import css from './styles/Splash.module.css';
import Grid from "../fragment/Grid";

const Splash = () => {

    const [grid,setGrid] = useState(<></>);

    useEffect(()=>{
        setGrid(<Grid/>);
    },[]);

    return (
        <div id={css.profile}>
            <div id={css.dataColumn}>
                <label className={css.message} id={css.welcomeMessage}>Cargando...</label>
            </div>
            <div id={css.userColumns}>
                {grid}
            </div>
        </div>
    );
}


export default Splash;
