const UploadDocs = ({ jobId, onUploaded }) => {
  const upload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const docs = JSON.parse(localStorage.getItem("jobDocs")) || {};
    const existing = docs[jobId] || [];

    const names = files.map(f => f.name);
    docs[jobId] = [...existing, ...names];

    localStorage.setItem("jobDocs", JSON.stringify(docs));

    e.target.value = "";   
    onUploaded();         
  };

  return (
    <input
      type="file"
      multiple          
      onChange={upload}
    />
  );
};

export default UploadDocs;
