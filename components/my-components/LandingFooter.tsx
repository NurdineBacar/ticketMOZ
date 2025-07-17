import { useTranslation } from "@/hooks/hook-langauge";
import Link from "next/link";
import React from "react";

const LandingFooter = () => {
  const t = useTranslation();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("companyName")}</h3>
            <p className="text-gray-400 mb-4">
              A plataforma completa para gestão de eventos, venda de ingressos e
              controle de acesso.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("usefulLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition"
                >
                  {/* {t("home")} */}
                  "Home"
                </Link>
              </li>
              <li>
                <Link
                  href="/eventos"
                  className="text-gray-400 hover:text-white transition"
                >
                  {/* {t("events")} */}
                  Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/sobre"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("aboutUs")}
                  SObre Nos
                </Link>
              </li>
              <li>
                <Link
                  href="/termos"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("termsOfUse")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacidade"
                  className="text-gray-400 hover:text-white transition"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t("contact")}</h3>
            <p className="text-gray-400 mb-2">
              {t("email")}: contato@mozticket.com
            </p>
            <p className="text-gray-400 mb-2">{t("phone")}: +258 84 999-9999</p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} MozTicket. {t("copyrightText")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
