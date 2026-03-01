const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://fakhri_db:yZYRUaY1QP2XOovD@ac-fdjdt3f-shard-00-00.60chvjn.mongodb.net:27017,ac-fdjdt3f-shard-00-01.60chvjn.mongodb.net:27017,ac-fdjdt3f-shard-00-02.60chvjn.mongodb.net:27017/?ssl=true&replicaSet=atlas-sv13d6-shard-0&authSource=admin&retryWrites=true&w=majority";

const PricingPlanSchema = new mongoose.Schema({
    name: String,
    prices: Object,
    period: String
});

const PricingPlan = mongoose.models.PricingPlan || mongoose.model('PricingPlan', PricingPlanSchema, 'pricingplans');

async function dumpPlans() {
    try {
        await mongoose.connect(MONGODB_URI);
        const plans = await PricingPlan.find({});
        plans.forEach(p => {
            console.log(`Plan: ${p.name}, Prices: ${JSON.stringify(p.prices)}`);
        });
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

dumpPlans();
