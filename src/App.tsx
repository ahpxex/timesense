import { useEffect, useState } from "react";

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getSecondsInYear(year: number): number {
  return isLeapYear(year) ? 366 * 24 * 60 * 60 : 365 * 24 * 60 * 60;
}

function getElapsedSecondsThisYear(now: Date): number {
  const yearStart = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now.getTime() - yearStart.getTime()) / 1000);
}

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV !== "production";

export function App() {
  const [timeOffset, setTimeOffset] = useState(0);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  const adjustedTime = new Date(currentTime.getTime() + timeOffset);
  const year = adjustedTime.getFullYear();
  const totalSeconds = getSecondsInYear(year);
  const elapsedSeconds = getElapsedSecondsThisYear(adjustedTime);
  const progress = elapsedSeconds / totalSeconds;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTimeOffset((prev) => prev + (timeSpeed - 1) * 100);
    }, 100);
    return () => clearInterval(timer);
  }, [timeSpeed]);

  const formatElapsed = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  const percentComplete = (progress * 100).toFixed(6);

  const addDay = () => {
    setTimeOffset((prev) => prev + 24 * 60 * 60 * 1000);
  };

  const addMonth = () => {
    setTimeOffset((prev) => prev + 30 * 24 * 60 * 60 * 1000);
  };

  const resetTime = () => {
    setTimeOffset(0);
    setTimeSpeed(1);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-black">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-12 font-mono">
          <div className="space-y-2">
            <div className="text-9xl font-light tracking-wider">
              {percentComplete}%
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-widest">
              of {year}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl text-gray-700">
              {formatElapsed(elapsedSeconds)}
            </div>
            <div className="text-xs text-gray-400">
              {elapsedSeconds.toLocaleString()} / {totalSeconds.toLocaleString()} seconds
            </div>
          </div>
        </div>
      </div>

      {isDev && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg shadow-lg space-y-3 font-mono text-sm z-50">
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            Debug Controls
          </div>
          <div className="space-y-2">
            <button
              onClick={addDay}
              className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition cursor-pointer"
            >
              + 1 Day
            </button>
            <button
              onClick={addMonth}
              className="w-full px-3 py-2 bg-white/10 hover:bg-white/20 rounded transition cursor-pointer"
            >
              + 1 Month
            </button>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/20">
            <label className="block text-xs text-gray-400">
              Time Speed: {timeSpeed}x
            </label>
            <input
              type="range"
              min="1"
              max="1000"
              value={timeSpeed}
              onChange={(e) => setTimeSpeed(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
          </div>
          <button
            onClick={resetTime}
            className="w-full px-3 py-2 bg-red-600/80 hover:bg-red-600 rounded transition text-xs cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
