const express = require('express')

const path= require('path')
const xss= require('xss')
const bodyParser= express.json()

const UserRouter= express.Router()
const UserService = require('./users-service')
const {GeneralService}= require('../service/api-service')

//MIDDLEWARE
const {requireBasicAuth}= require('../middleware/require-auth')
const {userValidation}= require('../middleware/form-validation')
const {checkItemExists}= require('../middleware/general-validation')

UserRouter
    .all(requireBasicAuth)
    .get('/',(req,res,next)=>{
        GeneralService.getAllItems(req.app.get('db'),'users')
        .then(users=>res.status(200).json(users))
        .catch(next)
    })
    .post('/',bodyParser,(req,res,next)=>{
        const errorMessage= userValidation(req,res,next)
        if(errorMessage) {
            return res.status(400).json({error: errorMessage})
        }
        const {first_name,last_name,username,password,age,gender,country}= req.body
        const newUser= {first_name,last_name,username,password,age,gender,country}

        UserService.hasUserWithUserName(req.app.get('db'),username)
        .then(hasUser=>{
            if(hasUser) return res.status(400).json({error:`Username already taken`})
            UserService.hashPassword(password)
            .then(hashedPassword=>{
                return GeneralService.insertItem(req.app.get('db'),'users',{...newUser,password:hashedPassword})
                    .then(user=>{
                        res.status(201)
                        .location(path.posix.join(req.originalUrl,`/${user.id}`))
                        .json(user) 
                    })
                    
        })
        })
        .catch(next)       
    })

UserRouter.route('/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'users'))
    .get((req,res,next)=>{
        res.json(res.item)
    })

module.exports= UserRouter