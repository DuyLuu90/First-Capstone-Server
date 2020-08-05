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
        }).catch(next)       
    })

UserRouter.route('/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'users'))
    .get((req,res,next)=>{
        res.json(res.item)
    })
    .delete((req,res,next)=>{
        GeneralService.deleteItem(req.app.get('db'),'users',req.params.id)
        .then(()=>res.status(200).json('User has been deleted'))
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const {first_name,last_name,username,password,gender,country,block_list}= req.body
        const userToUpdate= {first_name,last_name,username,password,gender,country,block_list,
                last_modified: new Date().toLocaleString()}

        if (!password) return GeneralService.updateItem(req.app.get('db'),'users',req.params.id,userToUpdate)
        .then(()=>res.status(200).json('Success'))
        .catch(next)

        else {
            UserService.hashPassword(password)
            .then(hashedPassword=>{
                const updatedUser= {...userToUpdate,password: hashedPassword}
                return GeneralService.updateItem(req.app.get('db'),'users',req.params.id,updatedUser)
                .then(()=>res.status(200).json('Success'))})
            .catch(next)
        } 
    })

module.exports= UserRouter