"use client";

import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState, use } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  // ⭐ FIX — unwrap Next.js params Promise
  const { interviewId } = use(params);

  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    setFeedbackList(result);
  };

  return (
    <div className="relative min-h-screen px-6 py-10">

      {/* 🔥 Background Blobs (Purple × Blue premium style) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute w-[70vw] h-[70vw] top-[-20%] left-[-10%] rounded-full opacity-30 blur-[100px]"
          style={{
            background: "radial-gradient(circle at center, #6d28d9, transparent 70%)",
          }}
        />
        <div
          className="absolute w-[60vw] h-[60vw] bottom-[-20%] right-[-20%] rounded-full opacity-30 blur-[100px]"
          style={{
            background: "radial-gradient(circle at center, #3b82f6, transparent 70%)",
          }}
        />
      </div>

      {/* HEADER */}
      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-xl text-white/70 backdrop-blur-lg p-4 rounded-xl">
          No Interview Feedback Found
        </h2>
      ) : (
        <>
          <h2 className="text-4xl font-extrabold text-white drop-shadow mb-2">
            🎉 Congratulations!
          </h2>
          <h3 className="text-2xl font-semibold text-white/90">
            Here is your detailed interview feedback
          </h3>
          <p className="text-white/50 mt-1 text-sm">
            Each question includes your answer, correct answer & improvement tips.
          </p>

          {/* FEEDBACK LIST */}
          <div className="mt-8 space-y-6">
            {feedbackList.map((item, index) => (
              <Collapsible key={index} className="">

                {/* Trigger Card */}
                <CollapsibleTrigger
                  className="
                    w-full p-4 rounded-xl text-left flex justify-between items-center
                    bg-white/10 backdrop-blur-md border border-white/20
                    text-white/90 hover:bg-white/20 transition-all
                  "
                >
                  <span className="font-medium text-base">{item.question}</span>
                  <ChevronsUpDown className="h-5 w-5 opacity-70" />
                </CollapsibleTrigger>

                {/* Animated Content */}
                <CollapsibleContent
                  className="
                    mt-3 p-4 rounded-xl space-y-3
                    bg-white/5 backdrop-blur-md border border-white/10
                    shadow-inner animate-fadeSlide
                  "
                >
                  <p className="p-3 rounded-lg bg-red-900/20 border border-red-600/30 text-red-300 text-sm">
                    <strong>Rating:</strong> {item.rating}
                  </p>

                  <p className="p-3 rounded-lg bg-red-700/20 border border-red-500/30 text-red-200 text-sm">
                    <strong>Your Answer: </strong> {item.userAns}
                  </p>

                  <p className="p-3 rounded-lg bg-green-700/20 border border-green-500/30 text-green-200 text-sm">
                    <strong>Correct Answer: </strong> {item.correctAns}
                  </p>

                  <p className="p-3 rounded-lg bg-blue-700/20 border border-blue-500/30 text-blue-200 text-sm">
                    <strong>Feedback: </strong> {item.feedback}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </>
      )}

      {/* HOME BUTTON */}
      <div className="mt-10 flex justify-end">
        <Button
          onClick={() => router.replace("/dashboard")}
          className="
            bg-gradient-to-r from-blue-600 to-purple-700
            hover:opacity-90 transition-all rounded-xl px-6 text-white shadow-xl
          "
        >
          Go Home
        </Button>
      </div>

      {/* SMOOTH ANIMATION KEYFRAMES */}
      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Feedback;
