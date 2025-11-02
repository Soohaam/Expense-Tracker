import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyHeatmap } from "../store/transactionSlice";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

const SpendingHeatmap = () => {
  const dispatch = useDispatch();
  const { heatmapData, loading } = useSelector((state) => state.transactions);

  // Initialize with current month
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12

  // Fetch data when month/year changes
  useEffect(() => {
    dispatch(fetchMonthlyHeatmap({ year: selectedYear, month: selectedMonth }));
  }, [selectedYear, selectedMonth, dispatch]);

  // Navigate months
  const goToPreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth() + 1);
  };

  // Get color based on spending intensity
  const getColor = (amount, maxSpending) => {
    if (amount === 0) return "bg-slate-800/50 border border-slate-700/30";
    const intensity = (amount / maxSpending) * 100;
    if (intensity < 25) return "bg-emerald-900/60 border border-emerald-700/40";
    if (intensity < 50) return "bg-emerald-600/70 border border-emerald-500/50";
    if (intensity < 75) return "bg-orange-600/70 border border-orange-500/50";
    return "bg-red-600/80 border border-red-500/60";
  };

  // Get month name
  const getMonthName = (month) => {
    return new Date(selectedYear, month - 1).toLocaleDateString("en-US", {
      month: "long",
    });
  };

  // Loading state
  if (loading && !heatmapData) {
    return (
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Monthly Spending Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxSpending = heatmapData?.stats?.maxSpending || 1;

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Monthly Spending Heatmap
          </CardTitle>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0 border-emerald-500/30 bg-gray-800/60 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentMonth}
              className="border-emerald-500/30 bg-gray-800/60 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 text-sm px-3"
            >
              Today
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="h-8 w-8 p-0 border-emerald-500/30 bg-gray-800/60 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-sm text-slate-400 mt-2">
          {getMonthName(selectedMonth)} {selectedYear}
        </p>
      </CardHeader>

      <CardContent>
        {heatmapData && heatmapData.heatmapData && heatmapData.heatmapData.length > 0 ? (
          <>
            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Week day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-slate-400 pb-1"
                >
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({
                length: new Date(selectedYear, selectedMonth - 1, 1).getDay(),
              }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}

              {/* Days of the month */}
              {heatmapData.heatmapData.map((day, index) => {
                // FIX: Parse date correctly to avoid timezone issues
                // Create date from the ISO string but treat it as local time
                const dateStr = typeof day.date === 'string' ? day.date : new Date(day.date).toISOString();
                const [year, month, dayNum] = dateStr.split('T')[0].split('-');
                const localDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(dayNum));
                
                return (
                  <div
                    key={index}
                    className={`aspect-square rounded ${getColor(
                      day.total,
                      maxSpending
                    )} cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all group relative`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg border border-emerald-500/30">
                      <div className="font-semibold text-slate-100">
                        {localDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-emerald-400 font-bold">
                        ₹{day.total.toLocaleString("en-IN")}
                      </div>
                      {day.count > 0 && (
                        <div className="text-slate-300 text-[10px]">
                          {day.count} transaction{day.count !== 1 ? "s" : ""}
                        </div>
                      )}
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                        <div className="border-4 border-transparent border-t-slate-800"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-6 text-xs text-slate-400">
              <span className="font-medium">Less</span>
              <div className="flex gap-1.5">
                <div className="w-5 h-5 bg-slate-800/50 rounded border border-slate-700/30"></div>
                <div className="w-5 h-5 bg-emerald-900/60 rounded border border-emerald-700/40"></div>
                <div className="w-5 h-5 bg-emerald-600/70 rounded border border-emerald-500/50"></div>
                <div className="w-5 h-5 bg-orange-600/70 rounded border border-orange-500/50"></div>
                <div className="w-5 h-5 bg-red-600/80 rounded border border-red-500/60"></div>
              </div>
              <span className="font-medium">More</span>
            </div>

            {/* Statistics */}
            <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  {heatmapData.stats.activeDays}
                </p>
                <p className="text-xs text-slate-400">Active Days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  ₹{heatmapData.stats.avgDaily.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-400">Avg Daily</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">
                  ₹{heatmapData.stats.maxSpending.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-slate-400">Highest Day</p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">
            No spending data for this month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingHeatmap;