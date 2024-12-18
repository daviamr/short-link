import { AlertMessage } from "@/components/alert_message";
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
  customerData,
  dataAction,
  DataProps,
  finalURLProps,
} from "@/interface/auth";
import { api } from "@/services/Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { AxiosError } from "axios";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { BarraProgresso } from "@/components/BarraProgresso";
import { SelectLP } from "@/components/SelectLP";
import { TooltipTracker } from "@/components/TooltipTracker";

const verifyCreateLink = z.object({
  customer: z.string().min(1, ""),
  campaignId: z.number().min(1, ""),
  actionId: z.number().min(1, ""),
  baseUrlId: z.number().min(1, ""),
  alphabetId: z.number().min(1, ""),
  redirectUrl: z.string().min(4, "*Digite uma url válida"),
  replace: z.string().min(2, "*Mínimo de 2 caracteres."),
  length: z.number(),
  qrCode: z.boolean(),
  sheet: z
    .any()
    .refine((files) => files instanceof FileList && files.length > 0, {
      message: "*Selecione um arquivo",
    }),
  customPath: z.string(),
  conversionPosition: z.string(),
});

type encurtadorDados = z.infer<typeof verifyCreateLink>;

type HandleCreateLinkProps = {
  // handleCreateLink: ({
  //   actionId,
  //   baseUrlId,
  //   alphabetId,
  //   redirectUrl,
  //   replace,
  //   length,
  //   qrCode,
  // }: createNewSingleLinkOptionThree) => void;
  data: DataProps;
};

