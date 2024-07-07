// pages/api/auth/login.js
import {  currentUser } from "@clerk/nextjs/server";
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { getAuth,clerkClient } from "@clerk/nextjs/server";
import Workspace from "@/models/Workspace";

// Export a named function corresponding to the HTTP method (POST in this case)
export  async function GET(req, res) {
    await dbConnect();
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
          }
    
        const user = await clerkClient().users.getUser(userId);
        
        const userId1 = user.id;
        const existedUser = await User.findOne({ userId }).populate('workspaces'); 

        if (!existedUser) {
            return res.status(404).json({ success: false, message: 'User not found in the database' });
        }
        const workspaces = existedUser.workspaces;

        // Populate admin field for each workspace
        await Workspace.populate(workspaces, { path: 'admin', select: 'name' });

        return NextResponse.json({ message: 'Successful', workspaces }, { status: 200 });
      

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
