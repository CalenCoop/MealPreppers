const jwt = require('jsonwebtoken')
const {createError} = require('../middleware/error');

exports.verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    console.log('token',token)
    if(!token){
        return next(createError(401, "You are not authenticated"))
    }
    jwt.verify(token, process.env.JWT, (err, user) => {
        if(err) return next(createError(401, "Token is not valid "))
            req.user = user
        console.log('user',user)
        next()
    })
}
exports.verifyUser = (req, res, next) => {
    this.verifyToken(req, res, ()=> {
        if(req.user.id === req.params.id){
            next()
        }else{
             return next(createError(403, "You are not authorized"))
        }
    })
}