import Link from "next/link";

type Props = {
  title: string;
  desc: string;
  href: string;
};

export default function ServiceCard({ title, desc, href }: Props) {
  return (
    <Link
      href={href}
      className="block rounded-xl border p-4 hover:bg-gray-50 transition"
    >
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </Link>
  );
}
