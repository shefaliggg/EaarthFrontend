import React from "react";

function ModernDataList({ items }) {
  return (
    <div className="my-4">
      {items.map((item, i) => (
        <div
          key={i}
          className={`grid grid-cols-[200px_1fr] gap-4 py-3.5 border-t text-sm leading-relaxed
            ${i === items.length - 1 ? "border-b" : ""}`}
        >
          <span className="font-medium text-[#222] text-[13px] pt-px">
            {item.label}
          </span>
          <span className="text-muted-foreground">{item.desc}</span>
        </div>
      ))}
    </div>
  );
}

export default ModernDataList;
