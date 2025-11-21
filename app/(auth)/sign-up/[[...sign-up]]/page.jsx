import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="bg-white min-h-screen">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">

        {/* LEFT SECTION */}
        <section className="relative flex h-48 sm:h-64 md:h-72 items-end bg-gray-900 
                            lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="PrepMate Background"
            src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          {/* ONLY SHOW ON LARGE SCREENS */}
          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="#">
              <span className="sr-only">Home</span>
              <svg
                className="h-8 sm:h-10"
                viewBox="0 0 28 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424..."
                  fill="currentColor"
                />
              </svg>
            </a>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Join PrepMate 🦑
            </h2>

            <p className="mt-4 leading-relaxed text-white/90">
              Create an account to access AI-powered interview practice.
            </p>
          </div>
        </section>

        {/* RIGHT SECTION */}
        <main className="flex items-center justify-center px-6 py-8 sm:px-10 
                         lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">

          <div className="max-w-lg w-full">

            {/* MOBILE HEADER */}
            <div className="block lg:hidden text-center">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <svg
                  className="h-8 sm:h-10"
                  viewBox="0 0 28 24"
                  fill="none"
                >
                  <path
                    d="M0.41 10.3847C1.14777 7.4194..."
                    fill="currentColor"
                  />
                </svg>
              </a>

              <h1 className="mt-4 text-3xl font-bold text-gray-900">
                Join PrepMate 🦑
              </h1>

              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Create your account and start practicing interviews instantly.
              </p>
            </div>

            {/* SIGN UP FORM */}
            <div className="mt-8 sm:mt-10">
              <SignUp />
            </div>

          </div>
        </main>

      </div>
    </section>
  );
}
