import { motion } from "framer-motion";
import { FaFacebook, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import {  FaXTwitter } from "react-icons/fa6";
export const SocialMedia=({text}:{text:string})=>{
    const shareCampaign = (platform: string) => {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(text);
        const links: Record<string, string> = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            whatsapp: `https://api.whatsapp.com/send?text=${title}+${url}`,
            x: `https://x.com/intent/tweet?url=${url}&text=${title}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        };
        window.open(links[platform], "_blank");
    };
    return <div className="flex justify-around mt-6 text-4xl">
    <motion.div whileHover={{ scale: 1.2 }}>
        <FaFacebook className="cursor-pointer text-blue-600" onClick={() => shareCampaign("facebook")} />
    </motion.div> 
    <motion.div whileHover={{ scale: 1.2 }}>
        <FaWhatsapp className="cursor-pointer text-green-500" onClick={() => shareCampaign("whatsapp")} />
    </motion.div>
    <motion.div whileHover={{ scale: 1.2 }}>
        <FaXTwitter className="cursor-pointer text-black" onClick={() => shareCampaign("x")} />
    </motion.div>
    <motion.div whileHover={{ scale: 1.2 }}>
        <FaLinkedinIn className="cursor-pointer text-sky-700" onClick={() => shareCampaign("linkedin")} />
    </motion.div>
</div>
}