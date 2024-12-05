import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ProfilePhoto from "@/components/profileEditor/ProfilePhoto";
import { useForm } from "react-hook-form";
import { User } from "@/types/user";
import { useUser } from "@/contexts/UserContext";

const BasicInfoEdit: React.FC = () => {
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>();

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        profile: {
          profession: user.profile?.profession || "",
          phone: user.profile?.phone || "",
          bio: user.profile?.bio || "",
          website: user.profile?.website || "",
        },
      });
    }
  }, [user, reset]);

  const onSubmit = (data: User) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 self-center md:self-start">
          <ProfilePhoto />
        </div>

        <div className="flex-grow space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              {...register("fullName", {
                required: "Full name is required",
              })}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Enter your Phone number"
              {...register("profile.phone", {
                required: "Phone is required",
              })}
            />
            {errors.profile?.phone && (
              <span className="text-red-500 text-sm">
                {errors.profile.phone.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Input
              id="profession"
              placeholder="Enter your Profession"
              {...register("profile.profession", {
                required: "Phone is required",
              })}
            />
            {errors.profile?.profession && (
              <span className="text-red-500 text-sm">
                {errors.profile.profession.message}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself"
              className="w-full min-h-[100px] resize-none"
              {...register("profile.bio")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              placeholder="Enter your website URL"
              {...register("profile.website")}
            />
          </div>

          <Button
            type="submit"
            className="block py-2 px-6 rounded-md transition-colors F mx-auto relative"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BasicInfoEdit;
