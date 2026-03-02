"use client";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import AddNewInterview from "./_components/AddNewInterview";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full flex justify-center pt-24 px-4 sm:px-6"
    >
      {/* Glass Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="
          bg-white/10 backdrop-blur-xl border border-white/20
          rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-lg
          flex flex-col items-center transition-all
        "
      >
        <motion.h3
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-2xl text-white font-semibold mb-6 text-center"
        >
          Create New Interview
        </motion.h3>

        {/* Card Wrapper */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="grid grid-cols-1 place-items-center gap-4 w-full"
        >
          <AddNewInterview />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
