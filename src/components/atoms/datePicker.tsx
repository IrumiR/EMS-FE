import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerComponentProps {
  selected: Date | undefined;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  className?: string;
  placeholderText?: string;
  minDate?: Date;
  useMinDate?: boolean;
  disabled?: boolean
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selected,
  onChange,
  dateFormat = "MMMM d, yyyy",
  className,
  placeholderText = "Pick a date",
  minDate = new Date(),
  useMinDate = false,
  disabled = false,
}) => {
    return (
    <div>
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholderText}
        dateFormat={dateFormat}
        className={className}
        calendarClassName="custom-calendar"
        minDate={useMinDate ? minDate : undefined}
        disabled={disabled}
      />
    </div>
  );
};

export default DatePickerComponent;