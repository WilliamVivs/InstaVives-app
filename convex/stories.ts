import { v } from "convex/values";
import { mutation } from "./_generated/server";
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
