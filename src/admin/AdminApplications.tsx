import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setApplications(data || []);
    };

    fetchApplications();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Job Applications</h1>

      {applications.map((a) => (
        <div key={a.id} className="border p-4 mb-4">
          <p><strong>Email:</strong> {a.email}</p>

          {a.linkedin_url && (
            <p>
              <a
                href={a.linkedin_url}
                target="_blank"
                className="underline"
              >
                LinkedIn
              </a>
            </p>
          )}

          <a
            href={a.resume_url}
            target="_blank"
            className="underline"
          >
            View Resume
          </a>
        </div>
      ))}
    </div>
  );
};

export default AdminApplications;
