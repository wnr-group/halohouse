import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import JobForm from "./JobForm";

const EditJob = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  const [jobData, setJobData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    experience: "",
    description: "",
    responsibilities: "",
    requirements: "",
    status: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchJob = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setJobData(data);
      }

      setLoading(false);
    };

    fetchJob();
  }, [id]);

  const handleUpdateJob = async () => {
  if (!id) {
    alert("Job ID missing");
    return;
  }

  const { data, error } = await supabase
    .from("jobs")
    .update({
      title: jobData.title,
      department: jobData.department,
      location: jobData.location,
      type: jobData.type,
      experience: jobData.experience,
      description: jobData.description,
      responsibilities: jobData.responsibilities,
      requirements: jobData.requirements,
      status: jobData.status,
    })
    .eq("id", id)
    .select(); // VERY IMPORTANT

  if (error) {
    console.error("Update error:", error);
    alert("Failed to update job");
    return;
  }

  if (!data || data.length === 0) {
    alert("No rows updated (check RLS policies)");
    return;
  }

  alert("Job updated successfully");
};


  // ✅ THIS return is mandatory
  if (loading) {
    return <p className="p-8">Loading job...</p>;
  }

  // ✅ FINAL return
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Job</h1>

      <JobForm
        jobData={jobData}
        setJobData={setJobData}
        onSubmit={handleUpdateJob}
        submitLabel="Update Job"
      />
    </div>
  );
};

export default EditJob;
