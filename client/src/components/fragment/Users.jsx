import React, {useEffect, useState} from 'react';
import css from './styles/Users.module.css';
import Axios from "axios";

const Users = () => {

    const [users,setUsers] = useState([])

    useEffect(()=>{
        Axios.get('http://localhost:3001/users').then(response => {
            console.log(response.data);
            setUsers(response.data.value);
        });
    },[]);

    return (
        <div id={css.usersContainer}>
            <div id={css.users}>
                {[...users].map((value,index)=> {
                    return (<MiniProfile data={value} key={index}/>);
                })}
            </div>
        </div>
    );
}

const MiniProfile = ({data})=> {
    return (<div className={css.miniProfile}>
        <div className={css.userPicture}/>
        <div className={`${css.dataRow} ${css.name}`}><span>{data.name}</span></div>
        <div className={`${css.dataRow} ${css.email}`}><span>{data.email}</span></div>
        <div className={`${css.dataRow} ${css.last}`}><span>Creacion</span></div>
        <div className={`${css.dataRow} ${css.date}`}><span>{data.created}</span></div>
        <div className={`${css.dataRow} ${css.last}`}><span>Ultima modificacion</span></div>
        <div className={`${css.dataRow} ${css.date}`}><span>{data.updated}</span></div>
    </div>);
}

export default Users;
