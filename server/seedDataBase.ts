import db from './src/models/index';

async function seedDatabase() {
  try {
    // Delete all existing data (truncate tables)
    await db.Category.destroy({ truncate: true, cascade: true });
    await db.SubCategory.destroy({ truncate: true, cascade: true });
    await db.Size.destroy({ truncate: true, cascade: true });

    console.log('Existing data has been deleted.');

    // Create categories
    const categories = await db.Category.bulkCreate([
      { name: 'Electronics', description: 'Devices and gadgets' },
      { name: 'Clothing', description: 'Apparel and accessories' },
      { name: 'Books', description: 'Printed and digital books' }
    ]);

    console.log('Categories have been created.');

    // Create subcategories for Electronics
    await db.SubCategory.bulkCreate([
      { name: 'Mobile Phones', categoryId: categories[0].dataValues.id },
      { name: 'Laptops', categoryId: categories[0].dataValues.id },
      { name: 'Cameras', categoryId: categories[0].dataValues.id }
    ]);

    console.log('Subcategories for Electronics have been created.');

    // Create subcategories for Clothing
    await db.SubCategory.bulkCreate([
      { name: 'Men', categoryId: categories[1].dataValues.id },
      { name: 'Women', categoryId: categories[1].dataValues.id },
      { name: 'Children', categoryId: categories[1].dataValues.id }
    ]);

    console.log('Subcategories for Clothing have been created.');

    // Create subcategories for Books
    await db.SubCategory.bulkCreate([
      { name: 'Fiction', categoryId: categories[2].dataValues.id },
      { name: 'Non-Fiction', categoryId: categories[2].dataValues.id },
      { name: 'Educational', categoryId: categories[2].dataValues.id }
    ]);

    console.log('Subcategories for Books have been created.');

    // Create sizes
    await db.Size.bulkCreate([
      { size: 's' },
      { size: 'm' },
      { size: 'l' }
    ]);

    console.log('Sizes have been created.');
    console.log('Database has been successfully seeded.');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

export default seedDatabase;