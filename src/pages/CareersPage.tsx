import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRef } from "react";



export function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [applied, setApplied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const jobsRef = useRef<HTMLDivElement | null>(null);



  const openApplyModal = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeApplyModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setApplied(false);
    setEmail("");
    setLinkedin("");
    setResume(null);
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !linkedin || !resume) {
      alert("All fields are required");
      return;
    }

    try {
      // 1️⃣ Upload resume
      const fileExt = resume.name.split(".").pop();
      const fileName = `${selectedJob?.id ?? "general"}-${Date.now()}.${fileExt}`;
      const filePath = `applications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, resume);

      if (uploadError) throw uploadError;

      // 2️⃣ Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(filePath);

      const resumeUrl = publicUrlData.publicUrl;

      // 3️⃣ Insert application
      const payload: any = {
        email,
        linkedin_url: linkedin,
        resume_url: resumeUrl,
      };

      if (selectedJob) {
        payload.job_id = selectedJob.id;
      }

      const { error: insertError } = await supabase
        .from("job_applications")
        .insert(payload);

      if (insertError) throw insertError;

      // 4️⃣ Success
      setApplied(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };



  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
      } else {
        console.log("Jobs from Supabase:", data);
        setJobs(data || []);
      }

      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (

    <div className="min-h-screen pt-10 pb-20 bg-background text-foreground">

      <section className="py-5 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-8">Careers</h2>

            <p className="text-foreground/80 mb-6">
              Join our creative team and help shape the future of content creation.
            </p>

            <p className="text-foreground/60 mb-10">
              We’re always looking for talented people passionate about storytelling, production, and creativity.
            </p>

            <div className="flex gap-6 mt-10">

              <button
                onClick={() => jobsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="px-10 py-5 bg-[#FDB913] text-[#0A1628] text-sm tracking-widest uppercase hover:bg-[#FDB913]/90 transition-all font-medium inline-flex items-center gap-3"

              >
                Apply Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openApplyModal(null)}
                className="px-10 py-5 border border-[#FDB913] text-[#FDB913] text-sm tracking-widest uppercase hover:bg-[#FDB913]/10 transition-all font-medium"
              >
                Upload Resume
              </button>
            </div>
          </motion.div>



          <div className="h-[500px] rounded-lg bg-muted flex items-center justify-center">
            <span className="text-muted-foreground uppercase tracking-widest text-sm">
              Image Placeholder
            </span>
          </div>

        </div>
      </section>




      <div ref={jobsRef} className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 ">
        <h3 className="text-2xl font-medium mb-8">Open Positions</h3>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24">
        {/* CAREERS SECTION */}
        {jobs.map((job) => (
          <div key={job.id} className="border border-border/60 bg-background/50 p-8 mb-8 hover:border-primary/40 transition">
            <h3 className="text-xl font-semibold">{job.title}</h3>
            <p>{job.department} • {job.location}</p>

            <div dangerouslySetInnerHTML={{ __html: job.description }} />

            <button
              className="mt-4 bg-black text-white px-4 py-2"
              onClick={() => openApplyModal(job)}
            >
              Apply
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-lg w-full max-w-lg relative">

            <button
              onClick={closeApplyModal}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-semibold mb-2">
              {selectedJob ? `Apply for ${selectedJob.title}` : "Upload Your Resume"}
            </h2>

            {selectedJob && (
              <p className="text-sm opacity-70 mb-4">
                {selectedJob.department} • {selectedJob.location}
              </p>
            )}

            <div className="mt-4">
              {applied ? (
                <div className="text-center py-10">
                  <p className="text-green-600 text-xl font-semibold">
                    ✅ Successfully applied
                  </p>
                  <p className="text-sm opacity-70 mt-2">
                    We’ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">

                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-4 py-3"
                  />

                  <input
                    type="url"
                    placeholder="LinkedIn profile URL *"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full border px-4 py-3"
                  />

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border px-4 py-3 text-left"
                  >
                    {resume ? `📄 ${resume.name}` : "Upload Resume *"}
                  </button>


                  <button
                    type="submit"
                    disabled={!email || !linkedin || !resume}
                    className={`w-full py-3 font-medium ${email && linkedin && resume
                        ? "bg-[#FDB913] text-[#0A1628]"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }`}

                  >
                    Submit Application
                  </button>
                </form>
              )}
            </div>


          </div>
        </div>
      )}
    </div>
  );
}