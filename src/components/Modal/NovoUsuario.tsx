import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRoundCheck, UserRoundPlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hook/Auth";
import { CreateNewUser } from "@/interface/auth";
import { useState } from "react";

const createUserSchema = z.object({
  name: z.string().min(1, "*Campo obrigatório"),
  email: z.string().min(1, "*Campo obrigatório").email("E-mail invalido."),
  password: z.string().min(4, "*Mínimo de 4 caracteres"),
});

type createUserForm = z.infer<typeof createUserSchema>;
type HandleCreateUsersProps = {
  handleCreateUsers: ({ email, name, password }: CreateNewUser) => void;
};
type createUserProps = {
  onCreateUser: () => void;
};

export function NovoUsuario({ onCreateUser }: createUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { handleCreateUsers } = useAuth() as HandleCreateUsersProps;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<createUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
  });

  async function createUser(data: createUserForm) {
    try {
      const { name, email, password } = data;
      await handleCreateUsers({ name, email, password });
      onCreateUser();
      setIsOpen(false);
      reset();
    } catch (error) {
      console.log("Erro ao criar usuário:", error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" variant={"secondary"}>
          <UserRoundPlus size={18} />
          Criar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-4 border-b-[1px]">
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore
            veritatis ipsa nisi hic at!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(createUser)}>
          <div className="grid grid-cols-4 gap-4 gap-y-6 py-4">
            
            <div className="relative col-span-2">
              <Label htmlFor="username" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Nome
              </Label>

              <Input
                id="username"
                type="text"
                placeholder="Nome do usuário..."
                {...register("name")}
                className={`${errors.name && "border-rose-400"}`}
              />

              {errors.name && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="relative col-span-2">
              <Label htmlFor="password" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">
                Senha
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="Senha do usuário..."
                {...register("password")}
                {...register("password")}
                className={`${
                  errors.password && "border-rose-400"
                }`}
              />

              {errors.password && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="relative col-span-4">
              <Label htmlFor="email" className="absolute px-2 bg-background -top-2 left-1 text-xs font-semibold">E-mail</Label>
              <Input
                type="email"
                placeholder="usuaro@email.com"
                {...register("email")}
                {...register("email")}
                className={`${errors.email && "border-rose-400"}`}
              />

              {errors.email && (
                <span className="text-xs text-rose-400 font-normal">
                  {errors.email.message}
                </span>
              )}
            </div>

          </div>
          <DialogFooter>
            <Button
              className="flex items-center gap-2"
              type="submit"
              variant={"secondary"}
              onClick={() => setIsOpen(true)}
            >
              <UserRoundCheck size={18} />
              Criar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
