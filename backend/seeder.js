const db = require('./config/db');
const bcrypt = require('bcryptjs');

const seedAdminUser = async () => {
    try {
        const email = 'admin@test.com';
        const rawPassword = '123456';
        const name = 'Admin User';

        // User already exists check
        const [existingUsers] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        // Password  Encrypt (Hash) 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(rawPassword, salt);

        // Database insert ක
        await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        console.log('Admin user created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error.message);
        process.exit(1);
    }
};

seedAdminUser();