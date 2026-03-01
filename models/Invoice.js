import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true, required: true },
    client: {
        name: { type: String, required: true },
        company: { type: String },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String, default: 'India' },
        gstNo: { type: String },
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    placeOfSupply: { type: String },
    amount: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    taxBreakdown: {
        cgst: { type: Number, default: 0 },
        sgst: { type: Number, default: 0 },
        igst: { type: Number, default: 0 },
        utgst: { type: Number, default: 0 },
        taxRate: { type: Number, default: 18 } // default GST rate
    },
    totalInWords: { type: String },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Overdue', 'Cancelled'],
        default: 'Pending'
    },
    date: { type: Date, default: Date.now },
    dueDate: { type: Date },
    items: [{
        description: { type: String, required: true },
        hsnCode: { type: String, default: '998311' }, // Default for IT services
        qty: { type: Number, default: 1 },
        rate: { type: Number, required: true },
        amount: { type: Number, required: true }
    }],
    paymentMethod: { type: String },
    downloadUrl: { type: String },
    notes: { type: String, default: 'Thank for the business' }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
