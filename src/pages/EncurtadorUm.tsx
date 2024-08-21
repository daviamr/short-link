import { AlertMessage } from "@/components/alert_message";
import { BarraProgresso } from "@/components/BarraProgresso";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hook/Auth";
import {
  campaignData,
  conversorData,
  createNewLink,
  customerData,
  dataAction,
  DataProps,
  urlData,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { AxiosError } from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const verifyCreateLink = z.object({
  customer: z.string().min(1, ''),
  campaignId: z.number().min(1, ''),
  actionId: z.number().min(1, ''),
  baseUrlId: z.number().min(1, ''),
  alphabetId: z.number().min(1, ''),
  longUrl: z.string().min(4, '*Digite uma url válida'),
  replace: z.string().min(2, '*Mínimo de 2 caracteres.'),
  sheet: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: '*Selecione um arquivo',
    }),
  length: z.number(),
  qrCode: z.boolean(),
});

type encurtadorDados = z.infer<typeof verifyCreateLink>;

type HandleCreateLinkProps = {
  handleCreateLink: ({
    actionId,
    baseUrlId,
    alphabetId,
    longUrl,
    replace,
    sheet,
    length,
    qrCode,
  }: createNewLink) => void;
  data: DataProps;
};

export function EncutadorUm() {
  const { data, handleCreateLink } = useAuth() as HandleCreateLinkProps;
  const [actions, setActions] = useState([]);
  const [clients, setClients] = useState<customerData[]>([]);
  // const [progress, setProgress] = useState(0);
  // const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [acoes, setAcoes] = useState<dataAction[]>([]);
  const [baseUrl, setBaseUrl] = useState<urlData[]>([]);
  const [conversor, setConversor] = useState<conversorData[]>([]);
  const [qrCodeActive, setQrCodeActive] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<number>(6);
  const linkLength = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
  ];

  //FUNÇÃO SALVANDO NO ESTADO O VALOR DE COMPRIMENTO
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setSelectedValue(newValue);
  };

  //SALVANDO O CLIENTE SELECIONADO
  const clienteSelecionado =
    clients
      .filter((customer) => selectedClient === customer.name)
      .map((customer) => customer.id)
      .join(", ") || "Cliente não encontrado";

  //VALIDANDO O NOME DA CAMPANHA/AÇÃO/CONVERSOR E BUSCANDO O ID BASEADO NO CLIENTE
  const handleSelectCampaign = (value: string) => {
    const selectedCampaign = campanhas.find(
      (campanha) => campanha.name === value
    );
    if (selectedCampaign) {
      setValue("campaignId", selectedCampaign.id);
      console.log(`id da campanha: ${selectedCampaign.id}`);
    }
  };

  const handleSelectAction = (value: string) => {
    const selectedAction = acoes.find(
      (acao) => acao.name === value
    );
    if (selectedAction) {
      setValue("actionId", selectedAction.id);
      console.log(`id da ação: ${selectedAction.id}`);
    }
  };

  const handleSelectBaseUrl = (value: string) => {
    const selectedBaseUrl = baseUrl.find(
      (url) => url.url === value
    );
    if (selectedBaseUrl) {
      setValue("baseUrlId", selectedBaseUrl.id);
      console.log(`id da baseUrl: ${selectedBaseUrl.id}`);
    }
  };

  const handleSelectConversor = (value: string) => {
    const selectedConversor = conversor.find(
      (conversor) => conversor.name === value
    );
    if (selectedConversor) {
      setValue("alphabetId", selectedConversor.id);
      console.log(`id do conversor: ${selectedConversor.id}`);
    }
  };

  //FUNÇÃO SALVANDO NO ESTADO A QUANTIDADE DE CARACTERES DO LINK
  const generateLink = () => {
    return linkLength.slice(0, selectedValue).join("");
  };

  //FUNÇÃO SALVANDO NO ESTADO O CLIENTE SELECIONADO
  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
  };

  //SUBMIT PARA A PROGRESSBAR
  // const handleSubmitProgressBar = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   setLoading(true);
  //   setProgress(20);

  //   try {
  //     const interval = setInterval(() => {
  //       setProgress((prev) => (prev < 90 ? prev + 10 : prev));
  //     }, 500);

  //     const response = await api.post(`/links`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${data.jwtToken}`,
  //       },
  //       // Passe os dados do formulário aqui
  //       body: JSON.stringify({
  //         dados: "seus dados aqui",
  //       }),
  //     });

  //     clearInterval(interval);
  //     if (response.status >= 200 && response.status < 300) {
  //       const data = response.data;
  //       setProgress(100);
  //       console.log("Dados recebidos:", data);
  //     } else {
  //       console.error("Erro na requisição");
  //       setProgress(0);
  //     }
  //   } catch (error) {
  //     console.error("Erro na requisição:", error);
  //     setProgress(0);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  //GET AÇÕES
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(`/actions`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setActions(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as campanhas, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, [actions]);

  //GET CLIENTES
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(`/clients`, {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setClients(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as campanhas, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, [clients]);

  //GET BASEURL
  useEffect(() => {
    async function handleGetBaseUrl() {
      try {
        const response = await api.get("/base-url", {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setBaseUrl(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as URLs, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetBaseUrl();
  }, [baseUrl]);

  //GET CONVERSOR
  useEffect(() => {
    async function handleGetConversor() {
      try {
        const response = await api.get("/alphabets", {
          headers: {
            Authorization: `Bearer ${data.jwtToken}`,
          },
        });
        setConversor(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar os conversores, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetConversor();
  }, [conversor]);

  //GET BUSCANDO AS CAMPANHAS DO CLIENTE SELECIONADO
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(
          `/campaigns?clientId=${clienteSelecionado}`,
          {
            headers: {
              Authorization: `Bearer ${data.jwtToken}`,
            },
          }
        );
        setCampanhas(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as campanhas, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, [campanhas]);

  //GET BUSCANDO AS AÇÕES DO CLIENTE SELECIONADO
  useEffect(() => {
    async function handleGetUsers() {
      try {
        const response = await api.get(
          `/actions?clientId=${clienteSelecionado}`,
          {
            headers: {
              Authorization: `Bearer ${data.jwtToken}`,
            },
          }
        );
        setAcoes(response.data);
      } catch (error: unknown) {
        if (error instanceof AxiosError && error.response) {
          AlertMessage(error.response.data.message, "error");
        } else {
          AlertMessage(
            "Não foi possível carregar as campanhas, tente novamente mais tarde.",
            "error"
          );
        }
      }
    }
    handleGetUsers();
  }, [acoes]);

  //VALIDAÇÃO
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<encurtadorDados>({
    resolver: zodResolver(verifyCreateLink),
    defaultValues: {
      actionId: 0,
      baseUrlId: 0,
      alphabetId: 0,
      longUrl: "",
      replace: "",
      sheet: null,
      length: 6,
      qrCode: false,
    },
  });

  function createLink(data: encurtadorDados) {
    const {
      actionId,
      baseUrlId,
      alphabetId,
      longUrl,
      replace,
      sheet,
    } = data;
    
    handleCreateLink({ actionId, baseUrlId, alphabetId, longUrl, replace, sheet, length: selectedValue, qrCode: qrCodeActive });
    // reset();
  }

  return (
    <>
      <div className="pt-12 px-8 bg-transparent rounded-md border border-input w-[480px] m-auto">
        <h1 className="text-3xl font-semibold w-max m-auto pb-8">
          Lorem ipsum dolor
        </h1>
        <form onSubmit={handleSubmit(createLink)}>
          <div className="grid grid-cols-4 gap-4 max-w-[500px]">
            <div className="col-span-2">
              {/* SELECT CUSTOMER */}
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleSelectChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent className={`${errors.customer}`}>
                      <SelectGroup>
                        <SelectLabel>Clientes</SelectLabel>
                        {clients.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.customer && (
                <span className="text-xs text-rose-400 font-normal">
                  *Selecione um cliente
                </span>
              )}
              {/* FINAL SELECT CUSTOMER */}
            </div>
            <div className="col-span-2">
              {/* SELECT CAMPAIGN */}
              <Controller
                name="customer"
                control={control}
                render={() => (
                  <Select
                    disabled={!selectedClient}
                    onValueChange={handleSelectCampaign}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedClient
                            ? "Cliente não selecionado"
                            : "Selecione a campanha"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Campanhas</SelectLabel>
                        {campanhas.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.campaignId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/*FINAL CAMPAIGN*/}
            </div>
            <div className="col-span-2">
              {/* SELECT ACTION */}
              <Controller
                name="actionId"
                control={control}
                render={() => (
                  <Select
                  disabled={!selectedClient}
                  onValueChange={handleSelectAction}>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedClient
                            ? "Cliente não selecionado"
                            : "Selecione a ação"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Ações</SelectLabel>
                        {acoes.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.actionId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT ACTION */}
            </div>
            <div className="col-span-2">
              {/* SELECT SHORTENER */}
              <Controller
                name="baseUrlId"
                control={control}
                render={() => (
                  <Select
                  onValueChange={handleSelectBaseUrl}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o encurtador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Encurtadores</SelectLabel>
                        {baseUrl.map((i, index) => (
                          <SelectItem value={i.url} key={index}>
                            {i.url}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.baseUrlId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
              {/* FINAL SELECT SHORTENER */}
            </div>
            <div className="col-span-4">
              {/* SELECT CONVERSOR */}
              <Controller
                name="alphabetId"
                control={control}
                render={() => (
                  <Select
                  onValueChange={handleSelectConversor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o conversor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Conversores</SelectLabel>
                        {conversor.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.alphabetId && (
                <span className="text-xs text-rose-400 font-normal">
                  *Selecione um conversor
                </span>
              )}
              {/* FINAL SELECT CONVERSOR */}
            </div>
            <div className="flex flex-col gap-1 col-span-4">
            <input
              type="file"
              {...register("sheet")}
                className={`cursor-pointer p-1 bg-transparent rounded-md border border-input col-span-4 ${
                  errors.sheet && "border-rose-400 bg-rose-100"
                }"col-span-4"`}
              />
              {errors.sheet && (
                <span className="col-span-4 text-nowrap text-xs text-rose-400 font-normal">
                  {typeof errors.sheet.message === "string" ? errors.sheet.message : ''}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="urlFinal" className="font-semibold">
                Preencha a URL final
              </label>
              <input
                id="urlFinal"
                type="text"
                placeholder="https://"
                {...register("longUrl")}
                className={`pl-4 bg-transparent rounded-md border border-input min-h-[36px] ${
                  errors.longUrl && "border-rose-400"
                }`}
            />
            {errors.longUrl && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.longUrl.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1 col-span-2">
              <label htmlFor="urlFinal" className="font-semibold">
                Parâmetro a substituir
              </label>
              <input
                id="urlSubstituida"
                type="text"
                placeholder=""
                {...register("replace")}
                className={`pl-4 bg-transparent rounded-md border border-input min-h-[36px] ${
                  errors.replace && "border-rose-400"
                }`}
            />
            {errors.replace && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.replace.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="comprimento" className="font-semibold">
                Comprimento
              </Label>
              <Input
                id="comprimento"
                type="number"
                value={selectedValue}
                onChange={handleValueChange}
                min={6}
                max={20}
                className="col-span-1"
              />
            </div>
            <div className="flex items-end col-span-3">
              <Input
                type="text"
                value={`exemplo.com/${generateLink()}`}
                disabled
              />
            </div>
            <div className="flex items-center gap-4 col-span-4">
              <Input
                id="qrCode"
                type="checkbox"
                className="max-w-[16px]"
                checked={qrCodeActive}
                onChange={(e) => setQrCodeActive(e.target.checked)}
              />
              <Label htmlFor="qrCode" className="text-nowrap cursor-pointer">
                Gerar QRCode
              </Label>
            </div>
          </div>
          <div className="pb-12 text-right mt-8 max-w-[500px]">
            <Button className="w-full" variant="secondary" /*disabled={loading}*/>
              <div className="flex items-center gap-2">
                <Send size={18} />
                Enviar
              </div>
            </Button>
          </div>

          {/* ProgressBar */}
          {/* {loading && <BarraProgresso value={progress} />} */}
        </form>
      </div>
    </>
  );
}