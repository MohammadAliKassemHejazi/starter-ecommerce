import db  from './src/models/index';

async function seedDatabase() {
  try {
    // Create categories
    const categories = await db.Category.bulkCreate([
      { name: 'Electronics', description: 'Devices and gadgets' },
      { name: 'Clothing', description: 'Apparel and accessories' },
      { name: 'Books', description: 'Printed and digital books' }
    ]);

    // Create subcategories for Electronics
    const electronicsId = categories.find((category : any) => category._previousDataValues.name === 'Electronics')?.id;
    await db.SubCategory.bulkCreate([
      { name: 'Mobile Phones', categoryId: electronicsId },
      { name: 'Laptops', categoryId: electronicsId },
      { name: 'Cameras', categoryId: electronicsId }
    ]);

    // Create subcategories for Clothing
    const clothingId = categories.find((category:any) => category._previousDataValues.name === 'Clothing')?.id;
    await db.SubCategory.bulkCreate([
      { name: 'Men', categoryId: clothingId },
      { name: 'Women', categoryId: clothingId },
      { name: 'Children', categoryId: clothingId }
    ]);

    // Create subcategories for Books
    const booksId = categories.find((category:any) => category._previousDataValues.name === 'Books')?.id;
    await db.SubCategory.bulkCreate([
      { name: 'Fiction', categoryId: booksId },
      { name: 'Non-Fiction', categoryId: booksId },
      { name: 'Educational', categoryId: booksId }
    ]);

    console.log('Database has been seeded.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default seedDatabase;
