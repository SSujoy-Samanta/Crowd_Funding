"use client"

// Modified CommentSection.jsx with TimeAgo implementation
import React, { useState, useEffect, FormEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { TimeAgo } from './TimeAgo';
import { BiSolidDonateHeart } from 'react-icons/bi';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { useSetRecoilState } from 'recoil';
import { notificationState } from '@/lib/atom';

// Mock backend API functions (now with proper timestamps)
const fetchComments = async ()=> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This would be your actual API endpoint
  // Note: Now storing ISO dates instead of text timestamps
  return [
    { 
      id: 1, 
      author: "Alex Chen", 
      content: "This is exactly what I needed. Thank you!", 
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago 
      avatar: "/api/placeholder/40/40" 
    },
    { 
      id: 2, 
      author: "Taylor Swift", 
      content: "I've been looking for something like this for ages!", 
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago 
      avatar: "/api/placeholder/40/40" 
    },
    { 
      id: 3, 
      author: "Jordan Williams", 
      content: "Great work! Can you add dark mode support?", 
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago 
      avatar: "/api/placeholder/40/40" 
    }
  ];
};
interface Comments{
    wallet:string,
    comment:string,
    timestamp:Date
}
interface CommentSectionProps{
    id:number,
    comments:Comments[]

}

const CommentSection = ({id,comments}:CommentSectionProps) => {

    const [Allcomments, setComments] = useState<Comments[]>(comments);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {address,isConnected}=useAccount();
    const setNotification=useSetRecoilState(notificationState);


    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if(!isConnected || !address){
            setNotification({msg:"Please connect your wallet."})
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post('/api/campaign/comment',{
                id,
                walletAddress:address,
                comment:newComment
            })
            if(res.status==200 ){
                setComments(prevComments => [
                    { comment: newComment, wallet: address, timestamp: new Date() }, 
                    ...prevComments
                ]);
                
                setNewComment("");
            }
            
        } catch (e:any) {
            if (e.response?.data?.errors) {
                setNotification({ msg: e.response?.data?.errors[0]?.message, type: "error" });
            } else {
                setNotification({ msg: e.response?.data?.msg, type: "error" });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full  mx-auto overflow-hidden transition-colors">
            <div className="p-6 max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Comments</h2>
                </div>
                 {/* Comment form */}
                 <form onSubmit={handleSubmit} className="my-6">
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={isSubmitting}
                        />
                        </div>
                        <button
                        type="submit"
                        disabled={isSubmitting || !newComment.trim()}
                        className={`p-3 rounded-full ${isSubmitting || !newComment.trim() ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500'} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Send className="h-5 w-5" />
                        )}
                        </button>
                    </div>
                </form>
                
                {/* Comments list with loading state */}
                <div className="space-y-4 mb-6">
                { Allcomments.length > 0 ? (
                    Allcomments.map((comment:Comments, index:number) => (
                    <div 
                        key={index} 
                        className="flex gap-4 p-4 animate-fadeIn transition-colors"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <div className="p-2 rounded-full bg-slate-200 flex justify-center items-center w-12 h-12">
                            <BiSolidDonateHeart size={20} className="text-black"/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{comment.wallet.slice(0, 5)+"..."+comment.wallet.slice(-5)}</h3>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                <TimeAgo timestamp={comment.timestamp} />
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.comment}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-6">No comments yet. Be the first to comment!</p>
                )}
                </div>
                
               
            </div>
        </div>
    );
};

export default CommentSection;