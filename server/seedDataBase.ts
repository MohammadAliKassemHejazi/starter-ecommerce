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
    
    await db.SubCategory.bulkCreate([
      { name: 'Mobile Phones', categoryId: categories[0].dataValues.id },
      { name: 'Laptops', categoryId: categories[0].dataValues.id },
      { name: 'Cameras', categoryId: categories[0].dataValues.id }
    ]);

    // Create subcategories for Clothing
    
    await db.SubCategory.bulkCreate([
      { name: 'Men', categoryId: categories[1].dataValues.id },
      { name: 'Women', categoryId: categories[1].dataValues.id },
      { name: 'Children', categoryId: categories[1].dataValues.id }
    ]);

    // Create subcategories for Books
    
    await db.SubCategory.bulkCreate([
      { name: 'Fiction', categoryId: categories[2].dataValues.id },
      { name: 'Non-Fiction', categoryId: categories[2].dataValues.id },
      { name: 'Educational', categoryId: categories[2].dataValues.id }
    ]);

    console.log('Database has been seeded.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default seedDatabase;
