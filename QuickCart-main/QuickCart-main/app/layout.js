import { Outfit } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  title: "QuickCart",
  description: "E-Commerce with Next.js ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster />
        <GoogleOAuthProvider clientId="198162282587-qtimarrel488av7p5v337q3p20k20g75.apps.googleusercontent.com">
          <AppContextProvider>
            {children}
          </AppContextProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
