const xss= require('xss')
const Treeize = require('treeize')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const validLetters=/^[A-Za-z ]+$/

const GeneralService={
    getAllItems(db,dbName){
        return db(dbName).select('*')
    },
    getItemById(db,dbName,id){
        return db(dbName).where({id}).first()
    },
    insertItem(db,dbName,newItem){
        return db.insert(newItem).into(dbName)
            .returning('*').then(rows=>rows[0])
    },
    deleteItem(db,dbName,id){
        return db(dbName).where({id}).delete()
    },
    updateItem(db,dbName,id,fieldsToUpdate){
        return db(dbName).where({id}).update(fieldsToUpdate)
    }
}

const MovieService={
    
}

const UserService={

}

const ArtistService={

}

const AuthService={

}

module.exports={GeneralService,MovieService,UserService,ArtistService,AuthService}