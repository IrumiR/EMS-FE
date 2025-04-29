import React, { useState } from "react";
import { Eye, EyeOff, X, TriangleAlert, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelStyles?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  validationError?: string;
  colour?: string;
  tooltip?: string; // Tooltip text prop
}

const InputField = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder,
      className,
      icon,
      iconPosition = "right",
      label,
      required,
      colour,
      validationError,
      tooltip, // Add tooltip to destructured props
      labelStyles = "mb-3 text-sm font-medium text-Primary_Color text-left",
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const isPasswordType = type === "password";
    const canClear =
      (type === "text" || type === "email") && inputValue.length > 0;
    const hasRightIcon = icon && iconPosition === "right";

    const effectiveType = isPasswordType
      ? showPassword
        ? "text"
        : "password"
      : type;

    const handleClear = () => {
      setInputValue("");
      if (props.onChange) {
        const event = {
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(event);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (props.onChange) {
        props.onChange(e);
      }
    };

    const getRightPadding = () => {
      let count = 0;
      if (isPasswordType || canClear) count++;
      if (hasRightIcon) count++;
      if (tooltip) count++; // Add extra padding for help icon
      return `${count * 32}px`;
    };

    return (
      <div className="w-full">
        {label && (
          <label className={labelStyles}>
            {label} {required && <span className="text-red-500">*</span>}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="inline-block ml-2 align-middle cursor-help">
                      <HelpCircle size={16} className="text-gray-400 hover:text-gray-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </label>
        )}
        <div className="relative w-full">
          {icon && iconPosition === "left" && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            type={effectiveType}
            placeholder={placeholder}
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            className={`w-full rounded border bg-[#FDFDFD] px-6 py-2 text-gray-600 placeholder:text-[#919191] 
              placeholder:font-normal focus:outline-none focus:ring-1 focus:border-transparent 
              ${
                validationError
                  ? "border-Error focus:ring-Error"
                  : "border-[#c4c4c5] focus:ring-[#c4c4c5]"
              } ${className}`}
            style={{
              borderRadius: "5px",
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: icon && iconPosition === "left" ? "36px" : "10px",
              paddingRight: getRightPadding(),
            }}
            {...props}
          />

          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 pr-3">
            {hasRightIcon && <div className="text-gray-400">{icon}</div>}
            {canClear && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={18} aria-label="Clear input" />
              </button>
            )}
            {isPasswordType && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <Eye size={20} aria-label="Hide password" />
                ) : (
                  <EyeOff size={20} aria-label="Show password" />
                )}
              </button>
            )}
          </div>
        </div>

        {validationError && (
          <div className="text-Error text-sm flex gap-2 justify-start items-center mt-1">
            <TriangleAlert fill="red" color="white" className="w-5 h-5" />
            {validationError}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;