particlesJS("particles-js", {
  "particles": {
    "number": {
      "value": 100, // Slightly more particles for a denser "mess"
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#ffffff"
    },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.6, // Slightly more visible
      "random": true,
      "anim": {
        "enable": true,
        "speed": 0.5,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2.5,
      "random": true,
      "anim": {
        "enable": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 120, // A bit closer for a denser look
      "color": "#ffffff",
      "opacity": 0.2, // More subtle lines
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1, // Slower, more deliberate movement
      "direction": "top", // Particles drift upwards
      "random": true,
      "straight": false,
      "out_mode": "out", // Disappear at the top
      "bounce": false,
      "attract": {
        "enable": false
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "repulse" // Mouse pushes particles away
      },
      "onclick": {
        "enable": false
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 140,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 400,
        "size": 40,
        "duration": 2,
        "opacity": 8,
        "speed": 3
      },
      "repulse": {
        "distance": 150, // How far the "push" effect reaches
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
});

