"use client";

import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import Search from "./search";
import { AiOutlineSearch } from "react-icons/ai";
import { GlobalContext } from "@/context";
import AccountPopup from "./account-popup";
import CircleLoader from "../circle-loader";
import DetailsPopup from "../details-popup";


export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  const {
    setPageLoader, loggedInAccount, setAccounts, accounts, setLoggedInAccount,
    pageLoader, showDetailsPopup, setShowDetailsPopup,
  } = useContext(GlobalContext);

  // TODO: Export menuItems
  const menuItems = [
    {
      id: "home",
      title: "Home",
      path: "/browse",
    },
    {
      id: "tv",
      title: "TV",
      path: "/tv",
    },
    {
      id: "movies",
      title: "Movies",
      path: "/movies",
    },
    {
      id: "my-list",
      title: "My List",
      path: `/my-list/${session?.user?.uid}/${loggedInAccount?._id}`,
    },
  ];

  //--------------- HANDLE SCROLL -------------------
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) setIsScrolled(true);
      else setIsScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  //--------------- FETCH ALL ACCOUNTS + USE EFFECT -------------------
  async function getAllAccounts() {
    const res = await fetch(
      `/api/account/get-all-accounts?id=${session?.user?.uid}`,
      {
        method: "GET",
      }
    );

    const data = await res.json();

    console.log(data);

    if (data && data.data && data.data.length) {
      setAccounts(data.data);
      setPageLoader(false);
    } else {
      setPageLoader(false);
    }
  }

  useEffect(() => {
    getAllAccounts();
  }, []);

  if (pageLoader) return <CircleLoader />;


  return (
    <div className="relative">
      <header className={`header ${isScrolled && "bg-[#141414]"} hover:bg-[#141414]`}>
        <div className="flex items-center space-x-2 md:space-x-10">
          <img onClick={() => router.push("/browse")} src="https://rb.gy/ulxxee" width={120} height={120} alt="NETFLIX" className="cursor-pointer object-contain"/>
          <ul className="hidden md:space-x-4 md:flex cursor-pointer">
            {menuItems.map((item) => (
              <li key={item.id} className="cursor-pointer text-[16px] font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]"
                onClick={() => {
                  setPageLoader(true);  router.push(item.path);  setSearchQuery("");  setShowSearchBar(false);
                }}>
                {item.title}
              </li>
            ))}
          </ul>
          <p>Made with ❤️ by Reactinary ⚛️</p>
        </div>
        <div className="font-light flex items-center space-x-4 text-sm">
          {showSearchBar ? (
            <Search
              pathName={pathName} router={router} searchQuery={searchQuery}
              setPageLoader={setPageLoader}
              setShowSearchBar={setShowSearchBar} setSearchQuery={setSearchQuery}
            />
          ) : (
            <AiOutlineSearch className="hidden sm:inline sm:w-6 sm:h-6 cursor-pointer"
              onClick={() => setShowSearchBar(true)}/>
          )}
          <div onClick={() => setShowAccountPopup(!showAccountPopup)} className="flex gap-2 items-center cursor-pointer">
            <img className="max-w-[30px] rounded min-w-[20px] max-h-[30px] min-h-[20px] object-cover w-[30px] h-[30px]" src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABfNXUMVXGhnCZwPI1SghnGpmUgqS_J-owMff-jig42xPF7vozQS1ge5xTgPTzH7ttfNYQXnsYs4vrMBaadh4E6RTJMVepojWqOXx.png?r=1d4" alt="Current Profile"/>
            <p>{loggedInAccount && loggedInAccount.name}</p>
          </div>
        </div>
      </header>

      <DetailsPopup show={showDetailsPopup} setShow={setShowDetailsPopup} />
      {showAccountPopup && (
        <AccountPopup
          accounts={accounts} setPageLoader={setPageLoader}
          signOut={signOut}
          loggedInAccount={loggedInAccount} setLoggedInAccount={setLoggedInAccount}
        />
      )}
    </div>
  );
}
