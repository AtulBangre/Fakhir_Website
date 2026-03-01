const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://fakhri_db:yZYRUaY1QP2XOovD@ac-fdjdt3f-shard-00-00.60chvjn.mongodb.net:27017,ac-fdjdt3f-shard-00-01.60chvjn.mongodb.net:27017,ac-fdjdt3f-shard-00-02.60chvjn.mongodb.net:27017/?ssl=true&replicaSet=atlas-sv13d6-shard-0&authSource=admin&retryWrites=true&w=majority";

const User = mongoose.models.SeedingUser || mongoose.model('SeedingUser', new mongoose.Schema({
    email: String,
    paymentMethods: mongoose.Schema.Types.Mixed
}, { collection: 'users' }));

async function clearPaymentMethods() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const alex = await User.findOne({ email: 'mauryatech7@gmail.com' });
        if (!alex) {
            console.log('Alex not found');
            return;
        }

        console.log('Clearing fake payment methods for Alex...');

        await User.updateOne({ _id: alex._id }, {
            $set: {
                paymentMethods: []
            }
        });

        console.log('Payment methods cleared. User can now add their own.');
    } catch (error) {
        console.error('Error clearing payment methods:', error);
    } finally {
        await mongoose.disconnect();
    }
}

clearPaymentMethods();
