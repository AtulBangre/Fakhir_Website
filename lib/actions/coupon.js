'use server';

import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import { revalidatePath } from 'next/cache';

export async function getCoupons() {
    await connectDB();
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(coupons));
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }
}

export async function upsertCoupon(data) {
    await connectDB();
    try {
        const id = data._id || data.id;
        let coupon;

        if (id) {
            coupon = await Coupon.findByIdAndUpdate(id, data, { new: true }).lean();
        } else {
            // Check if code already exists
            const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
            if (existing) {
                return { success: false, error: 'Coupon code already exists' };
            }
            coupon = await Coupon.create(data);
        }

        revalidatePath('/super-admin/dashboard');
        return { success: true, coupon: JSON.parse(JSON.stringify(coupon)) };
    } catch (error) {
        console.error('Error upserting coupon:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteCoupon(id) {
    await connectDB();
    try {
        await Coupon.findByIdAndDelete(id);
        revalidatePath('/super-admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Error deleting coupon:', error);
        return { success: false, error: error.message };
    }
}

export async function validateCoupon(code, purchaseAmount) {
    await connectDB();
    try {
        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            status: 'active'
        });

        if (!coupon) {
            return { success: false, error: 'Invalid or inactive coupon code' };
        }

        // Check expiry
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return { success: false, error: 'Coupon has expired' };
        }

        // Check usage limit
        if (coupon.maxUsage !== null && coupon.usedCount >= coupon.maxUsage) {
            return { success: false, error: 'Coupon usage limit reached' };
        }

        // Check minimum purchase
        if (purchaseAmount < coupon.minPurchase) {
            return { success: false, error: `Minimum purchase of ₹${coupon.minPurchase} required` };
        }

        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (purchaseAmount * coupon.discountAmount) / 100;
        } else {
            discount = Math.min(coupon.discountAmount, purchaseAmount);
        }

        return {
            success: true,
            discount,
            coupon: JSON.parse(JSON.stringify(coupon))
        };
    } catch (error) {
        console.error('Error validating coupon:', error);
        return { success: false, error: 'An error occurred while validating coupon' };
    }
}
