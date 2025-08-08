
import React from 'react';
import WhispraLogo from './WhispraLogo';
import { useSettings } from '../context/SettingsContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { settings } = useSettings();
  
  const productLinks = [
    { name: 'Features', path: '/#features', type: 'anchor' },
    { name: 'Security', path: '/#security', type: 'anchor' },
    { name: 'For Business', path: '/business', type: 'route' },
    { name: 'Status', path: '#', type: 'anchor' },
  ];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Whistleblower Policy'];

  return (
    <footer className="bg-slate-900 border-t border-slate-800" id="contact">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* About & Founder */}
          <div className="lg:col-span-2">
            <WhispraLogo />
            {settings?.aboutUs && (
              <div className="mt-4">
                <h3 className="font-semibold text-white tracking-wider uppercase">About Us</h3>
                <p className="mt-2 text-gray-400 max-w-md">{settings.aboutUs}</p>
              </div>
            )}
            {settings?.founderName && (
              <div className="mt-6">
                 <h3 className="font-semibold text-white tracking-wider uppercase">About the Founder</h3>
                 <p className="mt-2 text-gray-300 font-semibold">{settings.founderName}</p>
                 <p className="mt-1 text-gray-400">{settings.founderInfo}</p>
                 <p className="mt-1 text-gray-400">{settings.founderContact}</p>
              </div>
            )}
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-white tracking-wider uppercase">Product</h3>
                <ul className="mt-4 space-y-3">
                  {productLinks.map((link) => (
                    <li key={link.name}>
                       <Link to={link.path} className="text-gray-400 hover:text-[var(--color-accent)] transition-colors duration-300">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
               <div>
                <h3 className="font-semibold text-white tracking-wider uppercase">Legal</h3>
                <ul className="mt-4 space-y-3">
                  {legalLinks.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[var(--color-accent)] transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
          </div>
          
          {/* Contact */}
          {settings && (settings.contactEmail || settings.contactPhone || settings.address) && (
            <div>
                 <h3 className="font-semibold text-white tracking-wider uppercase">Contact Us</h3>
                 <div className="mt-4 space-y-2 text-sm text-gray-400">
                    {settings.contactEmail && <p>Email: <a href={`mailto:${settings.contactEmail}`} className="hover:text-[var(--color-accent)]">{settings.contactEmail}</a></p>}
                    {settings.contactPhone && <p>Phone: {settings.contactPhone}</p>}
                    {settings.address && <p>Address: {settings.address}</p>}
                 </div>
            </div>
        )}
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} {settings?.companyName || 'Whisspra Inc.'} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
