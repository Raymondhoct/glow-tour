// 匯出 JSON 備份檔（下載到本機）
export const exportToJsonFile = (data, filename = 'tour-backup.json') => {
  const str = JSON.stringify(data, null, 2);
  const blob = new Blob([str], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// 匯出用戶全部數據備份
export const exportUserFullBackup = (user, records, reviews) => {
  return {
    exportAt: Date.now(),
    user: { ...user },
    travelRecords: records,
    sharedReviews: reviews
  };
};
