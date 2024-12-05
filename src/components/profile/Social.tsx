import React from "react";
import { Card } from "@/components/ui/card";
import XIcon from "@/media/x.svg";
import GithubIcon from "@/media/github.svg";
import LinkedInIcon from "@/media/linkedin.svg";
import InstagramIcon from "@/media/instagram.svg";
import FacebookIcon from "@/media/facebook.svg";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const links = [
  { href: "https://twitter.com", icon: XIcon, alt: "X/Twitter" },
  { href: "https://github.com", icon: GithubIcon, alt: "GitHub" },
  { href: "https://linkedin.com", icon: LinkedInIcon, alt: "LinkedIn" },
  { href: "https://instagram.com", icon: InstagramIcon, alt: "Instagram" },
  { href: "https://facebook.com", icon: FacebookIcon, alt: "Facebook" },
];

const Social = () => {
  return (
    <div className="w-3/4 flex justify-around items-center flex-col">
      {links.map((link) => (
        <Card className="w-full rounded-sm px-8 py-1 hover:bg-muted hover:text-muted-foreground" key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex p-2 space-x-4 items-center w-full"
          >
            <Image width={24} height={24} src={link.icon} alt="Twitter" />
            <span className="text-center">{link.alt}</span>
            <ExternalLink className="!ml-auto relative" />
          </a>
        </Card>
      ))}
    </div>
  );
};

export default Social;
