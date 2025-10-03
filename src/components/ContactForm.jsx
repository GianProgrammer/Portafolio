import { useEffect } from 'react';

export default function ContactForm() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      emailjs.init('SwjpxwMqH56lsr1BH');

      const form = document.getElementById('contact-form');
      if (!form) return;

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        emailjs.sendForm("service_w744fds","template_vphw6jb", form)
          .then(() => { alert('Mensaje enviado! 👍'); form.reset(); })
          .catch(err => { alert('Error al enviar el mensaje 😢'); console.error(err); });
      });
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
