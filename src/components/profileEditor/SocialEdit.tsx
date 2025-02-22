import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import XIcon from "@/media/x.svg";
import GithubIcon from "@/media/github.svg";
import LinkedInIcon from "@/media/linkedin.svg";
import InstagramIcon from "@/media/instagram.svg";
import FacebookIcon from "@/media/facebook.svg";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useUser } from "@/contexts/UserContext";
import { useUpdateUserProfile } from "@/features/profile/useUpdateProfile";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/app/loading";
import { User, Social } from "@/types/user";
import { redirect } from "next/navigation";

const socialConfig = [
  {
    id: "twitter",
    icon: XIcon,
    placeholder: "Enter X/Twitter profile URL",
    pattern:
      "^https?://(?:www\\.)?twitter\\.com/.+|^https?://(?:www\\.)?x\\.com/.+",
  },
  {
    id: "github",
    icon: GithubIcon,
    placeholder: "Enter GitHub profile URL",
    pattern: "^https?://(?:www\\.)?github\\.com/.+",
  },
  {
    id: "linkedin",
    icon: LinkedInIcon,
    placeholder: "Enter LinkedIn profile URL",
    pattern: "^https?://(?:www\\.)?linkedin\\.com/in/.+",
  },
  {
    id: "instagram",
    icon: InstagramIcon,
    placeholder: "Enter Instagram profile URL",
    pattern: "^https?://(?:www\\.)?instagram\\.com/.+",
  },
  {
    id: "facebook",
    icon: FacebookIcon,
    placeholder: "Enter Facebook profile URL",
    pattern: "^https?://(?:www\\.)?facebook\\.com/.+",
  },
];

const SocialEdit = () => {
  const { updateProfile, loading: isUpdating } = useUpdateUserProfile();
  const { user, setUser } = useUser();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Social>();

  useEffect(() => {
    if (user?.profile?.social) {
      reset({
        twitter: user.profile.social.twitter || undefined,
        github: user.profile.social.github || undefined,
        linkedin: user.profile.social.linkedin || undefined,
        instagram: user.profile.social.instagram || undefined,
        facebook: user.profile.social.facebook || undefined,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: Social) => {
    // Clean the data by removing empty strings and undefined values
    const cleanSocial = Object.entries(data).reduce((acc, [key, value]) => {
      if (value?.trim()) {
        acc[key as keyof Social] = value.trim();
      }
      return acc;
    }, {} as Partial<Social>);

    // Structure the data according to the User schema
    const updateData: Partial<User> = {
      profile: {
        social: cleanSocial
      }
    };

    const res = await updateProfile(updateData);

    if (!res || !res?.success) {
      toast({
        variant: "destructive",
        title: "Failed to update social links",
        description: "Please try again later",
      });
      return;
    }
    toast({
      variant: "default",
      title: "Profile updated successfully"
    });
    setUser(res.data);
    redirect("/profile");
  };


  return (
    isUpdating ? <Spinner /> : <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 mx-auto space-y-4">
      {socialConfig.map((social) => (
        <Card key={social.id} className="w-full rounded-sm px-4 py-2">
          <div className="flex items-center space-x-4">
            <Image
              width={24}
              height={24}
              src={social.icon}
              alt={`${social.id} icon`}
            />
            <div className="flex-grow space-y-1">
              <Input
                {...register(social.id as keyof Social, {
                  pattern: {
                    value: new RegExp(social.pattern),
                    message: `Please enter a valid ${social.id} URL`,
                  },
                  validate: (value) => {
                    if (!value) return true;
                    if (!value.startsWith('http://') && !value.startsWith('https://')) {
                      return 'URL must start with http:// or https://';
                    }
                    return true;
                  }
                })}
                placeholder={social.placeholder}
                className="w-full"
              />
              {errors[social.id as keyof Social] && (
                <span className="text-sm text-red-500">
                  {errors[social.id as keyof Social]?.message}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
      <Button
        type="submit"
        className="block mx-auto px-8"
        disabled={isUpdating}
      >
        {isUpdating ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default SocialEdit;