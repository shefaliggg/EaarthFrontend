import React, { useState } from 'react';
import { Clock, Cloud, DollarSign, Sparkles, FileText, Calendar, MapPin } from 'lucide-react';
import { PageHeader } from '../../../shared/components/PageHeader';
import PrimaryStats from '../../../shared/components/wrappers/PrimaryStats';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

export default function CrewDashboard() {
  const stats = [
    {
      label: 'NEXT CALL',
      value: '05:45 AM',
      subLabel: 'Pinewood • Stage 7',
      icon: 'Clock',
      iconColor: 'text-purple-600 dark:text-lavender-400',
      iconBg: 'bg-purple-100 dark:bg-lavender-900/30',
    },
    {
      label: 'EST. WRAP',
      value: '19:00 PM',
      subLabel: '12h + 1h OT likely',
      icon: 'Clock',
      iconColor: 'text-blue-600 dark:text-sky-400',
      iconBg: 'bg-blue-100 dark:bg-sky-900/30',
    },
    {
      label: 'WEATHER',
      value: '14°C',
      subLabel: 'Rain likely at 14:00',
      icon: 'Cloud',
      iconColor: 'text-blue-400 dark:text-sky-300',
      iconBg: 'bg-blue-50 dark:bg-sky-900/20',
    },
    {
      label: 'NEXT PAY DATE',
      value: 'Nov 30',
      subLabel: '£2,450 (Nov 2024-42)',
      icon: 'DollarSign',
      iconColor: 'text-green-600 dark:text-mint-400',
      iconBg: 'bg-green-100 dark:bg-mint-900/30',
    },
  ];

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Welcome Header */}
        <PageHeader
          title="WELCOME BACK, EMMA THOMPSON"
          subtitle="CREW PORTAL • DASHBOARD"
          initials="ET"
        />

        {/* Info Cards Row */}
        <PrimaryStats stats={stats} gridColumns={4} useSecondaryCard={true} />

        {/* AI Set Assistant */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-purple-600 dark:bg-lavender-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Set Assistant</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Analysis of Call Sheet F44 • Updated 5m ago</p>
                </div>
              </div>
              <span className="bg-purple-100 dark:bg-lavender-900/30 text-purple-700 dark:text-lavender-300 text-xs font-semibold px-2 py-0.5 rounded">BETA</span>
            </div>
            
            <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
              Good morning, Emma. You have a <span className="font-semibold text-gray-900 dark:text-white">05:45 Call</span> at Pinewood (Stage 7). Heavy rain is expected during Scene 42B (Ext. Forest), so the unit might move to Cover Set (Stage 4) after lunch.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="bg-green-50 dark:bg-mint-900/20 rounded p-2 border border-green-200 dark:border-mint-800/30">
                <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">🚗 Traffic Alert</p>
                <p className="text-xs text-gray-700 dark:text-gray-300">M25 clear. Leave 04:30</p>
              </div>

              <div className="bg-blue-50 dark:bg-sky-900/20 rounded p-2 border border-blue-200 dark:border-sky-800/30">
                <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">🎬 Kit</p>
                <p className="text-xs text-gray-700 dark:text-gray-300">Pack rain covers</p>
              </div>

              <div className="bg-orange-50 dark:bg-peach-900/20 rounded p-2 border border-orange-200 dark:border-peach-800/30">
                <p className="text-xs font-semibold text-gray-900 dark:text-white mb-0.5">💰 Earnings</p>
                <p className="text-xs text-gray-700 dark:text-gray-300">Est. £415.50</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Active Productions & Crew Feed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Active Productions */}
          <Card className="lg:col-span-2">
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Active Productions</h2>
              <Button className="bg-purple-600 dark:bg-lavender-500 hover:bg-purple-700 dark:hover:bg-lavender-600 h-7 text-xs px-3">
                SCHEDULE
              </Button>
            </div>

            <CardContent className="p-3 space-y-2.5">
              {/* AVATAR 3 */}
              <Card className="border dark:border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">AVATAR 3</h3>
                        <span className="bg-green-100 dark:bg-mint-900/30 text-green-700 dark:text-mint-300 text-xs font-semibold px-1.5 py-0.5 rounded">SHOOTING</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Camera Operator - Unit A</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">42</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">/ 120 days</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div className="bg-purple-600 dark:bg-lavender-500 h-1.5 rounded-full" style={{width: '35%'}}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="bg-purple-600 dark:bg-lavender-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded">NEXT CALL</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Tomorrow, Nov 24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">05:45 AM</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Rain 14°C</span>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-6 text-xs px-2 dark:border-gray-600 dark:hover:bg-gray-700">
                          Map
                        </Button>
                        <Button size="sm" className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 h-6 text-xs px-2">
                          Call Sheet
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Pinewood Studios - Stage 7
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* THE CROWN */}
              <Card className="border dark:border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">THE CROWN - SEASON 7</h3>
                        <span className="bg-blue-100 dark:bg-sky-900/30 text-blue-700 dark:text-sky-300 text-xs font-semibold px-1.5 py-0.5 rounded">PREP</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Steadicam Operator</p>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-baseline gap-1">
                      <p className="text-xl font-bold text-gray-900 dark:text-white">15</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">/ 60 days</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div className="bg-purple-600 dark:bg-lavender-500 h-1.5 rounded-full" style={{width: '25%'}}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="bg-purple-600 dark:bg-lavender-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded">NEXT CALL</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Monday, Nov 25</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        <span className="font-bold text-gray-900 dark:text-white text-sm">08:00 AM</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">Cloudy 12°C</span>
                      </div>
                      <div className="flex gap-1.5">
                        <Button variant="outline" size="sm" className="h-6 text-xs px-2 dark:border-gray-600 dark:hover:bg-gray-700">
                          Map
                        </Button>
                        <Button size="sm" className="bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 h-6 text-xs px-2">
                          Call Sheet
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Elstree Studios - Lot B
                    </p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Right Column - Crew Feed & My Schedule */}
          <div className="space-y-3">
            {/* Crew Feed */}
            <Card>
              <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">Crew Feed</h2>
                <span className="bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded">LIVE</span>
              </div>

              <div className="bg-gray-900 dark:bg-gray-800 text-white p-2 flex items-center justify-between">
                <span className="text-xs font-semibold">📢 PRODUCTION UPDATES</span>
              </div>

              <CardContent className="p-3 space-y-3 max-h-48 overflow-y-auto">
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-sky-400 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-900 dark:text-white">WRAP called for Unit A. Thanks everyone!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1ST AD • 10 mins ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-sky-400 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-900 dark:text-white">Prelim Call Sheet for Day 44 is available for review.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PRODUCTION OFFICE • 1 hour ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 dark:bg-peach-400 rounded-full mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-xs text-gray-900 dark:text-white">Turnover delayed 30 mins due to weather. Hold in trailers.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2ND AD • 3 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Schedule */}
            <Card>
              <div className="p-2.5 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-sm font-bold text-gray-900 dark:text-white">My Schedule</h2>
              </div>
              <CardContent className="p-3 space-y-2">
                <div className="flex gap-2">
                  <div className="text-center shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">WED</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded p-2 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">AVATAR 3 - Shoot Day 44</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">05:45 - 19:00</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-center shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">THU</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">25</p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded p-2 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">AVATAR 3 - Shoot Day 45</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">06:00 - 19:00</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="text-center shrink-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">FRI</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">26</p>
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded p-2 border border-gray-200 dark:border-gray-700">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">THE CROWN - Camera Prep</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">08:00 - 17:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Documents & Open Opportunities Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Recent Documents */}
          <Card>
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Recent Documents</h2>
            </div>
            <CardContent className="p-2 space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-lavender-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">Call Sheet - Day 43</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">AVATAR 3 • 11/23</p>
                  </div>
                </div>
                <span className="bg-blue-100 dark:bg-sky-900/30 text-blue-700 dark:text-sky-300 text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ml-2">NEW</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-lavender-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">Safety Report - Week 6</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">The CROWN • 11/21</p>
                  </div>
                </div>
                <span className="bg-green-100 dark:bg-mint-900/30 text-green-700 dark:text-mint-300 text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ml-2">SIGNED</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-purple-600 dark:text-lavender-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">Updated Schedule - Act 3</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">AVATAR 3 • 11/20</p>
                  </div>
                </div>
                <span className="bg-purple-100 dark:bg-lavender-900/30 text-purple-700 dark:text-lavender-300 text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ml-2">REVIEWED</span>
              </div>
            </CardContent>
          </Card>

          {/* Open Opportunities */}
          <Card>
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Open Opportunities</h2>
            </div>
            <CardContent className="p-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-200 dark:border-gray-700">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Lighting Tech - Daily</h3>
                    <span className="bg-green-100 dark:bg-mint-900/30 text-green-700 dark:text-mint-300 text-xs font-semibold px-1.5 py-0.5 rounded">URGENT</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Commercial Shoot • Studio 4 • 15/12/2024</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">£250/day <span className="text-xs text-gray-500 dark:text-gray-400">• OT • Kit</span></p>
                </div>
                <Button className="bg-purple-600 dark:bg-lavender-500 hover:bg-purple-700 dark:hover:bg-lavender-600 whitespace-nowrap h-8 text-xs">
                  APPLY NOW
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tools & Payments Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Quick Tools */}
          <Card>
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Quick Tools</h2>
            </div>
            <CardContent className="p-2 grid grid-cols-2 gap-2">
              <Button variant="outline" className="h-auto flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">Timesheet</span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700 relative">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-lavender-400 mb-1" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">AI Scan</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-600 dark:bg-lavender-400 rounded-full"></span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700 relative">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">Kit Check</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-purple-600 dark:bg-lavender-400 rounded-full"></span>
              </Button>
              <Button variant="outline" className="h-auto flex flex-col items-center p-2 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-700">
                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-300 mb-1" />
                <span className="text-xs font-semibold text-gray-900 dark:text-white">Availability</span>
              </Button>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <div className="p-2.5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Payments</h2>
            </div>
            <div className="bg-gray-900 dark:bg-gray-800 text-white p-3 rounded-b-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">PENDING</span>
              </div>
              <p className="text-2xl font-bold mb-3">£2,450.00</p>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">Week 42 (Avatar 3)</span>
                  <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-1.5 py-0.5 rounded">Invoiced</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300">Week 41 (The Crown)</span>
                  <span className="bg-green-500 text-green-900 text-xs font-semibold px-1.5 py-0.5 rounded">Paid</span>
                </div>
              </div>
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 h-8 text-xs">
                VIEW TIMESHEETS
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}