export const formatDate = (date) => new Date(date).toLocaleString();

export const truncateText = (text, maxLength = 100) =>
    text.length > maxLength ? text.substring(0, maxLength) + '...' : text;