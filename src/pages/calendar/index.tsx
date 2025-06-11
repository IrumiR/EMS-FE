
function CalendarScreen() {
  // Days of the week
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Calendar grid data (5 weeks x 7 days)
  const calendarDates = [
    [30, 31, '01', '02', '03', '04', '05'],
    ['06', '07', '08', '09', '10', '11', '12'],
    ['13', '14', '15', '16', '17', '18', '19'],
    ['20', '21', '22', '23', '24', '25', '26'],
    ['27', '28', '29', '30', '31', '01', '02']
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="mt-2 text-gray-600">
            View and manage your events here.
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Row - Days of Week */}
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {daysOfWeek.map((day, index) => (
            <div 
              key={index}
              className="p-3 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="grid grid-cols-7">
          {calendarDates.map((week, weekIndex) => 
            week.map((date, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="border-r border-b border-gray-200 last:border-r-0 bg-white hover:bg-gray-50 transition-colors duration-150 min-h-24 sm:min-h-32 md:min-h-40"
              >
                <div className="p-2 h-full">
                  {/* Date Number */}
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {date}
                  </div>
                  
                  {/* Event Space - This is where events would be displayed */}
                  <div className="space-y-1">
                    {/* Empty space for events */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Responsive Note */}
      <div className="mt-4 text-xs text-gray-500 text-center sm:hidden">
        Tap dates to view details
      </div>
    </div>
  );
}

export default CalendarScreen;