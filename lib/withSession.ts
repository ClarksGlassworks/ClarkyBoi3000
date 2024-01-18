// lib/withSession.js

import { serialize } from 'cookie';

export default function withSession(handler) {
  return async (req, res) => {
    const sessionToken = req.cookies['woocommerce-session'];

    // Attach sessionToken to the req object
    req.sessionToken = sessionToken;

    // Handle response
    const originalResEnd = res.end;
    res.end = async function() {
      if (!req.sessionToken && res.newSessionToken) {
        // Set-Cookie header
        res.setHeader('Set-Cookie', serialize('woocommerce-session', res.newSessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 86400,
          path: '/',
        }));
      }
      //@ts-ignore
      return originalResEnd.apply(this, arguments);
    };

    // Continue to the next middleware or route handler
    return handler(req, res);
  };
}
