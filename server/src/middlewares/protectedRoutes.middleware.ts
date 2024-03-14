import { Router, Request, Response, NextFunction } from 'express';

export const protectedRoutes = (
  router: Router, // Change the type to Router
  routesToProtect: string[] // Adjust the type as necessary
) => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    try {
      const requestPath: string = req.path;
      if (routesToProtect.includes(requestPath)) {
        // Add your protection logic here
        console.log(`Route ${requestPath} is protected.`);
      }
      next();
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
