'use client'
import React, { ReactNode } from "react";

interface InputWithIconProps {
  Icon: ReactNode; 
  input: string;
  setInput: (value: string) => void;
  placeholder?: string;
  type?: string;
  name:string;
}

const InputWithIcon= ({ 
  Icon, 
  input, 
  setInput, 
  placeholder = "Enter text...", 
  type = "text" ,
  name
}:InputWithIconProps) => {
  return (
    <div className="flex items-center rounded-md space-x-2 border-2 border-sky-500">
      {/* Normal Component as Icon */}
      <label className="flex justify-center items-center w-8 pl-1 cursor-pointer" htmlFor={name}>{Icon}</label>

      {/* Input Field */}
      <input
        id={name}
        name={name}
        type={type}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="outline-none flex-1 bg-transparent p-2"
      />
    </div>
  );
};

export default InputWithIcon;
