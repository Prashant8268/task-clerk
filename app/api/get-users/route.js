// pages/api/auth/login.js

import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req, res) {
    await dbConnect();
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" });
        }
        let users = await User.find({ email: { $ne: loggedInUser.emailAddresses[0].emailAddress } });
        let newAllUsers = users.map(user => user.email);

        return NextResponse.json({ success: true, allUsers: newAllUsers }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
