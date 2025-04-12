import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaYoutube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Footer.css';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Рецепти',
      links: ['Закуски', 'Основни ястия', 'Десерти', 'Салати', 'Напитки']
    },
    {
      title: 'Категории',
      links: ['Вегетариански', 'Без глутен', 'Кето', 'Нискокалорични', 'Бързи']
    },
    {
      title: 'Помощ',
      links: ['Често задавани въпроси', 'Контакти', 'Политика за поверителност', 'Условия за ползване']
    }
  ];

  const socialIcons = [
    { icon: <FaFacebook size={20} />, color: 'facebook' },
    { icon: <FaInstagram size={20} />, color: 'instagram' },
    { icon: <FaTwitter size={20} />, color: 'twitter' },
    { icon: <FaPinterest size={20} />, color: 'pinterest' },
    { icon: <FaYoutube size={20} />, color: 'youtube' }
  ];

  return (
    <footer className="gourmet-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="footer-brand">
              Gourmet<span className="brand-highlight">.</span>
            </h2>
            <p className="footer-description">
              Открийте света на кулинарните изкуства с нашите уникални рецепти и съвети за готвене.
            </p>
            <div className="social-icons">
              {socialIcons.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className={`social-icon ${social.color}`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer Links */}
        {footerLinks.map((section, index) => (
          <div key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="footer-section-title">{section.title}</h3>
              <ul className="footer-links">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a href="#" className="footer-link">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="footer-section-title">Абонирайте се за бюлетин</h3>
            <p className="footer-description">
              Получавайте най-новите рецепти и кулинарни съвети директно във вашата поща.
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Вашият имейл"
                className="newsletter-input"
              />
              <motion.button
                type="submit"
                className="newsletter-button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Абонирай се
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="footer-copyright"
      >
        <p>© {new Date().getFullYear()} Gourmet. Всички права запазени.</p>
      </motion.div>
    </footer>
  );
}
