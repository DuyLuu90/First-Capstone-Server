# NOTES:
# ASSIGNMENTS:
    HAPPY PATH:
        read req body-> validate fields->bcrypt the password->insert the user into the db
        send response:
            201 with the response location of the new user's id
            the res body should contain a serialized respresentation of the user, no pass down
            the user should have also had a date_created field auto-populated 
    CLIENT:
        .src/services/auth-api-service.js: add postUser(user)
        .src/components/.../RegistrationForm.js: edit handleSubmit(ev) tu use postUser
    SERVER:
        Add a new router: ./src/users/users-router.js
            Respond 400 when user/password is missing
            Respond 400 if validPassword is true.
            Respond 400 if hasUserWithUserName is true
            Respond 201 with location, json({id,user_name,full_name,nickname,date_created})
                
        Add a new service: ./src/users/users-service.js
            Add validatePassword(password), return true if password is not:
                Unique, between 8-72 characters, shouldn't start or end with spaces 
                Contains at least 1 lower case letter, 1 number, 1 special character,full_name is required, nickname is optional 
            Add hasUserWithUserName(db,user_name)
            Add insertUser(db,newUser)
            Add hashPassword(password)
            Add serializeUser(user)

        Other:
            Add new test file: ./test/users-endpoints.spec.js
                
                
                    
