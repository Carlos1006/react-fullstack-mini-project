import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import css from "./styles/Input.module.css";

// const Input = ({placeholder,password=false,icon,onChange,readonly=false})=>{
//
// }

const Input = forwardRef(({error=0,placeholder,externalValue,password=false,icon,onChange,readonly=false},ref) => {

    const [selected,setSelected] = useState(false);
    const [value,setValue] = useState('');

    const inputRef = useRef();

    const onFocusHandler = ()=>{
        setSelected(true);
    };

    const onBlurHandler = ()=>{
        setSelected(false);
    };

    const onKeyUpHandler = e=> {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    useImperativeHandle(ref, () => ({
        empty:()=>{
            inputRef.current.value = '';
            setValue('');
            onChange('');
        },
        getValue:()=>{
            return inputRef.current.value;
        }
    }));

    useEffect(()=>{
        if(typeof externalValue !== 'undefined') {
            console.log(externalValue);
            setValue(externalValue);
            inputRef.current.value = externalValue;
        }
    },[externalValue]);

    return (<div className={`${css.input} ${error?'error':''}`}>
        <span className={`${css.inputPlaceholder} ${(selected || value !== '')?css.selected:''}`}>{placeholder}</span>
        <input ref={inputRef} type={password?"password":"text"} readOnly={readonly} onChange={onKeyUpHandler} onBlur={onBlurHandler} onFocus={onFocusHandler} className={css.inputInput}/>
        <div className={`${css.inputIcon} ${icon}`}/>
    </div>);
});

export default Input;
