const UserService= require('../endpoint-002-users/users-service')
const AuthService= require('../endpoint-003-auth/auth-service')

function userValidation(req,res,next){ 
    const {first_name,last_name,username,password}= req.body
    //console.log(first_name,last_name,username,password)
    for( const field of ['first_name', 'last_name', 'username', 'password']) {
        if (!req.body[field]) return  `Missing ${field} in req body`
    } 

    let nameError= UserService.validateName(first_name,last_name)
    if (nameError) return nameError
    
    let passwordError= UserService.validatePassword(password)
    if (passwordError) return passwordError

    /*
    UserService.hasUserWithUserName(req.app.get('db'),username)
        .then(hasUser=>{
            //console.log('form-validation',hasUser)
            if(hasUser) return `Username already taken`
            
        })
        .catch(next)
    */
    
    
}
function movieValidation(req,res,next){
    //const{title,posterUrl,trailerUrl,summary,genres}= req.body
    for (const field of ['title','posterurl','trailerurl','genres','summary']) {
        if (!req.body[field]) {
            return `${field} is required`
        }
    }
}

function loginValidation(req,res,next){
    for (const field of ['username','password',]) {
        if (!req.body[field]) {
            return `Missing ${field} in request body`
        }
    }
/*
    const {username,password}= req.body
    const loginUser= {username,password}
    for (const [key,value] of Object.entries(loginUser)) {
        if(value == null) 
            return `Missing ${key} in request body`
    }
*/
}
function reviewValidation(req,res,next) {
    for (const field of ['movieId','userId','comment','rating']) {
        if(!req.body[field]) {
            return `${field} is required`
        }
    }
}
    

module.exports= {userValidation,movieValidation,loginValidation,reviewValidation}