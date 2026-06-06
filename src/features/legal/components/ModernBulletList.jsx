import React from 'react'

function ModernBulletList({ items, accent }) {
  return (
    <ul className="list-none p-0 my-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-sm py-[7px] pl-5 border-b relative leading-relaxed"
        >
          <span
            className="absolute left-0 top-4 w-1.5 h-px block"
            style={{ background: accent }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default ModernBulletList