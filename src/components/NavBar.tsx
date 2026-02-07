'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/connect', label: 'Connect' },
  { href: '/goal', label: 'Goal' },
  { href: '/mode', label: 'Mode' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/balance', label: 'Balance' },
  { href: '/plan', label: 'Plan' }
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" style={{ fontFamily: 'Fraunces, serif', fontSize: '1.1rem' }}>
          BreakEven
        </Link>
        <div className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
            >
              {link.label}
            </Link>
          ))}
          <button className="button secondary" onClick={() => router.push('/')}>Quick exit</button>
        </div>
      </div>
    </nav>
  );
}
