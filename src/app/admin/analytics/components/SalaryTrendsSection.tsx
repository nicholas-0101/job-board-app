"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, BarChart3, ArrowUp, ArrowDown } from "lucide-react";

const clampPercentage = (value: number) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

export function SalaryTrendsSection({ salaryTrends }: { salaryTrends: any }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            Average Salary by Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {salaryTrends?.byPosition && Array.isArray(salaryTrends.byPosition) && salaryTrends.byPosition.length > 0 ? (
            salaryTrends.byPosition.map((position: any) => (
              <div key={position.position} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{position.position}</h4>
                  <span className="text-sm text-gray-500">{position.count} reports</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">IDR {(position.min / 1000000).toFixed(0)}M - {(position.max / 1000000).toFixed(0)}M</span>
                  <span className="font-semibold text-green-600">Avg: IDR {(position.avg / 1000000).toFixed(0)}M</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${(position.avg / 35000000) * 100}%` }} />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">No salary data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            Salary Trends by Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {salaryTrends?.byLocation && Array.isArray(salaryTrends.byLocation) && salaryTrends.byLocation.length > 0 ? (
            salaryTrends.byLocation.map((location: any) => (
              <div key={location.city} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{location.city}</h4>
                  <div className={`flex items-center gap-1 text-sm ${location.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {location.growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {location.growth}%
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">IDR {(location.avg / 1000000).toFixed(1)}M</span>
                  <span className="text-sm text-gray-500">Average</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500" style={{ width: `${clampPercentage((location.avg / 25000000) * 100)}%` }} />
                  </div>
                  <span className="w-12 text-right text-xs font-semibold text-gray-900">{Math.round(clampPercentage((location.avg / 25000000) * 100))}%</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">No salary trend data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


