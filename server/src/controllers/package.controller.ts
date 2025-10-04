import { Request, Response } from 'express';
import * as packageService from '../services/package.service';
import { CustomError } from '../utils/customError';
import { ResponseValidationError } from '@paypal/paypal-server-sdk';
import { CustomRequest } from 'interfaces/types/middlewares/request.middleware.types';

export const packageController = {
  // Get all packages
  getAllPackages: async (req: Request, res: Response) => {
    try {
      const packages = await packageService.getAllPackages();
      return res.status(200).json({
        success: true,
        data: packages
      });
    } catch (error) {
      console.error('Error in getAllPackages controller:', error);
      if (error instanceof CustomError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Get package by ID
  getPackageById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const packageData = await packageService.getPackageById(id);
      return res.status(200).json({
        success: true,
        data: packageData
      });
    } catch (error) {
      console.error('Error in getPackageById controller:', error);
      if (error instanceof CustomError) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Create new package
  createPackage: async (req: Request, res: Response) => {
    try {
      const packageData = await packageService.createPackage(req.body);
      return res.status(201).json({
        success: true,
        data: packageData,
        message: 'Package created successfully'
      });
    } catch (error) {
      console.error('Error in createPackage controller:', error);
      if (error instanceof CustomError) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Update package
  updatePackage: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const packageData = await packageService.updatePackage(id, req.body);
      return res.status(200).json({
        success: true,
        data: packageData,
        message: 'Package updated successfully'
      });
    } catch (error : unknown ) {
      console.error('Error in updatePackage controller:', error);
      if (error instanceof CustomError) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Delete package
  deletePackage: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await packageService.deletePackage(id);
      return res.status(200).json({
        success: true,
        message: 'Package deleted successfully'
      });
    } catch (error) {
      console.error('Error in deletePackage controller:', error);
      if (error instanceof CustomError) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  },

  // Activate package for user
  activatePackage: async (req: CustomRequest, res: Response) => {
    try {
      const { packageId } = req.body;
      const userId = req.UserId!; // Assuming user is attached to request by auth middleware
      
      await packageService.activatePackage(userId, packageId);
      
      return res.status(200).json({
        success: true,
        message: 'Package activated successfully'
      });
    } catch (error) {
      console.error('Error in activatePackage controller:', error);
      if (error instanceof CustomError) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
};