# NOTES:
    # PROBLEMS:
        Error server when using invalid credential with protected endpoints
        username and password are in the headers for every req, which can be decoded
    #JSON Web Tokens (JWT): 
        JWT are compact, self-contained tokens. They only represents credentials. They don't actually contain the username/passwrod, but can do the same job as them
        Tokens are split into 3 data segments separated by (.): 
            Header: Base64-encoded JSON (contain info about the token)
            Payload: Base 64-encoded JSON (contain sub, iat, exp)
            Cryptographic signature: uniquely generated based on payload and a secret passphrase
        Convert JWT to JSON string:
            Buffer.from (`${JWT}`, 'base64).toString('ascii')
        jwt.sign:
            Payload: {user_id:testUser.id}
            Secret: process.env.JWT_SECRET
            Configuration object: {subject(username) and algorithm('HS256)}
        basic auth handler vs JWT handler:
            Similarity: clear the input and store the auth token in local storage
            Difference: JWT hanlder only stores the token if the req is successful

# ASSIGNMENT:
    CLIENT:
        Update login form to store the JWT from the res in local storage
            ./src/services/auth-api-service.js: 
                add postLogin(credentials)-> stringify(credentials) in the body
                replace "basic" by "bearer" in "authorization"
            ./src/components/LoginForm/LoginForm.js:
                import AuthApiService-> add handleSubmitJwtAuth(ev)-> use it onSubmit
    SERVER:
        Create a POST/login endpoint that responds with a JWT(JSON Web Tokens):
            Add new Auth Router: ./src/auth/auth-router.js-> then use it in app.js
            ./src/auth/auth-router.js:
                use getUserWithUsernam() to check if user exists
                use comparePasswords() to check if passwords match
                use createJwt() to send res
        Change middleware to verify the JWT instead of verifying the base64 encoded basic auth header:
            ./src/auth/auth-service.js: 
                add comparePassword(password,hash)
                add createJwt(subject,payload)
                add verifyJwt(token)
            ./src/middleware/basic-auth.js: 
                use AuthService.comparePassword instead if bcrypt.compare
            ./src/middleware/jwt-auth.js:
                use AuthService.verifyJwt to throw an error when the secret is wrong

        Other:
            Install JWT:            npm i jsonwebtoken
            ./test/setup.js:        store JWT_SECRET to use in test
            ./src/config.js:        add JWT_SECRET
            .ev:                    add JWT_SECRET
            .test/test-helpers.js:  edit makeAuthHeader()
            Add new test file: ./test/auth-endpoints.sepc.js:
                Respond 400 when username/password is missing
                Invalid Username
                Valid username but invalid password
            