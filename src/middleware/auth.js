import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp();
}

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ errors: ['No token provided.'], status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    // Optionally, attach user info to request
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error while checking user', error);
    res.status(401).json({
      errors: ['User not authenticated.'],
      status: 401,
    });
  }
};