export function EncurtadorTres() {
  const { data } = useAuth() as HandleCreateLinkProps;
  const [clients, setClients] = useState<customerData[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [campanhas, setCampanhas] = useState<campaignData[]>([]);
  const [acoes, setAcoes] = useState<dataAction[]>([]);
  const [conversor, setConversor] = useState<conversorData[]>([]);
  const [finalURL, setFinalURL] = useState<finalURLProps[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSelectedCampaign, setIsSelectedCampaign] = useState<boolean>(false);
  const [selectedPositionValue, setselectedPositionValue] = useState("pre");

  //FUNÇÃO SALVANDO NO ESTADO O VALOR DE COMPRIMENTO
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue("length", newValue);
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
      setIsSelectedCampaign(!!value);
      console.log(`id da campanha: ${selectedCampaign.id}`);
    }
  };

  const handleSelectAction = (value: string) => {
    const selectedAction = acoes.find((acao) => acao.name === value);
    if (selectedAction) {
      setValue("actionId", selectedAction.id);
      console.log(`id da ação: ${selectedAction.id}`);
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

  const handleSelectedPositionValue = (value: string) => {
    setselectedPositionValue(value);
  };

  //FUNÇÃO SALVANDO NO ESTADO A QUANTIDADE DE CARACTERES DO LINK
  const generateLink = () => {
    return linkLength.slice(0, selectedValue).join("");
  };

  //FUNÇÃO SALVANDO NO ESTADO O CLIENTE SELECIONADO
  const handleSelectChange = (value: string) => {
    setSelectedClient(value);
  };

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
        console.log(response.data);
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
  }, [data.jwtToken]);

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
        console.log(response.data);
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
  }, [data.jwtToken]);

  const handleGetFinalURL = async () => {
    try {
      const response = await api.get("/final-urls", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setFinalURL(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os usuários, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  useEffect(() => {handleGetFinalURL()}, [data.jwtToken])

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
  }, [clienteSelecionado]);

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
  }, [clienteSelecionado]);

  //VALIDAÇÃO
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<encurtadorDados>({
    resolver: zodResolver(verifyCreateLink),
    defaultValues: {
      actionId: 0,
      baseUrlId: 0,
      redirectUrl: "",
      replace: "",
      length: 6,
      qrCode: false,
    },
  });

  //
  const valorAssistido = watch("customPath");
  const finalUrlAssistido = watch("redirectUrl");
  const parametroAssistido = watch("replace");

  // Define a URL base sem a substituição do parametroAssistido
  const baseUrl = finalUrlAssistido || "https://exemplo.com";

  // Função para remover a palavra (parametroAssistido) apenas das últimas partes da URL
  const removeParametroAssistido = (url: string, parametro: string) => {
    const urlParts = url.split("/"); // Quebra a URL em partes
    const lastPart = urlParts[urlParts.length - 1]; // Pega a última parte

    // Se a última parte da URL contiver o parametroAssistido, remove-o
    if (lastPart.includes(parametro)) {
      urlParts[urlParts.length - 1] = lastPart.replace(parametro, ""); // Remove a palavra
    }

    // Junta as partes novamente, removendo barras duplicadas
    return urlParts.filter(Boolean).join("/"); // O filter(Boolean) remove strings vazias
  };

  // Remove parametroAssistido apenas das últimas partes da URL
  const urlWithReplacement = parametroAssistido
    ? removeParametroAssistido(baseUrl, parametroAssistido)
    : baseUrl;

  // Constrói a URL final para o valor, garantindo a posição correta de valorAssistido e generateLinkValue
  const finalValue =
    valorAssistido === "" && !urlWithReplacement
      ? `https://exemplo.com/${generateLink()}`
      : valorAssistido !== "" && selectedPositionValue === "pre"
      ? `${urlWithReplacement}/${valorAssistido}/${generateLink()}`
      : valorAssistido !== "" && selectedPositionValue === "pos"
      ? `${urlWithReplacement}/${generateLink()}/${valorAssistido}`
      : `${urlWithReplacement}/${generateLink()}`;

  const finalUrl = finalValue.replace(/\/+/g, "/");
  //

  async function createLink(data: encurtadorDados) {
    setLoading(true); // Inicia o carregamento
    setProgress(20);
    try {
      const {
        actionId,
        baseUrlId,
        alphabetId,
        redirectUrl,
        replace,
        length,
        qrCode,
      } = data;
      setProgress(50);

      console.log([
        actionId,
        baseUrlId,
        alphabetId,
        redirectUrl,
        replace,
        length,
        qrCode,
      ]);

      // await handleCreateLink({
      //   actionId,
      //   baseUrlId,
      //   alphabetId,
      //   redirectUrl,
      //   replace,
      //   length,
      //   qrCode,
      // });
    } catch (error) {
      console.log("Erro:", error);
    } finally {
      setLoading(false);
      reset();
    }
  }

  return (
    <>
      <div className="pt-[16px] px-8 bg-transparent rounded-md border border-input w-[601px] m-auto">
        {/* <h1 className="text-[14px] w-max m-auto pb-6 max-w-[540px]">
          Utilize o Tracker C para os casos onde você somente possa personalizar
          um parâmetro específico de uma URL fornecida pelo cliente/parceiro,
          não sendo possível utilizar nossas ShortURLs. Para isso, você deve
          definir qual é o parâmetro a ser substituído na "URL destino" e
          selecionar as opções desejadas para a individualização dos links. A
          geração de relatórios só poderá ser feita utilizando a consolidação
          dos dados fornecida pelo cliente/parceiro.
        </h1> */}
        <form onSubmit={handleSubmit(createLink)}>
          <div className="grid grid-cols-4 gap-[12px] max-w-[601px] items-end">
            <div className="col-span-4">
              <p className="uppercase font-bold pb-1 pt-4">Dados da ação:</p>
            </div>
            <div className="col-span-2">
              <div className="flex">
                <Label className="font-semibold">Cliente</Label>
              </div>
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
              <div className="flex">
                <Label className="font-semibold">Campanha</Label>
              </div>
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
              <div className="flex">
                <Label className="font-semibold">LP</Label>
              </div>
              <SelectLP />
            </div>
            <div className="col-span-2">
              <div className="flex">
                <Label className="font-semibold">Ação</Label>
              </div>
              {/* SELECT ACTION */}
              <Controller
                name="actionId"
                control={control}
                render={() => (
                  <Select
                    disabled={!isSelectedCampaign}
                    onValueChange={handleSelectAction}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !isSelectedCampaign
                            ? "Campanha não selecionada"
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
            <div className="flex flex-col col-span-3">
              <div className="flex">
                <Label className="font-semibold" htmlFor="urlFinal">
                  URL de destino
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o endereço (URL) final para onde o click deve ser direcionado."
                />
              </div>
              <Controller
                name="redirectUrl"
                control={control}
                render={() => (
                  <Select
                    onValueChange={handleSelectCampaign}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Selecione a URL de destino"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>URL's</SelectLabel>
                        {finalURL.map((i, index) => (
                          <SelectItem value={i.name} key={index}>
                            {i.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.redirectUrl && (
                <span className="text-xs text-rose-400 font-normal">
                  *Campo obrigatório
                </span>
              )}
            </div>
            <div className="flex flex-col col-span-1">
              <div className="flex">
                <Label htmlFor="parametro" className="font-semibold">
                  Parâmetro
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum soluta inventore cum? Maiores saepe provident aliquid, officiis ad minus, enim veniam neque corporis possimus deleniti, ullam quasi. Eius, dolorem hic?"
                />
              </div>
              <input
                id="parametro"
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
            <div className="col-span-3">
              <div className="flex">
                <Label className="font-semibold">Conversor</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Caso queira gerar uma URL encurtada, é necessário selecionar um conversor. Cada protocolo é compatível com um tipo de conversor diferente. Se não quiser usar um conversor, a plataforma vai simplesmente inserir o dado presente na coluna "A" da planilha enviada para gerar os links de tracking.'
                />
              </div>
              {/* SELECT CONVERSOR */}
              <Controller
                name="alphabetId"
                control={control}
                render={() => (
                  <Select onValueChange={handleSelectConversor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o conversor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Conversores</SelectLabel>
                        <SelectItem value="nenhum">Nenhum</SelectItem>
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
            <div className="flex flex-col col-span-1">
              <div className="flex">
                <Label className="font-semibold">Comprimento</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="É o número de caracteres que o conversor vai utilizar. Quanto maior o comprimento, maior o número de links possíveis de serem gerados sem repetição. (por default, deixar inativo. Somente deixar ativo se o cara escolher um conversor. Colocar na lista, em cada opção, o número de links possíveis de serem gerados)"
                />
              </div>
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
            <div className="flex flex-col col-span-2">
              <div className="flex">
                <Label className="font-semibold" htmlFor="personalizarUrl">
                  TAG
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Se quiser, você pode inserir uma TAG personalizada nas URLs geradas. Experimente preencher o campo e veja em "URL exemplo" uma simulação de como as URLs ficarão.'
                />
              </div>
              <input
                id="personalizarUrl"
                type="text"
                placeholder="/url-personalizada"
                {...register("customPath")}
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
            <div className="flex flex-col col-span-2">
              <div className="flex">
                <Label className="font-semibold">Posição TAG</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='As tags podem ser geradas antes ou depois dos dados convertidos. Veja "URL exemplo" para entender melhor.'
                />
              </div>
              <Controller
                name="conversionPosition"
                control={control}
                defaultValue=""
                render={() => (
                  <Select
                    value={selectedPositionValue}
                    onValueChange={handleSelectedPositionValue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Posição da TAG" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Selecione a posição</SelectLabel>
                        <SelectItem value="pre">Pré Conversor</SelectItem>
                        <SelectItem value="pos">Pós Conversor</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="flex flex-col items-center col-span-4">
              <div className="flex">
                <Label className="font-bold">URL exemplo</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Este é um exemplo de como serão as URLs finais, segundo os parâmetros que você selecionou nos campos acima."
                />
              </div>
              <Input type="text" value={finalUrl} disabled />
            </div>
            <div className="flex flex-col col-span-2">
              <div className="flex">
                <Label className="font-semibold" htmlFor="planilha">
                  Planilha
                </Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content='Carregue a planilha com os dados que você deseja fazer o tracking. É necessário que a planilha siga o arquivo de exemplo. Clique em "download de planilha exemplo" para visualizar.'
                />
              </div>
              <input
                type="file"
                {...register("sheet")}
                className={`cursor-pointer p-1 bg-transparent rounded-md border border-input col-span-4 ${
                  errors.sheet && "border-rose-400 bg-rose-100"
                }"col-span-4"`}
              />
              {errors.sheet && (
                <span className="col-span-4 text-nowrap text-xs text-rose-400 font-normal">
                  {typeof errors.sheet.message === "string"
                    ? errors.sheet.message
                    : ""}
                </span>
              )}
            </div>
            <div className="col-span-1 flex flex-col items-left justify-end">
              <div className="flex">
                <Label>Exemplo</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Baixe uma planilha exemplo."
                />
              </div>
              <Button variant={"outline"} type="button">
                Download
              </Button>
            </div>
            <div className="col-span-1">
              <div className="flex">
                <Label className="font-semibold">Origem Base</Label>
                <TooltipTracker
                  side="right"
                  align="start"
                  content="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                />
              </div>
              {/* SELECT ORIGIN BASE */}
              <Controller
                name="customer"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a Origem Base" />
                    </SelectTrigger>
                    <SelectContent className={`${errors.customer}`}>
                      <SelectGroup>
                        <SelectLabel>Origem Base</SelectLabel>
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
              {/* FINAL SELECT ORIGIN BASE */}
            </div>
            <Controller
              name="qrCode"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-4 col-span-4">
                  <Input
                    id="qrCode"
                    type="checkbox"
                    className="max-w-[16px]"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                  <Label
                    htmlFor="qrCode"
                    className="text-nowrap cursor-pointer"
                  >
                    Gerar QRCode
                  </Label>
                </div>
              )}
            />
          </div>
          <div className="pb-6 text-right mt-8 max-w-[601px]">
            <Button className="w-full" variant="secondary" disabled={loading}>
              <div className="flex items-center gap-2">
                <Send size={18} />
                {loading ? "Enviando..." : "Enviar"}
              </div>
            </Button>
          </div>
        </form>
        {/* ProgressBar */}
        <div className="col-span-4 pb-6">
          {loading && <BarraProgresso value={progress} />}
        </div>
      </div>
    </>
  );
}
