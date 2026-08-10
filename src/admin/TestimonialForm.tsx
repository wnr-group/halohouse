const TestimonialForm = ({ testimonialData, setTestimonialData, onSubmit, submitLabel }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestimonialData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <input
        name="name"
        value={testimonialData.name}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Client Name"
      />

      <input
        name="role"
        value={testimonialData.role}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Role (e.g. Client)"
      />

      <input
        name="company"
        value={testimonialData.company}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Company"
      />

      <textarea
        name="message"
        value={testimonialData.message}
        onChange={handleChange}
        rows={4}
        className="w-full border px-4 py-2"
        placeholder="Testimonial message"
      />

      <select
        name="rating"
        value={testimonialData.rating}
        onChange={handleChange}
        className="w-full border px-4 py-2"
      >
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} star{r > 1 ? "s" : ""}
          </option>
        ))}
      </select>

      <input
        name="avatar_url"
        value={testimonialData.avatar_url}
        onChange={handleChange}
        className="w-full border px-4 py-2"
        placeholder="Avatar image URL"
      />

      <button onClick={onSubmit} className="bg-black text-white px-6 py-3">
        {submitLabel}
      </button>
    </div>
  );
};

export default TestimonialForm;