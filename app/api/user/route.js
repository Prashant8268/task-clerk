// pages/api/auth/login.js
import {  currentUser } from "@clerk/nextjs/server";
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { getAuth,clerkClient } from "@clerk/nextjs/server";

// Export a named function corresponding to the HTTP method (POST in this case)
export  async function POST(req, res) {
    await dbConnect();
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
          }
    
        const user = await clerkClient().users.getUser(userId);

        const userId1 = user.id;
        const userEmail = user.primaryEmailAddress.emailAddress;
        const userName = user.fullName; 
        var newUser = {
            userId,
            userEmail,
            userName
        }

        const userExist  = await User.findOne({userId});
        if(userExist){
            return NextResponse.json({ message: 'Sign in successful',newUser}, { status: 200 });
        }
         newUser = await User.create({
            email:userEmail,
            userId:userId1,
            name:userName
        });

        return NextResponse.json({message: "User already exist", newUser},{status: 200});

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
