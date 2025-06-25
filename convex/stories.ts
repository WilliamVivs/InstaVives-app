import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addStory = mutation({
  args: {
    storageId: v.id("_storage"),
  },

  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const mediaUrl = await ctx.storage.getUrl(args.storageId);
    if (!mediaUrl) throw new Error("Media not found");

    const now = Date.now();

    const storyId = await ctx.db.insert("stories", {
      userId: currentUser._id,
      mediaUrl,
      createdAt: now,
      storageId: args.storageId,
      // expiresAt: now + 24 * 60 * 60 * 1000, // 24h opcional
    });

    return storyId;
  },
});

export const deleteStory = mutation({
  args: { storyId: v.id("stories") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const story = await ctx.db.get(args.storyId);
    if (!story) throw new Error("Story not found");

    if (story.userId !== currentUser._id) {
      throw new Error("Not authorised to delete this story");
    }

    // Delete the story if it exists from the storage section
    if (story.storageId) {
      await ctx.storage.delete(story.storageId);
    }

    // Delete the story
    await ctx.db.delete(args.storyId);
  },
});

export const getOwnStories = query({
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);

    // get all stories of the current User
    const stories = await ctx.db
      .query("stories")
      .withIndex("by_user", (q) => q.eq("userId", currentUser._id))
      .order("desc")
      .collect();    

    return stories;
  },
});

export const getAllStories = query({
  handler: async (ctx) => {
    // Obtener todas las historias ordenadas por fecha descendente
    const stories = await ctx.db.query("stories").order("desc").collect();

    // Obtener datos básicos de usuario para cada historia
    // (Puedes optimizar si tienes un índice por userId, o hacer batch de usuarios)
    const storiesWithUserData = await Promise.all(
      stories.map(async (story) => {
        const user = await ctx.db.get(story.userId); // o la consulta que uses para el usuario

        return {
          id: story._id,
          userId: story.userId,
          mediaUrl: story.mediaUrl,
          createdAt: story.createdAt,
          username: user?.username || "unknown",
          avatar: user?.image, 
          hasStory: true, // por defecto true si existe
        };
      })
    );

    return storiesWithUserData;
  },
});

