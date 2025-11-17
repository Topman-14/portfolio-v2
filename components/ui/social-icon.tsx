'use client';

import { FC } from 'react';
import { FaXTwitter, FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import CircleButton from './circle-button';

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

  if (!Icon) return null;
  
  return (
    <CircleButton href={link} className={className}>
      <Icon size={14} className='relative z-10' />
    </CircleButton>
  );
};

export default SocialIcons;
