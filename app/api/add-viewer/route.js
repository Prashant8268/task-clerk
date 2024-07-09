import { currentUser } from "@clerk/nextjs/server";
import dbConnect from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import Workspace from "../../../models/Workspace";
import User from "../../../models/User";

export async function POST(req, res) {
    await dbConnect();
    try {
        const loggedInUser = await currentUser();
        if (!loggedInUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { workspaceId, userEmail } = body;
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        // Find the user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the user is already a viewer
        if (workspace.viewers.includes(user._id)) {
            return NextResponse.json({ error: "User is already a viewer of this workspace" }, { status: 400 });
        }
        const isCollaborator = workspace.collaborators.includes(user._id);
        if (isCollaborator) {
            return NextResponse.json({ success: true, message: "User already exists as collaborator",exist:true});
        }

        // Add user as a viewer to the workspace
        workspace.viewers.push(user._id);
        await workspace.save();

        // Add the workspace to the user's list of viewed workspaces
        user.workspaces.push(workspace._id);
        await user.save();

        return NextResponse.json({ success: true ,message:'Viwer Added '});
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
