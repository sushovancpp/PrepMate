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

  const { user } = useUser();
  const submittedRef = useRef(false);
  const previousQuestionIndexRef = useRef(activeQuestionIndex);

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({ 
    continuous: true,
    useLegacyResults: false 
  });

  /** 🎤 Update answer as user speaks */
  useEffect(() => {
    if (results?.length > 0) {
      const text = results.map(r => r.transcript).join(" ").trim();
      setUserAnswer(text);
    }
  }, [results]);

  /** 🧹 Reset everything when question changes */
  useEffect(() => {
    if (previousQuestionIndexRef.current !== activeQuestionIndex) {
      console.log("Question changed from", previousQuestionIndexRef.current, "to", activeQuestionIndex);
      
      if (isRecording) {
        stopSpeechToText();
      }
      
      setUserAnswer("");
      setResults([]);
      submittedRef.current = false;
      
      previousQuestionIndexRef.current = activeQuestionIndex;
    }
  }, [activeQuestionIndex, isRecording, stopSpeechToText, setResults]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setUserAnswer("");
      setResults([]);
      submittedRef.current = false;
      startSpeechToText();
    }
  };

  /** 🔧 Clean AI JSON */
  function cleanJson(text) {
    try {
      let cleaned = text.replace(/``````\n?/g, "").trim();
      const jsonStart = cleaned.indexOf("{");
      const jsonEnd = cleaned.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error("No JSON object found");
      }
      return cleaned.substring(jsonStart, jsonEnd + 1);
    } catch (err) {
      console.error("JSON cleaning error:", err);
      throw err;
    }
  }

  /** ⭐ Save Answer */
  const UpdateUserAnswer = async () => {
    if (!mockInterviewQuestion?.[activeQuestionIndex] || submittedRef.current || !userAnswer || userAnswer.length < 5) {
      toast.error("Please provide a valid answer");
      return;
    }
    
    submittedRef.current = true;
    setLoading(true);

    try {
      const question = mockInterviewQuestion[activeQuestionIndex].question;

      const prompt = `Evaluate this interview answer. Respond with ONLY valid JSON (no markdown):
Question: "${question}"
User Answer: "${userAnswer}"

Format: {"rating": number, "feedback": "text"}`;

      const ai = await groqChat(prompt);
      console.log("Raw AI response:", ai);
      
      const cleanedJson = cleanJson(ai);
      console.log("Cleaned JSON:", cleanedJson);
      
      const parsed = JSON.parse(cleanedJson);

      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer || "",
        userAns: userAnswer,
        rating: parsed.rating,
        feedback: parsed.feedback,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY HH:mm:ss"),
      });

      toast.success("Answer saved successfully!");
      
      setUserAnswer("");
      setResults([]);
      
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Saving failed: " + (err.message || "Unknown error"));
      submittedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}} />

      <div className="flex flex-col items-center mt-4 sm:mt-6 px-4 w-full">
        {/* Webcam Container - Modern Animated */}
        <div
          className="
            relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl 
            bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl
            border border-white/20 
            shadow-[0_0_40px_rgba(147,51,234,0.2),0_0_80px_rgba(147,51,234,0.1)]
            flex items-center justify-center
            w-full max-w-[320px] h-[280px]
            sm:w-[380px] sm:h-[320px]
            md:w-[420px] md:h-[360px]
            transform transition-all duration-500 ease-out
            hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(147,51,234,0.3),0_0_100px_rgba(147,51,234,0.15)]
            animate-fade-in
          "
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 animate-pulse-slow opacity-50" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Image 
              src="/webcam.png" 
              width={120} 
              height={120} 
              alt="cam-bg" 
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 animate-float"
            />
          </div>

          <Webcam
            mirrored
            className="rounded-xl z-10 shadow-2xl ring-2 ring-white/10 transition-all duration-300"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
          
          {/* Recording Indicator */}
          {isRecording && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-red-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full animate-fade-in">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="text-white text-xs font-medium">REC</span>
            </div>
          )}
        </div>

        {/* Recording Button - Modern Animated */}
        <Button
          disabled={loading}
          variant="outline"
          className="
            mt-4 sm:mt-6 
            px-6 py-3 sm:px-8 sm:py-4 
            rounded-lg sm:rounded-xl
            text-sm sm:text-base font-medium
            bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl 
            border-2 border-white/30 text-white
            hover:from-white/20 hover:to-white/10 
            hover:border-white/50
            hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]
            active:scale-95
            transition-all duration-300 ease-out
            flex items-center gap-2 
            cursor-pointer
            w-full max-w-[280px] sm:max-w-none sm:w-auto
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            group
            relative overflow-hidden
          "
          onClick={StartStopRecording}
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          {isRecording ? (
            <span className="text-red-400 animate-pulse flex items-center gap-2 z-10">
              <StopCircle className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" /> 
              <span className="hidden sm:inline">Stop Recording</span>
              <span className="sm:hidden">Stop</span>
            </span>
          ) : (
            <span className="text-purple-300 flex items-center gap-2 z-10 group-hover:text-purple-200 transition-colors">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-bounce" /> 
              <span className="hidden sm:inline">Record Answer</span>
              <span className="sm:hidden">Record</span>
            </span>
          )}
        </Button>

        {/* Submit Button - Modern Animated */}
        <Button
          disabled={loading || !userAnswer || userAnswer.length < 5}
          variant="default"
          className="
            mt-3 sm:mt-4 
            px-6 py-3 sm:px-8 sm:py-4 
            rounded-lg sm:rounded-xl
            text-sm sm:text-base font-semibold
            w-full max-w-[280px] sm:max-w-none sm:w-auto
            bg-gradient-to-r from-purple-600 to-pink-600
            hover:from-purple-500 hover:to-pink-500
            hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]
            active:scale-95
            transition-all duration-300 ease-out
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            cursor-pointer
            relative overflow-hidden
            group
          "
          onClick={UpdateUserAnswer}
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          <span className="relative z-10 flex items-center gap-2">
            {loading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? "Saving..." : "Submit Answer"}
          </span>
        </Button>

        {/* Answer Preview - Modern Animated */}
        <div className="
          mt-4 sm:mt-5
          w-full max-w-[320px] sm:max-w-md 
          p-4 rounded-xl
          bg-gradient-to-br from-green-500/10 to-emerald-500/5
          border border-green-400/20
          backdrop-blur-sm
          text-center
          transition-all duration-500 ease-out
          hover:border-green-400/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]
          animate-fade-in
        ">
          <strong className="block mb-2 text-green-300 text-xs sm:text-sm font-semibold uppercase tracking-wide">
            Current Answer
          </strong> 
          <p className="text-green-200/90 text-xs sm:text-sm leading-relaxed break-words min-h-[40px] transition-all duration-300">
            {userAnswer || (
              <span className="text-green-300/50 italic">
                No answer recorded yet
              </span>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default RecordAnswerSection;
