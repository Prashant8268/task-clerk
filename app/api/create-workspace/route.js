// pages/api/workspaces.js
import dbConnect from '../../../lib/mongodb';
import Workspace from '../../../models/Workspace';
import User from '../../../models/User'
import { getAuth,clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export  async function POST(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return NextResponse.json({message: 'Unauthorized'}, {status:401})
              }
            const body = await req.json();
            const {workspace} = body;
            const existedUser = await clerkClient().users.getUser(userId);
            const userId1 = existedUser.id;
            const userEmail = existedUser.primaryEmailAddress.emailAddress;
            const userName = existedUser.fullName; 

            const user = await User.findOne({ userId:userId1 });

            if (!user) {
                return NextResponse.json({message: 'User not found'},{status:404});
            }

            // Create a new workspace
            const newWorkspace = new Workspace({
                name:body.workspace.replace(/^"|"$/g, '').trim(),
                admin: user._id,
                collaborators: [],
                viewers: [],
                tasks: [],
                createdAt:new Date().toISOString().split('T')[0]
            });
            const savedWorkspace = await newWorkspace.save();
            await savedWorkspace.populate('admin', 'name');
            user.workspaces.push(savedWorkspace._id);
            await user.save();
            return NextResponse.json({success: true, workspace:savedWorkspace});
        } catch (error) {
            console.error(error);
            return NextResponse.json({message: 'Server Error',success:false})
        }
    } else {
        return  NextResponse.json({success:false, message: 'Method not allowed'});
    }
}
