import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken } from "./auth.middleware" 

export const protectedRoutes = (
  router: Router, 
  routesToProtect: string[] ,
) => {
  router.use(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestPath = req.path;
      
      if (routesToProtect.includes(requestPath)) {
        await verifyToken(req);
      }

      next();

    } catch (error) {
    res.status(500).send(error);
    }
  });
};
