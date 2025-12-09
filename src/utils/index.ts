import { DateTime } from 'luxon';

import type { Duration } from 'luxon';

const yesterayAtThisTime = (): DateTime => DateTime.now().minus({ days: 1 });

const getDay = (diff: Duration) => Math.round(diff.days);

export const formatDate = (utc: string): string => {
  const date = DateTime.fromISO(utc);

  if (getDay(date.diffNow('days')) === 0) {
    return 'Сегодня, ' + date.toFormat('HH:mm');
  }

  if (getDay(date.diff(yesterayAtThisTime(), 'days')) === 0) {
    return 'Вчера, ' + date.toFormat('HH:mm');
  }

  return date.toFormat('DD:MM, kk:mm');
};

export const toNumber = (number: string | undefined) => (number ? +number : 0);

export type TModel = Record<string, string>;
