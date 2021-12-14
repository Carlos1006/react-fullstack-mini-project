import React, {useEffect, useRef, useState} from 'react';
import css from './styles/Profile.module.css';
import Input from "../fragment/Input";
import Grid from "../fragment/Grid";
import Menu from "../fragment/Menu";
import {useNavigate} from "react-router-dom";
import Axios from "axios";
import {Check} from "../../tools/Validation";

const EditProfile = () => {

    const [grid,setGrid] = useState(<></>);
    const navigation = useNavigate();
    const [loginData,setLoginData] = useState({
        email:'',
        name:''
    });

    useEffect(()=>{
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
                <User data={loginData}/>
            </div>
            <div id={css.userColumns}>
                {grid}
            </div>
        </div>
    );
}

const User = ({toSave,data})=>{

    const [originalData,setOriginalData] = useState(null);
    const [changesToSave,setChangesToSave] = useState(false);
    const [changePassword,setChangePassword] = useState(false);
    const [changeable,setChangeable] = useState(false);
    const navigation = useNavigate();

    const [emailError,setEmailError] = useState(false);
    const [nameError,setNameError] = useState(false);
    const [timer,setTimer] = useState(null);

    const email = useRef();
    const name = useRef();
    const oldPassword = useRef();
    const newPassword = useRef();

    useEffect(()=>{
        setOriginalData({...data});
    },[data]);

    const lookingForChanges = (value,name)=>{
        setChangesToSave(false);
        if(originalData[name] !== value) {
            setChangesToSave(true);
        }
    };

    const reset = ()=>{
        setEmailError(false);
        setNameError(false);
    }

    const check = ()=>{
        reset();
        let ok = true;
        if(!Check.isEmail(email.current.getValue())) {
            setEmailError(true);
            ok = false
        }
        if(Check.isEmpty(name.current.getValue())) {
            setNameError(true);
            ok = false
        }
        return ok;
    }

    const passwordSet = () => {
        const oldPasswordValue = oldPassword.current.getValue();
        const newPasswordValue = newPassword.current.getValue();
        setChangePassword(false);
        if(oldPasswordValue != '' || newPasswordValue != '') {
            setChangePassword(true);
        }
    }

    const uniqueEmail = (callback)=>{
        if(data.email !== email.current.getValue()) {
            Axios.get(`http://localhost:3001/verify-email/${email.current.getValue()}`).then((response)=>{
                console.log(response);
                callback(response.data.ok);
            });
        }else {
            callback(true);
        }
    }

    const save = ()=>{
        if(changeable) {
            if(check()) {
                uniqueEmail(unique=>{
                    if(unique) {
                        console.log({
                            name:name.current.getValue(),
                            email:email.current.getValue(),
                            oldPassword:oldPassword.current.getValue(),
                            newPassword:newPassword.current.getValue(),
                            id:data.id,
                        });
                        const sentData = {
                            name:name.current.getValue(),
                            email:email.current.getValue(),
                            oldPassword:oldPassword.current.getValue(),
                            newPassword:newPassword.current.getValue(),
                            id:data.id,
                        };
                        Axios.put('http://localhost:3001/update-user',sentData).then((response)=>{
                            console.log(response);
                            if(response.data.ok) {
                                alert('Datos actualizados');
                                navigation("../profile");
                            }
                        });
                    }else {
                        setEmailError(true);
                        alert("El email ya esta registrado");
                        window.clearTimeout(timer);
                        setTimer(window.setTimeout(reset,1000));
                    }
                })
            }else {
                alert("Modifica correctamente los campos");
                window.clearTimeout(timer);
                setTimer(window.setTimeout(reset,1000));
            }
        }
    }

    const cancel = () =>{
        navigation("../profile");
    }

    useEffect(()=>{
        setChangeable((changesToSave || changePassword));
    },[changePassword,changesToSave])

    return (<>
        <div className={css.userContainer}>
            <div id={css.profileHeader}>
                <div id={css.userPicture}/>
                <div>
                    <div id={css.welcomeMessage} className={`${css.message}`}><span>perfil</span></div>
                    <div id={css.loginMessage} className={`${css.message}`}><span>{data.name}</span></div>
                    <div id={css.signupInvitation} className={`${css.message}`}>
                        <span>Datos del usuario</span>
                        <span/>
                    </div>
                </div>
            </div>
            <Input error={nameError} onChange={(value)=>lookingForChanges(value,'name')} ref={name} externalValue={data.name} icon={"user"} placeholder={"Nombre"}/>
            <Input error={emailError} onChange={(value)=>lookingForChanges(value,'email')} ref={email} externalValue={data.email} icon={"email"} placeholder={"Email"}/>
            <Input onChange={passwordSet} ref={oldPassword} icon={"key"} password={true} placeholder={"Contraseña actual"}/>
            <Input onChange={passwordSet} ref={newPassword} icon={"key"} password={true} placeholder={"Contraseña nueva"}/>
            <div className={css.buttonContainer}>
                <button onClick={cancel} className={`${css.actionButton}`}>Regresar</button>
                <button onClick={save} id={css.saveChanges} className={`${css.actionButton} ${changeable?css.changes:''}`}>Guardar cambios</button>
            </div>
        </div>
    </>);
}


export default EditProfile;
