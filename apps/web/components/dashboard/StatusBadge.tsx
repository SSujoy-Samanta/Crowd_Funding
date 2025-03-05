import { Check, Clock, Vote } from "lucide-react";

export const StatusBadge = ({ status, type }:{
    status:string,
    type:string
}) => {
    let color, label, icon;
    
    if (type === 'voting') {
      switch(status) {
        case 'active':
          color = 'from-green-500 to-emerald-600';
          label = 'Voting Active';
          icon = <Vote size={14} />;
          break;
        case 'pending':
          color = 'from-yellow-400 to-amber-500';
          label = 'Voting Pending';
          icon = <Clock size={14} />;
          break;
        case 'completed':
          color = 'from-blue-400 to-indigo-600';
          label = 'Voting Complete';
          icon = <Check size={14} />;
          break;
        default:
          color = 'from-gray-400 to-gray-500';
          label = 'Unknown';
          icon = null;
      }
    } else {
      switch(status) {
        case 'active':
          color = 'from-green-500 to-emerald-600';
          label = 'Active';
          break;
        case 'completed':
          color = 'from-blue-400 to-indigo-600';
          label = 'Completed';
          break;
        case 'pending':
          color = 'from-green-500 to-emerald-600';
          label = 'Active';
          break;
        case 'success':
          color = 'from-blue-400 to-indigo-600';
          label = 'Completed';
          break;
        case 'failed':
          color = 'from-blue-400 to-indigo-600';
          label = 'Completed';
          break;
        default:
          color = 'from-gray-400 to-gray-500';
          label = 'Draft';
      }
    }
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${color} shadow-sm`}>
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </span>
    );
};