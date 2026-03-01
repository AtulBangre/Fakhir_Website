'use server';

import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '@/lib/mail';

export async function requestPasswordReset(email) {
    console.log(`[Auth] Starting password reset request for: ${email}`);
    await connectDB();
    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[Auth] User not found: ${email}`);
            return { success: true, message: "If an account exists with this email, a reset link has been sent." };
        }

        if (user.role !== 'client') {
            console.log(`[Auth] Non-client user tried to reset: ${email} (${user.role})`);
            return {
                success: false,
                error: "You can contact to super-admin for update password",
                isAdmin: true
            };
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + (24 * 60 * 60 * 1000)); // 24 hours

        await user.save();
        console.log(`[Auth] Saved hashed token to DB. Hash begins with: ${hashedToken.substring(0, 8)}`);
        console.log(`[Auth] Expiry set to: ${user.resetPasswordExpires.toISOString()}`);

        const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        console.log(`[Auth] Generated Reset URL: ${resetUrl}`);

        const template = emailTemplates.passwordReset({
            name: user.name,
            resetUrl: resetUrl
        });

        const mailResult = await sendEmail({
            to: user.email,
            ...template
        });

        if (!mailResult.success) {
            console.error(`[Auth] Email failed to send: ${mailResult.error}`);
            // Still return success to user but log it
        }

        return { success: true, message: "If an account exists with this email, a reset link has been sent." };
    } catch (error) {
        console.error('[Auth] Password reset request error:', error);
        return { success: false, error: "An unexpected error occurred. Please try again later." };
    }
}

export async function resetPassword(token, password) {
    console.log(`[Auth] resetPassword hex: ${token?.substring(0, 8)}...`);
    await connectDB();
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by token first
        const user = await User.findOne({ resetPasswordToken: hashedToken });

        if (!user) {
            console.log(`[Auth] No user found for hash: ${hashedToken.substring(0, 8)}`);
            return { success: false, error: "Invalid or expired reset token." };
        }

        // Check expiry manually
        const now = new Date();
        if (user.resetPasswordExpires && user.resetPasswordExpires < now) {
            console.log(`[Auth] Token EXPIRED. Expiry: ${user.resetPasswordExpires.toISOString()}, Now: ${now.toISOString()}`);
            return { success: false, error: "Reset link has expired" };
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log(`[Auth] Password reset SUCCESS for: ${user.email}`);

        return { success: true, message: "Password has been reset successfully." };
    } catch (error) {
        console.error('[Auth] resetPassword Error:', error);
        return { success: false, error: "Failed to reset password" };
    }
}

export async function validateResetToken(token) {
    if (!token) return { success: false, error: "Token is required" };
    console.log(`[Auth] validateResetToken for: ${token.substring(0, 8)}...`);

    await connectDB();
    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user by token first
        const user = await User.findOne({ resetPasswordToken: hashedToken });

        if (!user) {
            console.log(`[Auth] Validation - No user for: ${hashedToken.substring(0, 8)}`);
            return { success: false, error: "Invalid reset link" };
        }

        // Check expiry manually
        const now = new Date();
        if (user.resetPasswordExpires && user.resetPasswordExpires < now) {
            console.log(`[Auth] Validation - EXPIRED. Exp: ${user.resetPasswordExpires.toISOString()}, Now: ${now.toISOString()}`);
            return { success: false, error: "Reset link has expired" };
        }

        console.log(`[Auth] Validation - SUCCESS for: ${user.email}`);
        return { success: true };
    } catch (error) {
        console.error('[Auth] validateResetToken Error:', error);
        return { success: false, error: "Failed to validate token" };
    }
}
