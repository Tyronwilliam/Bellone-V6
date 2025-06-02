import React, { JSX } from "react";
import Spinner from "./SpinnerGeneric";

type ButtonProps = {
  onClick: () => void;
  label: string;
  type?: "primary" | "secondary" | "danger" | "link";
  isLoading?: boolean;
  disabled?: boolean;
  icon?: JSX.Element;
  fullWidth?: boolean;
  className?: string;
};

const Button = ({
  onClick,
  label,
  type = "primary",
  isLoading = false,
  disabled = false,
  icon,
  fullWidth = false,
  className = "",
}: ButtonProps) => {
  const buttonClass = `
    ${fullWidth ? "w-full" : "w-auto"}
    py-2 px-4 rounded-md 
    font-semibold transition duration-300 
    flex items-center justify-center
    space-x-2 cursor-pointer  border-[1px] border-black
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${type === "primary" ? "bg-primary text-black hover:bg-purple-700" : ""}
    ${type === "secondary" ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : ""}
    ${type === "danger" ? "bg-red-600 text-red hover:bg-red-700" : ""}
    ${type === "link" ? "bg-transparent text-blue-600 hover:underline" : ""}
    ${className}
  `;

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Spinner />
          <span>{label}</span>
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default Button;
