import { Request, Response } from 'express';
import db from '../models';
import { ResponseFormatter } from '../utils/responseFormatter';

export const getTranslations = async (req: Request, res: Response) => {
  try {
    const { model, recordId, language, field } = req.query;
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};
    if (model) whereClause.model = model;
    if (recordId) whereClause.recordId = recordId;
    if (language) whereClause.language = language;
    if (field) whereClause.field = field;

    const { count, rows } = await db.Translation.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    ResponseFormatter.paginated(res, rows, Number(page), Number(limit), count, 'Translations retrieved successfully');
  } catch (error) {
    console.error('Error getting translations:', error);
    ResponseFormatter.error(res, 'Failed to get translations', 500);
  }
};

export const createTranslation = async (req: Request, res: Response) => {
  try {
    const { model, recordId, language, field, translation } = req.body;

    const translationRecord = await db.Translation.create({
      model,
      recordId,
      language,
      field,
      translation
    });

    ResponseFormatter.success(res, translationRecord, 'Translation created successfully', 201);
  } catch (error) {
    console.error('Error creating translation:', error);
    ResponseFormatter.error(res, 'Failed to create translation', 500);
  }
};

export const updateTranslation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { translation } = req.body;

    const translationRecord = await db.Translation.findByPk(id);
    if (!translationRecord) {
      return ResponseFormatter.notFound(res, 'Translation not found');
    }

    await translationRecord.update({ translation });

    ResponseFormatter.success(res, translationRecord, 'Translation updated successfully');
  } catch (error) {
    console.error('Error updating translation:', error);
    ResponseFormatter.error(res, 'Failed to update translation', 500);
  }
};

export const deleteTranslation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const translationRecord = await db.Translation.findByPk(id);
    if (!translationRecord) {
      return ResponseFormatter.notFound(res, 'Translation not found');
    }

    await translationRecord.destroy();

    ResponseFormatter.success(res, null, 'Translation deleted successfully');
  } catch (error) {
    console.error('Error deleting translation:', error);
    ResponseFormatter.error(res, 'Failed to delete translation', 500);
  }
};

export const getTranslationsByRecord = async (req: Request, res: Response) => {
  try {
    const { model, recordId } = req.params;

    const translations = await db.Translation.findAll({
      where: { model, recordId },
      order: [['language', 'ASC']]
    });

    // Group translations by language
    const groupedTranslations = translations.reduce((acc: any, translation: any) => {
      if (!acc[translation.language]) {
        acc[translation.language] = {};
      }
      acc[translation.language][translation.field] = translation.translation;
      return acc;
    }, {});

    ResponseFormatter.success(res, groupedTranslations, 'Translations retrieved successfully');
  } catch (error) {
    console.error('Error getting translations by record:', error);
    ResponseFormatter.error(res, 'Failed to get translations', 500);
  }
};
