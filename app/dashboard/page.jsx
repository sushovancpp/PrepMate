"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import InterviewItemCard from "./_components/InterviewItemCard";
import AddNewInterview from "./_components/AddNewInterview";

export default function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const { user } = useUser();

  // Load interviews when user is ready
  useEffect(() => {
    if (user) {
      fetchInterviews();
    }
  }, [user]);

  // Fetch interview list
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
  <div className="w-full flex justify-left pt-20">

    <div
      className="
        flex flex-col items-center
      "
    >
      <h3 className="text-xl text-white font-semibold mb-6">
        Create New Interview
      </h3>

      <div className="grid grid-cols-1 place-items-center">
        <AddNewInterview />
      </div>
    </div>

  </div>
);

}
