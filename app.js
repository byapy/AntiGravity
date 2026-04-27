// Configuración de Navbar al hacer scroll
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
      nav.classList.add('bg-black');
    } else {
      nav.classList.remove('bg-black');
    }
  });
}

// Lógica para botones Next/Prev en Carruseles de Películas
document.addEventListener('DOMContentLoaded', () => {
  const sliders = document.querySelectorAll('.slider-wrapper');

  sliders.forEach(slider => {
    const container = slider.querySelector('.slider-container');
    const btnPrev = slider.querySelector('.btn-prev');
    const btnNext = slider.querySelector('.btn-next');

    // Desplazamiento definido en pixeles
    const scrollAmount = 600;

    btnNext.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  });
});

// Lógica de Zona Horaria y Banderas para Eventos en Vivo
document.addEventListener('DOMContentLoaded', () => {
  const timeElements = document.querySelectorAll('.time-converted');
  if (timeElements.length === 0) return;

  // Obtener región usando el idioma del navegador (ej. 'es-MX' -> 'mx', 'en-US' -> 'us')
  const locale = navigator.language || 'en-US';
  let countryCode = 'us'; // Valor por defecto

  if (locale.includes('-')) {
    countryCode = locale.split('-')[1].toLowerCase();
  }

  // Establecer las banderas usando flagcdn
  const flagIcons = document.querySelectorAll('.flag-icon');
  flagIcons.forEach(img => {
    img.src = `https://flagcdn.com/24x18/${countryCode}.png`;
    img.style.display = 'inline-block';
  });

  // Convertir las horas UTC a formato local
  timeElements.forEach(el => {
    const utcDateText = el.getAttribute('data-utc');
    if (!utcDateText) return;

    const utcDate = new Date(utcDateText);

    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };

    const formattedTime = new Intl.DateTimeFormat(locale, timeOptions).format(utcDate);
    const formattedDate = new Intl.DateTimeFormat(locale, dateOptions).format(utcDate);

    // Capitalizar primera letra del día
    const dateCapitalized = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    el.textContent = `${dateCapitalized} • ${formattedTime}`;
  });

  // ------- Navegación al Reproductor de Video -------

  // Películas y Series Normales
  const movieCards = document.querySelectorAll('.slider-item-hover');
  movieCards.forEach(card => {
    card.addEventListener('click', () => {
      window.location.href = 'watch.html';
    });
  });

  // Emisiones en Vivo
  const liveButtons = document.querySelectorAll('.live-event-card button');
  liveButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'watch-live.html';
    });
  });

  // ------- Lógica de Validación Formulario Pagos -------
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCVC = document.getElementById('cardCVC');
  const cardName = document.getElementById('cardName');
  const paymentForm = document.getElementById('paymentForm');

  // Alternador de Metodos de Pago
  const methodRadios = document.querySelectorAll('.input-method');
  const btnSubmit = document.getElementById('btnSubmit');

  if (methodRadios.length > 0) {
    methodRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        // Ocultar todos
        document.querySelectorAll('.payment-dynamic-form').forEach(div => div.classList.add('d-none'));
        // Quitar required de las tarjetas si no está en sección de tarjetas
        if (cardNumber) [cardNumber, cardExpiry, cardCVC, cardName].forEach(i => i.removeAttribute('required'));
        document.getElementById('paypalEmail')?.removeAttribute('required');

        let textBtn = "Iniciar Membresía"

        if (e.target.id === 'cc') {
          document.getElementById('formCard').classList.remove('d-none');
          if (cardNumber) [cardNumber, cardExpiry, cardCVC, cardName].forEach(i => i.setAttribute('required', 'true'));
          textBtn = 'Suscribirse Protegido';
        } else if (e.target.id === 'paypal') {
          document.getElementById('formPaypal').classList.remove('d-none');
          document.getElementById('paypalEmail').setAttribute('required', 'true');
          textBtn = 'Continuar hacia PayPal';
        } else if (e.target.id === 'crypto') {
          document.getElementById('formCrypto').classList.remove('d-none');
          textBtn = 'Pagar con Cripto';
        } else if (e.target.id === 'apple') {
          document.getElementById('formApple').classList.remove('d-none');
          textBtn = '<i class="fa-brands fa-apple"></i> Apple Pay';
        }

        if (btnSubmit) {
            btnSubmit.innerHTML = `${textBtn} <i class="fa-solid fa-chevron-right fs-5 ms-2"></i>`;
        }
      });
    });
  }

  // Prevenir que se presionen teclas de texto en inputs exclusivamente numericos
  function blockNonNumericChars(e) {
    // Permitir atajos de teclado (Ctrl/Cmd + C, V, X, A) y modificadores
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    
    // Permitimos teclas de navegacion, borrado y tabulacion
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape', 'Enter', 'Shift'];
    if (!allowedKeys.includes(e.key) && !/^[0-9]$/.test(e.key)) {
      e.preventDefault(); // Bloquear al instante y nunca se llega a mostrar en el input
    }
  }

  if (cardNumber) {
    cardNumber.addEventListener('keydown', blockNonNumericChars);
    cardExpiry.addEventListener('keydown', blockNonNumericChars);
    cardCVC.addEventListener('keydown', blockNonNumericChars);

    // Formateo de Tarjeta (agregar espacios cada 4 números)
    cardNumber.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, ''); 
      let formatted = '';
      for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += value[i];
      }
      e.target.value = formatted;
    });

    // Formateo Dinámico de Fecha (MM/AA)
    cardExpiry.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      // Validar que mes sea de 01 a 12 automáticamente a medida que escribe
      if (value.length >= 2) {
        let month = parseInt(value.substring(0, 2), 10);
        if (month > 12) value = '12' + value.substring(2);
        if (month === 0) value = '01' + value.substring(2);
      }
      e.target.value = value;
    });

    // Validar nombre para NO permitir numeros
    cardName.addEventListener('keydown', function(e) {
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault(); // Se bloquean los numeros instantaneamente
      }
    });

    if (paymentForm) {
      paymentForm.addEventListener('submit', function(e) {
        // Ejecutamos validación local de longitudes solo si está la tarjeta elegida
        if (!document.getElementById('formCard').classList.contains('d-none')) {
            if (cardNumber.value.replace(/\D/g, '').length < 15) {
              e.preventDefault();
              alert('Error: Debe ingresar un número de tarjeta íntegro de 16 dígitos.');
            } else if (cardExpiry.value.length < 5) {
              e.preventDefault();
              alert('Error: La fecha de vencimiento es obligatoria y debe cumplir el formato MM/AA.');
            } else if (cardCVC.value.length < 3) {
              e.preventDefault();
              alert('Error: El CVC es demasiado corto.');
            } else {
               alert('¡Felicidades! Se ha activado la membresía exitosamente.');
            }
        } else {
            // Validacion de los demas sistemas por defecto se manejan el submit tradicional
            e.preventDefault();
            alert('¡Será redireccionado a su plataforma externa favorita, espere por favor!');
            window.location.href = "index.html";
        }
      });
    }
  }

});
