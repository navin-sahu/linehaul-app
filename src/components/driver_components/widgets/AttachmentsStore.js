export const getDocs = (jobId) => {
  const docs = JSON.parse(localStorage.getItem("jobDocs")) || {};
  return docs[jobId] || [];
};

export const getPods = (jobId) => {
  const pods = JSON.parse(localStorage.getItem("pods")) || {};
  return pods[jobId] || [];
};

export const removeDoc = (jobId, index) => {
  const docs = JSON.parse(localStorage.getItem("jobDocs")) || {};
  docs[jobId].splice(index, 1);
  localStorage.setItem("jobDocs", JSON.stringify(docs));
};

export const removePod = (jobId, index) => {
  const pods = JSON.parse(localStorage.getItem("pods")) || {};
  pods[jobId].splice(index, 1);
  localStorage.setItem("pods", JSON.stringify(pods));
};
