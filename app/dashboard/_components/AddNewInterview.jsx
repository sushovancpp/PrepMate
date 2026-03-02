"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ⭐ Import Groq API wrapper
import { groqChat } from "@/utils/GroqAIModel";

function AddNewInterview() {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setjobPosition] = useState("");
  const [jobDesc, setjobDeDesc] = useState("");
  const [jobExperience, setjobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  /** 🧼 Clean JSON returned by AI */
  function cleanJson(text) {
    return text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/\n/g, "")
      .replace(/\r/g, "")
      .trim();
  }

  /** 🛡 Safe JSON parsing */
  function safeParseJSON(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.error("❌ JSON Parse Error:", e);
      toast.error("AI returned invalid JSON. Try again.");
      return [];
    }
  }

  /** 🚀 Submit interview request */
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

const InputPrompt = `
You are a professional technical interviewer.

Generate exactly ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions
and provide a meaningful, non-empty answer for EACH question.

Job Role: ${jobPosition}
Job Description: ${jobDesc}
Experience Required: ${jobExperience} years

STRICT RULES:
- Each question MUST have an answer
- Answers must be maximum 1–3 sentences
- DO NOT leave answers empty
- DO NOT use placeholders like "..."
- DO NOT add any explanation or extra text
- ONLY return valid JSON

FORMAT (follow exactly):
[
  {
    "question": "Question here",
    "answer": "Detailed answer here"
  }
]
`;

    try {
      // ⭐ CALL GROQ AI
      const rawResponse = await groqChat(InputPrompt);

      let cleanedText = cleanJson(rawResponse);
      const parsedJson = safeParseJSON(cleanedText);

      if (!Array.isArray(parsedJson) || parsedJson.length === 0) {
        toast.error("AI did not generate questions.");
        throw new Error("Invalid AI data");
      }

      // ⭐ Insert into DB
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: JSON.stringify(parsedJson),
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("HH:mm:ss DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });

      // ⭐ Redirect
      setOpenDailog(false);
      router.push("/dashboard/interview/" + resp[0]?.mockId);
    } catch (error) {
      console.error("❌ Interview creation error:", error);
      toast.error("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
  {/* Added backdrop-blur-md to the overlay for that frosted look on the background */}
  <DialogContent className="max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] rounded-3xl p-8">
    
    <DialogHeader>
      <DialogTitle className="text-3xl font-bold text-white tracking-tight">
        Describe Your Interview
      </DialogTitle>
      <DialogDescription className="text-gray-300/80 text-base mt-2">
        Add job role, description, and experience to get started.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="space-y-5">
        
        {/* Job Role */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-blue-200/70 ml-1 uppercase tracking-wider">Job Role / Position</label>
          <input
            placeholder="Fullstack Developer"
            required
            onChange={(e) => setjobPosition(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-blue-200/70 ml-1 uppercase tracking-wider">Job Description</label>
          <textarea
            placeholder="React, NodeJS, MongoDB etc."
            required
            onChange={(e) => setjobDeDesc(e.target.value)}
            className="w-full h-32 px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
          />
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-blue-200/70 ml-1 uppercase tracking-wider">Years of Experience</label>
          <input
            type="number"
            placeholder="2"
            required
            onChange={(e) => setjobExperience(e.target.value)}
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex justify-end items-center gap-6 mt-10">
        <button 
          type="button" 
          onClick={() => setOpenDailog(false)}
          className="text-gray-400 hover:text-white transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer active:scale-95"
        >
          Generate Questions
        </button>
      </div>
    </form>
  </DialogContent>
</Dialog>
    </div>
  );
}

export default AddNewInterview;
