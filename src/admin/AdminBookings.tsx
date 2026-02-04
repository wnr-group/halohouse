import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("book_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setBookings(data || []);
    };

    fetchBookings();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Booking Sessions</h1>

      {bookings.map((b) => (
        <div key={b.id} className="border p-4 mb-4">
          <p><strong>Name:</strong> {b.name}</p>
          <p><strong>Email:</strong> {b.email}</p>
          <p><strong>Phone:</strong> {b.phone}</p>
          <p><strong>Service:</strong> {b.service}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;
