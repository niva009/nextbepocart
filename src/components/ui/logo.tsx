import Image from 'next/image';
import Link from '@components/ui/link';
import cn from 'classnames';
import { siteSettings } from '@settings/site-settings';

import React from "react";

interface Props {
  lang: string;
  variant?: string;
  className?: string;
  href?: string;
  width?: number;
  height?: number;
}

const Logo: React.FC<Props> = ({
  className,
  variant,
  href = siteSettings.logo.href,
  width = 170,  // Default width
  height = 70,  // Default height
  ...props
}) => {
  return (
    <Link
      href={href}
      className={cn('inline-flex focus:outline-none', className)}
      {...props}
    >
      {variant === 'black' ? (
        <Image
          src={siteSettings.logo.urlReverse}
          alt={siteSettings.logo.alt}
          loading="eager"
          width={width}
          height={height}
        />
      ) : (
        <Image
          src={siteSettings.logo.url}
          alt={siteSettings.logo.alt}
          loading="eager"
          width={width}
          height={height}
        />
      )}
    </Link>
  );
};

export default Logo;
