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
      Generate ONLY ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions.
      Role: ${jobPosition}
      Description: ${jobDesc}
      Experience: ${jobExperience} years

      Return STRICT JSON:
      [
        {"question": "...", "answer": "..."},
        ...
      ]

      No text. No explanation. Only JSON.
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
    {/* Add New Button */}
    <div
      className="
        p-5
        rounded-xl 
        cursor-pointer 
        transition-all 
        bg-white/10 
        backdrop-blur-xl 
        border border-white/20 
        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        hover:scale-105 hover:bg-white/20
      "
      onClick={() => setOpenDailog(true)}
    >
      <h2 className="text-lg text-center font-semibold text-white">+ Add New</h2>
    </div>

    <Dialog open={openDailog} onOpenChange={setOpenDailog}>
      <DialogContent
        className="
          max-w-xl w-[92%] sm:w-full 
          bg-white/10 
          backdrop-blur-2xl 
          border border-white/30
          shadow-[0_8px_32px_rgba(0,0,0,0.25)]
          rounded-2xl
          p-6 sm:p-8
          text-white
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Describe Your Interview</DialogTitle>
          <DialogDescription className="text-white/70">
            Add job role, description, and experience.
          </DialogDescription>
        </DialogHeader>

        {/* FORM */}
        <form onSubmit={onSubmit} className="mt-4">
          <div className="text-sm space-y-5">

            {/* Job Role */}
            <div>
              <label className="font-semibold">Job Role / Position</label>
              <input
                placeholder="Fullstack Developer"
                required
                onChange={(e) => setjobPosition(e.target.value)}
                className="
                  w-full p-3 mt-1 
                  rounded-xl 
                  bg-white/20 
                  backdrop-blur-lg 
                  border border-white/30
                  placeholder-white/70 
                  text-white
                  focus:outline-none 
                  focus:border-white/70
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-semibold">Job Description</label>
              <textarea
                placeholder="React, NodeJS, MongoDB etc."
                required
                onChange={(e) => setjobDeDesc(e.target.value)}
                className="
                  w-full h-28 p-3 mt-1 
                  rounded-xl 
                  bg-white/20 
                  backdrop-blur-lg 
                  border border-white/30
                  placeholder-white/70 
                  text-white
                  resize-none
                  focus:outline-none 
                  focus:border-white/70
                "
              />
            </div>

            {/* Experience */}
            <div>
              <label className="font-semibold">Years of Experience</label>
              <input
                type="number"
                placeholder="2"
                required
                onChange={(e) => setjobExperience(e.target.value)}
                className="
                  w-full p-3 mt-1 
                  rounded-xl 
                  bg-white/20 
                  backdrop-blur-lg 
                  border border-white/30
                  placeholder-white/70 
                  text-white
                  focus:outline-none 
                  focus:border-white/70
                "
              />
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setOpenDailog(false)}
              className="
                transition-all cursor-pointer hover:scale-105 hover:shadow-xl 
                bg-white/10 
                text-white 
                hover:bg-white/20 
                rounded-xl
                px-6
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="
                transition-all cursor-pointer hover:scale-105 hover:shadow-xl
                bg-blue-600 
                hover:bg-blue-700 
                text-white 
                shadow-lg 
                rounded-xl 
                px-6
              "
            >
              {loading ? (
                <>
                  <LoaderCircle className="
                  animate-spin mr-2" /> Loading
                </>
              ) : (
                "Start Interview"
              )}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  </div>
);
}

export default AddNewInterview;
