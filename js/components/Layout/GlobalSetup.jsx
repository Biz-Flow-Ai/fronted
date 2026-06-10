const { useState, useEffect } = React;

// Настройка заглушки для Framer Motion, если библиотека не загружена
window.motion = (window.FramerMotion && window.FramerMotion.motion)
  ? window.FramerMotion.motion
  : { 
      div: ({ children, ...props }) => React.createElement('div', props, children),
      span: ({ children, ...props }) => React.createElement('span', props, children)
    };

function GlobalSetup() {
  // Этот компонент отвечает за глобальные настройки или побочные эффекты
  return null;
}

window.GlobalSetup = GlobalSetup;
