const UploadPOD = ({ jobId, onUploaded }) => {
  const upload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const pods = JSON.parse(localStorage.getItem("pods")) || {};
    const existing = pods[jobId] || [];

    let completed = 0;
    const results = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        results.push(reader.result);
        completed++;

        if (completed === files.length) {
          pods[jobId] = [...existing, ...results];
          localStorage.setItem("pods", JSON.stringify(pods));

          e.target.value = "";  
          onUploaded();       
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <input
      type="file"
      accept="image/*"
      multiple        
      onChange={upload}
    />
  );
};

export default UploadPOD;
