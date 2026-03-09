// components/ActivityHeatmap.js
"use client";

import { useMemo } from "react";
import { 
  format, 
  subDays, 
  subMonths, 
  startOfMonth, 
  getDaysInMonth, 
  getDay, 
  addDays,
  isAfter
} from "date-fns";
import { FaFire } from "react-icons/fa";

export default function ActivityHeatmap({ activeDates = [] }) {
  const activeSet = useMemo(() => new Set(activeDates), [activeDates]);
  const today = new Date();

  // 1. Generate the calendar blocks grouped by month
  const { monthsData, currentStreak } = useMemo(() => {
    const monthsArray = [];
    
    // Grab the last 12 months (including the current month)
    for (let i = 11; i >= 0; i--) {
      const targetMonth = subMonths(today, i);
      const monthStart = startOfMonth(targetMonth);
      const daysInMonth = getDaysInMonth(monthStart);
      const startDayOfWeek = getDay(monthStart); // 0 = Sunday, 1 = Monday, etc.

      const columns = [];
      let currentColumn = [];

      // A. Pad the beginning of the month with empty spaces
      for (let j = 0; j < startDayOfWeek; j++) {
        currentColumn.push(null);
      }

      // B. Fill in the actual days of the month
      for (let j = 0; j < daysInMonth; j++) {
        const currentDate = addDays(monthStart, j);
        
        currentColumn.push({
          date: currentDate,
          dateStr: format(currentDate, "yyyy-MM-dd"),
          isActive: activeSet.has(format(currentDate, "yyyy-MM-dd")),
          isFuture: isAfter(currentDate, today) // Dim out days in the future
        });

        // If the column hits 7 days (end of Saturday), push it and start a new one
        if (currentColumn.length === 7) {
          columns.push(currentColumn);
          currentColumn = [];
        }
      }

      // C. Pad the end of the month with empty spaces to complete the last column
      if (currentColumn.length > 0) {
        while (currentColumn.length < 7) {
          currentColumn.push(null);
        }
        columns.push(currentColumn);
      }

      monthsArray.push({
        name: format(monthStart, "MMM"), // e.g., "Mar", "Apr"
        columns: columns,
      });
    }

    // 2. Calculate Streak
    let streak = 0;
    const todayStr = format(today, "yyyy-MM-dd");
    const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");

    if (activeSet.has(todayStr) || activeSet.has(yesterdayStr)) {
      let checkDate = activeSet.has(todayStr) ? today : subDays(today, 1);
      while (true) {
        if (activeSet.has(format(checkDate, "yyyy-MM-dd"))) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }
    }

    return { monthsData: monthsArray, currentStreak: streak };
  }, [activeSet]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm overflow-hidden w-full">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Learning Consistency</p>
          <h4 className="text-zinc-900 dark:text-white font-medium mt-1">12 Months of Activity</h4>
        </div>
        <div className="text-right flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-lg border border-orange-100 dark:border-orange-500/20">
          <FaFire className={`text-xl ${currentStreak > 0 ? "text-orange-500" : "text-zinc-400"}`} />
          <div>
            <span className="text-2xl font-black text-orange-600 dark:text-orange-400 leading-none">
              {currentStreak}
            </span>
            <span className="text-sm text-orange-700/70 dark:text-orange-400/70 ml-1 font-medium">
              Day Streak
            </span>
          </div>
        </div>
      </div>

      {/* --- LEETCODE STYLE CALENDAR GRAPH --- */}
      <div className="w-full overflow-x-auto pb-4 pt-2 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
        <div className="min-w-max flex gap-3"> {/* gap-3 creates the space between months */}
          
          {monthsData.map((month, monthIdx) => (
            <div key={monthIdx} className="flex flex-col gap-2">
              
              {/* THE SQUARES FOR THIS MONTH */}
              <div className="flex gap-[3px]">
                {month.columns.map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-[3px]">
                    {col.map((day, dayIdx) => {
                      // Render an empty, transparent space if padding the month
                      if (!day) {
                        return <div key={dayIdx} className="w-[12px] h-[12px]" />;
                      }

                      return (
                        <div key={day.dateStr} className="relative group">
                          {/* The Square */}
                          <div
                            className={`w-[12px] h-[12px] rounded-[3px] transition-colors ${
                              day.isActive
                                ? "bg-green-500 dark:bg-[#39d353]"
                                : day.isFuture
                                ? "bg-transparent" // Hide future dates
                                : "bg-zinc-100 dark:bg-zinc-800/60"
                            }`}
                          />
                          
                          {/* Tooltip */}
                          {!day.isFuture && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-zinc-800 text-white text-[11px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                              {day.isActive ? "1 activity" : "No activity"} on {format(day.date, "MMM d, yyyy")}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* MONTH LABEL */}
              <div className="text-[11px] text-zinc-400 font-medium text-center w-full">
                {month.name}
              </div>

            </div>
          ))}

        </div>
      </div>
      
      {/* --- LEGEND --- */}
      <div className="flex items-center justify-end gap-1.5 mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">
        <span>Less</span>
        <div className="w-[12px] h-[12px] rounded-[3px] bg-zinc-100 dark:bg-zinc-800/60"></div>
        <div className="w-[12px] h-[12px] rounded-[3px] bg-green-200 dark:bg-[#0e4429]"></div>
        <div className="w-[12px] h-[12px] rounded-[3px] bg-green-500 dark:bg-[#39d353]"></div>
        <span>More</span>
      </div>

    </div>
  );
}