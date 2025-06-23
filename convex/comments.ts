import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
  args: { 
    content: v.string(),
    postId: v.id("posts") },

  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);

    const post = await ctx.db.get(args.postId);
    if (!post) throw new Error("Post not found");


    const commentId = await ctx.db.insert("comments",{
        userId: currentUser._id,
        postId: post._id,
        content: args.content,
    });

    await ctx.db.patch(args.postId, {comments: post.comments + 1});


    if (post.userId !== currentUser._id ){
        await ctx.db.insert("notifications",{
            postId: args.postId,
            commentId,
            type: "comment",
            receiverId: post.userId,
            senderId: currentUser._id
        })
    };
    return commentId;
  },
});

export const getComments = query({
    args:{
        postId: v.id("posts")
    },
    handler: async (ctx, args) => {
        const comments = await ctx.db.query("comments")
        .withIndex("by_post",q => q.eq("postId",args.postId))
        .collect()

        const commentsWithInfo = await Promise.all(
        comments.map(async (comment) => {
            const user = await ctx.db.get(comment.userId);
            return {
            ...comment,
            user: {
                fullname: user!.fullname,
                image: user!.image,
            },
            };
        })
        );

        return commentsWithInfo;
    }
    
})

export const deleteComments = mutation({
  args: { commentId: v.id("comments") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) throw new Error("Not authenticated");

    const comment = await ctx.db.get(args.commentId);
    if (!comment) throw new Error("Comment not found");

    // Post where the comment is posted
    const post = await ctx.db.get(comment.postId);
    if (!post) throw new Error("Post not found");

    // user of the post or user of the message posted
    const isAuthor = currentUser._id.toString() === comment.userId.toString();
    const isPostOwner = currentUser._id.toString() === post.userId.toString();

    if (!isAuthor && !isPostOwner) {
      throw new Error("Not authorized to delete this comment");
    }

    // delete comment
    await ctx.db.delete(args.commentId);

    // decreae comments of the post
    await ctx.db.patch(post._id, {
      comments: Math.max(0, (post.comments || 1) - 1),
    });
  },
});