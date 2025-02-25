import * as React from "react";

export const Card = ({ children,className='bg-white' }: { children: React.ReactNode,className?:string }) => (
  <div className={` shadow-lg rounded-xl p-4 border ${className}`}>{children}</div>
);

export const CardHeader = ({ children ,className}: { children: React.ReactNode,className?:string  }) => (
  <div className={`border-b p-4 text-lg font-semibold ${className}`}>{children}</div>
);

export const CardTitle = ({ children,className }: { children: React.ReactNode,className?:string }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

export const CardContent = ({ children,className }: { children: React.ReactNode,className?:string  }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
