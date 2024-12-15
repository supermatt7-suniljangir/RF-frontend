import { GoogleOAuthProvider } from "@react-oauth/google";

const GoogleAuthWrapper = ({ children }: { children: React.ReactNode }) => {

    const googleClientId: string =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        "298361459600-pe2mfqhml6qpji740893fke4r7646kh3.apps.googleusercontent.com";

    return <GoogleOAuthProvider clientId={googleClientId}> {children} </GoogleOAuthProvider>
        ;
};

export default GoogleAuthWrapper;
