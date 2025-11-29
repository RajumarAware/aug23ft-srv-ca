const {users} = require('../data');
const basicAuth = require('basic-auth')

// Middleware function to determine if the API endpoint request is from an authenticated user
async function isAuth(req, res, next) {
    const credentials = basicAuth(req)
    if (!credentials) {
        return res.send({
            status: 'failed',
            message: 'unauthenticated'
        })
    }
    const user = users.find((item) => item.username === credentials.name && item.password === credentials.pass)
    if (!user) {
        return res.send({
            status: 'failed',
            message: 'unauthenticated'
        })
    }
    req.user = user;
    next();
}

async function isAdmin(req, res, next) {
    const credentials = basicAuth(req)
    if (!credentials) {
        return res.send({
            status: 'failed',
            message: 'unauthenticated'
        })
    }
    const user = users.find((item) => item.username === credentials.name && item.password === credentials.pass)
    if (!user) {
        return res.send({
            status: 'failed',
            message: 'unauthenticated'
        })
    }
    if (user.userType === 'admin') {
        req.user = user;
        next();
    } else {
        return res.send({
            status: 'failed',
            message: 'only admin can access this resource'
        })
    }
}

module.exports = {
    isAdmin,
    isAuth
};

