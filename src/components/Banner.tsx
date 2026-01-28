"use client";

import { useEffect, useState } from "react";

const slides = [
  { title: "تنبيه", text: "يرجى الالتزام بسلامة التخزين وإرجاع الأصناف التالفة." },
  { title: "معلومة", text: "يمكنك إنشاء طلب صرف وإرساله للموافقة خلال ثوانٍ." },
  { title: "تذكير", text: "الطلبات الموافق عليها تظهر في قائمة (الموافق عليها)." },
];

export default function Banner() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 3500);
    return () => clearInterval(t);
  }, []);

  const s = slides[i];

  return (
    <div className="rounded-2xl border bg-gray-900 text-white p-4 sm:p-6">
      <div className="text-sm opacity-80">{s.title}</div>
      <div className="text-lg sm:text-xl font-semibold mt-1">{s.text}</div>
      <div className="flex gap-2 mt-4">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 w-2 rounded-full ${idx === i ? "bg-white" : "bg-white/40"}`}
            aria-label={`slide-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
