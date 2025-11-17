import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Link href="/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2Fdashboard">
        <Button>GO TO LOGIN PAGE</Button>
      </Link>
    </div>
  );
}
