import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date) => format(new Date(date), 'MMM dd, yyyy');
export const formatTime = (date: string | Date) => format(new Date(date), 'hh:mm a');
export const formatDateTime = (date: string | Date) => format(new Date(date), 'MMM dd, yyyy hh:mm a');
export const formatTDS = (value: number) => `${value} ppm`;
export const formatScore = (value: number) => `${value}/100`;
export const formatPercent = (value: number) => `${value}%`;
export const getRelativeTime = (date: string | Date) => formatDistanceToNow(new Date(date), { addSuffix: true });
