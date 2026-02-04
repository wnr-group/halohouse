import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

const AdminJobsList = () => {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
        return;
      }

      setJobs(data || []);
    };

    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>

      {jobs.length === 0 && (
        <p className="opacity-60">No jobs found.</p>
      )}

      {jobs.map((job) => (
        <div
          key={job.id}
          className="border border-black/20 p-4 mb-4 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm opacity-70">
              {job.location} • {job.status}
            </p>
          </div>

          <Link
            to={`/admin/jobs/${job.id}/edit`}
            className="underline font-medium"
          >
            Edit
          </Link>
        </div>
      ))}
    </div>
  );
};

export default AdminJobsList;
