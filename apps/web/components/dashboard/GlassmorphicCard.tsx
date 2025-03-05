export const GlassmorphicCard = ({ children, glowColor, className = "" }:{
    children:React.ReactNode,
    glowColor:string,
    className?:string
}) => {
    return (
      <div className={`relative backdrop-blur-md bg-white bg-opacity-10 rounded-xl shadow-xl p-6 border border-white border-opacity-20 overflow-hidden ${className}`}>
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full ${glowColor} blur-3xl opacity-30`}></div>
        {children}
      </div>
    );
};