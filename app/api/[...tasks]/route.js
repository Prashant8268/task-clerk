// pages/api/auth/login.js
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";
import Workspace from "@/models/Workspace";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, res) {
  await dbConnect();

  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract the workspace ID from the URL
    const url = req.url;
    const workspaceId = url.split("/tasks/")[1];

    // Retrieve user information from Clerk and your local database
    const user = await clerkClient.users.getUser(userId);
    const userMongoose = await User.findOne({ userId: user.id });

    if (!userMongoose) {
      return NextResponse.json(
        { success: false, message: "User not found in the database" },
        { status: 404 }
      );
    }

    const workspace = await Workspace.findOne({ _id: workspaceId }).populate({
      path: "tasks",
      populate: {
        path: "cards",
        model: "Card",
      },
    });

    if (workspace) {
      // Check if the user is an admin, collaborator, or viewer
      const isAdmin = workspace.admin.equals(userMongoose._id);
      const isCollaborator = workspace.collaborators.some((collabId) =>
        collabId.equals(userMongoose._id)
      );
      const isViewer = workspace.viewers.some((viewerId) =>
        viewerId.equals(userMongoose._id)
      );
     
      if (isAdmin || isCollaborator || isViewer) {
        return NextResponse.json({
          success: true,
          tasks: workspace.tasks,
          workspaceName: workspace.name,
          role: isAdmin ? "admin" : isCollaborator ? "collaborator" : "viewer",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message:
              "Access denied: You are not authorized to view this workspace.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: "Workspace not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
