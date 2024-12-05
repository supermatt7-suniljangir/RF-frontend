import React from "react";
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

type SocialLinks = {
  twitter: string;
  github: string;
  linkedin: string;
  instagram: string;
  facebook: string;
};

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialLinks>({
    defaultValues: {
      twitter: "",
      github: "",
      linkedin: "",
      instagram: "",
      facebook: "",
    },
  });

  const onSubmit = (data: SocialLinks) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 mx-auto space-y-4">
      {socialConfig.map((social) => (
        <Card key={social.id} className="w-full rounded-sm px-4 py-2">
          <div className="flex items-center space-x-4">
            <Image
              width={24}
              height={24}
              src={social.icon}
              alt={`${social.id} icon`}
            />
            <div className="flex-grow">
              <Input
                {...register(social.id as keyof SocialLinks, {
                  pattern: {
                    value: new RegExp(social.pattern),
                    message: `Please enter a valid ${social.id} URL`,
                  },
                })}
                placeholder={social.placeholder}
                className="w-full"
              />
              {errors[social.id as keyof SocialLinks] && (
                <span className="text-sm text-red-500">
                  {errors[social.id as keyof SocialLinks]?.message}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
      <Button className="block mx-auto px-8">Save Changes</Button>
    </form>
  );
};

export default SocialEdit;
