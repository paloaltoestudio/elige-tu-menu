/**
 * Formats a date string from YYYY-MM-DD to Spanish format "DD de MMMM de YYYY"
 * @param dateString - Date string in format YYYY-MM-DD
 * @returns Formatted date string in Spanish format
 * @example formatDateToSpanish("2025-10-27") => "27 de octubre de 2025"
 */
export const formatDateToSpanish = (dateString: string): string => {
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  // Parse the date string (YYYY-MM-DD)
  const [year, month, day] = dateString.split('-').map(Number);

  // Remove leading zero from day if present
  const dayNumber = day;
  
  // Get month name (month is 1-indexed in the date string)
  const monthName = months[month - 1];

  return `${dayNumber} de ${monthName} de ${year}`;
};

