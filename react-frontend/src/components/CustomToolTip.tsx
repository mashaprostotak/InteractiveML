import React from 'react';
import {
  TooltipProps,
  DatumGroupKeys,
  BaseDatum,
} from '@nivo/parallel-coordinates';
import { TableTooltip } from '@nivo/tooltip';

export const CustomTooltip = <
  Datum extends BaseDatum,
  GroupBy extends DatumGroupKeys<Datum> | undefined,
>({
  datum,
  variables,
}: TooltipProps<Datum, GroupBy>) => {
  const clonedVariables = variables.slice();
  const customRows = clonedVariables.map((variable) => [
    variable.label || variable.id,
    <strong key={variable.id}>{datum.data[variable.value] as number}</strong>,
  ]);
  customRows.push([
    'Country',
    <strong key={1}>{(datum.data as any).country}</strong>,
  ]);
  return <TableTooltip rows={customRows} />;
};
