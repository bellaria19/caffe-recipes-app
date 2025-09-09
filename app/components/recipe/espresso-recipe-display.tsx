import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EspressoParams } from "@/lib/types";

interface EspressoRecipeDisplayProps {
  params: EspressoParams;
}

export function EspressoRecipeDisplay({ params }: EspressoRecipeDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-white bg-gray-700 py-3 -mx-6 -mt-6 mb-4 rounded-t-lg">
          에스프레소 추출 가이드
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Reference */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-muted/20 rounded">
            <p className="text-xs text-muted-foreground mb-1 font-bold">온도</p>
            <p className="font-bold text-lg">{params.waterTemperature}℃</p>
          </div>

          <div className="text-center p-3 bg-muted/20 rounded">
            <p className="text-xs text-muted-foreground mb-1 font-bold">
              도징량
            </p>
            <p className="font-bold text-lg">{params.coffeeAmount}g</p>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded">
            <p className="text-xs text-muted-foreground mb-1 font-bold">
              추출시간
            </p>
            <p className="font-bold text-lg">{params.extractionTime}초</p>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded">
            <p className="text-xs text-muted-foreground mb-1 font-bold">
              추출량
            </p>
            <p className="font-bold text-lg">{params.extractionAmount}ml</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
