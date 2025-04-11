export const  formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 
      ? `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`
      : `${remainingMinutes}m`;
  };
