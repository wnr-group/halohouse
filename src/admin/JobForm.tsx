import React from "react";
import ReactQuill from "react-quill";

const JobForm = ({ jobData, setJobData, onSubmit, submitLabel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl space-y-6">

      <input
        name="title"
        value={jobData.title}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Job Title"
      />

      <input
        name="department"
        value={jobData.department}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Department"
      />

      <input
        name="location"
        value={jobData.location}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Location"
      />

      <select
        name="type"
        value={jobData.type}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      >
        <option>Full-time</option>
        <option>Internship</option>
        <option>Contract</option>
      </select>

      <input
        name="experience"
        value={jobData.experience}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Experience"
      />

    
    <label className="font-medium">Description</label>
<ReactQuill
  theme="snow"
  value={jobData.description}
  onChange={(v) =>
    setJobData((prev) => ({ ...prev, description: v }))
  }
/>


      

    

      <select
        name="status"
        value={jobData.status}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <button
        onClick={onSubmit}
        className="bg-black text-white px-6 py-3"
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default JobForm;
