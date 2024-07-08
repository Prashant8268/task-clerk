// pages/api/auth/login.js

import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { getAuth,clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";

export  async function GET(req, res) {
    await dbConnect();
    try {
        const currentUser1 = await currentUser();
        if (!currentUser1) {
            return NextResponse.json({ error: "Unauthorized" });
          }
        let users = await User.find();
        let newAllUsers = users.map(user => user.email);
        return NextResponse.json({success: true, collaborators:newAllUsers},{status: 200});
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
