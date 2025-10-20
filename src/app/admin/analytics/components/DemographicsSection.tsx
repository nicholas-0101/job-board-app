"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, PieChart, MapPin } from "lucide-react";

const clampPercentage = (value: number) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

export function DemographicsSection({ demographics }: { demographics: any }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Users className="w-5 h-5 text-blue-600" />
            Age Demographics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {demographics?.ageBuckets && Object.keys(demographics.ageBuckets).length > 0 ? (() => {
            const total = Object.values(demographics.ageBuckets).reduce((sum: number, count) => sum + (count as number), 0) || 1;
            return Object.entries(demographics.ageBuckets)
              .filter(([range]) => range !== 'unknown')
              .map(([range, count], index: number) => {
                const percentage = Math.round(((count as number) * 100) / total);
                return (
                  <div key={range} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500" style={{ backgroundColor: `hsl(${220 + index * 20}, 70%, 50%)` }} />
                      <span className="text-gray-700">{range} years</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                    </div>
                  </div>
                );
              });
          })() : (
            <div className="text-center text-muted-foreground py-4">No age data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <PieChart className="w-5 h-5 text-purple-600" />
            Gender Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {demographics?.gender && Array.isArray(demographics.gender) && demographics.gender.length > 0 ? (() => {
            const total = demographics.gender.reduce((sum: number, item: any) => sum + (item.count || 0), 0) || 1;
            return demographics.gender.map((item: any) => {
              const percentage = clampPercentage((item.count * 100) / total);
              const color = item.gender.toLowerCase() === "male" ? "#3B82F6" : item.gender.toLowerCase() === "female" ? "#EC4899" : "#6B7280";
              return (
                <div key={item.gender} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="truncate capitalize">{item.gender}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-gray-900">{Math.round(percentage)}%</span>
                  </div>
                </div>
              );
            });
          })() : (
            <div className="text-center text-muted-foreground py-4">No gender data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <MapPin className="w-5 h-5 text-green-600" />
            Top Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {demographics?.locations && Array.isArray(demographics.locations) && demographics.locations.length > 0 ? (() => {
            const total = demographics.locations.reduce((sum: number, loc: any) => sum + (loc.count || 0), 0) || 1;
            return demographics.locations.slice(0, 6).map((location: any, index: number) => {
              const percentage = clampPercentage((location.count * 100) / total);
              return (
                <div key={location.city} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${120 + index * 15}, 60%, 50%)` }} />
                    <span className="truncate">{location.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 flex-1 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-gray-900">{Math.round(percentage)}%</span>
                  </div>
                </div>
              );
            });
          })() : (
            <div className="text-center text-muted-foreground py-4">No location data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


