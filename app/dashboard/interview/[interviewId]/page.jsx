"use client";

import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState, use } from 'react';
import Webcam from 'react-webcam';

function Interview({ params }) {

  // ⭐ FIX — unwrap the params Promise
  const { interviewId } = use(params);

  const [interviewData, setInterviewData] = useState();
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    console.log("Interview ID:", interviewId);
    GetInterviewDetails();
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    setInterviewData(result[0]);
  };

  return (
    <div className="my-10 px-4 sm:px-6">

      <h2 className="font-bold text-3xl text-white mb-10 text-center sm:text-left">
        Let's Get Started 🚀
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT SECTION */}
        <div className="flex flex-col my-5 gap-5">

          {/* Glass Role Box */}
          <div
            className="
              flex flex-col p-6 rounded-2xl 
              bg-white/10 backdrop-blur-xl
              border border-white/20 shadow-lg
              text-white gap-4
            "
          >
            <h2 className="text-base sm:text-lg">
              <strong className="text-white/70">Job Role / Position: </strong>
              {interviewData?.jobPosition}
            </h2>

            <h2 className="text-base sm:text-lg">
              <strong className="text-white/70">Job Description / Tech Stack: </strong>
              {interviewData?.jobDesc}
            </h2>

            <h2 className="text-base sm:text-lg">
              <strong className="text-white/70">Years of Experience: </strong>
              {interviewData?.jobExperience}
            </h2>
          </div>

          {/* NOTE BOX */}
          <div
            className="
              p-6 rounded-2xl 
              bg-gradient-to-r from-blue-500 to-blue-700
              shadow-xl text-white
            "
          >
            <h2 className="flex gap-2 items-center font-semibold text-lg">
              <Lightbulb className="h-5 w-5" />
              <span>NOTE</span>
            </h2>

            <p className="mt-3 text-white/90 leading-relaxed">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col justify-start">

          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              className="
                rounded-2xl shadow-xl border border-white/20
                bg-black/40 backdrop-blur-xl
              "
              style={{
                height: 350,
                width: "100%",
              }}
            />
          ) : (
            <>
              <div
                className="
                  h-72 w-full flex items-center justify-center 
                  bg-white/10 backdrop-blur-xl
                  border border-white/20 rounded-2xl shadow-lg
                "
              >
                <WebcamIcon className="
                transition-all cursor-pointer hover:scale-105 hover:shadow-xl
                h-28 w-28 text-white/40" />
              </div>

              <Button
                variant="ghost"
                className="
                  w-full mt-6 text-white 
                  bg-white/10 backdrop-blur-xl 
                  border border-white/20 rounded-xl
                  hover:bg-white/20 transition-all cursor-pointer
                "
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      {/* START BUTTON */}
      <div className="
      transition-all cursor-pointer hover:scale-105 hover:shadow-xl
      flex justify-end mt-12">
        <Link href={`/dashboard/interview/${interviewId}/start`}>
          <Button
            className="
            transition-all cursor-pointer hover:scale-105 hover:shadow-xl
              px-6 py-3 text-white 
              bg-blue-600 hover:bg-blue-700 
              rounded-xl shadow-lg
            "
          >
            Start Interview
          </Button>
        </Link>
      </div>

    </div>
  );
}

export default Interview;
