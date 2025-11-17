"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function InterviewItemCard({ interview }) {
  const router = useRouter();

  return (
    <div className="glass p-6 rounded-xl text-white space-y-2 glass-hover">
      <h2 className="text-xl font-bold">{interview.jobPosition}</h2>

      <p className="text-gray-300">
        {interview.jobExperience} Years of Experience
      </p>

      <p className="text-gray-400 text-sm">
        Created At: {interview.createdAt || "Not Available"}
      </p>

      <div className="flex gap-2 mt-4">
        <Button className="glass-btn w-full" onClick={() =>
          router.push(`/dashboard/interview/${interview.mockId}/feedback`)
        }>
          Feedback
        </Button>
      </div>
    </div>
  );
}
