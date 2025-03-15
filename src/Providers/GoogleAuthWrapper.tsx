import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthWrapper = ({ children }: { children: React.ReactNode }) => {

    const googleClientId: string =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    return <GoogleOAuthProvider clientId={googleClientId}> {children} </GoogleOAuthProvider>
        ;
};

export default GoogleAuthWrapper;
