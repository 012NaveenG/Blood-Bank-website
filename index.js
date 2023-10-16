// const app = require('http');
import express from 'express'
import path from 'path'
import mysql from 'mysql2'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
const app = express()

// database connection 
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'iBlood_Bank'
})
conn.connect((err) => {
    if (err) throw err
    console.log('Connected to the database')
})

// using all the middlewares
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.set("view engine", 'ejs')

// all websites routing 
app.get('', ((req, res) => {
    if (!req.cookies.username) {
        res.render('index')
    } else {
        res.render('homepage',{session:true})
    }
}))
app.get('/signup', ((req, res) => {
    if(req.cookies.username){
        res.redirect('/')
    }else{

        res.render('signup')
    }
}))
app.post('/signup', ((req, res) => {
    const sql = `SELECT * from iBlood_users where username ='${req.body.username}'`
    conn.query(sql, (err, result) => {
        if (!result[0]) {

            const query = `INSERT INTO iBlood_users(firstName,lastName,Contact,username,password) value('${req.body.firstname}','${req.body.lastname}',${req.body.contact},'${req.body.username}','${req.body.password}');`
            conn.query(query, (err) => {
                if (err) throw err;
                res.redirect('/login')
            })
        } else {
            res.render('signup-error-page')
        }

    }
    )
}))

app.get('/login', ((req, res) => {
        res.render('login',{login:true})
}))
app.post('/login', ((req, res) => {

    const sql = `SELECT * from iBlood_users where username ='${req.body.username}' AND password = '${req.body.password}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        if (!result[0]) {
            res.render('login-errorpage')
        } else {
            res.cookie('username', result[0].firstName, {
                httpOnly: true,
                expires: new Date(Date.now() + 600* 1000)
            })
            res.redirect('/')
        }
    })
}))
app.get('/logout',((req,res)=>{
    res.cookie("username",null,{
        expires:new Date(Date.now())
    })
    res.redirect('/')
}))

app.get('/about', ((req, res) => {
    if(req.cookies.username){
        res.render('about',{session:true})
      }
}))
app.get('/contact', ((req, res) => {
    if(req.cookies.username){
      res.render('contact',{session:true})
    }
   
})).post('/contact',((req,res)=>{
    const sql  = `INSERT INTO message(name,lastname,email,message) values('${req.body.firstname}','${req.body.lastname}','${req.body.email}','${req.body.message}')`
    conn.query(sql)
    res.redirect('/')
}))

app.get('*',((req,res)=>{
    res.render('pageNotFound')
}))

app.listen(5050, (() => {
    console.log(`Server is running at http://localhost:5050`)
}))