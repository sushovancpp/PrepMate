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
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDailog} onOpenChange={setOpenDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Describe Your Interview</DialogTitle>
            <DialogDescription>
              Add job role, description, and experience.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4">
            <div className="text-xs">
              <div className="mt-7 my-3">
                <label>Job Role / Position</label>
                <input
                  placeholder="Fullstack Developer"
                  required
                  onChange={(e) => setjobPosition(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="my-2">
                <label>Job Description</label>
                <textarea
                  placeholder="React, NodeJS, MongoDB etc."
                  required
                  onChange={(e) => setjobDeDesc(e.target.value)}
                  className="w-full h-24 p-2 border rounded-md resize-none"
                />
              </div>

              <div className="my-1">
                <label>Years of Experience</label>
                <input
                  type="number"
                  placeholder="2"
                  required
                  onChange={(e) => setjobExperience(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-5 justify-end mt-4">
              <Button variant="ghost" type="button" onClick={() => setOpenDailog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin mr-2" /> Loading
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
