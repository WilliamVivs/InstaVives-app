// File: convex/users/addDemoUser.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";



export const addDemoUsersAndStories = mutation({
  args: {
    users: v.array(
        v.object({
        username: v.string(),
        fullname: v.string(),
        email: v.string(),
        image: v.string(),
        clerkId: v.string(),
        mediaUrl: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const results: { userId: string; storyId: string }[] = [];

    for (const user of args.users) {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", user.clerkId))
        .unique();

      let userId = existingUser?._id;

      if (!userId) {
        userId = await ctx.db.insert("users", {
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          image: user.image,
          clerkId: user.clerkId,
          followers: 0,
          following: 0,
          posts: 0,
          bio: "Usuario demo para pruebas",
        });
      }

      const storyId = await ctx.db.insert("stories", {
        userId,
        mediaUrl: user.mediaUrl,
        createdAt: Date.now(),
        storageId: "demo_storage_id",
      });

      results.push({ userId, storyId });
    }

    return results;
  },
});


// export const STORIES = [
//   {
//     id: "1",
//     username: "Paco",
//     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
//     hasStory: false,
//   },
//   {
//     id: "2",
//     username: "sarah.k",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "3",
//     username: "alex.m",
//     avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "4",
//     username: "julia.r",
//     avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "5",
//     username: "mike.rs",
//     avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "6",
//     username: "jane.d",
//     avatar: "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "7",
//     username: "claudia",
//     avatar: "https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
//   {
//     id: "8",
//     username: "mike.rs",
//     avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
//     hasStory: true,
//   },
// ];
