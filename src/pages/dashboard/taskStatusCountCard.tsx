import { useEffect, useRef } from "react";
import * as echarts from "echarts";
import { useGetTaskStatusCount } from "@/api/dashboardApi";

function TaskStatusCount() {
  const chartRef = useRef(null);
  const { data, isLoading, error } = useGetTaskStatusCount();

  useEffect(() => {
    if (!chartRef.current || !data?.data?.length) return;

    const chartInstance = echarts.init(chartRef.current);

    const option = {
      title: {
        text: "Task Status Counts",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "Events",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          color: ["#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ef4444"], // 🎨 Different from user role chart
          data: data.data.map(({ status, count }) => ({
            value: count,
            name: status,
          })),
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, [data]);

  if (isLoading) return <div>Loading chart...</div>;
  if (error) return <div>Error loading event status data</div>;

  return (
    <div className="w-full h-96 border bg-white rounded-lg pt-4">
      <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default TaskStatusCount;
