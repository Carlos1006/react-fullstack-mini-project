const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const {createQuery} = require("mysql");
const bcrypt = require('bcrypt');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {request} = require("express");

app.use(cors({
    origin:['http://localhost:6001'],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    key:'userId',
    secret:'lorem',
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:999999999999999999999999
    }
}));

const Encrypt = {
    cryptPassword: (password) =>
        bcrypt.genSalt(10)
            .then((salt => bcrypt.hash(password, salt)))
            .then(hash => hash),
    comparePassword: (password, hashPassword) =>
        bcrypt.compare(password, hashPassword)
            .then(resp => resp)
}

const db = mysql.createConnection({
    user:'root',
    host:'localhost',
    password:"password",
    database:'crud',
    port:'3307'
});

app.listen(3001,()=>{
    console.log('Server running! on port 3001');
});

app.post('/create',(request,response) => {
    const {email,name,password} = request.body;
    Encrypt.cryptPassword(password).then(newPassword => {
        db.query("INSERT INTO user(email,name,password) VALUES(?,?,?)",[
            email,
            name,
            newPassword
        ],(error,result) => {
            if(error) {
                response.send({
                    message:"Unsuccess Signup",
                    value:[],
                    ok:false
                });
            }else {
                response.send({
                    message:"Success Signup",
                    value:result,
                    ok:true
                });
            }
        });
    });
});

app.post("/login",(request,response)=>{
    const {email,password} = request.body;
    db.query("SELECT id,email,password,name,DATE_FORMAT(updated,'%d-%c-%Y') AS 'updated',DATE_FORMAT(created,'%d-%c-%Y') AS 'created' FROM user WHERE email = ?",[
        email
    ],(error,result) => {
        if(error) {
            response.send({message:error});
        }
        if(result.length > 0) {
            const encryptedPassword = result[0].password;
            Encrypt.comparePassword(password,encryptedPassword).then(comparisonResult=>{
                if(comparisonResult) {
                    request.session.user = result[0];
                    console.log(request.session.user);
                    response.send({
                        message:"Success Login",
                        value:result[0],
                        ok:true
                    });
                }else {
                    response.send({
                        message:"Usuario o Contraseña incorrecto",
                        ok:false,
                        value:{}
                    });
                }
            });
        }else {
            response.send({
                message:"Usuario o Contraseña incorrecto",
                ok:false,
                value:{}
            });
        }
    });

});

app.get("/login",(request,response)=>{
    if(request.session.user) {
        response.send({
            message:"Logged in",
            value:request.session.user,
            ok:true
        });
    }else {
        response.send({
            message:"Not logged in",
            value:[],
            ok:false
        });
    }
});

app.get("/users",(request,response)=>{
    db.query("SELECT email,name,DATE_FORMAT(updated,'%d-%c-%Y') AS 'updated',DATE_FORMAT(created,'%d-%c-%Y') AS 'created' FROM user",[],(error,result) => {
        if(error) {
            console.log(error);
        }else {
            response.send({
                message:"Users fetched",
                value:result,
                ok:true
            });
        }
    });
});

app.put('/update-user',(request,response)=>{
    const {id,name,email,oldPassword,newPassword} = request.body;
    db.query("UPDATE user SET name=?,email=? WHERE id=?",[name,email,id],(error,result)=>{
        if(error) {
            console.log(error);
        }else {
            console.log(request.body);
            request.session.user.name = name;
            request.session.user.email = email;
            if(oldPassword != '' && newPassword  != '') {
                Encrypt.comparePassword(oldPassword,request.session.user.password).then(comparisonResult=>{
                    if(comparisonResult) {
                        Encrypt.cryptPassword(newPassword).then(hashPassword => {
                            db.query("UPDATE user SET password=? WHERE id=?",[hashPassword,id],(error,result)=>{
                                request.session.user.password = hashPassword;
                                response.send({
                                    message:"Datos actualizados",
                                    value:{
                                        newData:request.session.user,
                                        result:result
                                    },
                                    ok:true
                                });
                            });
                        });
                    }else {
                        response.send({
                            message:"Datos actualizados, no se pudo actualizar la contraseña",
                            value:{
                                newData:request.session.user,
                                result:result
                            },
                            ok:true
                        });
                    }
                });
            }else {
                response.send({
                    message:"Datos actualizados",
                    value:{
                        newData:request.session.user,
                        result:result
                    },
                    ok:true
                });
            }
        }
    });
});

app.get("/logout",(request,response)=>{
    request.session.destroy();
    response.send({
        message:"Sesion terminada",
        value:{},
        ok:true
    });
});

app.delete('/delete-user/:id', (request, response) => {
    const {id} = request.params;
    db.query("DELETE FROM user WHERE id=?",[id],(error,result)=>{
        request.session.destroy();
        response.send({
            message:"Usuario eliminado",
            value:result,
            ok:true
        });
    });
});

app.get('/verify-email/:email',(request,response)=>{
    const {email} = request.params;
    db.query("SELECT * FROM user WHERE email = ?",[email],(error,result) => {
        if(error) {
            console.log(error);
        }else {
            response.send({
                message:"",
                value:email,
                ok:(result.length === 0)
            });
        }
    });
});
