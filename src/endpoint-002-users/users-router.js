const express = require('express')

const path= require('path')
const xss= require('xss')
const bodyParser= express.json()

const UserRouter= express.Router()
const UserService = require('./users-service')

//MIDDLEWARE
const {requireBasicAuth}= require('../middleware/require-auth')
const {userValidation}= require('../middleware/form-validation')

UserRouter
    .get('/',(req,res,next)=>{
        UserService.getAllUsers(req.app.get('db'))
        .then(users=>{
            res.status(200).json(users)
        })
        .catch(next)
    })
    .post('/',bodyParser,(req,res,next)=>{
        //userValidation(req,res,next)
        const errorMessage= userValidation(req,res,next)
        //console.log('Router',errorMessage)
        if(errorMessage) {
            return res.status(400).json({error: errorMessage})
        }
        const {first_name,last_name,username,password,nickname,age,gender,country}= req.body
        const newUser= {first_name,last_name,username,password,nickname,age,gender,country}

        UserService.hasUserWithUserName(req.app.get('db'),username)
        .then(hasUser=>{
            //console.log('form-validation',hasUser)
            if(hasUser) return res.status(400).json({error:`Username already taken`})
            UserService.hashPassword(password)
            .then(hashedPassword=>{
                return UserService.insertUser(req.app.get('db'),{...newUser,password:hashedPassword})
                    .then(user=>{
                        res.status(201)
                        .location(path.posix.join(req.originalUrl,`/${user.id}`))
                        .json(user) 
                    })
        })
        })
        .catch(next)       
    })

UserRouter.route('/:userId')
    .all(requireBasicAuth)
    .all((req,res,next)=>{
        const {userId}= req.params
        UserService.getUserById(req.app.get('db'),userId)
            .then(user=>{
                if(!user) return res.status(400).json({error:{
                    message: 'User not found'
                }})
                res.user= user
                next()
            })
            .catch(next)
    })
    .get((req,res,next)=>{
        res.json(res.user)
    })
/*
async function checkUserExists(req,res,next) {
    try {
        const User= await UserService.getUserById(
            req.app.get('db'),
            req.params.UserId
        )
        if (!User) return res.status(400).json({
            error: `User doesn't exist`
        })
        res.User= User
        next()
    }
    catch(error) {
        next(error)
    }
}*/

module.exports= UserRouter