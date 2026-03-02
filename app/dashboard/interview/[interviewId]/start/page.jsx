"use client";

import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";

const RecordAnswerSection = dynamic(
  () => import("./_components/RecordAnswerSection"),
  { ssr: false }
);

function StartInterview() {
  const params = useParams();
  const interviewId = params?.interviewId;

  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (interviewId) loadInterview();
  }, [interviewId]);

  /** 🧹 Load + Clean JSON coming from DB */
  const loadInterview = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      if (!result?.[0]) {
        console.log("❌ No interview data");
        return;
      }

      const raw = result[0].jsonMockResp;
      let parsed = [];

      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        console.log("❌ PARSE ERROR:", e);
        parsed = [];
      }

      if (!Array.isArray(parsed)) parsed = [];

      setMockInterviewQuestion(parsed);
      setInterviewData(result[0]);
    } catch (e) {
      console.log("❌ DB Fetch Error:", e);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      {!!mockInterviewQuestion.length && (
        <div className="flex justify-end gap-6 mt-6">
          {activeQuestionIndex > 0 && (
            <Button className="
            transition-all cursor-pointer hover:scale-105 hover:shadow-xl
            bg-green-200 hover:bg-green-300 text-black"
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
              Previous Question
            </Button>
          )}

          {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
            <Button className="
            transition-all cursor-pointer hover:scale-105 hover:shadow-xl
            bg-green-200 hover:bg-green-300 text-black"
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
              Next Question
            </Button>
          )}

          {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
            <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
              <Button className="
              transition-all cursor-pointer hover:scale-105 hover:shadow-xl
              bg-green-600 hover:bg-green-700 text-white">
                End Interview</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default StartInterview;
