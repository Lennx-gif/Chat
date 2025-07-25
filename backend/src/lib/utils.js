import jwt from 'jsonwebtoken';

export const generateToken =(userId, res) =>{
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
    res.cookie('jwt', token, {
        maxage: 3 * 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    return token;
};

