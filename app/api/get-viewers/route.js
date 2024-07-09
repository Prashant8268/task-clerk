import dbConnect from '../../../lib/mongodb';
import Workspace from '../../../models/Workspace';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req, res) {
    await dbConnect();
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const workspaceId = body.workspaceId;
        const workspace = await Workspace.findById(workspaceId).populate('viewers', 'email'); // Assuming 'viewers' is the field name in Workspace model for viewers
        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        const viewersEmails = workspace.viewers.map(viewer => viewer.email);
        
        return NextResponse.json({ success: true, viewers: viewersEmails }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
