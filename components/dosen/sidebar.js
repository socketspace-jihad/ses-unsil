import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";

export default function DosenSidebar(){

    const router = useRouter();

    return <aside className="w-64 bg-gray-900 text-white">
    <div className="p-4 text-lg font-bold">Smart Exam System</div>
    <nav className="mt-4">
      <ul>
        <Link href={{
            pathname: "/admin/tes-mata-kuliah"
        }}>
            <li className="px-4 py-2 hover:bg-gray-700">
            Tes Mata Kuliah
            </li>
        </Link>
        <Link href={{
            pathname: "/admin/tes-potensi-akademik"
        }}>
            <li className="px-4 py-2 hover:bg-gray-700">
                Tes Potensi Akademik
            </li>
        </Link>
        <Link href={{
            pathname: "/admin/profile"
        }}>
            <li className="px-4 py-2 hover:bg-gray-700">
            Profile
            </li>
        </Link>
        <li className="px-4 py-2 hover:bg-gray-700">
          <button onClick={() => { 
            setCookie(null, "auth-token", null, { path: "/" });
            router.push("/admin/auth");
           }} className="w-full text-left">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </aside>
}