import { useContextState } from "./hook/state";
import { AcaoPage } from "./pages/Acao";
import { BaseOrigemPage } from "./pages/BaseOrigem";
import { CampanhaPage } from "./pages/Campanha";
import { ClientesPage } from "./pages/Clientes";
import { ConversorPage } from "./pages/Conversor";
import { EncurtadorPage } from "./pages/Encurtador";
import { HistoricoPage } from "./pages/Historico";
import { LPsPage } from "./pages/LPs";
import { PainelPage } from "./pages/Painel";
import { ShortUrlsPage } from "./pages/ShortURLS";
import { UrlDestinoPage } from "./pages/UrlDestino";
import { UsuarioPage } from "./pages/Usuario";

export function App() {
  const { isFocus } = useContextState();
  return (
    <>
      <div className="overflow-y-auto w-full">
        <div className="mx-auto">
          {isFocus === "user" && <UsuarioPage />}
          {isFocus === "customers" && <ClientesPage />}
          {isFocus === "campaign" && <CampanhaPage />}
          {isFocus === "action" && <AcaoPage />}
          {isFocus === "lps" && <LPsPage />}
          {isFocus === "shorturl" && <ShortUrlsPage />}
          {isFocus === "conversor" && <ConversorPage />}
          {isFocus === "history" && <HistoricoPage />}
          {isFocus === "originbase" && <BaseOrigemPage />}
          {isFocus === "destinationurl" && <UrlDestinoPage />}
          {isFocus === "shorter" && <EncurtadorPage />}
          {isFocus === "dashboard" && <PainelPage />}
        </div>
      </div>
    </>
  );
}
