import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // Generate a JWT token with the user ID as payload
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token expires in 7 days
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (it's in milliseconds) :)
        HTTPOnly: true, //prevent client-side JavaScript from accessing the cookie, which helps protect against XSS attacks
        sameSite: "strict", //restricts the cookie to be sent only in a first-party context, which helps prevent CSRF attacks
        secure: process.env.NODE_ENV === "development" ? false : true,
    });

    return token;
}