import React from 'react';
import { Clock, Cloud, DollarSign, Sparkles, FileText, Calendar, MapPin, Bell, ChevronRight, Menu } from 'lucide-react';

export default function CrewDashboard() {
  return (
    <div className="">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            ET
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">WELCOME BACK, EMMA THOMPSON</h1>
            <p className="text-sm text-gray-500">CREW PORTAL • DASHBOARD</p>
          </div>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Next Call */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">NEXT CALL</p>
            <p className="text-2xl font-bold text-gray-900">05:45 AM</p>
            <p className="text-xs text-gray-600">Pinewood • Stage 7</p>
            <Clock className="w-5 h-5 text-purple-600 mt-2" />
          </div>

          {/* Set Wrap */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">SET WRAP</p>
            <p className="text-2xl font-bold text-gray-900">19:00 PM</p>
            <p className="text-xs text-gray-600">14h • 15 OT likely</p>
            <Clock className="w-5 h-5 text-blue-600 mt-2" />
          </div>

          {/* Weather */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">WEATHER</p>
            <p className="text-2xl font-bold text-gray-900">14°C</p>
            <p className="text-xs text-gray-600">Rain likely at 14:00</p>
            <Cloud className="w-5 h-5 text-blue-400 mt-2" />
          </div>

          {/* Next Pay Date */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">NEXT PAY DATE</p>
            <p className="text-2xl font-bold text-gray-900">Nov 30</p>
            <p className="text-xs text-gray-600">£2,450 (Nov 2024-43)</p>
            <DollarSign className="w-5 h-5 text-green-600 mt-2" />
          </div>
        </div>

        {/* AI Set Assistant */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Set Assistant</h3>
                <p className="text-xs text-gray-500">Analysis of Call Sheet F44 • Updated 1m ago</p>
              </div>
            </div>
            <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">BETA</span>
          </div>
          
          <p className="text-sm text-gray-700 mb-4">
            Good morning, Emma. You have a <span className="font-semibold">5:45 Call</span> at Pinewood (Stage 7). Heavy rain is expected during Scene 42B (Ext. Forest), so the unit might move to Cover Set (Stage 4) after lunch.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600">🚗</span>
                <p className="text-xs font-semibold text-gray-900">Traffic Alert</p>
              </div>
              <p className="text-xs text-gray-700">M25 is clear. Leave by 04:30 to arrive 15m early.</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-blue-600">🎬</span>
                <p className="text-xs font-semibold text-gray-900">Kit Suggestion</p>
              </div>
              <p className="text-xs text-gray-700">Four FX scheduled. Pack rain covers & towels.</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange-600">💰</span>
                <p className="text-xs font-semibold text-gray-900">Est. Earnings</p>
              </div>
              <p className="text-xs text-gray-700">Wrap at 19:00 = 8h OT. Total est. £415.50</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-md hover:bg-purple-100">
              <FileText className="w-3 h-3" />
              Ask about Scene 42...
            </button>
            <button className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-md hover:bg-purple-100">
              <Sparkles className="w-3 h-3" />
              Summarize Risk Assessment
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Active Productions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Productions */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Active Productions</h2>
                <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-purple-700">
                  VIEW SCHEDULE
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* AVATAR 3 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">AVATAR 3</h3>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">SHOOTING</span>
                      </div>
                      <p className="text-sm text-gray-600">Camera Operator - Unit A</p>
                      <p className="text-xs text-gray-500">Camera Dept</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">SHOOT DAY</p>
                    <p className="text-2xl font-bold text-gray-900">42 <span className="text-sm text-gray-500">/ 110</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '50%'}}></div>
                    </div>
                    <p className="text-xs text-right text-gray-500 mt-1">50% Complete</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded">NEXT CALL</span>
                      <span className="text-xs text-gray-500">Tomorrow, Nov 24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">05:45 AM</span>
                        <span className="text-sm text-gray-600">☀️ Rain 14°C</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded hover:bg-gray-50">
                          🗺️ Map
                        </button>
                        <button className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded hover:bg-gray-800">
                          📞 Call Sheet
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Pinewood Studios - Stage 7
                    </p>
                  </div>
                </div>

                {/* THE CROWN - SEASON 7 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900">THE CROWN - SEASON 7</h3>
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded">PREP</span>
                      </div>
                      <p className="text-sm text-gray-600">Steadicam Operator</p>
                      <p className="text-xs text-gray-500">Camera Dept</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">SHOOT DAY</p>
                    <p className="text-2xl font-bold text-gray-900">15 <span className="text-sm text-gray-500">/ 60</span></p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <p className="text-xs text-right text-gray-500 mt-1">25% Complete</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded">NEXT CALL</span>
                      <span className="text-xs text-gray-500">Monday, Nov 25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-bold text-gray-900">08:00 AM</span>
                        <span className="text-sm text-gray-600">☁️ Cloudy 12°C</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1 rounded hover:bg-gray-50">
                          🗺️ Map
                        </button>
                        <button className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded hover:bg-gray-800">
                          📞 Call Sheet
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Elstree Studios - Lot B
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tools */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Quick Tools</h2>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <button className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 text-center">
                  <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">Log Timesheet</p>
                </button>
                <button className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 text-center relative">
                  <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">AI Receipt Scan</p>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full"></span>
                </button>
                <button className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 text-center relative">
                  <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">Smart Kit Check</p>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full"></span>
                </button>
                <button className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 text-center">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-900">Availability</p>
                </button>
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Documents</h2>
                <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-purple-700">
                  VIEW ALL
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Call Sheet - Day 43</p>
                      <p className="text-xs text-gray-500">Tuesday 3 • 2024 11:23</p>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">NEW</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Safety Report - Week 6</p>
                      <p className="text-xs text-gray-500">Fri 30/Nov/7 2024 17:32</p>
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">SIGNED</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Updated Schedule - Act 3</p>
                      <p className="text-xs text-gray-500">Wed Fri 3 • 2024 01:30</p>
                    </div>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded">REVIEWED</span>
                </div>
              </div>
            </div>

            {/* Open Opportunities */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Open Opportunities</h2>
                <button className="text-gray-600 text-xs font-semibold hover:text-gray-900">VIEW ALL</button>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">Lighting Tech - Daily</h3>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">URGENT</span>
                    </div>
                    <p className="text-xs text-gray-600">Commercial Shoot • Studio 4 • 15/12/2024</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">£250/day <span className="text-xs text-gray-500">• OT • Kit</span></p>
                  </div>
                  <button className="bg-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-purple-700 whitespace-nowrap">
                    APPLY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Crew Feed */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Crew Feed</h2>
                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">Live</span>
              </div>

              <div className="bg-gray-900 text-white p-3 flex items-center justify-between">
                <span className="text-xs font-semibold">📢 PRODUCTION UPDATES</span>
              </div>

              <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm text-gray-900">WRAP called for Unit A. Thanks everyone!</p>
                    <p className="text-xs text-gray-500">1st AD • 10 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm text-gray-900">Prelim Call Sheet for Day 44 is available for review.</p>
                    <p className="text-xs text-gray-500">PRODUCTION OFFICE2 • 1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm text-gray-900">Turnover delayed 30 mins due to weather. Hold in trailers.</p>
                    <p className="text-xs text-gray-500">2ND AD • 3 hours ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* My Schedule */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">My Schedule</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">WED</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">AVATAR 3 - Shoot Day 44</p>
                    <p className="text-xs text-gray-600">05:45 - 19:00</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">THU</p>
                    <p className="text-2xl font-bold text-gray-900">25</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">AVATAR 3 - Shoot Day 45</p>
                    <p className="text-xs text-gray-600">06:00 - 19:00</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">FRI</p>
                    <p className="text-2xl font-bold text-gray-900">26</p>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">THE CROWN - Camera Prep</p>
                    <p className="text-xs text-gray-600">08:00 - 17:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Payments</h2>
              </div>
              <div className="bg-gray-900 text-white p-4 rounded-b-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">💰 EARNINGS</span>
                  <span className="text-xs text-gray-400"></span>
                </div>
                <p className="text-3xl font-bold mb-4">£2,450.00</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Week 42 (Avatar 3)</span>
                    <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-2 py-0.5 rounded">Invoiced</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">Week 41 (The Crown)</span>
                    <span className="bg-green-500 text-green-900 text-xs font-semibold px-2 py-0.5 rounded">Paid</span>
                  </div>
                </div>
                <button className="w-full bg-white text-gray-900 text-sm font-semibold py-2 rounded-md hover:bg-gray-100">
                  VIEW TIMESHEETS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}