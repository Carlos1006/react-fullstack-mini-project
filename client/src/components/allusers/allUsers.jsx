import React, {useEffect, useState} from 'react';
import css from './styles/AllUsers.module.css';
import Input from "../fragment/Input";
import Users from "../fragment/Users";
import Grid from "../fragment/Grid";
import Menu from "../fragment/Menu";

const AllUsers = () => {

    const [grid,setGrid] = useState(<></>);

    useEffect(()=>{
        setGrid(<Grid/>);
    },[]);



    return (
        <div id={css.profile}>
            <Menu/>
            <div id={css.dataColumn}>
                <Users/>
            </div>
            <div id={css.userColumns}>
                {grid}
            </div>
        </div>
    );
}



export default AllUsers;
