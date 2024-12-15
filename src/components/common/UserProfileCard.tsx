"use client";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import placeholder from "@/media/user.png";
import { MiniUser } from "@/types/user";
import { Button } from "../ui/button";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
interface ProfileCardProps {
    user: MiniUser;
}
const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
    const { user: currentUser } = useUser();

    if (!user) return null;
    return (
        <Card className="md:w-96 w-5/6 sm:w-[48%] p-2">
            <Link href={`/profile/${user._id}`}>
                <CardHeader className="flex flex-col items-center p-2">
                    <div className="w-20 h-20 relative">
                        <Image src={user?.avatar || placeholder} alt="Profile" className="relative w-24 h-24 rounded-full object-cover mb-2" fill />
                    </div>
                    <CardTitle>{user.fullName}</CardTitle>
                    <CardDescription>{user.profession || "No Profession Set"}</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-2">
                    <p>Available for hire: <b>{user?.availableForHire ? "Yes" : "No"}</b></p>
                </CardContent>
                <CardFooter className="flex justify-center p-2">
                    {currentUser?._id !== user._id && <Button
                    >View Profile</Button>}
                </CardFooter>
            </Link>
        </Card>
    );
}


export default ProfileCard;