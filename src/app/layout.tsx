import type {Metadata} from "next";
import "./globals.css";
import {UserProvider} from "@/contexts/UserContext";
import {Toaster} from "@/components/ui/toaster";
import {ThemeProvider} from "@/contexts/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import QueryClientWrapper from "@/Providers/QueryClientWrapper";
import GoogleAuthWrapper from "@/Providers/GoogleAuthWrapper";
import {SocketProvider} from "@/contexts/SocketContext";
import ConsentPopup from "@/components/common/ConsentPopup";

export const metadata: Metadata = {
    title: "RadiatorForge",
    description: "RadiatorForge – A creative hub combining industrial strength with artistic expression. Showcase your projects and connect with creators worldwide."
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`antialiased`}>
        <ThemeProvider>
            <QueryClientWrapper>
                <GoogleAuthWrapper>
                    <UserProvider>
                        <SocketProvider>
                            <Navbar/>
                            <ConsentPopup/>
                            {children}
                        </SocketProvider>
                    </UserProvider>
                </GoogleAuthWrapper>
            </QueryClientWrapper>
        </ThemeProvider>
        <Toaster/>
        </body>
        </html>
    );
}
