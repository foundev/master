import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer
]);
import { TimeSession } from '../types';

interface GoalProgressChartProps {
  sessions: TimeSession[];
  goalTitle: string;
  totalHours: number;
}

export const GoalProgressChart: React.FC<GoalProgressChartProps> = ({
  sessions,
  goalTitle,
  totalHours
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    const dailyData = processSessions(sessions);

    const option: echarts.EChartsOption = {
      title: {
        text: `Progress: ${goalTitle}`,
        left: 'center',
        textStyle: {
          fontSize: 16,
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const data = params[0];
          return `
            <div>
              <strong>${data.name}</strong><br/>
              Daily: ${data.value.toFixed(1)}h<br/>
              Cumulative: ${data.data.cumulative.toFixed(1)}h<br/>
              Progress: ${((data.data.cumulative / totalHours) * 100).toFixed(1)}%
            </div>
          `;
        }
      },
      xAxis: {
        type: 'category',
        data: dailyData.map(d => d.date),
        axisLabel: {
          formatter: (value: string) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'Hours',
          position: 'left',
          axisLabel: {
            formatter: '{value}h'
          }
        },
        {
          type: 'value',
          name: 'Progress %',
          position: 'right',
          max: 100,
          axisLabel: {
            formatter: '{value}%'
          }
        }
      ],
      series: [
        {
          name: 'Daily Hours',
          type: 'bar',
          data: dailyData.map(d => ({
            value: d.hours,
            cumulative: d.cumulative
          })),
          itemStyle: {
            color: '#3b82f6'
          }
        },
        {
          name: 'Cumulative Progress',
          type: 'line',
          yAxisIndex: 1,
          data: dailyData.map(d => ((d.cumulative / totalHours) * 100).toFixed(1)),
          itemStyle: {
            color: '#10b981'
          },
          lineStyle: {
            width: 3
          },
          symbol: 'circle',
          symbolSize: 6
        }
      ],
      grid: {
        right: '20%'
      },
      legend: {
        data: ['Daily Hours', 'Cumulative Progress'],
        bottom: 10
      }
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sessions, goalTitle, totalHours]);

  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  if (sessions.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No time tracking data available yet. Start tracking time to see your progress!</p>
      </div>
    );
  }

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

function processSessions(sessions: TimeSession[]) {
  const dailyTotals = new Map<string, number>();

  sessions.forEach(session => {
    const date = new Date(session.startTime).toDateString();
    const hours = session.duration / (1000 * 60 * 60);
    dailyTotals.set(date, (dailyTotals.get(date) || 0) + hours);
  });

  const sortedDates = Array.from(dailyTotals.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  let cumulative = 0;
  return sortedDates.map(date => {
    const hours = dailyTotals.get(date) || 0;
    cumulative += hours;
    return {
      date,
      hours,
      cumulative
    };
  });
}