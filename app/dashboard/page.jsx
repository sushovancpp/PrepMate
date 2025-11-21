"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import AddNewInterview from "./_components/AddNewInterview";

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) fetchInterviews();
  }, [user]);

  const fetchInterviews = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;

      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, email));

      setInterviews(result);
    } catch (error) {
      console.error("Error loading interviews:", error);
    }
  };

  return (
    <div className="w-full flex justify-center pt-24 px-4 sm:px-6">
      {/* Glass Container */}
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/20
          rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-lg
          flex flex-col items-center transition-all
        "
      >
        <h3 className="text-2xl text-white font-semibold mb-6 text-center">
          Create New Interview
        </h3>

        {/* Card Wrapper */}
        <div className="grid grid-cols-1 place-items-center gap-4 w-full">
          <AddNewInterview />
        </div>
      </div>
    </div>
  );
}
