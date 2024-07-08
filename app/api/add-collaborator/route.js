// pages/api/auth/login.js
import {  currentUser } from "@clerk/nextjs/server";
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { getAuth,clerkClient } from "@clerk/nextjs/server";
import Workspace from "@/models/Workspace";


export  async function POST(req, res) {
    await dbConnect();
    try {
        const currentUser1 = await currentUser();
        if (!currentUser1) {
            return NextResponse.json({ error: "Unauthorized" });
          }
        const url = req.url;
        const body = await req.json();
        const id = body.url.split('/dashboard/')[1];
        const workspace = await Workspace.findOne({_id: id});
        const user = await User.findOne({email:body.user});
        if(workspace && user ){
            workspace.collaborators.push(user._id);
            user.workspaces.push(workspace._id);
            await user.save();
            await workspace.save();
            return NextResponse.json({success: true});

        } 
        return NextResponse.json({ message: 'user not present',  }, { status: 401 });
      
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
