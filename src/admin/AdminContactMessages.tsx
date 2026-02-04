import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AdminContactMessages = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching contact messages:", error);
      } else {
        setMessages(data || []);
      }

      setLoading(false);
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <p className="p-8">Loading contact messages...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

      {messages.length === 0 && (
        <p className="text-muted-foreground">No messages yet.</p>
      )}

      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border border-border p-6 bg-background"
          >
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Phone:</strong> {msg.phone}</p>

            <div className="mt-3">
              <strong>Message:</strong>
              <div
                className="prose mt-2"
                dangerouslySetInnerHTML={{ __html: msg.message }}
              />
            </div>

            <p className="text-sm opacity-60 mt-4">
              {new Date(msg.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContactMessages;
