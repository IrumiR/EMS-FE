import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerComponentProps {
  selected: Date | undefined;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  className?: string;
  placeholderText?: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selected,
  onChange,
  dateFormat = "MMMM d, yyyy",
  className,
  placeholderText = "Pick a date",
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
      />
    </div>
  );
};

export default DatePickerComponent;