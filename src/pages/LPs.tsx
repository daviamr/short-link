import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertMessage } from "@/components/alert_message";
import { AxiosError } from "axios";
import { api } from "@/services/Api";
import { useAuth } from "@/hook/Auth";
import { DataProps, userDataProps } from "@/interface/auth";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  UserRoundPen,
  UserRoundX,
} from "lucide-react";
import { NovaLP } from "@/components/Modal/NovaLP";

type dataUserProps = { data: DataProps };

export function LPsPage() {
  const { data } = useAuth() as dataUserProps;

  const [userData, setUserData] = useState<userDataProps[]>([]);
  console.log(userData);

  const handleGetUsers = async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${data.jwtToken}`,
        },
      });
      setUserData(response.data);
      console.log(response.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        AlertMessage(error.response.data.message, "error");
      } else {
        AlertMessage(
          "Não foi possível carregar os usuários, tente novamente mais tarde.",
          "error"
        );
      }
    }
  };

  useEffect(() => {
    handleGetUsers();
  }, [data.jwtToken]);

  return (
    <>
      <div>
        <h1 className="flex items-center gap-2 text-4xl border-solid border-b-[6px] w-max m-auto rounded-sm pt-8 mb-8">
          <Laptop size={30} className="animate-pulse"/>
          LPs, Sites e Portais
        </h1>
      </div>
      <div className="flex justify-end border-solid border-y-[1px] py-2 px-4">
        <NovaLP onCreateLP={handleGetUsers} />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {/* <TableHead>
                <Checkbox className="pointer-events-auto"/>
            </TableHead> */}
            <TableHead className="pl-4">LP</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Campanha</TableHead>
            <TableHead>Ações</TableHead>
            <TableHead>Leads</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {/* <TableCell>
                    <Checkbox/>
                </TableCell> */}
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="flex items-center justify-end gap-2 pr-4">
              <Button className="p-2" variant={"outline"}>
                <UserRoundPen size={18} />
              </Button>
              <Button
                className="p-2 duration-300 hover:text-red-700"
                variant={"outline"}
                // onClick={() => handleDeleteCustomer(i.id)}
              >
                <UserRoundX size={18} />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
