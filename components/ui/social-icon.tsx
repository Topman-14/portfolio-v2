import { cn } from '@/lib/utils';
import Link from 'next/link';
import { FC } from 'react';
import { FaXTwitter, FaLinkedinIn, FaGithub } from "react-icons/fa6";


const icons = [
  {
    name: 'LinkedIn',
    icon: FaLinkedinIn,
  },
  {
    name: 'Twitter',
    icon: FaXTwitter,
  },
  {
    name: 'GitHub',
    icon: FaGithub,
  },
];

interface SocialIconsProps {
  name: string;
  className?: string;
  link: string;
}

const SocialIcons: FC<SocialIconsProps> = ({ name, className, link }) => {
  const Icon = icons.find((icon) => icon.name === name)?.icon;

  //todo: come back to this animation later
  if (!Icon) return null;
  return (
    <Link
    href={link}
    target="_blank"
    className={cn(
        'border border-white/10 text-white bg-white/10 rounded-full size-[35px] flex items-center justify-center transition-colors ease-in-out ',
        '[&>svg]:fill-current [&>svg]:transition-[fill] [&>svg]:duration-300  hover:border-malachite',
        className
      )}
  >
    <Icon size={14} />
  </Link>
  
  );
};

export default SocialIcons;
