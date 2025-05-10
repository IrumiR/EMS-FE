import { StepType } from "../types/addEventTypes";

interface ProgressStepsProps {
  activeStep: StepType;
}

export function ProgressSteps({ activeStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between w-full mb-6 gap-2">
      <div className="flex flex-col items-center">
        <div
          className={`h-1 w-28 rounded-full ${
            activeStep === "details" ? "bg-green-600" : "bg-gray-200"
          }`}
        />
        <span
          className={`text-xs mt-1 block text-center ${
            activeStep === "details"
              ? "text-green-600 font-medium"
              : "text-gray-500"
          }`}
        >
          Details
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className={`h-1 w-28 rounded-full ${
            activeStep === "date" ? "bg-green-600" : "bg-gray-200"
          }`}
        />
        <span
          className={`text-xs mt-1 block text-center ${
            activeStep === "date"
              ? "text-green-600 font-medium"
              : "text-gray-500"
          }`}
        >
          Date and location
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className={`h-1 w-28 rounded-full ${
            activeStep === "guests" ? "bg-green-600" : "bg-gray-200"
          }`}
        />
        <span
          className={`text-xs mt-1 block text-center ${
            activeStep === "guests"
              ? "text-green-600 font-medium"
              : "text-gray-500"
          }`}
        >
          Tasks and assignees
        </span>
      </div>
    </div>
  );
}