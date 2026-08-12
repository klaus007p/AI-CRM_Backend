import jwt from 'jsonwebtoken'
import { User, User } from '../models/user.models'
import { asyncHandler } from '../utils/asyncHandler'
import { ApiError } from '../utils/ApiError'

// If Auuthorization  fails it will throw errors from apiError

export const protect = asyncHandler(async(req, res, next) => {

    let token;
    const header = req.headers.authorization;

    if(header && header.startsWith("Bearer")) {
        token = header.split(" ") [1];
    }

    if(!token){
        throw new ApiError(401, "Not Authorized, no token found");
    }

    let decode;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new ApiError(401, "Not Authorized, token invalid or expired")
    }

    const user = await User.findById(decode.id);
    if(!user){
        throw new ApiError (401, "Not Authorized, User no longer exists")
    }

    req.user = user;
    next(); // Route Handler
})