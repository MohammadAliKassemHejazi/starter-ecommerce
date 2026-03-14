import { GlobalDataResponse } from '../interfaces/types/models/record.model.types';

export const getRecords = async (): Promise<GlobalDataResponse[]> => {
  // Mock Record model for demonstration of Service-Controller mapping pattern
  const Record = {
    findAll: async () => [
      { id: '1', db_title: 'Record 1', db_count: 10, images: ['image1.jpg'] }
    ]
  };

  const dbRecords = await Record.findAll();

  const formattedRecords = dbRecords.map(r => ({
    id: r.id,
    title: r.db_title,
    metrics: r.db_count,
    media: r.images[0]
  }))
  return formattedRecords
};
