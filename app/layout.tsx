import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CKEditor Demo App",
  description: "Demo of CKEditor functionality",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className=" border-b-slate-100 m-4 flex justify-center">
          <h6 className="p-2 text-2xl text-gray-700 hover:bg-slate-100 font-semibold flex gap-2">
            <Image
              src="ckeditor-2.svg"
              alt="ckeditor logo"
              width={24}
              height={24}
              className="grayscale"
            ></Image>
            <Link href="/">CDKEditor Demo App</Link>
          </h6>
        </nav>
        <main className="m-auto max-w-screen-xl">{children}</main>
      </body>
    </html>
  );
}
