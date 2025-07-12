
//csvName must end in .csv
export const downloadEmptyCSV = (headers: string[], csvName: string) => {
  const csvContent = headers.join(',') + '\n';

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', csvName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const YesNoToBoolean = (value: string) => {
  if (typeof value !== 'string') return value;
  const lower = value.toLowerCase();
  return lower === 'yes' ? true : lower === 'no' ? false : value;
};