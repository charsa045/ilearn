import { Suspense } from "react";

import PublicHeader from "@/components/layout/header";
import LoginClient from "./LoginClient";

export default function LoginPage() {

  return (
    <>
      <PublicHeader />

      <Suspense
        fallback={

          <div
            className="
              min-h-screen
              flex
              items-center
              justify-center
              bg-gradient-to-br
              from-blue-400
              via-blue-950
              to-emerald-600
              text-white
              text-xl
              font-bold
            "
          >
            Cargando...
          </div>

        }
      >

        <LoginClient />

      </Suspense>
    </>
  );
}