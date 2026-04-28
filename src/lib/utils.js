import jwt from 'jsonwebtoken';

// NOTE: The frontend MUST send credentials with all axios/fetch requests
// using `withCredentials: true` (axios) or `credentials: 'include'` (fetch)
// for cookies to work across domains (e.g. Vercel frontend → Railway backend).
export const generateToken =(userId, res) =>{
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
    res.cookie('jwt', token, {
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,    // always true — backend is served over HTTPS in production
        sameSite: 'none', // required for cross-domain cookie delivery
    });

    return token;
};
