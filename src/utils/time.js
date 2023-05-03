import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

export const timeAgo = prevDateTime => {
  dayjs.extend(relativeTime);
  return dayjs(prevDateTime).fromNow();
};

export const dateIsBefore = ({
  dateToCheck,
  dateAgainst = dayjs(),
  unit = 'y',
}) => {
  switch (unit) {
    case 'y':
      return dayjs(dateToCheck).isBefore(dateAgainst, 'year');
    case 'd':
      return dayjs(dateToCheck).isBefore(dateAgainst, 'day');
    case 'w':
      return dayjs(dateToCheck).isBefore(dateAgainst, 'week');
    case 'm':
      return dayjs(dateToCheck).isBefore(dateAgainst, 'month');
    default:
      return dayjs(dateToCheck).isBefore(dateAgainst, 'year');
  }
};

export const isSimilarDate = (dateToCheck, dateAgainst, unit = 'y') => {
  switch (unit) {
    case 'y':
      return dayjs(dateToCheck).isSame(dateAgainst, 'year');
    case 'd':
      return dayjs(dateToCheck).isSame(dateAgainst, 'day');
    case 'w':
      return dayjs(dateToCheck).isSame(dateAgainst, 'week');
    case 'm':
      return dayjs(dateToCheck).isSame(dateAgainst, 'month');
    default:
      return dayjs(dateToCheck).isSame(dateAgainst, 'year');
  }
};

export const formatDate = (dateString, formatTo = 'Do, MMMM YYYY') => {
  return dayjs(dateString).format(formatTo);
};

export default {
  timeAgo,
  dateIsBefore,
  isSimilarDate,
  formatDate,
};
