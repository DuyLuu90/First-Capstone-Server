const express = require('express')
const UserService = require('./users-service')
//const {requireAuth}= require('../middleware/basic-auth')

const path= require('path')
const xss= require('xss')

const bodyParser= express.json()
const UserRouter= express.Router()

UserRouter.route('/')
    .get((req,res,next)=>{
        UserService.getAllUsers(req.app.get('db'))
        .then(users=>{
            res.status(200).json(users)
        })
        .catch(next)
    })
    .post(bodyParser,(req,res)=>{
        const {first_name,last_name,username,password}= req.body
        for( const field of ['first_name', 'last_name', 'username', 'password'])
            if (!req.body[field]) {
                return res.status(400).json({
                    error: `Missing ${field} in req body`
                })
            }
        UserService.validateName(first_name,last_name)
            .then(nameError=>{
                if(nameError) {return res.status(400).json({error: nameError})}
            })
            
        UserService.validatePassword(password)
            .then(passwordError=>{
                if(passwordError) {return res.status(400).json({error:passwordError})}
            })
/*
        const nameError= UserService.validateName(first_name,last_name)
        if (nameError) {
            return  res.status(400).json({error: nameError})
        } 

        const passwordError= UsersService.validatePassword(password)
        if (passwordError) {
            return res.status(400).json({error: passwordError})
        }
*/        
        UserService.hasUserWithUserName(req.app.get('db'),username)
            .then(hasUserWithUserName=>{
                if(hasUserWithUserName){
                    return res.status(400).json({
                        error:`Username already taken`
                    })
                }
            })
    })

UserRouter.route('/:UserId')
    .get((req,res,next)=>{
            
    })

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
}

module.exports= UserRouter