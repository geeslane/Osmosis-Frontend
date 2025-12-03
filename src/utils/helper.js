import { googleUserInfoUrl } from './constant';

export async function fetchGoogleUserInfo(accessToken) {
  const response = await fetch(googleUserInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const errorMsg =
      errorBody?.error_description || 'Failed to fetch Google user info';
    throw new Error(errorMsg);
  }

  const data = await response.json();

  const { name, email, picture } = data;

  if (!name || !email) {
    throw new Error('Incomplete user info returned from Google');
  }

  return { name, email, picture };
}
export function downloadTextFile(content, filename) {
  if (!content || !filename) return;

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
export function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}
export function formatText(text, options) {
  if (!text) return '';

  let formatted = text.trim();

  formatted =
    formatted.charAt(0).toUpperCase() + formatted.slice(1).toLowerCase();
  if (options?.limitWords) {
    const words = formatted.split(' ').slice(0, options.limitWords);
    formatted = words.join(' ');
  }

  if (options?.limitChars) {
    formatted = formatted.slice(0, options.limitChars);
  }

  const prefix = options?.prefix ?? '';
  const suffix = options?.suffix ?? '';

  return `${prefix}${formatted}${suffix}`;
}
export function formatDuration(minutes) {
  if (!minutes || minutes < 0) return '0 minute';

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const parts = [];
  if (hrs > 0) parts.push(`${hrs} hour${hrs > 1 ? 's' : ''}`);
  if (mins > 0 || hrs === 0) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);

  return parts.join(' and ');
}
export function Duration(minutes = 0) {
  if (!minutes || minutes < 0) return '0';

  const totalHours = minutes / 60;
  return `${totalHours.toFixed(2)}`;
}
export function timeStringToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function getTimeFromDate(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  return `${hours}:${minutes}${ampm}`;
}

export function getDayName(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
export function formatTo12HourWithMinutes(timeString) {
  if (!timeString) return '';

  const [hour, minute] = timeString.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;

  return `${hour12}:${String(minute).padStart(2, '0')}${period}`;
}
export function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}
