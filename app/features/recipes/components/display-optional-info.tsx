import type { Recipe } from '@/lib/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BeanIcon } from 'lucide-react';

export function DisplayOptionalInfo({ recipe }: { recipe: Recipe }) {
  const espressoParams = recipe.espressoParams;
  const dripParams = recipe.dripParams;

  // Check if any optional info exists
  const hasOptionalInfo =
    recipe.bean ||
    espressoParams?.grindSize ||
    espressoParams?.grinder ||
    dripParams?.dripper ||
    dripParams?.grindSize ||
    dripParams?.grinder;

  if (!hasOptionalInfo) return null;

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <BeanIcon className='h-5 w-5 text-green-500' />
          <CardTitle>추가 정보</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {recipe.bean && (
                <TableHead className='text-center'>원두</TableHead>
              )}
              {dripParams?.dripper && (
                <TableHead className='text-center'>드리퍼</TableHead>
              )}
              {espressoParams?.grinder || dripParams?.grinder ? (
                <>
                  <TableHead className='text-center'>그라인더</TableHead>
                  {(espressoParams?.grinderSetting ||
                    dripParams?.grinderSetting) && (
                    <TableHead className='text-center'>그라인더 설정</TableHead>
                  )}
                </>
              ) : (
                (espressoParams?.grindSize || dripParams?.grindSize) && (
                  <TableHead className='text-center'>분쇄도</TableHead>
                )
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {recipe.bean && (
                <TableCell className='text-center font-medium'>
                  {recipe.bean}
                </TableCell>
              )}
              {dripParams?.dripper && (
                <TableCell className='text-center font-medium'>
                  {dripParams.dripper}
                </TableCell>
              )}
              {espressoParams?.grinder || dripParams?.grinder ? (
                <>
                  <TableCell className='text-center font-medium'>
                    {espressoParams?.grinder || dripParams?.grinder}
                  </TableCell>
                  {(espressoParams?.grinderSetting ||
                    dripParams?.grinderSetting) && (
                    <TableCell className='text-center font-medium'>
                      {espressoParams?.grinderSetting ||
                        dripParams?.grinderSetting}
                    </TableCell>
                  )}
                </>
              ) : (
                (espressoParams?.grindSize || dripParams?.grindSize) && (
                  <TableCell className='text-center font-medium'>
                    {espressoParams?.grindSize || dripParams?.grindSize}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
