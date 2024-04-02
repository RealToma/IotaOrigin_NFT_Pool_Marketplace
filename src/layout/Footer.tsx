import React from 'react';
import type { NextPage } from 'next';
import { FaDiscord, FaLinkedin, FaGlobe, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';

const links = [
  {
    title: 'Discord',
    url: 'http://discord.gg/MkTjZKE8fC',
    icon: <FaDiscord />,
  },
  {
    title: 'Twitter',
    url: 'https://twitter.com/origin_iota',
    icon: <FaTwitter />,
  },
  {
    title: 'LinkedIn',
    url: 'https://rw.linkedin.com/company/iotaorigin',
    icon: <FaLinkedin />,
  },
  {
    title: 'Website',
    url: 'https://www.iotaorigin.com/',
    icon: <FaGlobe />,
  },
];

const Footer: NextPage = () => {
  return (
    <div className='w-full flex flex-col md:flex-row justify-between items-center font-medium text-white opacity-60 text-xl mt-12 gap-2'>
      <span className='text-center md:text-left'>
        © 2022 Iotaorigin. All rights reserved
      </span>
      <div className='flex flex-row items-center gap-3'>
        {links.map(link => (
          <Link href={link.url} key={link.title}>
            {link.icon}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Footer;
