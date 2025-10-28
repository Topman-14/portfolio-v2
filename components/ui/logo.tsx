import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({
  className,
  link = false,
  width = 28,
  height = 28,
  color = 'black',
  variant = ''
}: {
  className?: string;
  link?: boolean;
  width?: number;
  height?: number;
  variant?: 'full' | '';
  color?: 'black' | 'white'
}) => {
  const logo_content = (
    <Image
      width={width}
      height={height}
      className={!link ? cn(className, 'm-2') : undefined}
      alt=''
      src={`/img/svg/logo-${color}${variant}.svg`}
    />
  );

  if (link) {
    return (
      <Link className={cn(className, 'm-2 block')} href={'/'}>
        {logo_content}
      </Link>
    );
  } else {
    return logo_content;
  }
};

export default Logo;
