import React, {useState, useEffect, useCallback, useRef} from 'react';
import css from './styles/Login.module.css';
import Input from "../fragment/Input";
import Users from "../fragment/Users";
import Grid from "../fragment/Grid";
import Menu from "../fragment/Menu";
import { useNavigate  } from "react-router-dom";
import Axios from "axios";
import {Check} from '../../tools/Validation';

const Welcome = () => {

    const [onLogin,setOnLogin] = useState(true);
    const [onSignup,setOnSignup] = useState(false);
    const [hideLogin,setHideLogin] = useState(false);
    const [hideSignup,setSignup] = useState(true);
    const [grid,setGrid] = useState(<></>);
    const navigation = useNavigate();

    Axios.defaults.withCredentials = true;

    useEffect(()=> {
        Axios.get('http://localhost:3001/login').then((response)=>{
            console.log(response);
            if(response.data.ok) {
                navigation("../profile");
            }
        });
    },[]);

    const go = (toFadeOut,toFadeIn,toHide,toShow)=>{
        toFadeOut(false);
        setTimeout(()=>{
            toHide(true);
            toShow(false);
            setTimeout(()=>{
                toFadeIn(true);
            },100);
        },500);
    }

    const goToSignup = useCallback(()=>{
        go(setOnLogin,setOnSignup,setHideLogin,setSignup);
    },[go]);

    const goToLogin = useCallback(()=>{
        go(setOnSignup,setOnLogin,setSignup,setHideLogin);
    },[go]);

    useEffect(()=>{
        setGrid(<Grid/>);
    },[]);

    return (
        <div id={css.login}>
            <Menu/>
            <div id={css.welcomeForm}>
                <div className={`
                        ${css.loginContainer}
                        ${onLogin?css.show:''} 
                        ${hideLogin?css.hide:''} 
                     `}
                >
                    <Login onChange={goToSignup} />
                </div>
                <div className={`
                        ${css.loginContainer}
                        ${onSignup?css.show:''} 
                        ${hideSignup?css.hide:''} 
                     `}
                >
                    <Signup onChange={goToLogin}/>
                </div>
            </div>
            <div id={css.bannerMessage}>
                {grid}
                {/*<div id={css.loadUsers}>*/}
                {/*    <div id={css.showUsers}><span>Mostrar usuarios registrados</span></div>*/}
                {/*    <button className={css.actionButton} id={css.loadUsersButton}>Cargar usuarios</button>*/}
                {/*</div>*/}
                {/*<Users/>*/}
            </div>
        </div>
    );
}

const Login = ({onChange})=>{

    const navigation = useNavigate();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const emailRef = useRef();
    const passwordRef = useRef();

    const [emailError,setEmailError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [timer,setTimer] = useState(null);


    const check = ()=>{
        let ok = true;
        reset();
        if(Check.isEmpty(email)) {
            setEmailError(true);
            ok = false
        }
        if(Check.isEmpty(password)) {
            setPasswordError(true);
            ok = false
        }
        return ok;
    }

    const tryToLogin = ()=>{
        console.log({
            email,
            password
        });
        if(check()) {
            const data = {email,password};
            Axios.post('http://localhost:3001/login',data).then((response)=>{
                //console.log(response);
                if(response.data.ok) {
                    emailRef.current.empty();
                    passwordRef.current.empty();
                    navigation("../profile");
                }else {
                    alert(response.data.message);
                }
            });
        }else {
            alert("Escribe un email y una contraseña");
            window.clearTimeout(timer);
            setTimer(window.setTimeout(reset,1000));
        }
    }

    const reset = () => {
        setEmailError(false);
        setPasswordError(false);
    }

    return (<>
        <div id={css.welcomeMessage} className={`${css.message}`}><span>Bienvenido</span></div>
        <div id={css.loginMessage} className={`${css.message}`}><span>Inicia Sesion</span></div>
        <div id={css.signupInvitation} className={`${css.message}`}>
            <span>No tienes usuario?</span>
            <span onClick={onChange}>Registrate</span>
        </div>
        <Input error={emailError} ref={emailRef} onChange={value=>setEmail(value)} icon={"user"} placeholder={"Usuario"}/>
        <Input error={passwordError} ref={passwordRef} onChange={value=>setPassword(value)} icon={"key"} placeholder={"Contraseña"} password={true}/>
        <div className={css.buttonContainer}>
            <button onClick={onChange} className={css.actionButton}>Registrate</button>
            <button onClick={tryToLogin} id={css.loginButton} className={css.actionButton}>Inicia sesion</button>
        </div>
    </>);
}

const Signup = ({onChange})=>{

    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const [emailError,setEmailError] = useState(false);
    const [passwordError,setPasswordError] = useState(false);
    const [nameError,setNameError] = useState(false);

    const [timer,setTimer] = useState(null);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const check = ()=>{
        reset();
        let ok = true;
        if(!Check.isEmail(email)) {
            setEmailError(true);
            ok = false
        }
        if(Check.isEmpty(password)) {
            setPasswordError(true);
            ok = false
        }
        if(Check.isEmpty(name)) {
            setNameError(true);
            ok = false
        }
        return ok;
    }

    const reset = ()=>{
        setEmailError(false);
        setPasswordError(false);
        setNameError(false);
    }

    const uniqueEmail = (callback)=>{
        Axios.get(`http://localhost:3001/verify-email/${email}`).then((response)=>{
            console.log(response);
            callback(response.data.ok);
        });
    }

    const register = ()=>{

        if(check()) {
            uniqueEmail(uniqueEmail=>{
                if(uniqueEmail) {
                    const data = {name,email,password};
                    Axios.post('http://localhost:3001/create',data).then((response)=>{
                        if(response.data.ok) {
                            setName('');
                            setEmail('');
                            setPassword('');
                            alert("Registro completo");
                            nameRef.current.empty();
                            emailRef.current.empty();
                            passwordRef.current.empty();
                            onChange();
                        }
                    });
                }else {
                    setEmailError(true);
                    alert("El email ya esta registrado");
                    window.clearTimeout(timer);
                    setTimer(window.setTimeout(reset,1000));
                }
            });

        }else {
            alert("Faltan campos por llenar");
            window.clearTimeout(timer);
            setTimer(window.setTimeout(reset,1000));
        }

    }

    return (<>
        <div id={css.welcomeMessage} className={`${css.message}`}><span>UNETE</span></div>
        <div id={css.loginMessage} className={`${css.message}`}><span>Crea tu cuenta</span></div>
        <div id={css.signupInvitation} className={`${css.message}`}>
            <span>Ya tienes usuario?</span>
            <span onClick={onChange}>Inicia sesion</span>
        </div>
        <Input error={nameError} ref={nameRef} onChange={value=>setName(value)} icon={"user"} placeholder={"Nombre"}/>
        <Input error={emailError} ref={emailRef} onChange={value=>setEmail(value)} icon={"email"} placeholder={"Email"}/>
        <Input error={passwordError} ref={passwordRef} onChange={value=>setPassword(value)} icon={"key"} placeholder={"Contraseña"} password={true}/>
        <div className={css.buttonContainer}>
            <button onClick={onChange} className={css.actionButton}>Volver</button>
            <button onClick={register} id={css.loginButton} className={css.actionButton}>Estoy listo</button>
        </div>
    </>);
}




export default Welcome;
