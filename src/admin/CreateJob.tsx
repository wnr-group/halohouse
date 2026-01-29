import { useState } from "react";
import ReactQuill from "react-quill";
import { supabase } from "../lib/supabase";


const CreateJob = () => {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [error, setError] = useState("");

    const [jobData, setJobData] = useState({
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        experience: "",
        description: "",
        responsibilities: "",
        requirements: "",
        status: "draft",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setJobData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!password) {
            setError("Password is required");
            return;
        }

        // TEMP password (backend later)
        if (password === "admin123") {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Incorrect password");
        }
    };


    const handleSaveJob = async () => {
        if (!jobData.title || !jobData.location) {
            alert("Job title and location are required");
            return;
        }

        const { error } = await supabase.from("jobs").insert([{
            title: jobData.title,
            department: jobData.department,
            location: jobData.location,
            type: jobData.type,
            experience: jobData.experience,
            description: jobData.description,
            responsibilities: jobData.responsibilities,
            requirements: jobData.requirements,
            status: jobData.status,
        }]);

        if (error) {
            console.error(error);
            alert("Failed to save job");
            return;
        }

        alert("Job saved successfully");

        setJobData({
            title: "",
            department: "",
            location: "",
            type: "Full-time",
            experience: "",
            description: "",
            responsibilities: "",
            requirements: "",
            status: "draft",
        });
    };


    /* PASSWORD SCREEN */
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5E8D8]">
                <div className="max-w-md w-full p-8">
                    <h1 className="text-4xl font-bold mb-4">Admin Access</h1>
                    <p className="mb-6 opacity-70 text-sm">
                        Enter admin password to continue
                    </p>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full border px-4 py-2 mb-4"
                    />

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-black text-white py-2"
                    >
                        Continue
                    </button>

                    {error && (
                        <p className="text-red-600 mt-4 text-sm">{error}</p>
                    )}
                </div>
            </div>
        );
    }

    /*  JOB CREATION FORM */
    return (
        <div className="min-h-screen bg-[#F5E8D8] p-12">
            <h1 className="text-4xl font-bold mb-8">Create Job</h1>

            <div className="max-w-3xl space-y-6">
                <div>
                    <label className="block mb-1 font-medium">Job Title</label>
                    <input
                        name="title"
                        value={jobData.title}
                        onChange={handleChange}
                        className="w-full border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Department</label>
                    <input
                        name="department"
                        value={jobData.department}
                        onChange={handleChange}
                        className="w-full border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Location</label>
                    <input
                        name="location"
                        value={jobData.location}
                        onChange={handleChange}
                        className="w-full border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Employment Type</label>
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
                </div>

                <div>
                    <label className="block mb-1 font-medium">Experience</label>
                    <input
                        name="experience"
                        value={jobData.experience}
                        onChange={handleChange}
                        className="w-full border px-4 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Job Description</label>
                    <ReactQuill
                        theme="snow"
                        value={jobData.description}
                        onChange={(value) =>
                            setJobData((prev) => ({ ...prev, description: value }))
                        }
                    />
                </div>


                <div>
                    <label className="block mb-1 font-medium">Responsibilities</label>
                    <ReactQuill
                        theme="snow"
                        value={jobData.responsibilities}
                        onChange={(value) =>
                            setJobData((prev) => ({ ...prev, responsibilities: value }))
                        }
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Requirements</label>
                    <ReactQuill
                        theme="snow"
                        value={jobData.requirements}
                        onChange={(value) =>
                            setJobData((prev) => ({ ...prev, requirements: value }))
                        }
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">Job Status</label>
                    <select
                        name="status"
                        value={jobData.status}
                        onChange={handleChange}
                        className="w-full border px-4 py-2"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <button
                    onClick={handleSaveJob}
                    disabled={!jobData.title}
                    className={`px-6 py-3 mt-6 ${jobData.title
                        ? "bg-black text-white"
                        : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    Save Job
                </button>


            </div>
        </div>
    );
};

export default CreateJob;
