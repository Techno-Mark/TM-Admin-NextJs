import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login - CMS",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
