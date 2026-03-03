const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.js').default;

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        let admin = await User.findOne({ role: 'admin' });
        const bcrypt = require('bcrypt');
        const salt = await bcrypt.genSalt(12);
        const password = await bcrypt.hash('admin123', salt);

        if (!admin) {
            admin = new User({
                name: 'System Admin',
                email: 'admin@ecogrow.com',
                password: password,
                role: 'admin',
            });
            await admin.save();
        } else {
            admin.password = password;
            await admin.save();
        }

        console.log('--- ADMIN ACCESS ---');
        console.log('Email: ' + admin.email);
        console.log('Password: admin123');
    } catch (e) {
        console.log(e);
    }
    process.exit(0);
});
