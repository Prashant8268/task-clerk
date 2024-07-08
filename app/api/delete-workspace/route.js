// pages/api/workspaces/[workspaceId].js
import dbConnect from '../../../lib/mongodb';
import Workspace from '../../../models/Workspace';
import User from '../../../models/User';
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

export async function POST(req, res) {
    await dbConnect();

    if (req.method === 'POST') {
        try {
            const { userId } = getAuth(req);
            if (!userId) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            }

            const body = await req.json();
            const workspaceId = body.id;
            const workspace = await Workspace.findById(workspaceId);
            if (!workspace) {
                return NextResponse.json({ message: 'Workspace not found' }, { status: 404 });
            }

            const existedUser = await clerkClient().users.getUser(userId);
            const userId1 = existedUser.id;

            // Check if the authenticated user is the admin of the workspace
            if (!workspace.admin== userId1) {
                return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
            }

            // Find the user and remove the workspace from their list
            const user = await User.findOne({ userId: userId1 });
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            const workspaceIndex = user.workspaces.indexOf(workspaceId);
            if (workspaceIndex !== -1) {
                user.workspaces.splice(workspaceIndex, 1);
                await user.save();
            }

            // Delete tasks and cards associated with the workspace
            await deleteTasksAndCards(workspaceId);

            // Remove the workspace from viewers and collaborators
            await removeWorkspaceFromViewersAndCollaborators(workspaceId);

            // Finally, delete the workspace itself
            await Workspace.findByIdAndDelete(workspaceId);

            return NextResponse.json({ success: true, message: 'Workspace deleted successfully' });
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Server Error', success: false });
        }
    } else {
        return NextResponse.json({ success: false, message: 'Method not allowed' });
    }
}

async function deleteTasksAndCards(workspaceId) {
    // Delete all tasks and cards associated with the workspace
    await Workspace.findByIdAndUpdate(workspaceId, { $set: { tasks: [] } });
}

async function removeWorkspaceFromViewersAndCollaborators(workspaceId) {
    // Remove workspace from viewers and collaborators
    await User.updateMany(
        { $or: [{ workspaces: workspaceId }, { collaborators: workspaceId }, { viewers: workspaceId }] },
        { $pull: { workspaces: workspaceId, collaborators: workspaceId, viewers: workspaceId } }
    );
}
