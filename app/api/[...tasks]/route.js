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
            return NextResponse.json({success:false, message:'Unauthorized'});
          }
        const url = req.url;
        const id = url.split('/tasks/')[1];
        const user = await clerkClient().users.getUser(userId);
        const userId1 = user.id;

        const workspace = await Workspace.findOne({ _id: id }).populate({
            path: 'tasks',
            populate: {
              path: 'cards',
              model: 'Card' 
            }
          });
          
        if(workspace){
            return NextResponse.json({success:true, tasks:workspace.tasks, workspaceName:workspace.name});
        } 

        return NextResponse.json({ message: 'Workspace not present',  }, { status: 401 });
      

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
