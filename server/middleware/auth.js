import jwt from 'jsonwebtoken';


const authMiddleware = (
    req,
    res,
    next
) => {
    const authHeader =
        req.headers.authorization;


    if (!authHeader) {
        return res.status(401).json({
            error:
                'Authorization token required',
        });
    }


    const [scheme, token] =
        authHeader.split(' ');


    if (
        scheme !== 'Bearer' ||
        !token
    ) {
        return res.status(401).json({
            error:
                'Invalid authorization header',
        });
    }


    try {
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        req.userId =
            decoded.id;


        next();
    } catch (error) {
        if (
            error.name ===
            'TokenExpiredError'
        ) {
            return res.status(401).json({
                error:
                    'Token has expired',
            });
        }


        if (
            error.name ===
            'JsonWebTokenError'
        ) {
            return res.status(401).json({
                error:
                    'Invalid token',
            });
        }


        return res.status(401).json({
            error:
                'Authentication failed',
        });
    }
};


export default authMiddleware;