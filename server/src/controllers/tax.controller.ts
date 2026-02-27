import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const getTaxRules = async (req: Request, res: Response) => {
  try {
    const { region, taxType } = req.query;

    const whereClause: any = {};
    if (region) whereClause.region = region;
    if (taxType) whereClause.taxType = taxType;

    const taxRules = await db.TaxRule.findAll({
      where: whereClause,
      order: [['region', 'ASC']],
    });

    ResponseFormatter.success(res, taxRules, 'Tax rules retrieved successfully');
  } catch (error) {
    console.error('Error getting tax rules:', error);
    ResponseFormatter.error(res, 'Failed to get tax rules', 500);
  }
};

export const createTaxRule = async (req: Request, res: Response) => {
  try {
    const { region, rate, taxType } = req.body;

    const taxRule = await db.TaxRule.create({
      region,
      rate,
      taxType,
    });

    ResponseFormatter.success(res, taxRule, 'Tax rule created successfully', 201);
  } catch (error) {
    console.error('Error creating tax rule:', error);
    ResponseFormatter.error(res, 'Failed to create tax rule', 500);
  }
};

export const updateTaxRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { region, rate, taxType } = req.body;

    const taxRule = await db.TaxRule.findByPk(id);
    if (!taxRule) {
      return ResponseFormatter.notFound(res, 'Tax rule not found');
    }

    await taxRule.update({ region, rate, taxType });

    ResponseFormatter.success(res, taxRule, 'Tax rule updated successfully');
  } catch (error) {
    console.error('Error updating tax rule:', error);
    ResponseFormatter.error(res, 'Failed to update tax rule', 500);
  }
};

export const deleteTaxRule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const taxRule = await db.TaxRule.findByPk(id);
    if (!taxRule) {
      return ResponseFormatter.notFound(res, 'Tax rule not found');
    }

    await taxRule.destroy();

    ResponseFormatter.success(res, null, 'Tax rule deleted successfully');
  } catch (error) {
    console.error('Error deleting tax rule:', error);
    ResponseFormatter.error(res, 'Failed to delete tax rule', 500);
  }
};

export const calculateTax = async (req: Request, res: Response) => {
  try {
    const { region, amount } = req.body;

    const taxRule = await db.TaxRule.findOne({
      where: { region },
    });

    if (!taxRule) {
      return ResponseFormatter.notFound(res, 'Tax rule not found for this region');
    }

    const taxAmount = (amount * taxRule.rate) / 100;
    const totalAmount = amount + taxAmount;

    ResponseFormatter.success(
      res,
      {
        originalAmount: amount,
        taxRate: taxRule.rate,
        taxAmount,
        totalAmount,
        taxType: taxRule.taxType,
      },
      'Tax calculated successfully',
    );
  } catch (error) {
    console.error('Error calculating tax:', error);
    ResponseFormatter.error(res, 'Failed to calculate tax', 500);
  }
};
