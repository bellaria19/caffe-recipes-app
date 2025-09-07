import { useParams, Link } from "react-router";
import { mockRecipes } from "@/lib/data/recipes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Star, Clock, ChefHat, Lightbulb, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Recipe() {
  const { id } = useParams();

  // Find the recipe by ID
  const recipe = mockRecipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">레시피를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-6">
          요청하신 레시피가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button asChild>
          <Link to="/">홈으로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="pb-10 flex items-center justify-between">
        <Button variant="ghost" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            홈으로 돌아가기
          </Link>
        </Button>

        <div className="flex gap-3">
          <Button asChild>
            <Link to={`/recipes/edit/${id}`}>레시피 수정</Link>
          </Button>
          <Button variant="outline">레시피 공유</Button>
        </div>
      </div>

      <article className="space-y-6">
        {/* Recipe Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{recipe.title}</h1>
                  <Badge
                    variant={
                      recipe.brewType === "espresso" ? "default" : "outline"
                    }
                  >
                    {recipe.brewType === "espresso" ? "에스프레소" : "드립"}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-4">
                  {recipe.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    <span>{recipe.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star
                      className="h-4 w-4 text-yellow-500"
                      fill="currentColor"
                    />
                    <span>{recipe.rating}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {new Date(recipe.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Recipe Parameters */}
        {recipe.espressoParams && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-white bg-gray-700 py-3 -mx-6 -mt-6 mb-4 rounded-t-lg">
                에스프레소 추출 가이드
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Parameters Table */}
              {/* <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center text-muted-foreground">
                      물온도
                    </TableHead>
                    <TableHead className="text-center text-muted-foreground">
                      도징량
                    </TableHead>
                    <TableHead className="text-center text-muted-foreground">
                      추출시간
                    </TableHead>
                    <TableHead className="text-center text-muted-foreground">
                      추출량
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-center font-medium">
                      {recipe.espressoParams.waterTemperature}℃
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {recipe.espressoParams.coffeeAmount}g
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {recipe.espressoParams.extractionTime}-
                      {recipe.espressoParams.extractionTime + 5}sec
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {recipe.espressoParams.extractionAmount}-
                      {recipe.espressoParams.extractionAmount + 4}g
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table> */}

              {/* Quick Reference */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-muted/20 rounded">
                  <p className="text-xs text-muted-foreground mb-1 font-bold">
                    온도
                  </p>
                  <p className="font-bold text-lg">
                    {recipe.espressoParams.waterTemperature}℃
                  </p>
                </div>

                <div className="text-center p-3 bg-muted/20 rounded">
                  <p className="text-xs text-muted-foreground mb-1 font-bold">
                    도징량
                  </p>
                  <p className="font-bold text-lg">
                    {recipe.espressoParams.coffeeAmount}g
                  </p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded">
                  <p className="text-xs text-muted-foreground mb-1 font-bold">
                    추출시간
                  </p>
                  <p className="font-bold text-lg">
                    {recipe.espressoParams.extractionTime}초
                  </p>
                </div>
                <div className="text-center p-3 bg-muted/20 rounded">
                  <p className="text-xs text-muted-foreground mb-1 font-bold">
                    추출량
                  </p>
                  <p className="font-bold text-lg">
                    {recipe.espressoParams.extractionAmount}ml
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {recipe.dripParams && (
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
                      "inline-flex items-center px-6 pb-4 rounded  font-bold text-xl uppercase",
                      recipe.dripParams.brewingType === "hot"
                        ? "text-red-500"
                        : "text-blue-500"
                    )}
                  >
                    {recipe.dripParams.brewingType === "hot" ? "Hot" : "Ice"}
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
                        {recipe.dripParams.coffeeAmount}g
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center bg-muted/30 font-medium border-r">
                        추출량
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {recipe.dripParams.extractionSteps.reduce(
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
                          recipe.dripParams.extractionSteps.reduce(
                            (total, step) => total + (step.duration || 0),
                            0
                          ) / 60
                        )}
                        :
                        {String(
                          recipe.dripParams.extractionSteps.reduce(
                            (total, step) => total + (step.duration || 0),
                            0
                          ) % 60
                        ).padStart(2, "0")}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center bg-muted/30 font-medium border-r ">
                        물온도
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {recipe.dripParams.waterTemperature}℃
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center bg-muted/30 font-medium border-r">
                        입자
                      </TableCell>
                      <TableCell className="text-center font-bold text-lg">
                        {recipe.dripParams.grindSize}
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
                  {recipe.dripParams.extractionSteps.map((step, index) => (
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
                        <span className="font-bold text-lg">
                          {step.waterAmount}g
                        </span>
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
        )}

        {/* Tips */}
        {recipe.tips && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />팁
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {recipe.tips}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </>
  );
}
