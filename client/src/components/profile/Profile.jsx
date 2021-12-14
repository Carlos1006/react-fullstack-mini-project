import React, {useCallback, useEffect, useState} from 'react';
import css from './styles/Profile.module.css';
import Input from "../fragment/Input";
import Users from "../fragment/Users";
import Grid from "../fragment/Grid";
import Menu from "../fragment/Menu";
import Axios from "axios";
import {useNavigate} from "react-router-dom";

const Profile = () => {

    const [grid,setGrid] = useState(<></>);
    const navigation = useNavigate();
    const [loginData,setLoginData] = useState({
        email:'',
        name:''
    });

    const goToEdit = useCallback(()=>{
        navigation("../editProfile");
    },[navigation]);

    useEffect(()=> {
        setGrid(<Grid/>);
        Axios.get('http://localhost:3001/login').then((response)=>{
            if(!response.data.ok) {
                navigation("../login");
            }else {
                setLoginData(response.data.value);
            }
        });
    },[]);

    return (
        <div id={css.profile}>
            <Menu/>
            <div id={css.dataColumn}>
                <User goToEdit={goToEdit} data={loginData}/>
            </div>
            <div id={css.userColumns}>
                {grid}
                {/*<Users/>*/}
            </div>
        </div>
    );
}

const User = ({goToEdit,data})=>{

    const navigation = useNavigate();

    useEffect(()=>{
        console.log(data);
    },[data]);

    const logout = ()=>{
        Axios.get('http://localhost:3001/logout').then((response)=>{
            console.log(response);
            navigation("../");
            window.location.reload();
        });
    }

    const deleteUser = ()=>{
        if(window.confirm("Estas seguro de eliminar tu usuario?")) {
            Axios.delete(`http://localhost:3001/delete-user/${data.id}`).then((response)=>{
                console.log(response);
                alert("Usuario eliminado!");
                navigation("../");
            });
        }
    }

    return (<>
        <div className={css.userContainer}>
            <div id={css.profileHeader}>
                <div id={css.userPicture}/>
                <div>
                    <div id={css.welcomeMessage} className={`${css.message}`}><span>perfil</span></div>
                    <div id={css.loginMessage} className={`${css.message}`}><span>{data.name}</span></div>
                    <div id={css.signupInvitation} className={`${css.message}`}>
                        <span>Datos del usuario</span>
                        <span style={{cursor:"pointer"}} onClick={logout}>Cerrar sesion</span>
                    </div>
                </div>
            </div>
            <Input externalValue={data.name} readonly={true} icon={"user"} placeholder={"Nombre"}/>
            <Input externalValue={data.email} readonly={true} icon={"email"} placeholder={"Email"}/>
            <Input externalValue={data.created} readonly={true} icon={"calendar"} placeholder={"Fecha de creacion"}/>
            <Input externalValue={data.updated} readonly={true} icon={"calendar"} placeholder={"Ultima modificacion"}/>
            <div className={css.buttonContainer}>
                <button id={css.deleteButton} className={css.actionButton} onClick={deleteUser}>Eliminar registro</button>
                <button id={css.saveChanges} className={css.actionButton} onClick={goToEdit}>Editar</button>
            </div>
        </div>
    </>);
}


export default Profile;
