import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function Heatmap({ contributions }) {
  if (!contributions?.length) return null;

  // Tooltip state
  const [tooltip, setTooltip] = React.useState({ visible: false, x: 0, y: 0, text: "" });

  // Handler for showing tooltip
  const handleMouseOver = (event, value) => {
    if (!value || !value.date) return;
    const rect = event.target.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2 + window.scrollX,
      y: rect.top - 8 + window.scrollY,
      text: `${value.count} edit${value.count !== 1 ? "s" : ""} on ${value.date}`,
    });
  };
  const handleMouseOut = () => setTooltip({ ...tooltip, visible: false });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl  mt-6 relative">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </span>
          <h2 className="text-base font-bold text-gray-700 dark:text-gray-100 tracking-tight">Edit Activity <span className="font-normal text-xs">(Last 500)</span></h2>
        </div>
        {/* Color reference legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 italic flex-wrap">
          <span>Less</span>
          <span className="w-3 h-3 rounded-sm border border-gray-400 bg-gray-200 dark:bg-gray-600"></span>
          <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-200 dark:bg-green-700"></span>
          <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-400 dark:bg-green-600"></span>
          <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-600 dark:bg-green-500"></span>
          <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-800 dark:bg-green-400"></span>
          <span>More</span>
        </div>
      </div>
      {/* Responsive scroll for heatmap */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="min-w-[700px] max-w-full">
          <CalendarHeatmap
            startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
            endDate={new Date()}
            values={contributions}
            classForValue={(value) => {
              if (!value) return "fill-gray-200 dark:fill-gray-600";
              if (value.count >= 20) return "fill-green-800 dark:fill-green-400";
              if (value.count >= 10) return "fill-green-600 dark:fill-green-500";
              if (value.count >= 5) return "fill-green-400 dark:fill-green-600";
              if (value.count >= 1) return "fill-green-200 dark:fill-green-700";
              return "fill-gray-200 dark:fill-gray-600";
            }}
            showWeekdayLabels={true}
            onMouseOver={(e, value) => handleMouseOver(e, value)}
            onMouseLeave={handleMouseOut}
          />
        </div>
      </div>
      {/* Custom Tooltip */}
      {tooltip.visible && (
        <div
          className="pointer-events-none z-50 fixed px-3 py-1 rounded bg-gray-900 text-white text-xs shadow-lg border border-gray-700"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -310px)' }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}

export default Heatmap;
