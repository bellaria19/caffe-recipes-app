import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { DripParams } from "@/lib/types";

interface DripRecipeDisplayProps {
  params: DripParams;
}

export function DripRecipeDisplay({ params }: DripRecipeDisplayProps) {
  return (
    <>
      {/* Drip Parameters Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-white bg-gray-700 py-3 -mx-6 -mt-6 mb-4 rounded-t-lg">
            드립 추출 가이드
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Brewing Type Badge */}
          <div className="text-center">
            <span
              className={cn(
                "inline-flex items-center px-6 pb-4 rounded font-bold text-xl uppercase",
                params.brewingType === "hot"
                  ? "text-red-500"
                  : "text-blue-500"
              )}
            >
              {params.brewingType === "hot" ? "Hot" : "Ice"}
            </span>
          </div>

          {/* Parameters Table */}
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-center bg-muted/30 font-medium border-r w-1/3">
                  도징량
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {params.coffeeAmount}g
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center bg-muted/30 font-medium border-r">
                  추출량
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {params.extractionSteps.reduce(
                    (total, step) => total + step.waterAmount,
                    0
                  )}
                  g
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center bg-muted/30 font-medium border-r">
                  추출 시간
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {Math.floor(
                    params.extractionSteps.reduce(
                      (total, step) => total + (step.duration || 0),
                      0
                    ) / 60
                  )}
                  :
                  {String(
                    params.extractionSteps.reduce(
                      (total, step) => total + (step.duration || 0),
                      0
                    ) % 60
                  ).padStart(2, "0")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center bg-muted/30 font-medium border-r">
                  물온도
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {params.waterTemperature}℃
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center bg-muted/30 font-medium border-r">
                  입자
                </TableCell>
                <TableCell className="text-center font-bold text-lg">
                  {params.grindSize}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Extraction Steps Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-white bg-gray-700 py-3 -mx-6 -mt-6 mb-4 rounded-t-lg">
            추출 단계
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {params.extractionSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground text-sm rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <span className="font-medium">{step.stepName}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">{step.waterAmount}g</span>
                  {step.duration && (
                    <span className="text-muted-foreground text-sm">
                      {step.duration}초
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}