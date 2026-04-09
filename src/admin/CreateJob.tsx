import { useState } from "react";
import { supabase } from "../lib/supabase";
import JobForm from "./JobForm";

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    description: "",
    status: "draft",
  });

  const handleSaveJob = async () => {
    if (!jobData.title || !jobData.location) {
      alert("Job title and location are required");
      return;
    }

    const { error } = await supabase.from("jobs").insert([jobData]);

    if (error) {
      alert("Failed to save job");
      return;
    }

    alert("Job saved successfully");
  };

  return (
    <div className="min-h-screen bg-[#F5E8D8] p-12">
      <h1 className="text-4xl font-bold mb-8">Create Job</h1>

      <JobForm
        jobData={jobData}
        setJobData={setJobData}
        onSubmit={handleSaveJob}
        submitLabel="Create Job"
      />
    </div>
  );
};

export default CreateJob;
