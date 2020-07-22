const xss= require('xss')
const Treeize = require('treeize')

const UserService = {
    getAllUsers(db) {
        return db('users').select('*')
    },
    getBlockedUsers(db){
        return db('users').where(block_list='true')
    },
    getUserById(db,id) {
        return db('users').where({id}).first()
    },
    insertUser(db,newUser){
        return db.insert(newUser).into('users')
            .returing('*').then(rows=>rows[0])
    },
    deleteUser(db,id){
        return db('users').where({id}).delete()
    },
    updateUser(db,id,fieldsToUpdate){
        return db('users').where({id}).update(fieldsToUpdate)
    }
    
}

module.exports= UserService