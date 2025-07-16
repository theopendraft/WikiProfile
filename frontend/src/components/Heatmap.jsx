import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function Heatmap({ contributions }) {
  if (!contributions?.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          🗓️ Edit Activity (Last 500)
        </h2>
        {/* Color reference legend */}
        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 italic">
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
      <div className="w-full  overflow-x-auto pb-2 ">
        <div className="min-w-[800px] max-w-full">
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
            tooltipDataAttrs={(value) =>
              value?.date
                ? { "data-tip": `${value.count} edits on ${value.date}` }
                : {}
            }
            showWeekdayLabels={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Heatmap;
//


// import React from "react";
// import CalendarHeatmap from "react-calendar-heatmap";
// import "react-calendar-heatmap/dist/styles.css";

// function Heatmap({ contributions }) {
//   if (!contributions?.length) return null;

//   return (
//     <div className="bg-white dark:bg-gray-200 p-4 rounded-lg shadow-sm">
//       <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
//         <h2 className="text-sm font-semibold mb-2 text-gray-600 float-left">
//           🗓️ Edit Activity (Last 500)
//         </h2>
//         {/* Color reference legend */}
//         <div className="flex items-center gap-2 text-xs text-gray-600 italic mt-0.5">
//           <span>Less</span>
//           <span className="w-3 h-3 rounded-sm border border-gray-400 bg-gray-200 inline-block color-empty"></span>
//           <span className="w-3 h-3 rounded-sm border border-gray-400 bg-lime-200 inline-block color-github-1"></span>
//           <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-300 inline-block color-github-2"></span>
//           <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-500 inline-block color-github-3"></span>
//           <span className="w-3 h-3 rounded-sm border border-gray-400 bg-green-700 inline-block color-github-4"></span>
//           <span>More</span>
//         </div>
//       </div>
//       {/* Responsive scroll for heatmap */}
//       <div className="w-full  overflow-x-auto pb-2 scrollbar-hide">
//         <div className="min-w-[600px] max-w-full">
//           <CalendarHeatmap
//             startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
//             endDate={new Date()}
//             values={contributions}
//             classForValue={(value) => {
//               if (!value) return "color-empty";
//               if (value.count >= 20) return "color-github-4";
//               if (value.count >= 10) return "color-github-3";
//               if (value.count >= 5) return "color-github-2";
//               if (value.count >= 1) return "color-github-1";
//               return "color-empty";
//             }}
//             tooltipDataAttrs={(value) =>
//               value.date
//                 ? { "data-tip": `${value.count} edits on ${value.date}` }
//                 : {}
//             }
//             showWeekdayLabels={true}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Heatmap;
