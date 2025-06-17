import  { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useGetMonthlyEventCounts } from "@/api/dashboardApi";

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function EventCountByMonth() {
  const chartRef = useRef(null);
  const { data: responseData } = useGetMonthlyEventCounts();
  const counts = responseData?.data || [];

  useEffect(() => {
    if (!chartRef.current || !counts.length) return;

    const chartInstance = echarts.init(chartRef.current);

    // Format data for all 12 months
    const monthCounts = Array(12).fill(0);
   
counts.forEach(({ month, count }) => {
  monthCounts[month - 1] = count;
});

    const option = {
      title: {
        text: "Monthly Event Count - 2025",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: MONTH_LABELS,
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
        name: "Events",
      },
      series: [
        {
          name: "Events",
          type: "bar",
          data: monthCounts,
          barWidth: "50%",
          itemStyle: {
            color: "#23f75b",
          },
        },
      ],
    };

    chartInstance.setOption(option);

    // Cleanup
    return () => {
      chartInstance.dispose();
    };
  }, [chartRef, counts]);

  
  return (
    <div className="w-full h-96 border bg-white rounded-lg pt-4">
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default EventCountByMonth;
