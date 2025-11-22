"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { groqChat } from "@/utils/GroqAIModel";

function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interviewData }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);

  const { user } = useUser();
  const submittedRef = useRef(false);

  // 🎤 Speech-to-text hook
  const { isRecording, results, startSpeechToText, stopSpeechToText, setResults } =
    useSpeechToText({ continuous: false });

  /** 🟢 Step 1 — Update final user answer ONLY when recording stops */
  useEffect(() => {
    if (!isRecording && results?.length > 0) {
      const text = results.join(" ").trim();
      setUserAnswer(text);
      console.log("🟢 Final STT text:", text);
      setReadyToSubmit(true); // Allow DB insert
    }
  }, [isRecording, results]);

  /** 🟢 Step 2 — Submit after STT text is ready (not before) */
  useEffect(() => {
    if (readyToSubmit && !submittedRef.current && userAnswer.length > 3) {
      submittedRef.current = true;
      UpdateUserAnswer();
    }
  }, [readyToSubmit, userAnswer]);

  const StartStopRecording = () => {
    submittedRef.current = false;
    setUserAnswer("");
    setResults([]);

    if (isRecording) stopSpeechToText();
    else startSpeechToText();
  };

  /** ⭐ Clean JSON from AI */
  function cleanJson(text) {
    return text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
  }

  /** ⭐ Main Save Function */
  const UpdateUserAnswer = async () => {
    console.log("🔥 SAVING ANSWER:", userAnswer);

    if (!mockInterviewQuestion?.[activeQuestionIndex]) return;

    setLoading(true);

    try {
      const question = mockInterviewQuestion[activeQuestionIndex].question;

      const prompt = `
        Evaluate the user's answer:
        Question: "${question}"
        User Answer: "${userAnswer}"

        Return ONLY JSON:
        {
          "rating": number(1-10),
          "feedback": "string"
        }
      `;

      const ai = await groqChat(prompt);
      const parsed = JSON.parse(cleanJson(ai));

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        rating: parsed.rating,
        feedback: parsed.feedback,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY HH:mm:ss")
      });

      toast.success("Answer saved successfully!");

    } catch (err) {
      console.error(err);
      toast.error("Saving failed.");
    }

    setLoading(false);
    setResults([]);
  };

  return (
    <div className="flex flex-col items-center mt-6">

      <div
        className="
          relative p-3 rounded-2xl bg-white/10 backdrop-blur-xl
          border border-white/20 shadow-[0_0_25px_rgba(161,100,255,0.55)]
          flex items-center justify-center
        "
        style={{ height: 380, width: 400 }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <Image src="/webcam.png" width={150} height={150} alt="cam-bg" />
        </div>

        <Webcam
          mirrored
          className="rounded-xl z-10"
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="mt-6 px-6 py-4 rounded-xl backdrop-blur-md border-white/30 text-white hover:bg-white/10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <span className="text-red-500 animate-pulse flex items-center gap-2">
            <StopCircle /> Stop Recording
          </span>
        ) : (
          <span className="text-purple-300 flex items-center gap-2">
            <Mic /> Record Answer
          </span>
        )}
      </Button>

      {/* 🔥 DEBUG OUTPUT */}
      <div className="mt-4 text-green-300 text-sm">
        <strong>Final Text:</strong> {userAnswer}
      </div>

    </div>
  );
}

export default RecordAnswerSection;
