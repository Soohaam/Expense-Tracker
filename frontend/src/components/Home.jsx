"use client"
import { useNavigate } from "react-router-dom"
import Chatbot from "./Chatbot"

export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 relative overflow-hidden">
      <Chatbot />
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Hero section */}
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Track Every Rupee,
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Master Your Money
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Take control of your finances with simple, powerful expense tracking
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10">Start Tracking Now</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
            </button>
          </div>

          {/* Floating expense cards */}
          <div className="relative mt-16 h-64 md:h-80">
            {/* Card 1 */}
            <div className="absolute top-0 left-1/4 transform -translate-x-1/2 animate-float">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl w-64">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 text-sm">Groceries</span>
                  <span className="text-red-400 text-sm font-medium">Expense</span>
                </div>
                <div className="text-3xl font-bold text-white">₹2,450</div>
                <div className="text-slate-400 text-xs mt-2">Today, 2:30 PM</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="absolute top-12 right-1/4 transform translate-x-1/2 animate-float-delayed">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl w-64">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 text-sm">Salary</span>
                  <span className="text-emerald-400 text-sm font-medium">Income</span>
                </div>
                <div className="text-3xl font-bold text-white">₹45,000</div>
                <div className="text-slate-400 text-xs mt-2">Yesterday, 9:00 AM</div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-float-slow">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl w-64">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-slate-300 text-sm">Electricity Bill</span>
                  <span className="text-red-400 text-sm font-medium">Expense</span>
                </div>
                <div className="text-3xl font-bold text-white">₹1,850</div>
                <div className="text-slate-400 text-xs mt-2">2 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  )
}
